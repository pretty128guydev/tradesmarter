/**
 * Implements a news panel
 * Shows tabs only if news and crypto enabled
 */
import React, { useState } from 'react'
import { t } from 'ttag'
import { connect } from 'react-redux'
import { SidebarCaption } from '..'
import { ILeftPanel } from '../../../core/API'
import Tabs from '../../ui/Tabs'
import NewsFeedContents from './NewsFeedContents'
import CloseButton from '../CloseBtn'
import SidebarContentsPanel from '../SidebarContentsPanel'

interface INewsPanelProps {
  colors: any
  leftPanel: ILeftPanel
  onClose: () => void
  isMobile?: boolean
}

const NewsPanel = (props: INewsPanelProps) => {
  const showTabs =
    props.leftPanel.cryptoNews.enabled && props.leftPanel.news.enabled
  const tabs = [t`GENERAL`, t`CRYPTO`]
  const [tab, setTab] = useState<number>(0)
  const feedUrl =
    tab === 0 ? props.leftPanel.news.url : props.leftPanel.cryptoNews.url

  return (
    <SidebarContentsPanel
      colors={props.colors}
      adjustable={false}
      isMobile={props.isMobile || false}
    >
      <SidebarCaption colors={props.colors}>{t`News`}</SidebarCaption>
      <CloseButton colors={props.colors} onClick={props.onClose} />
      {showTabs && <Tabs value={tab} tabs={tabs} onChange={setTab} />}
      <NewsFeedContents feed={feedUrl} />
    </SidebarContentsPanel>
  )
}
const mapStateToProps = (state: any) => ({
  leftPanel: state.registry.data.partnerConfig.leftPanel,
})

export default connect(mapStateToProps)(NewsPanel)
