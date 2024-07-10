import { createStore, compose, applyMiddleware } from 'redux'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'
import {
  actionConnect,
  actionSetScreenMode,
  actionSetEmbedded,
} from '../actions/registry'
import createRootReducer from '../reducers/index'
import registrySaga, { getIsMobile } from '../sagas/registrySaga'
import tradingSaga from '../sagas/tradingSaga'
import timeSaga from '../sagas/timeSaga'
import accountSaga from '../sagas/accountSaga'
import { actionShowModal, ModalTypes } from '../actions/modal'
import Cookies from 'js-cookie'
import UserStorage from '../core/UserStorage'
import { actionRefreshAccount } from '../actions/account'
import { actionSetSidebar } from '../actions/sidebar'
import { SidebarState } from '../reducers/sidebar'

export const history = createBrowserHistory()

const sagaMiddleware = createSagaMiddleware()
const rootReducer = createRootReducer(history)

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(history)))
)

sagaMiddleware.run(registrySaga)
sagaMiddleware.run(accountSaga)
sagaMiddleware.run(timeSaga)
sagaMiddleware.run(tradingSaga)

store.dispatch(actionConnect())

/**
 * Track resize event and emit isMobile change
 * Usually never happens in real life but used for dev purposes
 */
window.addEventListener('resize', () => {
  store.dispatch(actionSetScreenMode(getIsMobile()))
})
/**
 * Bind zoid props
 */
if ((window as any).xprops) {
  const props = (window as any).xprops
  store.dispatch(actionSetEmbedded(props))
  /**
   * Simple side effect
   * Actual magic will happen in i18n
   */
  const locale = props.lang ?? UserStorage.getLanguage()
  Cookies.set('userLanguage', locale)
  UserStorage.setLanguage(locale)
}
/**
 * Bind theme configurator
 */
const openThemeConfigurator = () => {
  store.dispatch(actionShowModal(ModalTypes.THEME_CONFIG, {}))
}
;(window as any).openThemeConfigurator = openThemeConfigurator

/**
 * 3rd party events listeners
 */
window.addEventListener('message', (event: any) => {
  const payload = event.data
  const { name } = payload
  switch (name) {
    case 'updateBalance':
      store.dispatch(actionRefreshAccount())
      break
    case 'togglePaytable':
      store.dispatch(actionSetSidebar(SidebarState.positions))
      break
    case 'errorMessage':
      alert(payload.data.errorMessage)
  }
})

export { store }
