/**
 * Registry state
 * holds loading, registry object
 */
import {
  SET_ACCOUNT,
  SET_FAVORITES,
  SET_USER_INFO,
  SIGN_IN_FAIL,
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SET_LOGOUT,
  SET_TOP,
} from '../actions/account'
import { IUserInfo } from '../core/API'

interface IAccountReducerState {
  authenticating: boolean
  loggedIn: boolean
  userInfo: IUserInfo | null
}

const defaultState = {
  authenticating: false,
  loggedIn: false,
  userInfo: null,
  errorMessage: '',
  successMessage: '',
}

const accountReducer = (
  state: IAccountReducerState = defaultState,
  action: any
) => {
  switch (action.type) {
    case SIGN_IN_REQUEST:
      return {
        ...state,
        authenticating: true,
      }
    case SIGN_IN_FAIL:
      return {
        authenticating: false,
        errorMessage: action.payload,
        successMessage: '',
      }
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        authenticating: false,
        loggedIn: true,
        errorMessage: '',
        successMessage: action.payload.message,
      }
    case SET_ACCOUNT:
      return {
        ...state,
        loggedIn: action.payload.loggedIn,
      }
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      }
    case SET_FAVORITES:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          favAssets: action.payload,
        },
      }
    case SET_TOP:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          topAssets: action.payload,
        },
      }
    case SET_LOGOUT:
      return {
        ...state,
        loggedIn: false,
        userInfo: null,
      }
    default:
      return state
  }
}

export default accountReducer
