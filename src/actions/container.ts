import { action } from 'typesafe-actions'
import { ContainerState, IPlatformMenu } from '../reducers/container'

const entity = 'container'

const SET_CONTAINER = `${entity}/SET`
const SET_FIRST_TIME_OPEN_WEB = `${entity}/SET_FIRST_TIME_OPEN_WEB`
const SET_SHOW_BOTTOM_PANEL = `${entity}/SET_SHOW_BOTTOM_PANEL`
const SET_BOTTOM_PANEL_HEIGHT = `${entity}/SET_BOTTOM_PANEL_HEIGHT`
const SET_SHOW_SIDE_MENU = `${entity}/SET_SHOW_SIDE_MENU`
const SET_COLLAPSED_SIDE_MENU = `${entity}/SET_COLLAPSED_SIDE_MENU`
const SET_SHOW_TOP_MENU = `${entity}/SET_SHOW_TOP_MENU`
const SET_SIDE_MENU_ITEMS = `${entity}/SET_SIDE_MENU_ITEMS`
const SET_TOP_MENU_ITEMS = `${entity}/SET_TOP_MENU_ITEMS`
const SET_SHOW_MENU_CONTENT_IFRAME = `${entity}/SET_SHOW_MENU_CONTENT_IFRAME`
const SET_SHOW_CONFETTI = `${entity}/SET_SHOW_CONFETTI`

const actionSetContainer = (content: ContainerState) =>
  action(SET_CONTAINER, { content })

const actionSetFirstTimeOpenWeb = (isFirstTimeOpenWeb: boolean) =>
  action(SET_FIRST_TIME_OPEN_WEB, { isFirstTimeOpenWeb })

const actionSetShowBottomPanel = (showBottomPanel: boolean) =>
  action(SET_SHOW_BOTTOM_PANEL, { showBottomPanel })

const actionSetShowSideMenu = (showSideMenu: boolean) =>
  action(SET_SHOW_SIDE_MENU, { showSideMenu })

const actionSetCollapsedSideMenu = (collapsedSideMenu: boolean) =>
  action(SET_COLLAPSED_SIDE_MENU, { collapsedSideMenu })

const actionSetShowTopMenu = (showTopMenu: boolean) =>
  action(SET_SHOW_TOP_MENU, { showTopMenu })

const actionSetSideMenuItems = (sideMenuItems: IPlatformMenu[]) =>
  action(SET_SIDE_MENU_ITEMS, { sideMenuItems })

const actionSetTopMenuItems = (topMenuItems: IPlatformMenu[]) =>
  action(SET_TOP_MENU_ITEMS, { topMenuItems })

const actionSetBottomPanelHeight = (bottomPanelHeight: number) =>
  action(SET_BOTTOM_PANEL_HEIGHT, { bottomPanelHeight })

const actionSetShowMenuContentIFrame = (showMenuContentIframe: any) =>
  action(SET_SHOW_MENU_CONTENT_IFRAME, { showMenuContentIframe })

const actionSetShowConfetti = (showConfetti: boolean) =>
  action(SET_SHOW_CONFETTI, { showConfetti })

export {
  SET_CONTAINER,
  actionSetContainer,
  SET_FIRST_TIME_OPEN_WEB,
  actionSetFirstTimeOpenWeb,
  SET_SHOW_BOTTOM_PANEL,
  actionSetShowBottomPanel,
  SET_BOTTOM_PANEL_HEIGHT,
  actionSetBottomPanelHeight,
  SET_SHOW_SIDE_MENU,
  actionSetShowSideMenu,
  SET_COLLAPSED_SIDE_MENU,
  actionSetCollapsedSideMenu,
  SET_SHOW_TOP_MENU,
  actionSetShowTopMenu,
  SET_SIDE_MENU_ITEMS,
  actionSetSideMenuItems,
  SET_TOP_MENU_ITEMS,
  actionSetTopMenuItems,
  SET_SHOW_MENU_CONTENT_IFRAME,
  actionSetShowMenuContentIFrame,
  SET_SHOW_CONFETTI,
  actionSetShowConfetti,
}
