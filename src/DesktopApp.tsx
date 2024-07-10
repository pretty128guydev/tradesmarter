/**
 * Entry component for desktop layout
 */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from './components/Modal'
import Header from './components/Header'
import AccountBar from './components/AccountBar'
import Sidebar from './components/Sidebar'
import ChartContainer from './components/ChartContainer/index'
import TradeBox from './components/TradeBox'
import AlertsBar from './components/AlertsBar'
import './core/i18n'
import { Background } from './App'
import { connect } from 'react-redux'
import { ContainerState } from './reducers/container'
import DashboardPanel from './components/Dashboard'
import AssetsPanel from './components/Assets'
import { SidebarState } from './reducers/sidebar'
import {
  actionSetContainer,
  actionSetShowMenuContentIFrame,
} from './actions/container'
import { actionSetSidebar } from './actions/sidebar'
import InstrumentsBar from './components/ChartContainer/InstrumentsBar'
import BottomPositionsPanel from './components/SidebarNew/BottomPositionsPanel'
import SideMenuBar from './components/SideMenuBar'
import { actionShowModal, ModalTypes } from './actions/modal'
import TradeBoxNew from './components/TradeBoxNew'
import SidebarNew from './components/SidebarNew'
import CloseBtnRound from './components/Sidebar/CloseBtnRound'
import Mytradebox from './components/TradeBox/mytradebox'

const DesktopGrid = styled.section<any>`
  display: flex;
  flex: 1 1 auto;
  border-top: 1px solid ${(props) => props.colors.panelBorder};
  position: relative;
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  position: relative;
`

const SideMenuContent = styled.div<any>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  background-color: ${(props) => props.colors.background};

  .content-container {
    width: 100%;
    height: 100%;
  }
`

const TradeGrid = styled.div`
  display: grid;
  flex: 1 1 auto;
  grid-template-columns: auto min-content;
  grid-template-rows: 100%;
`

const DesktopApp = ({
  isLoggedIn,
  theme,
  showHeader,
  container,
  actionSetContainer,
  actionSetSidebar,
  partnerConfig,
  showSideMenu,
  actionShowModal,
  showMenuContentIframe: showMenuContent,
  actionSetShowMenuContentIFrame,
}: any) => {
  const onClose = () => {
    actionSetSidebar(SidebarState.none)
    actionSetContainer(ContainerState.trade)
  }

  const [showOtherPlatform, setShowOtherPlatform] = useState<{
    show: boolean
    link: string
  } | null>(null)

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

  const { showTradesBottom, tradingPanelType } = partnerConfig

  return (
    <Background>
      <div className="container-1">
        {showHeader && (
          <Header
            setShowMenuContent={actionSetShowMenuContentIFrame}
            setShowOtherPlatform={setShowOtherPlatform}
          />
        )}
        <div className="container-2">
          {showSideMenu && (
            <SideMenuBar setShowMenuContent={actionSetShowMenuContentIFrame} />
          )}
          <div className="container-3">
            {isLoggedIn && !showOtherPlatform?.show && <AccountBar />}
            <DesktopGrid colors={theme}>
              {showOtherPlatform?.show && (
                <iframe
                  src={showOtherPlatform?.link}
                  title="Trading iframe"
                  frameBorder="0"
                  height="100%"
                  width="100%"
                />
              )}
              {showMenuContent?.show && (
                <SideMenuContent colors={theme}>
                  <div className="content-container">
                    <CloseBtnRound
                      colors={theme}
                      top={5}
                      right={20}
                      onClick={() => actionSetShowMenuContentIFrame(null)}
                    />
                    <iframe
                      src={showMenuContent?.link}
                      title="Trading iframe"
                      frameBorder="0"
                      height="100%"
                      width="100%"
                    />
                  </div>
                </SideMenuContent>
              )}
              {!showOtherPlatform?.show && <SidebarNew />}
              {!showOtherPlatform?.show && (
                <Content>
                  {container === ContainerState.assets && <AssetsPanel />}
                  <TradeGrid>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: theme.tradebox.widgetBackground,
                      }}
                    >
                      {container !== ContainerState.dashboard && (
                        <InstrumentsBar />
                      )}
                      <ChartContainer isMobile={false} />
                      {showTradesBottom ? <BottomPositionsPanel /> : null}
                    </div>
                    {parseInt(tradingPanelType) === 2 ? (
                      <TradeBoxNew
                        isMobile={false}
                        onKeyboardOpened={() => {}}
                      />
                    ) : (
                      <Mytradebox
                        isMobile={false}
                        onKeyboardOpened={() => {}}
                      />
                    )}
                  </TradeGrid>
                  {container === ContainerState.dashboard && (
                    <DashboardPanel onClose={onClose} />
                  )}
                </Content>
              )}
            </DesktopGrid>
            <Modal />
            <AlertsBar />
          </div>
        </div>
      </div>
    </Background>
  )
}

const mapStateToProps = (state: any) => ({
  container: state.container.content,
  partnerConfig: state.registry.data.partnerConfig,
  showSideMenu: state.container.showSideMenu,
  showMenuContentIframe: state.container.showMenuContentIframe,
})

export default connect(mapStateToProps, {
  actionSetContainer,
  actionSetSidebar,
  actionShowModal,
  actionSetShowMenuContentIFrame,
})(DesktopApp)
