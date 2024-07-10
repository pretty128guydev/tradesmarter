/**
 * Mobile app bundle
 */
import React, { useEffect, useState } from 'react'
import Modal from './components/Modal'
import ChartContainer from './components/ChartContainer/index'
import AlertsBar from './components/AlertsBar'
import * as Mobile from './components/Mobile'
import './core/i18n'
import { Background } from './App'
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import { SidebarState } from './reducers/sidebar'
import TradeBox from './components/TradeBox'
import VideoNews from './components/Sidebar/VideoNews'
import NewsPanel from './components/Sidebar/NewsPanel'
import IframePanel from './components/Sidebar/IframePanel'
import DailyAnalysisPanel from './components/Sidebar/DailyAnalysisPanel'
import disableScroll from 'disable-scroll'
import LeaderBoard from './components/Sidebar/LeaderBoard'
import { isMobileLandscape } from './core/utils'
import { actionShowModal, ModalTypes } from './actions/modal'
import { actionSetShowMenuContentIFrame } from './actions/container'

export enum MobileDrawers {
  none,
  menu,
  dashboard,
  positions,
  homeMenu,
  trade,
  news,
  videoNews,
  dailyAnalysis,
  leaderboard,
  searchAssets,
  iframePanel,
}

interface IMobileAppProps {
  showHeader: boolean
  inTradingHours: boolean
  colors: any
  showPositionsPanel: boolean
  onHidePositionsPanel: () => void
  actionShowModal: any
  isLoggedIn: boolean
  partnerConfig: any
  showMenuContentIframe: any
  actionSetShowMenuContentIFrame: (data: any) => void
}

const MobileWrapper = styled.div`
  min-height: ${window.innerHeight}px;
  display: flex;
  flex-direction: column;
  ${isMobileLandscape(true)
    ? css`
        @media (orientation: landscape) {
          display: flex;
          flex-direction: row;
        }
      `
    : ``}

  .chartContainer {
    display: flex;
    flex-direction: column;
    flex: 1;
    ${isMobileLandscape(true)
      ? css`
          @media (orientation: landscape) {
            width: calc(100vw - 230px);
          }
        `
      : ``}
  }
`

/**
 * A seperate component for mobile app
 * Could be loaded via Suspense API
 */
const MobileApp = ({
  inTradingHours,
  showHeader,
  colors,
  showPositionsPanel,
  onHidePositionsPanel,
  actionShowModal,
  isLoggedIn,
  partnerConfig,
  showMenuContentIframe,
  actionSetShowMenuContentIFrame,
}: IMobileAppProps) => {
  const [activePanel, setActive] = useState<MobileDrawers>(MobileDrawers.none) // state for all drawers

  useEffect(() => {
    const favicon = document.getElementById('favicon') as any
    favicon.href = partnerConfig.favicon
    document.title = partnerConfig.title || 'Trading'

    const { xprops } = window as any

    if (xprops && !xprops.header) return

    if (window.location.search.includes('show-login') && !isLoggedIn) {
      actionShowModal(ModalTypes.SIGN_IN)
      return
    }

    if (window.location.search.includes('show-register') && !isLoggedIn) {
      actionShowModal(ModalTypes.OPEN_ACCOUNT)
      return
    }
  }, [])

  useEffect(() => {
    const mobile = isMobile()
    activePanel === MobileDrawers.homeMenu && !isMobileLandscape(mobile)
      ? disableScroll.on()
      : disableScroll.off()
  }, [activePanel])

  const isMobile = () => {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ]

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem)
    })
  }

  return (
    <Background isMobile={true}>
      <MobileWrapper>
        <div className="chartContainer">
          <Mobile.Header
            showHeader={showHeader}
            onHomeButtonClick={() => {
              setActive(
                activePanel === MobileDrawers.homeMenu
                  ? MobileDrawers.none
                  : MobileDrawers.homeMenu
              )
            }}
            onMenuClick={() => {
              setActive(MobileDrawers.menu)
            }}
            onPositionsClick={() => {
              setActive(MobileDrawers.positions)
            }}
            onUserMenuClick={() => setActive(MobileDrawers.dashboard)}
            onSearchAssetsButtonClick={() => {
              setActive(
                activePanel === MobileDrawers.searchAssets
                  ? MobileDrawers.none
                  : MobileDrawers.searchAssets
              )
            }}
            activePanel={activePanel}
            setShowMenuContent={(link: string) => {
              setActive(MobileDrawers.iframePanel)
              actionSetShowMenuContentIFrame({ link })
            }}
          />
          <ChartContainer isMobile={true} />
          <Modal setActive={setActive} />
          <AlertsBar />
          {activePanel === MobileDrawers.dashboard && (
            <Mobile.Dashboard onClose={() => setActive(MobileDrawers.none)} />
          )}
          {(activePanel === MobileDrawers.positions || showPositionsPanel) && (
            <Mobile.Positions
              onClose={() => {
                setActive(MobileDrawers.none)
                onHidePositionsPanel()
              }}
            />
          )}
          {activePanel === MobileDrawers.menu && (
            <Mobile.Drawer
              onClose={() => setActive(MobileDrawers.none)}
              setShowMenuContent={(link: string) => {
                setActive(MobileDrawers.iframePanel)
                actionSetShowMenuContentIFrame({ link })
              }}
            />
          )}
          {activePanel === MobileDrawers.homeMenu && (
            <Mobile.HomeMenu
              mobileDrawers={MobileDrawers}
              setActive={setActive}
            />
          )}
          {activePanel === MobileDrawers.videoNews && (
            <VideoNews
              colors={colors}
              onClose={() => setActive(MobileDrawers.none)}
              isMobile={true}
            />
          )}
          {activePanel === MobileDrawers.news && (
            <NewsPanel
              colors={colors}
              onClose={() => setActive(MobileDrawers.none)}
              isMobile={true}
            />
          )}
          {activePanel === MobileDrawers.dailyAnalysis && (
            <DailyAnalysisPanel
              forceLoad={true}
              colors={colors}
              isMobile={true}
              onClose={() => setActive(MobileDrawers.none)}
            />
          )}
          {activePanel === MobileDrawers.leaderboard && (
            <LeaderBoard
              colors={colors}
              isMobile={true}
              onClose={() => setActive(MobileDrawers.none)}
            />
          )}
          {activePanel === MobileDrawers.searchAssets && (
            <Mobile.SearchAssets
              onClose={() => setActive(MobileDrawers.none)}
            />
          )}
          {activePanel === MobileDrawers.iframePanel && (
            <IframePanel
              colors={colors}
              isMobile={true}
              onClose={() => setActive(MobileDrawers.none)}
              link={showMenuContentIframe?.link}
            />
          )}
        </div>
        <TradeBox
          isMobile={true}
          onKeyboardOpened={() => {}}
          mobileTradeHeight={0}
          setActive={setActive}
        />
      </MobileWrapper>
    </Background>
  )
}

const mapStateToProps = (state: any) => ({
  showPositionsPanel: state.sidebar.panel === SidebarState.positions,
  partnerConfig: state.registry.data.partnerConfig,
  showMenuContentIframe: state.container.showMenuContentIframe,
})

export default connect(mapStateToProps, {
  actionShowModal,
  actionSetShowMenuContentIFrame,
})(MobileApp)
