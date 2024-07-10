import React, { useEffect, useState } from 'react'
import { t } from 'ttag'
import { connect } from 'react-redux'
import { round } from 'lodash'
import { ThemeContextConsumer } from '../../../ThemeContext'
import {
  PositionOverlay,
  InfoContainer,
  DataContainer,
  DataRow,
  RowLabel,
  RowValue,
  SellBackContainer,
  SellBackButton,
} from './styled'
import { IOpenTrade } from '../../../../core/interfaces/trades'
import { IQuote } from '../../../../reducers/quotes'
import {
  getMoneyState,
  getMoneyStateString,
} from '../../../Sidebar/PositionsPanel/OpenPositionItem'
import {
  actionDoSellback,
  actionRefrechTrades,
} from '../../../../actions/trades'
import { formatCurrency } from '../../../selectors/currency'
import { api } from '../../../../core/createAPI'
import CircularProgress from '../Sentiment/CircularProgress'
import UILoader from '../../../ui/UILoader'
import {
  actionShowNotification,
  NotificationTypes,
} from '../../../../actions/notifications'
import { ITradeNotificationErrorProps } from '../../../notifications/TradeSubmit/interfaces'
import { isCfdOptionsProductType } from '../../../selectors/trading'
import UserStorage from '../../../../core/UserStorage'
import { IUserInfo } from '../../../../core/API'

const { getSellbackAmount } = api

interface IPositionInfoProps {
  trade: IOpenTrade
  quote: IQuote
  timeleft: number
  x: number
  y: number
  isCfdOptions: boolean
  userInfo: IUserInfo
  formatCurrency: (value: any) => string
  actionDoSellback: (trade: any, amount: number) => void
  onClose: () => void
  actionRefrechTrades: () => void
}

const PositionInfo = ({
  trade,
  quote,
  timeleft,
  x,
  y,
  isCfdOptions,
  userInfo,
  formatCurrency,
  onClose,
  actionDoSellback,
  actionRefrechTrades,
}: IPositionInfoProps) => {
  const [amount, setAmount] = useState<number | null>(null)
  const [seconds, setSeconds] = useState(timeleft)

  const { stake, payout, direction, tradeID, optionManualCloseAllowed } = trade
  const moneyState: number = quote ? getMoneyState(trade, quote.last) : -1
  const moneyStateStr: string = getMoneyStateString(moneyState)

  const currentCfdOptionsPnL = Math.max(
    (((quote.last - trade.strike) * trade.direction) / trade.optionValue!) *
      trade.stake -
      trade.stake,
    -1 * trade.stake
  )
  /**
   * Call sellback in saga
   */
  const onSellBack = () => {
    if (amount) {
      actionDoSellback(
        {
          tradeID,
          stake,
        },
        amount
      )
      onClose()
    }
  }

  const onCloseTrade = () => {
    return api
      .closeTrades(
        [[+trade.tradeID, +userInfo.userID]],
        UserStorage.getOneClickTrade() ?? false
      )
      .then(() => {
        onClose()
        actionRefrechTrades()
      })
  }

  if (seconds <= 0) {
    onClose()
  }

  useEffect(() => {
    if (amount) {
      let interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [amount])

  useEffect(() => {
    if (!isCfdOptions) {
      getSellbackAmount(String(trade.tradeID))
        .then((response) => {
          if (response.success) {
            setAmount(response.amount)
          } else {
            actionShowNotification<ITradeNotificationErrorProps>(
              NotificationTypes.TRADE_SUBMITTED_ERROR,
              {
                success: false,
                message: response.message,
              }
            )
            onClose()
          }
        })
        .catch((err) => {
          console.warn('Could not get sellback amount', err)
          onClose()
        })
    }
  }, [trade])

  if ((trade as any).isClosed) {
    return null
  }

  return (
    <ThemeContextConsumer>
      {(colors: any) => (
        <InfoContainer colors={colors} x={x} y={y} direction={direction}>
          {!isCfdOptions && !amount && (
            <PositionOverlay>
              <UILoader
                colors={colors}
                width={'100px'}
                height={'100px'}
                fill={
                  direction === 1
                    ? colors.chart.tradeInfo.high.backgroundColor
                    : colors.chart.tradeInfo.low.backgroundColor
                }
              />
            </PositionOverlay>
          )}
          <DataContainer>
            {!isCfdOptions && (
              <DataRow colors={colors} direction={direction}>
                <RowLabel colors={colors}>{moneyStateStr}</RowLabel>
                <RowValue colors={colors} direction={direction}>
                  {formatCurrency(stake)}
                </RowValue>
              </DataRow>
            )}
            {!isCfdOptions && (
              <DataRow colors={colors} direction={direction}>
                <RowLabel colors={colors}>{t`Payout`}</RowLabel>
                <RowValue colors={colors} direction={direction}>
                  {payout}%
                </RowValue>
              </DataRow>
            )}
            {!isCfdOptions && (
              <DataRow
                className="highlight"
                colors={colors}
                direction={direction}
              >
                <RowLabel
                  className="title"
                  colors={colors}
                >{t`Return on sell`}</RowLabel>
                <RowValue
                  className="value"
                  colors={colors}
                  direction={direction}
                >
                  {formatCurrency(amount)}
                </RowValue>
              </DataRow>
            )}

            {isCfdOptions && (
              <DataRow colors={colors} direction={direction}>
                <RowLabel colors={colors}>{t`Breakeven (1x)`}</RowLabel>
                <RowValue colors={colors} direction={direction}>
                  {round(
                    direction === 1
                      ? trade.strike + (trade.optionValue ?? 0)
                      : trade.strike - (trade.optionValue ?? 0),
                    4
                  )}
                </RowValue>
              </DataRow>
            )}

            {isCfdOptions && (
              <DataRow colors={colors} direction={direction}>
                <RowLabel colors={colors}>{t`Money doubled (2x)`}</RowLabel>
                <RowValue colors={colors} direction={direction}>
                  {round(trade.strike + 2 * (trade.optionValue ?? 0), 4)}
                </RowValue>
              </DataRow>
            )}

            {isCfdOptions && (
              <DataRow
                className="highlight"
                colors={colors}
                direction={direction}
              >
                <RowLabel
                  className="title"
                  colors={colors}
                >{t`Open PnL`}</RowLabel>
                <RowValue
                  className="value"
                  colors={colors}
                  direction={direction}
                >
                  {formatCurrency(currentCfdOptionsPnL)}
                </RowValue>
              </DataRow>
            )}
          </DataContainer>
          {((isCfdOptions && optionManualCloseAllowed === 1) ||
            !isCfdOptions) && (
            <SellBackContainer>
              {!isCfdOptions && (
                <CircularProgress
                  value={(seconds / timeleft) * 100}
                  filledColor={colors.secondary}
                  normalColor="transparent"
                  size={30}
                  text={String(seconds)}
                  textColor={colors.primaryText}
                  thickness={1}
                />
              )}
              <SellBackButton
                onClick={isCfdOptions ? onCloseTrade : onSellBack}
                colors={colors}
                direction={direction}
              >
                {isCfdOptions ? t`Close Trade` : t`Sell back`}
              </SellBackButton>
            </SellBackContainer>
          )}
        </InfoContainer>
      )}
    </ThemeContextConsumer>
  )
}

const mapStateToProps = (state: any) => ({
  formatCurrency: formatCurrency(state),
  isCfdOptions: isCfdOptionsProductType(state),
  userInfo: state.account.userInfo,
})

export default connect(mapStateToProps, {
  actionDoSellback,
  actionRefrechTrades,
})(PositionInfo)
