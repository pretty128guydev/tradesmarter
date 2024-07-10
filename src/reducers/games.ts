/**
 * Holds array of games for the selected instrument
 */
import { SET_GAMES } from '../actions/games'

export interface IGamesReducerState {
  [id: string]: IGame[]
}
export interface IGame {
  round: number // 60
  expiry: number // 60;
  deadPeriod: number // 30
  gameType: number // 2
  payout: string // ""
  rebate: string // ""
  timestamp: string | Date // "2020-11-05T14:06:00.000Z"
  disabled: boolean // true/false
  isCfdOptions?: boolean
  isAboveBelow?: boolean
  cdfExpiry?: number
  distance?: number
}

const gameReducer = (state: IGamesReducerState | null = null, action: any) => {
  switch (action.type) {
    case SET_GAMES:
      return action.payload
    default:
      return state
  }
}

export default gameReducer
