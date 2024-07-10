import { action } from 'typesafe-actions'
import { ISignInResponse, IUserInfo } from '../core/API'

const entity = 'account'

const SIGN_IN_REQUEST = `${entity}/SIGN_IN_REQUEST`
const SIGN_IN_SUCCESS = `${entity}/SIGN_IN_SUCCESS`
const SIGN_IN_FAIL = `${entity}/SIGN_IN_FAIL`
const SET_ACCOUNT = `${entity}/SET_ACCOUNT`
const SET_USER_INFO = `${entity}/SET_USER_INFO`
const SET_PRACTICE_MODE = `${entity}/SET_PRACTICE_MODE`
const REMOVE_INSTRUMENT_FROM_FAVS = `${entity}/REMOVE_INSTRUMENT_FROM_FAVS`
const ADD_INSTRUMENT_TO_FAVS = `${entity}/ADD_INSTRUMENT_TO_FAVS`
const REMOVE_INSTRUMENT_FROM_TOP = `${entity}/REMOVE_INSTRUMENT_FROM_TOP`
const ADD_INSTRUMENT_TO_TOP = `${entity}/ADD_INSTRUMENT_TO_TOP`
const SET_FAVORITES = `${entity}/SET_FAVORITES`
const SET_TOP = `${entity}/SET_TOP`
const START_PING = `${entity}/START_PING`
const LOG_OUT = `${entity}/LOG_OUT`
const SET_LOGOUT = `${entity}/SET_LOGOUT`
const GUEST_DEMO_REQUEST = `${entity}/GUEST_DEMO_REQUEST`
const GUEST_DEMO_EXPIRED = `${entity}/GUEST_DEMO_EXPIRED`
const ACCOUNT_REFRESH = `${entity}/ACCOUNT_REFRESH`

const actionSetLoggedIn = (loggedIn: boolean) =>
  action(SET_ACCOUNT, { loggedIn })
const actionSetUserInfo = (userInfo: IUserInfo) =>
  action(SET_USER_INFO, userInfo)
const actionResetUser = () => action(SET_LOGOUT)
const actionSignInRequest = (email: string, password: string) =>
  action(SIGN_IN_REQUEST, { email, password })
const actionSignInSuccess = (data: ISignInResponse) =>
  action(SIGN_IN_SUCCESS, data)
const actionSignInFailure = (message: string) => action(SIGN_IN_FAIL, message)
const actionLogout = (reload: boolean) => action(LOG_OUT, reload)
const actionPracticeMode = (practice: boolean) =>
  action(SET_PRACTICE_MODE, practice)
const actionRemoveInstrumentFromFavorites = (instrumentID: string) =>
  action(REMOVE_INSTRUMENT_FROM_FAVS, instrumentID)
const actionAddInstrumentToFavorites = (instrumentID: string) =>
  action(ADD_INSTRUMENT_TO_FAVS, instrumentID)
const actionUpdateFavorites = (favorites: string[]) =>
  action(SET_FAVORITES, favorites)
const actionStartPing = () => action(START_PING)
const actionGuestDemoRequest = () => action(GUEST_DEMO_REQUEST)
const actionGuestDemoExpired = () => action(GUEST_DEMO_EXPIRED)
const actionRefreshAccount = () => action(ACCOUNT_REFRESH)

const actionRemoveInstrumentFromTop = (instrumentID: string) =>
  action(REMOVE_INSTRUMENT_FROM_TOP, instrumentID)
const actionAddInstrumentToTop = (instrumentID: string) =>
  action(ADD_INSTRUMENT_TO_TOP, instrumentID)
const actionUpdateTop = (favorites: string[]) => action(SET_TOP, favorites)

export {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAIL,
  SET_ACCOUNT,
  SET_USER_INFO,
  SET_PRACTICE_MODE,
  REMOVE_INSTRUMENT_FROM_FAVS,
  ADD_INSTRUMENT_TO_FAVS,
  REMOVE_INSTRUMENT_FROM_TOP,
  ADD_INSTRUMENT_TO_TOP,
  SET_FAVORITES,
  START_PING,
  LOG_OUT,
  SET_LOGOUT,
  GUEST_DEMO_REQUEST,
  ACCOUNT_REFRESH,
  GUEST_DEMO_EXPIRED,
  SET_TOP,
  actionRefreshAccount,
  actionResetUser,
  actionLogout,
  actionStartPing,
  actionSetUserInfo,
  actionSignInSuccess,
  actionSignInFailure,
  actionSignInRequest,
  actionSetLoggedIn,
  actionPracticeMode,
  actionRemoveInstrumentFromFavorites,
  actionAddInstrumentToFavorites,
  actionRemoveInstrumentFromTop,
  actionAddInstrumentToTop,
  actionUpdateFavorites,
  actionGuestDemoRequest,
  actionGuestDemoExpired,
  actionUpdateTop,
}
