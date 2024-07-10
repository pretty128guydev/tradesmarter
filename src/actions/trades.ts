import { action } from 'typesafe-actions'
import { IOpenTrade, IClosedTrade } from '../core/interfaces/trades'

const entity = 'trades'

const REFETCH_TRADES = `${entity}/REFETCH_TRADES`
const ADD_MORE_TRADES = `${entity}/ADD_TRADES`
const LOAD_MORE_TRADES_REQUEST = `${entity}/LOAD_MORE_TRADES_REQUEST`
const SET_OPEN_TRADES = `${entity}/SET_OPEN_TRADES`
const SET_CLOSED_TRADES = `${entity}/SET_CLOSED_TRADES`
const SET_SELECTED_TRADE = `${entity}/SET_SELECTED_TRADE`
const MARK_CLOSED = `${entity}/MARK_CLOSED`
const SELL_BACK_REQUESTED = `${entity}/SELL_BACK_GET_AMOUNT`
const SELL_BACK_DO = `${entity}/SELL_BACK_DO`
const HEDGE_REQUESTED = `${entity}/HEDGE`
const DOUBLE_UP_REQUESTED = `${entity}/DOUBLE_UP`
const RESET_TRADES = `${entity}/RESET_TRADES`

export interface ISetClosedTradesPayload {
	closed: IClosedTrade[]
	totalPages: number
	currentPage: number
}

const actionResetTrades = () => action(RESET_TRADES)
const actionRefrechTrades = () => action(REFETCH_TRADES, {})
const actionLoadMoreClosedTradesRequest = () => action(LOAD_MORE_TRADES_REQUEST)
const actionAddMoreTrades = (payload: any) => action(ADD_MORE_TRADES, payload)
const actionSetOpenTrades = (trades: any[]) => action(SET_OPEN_TRADES, trades)
const actionSetClosedTrades = (payload: ISetClosedTradesPayload) =>
	action(SET_CLOSED_TRADES, payload)
const actionSetSelectedTrade = (trade: IOpenTrade | IClosedTrade | null) =>
	action(SET_SELECTED_TRADE, trade)
const actionMarkClosed = (trades: string[]) => action(MARK_CLOSED, trades)
/**
 * We need to take
 * @param trade - trade object
 * @param x - left coord
 * @param y - top coord
 */
const actionTradeSellBack = (trade: IOpenTrade, x: number, y: number) =>
	action(SELL_BACK_REQUESTED, { tradeID: trade.tradeID, x, y })

/**
 * Passes trade down, tradeId and stake will be extracted from trade itself
 * amount - is amount that SELL_BACK_REQUESTED returned
 * @param trade
 * @param amount
 */
const actionDoSellback = (trade: IOpenTrade, amount: number) =>
	action(SELL_BACK_DO, {
		trade,
		amount,
	})

const actionTradeHedge = (trade: IOpenTrade) => action(HEDGE_REQUESTED, trade)
const actionTradeDoubleUp = (trade: IOpenTrade) =>
	action(DOUBLE_UP_REQUESTED, trade)

export {
	RESET_TRADES,
	REFETCH_TRADES,
	SET_OPEN_TRADES,
	SET_CLOSED_TRADES,
	SET_SELECTED_TRADE,
	MARK_CLOSED,
	SELL_BACK_REQUESTED,
	SELL_BACK_DO,
	HEDGE_REQUESTED,
	DOUBLE_UP_REQUESTED,
	ADD_MORE_TRADES,
	LOAD_MORE_TRADES_REQUEST,
	actionAddMoreTrades,
	actionLoadMoreClosedTradesRequest,
	actionResetTrades,
	actionRefrechTrades,
	actionSetClosedTrades,
	actionSetOpenTrades,
	actionSetSelectedTrade,
	actionMarkClosed,
	actionTradeSellBack,
	actionTradeHedge,
	actionTradeDoubleUp,
	actionDoSellback,
}
