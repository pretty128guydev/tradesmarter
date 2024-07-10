/**
 * Render Groups of items than items
 */
import React from 'react'
import { connect } from 'react-redux'
import { SIDEBAR_WIDTH } from '..'
import { IOpenTrade } from '../../../../core/interfaces/trades'
import {
  formatCurrency,
  formatStringCurrency,
} from '../../../selectors/currency'
import { getPositionGroups } from '../../../selectors/positions'
import OpenPositionItem from '../OpenPositionItem'
import ItemsGroup from './ItemsGroup'
import { actionSelectExpiry } from '../../../../actions/expiry'
import {
  actionTradeSellBack,
  actionTradeHedge,
  actionTradeDoubleUp,
  actionRefrechTrades,
} from '../../../../actions/trades'
import { ITradeOperationsConfig, IUserInfo } from '../../../../core/API'

/**
 * Split group into two types of items:
 * a) Groups with few items - show them as a Groups
 * b) Group with one item - show them as items
 */
const chunkify = (input: any[]) => {
  const groups: any[] = []
  const items: any[] = []

  input.forEach((chunk: any[]) => {
    if (chunk.length > 1) {
      groups.push(chunk)
    } else {
      if (chunk[0]) {
        items.push(chunk[0])
      }
    }
  })
  return [groups, items]
}

interface IGroupOpenPositionsProps {
  expiry: number | null
  groups: any[]
  tradeOperationsConfig: ITradeOperationsConfig
  isMobile: boolean
  colors: any
  quotes: any
  lockedTrades: any
  formatCurrency: (value: number) => string
  formatStringCurrency: (value: string) => string
  actionTradeSellBack: any
  actionTradeHedge: any
  actionTradeDoubleUp: any
  userInfo: IUserInfo
  actionSelectExpiry: (expiry: number | null) => void
  actionRefrechTrades: () => void
}
const GroupOpenPositions = (props: IGroupOpenPositionsProps) => {
  const { expiry } = props
  const [groups, items] = chunkify(props.groups)

  const { sellbackInstruments, doubleupInstruments } =
    props.tradeOperationsConfig

  /**
   * Left figure out position of element by click
   * @param mouseEvent
   * @param positionInstrument
   * @param position
   */
  const onSellBack = (
    mouseEvent: any,
    positionInstrument: any,
    position: IOpenTrade
  ) => {
    if (sellbackInstruments.includes(positionInstrument)) {
      if (props.isMobile) {
        props.actionTradeSellBack(position, 10, 120)
      } else {
        const { nativeEvent } = mouseEvent
        const { target } = nativeEvent
        const sidebarElement = target.closest('.sidebar__panel')
        if (sidebarElement) {
          const rect = sidebarElement.getBoundingClientRect()
          const { left, top } = rect
          props.actionTradeSellBack(position, left + SIDEBAR_WIDTH, top)
        } else {
          props.actionTradeSellBack(
            position,
            window.innerWidth / 2,
            window.innerHeight / 2
          )
        }
      }
    }
  }

  /**
   * Check if current expiry is selected
   * @param expiry
   * @returns boolean
   */
  const expirySelected = (ts: number): boolean =>
    expiry ? ts === expiry : false

  return (
    <>
      {groups.map((group: IOpenTrade[], index: number) => (
        <ItemsGroup
          colors={props.colors}
          selected={expirySelected(group[0].expiryTimestamp)}
          key={index}
          group={group}
          formatCurrency={props.formatCurrency}
        >
          {group.map((position: IOpenTrade, index: number) => {
            const positionInstrument = String(position.instrumentID)
            return (
              <OpenPositionItem
                userID={props.userInfo.userID}
                isInGroup={true}
                locked={props.lockedTrades.includes(position.tradeID)}
                colors={props.colors}
                key={index}
                formatCurrency={props.formatCurrency}
                formatStringCurrency={props.formatStringCurrency}
                showOpened={false}
                selected={true}
                position={position}
                quote={props.quotes[position.instrumentID]}
                showSellbackButton={sellbackInstruments.includes(
                  positionInstrument
                )}
                onSellBack={(mEvent: any) =>
                  onSellBack(mEvent, positionInstrument, position)
                }
                onHedge={() => props.actionTradeHedge(position)}
                onDoubleUp={() =>
                  doubleupInstruments.includes(positionInstrument) &&
                  props.actionTradeDoubleUp(position)
                }
                actionSelectExpiry={() => {}}
                actionRefrechTrades={props.actionRefrechTrades}
              />
            )
          })}
        </ItemsGroup>
      ))}
      {items.map((position: IOpenTrade, index: number) => {
        const positionInstrument = String(position.instrumentID)
        return (
          <OpenPositionItem
            userID={props.userInfo?.userID}
            isInGroup={false}
            locked={props.lockedTrades.includes(position.tradeID)}
            colors={props.colors}
            key={index}
            formatCurrency={props.formatCurrency}
            formatStringCurrency={props.formatStringCurrency}
            showOpened={index === 0}
            selected={expirySelected(position.expiryTimestamp)}
            position={position}
            quote={props.quotes[position.instrumentID]}
            showSellbackButton={sellbackInstruments.includes(
              positionInstrument
            )}
            onSellBack={(mEvent: any) =>
              onSellBack(mEvent, positionInstrument, position)
            }
            onHedge={() => props.actionTradeHedge(position)}
            onDoubleUp={() =>
              doubleupInstruments.includes(positionInstrument) &&
              props.actionTradeDoubleUp(position)
            }
            actionSelectExpiry={props.actionSelectExpiry}
            actionRefrechTrades={props.actionRefrechTrades}
          />
        )
      })}
    </>
  )
}

const mapStateToProps = (state: any) => ({
  expiry: state.expiry.selected,
  groups: getPositionGroups(state),
  colors: state.theme,
  trades: state.trades,
  lockedTrades: state.trading.locked,
  quotes: state.quotes,
  tradeOperationsConfig: state.registry.data.tradeOperationsConfig,
  formatCurrency: formatCurrency(state),
  formatStringCurrency: formatStringCurrency(state),
  userInfo: state.account.userInfo,
})

export default connect(mapStateToProps, {
  actionSelectExpiry,
  actionTradeSellBack,
  actionTradeHedge,
  actionTradeDoubleUp,
  actionRefrechTrades,
})(GroupOpenPositions)
