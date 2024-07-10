import React from 'react'
import { connect } from 'react-redux'
import { IVideoArticle } from './index'
import {
  VideoContainer,
  VideoTitle,
  YouTubeContainer,
  YouTubePlayer,
  YouTubeWrapper,
} from './styled'

interface IVideoNewsItemProps {
  article: IVideoArticle
  colors: any
}

const ASPECT_RATIO = 0.5625

/**
 * Generic video player
 * @param props
 */
const YoutubePlayer = (props: { src: string }) => (
  <YouTubeWrapper ratio={ASPECT_RATIO}>
    <YouTubeContainer>
      <YouTubePlayer allowFullScreen={true} src={props.src} frameBorder="0" />
    </YouTubeContainer>
  </YouTubeWrapper>
)

const VideoNewsItem = ({ article, colors }: IVideoNewsItemProps) => {
  return (
    <VideoContainer colors={colors}>
      <YoutubePlayer src={article.video} />
      <VideoTitle colors={colors}>{article.title}</VideoTitle>
    </VideoContainer>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
})

export default connect(mapStateToProps)(VideoNewsItem)
