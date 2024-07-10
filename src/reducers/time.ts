import { TIME_UPDATE } from "../actions/time"

const defaultState =  Number(new Date())

const timeReducer = (state: number = defaultState, action: any) => {
  switch (action.type) {
    case TIME_UPDATE:
      return action.payload
    default:
      return state
  }
}

export default timeReducer