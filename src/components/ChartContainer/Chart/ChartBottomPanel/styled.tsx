import styled from 'styled-components'

const BottomPanel = styled.div`
  position: relative;
  height: 30px;

  &:after {
    content: ' ';
    clear: both;
  }
`

const BottomPanelContainer = styled.div<{
  navigator?: boolean
  isMobile: boolean
}>`
  position: absolute;
  z-index: 20;
  bottom: ${(props) => (props.navigator ? '90px' : '20px')};
  left: '0px';
  display: flex;
  justify-content: space-around;
  width: 100%;
`

const ButtonContainer = styled.div<any>`
  display: flex;
  height: ${(props) => props.height};
  width: ${(props) => props.width};
`

export { BottomPanel, BottomPanelContainer, ButtonContainer }
