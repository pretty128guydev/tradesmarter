/**
 * Implements an expiry state
 */
import { SELECT_EXPIRY, UNSET_EXPIRY, EXPIRY_TIME } from '../actions/expiry'

export interface IExpiryReducerState {
  selected: number | null
  expiryTime: ''
}

const expiryReducer = (
  state: IExpiryReducerState | null = {
    selected: null,
    expiryTime: '',
  },
  action: any
) => {
  switch (action.type) {
    case SELECT_EXPIRY:
      return {
        ...state,
        selected: action.payload,
      }
    case UNSET_EXPIRY:
      return {
        selected: null,
      }
    case EXPIRY_TIME:
      return {
        ...state,
        expiryTime: action.payload,
      }
    default:
      return state
  }
}

export default expiryReducer
