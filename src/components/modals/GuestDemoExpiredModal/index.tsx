/**
 * React to guest demo expired event
 * Take registrationLink from get-registry and redirect to it
 * But this registrationLink could be false
 */
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

interface IGuestDemoExpired {
	registrationLink: string
	hideRegistrationLink: boolean
	actionCloseModal: () => void
}
const GuestDemoExpired = (props: IGuestDemoExpired) => {
	const { registrationLink, hideRegistrationLink } = props
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
								{t`Your guest demo account expired, please create real account.`}
							</Paragraph>
							{!hideRegistrationLink && (
								<SubmitButton
									colors={context}
									href={registrationLink}
								>
									{t`Create real account`}
								</SubmitButton>
							)}
						</Contents>
					)}
				</ThemeContextConsumer>
			</Modal>
			<Overlay
				id="modal-overlay"
				visible={true}
				onRequestClose={props.actionCloseModal}
				style={{ zIndex: 40 }}
			/>
		</>
	)
}

const mapStateToProps = (state: any) => ({
	registrationLink: state.registry.data.partnerConfig.registrationLink,
	hideRegistrationLink:
		state.registry.data.partnerConfig.registrationLink === false,
})

export default connect(mapStateToProps, { actionCloseModal })(GuestDemoExpired)
