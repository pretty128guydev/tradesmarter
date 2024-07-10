/**
 * Modal state
 * based on Dan Abramov: https://stackoverflow.com/a/35641680
 */
import { SHOW, HIDE, ModalTypes } from '../actions/modal'

interface IModalReducerState {
	modalName: null | ModalTypes
	props: any
}

const defaultState = {
	modalName: null,
	props: {},
}

const modal = (state: IModalReducerState = defaultState, action: any) => {
	switch (action.type) {
		case SHOW:
			return action.payload
		case HIDE:
			return defaultState
		default:
			return state
	}
}

export default modal
