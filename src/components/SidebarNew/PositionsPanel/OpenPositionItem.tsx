/**
 * Implements a single item with expand/collapse
 * All interactions passed to parent
 *
 * showSellbackButton - calculated from get-registry, regulates whenever sellback button should be visible
 * allowSellback - fetched from position, regulates whenever it should be active or disabled
 */
import React, { useState } from 'react'
import { t } from 'ttag'
import { IQuote } from '../../../reducers/quotes'
import {
  ButtonIcon,
  LongPositionPanel,
  PositionItemPanel,
  PositionOverlay,
  SellbackButton,
  ShortPositionPanel,
  TradeAmount,
  TradeDetails,
  TradeInfo,
  TradeInfoExpander,
  TradePnl,
} from './styled'
import { Tooltipped } from 'react-md'
import Countdown from './Countdown'
import { DoubleUpIcon, HedgeIcon } from './Icons'
import UILoader from '../../ui/UILoader'
import { IOpenTrade } from '../../../core/interfaces/trades'
import ImageWrapper from '../../ui/ImageWrapper'
import AssetPlaceholder from '../../ChartContainer/InstrumentsBar/asset-placeholder.svg'
import { api } from '../../../core/createAPI'
import UserStorage from '../../../core/UserStorage'
import { LocaleDate } from '../../../core/localeFormatDate'
import ReactTooltip from 'react-tooltip'
import EventEmitter from '../../../core/EventEmitter'

export const dateFormatter = (date: Date | number) => {
  try {
    return LocaleDate.format(date, 'dd-MMM-yyyy HH:mm')
  } catch (err) {
    return date
  }
}

interface IPositionItemProps {
  userID: string | null
  colors: any
  locked: boolean
  selected: boolean
  showSellbackButton: boolean
  quote: IQuote
  position: IOpenTrade
  showOpened: boolean
  formatCurrency: (value: number) => string
  formatStringCurrency: (value: string) => string
  onHedge: () => void
  onDoubleUp: () => void
  onSellBack: (mouseEvent: any) => void
  actionSelectExpiry: (expiry: number | null) => void
  actionRefrechTrades: () => void
  isInGroup: boolean
}

export const getMoneyState = (
  { strike, direction }: IOpenTrade,
  lastPrice: number
): number => (+strike - lastPrice) * direction

/**
 * Different logic than status
 * @param result
 */
export const getMoneyStateString = (result: number) => {
  if (result < 0) {
    return t`In the money`
  } else if (result > 0) {
    return t`Out of the money`
  } else {
    return t`At the money`
  }
}

export const getCfdMoneyStateString = (result: number) => {
  if (result > 0) {
    return t`In the money`
  } else if (result < 0) {
    return t`Out of the money`
  } else {
    return t`Money back`
  }
}

/**
 * String input already contains % sign
 * @param input
 */
export const formatPayout = (input: number | string): string => {
  if (typeof input === 'string') {
    return input
  }
  return `${input}%`
}
/**
 * String input contains formatted value
 * Integer is a timestamp
 */
export const formatExpiryTimestamp = (input: string | number) => {
  if (typeof input === 'string') {
    return input
  }
  return dateFormatter(input)
}
/**
 * Return corresponding color
 * @param moneyState
 * @param colors
 */
export const moneyStateGetColor = (moneyState: number, colors: any) => {
  if (moneyState === 0) {
    return colors.secondaryText
  }
  if (moneyState < 0) {
    return colors.primary
  }
  return colors.secondary
}

export const cfdMoneyStateGetColor = (moneyState: number, colors: any) => {
  if (moneyState === 0) {
    return colors.secondaryText
  }

  if (moneyState > 0) {
    return colors.primary
  }

  return colors.secondary
}

/**
 * Change amount depending on current state
 * @param position
 */
export const getFloatingAmount = (
  position: IOpenTrade,
  result: number
): number => {
  if (result < 0) {
    const amount = position.userCurrencyStake
    const payout = position.payout
    return amount + (amount * payout) / 100
  } else if (result > 0) {
    return 0 // out of the money
  } else {
    return position.userCurrencyStake // at the money
  }
}

const OpenPositionItem = ({
  userID,
  showOpened,
  locked,
  colors,
  position,
  selected,
  quote,
  showSellbackButton,
  formatCurrency,
  onHedge,
  onDoubleUp,
  onSellBack,
  actionSelectExpiry,
  actionRefrechTrades,
  isInGroup,
}: IPositionItemProps) => {
  const [opened, setOpened] = useState<boolean>(showOpened)
  const {
    instrumentName,
    direction,
    instrumentID,
    userCurrencyStake,
    allowSellback,
    expiryTimestamp,
    optionManualCloseAllowed,
  } = position
  const moneyState: number = quote ? getMoneyState(position, quote.last) : -1
  const moneyStateStr: string = getMoneyStateString(moneyState)
  const moneyStateColor = moneyStateGetColor(moneyState, colors)
  const floatingAmount = getFloatingAmount(position, moneyState)

  const isOptionsCfd = !!position.optionValue
  const currentCfdOptionsPnL = Math.max(
    (((quote.last - position.strike) * position.direction) /
      position.optionValue!) *
      position.stake -
      position.stake,
    -1 * position.stake
  )
  const cfdMoneyStateStr = getCfdMoneyStateString(currentCfdOptionsPnL)
  const cfdMoneyStateColor = cfdMoneyStateGetColor(currentCfdOptionsPnL, colors)
  const directionUpText = isOptionsCfd ? t`UP` : t`High`
  const directionDownText = isOptionsCfd ? t`DOWN` : t`Low`
  const directionDecorated =
    direction === 1 ? directionUpText : directionDownText

  const onCloseCfdTrade = (e: any) => {
    e.stopPropagation()

    if (userID) {
      return api
        .closeTrades(
          [[+position.tradeID, +userID]],
          UserStorage.getOneClickTrade() ?? false
        )
        .then(() => {
          actionRefrechTrades()
        })
    }
  }

  const setOpenedPosition = (isOpen: boolean) => {
    setOpened(isOpen)
    if (isOptionsCfd)
      EventEmitter.emit('positionOpened', { position, opened: isOpen })
  }

  return (
    <PositionItemPanel
      colors={colors}
      opened={opened}
      isInGroup={isInGroup}
      selected={selected}
      onClick={() => actionSelectExpiry(expiryTimestamp)}
    >
      {locked && (
        <PositionOverlay>
          <UILoader colors={colors} />
        </PositionOverlay>
      )}
      <ShortPositionPanel
        colors={colors}
        opened={opened}
        onClick={() => setOpenedPosition(!opened)}
      >
        <ImageWrapper
          alt={`instrument ${instrumentID}`}
          src={`${process.env.PUBLIC_URL}/static/icons/instruments/${instrumentID}.svg`}
          placeholderSrc={AssetPlaceholder}
        />
        <TradeInfo>
          <TradeDetails
            colors={colors}
            out_money={currentCfdOptionsPnL < 0}
            out_money2={moneyStateColor > 0}
            noOpen={'tradebox'}
          >
            <span className="trade__asset_name">{instrumentName}</span>
            <span className="trade__direction">
              <b
                style={{
                  color: direction > 0 ? colors.primary : colors.secondary,
                }}
              >
                {directionDecorated}
              </b>{' '}
              {formatCurrency(userCurrencyStake)}
            </span>
            <span
              className="trade__money"
              style={{
                color: isOptionsCfd ? cfdMoneyStateColor : moneyStateColor,
              }}
            >
              {isOptionsCfd ? cfdMoneyStateStr : moneyStateStr}
            </span>
          </TradeDetails>

          <TradeAmount
            color={isOptionsCfd ? cfdMoneyStateColor : moneyStateColor}
          >
            <TradePnl
              color={isOptionsCfd ? cfdMoneyStateColor : moneyStateColor}
            >
              <span>
                {formatCurrency(
                  isOptionsCfd ? currentCfdOptionsPnL : floatingAmount
                )}
              </span>
            </TradePnl>
            <Countdown
              created={position.createdTimestamp}
              expiry={position.expiryTimestamp}
              moneyState={isOptionsCfd ? currentCfdOptionsPnL : moneyState}
              colors={colors}
            />
          </TradeAmount>
        </TradeInfo>

        <TradeInfoExpander
          colors={colors}
          opened={opened}
          onClick={() => setOpenedPosition(!opened)}
        />
      </ShortPositionPanel>
      {opened && (
        <LongPositionPanel colors={colors}>
          <div onClick={() => setOpenedPosition(false)}>
            <div className="line">
              <div>{t`Trade time`}</div>
              <span>{dateFormatter(position.createdTimestamp)}</span>
            </div>
            <div className="line">
              <div>{t`Expiry time`}</div>
              <span>{formatExpiryTimestamp(position.expiryTimestamp)}</span>
            </div>
            <div className="line">
              <div>{t`Trade ID`}</div>
              <span>{position.tradeID}</span>
            </div>
            <div className="line">
              <div>{t`Strike`}</div>
              <span>{position.strike}</span>
            </div>
            {!isOptionsCfd && quote && (
              <div className="line">
                <div>{t`Current Price`}</div>
                <span>{quote.last}</span>
              </div>
            )}
            <div className="line">
              <div>{t`Investment`}</div>
              <span>{formatCurrency(position.userCurrencyStake)}</span>
            </div>
            {!isOptionsCfd && (
              <div className="line">
                <div>{t`Payout`}</div>
                <span>{formatPayout(position.payout)}</span>
              </div>
            )}
            {isOptionsCfd && (
              <div className="line">
                <div>{t`Current PnL`}</div>
                <span>{formatCurrency(currentCfdOptionsPnL)}</span>
              </div>
            )}
          </div>
          {isOptionsCfd && optionManualCloseAllowed === 1 && (
            <div className="trade_line">
              <Tooltipped id="cancel-trade-icon-tooltip" tooltip="Close Trade">
                <SellbackButton
                  colors={colors}
                  onClick={onCloseCfdTrade}
                >{t`Close Trade`}</SellbackButton>
              </Tooltipped>
            </div>
          )}
          {!isOptionsCfd && (
            <div className="trade_line">
              {showSellbackButton && (
                <div data-tip="" data-for={'sellback-icon-tooltup'}>
                  <SellbackButton
                    colors={colors}
                    style={{
                      opacity: allowSellback ? 1.0 : 0.5,
                    }}
                    onClick={allowSellback ? onSellBack : () => {}}
                  >{t`Sell back`}</SellbackButton>

                  <ReactTooltip
                    id={'sellback-icon-tooltup'}
                    place="top"
                    className="react-tooltip-small"
                  >
                    {t`Sellback`}
                  </ReactTooltip>
                </div>
              )}
              <div data-tip="" data-for={'hedge-icon-tooltup'}>
                <ButtonIcon>
                  <HedgeIcon
                    primary={colors.primary}
                    style={{ 'margin-right': '7px' }}
                    onClick={onHedge}
                  />
                </ButtonIcon>
                <ReactTooltip
                  id={'hedge-icon-tooltup'}
                  place="top"
                  className="react-tooltip-small"
                >
                  {t`Hedge`}
                </ReactTooltip>
              </div>
              <div data-tip="" data-for={'double-up-icon-tooltup'}>
                <ButtonIcon>
                  <DoubleUpIcon
                    primary={colors.primary}
                    style={{ 'margin-right': '7px' }}
                    onClick={onDoubleUp}
                  />
                </ButtonIcon>
                <ReactTooltip
                  id={'double-up-icon-tooltup'}
                  place="top"
                  className="react-tooltip-small"
                >
                  {t`Double Up`}
                </ReactTooltip>
              </div>
            </div>
          )}
        </LongPositionPanel>
      )}
    </PositionItemPanel>
  )
}

export default OpenPositionItem
