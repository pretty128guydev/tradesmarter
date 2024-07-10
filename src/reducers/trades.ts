/**
 * Holds trades as an array from server
 */
import {
	ADD_MORE_TRADES,
	ISetClosedTradesPayload,
	MARK_CLOSED,
	RESET_TRADES,
	SET_CLOSED_TRADES,
	SET_OPEN_TRADES,
	SET_SELECTED_TRADE,
} from '../actions/trades'
import { IOpenTrade, IClosedTrade } from '../core/interfaces/trades'

export interface ITradesState {
	selected: IOpenTrade | IClosedTrade | null
	open: IOpenTrade[]
	closed: IClosedTrade[]
	totalPages: number
	currentPage: number
}

/**
 * Some values are not available, but this is not a problem:
 * We need to move trade from open to closed
 * @param input
 */
const convertClosedToOpen = (input: IOpenTrade): IClosedTrade => ({
	action: '',
	instrumentName: input.instrumentName,
	createdTimestamp: input.createdTimestamp, // 1612525623000
	currency: input.currency,
	direction: input.direction,
	distance: input.distance,
	expiryTimestamp: input.expiryTimestamp,
	followedTrade: input.followedTrade,
	instrumentID: input.instrumentID,
	payout: input.payout,
	quotePrecision: input.quotePrecision,
	rebate: input.rebate,
	return: 0, // not available here
	status: input.status,
	strike: input.strike,
	tradeID: input.tradeID,
	gameType: input.gameType,
	userCurrency: input.userCurrency,
	userCurrencyReturn: 0,
	userCurrencyStake: input.userCurrencyStake,
	closedPrice: input.strike,
	stake: input.stake,
})
/**
 * Filter trade and mark it as a closed
 * Return state if can't find trade
 * @param state
 * @param tradeID
 */
const markTradeAsClosed = (state: ITradesState, ids: string): ITradesState => {
	const newClosed = state.open
		.filter((t: IOpenTrade) => ids.includes(String(t.tradeID)))
		.map(convertClosedToOpen)

	const open = state.open.filter(
		(t: IOpenTrade) => !ids.includes(String(t.tradeID))
	)

	return {
		...state,
		open,
		closed: [...newClosed, ...state.closed],
	}
}

const tradesReducer = (
	state: ITradesState = {
		open: [],
		closed: [],
		totalPages: 0,
		currentPage: 0,
		selected: null,
	},
	action: any
): ITradesState => {
	switch (action.type) {
		case MARK_CLOSED:
			return markTradeAsClosed(state, action.payload)
		case SET_OPEN_TRADES:
			return {
				...state,
				open: action.payload,
			}
		case SET_CLOSED_TRADES:
			return {
				...state,
				closed: (action.payload as ISetClosedTradesPayload).closed,
				totalPages: (action.payload as ISetClosedTradesPayload)
					.totalPages,
				currentPage: (action.payload as ISetClosedTradesPayload)
					.currentPage,
			}
		case ADD_MORE_TRADES:
			return {
				...state,
				closed: [...state.closed, ...action.payload.closed],
				currentPage: action.payload.currentPage,
			}
		case SET_SELECTED_TRADE: {
			return {
				...state,
				selected: action.payload,
			}
		}
		case RESET_TRADES:
			return {
				...state,
				open: [],
				closed: [],
			}
		default:
			return state
	}
}

export default tradesReducer
