/**
 * Closed position item, uses different fields
 */
import React, { useEffect, useState } from 'react'
import { t } from 'ttag'
import { round } from 'lodash'
import {
  LongPositionPanel,
  PositionItemPanel,
  ShortPositionPanel,
  TradeAmount,
  TradeDetails,
  TradeInfo,
  TradeInfoExpander,
  TradePnl,
} from './styled'
import { IClosedTrade } from '../../../core/interfaces/trades'
import ImageWrapper from '../../ui/ImageWrapper'
import AssetPlaceholder from '../../ChartContainer/InstrumentsBar/asset-placeholder.svg'
import {
  cfdMoneyStateGetColor,
  getCfdMoneyStateString,
} from './OpenPositionItem'
import { LocaleDate } from '../../../core/localeFormatDate'

interface IPositionItemProps {
  isOpen: boolean
  colors: any
  selected: boolean
  position: IClosedTrade
  formatCurrency: (value: number) => string
  formatStringCurrency: (value: string | number) => string
}

const formatTimestamp = (date: number) => {
  try {
    return LocaleDate.format(date, 'dd-MMM-yyyy HH:mm')
  } catch (err) {
    return date
  }
}

const getClosedMoneyStateString = (result: number) => {
  switch (result) {
    case 1:
      return t`In the money`
    case 0:
      return t`At the money`
    case -1:
      return t`Out of the money`
    case 2:
      return t`At the money`
    case 3:
      return t`Sold back`
    default:
      return ''
  }
}

/**
 * String input already contains % sign
 * @param input
 */
const formatPayout = (input: number | string): string => {
  if (typeof input === 'string') {
    return input
  }
  return `${input}%`
}

export const moneyStatusColors = (status: number, colors: any) => {
  switch (status) {
    case 2:
      return colors.secondarySubText
    case 0:
      return colors.secondarySubText
    case 3:
      return colors.secondarySubText
    case 1:
      return colors.primary
    case -1:
      return colors.secondary
  }
}

const ClosedPositionItem = ({
  isOpen,
  colors,
  position,
  selected,
  formatStringCurrency,
}: IPositionItemProps) => {
  const [opened, setOpened] = useState<boolean>(!!isOpen)

  useEffect(() => {
    setOpened(isOpen)
  }, [isOpen])

  const { instrumentName, direction, instrumentID, userCurrencyStake, status } =
    position

  const isOptionCfd = !!position.optionValue
  const upDirectionTitle = isOptionCfd ? t`Up` : t`High`
  const downDirectionTitle = isOptionCfd ? t`Down` : t`Low`
  const directionDecorated =
    direction === 1 ? upDirectionTitle : downDirectionTitle
  /**
   * Status
   * 1 - in the money
   * 0 - At the money
   * -1 - Out of the money
   */
  const moneyStateStr: string = getClosedMoneyStateString(Number(status))
  const moneyStateColor = moneyStatusColors(Number(status), colors)

  const positionReturn = round(
    position.userCurrencyReturn - (isOptionCfd ? position.stake : 0),
    4
  )

  const cfdMoneyStateStr = getCfdMoneyStateString(positionReturn)
  const cfdMoneyStateColor = cfdMoneyStateGetColor(positionReturn, colors)

  return (
    <PositionItemPanel
      colors={colors}
      opened={opened}
      selected={selected}
      isInGroup={false}
      noOpen={''}
    >
      <ShortPositionPanel
        colors={colors}
        opened={opened}
        onClick={() => setOpened(!opened)}
      >
        <ImageWrapper
          alt={`instrument ${instrumentID}`}
          src={`${process.env.PUBLIC_URL}/static/icons/instruments/${instrumentID}.svg`}
          placeholderSrc={AssetPlaceholder}
        />

        <TradeInfo>
          <TradeDetails colors={colors}>
            <span className="trade__asset_name">{instrumentName}</span>
            <span className="trade__direction">
              <b
                style={{
                  color: direction > 0 ? colors.primary : colors.secondary,
                }}
              >
                {directionDecorated}
              </b>{' '}
              {formatStringCurrency(userCurrencyStake)}
            </span>
            <span
              className="trade__money"
              style={{
                color: isOptionCfd ? cfdMoneyStateColor : moneyStateColor,
              }}
            >
              {isOptionCfd ? cfdMoneyStateStr : moneyStateStr}
            </span>
          </TradeDetails>

          <TradeAmount
            color={isOptionCfd ? cfdMoneyStateColor : moneyStateColor}
          >
            <TradePnl
              color={isOptionCfd ? cfdMoneyStateColor : moneyStateColor}
            >
              <span>{formatStringCurrency(positionReturn)}</span>
            </TradePnl>
          </TradeAmount>
        </TradeInfo>

        <TradeInfoExpander
          colors={colors}
          opened={opened}
          onClick={() => setOpened(!opened)}
        />
      </ShortPositionPanel>
      {opened && (
        <LongPositionPanel colors={colors} onClick={() => setOpened(false)}>
          <div className="line">
            <div>{t`Trade time`}</div>
            <span>{formatTimestamp(position.createdTimestamp)}</span>
          </div>
          <div className="line">
            <div>{t`Expiry time`}</div>
            <span>{formatTimestamp(position.expiryTimestamp)}</span>
          </div>
          <div className="line">
            <div>{t`Trade ID`}</div>
            <span>{position.tradeID}</span>
          </div>
          <div className="line">
            <div>{t`Strike Price`}</div>
            <span>{position.strike}</span>
          </div>
          <div className="line">
            <div>{t`Closed Price`}</div>
            <span>{position.closedPrice}</span>
          </div>
          <div className="line">
            <div>{t`Investment`}</div>
            <span>{formatStringCurrency(position.userCurrencyStake)}</span>
          </div>
          {!isOptionCfd && (
            <div className="line">
              <div>{t`Payout`}</div>
              <span>{formatPayout(position.payout)}</span>
            </div>
          )}
          <div className="line">
            <div>{t`Return`}</div>
            <span>{formatStringCurrency(positionReturn)}</span>
          </div>
          {!isOptionCfd && (
            <div className="line">
              <div>{t`Status`}</div>
              <span style={{ color: moneyStateColor }}>{moneyStateStr}</span>
            </div>
          )}
        </LongPositionPanel>
      )}
    </PositionItemPanel>
  )
}

export default ClosedPositionItem
