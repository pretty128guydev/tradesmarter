/**
 * React to practice expired event
 * Normally we should use accountSwitchRedirectUrl, but
 */
import React from 'react'
import { t } from 'ttag'
import { Overlay } from '@react-md/overlay'
import { connect } from 'react-redux'
import {
	Modal,
	Contents,
	Caption,
	// closeIconStyles,
	SubmitButton,
} from './styled'
import { actionCloseModal } from '../../../actions/modal'
import { actionPracticeMode } from '../../../actions/account'

interface IPracticeExpiredModalProps {
	colors: any
	actionPracticeMode: (state: boolean) => void
	actionCloseModal: () => void
}
const PracticeExpiredModal = (props: IPracticeExpiredModalProps) => {
	const { colors } = props

	const onClick = () => {
		props.actionPracticeMode(false)
	}

	return (
		<>
			<Modal>
				<Contents backgroundColor={colors.modalBackground}>
					<Caption color={colors.primaryText}>
						{t`Practice expired`}
					</Caption>
					{/* <CloseIcon
						style={closeIconStyles}
						onClick={props.actionCloseModal}
					/> */}
					<SubmitButton colors={colors} onClick={onClick}>
						{t`Switch to real`}
					</SubmitButton>
				</Contents>
			</Modal>
			<Overlay
				id="modal-overlay"
				visible={true}
				onRequestClose={onClick}
				style={{ zIndex: 40 }}
			/>
		</>
	)
}

const mapStateToProps = (state: any) => ({
	registry: state.registry.data,
	colors: state.theme,
})

export default connect(mapStateToProps, {
	actionCloseModal,
	actionPracticeMode,
})(PracticeExpiredModal)
