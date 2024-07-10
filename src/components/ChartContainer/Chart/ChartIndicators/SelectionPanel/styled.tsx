import styled, { css } from 'styled-components'

const width = window.innerWidth

const PanelContainer = styled.div<{ isMobile: boolean; colors: any }>`
  position: fixed;
  ${(props) =>
    props.isMobile
      ? css`
          left: 15px;
          right: 15px;
        `
      : css`
          left: calc(50% - 300px);
        `}
  top: calc(50% - 220px);
  z-index: 42;
  display: flex;
  flex-direction: row;
  ${(props) =>
    props.isMobile
      ? css`
          width: ${width - 30}px;
        `
      : css`
          width: fit-content;
        `}

  background-color: ${(props) => props.colors.background};
  text-align: left;
  color: ${(props) => props.colors.secondaryText};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12);
`

const MenuContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.isMobile ? width / 2 - 15 : 270)}px;
  border-right: 1px solid #263346;
`

const ExplorerContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  width: ${(props) => (props.isMobile ? width / 2 : 380)}px;
`

export { PanelContainer, MenuContainer, ExplorerContainer }
