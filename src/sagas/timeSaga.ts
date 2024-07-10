// @ts-nocheck 7057
/**
 * Adjust timer each second
 * Check if game is in dead period and try to refresh it
 */
import { put, takeLatest, select, delay } from 'redux-saga/effects'
import { actionSetTime, TIME_START, TIME_UPDATE } from '../actions/time'
import { getPositionsForExpiry } from '../components/selectors/positions'
import { onRecreateGame } from './tradingSaga'

function* onTimer() {
  while (true) {
    const time = yield select((state: any) => state.time)
    yield put(actionSetTime(time + 1000))
    yield delay(1000)
  }
}

/**
 * Figure out if current game has active expiries
 * @returns
 */
export function* shouldEnterDeadPeriod() {
  try {
    const game = yield select((state) => state.game)
    const gamesFn = yield select(getPositionsForExpiry)
    const games = gamesFn(game)
    return games ? games.length > 0 : false
  } catch (err) {
    console.warn('Skipping dead period', err)
    return false
  }
}
/**
 * Handle per-second side effect
 * Used to recalculate expiries by reselecting the instrument to
 * -> reuse instrument side effect which recalculates new expiries
 */
function* onTimeUpdate(action: any) {
  if (action.payload % 30000 <= 1000) {
    yield onRecreateGame()
  } else {
    const game = yield select((state) => state.game)
    if (game) {
      const deadPeriodStart =
        Number(game.timestamp as Date) - game.deadPeriod * 1000
      if (deadPeriodStart < action.payload) {
        yield onRecreateGame(true)
      }
    }
  }
}

function* timeSaga() {
  yield takeLatest(TIME_START, onTimer) // called on start
  yield takeLatest(TIME_UPDATE, onTimeUpdate)
}

export default timeSaga
