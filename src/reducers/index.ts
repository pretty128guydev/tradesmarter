import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import account from './account'
import modal from './modal'
import registry from './registry'
import time from './time'
import trading from './trading'
import instruments from './instruments'
import quotes from './quotes'
import trades from './trades'
import wallets from './wallets'
import game from './game'
import games from './games'
import messages from './messages'
import theme from './theme'
import sidebar from './sidebar'
import expiry from './expiry'
import notifications from './notifications'
import container from './container'

const createRootReducer = (history: any) =>
	combineReducers({
		router: connectRouter(history),
		account,
		modal,
		registry,
		games,
		time,
		trading,
		instruments,
		quotes,
		trades,
		wallets,
		messages,
		theme,
		container,
		sidebar,
		game,
		expiry,
		notifications,
	})

export default createRootReducer
