/**
 * Implements a left-menu Sidebar
 */
import React, { useEffect, useState } from 'react'
import { t } from 'ttag'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { ILeftPanel } from '../../core/API'
import { ReactComponent as NewsIcon } from './icons/left-menu-ico-news.svg'
import { ReactComponent as MarketsIcon } from './icons/left-menu-ico-markets.svg'
import { ReactComponent as TradeIcon } from './icons/left-menu-ico-trade.svg'
import { ReactComponent as DashboardIcon } from './icons/left-menu-ico-dashboard.svg'
import { ReactComponent as PositionsIcon } from './icons/left-menu-ico-positions.svg'
import { ReactComponent as TutorialIcon } from './icons/left-menu-ico-tutorial.svg'
import { ReactComponent as DailyAnalysis } from './icons/left-menu-ico-analysis.svg'
import { ReactComponent as VideoIcon } from './icons/left-menu-ico-video.svg'
import { ReactComponent as LeaderboardIcon } from './icons/left-menu-ico-leaderboard.svg'
import { ReactComponent as RecentTradesIcon } from './icons/left-menu-ico-recent-trades.svg'
import PositionsPanel from './PositionsPanel'
import NewsPanel from './NewsPanel'
import VideoNews from './VideoNews'
import SignalsPanel from './SignalsPanel'
import TutorialsPanel from './TutorialsPanel'
import SocialPanel from './SocialPanel'
import { SidebarState } from '../../reducers/sidebar'
import { actionSetSidebar } from '../../actions/sidebar'
import { IClosedTrade, IOpenTrade } from '../../core/interfaces/trades'
import { actionSetSelectedTrade } from '../../actions/trades'
import DailyAnalysisPanel from './DailyAnalysisPanel'
import { isLoggedIn } from '../selectors/loggedIn'
import { ContainerState } from '../../reducers/container'
import { actionSetContainer } from '../../actions/container'
import LeaderBoard from './LeaderBoard'
import RecentTradesPanel from './RecentTradesPanel'
import Avatar from '../Mobile/Drawer/Avatar'
import { IUserInfo } from '../../core/API'

const SIDEBAR_ITEMS: any = {
  0: 'Dashboard',
  2: 'Open/Сlosed Positions',
  3: 'News',
  4: 'Video News',
  5: 'Tutorials',
  6: 'Signals',
  8: 'Daily Analysis',
  9: 'Markets',
  10: 'Trade',
  11: 'Leaderboard',
  12: 'Pool Trades',
}

const SidebarContainer = styled.div<any>`
  width: 86px;
  position: relative;

  .tooltip-background {
    color: ${(props) => props.colors.secondaryText} !important;
    background-color: ${(props) => props.colors.background} !important;
  }
`
const SidebarPanel = styled.div<any>`
  box-sizing: border-box;
  height: 100%;
  background-color: ${(props) => props.colors.panelBackground};
  border-left: 1px solid ${(props) => props.colors.panelBorder};
  border-right: 1px solid ${(props) => props.colors.panelBorder};
  padding: 5px;

  .avatart-bar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    width: 74px;
    height: 74px;
    cursor: pointer;
    position: relative;
    border-radius: 8px;
    margin-bottom: 5px;

    background-color: ${(props) =>
      props.active
        ? props.colors.background
        : props.colors.leftPanel.itemBackground};
  }
`
const Item = styled.div<any>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  width: 74px;
  height: 74px;
  cursor: pointer;
  position: relative;
  border-radius: 8px;
  margin-bottom: 5px;

  background-color: ${(props) =>
    props.active
      ? props.colors.background
      : props.colors.leftPanel.itemBackground};

  .item-name {
    margin-top: 5px;
    color: ${(props) => props.colors.leftPanel.textColor};
    font-size: 11px;
    font-weight: 400;
  }

  ${(props) =>
    props.active
      ? css`
          .item-name {
            color: ${props.colors.primary} !important;
          }

          path:not(.line) {
            fill: ${props.colors.primary} !important;
          }

          path.line {
            stroke: ${props.colors.primary} !important;
          }

          rect {
            fill: ${props.colors.primary} !important;
          }
        `
      : css``}

  svg,
  img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }

  path:not(.line) {
    fill: ${(props) => props.colors.leftPanel.textColor};
  }

  path.line {
    fill: none;
    stroke: ${(props) => props.colors.leftPanel.textColor};
  }

  rect {
    fill: ${(props) => props.colors.leftPanel.textColor};
  }

  &:hover {
    .item-name {
      color: ${(props) => props.colors.primary};
    }

    path:not(.line) {
      fill: ${(props) => props.colors.primary};
    }

    path.line {
      stroke: ${(props) => props.colors.primary};
    }

    rect {
      fill: ${(props) => props.colors.primary};
    }
  }
`

export const SidebarCaption = styled.h3<any>`
  display: block;
  box-sizing: border-box;
  width: 180px;
  height: 26px;
  padding-bottom: 11px;
  margin: 13px auto;
  font-size: 12px;
  font-weight: 500;
  font-style: normal;
  letter-spacing: -0.07px;
  text-align: center;
  text-transform: uppercase;

  color: ${(props) => props.colors.primaryText};
  border-bottom: 1px solid ${(props) => props.colors.sidebarBorder};
`

export const VerticalFlexContainer = styled.div`
  display: flex;
  flex-direction: column;

  iframe {
    flex: 1 1 auto;
  }
`

const SidebarBanner = styled.div<{ colors: any }>`
  position: absolute;
  top: 25px;
  font-size: 9px;
  padding: 0 2px;
  border-radius: 2px;
  text-transform: uppercase;
  font-weight: bold;
  right: 4px;
  color: ${(props) => props.colors.panelBackground};
  background-color: ${(props) => props.colors.primary};
`

const SidebarCounter = styled.div<{ colors: any }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 25px;
  width: 18px;
  height: 18px;
  font-size: 12px;
  padding: 0 2px;
  right: 4px;
  border: 1px solid ${(props) => props.colors.primary};
  border-radius: 50%;
  color: ${(props) => props.colors.primary};
  background-color: ${(props) => props.colors.panelBackground};
`

interface ISidebarContentsProps {
  colors: any
  value: SidebarState
  onChange: (value: SidebarState) => void
  actionSetSelectedTrade: (trade: IOpenTrade | IClosedTrade | null) => void
  partnerConfig: any
  isLoggedIn: boolean
}

const SidebarContents = ({
  colors,
  value,
  onChange,
  actionSetSelectedTrade,
  partnerConfig,
  isLoggedIn,
}: ISidebarContentsProps) => {
  const closeSidebar = () => {
    onChange(SidebarState.none)
    actionSetSelectedTrade(null)
  }

  const { showGlobalRecentTrades, showTradesBottom } = partnerConfig

  const isVisible = (panel: SidebarState) => value === panel

  return (
    <div style={{ width: '58px' }}>
      {isVisible(SidebarState.positions) && !showTradesBottom && (
        <PositionsPanel
          colors={colors}
          isMobile={false}
          onClose={closeSidebar}
        />
      )}

      {isVisible(SidebarState.recentTrades) && showGlobalRecentTrades && (
        <RecentTradesPanel colors={colors} onClose={closeSidebar} />
      )}

      {isVisible(SidebarState.tutorial) && (
        <TutorialsPanel colors={colors} onClose={closeSidebar} />
      )}

      {isVisible(SidebarState.video) && (
        <VideoNews colors={colors} onClose={closeSidebar} />
      )}

      {isVisible(SidebarState.news) && (
        <NewsPanel colors={colors} onClose={closeSidebar} />
      )}

      {isVisible(SidebarState.signals) && (
        <SignalsPanel colors={colors} onClose={closeSidebar} />
      )}

      {isVisible(SidebarState.social) && (
        <SocialPanel colors={colors} onClose={closeSidebar} />
      )}

      {isVisible(SidebarState.analysis) && (
        <DailyAnalysisPanel
          forceLoad={true}
          colors={colors}
          onClose={closeSidebar}
        />
      )}
      {isVisible(SidebarState.leaderboard) && isLoggedIn && (
        <LeaderBoard colors={colors} onClose={closeSidebar} />
      )}
    </div>
  )
}

interface ISidebarProps {
  leftPanel: ILeftPanel
  userInfo: IUserInfo
  state: SidebarState
  isLoggedIn: boolean
  colors: any
  container: ContainerState
  openTradesCount: number
  actionSetSidebar: (state: SidebarState) => void
  actionSetContainer: (state: ContainerState) => void
  actionSetSelectedTrade: (trade: IOpenTrade | IClosedTrade | null) => void
  lang: string
  partnerConfig: any
}

/**
 * Abstraction to handle tooltip and active state
 */
const SidebarPanelItem = ({
  state,
  value,
  onChange,
  icon,
  colors,
  banner,
  counter,
  tooltipName,
}: any) => (
  <Item
    colors={colors}
    active={state === value}
    onClick={() => onChange(value)}
  >
    {icon}
    <span className="item-name">{tooltipName}</span>
    {banner && <SidebarBanner colors={colors}>{banner}</SidebarBanner>}
    {counter && <SidebarCounter colors={colors}>{counter}</SidebarCounter>}
  </Item>
)

const SidebarNew = (props: ISidebarProps) => {
  const { leftPanel, state, colors, isLoggedIn, partnerConfig, userInfo } =
    props
  const anyNews = leftPanel.news.enabled || leftPanel.cryptoNews.enabled
  const videoNews = leftPanel.videoNews.enabled
  const signals = !!leftPanel.signalsSrc
  const social = leftPanel.allowSocial === 1
  const dailyAnalysis = leftPanel.dailyAnalysis.enabled
  const tutorials = leftPanel.videos.enabled
  const dashboard = leftPanel.dashboard.enabled
  const leaderboard = leftPanel.leaderboard?.enabled && isLoggedIn
  const { showGlobalRecentTrades, showTradesBottom } = partnerConfig

  const getTranslatedName = (name: string) => {
    switch (name) {
      case 'Dashboard':
        return t`Dashboard`
      case 'Open/Сlosed Positions':
        return t`Open/Сlosed Positions`
      case 'News':
        return t`News`
      case 'Video News':
        return t`Video News`
      case 'Tutorials':
        return t`Tutorials`
      case 'Signals':
        return t`Signals`
      case 'Daily Analysis':
        return t`Daily Analysis`
      case 'Markets':
        return t`Markets`
      case 'Trade':
        return t`Trade`
      case 'Leaderboard':
        return t`Leaderboard`
      case 'Pool Trades':
        return t`Pool Trades`
    }
  }

  const [sidebarItems, setSidebarItems] = useState<any>(() => {
    let data: any = {}
    Object.keys(SIDEBAR_ITEMS).forEach((k: any) => {
      const name = getTranslatedName(SIDEBAR_ITEMS[k])
      data[k] = name
    })
    return data
  })

  useEffect(() => {
    setSideBar(SidebarState.none)
  }, [props.container])

  useEffect(() => {
    let data: any = {}
    Object.keys(SIDEBAR_ITEMS).forEach((k: any) => {
      const name = getTranslatedName(SIDEBAR_ITEMS[k])
      data[k] = name
    })
    setSidebarItems(data)
  }, [props.lang])

  const setSideBar = (value: SidebarState) => {
    if (value === props.state) {
      props.actionSetSidebar(SidebarState.trade)

      if (value === SidebarState.dashboard || value === SidebarState.markets) {
        props.actionSetContainer(ContainerState.trade)
      }

      return
    }

    if (value === SidebarState.none) {
      switch (props.container) {
        case ContainerState.dashboard:
          props.actionSetSidebar(SidebarState.dashboard)
          break
        case ContainerState.assets:
          props.actionSetSidebar(SidebarState.markets)
          break
        case ContainerState.trade:
          props.actionSetSidebar(SidebarState.trade)
      }
      return
    }

    switch (value) {
      case SidebarState.dashboard:
        props.actionSetContainer(ContainerState.dashboard)
        break
      case SidebarState.markets:
        props.actionSetContainer(ContainerState.assets)
        break
      case SidebarState.trade:
        props.actionSetContainer(ContainerState.trade)
    }

    props.actionSetSidebar(value)
  }

  return (
    <SidebarContainer className="sidebar__panel" colors={colors}>
      <SidebarPanel colors={colors}>
        {props.isLoggedIn && dashboard && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.dashboard}
            tooltipName={sidebarItems[SidebarState.dashboard]}
            onChange={setSideBar}
            icon={<DashboardIcon />}
          />
        )}

        <SidebarPanelItem
          colors={colors}
          state={state}
          value={SidebarState.markets}
          tooltipName={sidebarItems[SidebarState.markets]}
          onChange={setSideBar}
          icon={<MarketsIcon />}
        />

        <SidebarPanelItem
          colors={colors}
          state={state}
          value={SidebarState.trade}
          tooltipName={sidebarItems[SidebarState.trade]}
          onChange={setSideBar}
          icon={<TradeIcon />}
        />

        {!showTradesBottom && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.positions}
            tooltipName={sidebarItems[SidebarState.positions]}
            onChange={setSideBar}
            counter={props.openTradesCount !== 0 ? props.openTradesCount : null}
            icon={<PositionsIcon />}
          />
        )}

        {props.isLoggedIn && showGlobalRecentTrades ? (
          <SidebarPanelItem
            colors={colors}
            state={state}
            banner={t`new`}
            value={SidebarState.recentTrades}
            tooltipName={sidebarItems[SidebarState.recentTrades]}
            onChange={setSideBar}
            icon={<RecentTradesIcon />}
          />
        ) : null}
        {leaderboard && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.leaderboard}
            tooltipName={sidebarItems[SidebarState.leaderboard]}
            onChange={setSideBar}
            icon={<LeaderboardIcon />}
          />
        )}
        {anyNews && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.news}
            tooltipName={sidebarItems[SidebarState.news]}
            onChange={setSideBar}
            icon={<NewsIcon />}
          />
        )}
        {videoNews && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.video}
            tooltipName={sidebarItems[SidebarState.video]}
            onChange={setSideBar}
            icon={<VideoIcon />}
          />
        )}
        {dailyAnalysis && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.analysis}
            tooltipName={sidebarItems[SidebarState.analysis]}
            onChange={setSideBar}
            icon={<DailyAnalysis />}
          />
        )}
        {/* {props.isLoggedIn && (
          <a
            href="https://embed.tawk.to/5c93017fc37db86fcfcf0bc2/default"
            target="_blank"
            rel="noreferrer noopener"
          >
            <div className="avatart-bar">
              <Avatar
                isMobile={true}
                src={userInfo?.userImage}
                acronym={
                  `${userInfo?.firstName} ${userInfo?.lastName}`
                    .match(/\b(\w)/g)
                    ?.join('') as string
                }
              />
            </div>
          </a>
        )} */}

        {signals && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.signals}
            tooltipName={sidebarItems[SidebarState.signals]}
            onChange={setSideBar}
            icon={<VideoIcon />}
          />
        )}
        {social && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.social}
            tooltipName={sidebarItems[SidebarState.social]}
            onChange={setSideBar}
            icon={<VideoIcon />}
          />
        )}
        {tutorials && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.tutorial}
            tooltipName={sidebarItems[SidebarState.tutorial]}
            onChange={setSideBar}
            icon={<TutorialIcon />}
          />
        )}
      </SidebarPanel>
      <SidebarContents
        colors={colors}
        value={state}
        onChange={setSideBar}
        actionSetSelectedTrade={props.actionSetSelectedTrade}
        partnerConfig={partnerConfig}
        isLoggedIn={props.isLoggedIn}
      />
    </SidebarContainer>
  )
}

const mapStateToProps = (state: any) => ({
  leftPanel: state.registry.data.partnerConfig.leftPanel,
  partnerConfig: state.registry.data.partnerConfig,
  userInfo: state.account.userInfo,
  state: state.sidebar.panel,
  colors: state.theme,
  isLoggedIn: isLoggedIn(state),
  container: state.container.content,
  openTradesCount: state.trades.open.length,
  lang: state.registry.data.lang,
})

export default connect(mapStateToProps, {
  actionSetSidebar,
  actionSetSelectedTrade,
  actionSetContainer,
})(SidebarNew)
