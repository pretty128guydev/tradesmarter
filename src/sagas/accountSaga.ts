// @ts-nocheck 7057
/**
 * Handle get registry and side effects
 */
import {
  put,
  takeLatest,
  call,
  takeEvery,
  select,
  delay,
  all,
} from 'redux-saga/effects'
import { actionCloseModal, actionShowModal, ModalTypes } from '../actions/modal'
import {
  actionSetGlobalLoader,
  actionUpdateRegistry,
} from '../actions/registry'
import {
  actionSignInFailure,
  actionSignInSuccess,
  actionUpdateFavorites,
  ADD_INSTRUMENT_TO_FAVS,
  START_PING,
  LOG_OUT,
  GUEST_DEMO_REQUEST,
  ACCOUNT_REFRESH,
  actionResetUser,
  actionSetUserInfo,
  SIGN_IN_REQUEST,
  REMOVE_INSTRUMENT_FROM_FAVS,
  SET_PRACTICE_MODE,
  actionLogout,
  GUEST_DEMO_EXPIRED,
  ADD_INSTRUMENT_TO_TOP,
  REMOVE_INSTRUMENT_FROM_TOP,
  actionUpdateTop,
  actionSetLoggedIn,
} from '../actions/account'
import { api } from '../core/createAPI'
import { actionAddMessage } from '../actions/messages'
import { fetchAccountData, refetchRegistry } from './registrySaga'
import {
  actionSelectBonusWallet,
  SELECT_BONUS_WALLET_REMOTE,
} from '../actions/trading'
import { actionResetWallets } from '../actions/wallets'
import { actionResetTrades } from '../actions/trades'
import Cookies from 'js-cookie'
import UserStorage from '../core/UserStorage'
import { onUpdateGames } from './tradingSaga'
import { actionSetTheme } from '../actions/theme'
import { actionSetCollapsedSideMenu } from '../actions/container'
import { t } from 'ttag'

/**
 * This saga is used only for user account stuff like sign-in, ping
 */
function* requestSignIn({ payload }: any): any {
  try {
    const { email, password } = payload
    const data = yield call(api.signIn, email, password)
    if (data.error) {
      yield put(
        actionSignInFailure(
          t`Login failed, please verify that you are using the correct email and password`
        )
      )
      yield delay(3000)
      yield put(actionSignInFailure(''))
    } else {
      yield refetchRegistry()
      yield put(actionSignInSuccess(data))
      yield put(actionCloseModal())
      yield put(actionSetCollapsedSideMenu(true))
      yield all([fetchAccountData(true), onUpdateGames()])
    }
  } catch (err) {
    yield put(actionSignInFailure(err.message))
    console.error(err)
  }
}

/**
 * Clear language when sign out
 */
function* resetLanguage() {
  try {
    Cookies.remove('userLanguage')
    yield UserStorage.resetLanguage()
  } catch (err) {
    console.warn(err)
  }
}

function* onSignOut(action: any): any {
  try {
    const success = yield call(api.signOut)
    const logoutRedirectionsConfig = yield select(
      (state) => state.registry.data.redirectionsConfig.logout
    )
    if (success) {
      yield resetLanguage()
      yield put(actionSetCollapsedSideMenu(true))
      if (logoutRedirectionsConfig?.urlSuccess) {
        window.location.href = logoutRedirectionsConfig?.urlSuccess
      } else {
        if (action.payload) {
          window.location.reload()
        }
      }
    } else {
      if (logoutRedirectionsConfig?.urlFailure) {
        window.location.href = logoutRedirectionsConfig?.urlFailure
      }
    }
  } catch (err) {
    console.warn(err)
  }
}

function* requestPracticeMode(action: any) {
  try {
    const { allowPracticeModeChange, confirmed } = yield select(
      (state) => state.account.userInfo
    )
    if (allowPracticeModeChange) {
      const data = yield call(api.practiceMode, action.payload)
      yield put(actionSetGlobalLoader(true))
      if (data.success) {
        yield fetchAccountData(true)
      }
      yield put(actionSetGlobalLoader(false))
      if (!action.payload) {
        yield put(actionCloseModal())
        if (confirmed) {
          const wallet = yield select((state) => state.wallets)
          const balance = wallet.availableBonus + wallet.availableCash
          if (balance < 1)
            yield put(actionShowModal(ModalTypes.MAKE_DEPOSIT, {}))
        } else {
          yield put(actionShowModal(ModalTypes.EMAIL_CONFIRMATION, {}))
        }
      }
    } else {
      yield put(actionAddMessage('Changing practice mode is not allowed'))
    }
  } catch (err) {
    console.warn(err)
    yield put(actionSetGlobalLoader(false))
  }
}

function* onRemoveInstrumentFromFavorites(action: any) {
  try {
    const data = yield call(api.starInstrument, action.payload, true)

    if (data.success) {
      const userFavorites = yield select(
        (state) => state.account.userInfo.favAssets
      )
      const newFavorites: string[] = userFavorites.filter(
        (item: string) => item !== action.payload
      )
      yield put(actionUpdateFavorites(newFavorites))
    } else {
      yield put(actionShowModal(ModalTypes.NETWORK_ERROR, {}))
    }
  } catch (err) {
    console.warn(err)
  }
}

function* onAddInstrumentToFavorites(action: any) {
  try {
    const data = yield call(api.starInstrument, action.payload, false)

    if (data.success) {
      const userFavorites = yield select(
        (state) => state.account.userInfo.favAssets
      )
      const newFavorites: string[] = [...userFavorites, action.payload]
      yield put(actionUpdateFavorites(newFavorites))
    } else {
      yield put(actionShowModal(ModalTypes.NETWORK_ERROR, {}))
    }
  } catch (err) {
    console.warn(err)
  }
}

function* onRemoveInstrumentFromTop(action: any) {
  try {
    const data = yield call(api.topInstrument, action.payload, true)

    if (data.success) {
      const userTop = yield select((state) => state.account.userInfo.topAssets)
      const newTop: string[] = userTop.filter(
        (item: string) => item !== action.payload
      )
      yield put(actionUpdateTop(newTop))
    } else {
      yield put(actionShowModal(ModalTypes.NETWORK_ERROR, {}))
    }
  } catch (err) {
    console.warn(err)
  }
}

function* onAddInstrumentToTop(action: any) {
  try {
    const data = yield call(api.topInstrument, action.payload, false)

    if (data.success) {
      const userTop = yield select((state) => state.account.userInfo.topAssets)
      const newTop: string[] = [...userTop, `${action.payload}`]
      yield put(actionUpdateTop(newTop))
    } else {
      yield put(actionShowModal(ModalTypes.NETWORK_ERROR, {}))
    }
  } catch (err) {
    console.warn(err)
  }
}

/**
 * Saga which will call itself on success and sleep 60 seconds
 * @param params
 */
function* startUserPing(retry: number = 0): any {
  try {
    const { success } = yield call(api.ping)
    if (success) {
      yield delay(60000)
      yield call(startUserPing, retry + 1)
    } else {
      const userInfo = yield select((state) => state.account.userInfo)
      const isDemo = userInfo ? userInfo.isDemo && userInfo.isDemoActive : false
      if (isDemo) {
        yield put(actionShowModal(ModalTypes.GUESTDEMO_EXPIRED, {}))
      } else {
        // yield put(actionShowModal(ModalTypes.SESSION_EXPIRED, {}))
        const logoutRedirection = yield select(
          (state) => state.registry.data.redirectionsConfig.logout.urlSuccess
        )
        window.location.href = logoutRedirection
      }
      yield put(actionResetUser())
      yield put(actionResetWallets())
      yield put(actionResetTrades())
    }
  } catch (err) {
    console.error('Ping failed', err)
  }
}

/**
 * Guest demo button pressed
 * Implements a fxcfd algorithm
 * 1) Show loader
 * 2) Reload page when cookies are set
 */
function* onGuestDemo() {
  try {
    yield put(actionSetGlobalLoader(true))

    const fingerprint = (window as any).fingerprint
    localStorage.setItem('demoAccountID', fingerprint)

    const state = yield call(api.createDemoAccount, fingerprint)

    if (state.success) {
      const data = yield call(api.getRegistry)
      if (data.loggedIn) {
        console.log('Debug ~ function*onGuestDemo ~ data:', data)
        yield put(actionUpdateRegistry(data))
        yield put(actionSetLoggedIn(data.loggedIn))
        yield fetchAccountData(true)
      } else {
        yield put(
          actionAddMessage(
            'Technical error: could not login into guest demo account'
          )
        )
      }
      yield put(actionSetGlobalLoader(false))
    } else {
      yield put(actionSetGlobalLoader(false))
      yield put(
        actionAddMessage(state.message || 'Technical error: could not login')
      )
    }
  } catch (err) {
    console.warn(err)
    yield put(actionSetGlobalLoader(false))
  }
}

/**
 * Event from LS-feed
 * Show modal, reset state, do logout (don't clear localStorage)
 */
function* onGuestDemoExpired() {
  yield put(actionShowModal(ModalTypes.GUESTDEMO_EXPIRED, {}))
  yield put(actionResetUser())
  yield put(actionResetWallets())
  yield put(actionResetTrades())
  yield put(actionLogout(false))
}

/**
 * Update backend with selected wallet
 */
function* onSelectBonusWallet(action: any) {
  const { payload } = action
  yield put(actionSelectBonusWallet(payload))
  const resp = yield call(api.selectBonusForVolume, payload)
  if (resp) {
    if (!resp.success) {
      yield put(actionAddMessage(resp.message))
    }
  }
}
/**
 * Update user data
 */
export function* onFetchUserInfo() {
  const userInfo = yield call(api.fetchUserInfo)
  yield put(actionSetUserInfo(userInfo))
  const partnerConfig = yield select(
    (state) => state.registry.data.partnerConfig
  )
  if (
    typeof (
      partnerConfig[partnerConfig.defaultTheme] || partnerConfig.themePrimary
    ) === 'object'
  )
    yield put(
      actionSetTheme(
        partnerConfig[partnerConfig.defaultTheme] || partnerConfig.themePrimary
      )
    )
}

function* accountSaga() {
  yield takeEvery(ADD_INSTRUMENT_TO_FAVS, onAddInstrumentToFavorites) // add instrument to fav
  yield takeEvery(REMOVE_INSTRUMENT_FROM_FAVS, onRemoveInstrumentFromFavorites) // remove instrument from fav
  yield takeEvery(ADD_INSTRUMENT_TO_TOP, onAddInstrumentToTop) // add instrument to top
  yield takeEvery(REMOVE_INSTRUMENT_FROM_TOP, onRemoveInstrumentFromTop) // remove instrument from top
  yield takeLatest(START_PING, startUserPing) // user ping
  yield takeLatest(GUEST_DEMO_REQUEST, onGuestDemo) // guest demo requested
  yield takeLatest(GUEST_DEMO_EXPIRED, onGuestDemoExpired)
  yield takeLatest(SIGN_IN_REQUEST, requestSignIn) // sign in requested
  yield takeLatest(LOG_OUT, onSignOut) // log out requested
  yield takeLatest(ACCOUNT_REFRESH, onFetchUserInfo) // user info refresh requested
  yield takeLatest(SELECT_BONUS_WALLET_REMOTE, onSelectBonusWallet) // wallet picked
  yield takeLatest(SET_PRACTICE_MODE, requestPracticeMode) // practice mode clicked
}

export default accountSaga
