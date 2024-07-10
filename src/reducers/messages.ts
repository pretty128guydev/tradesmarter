/**
 * Handles state for alerts
 * State is string array, messages displayed 1-by-1
 */
import { ADD_MESSAGE, CLEAR_MESSAGES } from '../actions/messages'

/**
 * Will replace any <br> to \n
 * @param input - string with <br> or <br/>
 */
const sanitize = (input: string): string =>
	input.replace(/<br\s*[\/]?>/gi, '\n')

const messagesReducer = (state: string[] = [], action: any) => {
	switch (action.type) {
		case ADD_MESSAGE:
			return [sanitize(action.payload)]
		case CLEAR_MESSAGES:
			return []
		default:
			return state
	}
}

export default messagesReducer
