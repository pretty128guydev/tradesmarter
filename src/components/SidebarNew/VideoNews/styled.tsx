import styled from 'styled-components'

const VideoList = styled.div<{ width: number }>`
  display: grid;
  grid-template-columns: ${(props) =>
    !props.width || props.width < 620 ? 'auto' : 'auto auto'};
  grid-template-rows: auto;
  column-gap: 10px;
  row-gap: 20px;
  overflow: auto;
`

const VideoContainer = styled.div<{ colors: any }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: ${(props) => props.colors.leftPanel.itemBackground};
`

const YouTubeWrapper = styled.div<{ ratio: number }>`
  position: relative;
  width: 100%;
  height: ${(props) => `calc(100% * ${props.ratio})`};
  padding-bottom: ${(props) => `calc(100% * ${props.ratio})`};
`

const YouTubeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  outline: none;
`

const YouTubePlayer = styled.iframe`
  width: 100%;
  height: 100%;
`

const VideoTitle = styled.div<{ colors: any }>`
  padding: 20px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;

  color: ${(props) => props.colors.primaryText};
`

export {
  VideoContainer,
  YouTubeWrapper,
  YouTubeContainer,
  YouTubePlayer,
  VideoTitle,
  VideoList,
}
