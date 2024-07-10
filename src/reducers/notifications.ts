/**
 * Notification state
 */
import { CLEAR, HIDE, INotification, SHOW } from '../actions/notifications'

interface INotificationReducerState {
	notifications: INotification<any>[]
}

const defaultState: INotificationReducerState = {
	notifications: [],
}

const notifications = (
	state: INotificationReducerState = defaultState,
	action: any
) => {
	switch (action.type) {
		case SHOW:
			return show(state, action)
		case HIDE:
			return hide(state, action)
		case CLEAR:
			return defaultState
		default:
			return state
	}
}

const show = (
	state: INotificationReducerState,
	action: any
): INotificationReducerState => ({
	notifications: [...state.notifications, action.payload],
})

const hide = (
	state: INotificationReducerState,
	action: any
): INotificationReducerState => ({
	notifications: state.notifications.filter(
		({ id }) => id !== action.payload.id
	),
})

export default notifications
