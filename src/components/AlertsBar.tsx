/**
 * Implements a Material Design alerts bar
 * https://react-md.dev/packages/alert/demos
 */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { actionClearMessages } from '../actions/messages'
import { MessageQueue, useAddMessage } from '@react-md/alert'

const AlertsBar = (props: any) => {
	const addMessage = useAddMessage()

	/**
	 * Push new alerts each time messages state is updated
	 */
	useEffect(() => {
		props.messages.forEach((children: string) => {
			addMessage({ children })
		})

		/**
		 * Start timer to clear messages
		 */
		setTimeout(() => {
			if (props.messages.length > 0) {
				props.actionClearMessages()
			}
		}, 3000)
	}, [props.messages])

	return null
}

const mapStateToProps = (state: any) => ({ messages: state.messages })
const WrappedAlertsBar = connect(mapStateToProps, { actionClearMessages })(
	AlertsBar
)

const messageQueue = () => (
	<MessageQueue id="alerts-message-queue" timeout={3000}>
		<WrappedAlertsBar />
	</MessageQueue>
)

export default messageQueue
