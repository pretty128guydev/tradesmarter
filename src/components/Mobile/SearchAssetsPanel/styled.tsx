import styled from 'styled-components'

const AssetsWrapper = styled.div<{
  colors: any
}>`
  position: relative;
  overflow: auto;
  width: 100%;
  flex: 1;
  padding: 20px 35px 20px 20px;
  background-color: ${(props) => props.colors.panelBackground};
`

const AssetPanelSideMode = styled.div<{ colors: any }>`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 5px 0 8px 8px;
  background-color: ${(props) => props.colors.background};
`

const AssetPanel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
`

export { AssetsWrapper, AssetPanelSideMode, AssetPanel }
