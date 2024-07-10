/**
 * Implements a Sidebar component with Tabs
 * Handles interaction
 * Single position item located in PositionItem
 */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { isNil } from 'lodash'
import Tabs from '../../ui/Tabs'
import {
	actionTradeSellBack,
	actionTradeHedge,
	actionTradeDoubleUp,
	actionLoadMoreClosedTradesRequest,
} from '../../../actions/trades'
import { ITradesState } from '../../../reducers/trades'
import { SidebarCaption } from '..'
import { PositionsListPanel, ClosedPositionsScroller } from './styled'
import Placeholder from './Placeholder'
import { formatCurrency, formatStringCurrency } from '../../selectors/currency'
import ClosedPositionItem from './ClosedPositionItem'
import './animation.css'
import CloseButton from '../CloseBtn'
import { IClosedTrade, IOpenTrade } from '../../../core/interfaces/trades'
import GroupOpenPositions from './OpenPositions/GroupOpenPositions'
import SidebarContentsPanel from '../SidebarContentsPanel'

interface IPositionsPanel {
	colors: any
	isMobile: boolean
	trades: ITradesState
	selectedTrade: any
	selectedInstrument: number | null
	formatCurrency: any
	canLoadMore: boolean
	onClose: () => void
	sidebarProps: any
	formatStringCurrency: (value: string | number) => string
	actionTradeSellBack: (trade: IOpenTrade, x: number, y: number) => void
	actionTradeHedge: (trade: IOpenTrade) => void
	actionTradeDoubleUp: (trade: IOpenTrade) => void
	actionLoadMoreClosedTradesRequest: () => void
}

export const SIDEBAR_WIDTH = 364 // 302 + 62

const PositionsPanel = (props: IPositionsPanel) => {
	const activeTab =
		props.sidebarProps?.tab ||
		Number(props.selectedTrade && !isNil(props.selectedTrade.closedPrice))

	const tabs = [t`OPEN POSITIONS`, t`CLOSED POSITIONS`]
	const [tab, setTab] = useState<number>(activeTab)

	useEffect(() => {
		setTab(activeTab)
	}, [props.sidebarProps])

	const isOpenPositions = tab === 0
	const anyPositions = isOpenPositions
		? props.trades.open.length
		: props.trades.closed.length

	const closedTrades = props.trades.closed.length

	const renderPositions = (open: boolean) => {
		if (open) {
			return <GroupOpenPositions isMobile={props.isMobile} />
		}
		return props.trades.closed.map(
			(position: IClosedTrade, index: number) => {
				return (
					<ClosedPositionItem
						isOpen={
							props.selectedTrade &&
							props.selectedTrade.tradeID === position.tradeID
						}
						colors={props.colors}
						key={index}
						selected={
							Number(position.instrumentID) ===
							props.selectedInstrument
						}
						formatCurrency={props.formatCurrency}
						formatStringCurrency={props.formatStringCurrency}
						position={position}
					/>
				)
			}
		)
	}

	return (
		<SidebarContentsPanel
			colors={props.colors}
			isMobile={props.isMobile}
			adjustable={false}
		>
			<SidebarCaption
				colors={props.colors}
			>{t`Positions`}</SidebarCaption>
			<CloseButton colors={props.colors} onClick={props.onClose} />
			<Tabs value={tab} tabs={tabs} onChange={setTab} />
			<ClosedPositionsScroller
				colors={props.colors}
				className="scrollable"
			>
				<PositionsListPanel>
					{anyPositions === 0 ? (
						<Placeholder
							open={isOpenPositions}
							color={props.colors.primaryText}
						/>
					) : (
						renderPositions(isOpenPositions)
					)}
				</PositionsListPanel>
				{!isOpenPositions && props.trades.closed.length > 19 && (
					<div className="positions-actions">
						<span>{t`Showing last ${closedTrades}`}</span>
						{props.canLoadMore && (
							<div
								className="positions_load-more"
								onClick={
									props.actionLoadMoreClosedTradesRequest
								}
							>{t`load more`}</div>
						)}
					</div>
				)}
			</ClosedPositionsScroller>
		</SidebarContentsPanel>
	)
}

const mapStateToProps = (state: any) => ({
	trades: state.trades,
	selectedTrade: state.trades.selected,
	selectedInstrument: Number(state.trading.selected),
	formatCurrency: formatCurrency(state),
	formatStringCurrency: formatStringCurrency(state),
	canLoadMore: state.trades.currentPage < state.trades.totalPages,
	sidebarProps: state.sidebar.props,
})

export default connect(mapStateToProps, {
	actionTradeSellBack,
	actionTradeHedge,
	actionTradeDoubleUp,
	actionLoadMoreClosedTradesRequest,
})(PositionsPanel)
