import { SET_SIDEBAR } from '../actions/sidebar'

export enum SidebarState {
  dashboard,
  none,
  positions,
  news,
  video,
  tutorial,
  signals,
  social,
  analysis,
  markets,
  trade,
  leaderboard,
  recentTrades,
}

export interface ISidebarState {
  panel: SidebarState
  props?: any | undefined
}

const defaultState = {
  panel: SidebarState.trade,
  props: null,
}

const sidebarReducer = (state: ISidebarState = defaultState, action: any) => {
  switch (action.type) {
    case SET_SIDEBAR:
      return action.payload
    default:
      return state
  }
}

export default sidebarReducer
