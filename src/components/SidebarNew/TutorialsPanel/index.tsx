/**
 * Implements a Tutorials panel
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import styled from 'styled-components'
import { SidebarCaption } from '..'
import ReactPlayer from 'react-player'
import CloseButton from '../CloseBtn'
import SidebarContentsPanel from '../SidebarContentsPanel'
import { ArticleList } from '../NewsPanel/styled'

const VideoContainer = styled.div`
  display: block;
  box-sizing: border-box;
  width: 270px;
  margin: 0 auto;

  span {
    display: block;
    box-sizing: border-box;
    width: 100%;
    font-size: 11px;
    padding-bottom: 6px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 12px;
    user-select: none;

    background-color: rgb(10, 26, 44);
    color: rgba(255, 255, 255, 0.87);
  }
`
interface IVideoData {
  defaultLang: string
  enabled: boolean
  images: any
  length: any
  order: string
  sources: any
  titles: any
  wow: any
}
interface ITutorialsPanelProps {
  colors: any
  data: IVideoData
  thumbnails: any
  onClose: () => void
}

const TutorialsPanel = (props: ITutorialsPanelProps) => {
  const [playing, setPlaying] = useState(-1)
  const { data, thumbnails, colors } = props
  const { defaultLang } = data
  const { order } = data.wow
  const sources = data.sources.wow[defaultLang]
  const titles = data.titles[defaultLang]
  return (
    <SidebarContentsPanel colors={colors} adjustable={false} isMobile={false}>
      <SidebarCaption colors={colors}>{t`Tutorials`}</SidebarCaption>
      <CloseButton colors={colors} onClick={props.onClose} />
      <ArticleList className="scrollable">
        {order.map((key: string, index: number) => {
          return (
            <VideoContainer key={key}>
              {playing !== index && (
                <div
                  key={thumbnails[key]}
                  onClick={() => setPlaying(index)}
                  style={{
                    width: 270,
                    height: 150,
                    background: `url(${thumbnails[key]}) no-repeat`,
                    backgroundSize: 'cover',
                  }}
                />
              )}
              {playing === index && (
                <ReactPlayer
                  width="270"
                  height="150"
                  key={index}
                  url={`${sources[key]}.mp4`}
                  autoPlay
                  playing
                  controls
                />
              )}
              <span>
                {index}. {titles[key]}
              </span>
            </VideoContainer>
          )
        })}
      </ArticleList>
    </SidebarContentsPanel>
  )
}

const mapStateToProps = (state: any) => ({
  data: state.registry.data.partnerConfig.leftPanel.videos,
  thumbnails:
    state.registry.data.partnerConfig.leftPanel.videos.images.wow.en.thumbnails,
})

export default connect(mapStateToProps)(TutorialsPanel)
