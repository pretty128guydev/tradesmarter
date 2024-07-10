/**
 * Implements a linear list of positions
 */
import React from 'react'
import { SIDEBAR_WIDTH } from '..'
import { connect } from 'react-redux'
import {
	actionTradeSellBack,
	actionTradeHedge,
	actionTradeDoubleUp,
	actionRefrechTrades,
} from '../../../../actions/trades'
import {
	formatCurrency,
	formatStringCurrency,
} from '../../../selectors/currency'
import OpenPositionItem from '../OpenPositionItem'
import { IOpenTrade } from '../../../../core/interfaces/trades'
import { actionSelectExpiry } from '../../../../actions/expiry'

const OpenPositionsList = (props: any) => {
	const { expiry } = props
	const {
		sellbackInstruments,
		doubleupInstruments,
	} = props.tradeOperationsConfig

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
					props.actionTradeSellBack(
						position,
						left + SIDEBAR_WIDTH,
						top
					)
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

	return props.trades.open.map((position: IOpenTrade, index: number) => {
		const positionInstrument = String(position.instrumentID)
		return (
			<OpenPositionItem
				userID={props.userInfo.userID}
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
	})
}

const mapStateToProps = (state: any) => ({
	expiry: state.expiry.selected,
	colors: state.theme,
	trades: state.trades,
	selectedInstrument: Number(state.trading.selected),
	lockedTrades: state.trading.locked,
	quotes: state.quotes,
	tradeOperationsConfig: state.registry.data.tradeOperationsConfig,
	formatCurrency: formatCurrency(state),
	formatStringCurrency: formatStringCurrency(state),
	userInfo: state.account.userInfo,
})

export default connect(mapStateToProps, {
	actionTradeSellBack,
	actionTradeHedge,
	actionTradeDoubleUp,
	actionSelectExpiry,
	actionRefrechTrades,
})(OpenPositionsList)
