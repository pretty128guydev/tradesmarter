import { action } from 'typesafe-actions'
import {
  ChartLibrary,
  ChartType,
} from '../components/ChartContainer/ChartLibraryConfig'
import { IRegistry } from '../core/API'

const entity = 'registry'

const CONNECT = `${entity}/CONNECT`
const UPDATE = `${entity}/UPDATE`
const SET_LOADING = `${entity}/SET_LOADING`
const SET_SCREENMODE = `${entity}/SET_SCREENMODE`
const SET_EMBEDDED = `${entity}/SET_EMBEDDED`
const SET_THEME_READY = `${entity}/SET_THEME_READY`
const CHANGE_CHART_TYPE = `${entity}/CHANGE_CHART_TYPE`
const CHANGE_CHART_LIBRARY = `${entity}/CHANGE_CHART_LIBRARY`

const actionConnect = () => action(CONNECT)
const actionUpdateRegistry = (registry: IRegistry) => action(UPDATE, registry)
const actionSetGlobalLoader = (loader: boolean) => action(SET_LOADING, loader)
const actionSetScreenMode = (isMobile: boolean) =>
  action(SET_SCREENMODE, isMobile)
const actionSetEmbedded = (xprops: any) => action(SET_EMBEDDED, xprops)
const actionSetThemeReady = () => action(SET_THEME_READY)
const actionChangeChartType = (chartType: ChartType) =>
  action(CHANGE_CHART_TYPE, chartType)
const actionChangeChartLibrary = (chartLibrary: ChartLibrary) =>
  action(CHANGE_CHART_LIBRARY, chartLibrary)

export {
  CONNECT,
  UPDATE,
  SET_LOADING,
  SET_SCREENMODE,
  SET_EMBEDDED,
  SET_THEME_READY,
  CHANGE_CHART_TYPE,
  CHANGE_CHART_LIBRARY,
  actionConnect,
  actionUpdateRegistry,
  actionSetGlobalLoader,
  actionSetScreenMode,
  actionSetEmbedded,
  actionSetThemeReady,
  actionChangeChartType,
  actionChangeChartLibrary,
}
