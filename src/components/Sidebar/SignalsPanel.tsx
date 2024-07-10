/**
 * Implemens an iframe with signals
 */
import React from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { SidebarCaption, VerticalFlexContainer } from './index'
import { ILeftPanel } from '../../core/API'
import CloseButton from './CloseBtn'
import SidebarContentsPanel from './SidebarContentsPanel'

interface ISignalsPanelProps {
	colors: any
	leftPanel: ILeftPanel
	onClose: () => void
}

/**
 * Entry component
 * @param props
 */
const SignalsPanel = ({ leftPanel, onClose, colors }: ISignalsPanelProps) => {
	const { signalsSrc } = leftPanel
	return (
		<SidebarContentsPanel
			colors={colors}
			adjustable={false}
			isMobile={false}
		>
			<SidebarCaption colors={colors}>{t`Signals`}</SidebarCaption>
			<CloseButton colors={colors} onClick={onClose} />
			<VerticalFlexContainer>
				<iframe
					src={signalsSrc}
					title="signals iframe"
					frameBorder="0"
					height="100%"
					width="100%"
				/>
			</VerticalFlexContainer>
		</SidebarContentsPanel>
	)
}

const mapStateToProps = (state: any) => ({
	leftPanel: state.registry.data.partnerConfig.leftPanel,
})

export default connect(mapStateToProps)(SignalsPanel)
