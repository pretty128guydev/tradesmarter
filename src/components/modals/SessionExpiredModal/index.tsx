import React from 'react'
import { t } from 'ttag'
import { ThemeContextConsumer } from '../../ThemeContext'
import { Overlay } from '@react-md/overlay'
import { ReactComponent as CloseIcon } from '../close.svg'
import { connect } from 'react-redux'
import { actionCloseModal } from '../../../actions/modal'
import {
	Contents,
	Caption,
	Modal,
	closeIconStyles,
	SubmitButton,
	Paragraph,
} from './styled'

interface ISessionExpired {
	actionCloseModal: () => void
}
const SessionExpired = (props: ISessionExpired) => {
	return (
		<>
			<Modal>
				<ThemeContextConsumer>
					{(context) => (
						<Contents backgroundColor={context.modalBackground}>
							<Caption color={context.primaryText}>
								{t`Logged Out`}
							</Caption>
							<CloseIcon
								style={closeIconStyles}
								onClick={props.actionCloseModal}
							/>
							<Paragraph colors={context}>
								{t`You are logged out, please log in to the platform.`}
							</Paragraph>
							<SubmitButton
								colors={context}
								onClick={props.actionCloseModal}
							>
								{t`Close`}
							</SubmitButton>
						</Contents>
					)}
				</ThemeContextConsumer>
			</Modal>
			<Overlay
				id="modal-overlay"
				visible={true}
				onRequestClose={() => {}}
				style={{ zIndex: 40 }}
			/>
		</>
	)
}

export default connect(null, { actionCloseModal })(SessionExpired)
