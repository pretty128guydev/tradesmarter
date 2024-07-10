// @ts-nocheck 7057
/**
 * Handle get registry and side effects like themes
 */
import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects'
import { actionSetInstrumentsAdvanced } from '../actions/instruments'
import { actionCloseModal, actionShowModal, ModalTypes } from '../actions/modal'
import {
  actionChangeChartLibrary,
  actionChangeChartType,
  actionSetGlobalLoader,
  actionSetThemeReady,
  actionUpdateRegistry,
  CONNECT,
} from '../actions/registry'
import {
  actionSetLoggedIn,
  actionSetUserInfo,
  actionStartPing,
} from '../actions/account'
import { actionStartTimer } from '../actions/time'
import {
  actionAddMoreTrades,
  actionSetClosedTrades,
  actionSetOpenTrades,
  LOAD_MORE_TRADES_REQUEST,
  REFETCH_TRADES,
} from '../actions/trades'
import {
  actionSelectBonusWallet,
  actionSelectInstrument,
  actionSetAboveBelowInstruments,
  actionSetCfdInstruments,
  actionSetCfdRiskAmount,
  actionSetInstruments,
  actionSetProductType,
  actionSetProductTypes,
  FORCE_UPDATE,
} from '../actions/trading'
import { actionSetWallets } from '../actions/wallets'
import { api } from '../core/createAPI'
import LSFeed from '../core/feed'
import { actionAddMessage } from '../actions/messages'
import { actionSetTheme } from '../actions/theme'
import { IInstrument } from '../core/API'
import { onFetchUserInfo } from './accountSaga'
import {
  defaultTopAssets,
  firstOpenAboveBelowInstrument,
  firstOpenCfdInstrument,
  firstOpenInstrument,
} from '../components/selectors/instruments'
import { ProductType } from '../reducers/trading'
import { getProductTypes } from '../components/selectors/trading'
import { isArray } from 'lodash'
import {
  actionSetCollapsedSideMenu,
  actionSetShowConfetti,
  actionSetShowSideMenu,
  actionSetShowTopMenu,
  actionSetSideMenuItems,
  actionSetTopMenuItems,
} from '../actions/container'
import UserStorage from '../core/UserStorage'
import { onLanguageSelect } from '../core/language'
import {
  getChartLibraryFromConfig,
  getChartTypeFromConfig,
} from '../components/helper'

/**
 * Should be changed for native platforms
 */
export const getIsMobile = (): boolean => window.innerWidth < 978

/**
 * Check if theme defined in URL or xprops
 */
const getTheme = (): string | null =>
  getQueryParam('themeSet') ||
  ((window as any).xprops ? (window as any).xprops.themeSet : null)

const getQueryParam = (q: string) =>
  // eslint-disable-next-line no-sparse-arrays
  (window.location.search.match(new RegExp('[?&]' + q + '=([^&]+)')) || [
    ,
    null,
  ])[1]

/**
 * Initial call
 * Call API for registry and setup feed
 */
function* fetchRegistry(): any {
  try {
    /**
     * Get local theme
     */
    const theme = yield UserStorage.getLocalTheme()
    if (theme) yield put(actionSetTheme(theme))
    /**
     * Theme support
     */
    const themeName = getTheme()
    if (themeName) {
      const theme = yield call(api.getTheme, themeName)
      yield put(actionSetTheme(theme))
    }
    yield put(actionSetThemeReady()) // will show global loader
    /**
     * Default flow
     */
    const data = yield call(api.getRegistry)
    if (data) {
      const lang = yield UserStorage.getLanguage()
      if (!lang && data.partnerConfig.defaultLang !== 'en') {
        yield onLanguageSelect(data.partnerConfig.defaultLang)
      }
      yield put(actionUpdateRegistry(data))
      yield put(actionSetLoggedIn(data.loggedIn))
      yield put(actionStartTimer())
      yield put(actionSetShowSideMenu(data.partnerConfig.platformLeftMenuShow))
      yield put(actionSetSideMenuItems(data.partnerConfig.platformLeftMenu))
      yield put(actionSetShowTopMenu(data.partnerConfig.platformTopMenuShow))
      yield put(actionSetTopMenuItems(data.partnerConfig.platformTopMenu))
      yield put(
        actionSetCfdRiskAmount(data.investmentLimits.defaultStakeOptionsCfd)
      )
      const { chartLibraryConfig } = data.partnerConfig
      let chartLibrary = getChartLibraryFromConfig(
        chartLibraryConfig.defaultLibrary
      )
      let chartType = UserStorage.getChartType()
      if (!chartType) {
        const { library, type } = getChartTypeFromConfig(
          chartLibraryConfig.defaultLibrary
        )
        chartType = type
        chartLibrary = library
      }
      yield put(actionChangeChartLibrary(chartLibrary))
      yield put(actionChangeChartType(chartType))
      /**
       * Update theme from registry, otherwise fallback from file will be used
       */
      if (!themeName) {
        yield put(
          actionSetTheme(
            data.partnerConfig[data.partnerConfig.defaultTheme] ||
              data.partnerConfig.themePrimary
          )
        )
        yield UserStorage.setLocalTheme(
          JSON.stringify(
            data.partnerConfig[data.partnerConfig.defaultTheme] ||
              data.partnerConfig.themePrimary
          )
        )
      }
      LSFeed.initialize(data)
      /**
       * Run advanced and account data in parallel
       */
      yield fetchAccountData(data.loggedIn)
      yield put(actionSetCollapsedSideMenu(true))
      yield fetchAdvanced(true)
      const soundConfig = yield UserStorage.getSoundConfig()
      if (!soundConfig) {
        yield UserStorage.setSoundConfig(
          data.partnerConfig.showConfetti ? 'on' : 'off'
        )
        yield put(actionSetShowConfetti(data.partnerConfig.showConfetti))
      } else {
        yield put(actionSetShowConfetti(soundConfig === 'on'))
      }
      yield put(actionSetGlobalLoader(false))
    } else {
      console.warn('Could not fetch registry')
    }
  } catch (err) {
    console.warn('Could not fetch registry: ', err)
  }
}

function* updateProductTypes() {
  const {
    enabledPlatformTypes,
    partnerConfig: { platformTypeDisableCountries },
    loggedIn,
  } = yield select((state) => state.registry.data)

  const country = yield call(api.getUserGeoLocation)
  const productTypes = getProductTypes(
    country,
    enabledPlatformTypes,
    platformTypeDisableCountries,
    loggedIn
  )

  yield put(actionSetProductTypes(productTypes))
}

/**
 * Registry contains different coefficents
 * Refetch registry on sign-in/sign-up
 * @param params
 */
export function* refetchRegistry() {
  const data = yield call(api.getRegistry)
  if (data) {
    yield put(actionUpdateRegistry(data))
    yield updateProductTypes()
  } else {
    console.warn('Could not refetch registry')
  }
}

/**
 * Fetch advanced data for instruments
 */
function* fetchAdvanced(selectFirst?: boolean) {
  try {
    const data = yield call(api.fetchInstruments)

    yield put(actionSetInstrumentsAdvanced(data))
    yield put(actionSetInstruments(data))
    LSFeed.getInstance().subscribeInstruments(data)
    if (selectFirst) {
      const instruments = yield select((state) => state.trading.instruments)

      const { optionCfdGames, aboveBelowGames } = yield select(
        (state) => state.registry.data
      )

      const cfdInstruments = instruments
        .filter((i) => optionCfdGames.includes(i.instrumentID))
        .map((instrument) => {
          const { tradingHours } = instrument
          const cfdTrading = tradingHours.find(
            (trading: any) => trading.gameType === 12
          )
          return {
            ...instrument,
            tradingHours: cfdTrading,
          }
        })
        .sort(
          (a: IInstrument, b: IInstrument) =>
            Number(b.isOpen) - Number(a.isOpen)
        )

      const aboveBelowInstruments = instruments
        .filter((i) => aboveBelowGames.includes(i.instrumentID))
        .map((instrument) => {
          const { tradingHours } = instrument
          const trading = tradingHours.find(
            (trading: any) => trading.gameType === 3
          )
          return {
            ...instrument,
            tradingHours: trading,
          }
        })
        .sort(
          (a: IInstrument, b: IInstrument) =>
            Number(b.isOpen) - Number(a.isOpen)
        )

      yield put(actionSetCfdInstruments(cfdInstruments))
      yield put(actionSetAboveBelowInstruments(aboveBelowInstruments))
      yield updateProductTypes()

      const { productTypes } = yield select((state) => state.trading)
      if (
        productTypes.includes(ProductType.highLow) &&
        productTypes[0] === ProductType.highLow
      ) {
        const { instrumentID } = yield select(firstOpenInstrument)
        yield put(actionSelectInstrument(instrumentID))
      }

      if (
        productTypes.includes(ProductType.cfdOptions) &&
        productTypes[0] === ProductType.cfdOptions
      ) {
        const { instrumentID } = yield select(firstOpenCfdInstrument)
        yield put(actionSelectInstrument(instrumentID))
      }

      if (
        productTypes.includes(ProductType.aboveBelow) &&
        productTypes[0] === ProductType.aboveBelow
      ) {
        const { instrumentID } = yield select(firstOpenAboveBelowInstrument)
        yield put(actionSelectInstrument(instrumentID))
      }

      yield put(actionSetProductType(productTypes[0]))

      const defaultTopAsset = yield select((state) => defaultTopAssets(state))
      const userInfo = yield select((state) => state.account.userInfo)

      if (userInfo) {
        const topAssets = userInfo.topAssets
        if (isArray(topAssets) && topAssets.length === 0) {
          userInfo.topAssets = defaultTopAsset.map(
            (asset) => asset.instrumentID
          )
        }
        yield put(actionSetUserInfo(userInfo))
      }
    }
  } catch (err) {
    console.warn(err)
  }
}

export function* onFetchWalletDetails(checkSwitchReal?: boolean) {
  const wallet = yield call(api.fetchWalletDetails)
  yield put(actionSetWallets(wallet))
  /**
   * Select bonus in local state
   * Will not send request to select on backend
   */
  yield put(
    actionSelectBonusWallet(
      wallet.bonusesInfo.find((bonus: any) => bonus.active === true)
    )
  )

  const userInfo = yield select((state) => state.account.userInfo)
  const investmentLimits = yield select(
    (state) => state.registry.data.investmentLimits
  )
  if (checkSwitchReal && userInfo.practiceMode) {
    const balance = wallet.availableBonus + wallet.availableCash
    if (!userInfo.isDemo && balance < Number(investmentLimits.defaultStake))
      yield put(actionShowModal(ModalTypes.SWITCH_TO_REAL, {}))
  }
}

export function* onFetchTrades() {
  const trades = yield call(api.fetchTrades)
  const { success, open, closed } = trades
  if (success) {
    yield put(
      actionSetClosedTrades({
        closed: closed.rows,
        totalPages: closed.pages,
        currentPage: 1,
      })
    )
    yield put(actionSetOpenTrades(open))
  } else {
    yield put(actionAddMessage('Could not fetch trades'))
  }
}

/**
 * Intention to fetch mode trades
 */
export function* onFetchMoreTrades() {
  try {
    const { totalPages, currentPage } = yield select((state) => state.trades)
    const page = Math.min(currentPage + 1, totalPages)
    const trades = yield call(api.fetchTrades, { page })

    const { success, closed } = trades
    if (success) {
      if (closed.rows) {
        yield put(
          actionAddMoreTrades({
            closed: closed.rows,
            currentPage: page,
          })
        )
      }
    } else {
      yield put(actionAddMessage('Could not fetch more trades'))
    }
  } catch (err) {
    console.warn('Could not fetch more trades', err)
  }
}

/**
 * Reconnect to LS
 * @param loggedIn
 */
export function* fetchAccountData(loggedIn: boolean): any {
  if (loggedIn) {
    yield all([
      yield onFetchWalletDetails(),
      yield onFetchTrades(),
      yield onFetchUserInfo(),
    ])
    /**
     * Handle guest demo expired logic: when loggedIn true but no userInfo
     */
    const userInfo = yield select((state) => state.account.userInfo)
    if (userInfo) {
      LSFeed.getInstance().userSubscriptions(
        userInfo.practiceMode,
        userInfo.userID
      ) // subscribe to user personal subscriptions like trades
      if (userInfo.isDemo) {
        LSFeed.getInstance().getGuestDemoSubscription()
        if (!userInfo.isDemoActive) {
          yield put(actionShowModal(ModalTypes.GUESTDEMO_EXPIRED, {}))
        }
      }
      /**
       * Practice mode wallet expiry
       */
      if (userInfo.practiceMode) {
        const { practiceExpirationDate } = userInfo
        const expired = Number(new Date()) > practiceExpirationDate

        if (expired) {
          yield put(actionShowModal(ModalTypes.PRACTICE_EXPIRED, {}))
        } else {
          const wallet = yield select((state) => state.wallets)
          const balance = wallet.availableBonus + wallet.availableCash
          const investmentLimits = yield select(
            (state) => state.registry.data.investmentLimits
          )
          if (
            !userInfo.isDemo &&
            balance < Number(investmentLimits.defaultStake)
          ) {
            yield put(actionShowModal(ModalTypes.SWITCH_TO_REAL, {}))
          }
          if (
            !userInfo.isDemo &&
            balance > Number(investmentLimits.defaultStake)
          ) {
            yield delay(1000)
            yield put(actionShowModal(ModalTypes.PRACTICE_ACCOUNT))
          }
        }
      } else {
        /**
         * Close practice expired modal if we are not in practiceMode
         */
        const { modalName } = yield select((state) => state.modal)

        const wallet = yield select((state) => state.wallets)
        const balance = wallet.availableBonus + wallet.availableCash
        if (balance < 1) yield put(actionShowModal(ModalTypes.MAKE_DEPOSIT, {}))
        if (modalName === ModalTypes.PRACTICE_EXPIRED) {
          yield put(actionCloseModal())
        }
      }
    } else {
      yield put(actionShowModal(ModalTypes.SESSION_EXPIRED, {}))
    }
    yield put(actionStartPing())
  }
  return
}

/**
 * Fire this action to update assets from CDN
 * When lightstreamer receives a signal with timestamp
 * @param action
 */
function* updateInstruments(action: any) {
  // console.log('received payouts update, doing fetchAdvanced')
  const instrumentID = yield select((state) => state.trading.selected)
  const loggedIn = yield select((state) => state.account.loggedIn)

  const cdnUrls = yield select((state) => state.registry.data.cdnUrls)
  const { assets } = cdnUrls

  const mergeInstrumentUpdates = (
    instruments: IInstrument[],
    updates: IInstrumentUpdate[]
  ): IInstrument[] => {
    const updatesHash: any = {}
    updates.forEach((update: IInstrumentUpdate) => {
      updatesHash[update.instrumentID] = update
    })
    return instruments.map((instrument: IInstrument) => {
      const { instrumentID } = instrument
      if (updatesHash[instrumentID]) {
        const update = updatesHash[instrumentID]
        return {
          ...instrument,
          ...update,
        }
      }
      return instrument
    })
  }

  try {
    const rawInstrumentData = yield select((state) => state.trading.instruments) // get old instruments as array
    const updatesData = yield call(
      api.fetchCDNInstruments,
      assets,
      action.payload
    ) // get updates
    const instruments = mergeInstrumentUpdates(rawInstrumentData, updatesData)
    if (instruments) {
      yield put(actionSetInstruments(instruments))
      yield put(actionSetInstrumentsAdvanced(instruments))
      LSFeed.getInstance().subscribeInstruments(instruments)
      yield put(actionSelectInstrument(instrumentID))
    } else if (loggedIn) {
      yield fetchAdvancedWithDelay()
    }
  } catch (err) {
    console.warn(
      'Could not fetch instruments from CDN, fetching update from server',
      err
    )
    if (loggedIn) {
      yield fetchAdvancedWithDelay()
    }
  }
}

function* fetchAdvancedWithDelay() {
  const isPracticeMode = yield select(
    (state) => state.account.userInfo?.practiceMode
  )
  const isDemo = yield select((state) => state.account.userInfo?.isDemo)

  const min = isPracticeMode || isDemo ? 25 : 0
  const max = isPracticeMode || isDemo ? 61 : 26
  const delayMs = Math.trunc((Math.random() * (max - min) + min) * 1000)

  yield delay(delayMs)

  yield fetchAdvanced(false)
}

function* registrySaga() {
  yield takeLatest(CONNECT, fetchRegistry) // start
  yield takeLatest(FORCE_UPDATE, updateInstruments) // payouts received
  yield takeLatest(REFETCH_TRADES, onFetchTrades) // trades refresh
  yield takeLatest(LOAD_MORE_TRADES_REQUEST, onFetchMoreTrades)
}

export default registrySaga
