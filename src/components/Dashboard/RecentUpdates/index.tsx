import React from 'react'
import { connect } from 'react-redux'
import { DashboardRecentUpdatesSpace } from './styled'
import { DashboardCardTitle } from '../styled'
import { t } from 'ttag'
import RecentUpdatesList from './list'

interface IDashboardRecentUpdatesProps {
	colors: any
	isMobile: boolean
}

const DashboardRecentUpdates = ({
	colors,
	isMobile,
}: IDashboardRecentUpdatesProps) => {
	return (
		<DashboardRecentUpdatesSpace colors={colors} isMobile={isMobile}>
			<DashboardCardTitle
				colors={colors}
				bottomBorder={true}
			>{t`Recent Updates`}</DashboardCardTitle>
			<RecentUpdatesList />
		</DashboardRecentUpdatesSpace>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,

	isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps)(DashboardRecentUpdates)
