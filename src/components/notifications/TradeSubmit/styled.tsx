import styled, { css, keyframes } from 'styled-components'
import { isMobileLandscape } from '../../../core/utils'
import close from './close.svg'

const fadeinout = keyframes`
	0% { opacity: 0; }
	10%, 90% { opacity: 1}
	100% { opacity: 0; }
`

const TradeSubmittedModal = styled.div<{
  colors: any
  success: boolean
  isMobile: boolean
  tradingPanelType: number
}>`
  position: absolute;
  ${(props) => (props.isMobile ? '' : 'margin-top: 10px;')}
  z-index: 85;
  ${(props) =>
    props.tradingPanelType === 2 && !props.isMobile
      ? css``
      : css`
          left: 10px;
        `};
  right: ${(props) =>
    props.tradingPanelType === 2 && !props.isMobile ? 140 : 10}px;
  ${(props) =>
    props.tradingPanelType === 2 && !props.isMobile
      ? css`
          top: 300px;
        `
      : props.isMobile
      ? css`
          top: 0;
        `
      : css``}

  display: block;
  ${(props) =>
    props.tradingPanelType === 2 && !props.isMobile
      ? css`
          max-width: 800px;
          min-width: 270px;
        `
      : css`
          min-width: 270px;
        `};

  min-height: 100px;
  max-height: 180px;
  border-radius: 2px;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: ${(props) =>
    props.success ? 'rgba(90, 185, 109, 0.9)' : 'rgba(172, 4, 42, 0.8)'};
  animation: ${fadeinout} 6s linear;

  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            min-width: 160px;
          }
        `
      : css``}

  &:after {
    ${(props) => (props.isMobile ? '' : "content: '';")}
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 10px solid ${(props) => props.colors.sidebarElementActive};
    border-radius: 3px;
  }

  .closeButton {
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 12px;
    height: 12px;
    z-index: 10;
    background: url(${close}) no-repeat center;
    padding: 5px;
    cursor: pointer;
  }

  span {
    display: block;
    padding: 30px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.25;
    text-align: center;
    color: ${(props) => props.colors.primaryText};
  }
`

const TradeSubmittedPositionClosedModal = styled.div<{
  colors: any
  isMobile: boolean
  tradingPanelType: number
}>`
  position: absolute;
  ${(props) => (props.isMobile ? '' : 'margin-top: 10px;')}
  z-index: 85;
  ${(props) =>
    props.tradingPanelType === 2 && !props.isMobile
      ? css``
      : css`
          left: 10px;
        `};
  right: ${(props) =>
    props.tradingPanelType === 2 && !props.isMobile ? 140 : 10}px;
  ${(props) =>
    props.tradingPanelType === 2 && !props.isMobile
      ? css`
          top: 300px;
        `
      : props.isMobile
      ? css`
          top: 0;
        `
      : css``}

  display: block;
  ${(props) =>
    props.tradingPanelType === 2 && !props.isMobile
      ? css`
          max-width: 600px;
          min-width: 270px;
        `
      : css`
          min-width: 270px;
        `};
  min-height: 100px;
  ${(props) => (!props.isMobile ? 'max-height: 180px;' : '')}
  ${(props) => (props.isMobile ? 'bottom: 0;' : '')}
	border-radius: 2px;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: rgba(0, 0, 0, 0.6);
  animation: ${fadeinout} 6s linear;

  &:after {
    ${(props) => (props.isMobile ? '' : "content: '';")}
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 10px solid ${(props) => props.colors.sidebarElementActive};
    border-radius: 3px;
  }

  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            min-width: 160px;
          }
        `
      : css``}

  .closeButton {
    display: block;
    position: absolute;
    top: 5px;
    right: 5px;
    width: 17px;
    height: 17px;
    background: url(${close}) no-repeat center;
    z-index: 1;
    padding: 5px;
    cursor: pointer;
    background: url(${close}) no-repeat center;
  }

  p {
    display: block;
    padding: 30px 30px 5px 30px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.25;
    margin: 0;
    color: ${(props) => props.colors.primaryText};

    .profit {
      color: ${(props) => props.colors.primary};
    }
  }

  div {
    position: relative;
    z-index: 1;
    margin: 0 0 15px 30px;
    cursor: pointer;
    color: ${(props) => props.colors.primary};
  }
`

export { TradeSubmittedModal, TradeSubmittedPositionClosedModal }
