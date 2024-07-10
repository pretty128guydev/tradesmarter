import React from 'react'
import { connect } from 'react-redux'
import { DashboardRecentTradesSpace } from './styled'
import { DashboardCardFooter, DashboardCardTitle } from '../styled'
import { t } from 'ttag'
import RecentTradesTable from './table'
import RecentTradesList from './list'
import { actionLoadMoreClosedTradesRequest } from '../../../actions/trades'
import { IClosedTrade } from '../../../core/interfaces/trades'
import DashboardDownload from './download'

interface IDashboardRecentTradesProps {
	colors: any
	isMobile: boolean
	closedTrades: IClosedTrade[]
	canLoadMore: boolean
	actionLoadMoreClosedTradesRequest: () => void
}

const DashboardRecentTrades = ({
	colors,
	isMobile,
	closedTrades,
	canLoadMore,
	actionLoadMoreClosedTradesRequest,
}: IDashboardRecentTradesProps) => {
	const Content = isMobile ? RecentTradesList : RecentTradesTable
	return (
		<DashboardRecentTradesSpace colors={colors} isMobile={isMobile}>
			<DashboardCardTitle colors={colors}>
				<span>{t`Recent Trades`}</span>
				<DashboardDownload />
			</DashboardCardTitle>
			<Content closedTrades={closedTrades} />
			{canLoadMore && (
				<DashboardCardFooter
					colors={colors}
					onClick={actionLoadMoreClosedTradesRequest}
				>{t`Load More`}</DashboardCardFooter>
			)}
		</DashboardRecentTradesSpace>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
	isMobile: state.registry.isMobile,
	closedTrades: state.trades.closed,
	canLoadMore: state.trades.currentPage < state.trades.totalPages,
})

export default connect(mapStateToProps, { actionLoadMoreClosedTradesRequest })(
	DashboardRecentTrades
)
