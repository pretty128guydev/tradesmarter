/**
 * Generic dropdowns lists
 * Used in charts controls and in header
 */
import styled, { css } from 'styled-components'
import { isMobileLandscape } from '../../core/utils'

interface IListContainerProps {
  colors: any
  top?: any
  left?: any
  right?: any
  bottom?: number
  zIndex?: number
  noOpen?: string
  periodpanel?: string
}
const ListContainer = styled.div<any>`
  position: fixed;
  ${(props: IListContainerProps) => (props.top ? `top: ${props.top}px` : '')};
  ${(props: IListContainerProps) =>
    props.left ? `left: ${props.left}px` : ''};
  ${(props: IListContainerProps) =>
    props.right ? `right: ${props.right}px` : ''};
  ${(props: IListContainerProps) =>
    props.bottom ? `bottom: ${props.bottom}px` : ''};
  z-index: ${(props: IListContainerProps) => props.zIndex ?? 41};
  max-height: ${(props) => (isMobileLandscape(props.isMobile) ? 200 : 300)}px;
  overflow-y: auto;

  padding-top: ${(props: IListContainerProps) =>
    props.periodpanel !== 'tradebox' && '10px'};
  scrollbar-width: ${(props: IListContainerProps) =>
    props.periodpanel === 'tradebox' && 'none'};
  padding-bottom: 16px;

  width: ${(props: IListContainerProps) =>
    props.periodpanel !== 'tradebox' ? '220px' : '50px'};
  height: ${(props: IListContainerProps) =>
    props.periodpanel !== 'tradebox' ? '350px' : '150px'};
  border-radius: 6px;
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: ${(props: IListContainerProps) =>
    props.periodpanel !== 'tradebox'
      ? props.colors.background
      : props.colors.tradebox.widgetBackground};

  .right-menu-user-info {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    line-height: 15px;
    margin-bottom: 10px;
    img {
      width: 57px;
      height: 20px;
      margin-bottom: 11px;
    }

    div:nth-child(1) {
      margin-bottom: 7px;
    }

    div:nth-child(2) {
      color: ${(props) => props.colors.secondaryText};
      margin: 1px;
      font-size: 16px;
      width: 185px;
      height: auto;
      margin-bottom: 5px;
      overflow-wrap: break-word;
    }

    div:nth-child(3) {
      font-size: 14px;
      color: ${(props) => props.colors.secondaryText};
      margin: 1px;
      width: 185px;
      height: auto;
      margin-bottom: 5px;
      overflow-wrap: break-word;
    }

    div:nth-child(4) {
      font-size: 14px;
      color: ${(props) => props.colors.secondaryText};
      margin: 1px;
      width: 185px;
      height: auto;
      margin-bottom: 5px;
      overflow-wrap: break-word;
    }
  }
  .menu-border {
    width: 100%;
    height: 0.7px;
    background-color: ${(props) => props.colors.secondaryText};
  }

  .menu_logout {
    span {
      margin-top: 5px;
    }
  }
`

interface IListItemProps {
  colors: any
  active: boolean
  noOpen: string
  periodpanel?: string
}

const ListItem = styled.div<any>`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  letter-spacing: normal;
  padding-left: 10px;
  padding-top: ${(props: IListContainerProps) =>
    props.periodpanel !== 'tradebox' && '10px'};
  transition: 0.2s all ease-out;

  img,
  div {
    margin-left: 10px;
    flex: 0 0 24px;
  }

  span:nth-child(1) {
    padding-top: 5px;
    height: 35px;
  }

  span:hover {
    color: ${(props: IListItemProps) =>
      props.periodpanel === 'tradebox' && props.colors.primary};
  }
  span:active {
    color: ${(props: IListItemProps) =>
      props.periodpanel === 'tradebox' && props.colors.primary};
  }

  span:nth-child(2) {
    margin-left: 10px;
    flex: 1 1 auto;
  }
  cursor: pointer;

  svg path {
    transition: 0.2s all ease-out;
  }

  &:active {
    color: ${(props: IListItemProps) =>
      props.periodpanel === 'tradebox' && props.colors.primary};
  }

  &:hover {
    color: ${(props: IListItemProps) =>
      props.periodpanel !== 'tradebox'
        ? props.colors.primaryText
        : props.colors.primary};
    background-color: ${(props: IListItemProps) =>
      props.noOpen !== 'tradebox' && props.colors.panelBackground};

    .themed_icon {
      svg {
        fill: ${(props: IListItemProps) =>
          props.noOpen !== 'tradebox'
            ? props.colors.primaryText
            : props.colors.primary};
        stroke: ${(props: IListItemProps) =>
          props.noOpen !== 'tradebox'
            ? props.colors.primaryText
            : props.colors.primary};
      }
    }

    svg path {
      fill: ${(props: IListItemProps) =>
        props.noOpen !== 'tradebox'
          ? props.colors.primaryText
          : props.colors.primary};
      stroke: ${(props: IListItemProps) =>
        props.noOpen !== 'tradebox'
          ? props.colors.primaryText
          : props.colors.primary};
    }
  }

  .themed_icon {
    svg {
      vertical-align: middle;

      ${(props) =>
        props.active
          ? css`
              fill: ${props.periodpanel !== 'tradebox'
                ? props.colors.primaryText
                : props.colors.primary};
              stroke: ${props.periodpanel !== 'tradebox'
                ? props.colors.primaryText
                : props.colors.primary};
            `
          : css``}
    }
  }

  color: ${(props: IListItemProps) =>
    props.active
      ? props.noOpen !== 'tradebox'
        ? props.colors.primaryText
        : props.colors.primary
      : props.colors.secondaryText};
  background-color: ${(props: IListItemProps) =>
    props.noOpen !== 'tradebox' && props.active
      ? props.colors.listBackgroundNormal
      : 'transparent'};
`
export { ListContainer, ListItem }
