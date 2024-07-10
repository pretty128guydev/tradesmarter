import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { DashboardWrapper } from './styled'
import DashboardCash from './Cash'
import DashboardBonus from './Bonus'
import DashboardTopTradesAssets from './TopTradedAssets'
import DashboardTradeVolume from './TradeVolume'
import DashboardRecentUpdates from './RecentUpdates'
import DashboardRecentTrades from './RecentTrades'
import DashboardRatioTraders from './RatioTraders'
import CloseButton from '../Sidebar/CloseBtn'
import { api } from '../../core/createAPI'
import { ILeftPanel } from '../../core/API'
import { IDashboardData } from './interfaces'

interface IDashboardPanelProps {
	leftPanel: ILeftPanel
	isMobile: boolean
	colors: any
	showDashboardCards: any
	onClose: () => void
}

const fetchDashboardData = async (): Promise<any> => {
	return (await api.fetchDashboard(
		(new Date().getTimezoneOffset() / 60) * -1
	)) as IDashboardData
}

const DashboardPanel = ({
	isMobile,
	colors,
	showDashboardCards,
	onClose,
}: IDashboardPanelProps) => {
	const [loading, setLoading] = useState<boolean>(true)
	const [dashboardData, setDashboardData] = useState<IDashboardData | any>(
		undefined
	)

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = () => {
		if (loading) {
			fetchDashboardData().then((data) => {
				setLoading(false)
				setDashboardData(data)
			})
		}
	}

	return (
		<DashboardWrapper colors={colors} isMobile={isMobile}>
			{!isMobile && <CloseButton colors={colors} onClick={onClose} />}
			{dashboardData && (
				<>
					{(showDashboardCards.balance ||
						showDashboardCards.invested ||
						showDashboardCards.availableCash) && <DashboardCash />}

					{(showDashboardCards.bonusReceived ||
						showDashboardCards.tradedBonus ||
						showDashboardCards.pendingBonus) && (
						<DashboardBonus
							totalBonusReceived={
								dashboardData.walletStats.bonus
									.totalBonusReceived
							}
							totalTradedVolume={
								dashboardData.walletStats.bonus
									.totalTradedVolume
							}
						/>
					)}

					{showDashboardCards.topAssets && (
						<DashboardTopTradesAssets
							trades={
								dashboardData.walletStats.trade.byInstrumentId
							}
						/>
					)}
					<DashboardTradeVolume
						trades={dashboardData.walletStats.trade}
					/>
					{showDashboardCards.recentUpdates && (
						<DashboardRecentUpdates />
					)}
					{showDashboardCards.recentTrades && (
						<DashboardRecentTrades />
					)}
					{showDashboardCards.ratio && (
						<DashboardRatioTraders
							trades={
								dashboardData.walletStats.trade.byDateWithOffset
							}
						/>
					)}
				</>
			)}
		</DashboardWrapper>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
	isMobile: state.registry.isMobile,
	leftPanel: state.registry.data.partnerConfig.leftPanel,
	showDashboardCards:
		state.registry.data.partnerConfig.leftPanel.dashboard.cards,
})

export default connect(mapStateToProps)(DashboardPanel)
