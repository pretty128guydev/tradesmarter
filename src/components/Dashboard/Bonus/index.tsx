import React from 'react'
import { connect } from 'react-redux'
import {
	DashboardCardName,
	DashboardCardValue,
	DashboardCardWrapper,
} from '../styled'
import { t } from 'ttag'
import { DashboardBonusSpace } from './styled'
import { formatCurrency } from '../../selectors/currency'

interface IDashboardBonusProps {
	colors: any
	wallets: any
	isMobile: boolean
	formatCurrency: (input: number) => string
	totalBonusReceived: number
	totalTradedVolume: number
	showDashboardCards: any
}

const DashboardBonus = ({
	colors,
	isMobile,
	wallets,
	formatCurrency,
	totalBonusReceived,
	totalTradedVolume,
	showDashboardCards,
}: IDashboardBonusProps) => {
	const pendingBonus = wallets.bonusesInfo.reduce(
		(
			prev: number,
			curr: { volumeTraded: number; volumeRequired: number }
		) => {
			const { volumeTraded, volumeRequired } = curr
			return prev + (volumeRequired - volumeTraded)
		},
		0
	)

	return (
		<DashboardBonusSpace isMobile={isMobile}>
			{showDashboardCards.bonusReceived && (
				<DashboardCardWrapper colors={colors}>
					<DashboardCardName
						colors={colors}
					>{t`total bonus received`}</DashboardCardName>
					<DashboardCardValue color={colors.primary}>
						{formatCurrency(totalBonusReceived)}
					</DashboardCardValue>
				</DashboardCardWrapper>
			)}

			{showDashboardCards.tradedBonus && (
				<DashboardCardWrapper colors={colors}>
					<DashboardCardName
						colors={colors}
					>{t`traded bonus`}</DashboardCardName>
					<DashboardCardValue color={colors.primaryText}>
						{formatCurrency(totalTradedVolume)}
					</DashboardCardValue>
				</DashboardCardWrapper>
			)}

			{showDashboardCards.pendingBonus && (
				<DashboardCardWrapper colors={colors}>
					<DashboardCardName
						colors={colors}
					>{t`pending bonus`}</DashboardCardName>
					<DashboardCardValue color={colors.primaryText}>
						{formatCurrency(pendingBonus)}
					</DashboardCardValue>
				</DashboardCardWrapper>
			)}
		</DashboardBonusSpace>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
	wallets: state.wallets,
	bonusWallet: state.trading.bonusWallet,
	formatCurrency: formatCurrency(state),
	isMobile: state.registry.isMobile,
	showDashboardCards:
		state.registry.data.partnerConfig.leftPanel.dashboard.cards,
})

export default connect(mapStateToProps)(DashboardBonus)
