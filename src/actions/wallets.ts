import { action } from 'typesafe-actions'
import { IWalletDetails } from '../core/API'

const entity = 'wallets'

const SET_WALLETS = `${entity}/SET_WALLETS`
const RESET_WALLETS = `${entity}/RESET_WALLETS`
const REFRESH_WALLETS = `${entity}/REFRESH_WALLETS`

const actionSetWallets = (wallet: IWalletDetails) => action(SET_WALLETS, wallet)
const actionResetWallets = () => action(RESET_WALLETS)
const actionRefreshWallets = () => action(REFRESH_WALLETS)

export {
	SET_WALLETS,
	RESET_WALLETS,
	REFRESH_WALLETS,
	actionSetWallets,
	actionResetWallets,
	actionRefreshWallets,
}
