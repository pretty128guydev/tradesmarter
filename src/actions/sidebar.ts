import { action } from 'typesafe-actions'
import { SidebarState } from '../reducers/sidebar'

const entity = 'sidebar'

const SET_SIDEBAR = `${entity}/SET`

const actionSetSidebar = (panel: SidebarState, props?: any) =>
	action(SET_SIDEBAR, { panel, props })

export { SET_SIDEBAR, actionSetSidebar }
