// @ts-nocheck 7057
/**
 * Handle trading side effects
 */
import {
  all,
  call,
  delay,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'
import { some, uniq } from 'lodash'
import { actionSetGames } from '../actions/games'
import { actionAddMessage } from '../actions/messages'
import { REFRESH_WALLETS, actionSetWallets } from '../actions/wallets'
import {
  DOUBLE_UP_REQUESTED,
  HEDGE_REQUESTED,
  SELL_BACK_DO,
  SELL_BACK_REQUESTED,
  actionSetClosedTrades,
  actionSetOpenTrades,
} from '../actions/trades'
import {
  actionGameEnteredDeadPeriod,
  actionLockAdd,
  actionLockRelease,
  actionSetCurrentPayout,
  actionSetDirection,
  actionSetTradeable,
  actionSetTradingTimeout,
  SELECT_INSTRUMENT,
  SET_TRADING_TIMEOUT,
  SUBMIT_TRADE_FAILURE,
  SUBMIT_TRADE_REQUEST,
  SUBMIT_TRADE_SUCCESS,
  TIMED_CANCEL_TRADE,
  SET_PRODUCT_TYPE,
  actionSetDistances,
  actionSelectBonusWallet,
} from '../actions/trading'
import { IInstrument, IRegistry, ITradingHour } from '../core/API'
import { api } from '../core/createAPI'
import { openExpiriesByGameType } from '../core/games'
import { getCurrentPayout } from '../core/currentPayout'
import { actionCloseModal, actionShowModal, ModalTypes } from '../actions/modal'
import { getInstrumentObject } from '../components/selectors/instruments'
import { onFetchTrades, onFetchWalletDetails } from './registrySaga'
import { IGame } from '../reducers/games'
import { t } from 'ttag'
import { actionSetSidebar } from '../actions/sidebar'
import { SidebarState } from '../reducers/sidebar'
import { IOpenTrade } from '../core/interfaces/trades'
import {
  actionSelectGame,
  SELECT_GAME,
  SELECT_NEXT_GAME,
} from '../actions/game'
import { getPositionsForExpiry } from '../components/selectors/positions'
import { actionDeselectExpiry, actionSelectExpiry } from '../actions/expiry'
import {
  actionShowNotification,
  NotificationTypes,
} from '../actions/notifications'
import {
  ITradeNotificationErrorProps,
  ITradeNotificationSuccessProps,
} from '../components/notifications/TradeSubmit/interfaces'
import {
  isAboveBelowProductType,
  isCfdOptionsProductType,
} from '../components/selectors/trading'
import LSFeed from '../core/feed'
import {
  actionSetCfdOptionInstrument,
  actionSetCfdOptionsActiveDirection,
} from '../actions/trading'
import { actionSetShowBottomPanel } from '../actions/container'

/**
 * Check actual games of this instrument if no games than it is out of trading hours
 * Flatten arrays and check size of results
 */
const isInstrumentTradeable = (
  instrument: IInstrument,
  isCfdOptions: boolean
): boolean => {
  if (!instrument) return true
  const { tradingHours } = instrument
  if (isCfdOptions) {
    const cfdTradingHours = tradingHours.find((t) => t.gameType === 12)
    return cfdTradingHours?.isOpen || false
  } else {
    const normalTradingHours = tradingHours.filter((t) => t.gameType !== 12)
    return some(normalTradingHours, (n) => n.isOpen)
  }
}

/**
 * Pick first game when default condition is not met
 * @param games
 */
const gamesFallback = (games: any) => Object.values(games).flat()[0]

/**
 * Select available game, prioritize first or return null
 * @param games
 */
export const pickGame = (games: any, defaultGameType: number) => {
  const game = games[defaultGameType]?.[0]
  // let game
  // if (defaultGameType === 2) {
  // 	game = games[2][1] // If defaultGameType = 2 then default selected should always be the second option (in 99% it will be 60 secs)
  // } else {
  // 	game = games[defaultGameType][0] // otherwise pick first of default gameType
  // }
  return game ? game : gamesFallback(games)
}

/**
 * Select similar game from games collection
 * @param games
 * @param game
 */
const pickSimilarGame = (games: any, target: IGame): IGame => {
  const list: any[] = Object.values(games).flat()
  return list.find(
    (game: IGame) =>
      game?.deadPeriod === target?.deadPeriod &&
      game?.round === target?.round &&
      game?.gameType === target?.gameType &&
      game?.expiry === target?.expiry
  )
}

/**
 * Handle side-effect for LS Feed
 * @param action
 */
// eslint-disable-next-line require-yield
function* onInstrumentSelect(action: any) {
  const id = action.payload

  const isCfdOptions = yield select(isCfdOptionsProductType)
  const isAboveBelow = yield select(isAboveBelowProductType)
  if (isCfdOptions) {
    const prices = yield call(api.fetchOptionPrices, id)
    yield put(actionSetCfdOptionInstrument(prices.data.option_prices))

    LSFeed.getInstance().subscribeToCfdOptions(id)
  }
  if (isAboveBelow) {
    LSFeed.getInstance().selectInstrument(id)
  }

  const instrument = yield select((state) => state.instruments[id])
  const { defaultGameType } = instrument
  const games = yield getGamesForInstrument(id)
  const isWorkingHours = isInstrumentTradeable(instrument, isCfdOptions)
  yield put(actionSetTradeable(isWorkingHours))

  const { success, data } = yield call(api.fetchDistances, id)
  if (success) {
    const { distances: rawDistance } = data
    const distances: any[] = Object.keys(rawDistance[0]).map((d, i) => {
      const payout = instrument.payouts?.find((p) => p.gameType === 3)
      const payoutRange = payout?.payoutRanges?.find((p) => p.chance === 35)

      return {
        payout: payoutRange?.payout || 0,
        timestamp: new Date(parseInt(d)),
        distance: rawDistance[0][d]['35'],
        deadPeriod: 30,
        isAboveBelow: true,
        disabled: false,
        gameType: 3,
      }
    })
    yield put(actionSetDistances(`distance_${id}`, distances))
  }

  if (isWorkingHours) {
    if (!isAboveBelow) {
      yield put(actionSetGames(games))
      const game = pickGame(games, Number(defaultGameType))
      if (game) {
        yield put(actionSelectGame(game))
      }
    } else {
      const payout = instrument.payouts.find((p) => p.gameType === 3)
      const payoutRange = payout.payoutRanges?.find((p) => p.chance === 35)
      yield put(actionSetCurrentPayout(payoutRange.payout))
    }
  } else {
    yield put(actionSelectGame(null))
  }
}

const gamesForInstrumentSelector = (state: any) => ({
  registry: state.registry.data,
  instruments: state.instruments,
  clock: state.time,
})
/**
 * Calculate list of games for instrument by instrument id
 * @param id
 */
function* getGamesForInstrument(id: number) {
  try {
    const { registry, instruments, clock } = yield select(
      gamesForInstrumentSelector
    )
    const instrument = instruments[id]

    const gameTypes = getGameTypesForInstrument(instrument, registry)

    const games = openExpiriesByGameType(registry, instrument, gameTypes, clock)

    return games
  } catch (err) {
    console.error(err)
    return {}
  }
}
/**
 * One of the main function: figure out what gamesTypes we should be looking at in games.js
 * Get gamesTypes from .tradingHours add short and long gameTypes
 * @param instrument
 */
const getGameTypesForInstrument = (
  instrument: IInstrument,
  registry: IRegistry
): number[] => {
  if (!instrument) return []
  const result = Object.values(instrument.tradingHours).map(
    (tradingHour: ITradingHour) => tradingHour.gameType
  )
  if (registry.shortGames.includes(instrument.instrumentID)) {
    result.push(2)
  }
  if (registry.longTermGames.includes(instrument.instrumentID)) {
    result.push(11)
  }
  if (registry.optionCfdGames.includes(instrument.instrumentID)) {
    result.push(12)
  }
  return uniq(
    result.filter((gameType: number) => [1, 2, 11, 12].includes(gameType))
  )
}

/**
 * Effect which will be called in parrallel with modal
 * @param response
 * @param timeout
 */
function* onTradeSubmitted(response: any, timeout: number) {
  yield put({ type: SUBMIT_TRADE_SUCCESS })

  // const { allowTimedCancel, tradeID } = response.details
  // yield put(
  //   actionShowNotification<ITradeNotificationSuccessProps>(
  //     NotificationTypes.TRADE_SUBMITTED_SUCCESS,
  //     {
  //       timeout,
  //       allowTimedCancel,
  //       tradeID,
  //       success: true,
  //     }
  //   )
  // )

  yield put(actionSetTradingTimeout(timeout))
}

/**
 * Get min stake per current game
 * @param gameType
 * @param registry
 */
const getMinStakeForGame = (gameType: number, investmentLimits: any) => {
  const gameTypeToMinStake: any = {
    1: 'minStake',
    2: 'minStake60sec',
    3: 'minStake',
    11: 'minStakeLongTerm',
    12: 'minStakeOptionsCfd',
  }

  const fieldName = (gameTypeToMinStake as any)[gameType]

  return parseFloat((investmentLimits as any)[fieldName])
}

/**
 * Get max stake for game
 * @param gameType
 * @param param1
 */
const getMaxStakeForGame = (gameType: number, investmentLimits: any) => {
  const gameTypeToMinStake: any = {
    1: 'maxStake',
    2: 'maxStake60sec',
    3: 'maxStake',
    11: 'maxStakeLongTerm',
    12: 'maxStakeOptionsCfd',
  }

  const fieldName = (gameTypeToMinStake as any)[gameType]

  return parseFloat((investmentLimits as any)[fieldName])
}

function* onSubmitTrade(action: any) {
  try {
    /**
     * Verify that min stake reached for this trade
     */
    const { gameType, stake, openPanel, expiry } = action.payload
    const investmentLimits = yield select(
      (state) => state.registry.data.investmentLimits
    )
    const minStake = getMinStakeForGame(gameType, investmentLimits)
    const maxStake = getMaxStakeForGame(gameType, investmentLimits)

    if (stake < minStake) {
      yield put({ type: SUBMIT_TRADE_FAILURE })
      yield put(
        actionShowNotification<ITradeNotificationErrorProps>(
          NotificationTypes.TRADE_SUBMITTED_ERROR,
          {
            success: false,
            minStake,
          }
        )
      )
    }

    if (stake > maxStake) {
      yield put({ type: SUBMIT_TRADE_FAILURE })
      yield put(
        actionShowNotification<ITradeNotificationErrorProps>(
          NotificationTypes.TRADE_SUBMITTED_ERROR,
          {
            success: false,
            maxStake,
          }
        )
      )
    }

    if (stake >= minStake && stake <= maxStake) {
      const timeout = yield select((state) =>
        Number(state.registry.data.partnerConfig.cancelTradePeriod)
      )
      const response = yield call(api.createTrade, action.payload)
      if (response.success) {
        yield put(actionSetDirection(0)) // reset high/low direction: requirement AN2-1319
        yield onCreateTradeSuccess(response.bundle)
        yield onTradeSubmitted(response, timeout)
        yield put(actionSelectExpiry(expiry))

        if (openPanel) {
          const showTradesBottom = yield select((state) =>
            Number(state.registry.data.partnerConfig.showTradesBottom)
          )
          if (showTradesBottom) {
            yield put(actionSetShowBottomPanel(true))
          } else {
            yield put(actionSetSidebar(SidebarState.positions))
          }
        }
      } else {
        yield put(
          actionShowNotification<ITradeNotificationErrorProps>(
            NotificationTypes.TRADE_SUBMITTED_ERROR,
            {
              success: false,
              message: response.message,
            }
          )
        )
        yield put({ type: SUBMIT_TRADE_FAILURE })
      }
    }
  } catch (err) {
    console.warn(err)
    yield put({ type: SUBMIT_TRADE_FAILURE })
  }
}

/**
 * Timed cancel
 * @param action
 */
function* onTimedCancelTrade(action: any) {
  try {
    const response = yield call(api.cancelTimedTrade, action.payload)
    yield put(actionCloseModal())
    if (response.success) {
      yield put(actionAddMessage(t`Cancelled Successfully`))
      yield onRefreshAccountData() // refresh open positions, closed positions tab
    } else {
      yield put(actionAddMessage(response.message.body))
    }
  } catch (err) {
    console.warn(err)
  }
}

/**
 * Find a trade reference
 * Ask server how much money we can refund, display a window with yes/no
 * @param action
 */
function* onSellBack(action: any) {
  const { tradeID, x, y } = action.payload
  const openTrades = yield select((state) => state.trades.open)
  const trade = openTrades.find(
    (target: IOpenTrade) => target.tradeID === tradeID
  )
  yield put(actionLockAdd(tradeID))
  const resp = yield call(api.getSellbackAmount, tradeID)
  if (resp) {
    const { success, amount } = resp
    if (success) {
      yield put(actionLockRelease(tradeID))
      yield put(
        actionShowModal(ModalTypes.SELLBACK, {
          x,
          y,
          amount,
          trade,
          timeleft: 5,
        })
      )
    } else {
      yield put(actionLockRelease(tradeID))
      yield put(
        actionShowNotification<ITradeNotificationErrorProps>(
          NotificationTypes.TRADE_SUBMITTED_ERROR,
          {
            success: false,
            message: resp.message,
          }
        )
      )
    }
  } else {
    yield put(actionLockRelease(tradeID))
    yield put(actionAddMessage('Could not get response from server'))
  }
}
/**
 * Do a sellback: close modal, call server, refresh status on success
 * @param action
 */
function* onDoSellback(action: any) {
  yield put(actionCloseModal()) // side effect to close modal

  const { trade, amount } = action.payload
  yield put(actionLockAdd(trade.tradeID))
  const resp = yield call(api.sellback, trade.tradeID, amount, trade.stake)
  if (resp) {
    const { success } = resp
    if (success) {
      yield put(actionLockRelease(trade.tradeID))
      yield onRefreshAccountData()
      yield put(
        actionShowNotification(NotificationTypes.TRADE_SUBMITTED_SELLBACK)
      )
    } else {
      yield put(actionLockRelease(trade.tradeID))
      yield put(
        actionShowNotification<ITradeNotificationErrorProps>(
          NotificationTypes.TRADE_SUBMITTED_ERROR,
          {
            success: false,
            message: resp.message,
          }
        )
      )
    }
  } else {
    yield put(actionLockRelease(trade.tradeID))
    yield put(actionAddMessage('Could not get response from server'))
  }
}

/**
 * Clone the trade, change direction and send to the server
 * @param action
 */
function* onHedge(action: any) {
  const trade: IOpenTrade = action.payload
  const practice = yield select((state) =>
    state.account.userInfo?.practiceMode ? 1 : 0
  )
  const userCurrency = yield select((state) =>
    state.wallets ? state.wallets.userCurrency : 1
  )
  const newTrade = {
    // Old platform compability
    type: trade.gameType,
    strike: trade.strike,
    userCurrency,
    practice,
    source: 'Simple-Trader',
    wow: 'true',
    // New platform data
    distance: trade.distance,
    payout: trade.payout,
    rebate: trade.rebate,
    stake: +trade.stake,
    instrumentID: trade.instrumentID,
    userCurrencyStake: +trade.stake,
    gameType: trade.gameType, // trade.gameType, // problem!
    expiry: trade.expiryTimestamp,
    opensAs: 2, // 2 for hedge, 3 for double up
    direction: trade.direction * -1,
    openAsTradeID: trade.tradeID,
  }
  yield put(actionLockAdd(trade.tradeID))
  const resp = yield call(api.createTrade, newTrade)
  if (resp.success) {
    yield onCreateTradeSuccess(resp.bundle)
    yield put(actionLockRelease(trade.tradeID))
  } else {
    yield put(actionLockRelease(trade.tradeID))
    yield put(
      actionShowNotification<ITradeNotificationErrorProps>(
        NotificationTypes.TRADE_SUBMITTED_ERROR,
        {
          success: false,
          message: resp.message,
        }
      )
    )
  }
}

/**
 * Clone the trade
 * @param action
 */
function* onDoubleUp(action: any) {
  const trade: IOpenTrade = action.payload
  const practice = yield select((state) =>
    state.account.userInfo?.practiceMode ? 1 : 0
  )
  const userCurrency = yield select((state) =>
    state.wallets ? state.wallets.userCurrency : 1
  )

  const newTrade = {
    // Old platform compability
    type: trade.gameType,
    strike: trade.strike,
    userCurrency,
    practice,
    source: 'Simple-Trader',
    wow: 'true',
    // New platform data
    distance: trade.distance,
    payout: trade.payout,
    rebate: trade.rebate,
    stake: +trade.stake,
    instrumentID: trade.instrumentID,
    userCurrencyStake: +trade.stake,
    gameType: trade.gameType, // trade.gameType,
    expiry: trade.expiryTimestamp,
    opensAs: 3, // 2 for hedge, 3 for double up
    direction: trade.direction,
    openAsTradeID: trade.tradeID,
  }
  yield put(actionLockAdd(trade.tradeID))
  const resp = yield call(api.createTrade, newTrade)
  if (resp.success) {
    yield onCreateTradeSuccess(resp.bundle)
    yield put(actionLockRelease(trade.tradeID))
  } else {
    yield put(actionLockRelease(trade.tradeID))
    yield put(
      actionShowNotification<ITradeNotificationErrorProps>(
        NotificationTypes.TRADE_SUBMITTED_ERROR,
        {
          success: false,
          message: resp.message,
        }
      )
    )
  }
}

/**
 * Refresh wallet, closed trades, open positions
 */
function* onRefreshAccountData(checkSwitchReal?: boolean) {
  yield all([
    yield onFetchWalletDetails(checkSwitchReal),
    yield onFetchTrades(),
  ])
}

function* onCreateTradeSuccess(bundle: any) {
  const { trades, walletDetails } = bundle
  const { open, closed } = trades

  yield put(
    actionSetClosedTrades({
      closed: closed.rows,
      totalPages: closed.pages,
      currentPage: 1,
    })
  )
  yield put(actionSetOpenTrades(open))

  const { wallet } = walletDetails

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

  if (userInfo.practiceMode) {
    const balance = wallet.availableBonus + wallet.availableCash
    if (!userInfo.isDemo && balance < Number(investmentLimits.defaultStake))
      yield put(actionShowModal(ModalTypes.SWITCH_TO_REAL, {}))
  }
}

/**
 * Create a timer to reset
 * @param action
 */
function* onTradingTimeout(action: any) {
  if (action.payload > 0) {
    yield delay(action.payload * 1000)
    yield put(actionSetTradingTimeout(0))
  }
}

/**
 * Adjust payout
 * @param action
 */
function* onSelectGame(action: any) {
  const { payload, disabled } = action
  /**
   * Reset dead period on select
   */
  yield put(actionGameEnteredDeadPeriod(disabled))
  /**
   * Payout logic
   */
  if (payload) {
    /**
     * If game has trades than select expiry or unselect
     */
    const trades = yield select(getPositionsForExpiry)
    if (Array.isArray(trades)) {
      const [trade] = trades
      if (trade) {
        yield put(actionSelectExpiry(trade.expiryTimestamp))
      } else {
        yield put(actionDeselectExpiry())
      }
    } else {
      yield put(actionDeselectExpiry())
    }

    const isAboveBelow = yield select(isAboveBelowProductType)
    if (!isAboveBelow) {
      const { gameType } = payload
      const instrument = yield select(getInstrumentObject)
      /**
       * Get data from registry
       */
      const { payoutDeltas, maxClientPayouts } = yield select(
        (state) => state.registry.data
      )
      /**
       * Calculate target payout
       */
      const target = getCurrentPayout(
        gameType,
        instrument,
        payoutDeltas,
        maxClientPayouts
      )
      yield put(actionSetCurrentPayout(target))
    }
  } else {
    yield put(actionSetCurrentPayout(0))
  }
}

const isNotInDeadPeriod = (game: IGame): boolean =>
  Number(game.timestamp) - game.deadPeriod * 1000 > Number(new Date())

/**
 * Get game type of current game, select next not disabled game of this gametype
 * @param action
 */
function* onSelectNextGame() {
  try {
    const currentGame: IGame = yield select((state) => state.game)
    const { gameType } = currentGame

    const isAboveBelow = yield select((state) => isAboveBelowProductType(state))

    if (isAboveBelow) {
      const distances = yield select((state) => state.trading.distances)
      const index = distances.findIndex((d) =>
        moment(d.timestamp).isSame(moment(currentGame.timestamp))
      )
      const game = distances[index + 1]
      if (game) {
        yield put(actionSelectGame(game))
      }
    } else {
      const games = yield select((state) => state.games)
      const list: any[] = Object.values(games).flat()

      const game = list.find(
        (game: IGame) => game.gameType === gameType && isNotInDeadPeriod(game)
      )

      if (game) {
        yield put(actionSelectGame(game))
      }
    }
  } catch (err) {
    console.warn('Could not select next game', err)
  }
}

const gamesSelector = (state: any) => ({
  id: state.trading.selected,
  registry: state.registry.data,
  instruments: state.instruments,
  clock: state.time,
  currentGame: state.game,
  inTradingHours: state.trading.inTradingHours,
  enteredDeadPeriod: state.trading.gameEnteredDeadPeriod,
})

/**
 * This method is called ONLY from timer
 * Does the same as onInstrumentSelect
 * Get current game and its expiry
 * Create a fresh games list, select the same with the same expiry
 */
function* onRecreateGame(adjust: boolean = false) {
  try {
    /**
     * Lets move clock one minute forward than it is in registry
     * This will allow us to create game outside of dead zone
     */
    const {
      id,
      registry,
      instruments,
      currentGame,
      inTradingHours,
      enteredDeadPeriod,
      clock,
    } = yield select(gamesSelector)
    const adjustedClock = adjust ? clock + 30000 : clock
    const instrument = instruments[id]

    const gameTypes = getGameTypesForInstrument(instrument, registry)

    const games = openExpiriesByGameType(
      registry,
      instrument,
      gameTypes,
      adjustedClock
    )
    const isCfdOptions = yield select(isCfdOptionsProductType)
    // const isWorkingHours = isInstrumentTradeable(games)
    const isWorkingHours = isInstrumentTradeable(instrument, isCfdOptions)
    if (inTradingHours !== isWorkingHours) {
      yield put(actionSetTradeable(isWorkingHours))
    }

    if (isWorkingHours) {
      yield put(actionSetGames(games))
      // const shouldRollIntoDeadPeriod = yield shouldEnterDeadPeriod()
      const shouldRollIntoDeadPeriod = false
      /**
       * Don't reselect current game game
       */
      if (!shouldRollIntoDeadPeriod) {
        const game = pickSimilarGame(games, currentGame)
        if (game) {
          if (game !== currentGame) {
            yield put(actionSelectGame(game))
          }

          if (enteredDeadPeriod !== game.disabled) {
            yield put(actionGameEnteredDeadPeriod(game.disabled))
          }
        }
      }
    } else {
      yield put(actionSelectGame(null))
    }
  } catch (err) {
    console.error(err)
    return {}
  }
}
/**
 * Fully recreate a games array
 */
function* onUpdateGames() {
  try {
    const { id, registry, instruments, clock, currentGame } = yield select(
      gamesSelector
    )
    const instrument = instruments[id]

    const gameTypes = getGameTypesForInstrument(instrument, registry)

    const games = openExpiriesByGameType(registry, instrument, gameTypes, clock)

    yield put(actionSetGames(games))

    const isCfdOptions = yield select(isCfdOptionsProductType)
    const isWorkingHours = isInstrumentTradeable(instrument, isCfdOptions)
    yield put(actionSetTradeable(isWorkingHours))

    const game = pickSimilarGame(games, currentGame)
    if (game) {
      yield put(actionSelectGame(game))
      yield put(actionGameEnteredDeadPeriod(game.disabled))
    }
  } catch (err) {
    console.error('Could not recreate games', err)
  }
}

function* onSelectProductType() {
  const isCfdOptions = yield select(isCfdOptionsProductType)
  const isAboveBelow = yield select(isAboveBelowProductType)

  let instrument
  const selected = yield select((state) => {
    if (isCfdOptions) {
      const { cfdOptionsInstruments } = state.trading
      instrument =
        cfdOptionsInstruments.find((instrument) => instrument.selected) ||
        cfdOptionsInstruments[0]
      return instrument.instrumentID
    } else if (isAboveBelow) {
      const { aboveBelowInstruments } = state.trading
      instrument =
        aboveBelowInstruments.find((instrument) => instrument.selected) ||
        aboveBelowInstruments[0]
      return instrument.instrumentID
    } else {
      return state.trading.selected
    }
  })

  if (isCfdOptions) {
    const prices = yield call(api.fetchOptionPrices, selected)
    if (prices.data) {
      yield put(actionSetCfdOptionInstrument(prices.data.option_prices))
    }
    return LSFeed.getInstance().subscribeToCfdOptions(selected)
  }

  if (isAboveBelow) {
    const { success, data } = yield call(
      api.fetchDistances,
      instrument.instrumentID
    )
    if (success) {
      const { distances: rawDistance } = data
      const distances: any[] = Object.keys(rawDistance[0]).map((d, i) => {
        const payout = instrument.payouts?.find((p) => p.gameType === 3)
        const payoutRange = payout?.payoutRanges?.find((p) => p.chance === 35)

        return {
          payout: payoutRange?.payout || 0,
          timestamp: new Date(parseInt(d)),
          distance: rawDistance[0][d]['35'],
          deadPeriod: 30,
          isAboveBelow: true,
          disabled: false,
          gameType: 3,
        }
      })
      yield put(
        actionSetDistances(`distance_${instrument.instrumentID}`, distances)
      )
      yield put(actionSelectGame(distances[0]))
    }

    LSFeed.getInstance().selectInstrument(selected)
  }

  yield put(actionSetCfdOptionInstrument(null))
  yield put(actionSetCfdOptionsActiveDirection(null))
}

function* tradingSaga() {
  yield takeLatest(SELECT_INSTRUMENT, onInstrumentSelect)
  yield takeLatest(SUBMIT_TRADE_REQUEST, onSubmitTrade)
  yield takeLatest(TIMED_CANCEL_TRADE, onTimedCancelTrade)
  yield takeEvery(SELL_BACK_DO, onDoSellback)
  yield takeEvery(SELL_BACK_REQUESTED, onSellBack)
  yield takeEvery(HEDGE_REQUESTED, onHedge)
  yield takeEvery(DOUBLE_UP_REQUESTED, onDoubleUp)
  yield takeLatest(REFRESH_WALLETS, onFetchWalletDetails)
  yield takeLatest(SET_TRADING_TIMEOUT, onTradingTimeout)
  yield takeLatest(SELECT_GAME, onSelectGame)
  yield takeLatest(SELECT_NEXT_GAME, onSelectNextGame)
  yield takeLatest(SET_PRODUCT_TYPE, onSelectProductType)
}

export { onRecreateGame, onUpdateGames }
export default tradingSaga
