/**
 * Implemens an iframe with link to social
 */
import React from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { SidebarCaption, VerticalFlexContainer } from './index'
import { ILeftPanel } from '../../core/API'
import CloseButton from './CloseBtn'
import SidebarContentsPanel from './SidebarContentsPanel'

interface ISocialPanelProps {
	colors: any
	leftPanel: ILeftPanel
	onClose: () => void
}

/**
 * Entry component
 * @param props
 */
const SocialPanel = ({ leftPanel, onClose, colors }: ISocialPanelProps) => {
	const { socialWidgetUrl } = leftPanel
	return (
		<SidebarContentsPanel
			adjustable={false}
			colors={colors}
			isMobile={false}
		>
			<SidebarCaption colors={colors}>{t`Social`}</SidebarCaption>
			<CloseButton colors={colors} onClick={onClose} />
			<VerticalFlexContainer>
				<iframe
					src={socialWidgetUrl}
					frameBorder="0"
					height="100%"
					width="100%"
					title="social iframe"
				/>
			</VerticalFlexContainer>
		</SidebarContentsPanel>
	)
}

const mapStateToProps = (state: any) => ({
	leftPanel: state.registry.data.partnerConfig.leftPanel,
})

export default connect(mapStateToProps)(SocialPanel)
