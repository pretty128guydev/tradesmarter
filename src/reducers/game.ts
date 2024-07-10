import { IGame } from './games'
import { SELECT_GAME } from '../actions/game'
import { cloneDeep } from 'lodash'

const gameReducer = (state: IGame | null = null, action: any) => {
  switch (action.type) {
    case SELECT_GAME:
      return cloneDeep(action.payload)
    default:
      return state
  }
}

export default gameReducer
