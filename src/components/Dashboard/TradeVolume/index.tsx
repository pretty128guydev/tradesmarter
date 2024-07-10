import React from 'react'
import { connect } from 'react-redux'
import { DashboardTradeVolumeSpace, TradeVolumeInfo } from './styled'
import TradeVolumeChart from './chart'
import {
	DashboardCardName,
	DashboardCardValue,
	DashboardCardWrapper,
} from '../styled'
import { t } from 'ttag'
import { IDashboardTrades } from '../interfaces'
import { formatCurrency } from '../../selectors/currency'

interface IDashboardTradeVolumeProps {
	colors: any
	isMobile: boolean
	trades: IDashboardTrades
	formatCurrency: (input: number) => string
	showDashboardCards: any
}

const DashboardTradeVolume = ({
	colors,
	isMobile,
	trades,
	formatCurrency,
	showDashboardCards,
}: IDashboardTradeVolumeProps) => {
	const { tradedVolume, totalTrades } = Object.values(
		trades.byDateWithOffset.dates
	).reduce(
		(prev, curr) => {
			return {
				tradedVolume:
					prev.tradedVolume + curr.highVolume + curr.lowVolume,
				totalTrades: prev.totalTrades + curr.highCount + curr.lowCount,
			}
		},
		{ tradedVolume: 0, totalTrades: 0 }
	)

	const openTadesCount = Object.values(
		trades.byInstrumentId.openedTrades
	).reduce((prev, curr) => {
		return prev + curr.highCount + curr.lowCount
	}, 0)

	const closedTadesCount = Object.values(
		trades.byInstrumentId.closedTrades
	).reduce((prev, curr) => {
		return prev + curr.highCount + curr.lowCount
	}, 0)

	return (
		<DashboardTradeVolumeSpace isMobile={isMobile}>
			{showDashboardCards.dayVolume && (
				<TradeVolumeChart trades={trades.byDateWithOffset.dates} />
			)}
			<TradeVolumeInfo isMobile={isMobile}>
				{showDashboardCards.tradedVolume && (
					<DashboardCardWrapper colors={colors}>
						<DashboardCardName
							colors={colors}
						>{t`total traded volume`}</DashboardCardName>
						<DashboardCardValue
							color={colors.primaryText}
							style={{ opacity: 0.8 }}
						>
							{formatCurrency(tradedVolume)}
						</DashboardCardValue>
					</DashboardCardWrapper>
				)}

				{showDashboardCards.tradesCount && (
					<DashboardCardWrapper colors={colors}>
						<DashboardCardName
							colors={colors}
						>{t`number of trades`}</DashboardCardName>
						<DashboardCardValue
							color={colors.primaryText}
							style={{ opacity: 0.8 }}
						>
							{closedTadesCount} / {openTadesCount}
						</DashboardCardValue>
					</DashboardCardWrapper>
				)}

				{showDashboardCards.avVolume && (
					<DashboardCardWrapper colors={colors}>
						<DashboardCardName
							colors={colors}
						>{t`average volume`}</DashboardCardName>
						<DashboardCardValue
							color={colors.primaryText}
							style={{ opacity: 0.8 }}
						>
							{formatCurrency(tradedVolume / totalTrades)}
						</DashboardCardValue>
					</DashboardCardWrapper>
				)}
			</TradeVolumeInfo>
		</DashboardTradeVolumeSpace>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
	isMobile: state.registry.isMobile,
	formatCurrency: formatCurrency(state),
	showDashboardCards:
		state.registry.data.partnerConfig.leftPanel.dashboard.cards,
})

export default connect(mapStateToProps)(DashboardTradeVolume)
