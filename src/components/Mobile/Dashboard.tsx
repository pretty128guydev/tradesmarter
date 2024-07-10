/**
 * Component which acts like a drawer but contains a positions item from sidebar
 */
import React from 'react'
import styled from 'styled-components'
import { ThemeContextConsumer } from '../ThemeContext'
import DashboardPanel from '../Dashboard'
import { SidebarCaption } from '../Sidebar'
import { t } from 'ttag'
import CloseButton from '../Sidebar/CloseBtn'
import { SidebarState } from '../../reducers/sidebar'
import { ContainerState } from '../../reducers/container'
import { actionSetContainer } from '../../actions/container'
import { actionSetSidebar } from '../../actions/sidebar'
import { connect } from 'react-redux'

interface IDashboardProps {
	onClose: () => void
	actionSetContainer: (state: ContainerState) => void
	actionSetSidebar: (state: SidebarState) => void
}

const Panel = styled.div<any>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: ${(props) => props.colors.background};
	display: flex;
	flex-direction: column;
	z-index: 31;
`

const Dashboard = ({ onClose }: IDashboardProps) => {
	return (
		<ThemeContextConsumer>
			{(colors) => (
				<Panel colors={colors}>
					<SidebarCaption
						colors={colors}
					>{t`Dashboard`}</SidebarCaption>
					<CloseButton colors={colors} onClick={onClose} />
					<DashboardPanel onClose={onClose} />
				</Panel>
			)}
		</ThemeContextConsumer>
	)
}

export default connect(() => {}, {
	actionSetContainer,
	actionSetSidebar,
})(Dashboard)
