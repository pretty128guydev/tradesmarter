import React from 'react'
import { connect } from 'react-redux'
import {
	DashboardCardName,
	DashboardCardValue,
	DashboardCardWrapper,
} from '../styled'
import { t } from 'ttag'
import { DashboardCashSpace } from './styled'
import { formatCurrency } from '../../selectors/currency'

interface IDashboardCashProps {
	colors: any
	wallets: null | any
	isMobile: boolean
	showDashboardCards: any
	formatCurrency: (input: number) => string
}

const Index = ({
	colors,
	wallets,
	formatCurrency,
	isMobile,
	showDashboardCards,
}: IDashboardCashProps) => {
	const balance = wallets.availableCash + wallets.availableBonus
	return (
		<DashboardCashSpace isMobile={isMobile}>
			{showDashboardCards.balance && (
				<DashboardCardWrapper colors={colors}>
					<DashboardCardName
						colors={colors}
					>{t`balance`}</DashboardCardName>
					<DashboardCardValue color={colors.primary}>
						{formatCurrency(balance)}
					</DashboardCardValue>
				</DashboardCardWrapper>
			)}

			{showDashboardCards.invested && (
				<DashboardCardWrapper colors={colors}>
					<DashboardCardName
						colors={colors}
					>{t`invested`}</DashboardCardName>
					<DashboardCardValue color={colors.primaryText}>
						{formatCurrency(wallets.reserved)}
					</DashboardCardValue>
				</DashboardCardWrapper>
			)}

			{showDashboardCards.availableCash && (
				<DashboardCardWrapper colors={colors}>
					<DashboardCardName
						colors={colors}
					>{t`available cash`}</DashboardCardName>
					<DashboardCardValue color={colors.primaryText}>
						{formatCurrency(wallets.availableCash)}
					</DashboardCardValue>
				</DashboardCardWrapper>
			)}
		</DashboardCashSpace>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
	wallets: state.wallets,
	formatCurrency: formatCurrency(state),
	isMobile: state.registry.isMobile,
	showDashboardCards:
		state.registry.data.partnerConfig.leftPanel.dashboard.cards,
})

export default connect(mapStateToProps)(Index)
