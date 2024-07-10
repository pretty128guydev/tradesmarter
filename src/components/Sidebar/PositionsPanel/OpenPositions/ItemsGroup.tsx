/**
 * Implements a group of items
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { t } from 'ttag'
import { IOpenTrade } from '../../../../core/interfaces/trades'
import { QuotesMap } from '../../../../reducers/quotes'
import { datesAreOnSameDay } from '../../../TradeBox/ExpirySelect'
import Countdown from '../Countdown'
import {
  getFloatingAmount,
  getMoneyState,
  moneyStateGetColor,
} from '../OpenPositionItem'
import { actionSelectExpiry } from '../../../../actions/expiry'
import { TradeAmount, TradeInfoExpander, TradePnl } from '../styled'
import { LocaleDate } from '../../../../core/localeFormatDate'

const ItemGroupPanel = styled.div<{
  noOpen: any
  colors: any
  selected: boolean
}>`
  margin-bottom: 6px;
  width: ${(props) => (props.noOpen === 'tradebox' ? '47%' : '100%')};
  min-width: ${(props) => (props.noOpen === 'tradebox' ? '206px' : '')};
  margin-right: ${(props) => (props.noOpen === 'tradebox' ? '2%' : '')};
  margin-bottom: ${(props) => (props.noOpen === 'tradebox' ? '10px' : '4px')};
  margin-top: ${(props) => (props.noOpen === 'tradebox' ? '10px' : '')};
  .title_line {
    display: flex;
    width: 100%;
    height: ${(props) => (props.noOpen === 'tradebox' ? '51px' : '43px')};
    padding: ${(props) => (props.noOpen === 'tradebox' ? '0px 4px' : 'none')};
    box-sizing: border-box;
    position: relative;
    border-radius: ${(props) => (props.noOpen === 'tradebox' ? '8px' : 'none')};
    background-color: ${(props) =>
      props.noOpen === 'tradebox'
        ? props.colors.tradebox.fieldBackground
        : props.colors.expiryGroupBackground};
    ${(props) =>
      props.noOpen !== 'tradebox' && props.selected
        ? `outline: 1px solid ${props.colors.primary};`
        : ''}

    &:before {
      content: '';
      height: 100%;
      background-color: ${(props) =>
        props.noOpen !== 'tradebox' && props.selected
          ? props.colors.primary
          : props.colors.background};
      border-radius: ${(props) =>
        props.noOpen === 'tradebox' ? '0px' : '4px'};
    }

    &:hover {
      outline: ${(props) =>
        props.selected ? '' : `1px solid ${props.colors.primary}`};
    }

    .expiry_time {
      flex: 1 1 auto;
      position: relative;
      text-align: left;

      .primary__label {
        position: absolute;
        top: 6px;
        left: 7px;
        font-weight: 500;
        font-size: 16px;
        color: ${(props) => props.colors.primaryText};
      }
      .expiry_count {
        display: inline-block;
        margin-left: 10px;
        width: 18px;
        height: 18px;
        box-sizing: border-box;
        line-height: 18px;
        text-align: center;
        border: 1px solid ${(props) => props.colors.primary};
        border-radius: 50%;
        font-weight: bold;
        font-size: 12px;
        letter-spacing: -0.2px;
        color: ${(props) => props.colors.primary};
      }
      span {
        position: absolute;
        top: 25px;
        left: 7px;
        font-size: 10px;
        letter-spacing: 0.00641px;
        color: #66707a;
      }
    }

    .total_pnl {
      flex: 1 1 auto;
      position: relative;
      div {
        position: absolute;
        top: 6px;
        right: 10px;
        font-weight: 500;
        font-size: 16px;
        color: ${(props) => props.colors.primary};
      }
      span {
        position: absolute;
        top: 25px;
        right: 10px;
        font-size: 10px;
        letter-spacing: 0.00641px;
        color: #66707a;
      }
    }
  }

  .items_group {
    display: block;
  }
`
interface IItemsGroupsProps {
  selected: boolean
  noOpen?: string
  colors: any
  quotes: QuotesMap
  group: IOpenTrade[]
  formatCurrency: (currency: number) => string
  actionSelectExpiry: (expiry: any) => void
  children: any
  setActive?: () => void
}

/**
 * Calculate PnL for single trade
 * @param position
 * @param lastPrice
 * @returns
 */
const calculatePnl = (position: IOpenTrade, lastPrice: number): number => {
  const moneyState: number = lastPrice ? getMoneyState(position, lastPrice) : -1
  return getFloatingAmount(position, moneyState)
}

/**
 * We pass all the quotes because trades could be from different instruments
 * @param group - group of trades
 * @param quotes - quotes state
 * @returns
 */
const calculateTotalPnl = (group: IOpenTrade[], quotes: QuotesMap) => {
  let summ = 0
  group.forEach((item: IOpenTrade) => {
    if (quotes[item.instrumentID]) {
      const lastPrice = quotes[item.instrumentID].last
      if (lastPrice) {
        const pnl = calculatePnl(item, lastPrice)
        summ += pnl
      }
    }
  })
  return summ
}

/**
 * Get a money state for a single position
 * @param position
 * @param quotes
 * @returns
 */
const getPositionMoneyState = (position: IOpenTrade, quotes: QuotesMap) => {
  const lastPrice = quotes[position.instrumentID]?.last
  if (lastPrice) {
    return lastPrice ? getMoneyState(position, lastPrice) : -1
  }
  return -1
}
/**
 * Format timestamp
 * @param timestamp
 * @returns
 */
const formatExpiryTime = (timestamp: Date) => {
  if (datesAreOnSameDay(timestamp, new Date())) {
    return LocaleDate.format(timestamp as Date, 'HH:mm') // 10:23
  } else {
    return LocaleDate.format(timestamp as Date, 'LLL-d') // Feb-26
  }
}

const ItemsGroup = (props: IItemsGroupsProps) => {
  const [onSelected, setonSelected] = useState<boolean>(props.selected)
  const [firstTrade] = props.group
  const { expiryTimestamp } = firstTrade
  const expiriesCount = props.group.length
  const totalPnl = calculateTotalPnl(props.group, props.quotes)
  const moneyState = getPositionMoneyState(firstTrade, props.quotes)
  const moneyStateColor = moneyStateGetColor(moneyState, props.colors)

  const setOpen = (selected: boolean) => {
    setonSelected(!selected)
  }

  return (
    <ItemGroupPanel
      noOpen={props.noOpen}
      colors={props.colors}
      selected={props.selected}
    >
      <div
        className="title_line"
        onClick={() => {
          setOpen(onSelected)
          props.actionSelectExpiry(!props.selected ? expiryTimestamp : null)
          props.setActive && props.setActive()
        }}
      >
        <div className="expiry_time">
          <div className="primary__label">
            {formatExpiryTime(new Date(expiryTimestamp))}
            <div className="expiry_count">{expiriesCount}</div>
          </div>
          <span className="secondary_label">{t`Expiry time`}</span>
        </div>

        <TradeAmount color={moneyStateColor}>
          <TradePnl color={moneyStateColor}>
            <span>{props.formatCurrency(totalPnl)}</span>
            <span className="label">{t`Total P&L`}</span>
          </TradePnl>
          <Countdown
            created={firstTrade.createdTimestamp}
            expiry={expiryTimestamp}
            moneyState={moneyState}
            colors={props.colors}
          />
        </TradeAmount>
        {props.noOpen !== 'tradebox' && (
          <TradeInfoExpander colors={props.colors} opened={props.selected} />
        )}
      </div>
      {onSelected && <div className="items_group">{props.children}</div>}
    </ItemGroupPanel>
  )
}

const mapStateToProps = (state: any) => ({ quotes: state.quotes })

export default connect(mapStateToProps, {
  actionSelectExpiry,
})(ItemsGroup)
