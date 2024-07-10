/**
 * Registry state
 * holds loading, registry object
 */
import {
  SET_LOADING,
  SET_SCREENMODE,
  UPDATE,
  SET_EMBEDDED,
  SET_THEME_READY,
  CHANGE_CHART_TYPE,
  CHANGE_CHART_LIBRARY,
} from '../actions/registry'
import {
  ChartLibrary,
  ChartType,
} from '../components/ChartContainer/ChartLibraryConfig'
import { IRegistry } from '../core/API'
import { getIsMobile } from '../sagas/registrySaga'

interface IRegistryReducerState {
  themeReady: boolean
  loading: boolean
  isMobile: boolean
  data: IRegistry | null
  embedded: null | any
  currentChartType: ChartType | null
  currentChartLibrary: ChartLibrary | null
}

const defaultState = {
  themeReady: false,
  loading: true,
  data: null,
  isMobile: getIsMobile(),
  embedded: null,
  currentChartType: null,
  currentChartLibrary: null,
}

const registryReducer = (
  state: IRegistryReducerState = defaultState,
  action: any
) => {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        data: action.payload,
      }
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case SET_SCREENMODE:
      return {
        ...state,
        isMobile: action.payload,
      }
    case SET_EMBEDDED:
      return {
        ...state,
        embedded: action.payload,
      }
    case SET_THEME_READY:
      return {
        ...state,
        themeReady: true,
      }
    case CHANGE_CHART_TYPE:
      return {
        ...state,
        currentChartType: action.payload,
      }
    case CHANGE_CHART_LIBRARY:
      return {
        ...state,
        currentChartLibrary: action.payload,
      }
    default:
      return state
  }
}

export default registryReducer
