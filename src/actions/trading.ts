import { action } from 'typesafe-actions'
import { ICfdOptionsInstrument, IInstrument } from '../core/API'
import { ISentimentItem, ProductType } from '../reducers/trading'

const entity = 'trading'

const TRADING_INITIALIZE = `${entity}/INITIALIZE`
const FORCE_UPDATE = `${entity}/FORCE_UPDATE`
const SET_INSTRUMENTS = `${entity}/SET_INSTRUMENTS`
const SET_CFD_INSTRUMENTS = `${entity}/SET_CFD_INSTRUMENTS`
const SELECT_INSTRUMENT = `${entity}/SELECT`
const UPDATE_INSTRUMENT = `${entity}/UPDATE_INSTRUMENT`
const SUBMIT_TRADE_REQUEST = `${entity}/SUBMIT_TRADE`
const SUBMIT_TRADE_SUCCESS = `${entity}/SUBMIT_SUCCESS`
const SUBMIT_TRADE_FAILURE = `${entity}/SUBMIT_FAILURE`
const SET_IN_TRADING_HOURS = `${entity}/TRADING_HOURS`
const SELECT_BONUS_WALLET = `${entity}/SELECT_BONUS_WALLET`
const SELECT_BONUS_WALLET_REMOTE = `${entity}/SELECT_BONUS_WALLET_REMOTE`
const SET_TRADING_TIMEOUT = `${entity}/SET_TRADING_TIMEOUT`
const SET_CURRENT_PAYOUT = `${entity}/SET_CURRENT_PAYOUT`
const SET_DIRECTION = `${entity}/SET_DIRECTION`
const HOVER_DIRECTION = `${entity}/HOVER_DIRECTION`
const TIMED_CANCEL_TRADE = `${entity}/TIMED_CANCEL_TRADE`
const GAME_ENTERED_DEAD_PERIOD = `${entity}/GAME_ENTERED_DEAD_PERIOD`
const LOCK_ADD = `${entity}/LOCK_ADD`
const LOCK_RELEASE = `${entity}/LOCK_RELEASE`
const SET_PRODUCT_TYPE = `${entity}/SET_PRODUCT_TYPE`
const SET_PRODUCT_TYPES = `${entity}/SET_PRODUCT_TYPES`
const SET_CFD_OPTIONS_ACTIVE_DIRECTION = `${entity}/SET_CFD_OPTIONS_ACTIVE_DIRECTION`
const SET_CFD_OPTIONS_INSTRUMENT = `${entity}/SET_CFD_OPTIONS_INSTRUMENT`
const SET_SELECTED_CFD_OPTION_EXPIRY = `${entity}/SET_SELECTED_CFD_OPTION_EXPIRY`
const SET_CFD_SENTIMENT_SELECTED_OPTION = `$${entity}/SET_CFD_SENTIMENT_SELECTED_OPTION`
const SET_CFD_RISK_AMOUNT = `$${entity}/SET_CFD_RISK_AMOUNT`
const SET_DISTANCES = `$${entity}/SET_DISTANCES`
const SET_ABOVE_BELOW_INSTRUMENTS = `$${entity}/SET_ABOVE_BELOW_INSTRUMENTS`

const actionInitializeInstruments = () => action(TRADING_INITIALIZE)
const actionForceUpdateInstruments = (time: number) =>
  action(FORCE_UPDATE, time)
const actionSetInstruments = (instruments: IInstrument[]) =>
  action(SET_INSTRUMENTS, instruments)
const actionSetCfdInstruments = (instruments: IInstrument[]) =>
  action(SET_CFD_INSTRUMENTS, instruments)
const actionSetAboveBelowInstruments = (instruments: IInstrument[]) =>
  action(SET_ABOVE_BELOW_INSTRUMENTS, instruments)
const actionSelectBonusWallet = (bonusWallet: any) =>
  action(SELECT_BONUS_WALLET, bonusWallet)
const actionSelectBonusWalletRemote = (bonusWallet: any) =>
  action(SELECT_BONUS_WALLET_REMOTE, bonusWallet)
const actionSelectInstrument = (id: string) => action(SELECT_INSTRUMENT, id)
const actionUpdateInstrument = (instrument: any) =>
  action(UPDATE_INSTRUMENT, instrument)
const actionSetDistances = (itemName: string, distances: any) =>
  action(SET_DISTANCES, { itemName, distances })
const actionSubmitTrade = (attributes: any) =>
  action(SUBMIT_TRADE_REQUEST, attributes)
const actionSetTradeable = (inTradingHours: boolean) =>
  action(SET_IN_TRADING_HOURS, inTradingHours)
const actionSetTradingTimeout = (timeout: number) =>
  action(SET_TRADING_TIMEOUT, timeout)
const actionSetCurrentPayout = (payout: number) =>
  action(SET_CURRENT_PAYOUT, payout)
const actionSetDirection = (direction: number) =>
  action(SET_DIRECTION, direction)
const actionHoverDirection = (direction: number | null) =>
  action(HOVER_DIRECTION, direction)
const actionTimedCancelTrade = (tradeID: number) =>
  action(TIMED_CANCEL_TRADE, tradeID)
const actionGameEnteredDeadPeriod = (flag: boolean) =>
  action(GAME_ENTERED_DEAD_PERIOD, flag)
const actionLockAdd = (id: string | number) => action(LOCK_ADD, id)
const actionLockRelease = (id: string | number) => action(LOCK_RELEASE, id)
const actionSetProductTypes = (type: ProductType) =>
  action(SET_PRODUCT_TYPES, type)
const actionSetProductType = (type: ProductType) =>
  action(SET_PRODUCT_TYPE, type)
const actionSetCfdOptionsActiveDirection = (direction: 1 | -1 | null) =>
  action(SET_CFD_OPTIONS_ACTIVE_DIRECTION, direction)
const actionSetCfdOptionInstrument = (
  instrument: ICfdOptionsInstrument | null
) => action(SET_CFD_OPTIONS_INSTRUMENT, instrument)
const actionSetSelectedCfdOptionExpiry = (expiry: number) =>
  action(SET_SELECTED_CFD_OPTION_EXPIRY, expiry)
const actionSetCfdSentimentSelectedOption = (option: ISentimentItem) =>
  action(SET_CFD_SENTIMENT_SELECTED_OPTION, option)
const actionSetCfdRiskAmount = (amount: number) =>
  action(SET_CFD_RISK_AMOUNT, amount)

export {
  TRADING_INITIALIZE,
  FORCE_UPDATE,
  SET_INSTRUMENTS,
  SET_CFD_INSTRUMENTS,
  SET_DISTANCES,
  SET_DIRECTION,
  HOVER_DIRECTION,
  SELECT_INSTRUMENT,
  UPDATE_INSTRUMENT,
  SUBMIT_TRADE_REQUEST,
  SUBMIT_TRADE_SUCCESS,
  SUBMIT_TRADE_FAILURE,
  SET_IN_TRADING_HOURS,
  SELECT_BONUS_WALLET,
  SELECT_BONUS_WALLET_REMOTE,
  SET_TRADING_TIMEOUT,
  SET_CURRENT_PAYOUT,
  TIMED_CANCEL_TRADE,
  GAME_ENTERED_DEAD_PERIOD,
  LOCK_ADD,
  LOCK_RELEASE,
  SET_PRODUCT_TYPE,
  SET_CFD_OPTIONS_ACTIVE_DIRECTION,
  SET_CFD_OPTIONS_INSTRUMENT,
  SET_SELECTED_CFD_OPTION_EXPIRY,
  SET_CFD_SENTIMENT_SELECTED_OPTION,
  SET_CFD_RISK_AMOUNT,
  SET_PRODUCT_TYPES,
  SET_ABOVE_BELOW_INSTRUMENTS,
  actionTimedCancelTrade,
  actionInitializeInstruments,
  actionSetTradeable,
  actionForceUpdateInstruments,
  actionSetInstruments,
  actionSetCfdInstruments,
  actionSelectBonusWallet,
  actionSelectBonusWalletRemote,
  actionSelectInstrument,
  actionUpdateInstrument,
  actionSetDistances,
  actionSubmitTrade,
  actionSetTradingTimeout,
  actionSetCurrentPayout,
  actionSetDirection,
  actionHoverDirection,
  actionGameEnteredDeadPeriod,
  actionLockAdd,
  actionLockRelease,
  actionSetProductType,
  actionSetCfdOptionsActiveDirection,
  actionSetCfdOptionInstrument,
  actionSetSelectedCfdOptionExpiry,
  actionSetCfdSentimentSelectedOption,
  actionSetCfdRiskAmount,
  actionSetProductTypes,
  actionSetAboveBelowInstruments,
}
