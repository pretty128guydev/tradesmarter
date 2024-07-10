/**
 * Implemens a list of video news
 */
import React, { useEffect, useState } from 'react'
import { t } from 'ttag'
import { connect } from 'react-redux'
import { SidebarCaption } from '..'
import CloseButton from '../CloseBtn'
import VideoNewsItem from './VideoNewsItem'
import { api } from '../../../core/createAPI'
import SidebarContentsPanel from './SidebarContentsPanel'
import { VideoList } from './styled'

interface IVideoNewsProps {
  colors: any
  feed: string
  onClose: () => void
  isMobile?: boolean
  registry: any
}

export interface IVideoArticle {
  id: number
  title: string
  date: number
  thumbnail: string
  video: string
}

/**
 * Entry component
 * @param props
 */
const VideoNews = (props: IVideoNewsProps) => {
  const { registry } = props
  const dailyNewsEnabled =
    registry?.data?.partnerConfig?.leftPanel?.dailyNews?.enabled
  const [items, setItems] = useState<any[]>([])
  const [sidebarWidth, setSidebarWidth] = useState<number>(300)

  useEffect(() => {
    const params = {
      timestamp: Number(new Date()),
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = `!function(e,t,i){if(void 0===e._dyntube_v1_init){e._dyntube_v1_init=!0;var a=t.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://embed.dyntube.com/v1.0/dyntube.js",t.getElementsByTagName("head")[0].appendChild(a)}}(window,document);`
    document.body.appendChild(script)

    const fetchFn = async () => {
      const data = await api.getJson(props.feed, params)
      setItems(data ? data.items : [])
    }
    fetchFn()

    return () => {
      document.body.removeChild(script)
    }
  }, [dailyNewsEnabled])

  return (
    <SidebarContentsPanel
      colors={props.colors}
      adjustable={true}
      isMobile={props.isMobile || false}
      sidebarWidth={setSidebarWidth}
    >
      <CloseButton colors={props.colors} onClick={props.onClose} />
      <div className="container scrollable">
        {dailyNewsEnabled && (
          <div>
            <SidebarCaption
              colors={props.colors}
            >{t`Market session Brief`}</SidebarCaption>
            <div
              style={{ paddingRight: 10, marginBottom: 10 }}
              data-dyntube-key="8kQCCclb0qJfHrcEtGg"
            ></div>
          </div>
        )}
        <div>
          <SidebarCaption colors={props.colors}>{t`Video News`}</SidebarCaption>
          <VideoList width={sidebarWidth} className="scrollable video-list">
            {items.map((article: IVideoArticle, index: number) => (
              <VideoNewsItem article={article} key={index} />
            ))}
          </VideoList>
        </div>
      </div>
    </SidebarContentsPanel>
  )
}

const mapStateToProps = (state: any) => ({
  registry: state.registry,
  feed: state.registry.data.partnerConfig.leftPanel.videoNews.url,
})

export default connect(mapStateToProps)(VideoNews)
