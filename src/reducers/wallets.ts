/**
 * Holds wallets as an object from server
 */
import { SET_WALLETS, RESET_WALLETS } from '../actions/wallets'
import { IWalletDetails } from '../core/API'

const walletsReducer = (state: IWalletDetails | null = null, action: any) => {
	switch (action.type) {
		case SET_WALLETS:
			return action.payload
		case RESET_WALLETS:
			return null
		default:
			return state
	}
}

export default walletsReducer
