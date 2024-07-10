import {
  SET_CONTAINER,
  SET_FIRST_TIME_OPEN_WEB,
  SET_SHOW_BOTTOM_PANEL,
  SET_BOTTOM_PANEL_HEIGHT,
  SET_COLLAPSED_SIDE_MENU,
  SET_SHOW_SIDE_MENU,
  SET_SIDE_MENU_ITEMS,
  SET_SHOW_TOP_MENU,
  SET_TOP_MENU_ITEMS,
  SET_SHOW_MENU_CONTENT_IFRAME,
  SET_SHOW_CONFETTI,
} from '../actions/container'

export enum ContainerState {
  trade,
  dashboard,
  assets,
}

export interface IContainerState {
  content: ContainerState
}
export interface IPlatformMenu {
  label: string
  show: boolean | number
  link: string
  order: number
  afterLoginOnly?: boolean | number
  subItems?: IPlatformMenu[]
  iframe: boolean
}

const defaultState = {
  content: ContainerState.trade,
  isFirstTimeOpenWeb: true,
  showBottomPanel: false,
  showSideMenu: false,
  sideMenuItems: [],
  collapsedSideMenu: false,
  showTopMenu: false,
  topMenuItems: [],
  bottomPanelHeight: 120,
  showMenuContentIframe: {
    show: false,
    link: '',
  },
  showConfetti: true,
}

const containerReducer = (
  state: IContainerState = defaultState,
  action: any
) => {
  switch (action.type) {
    case SET_CONTAINER:
    case SET_FIRST_TIME_OPEN_WEB:
    case SET_SHOW_BOTTOM_PANEL:
    case SET_BOTTOM_PANEL_HEIGHT:
    case SET_COLLAPSED_SIDE_MENU:
    case SET_SHOW_SIDE_MENU:
    case SET_SIDE_MENU_ITEMS:
    case SET_SHOW_TOP_MENU:
    case SET_TOP_MENU_ITEMS:
    case SET_SHOW_MENU_CONTENT_IFRAME:
    case SET_SHOW_CONFETTI:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default containerReducer
