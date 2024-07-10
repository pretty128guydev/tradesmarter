import styled from 'styled-components'
import { isMobileLandscape } from '../../../core/utils'
import {
  getButtonBackground,
  getButtonTextColor,
  ButtonModes,
} from '../DirectionPanels'

const getTextColor = (props: any) => {
  if (props.disable) {
    return '#8491A3'
  }
  if (props.activeButton && props.activeButton === props.direction) {
    return props.colors.tradebox.highlowDepressedTextColor
  }

  return getButtonTextColor(
    props,
    props.direction === 1 ? ButtonModes.high : ButtonModes.low
  )
}

const getBackground = (props: any) => {
  if (props.disable) {
    return 'transparent'
  }
  if (props.activeButton && props.activeButton === props.direction) {
    return props.activeButton === 1
      ? props.colors.tradebox.highActive
      : props.colors.tradebox.lowActive
  }

  return getButtonBackground(
    props,
    props.direction === 1 ? ButtonModes.high : ButtonModes.low
  )
}

const getBackgroundBorder = (props: any) => {
  if (props.disable) {
    return props.colors.secondaryText
  }
  if (props.activeButton && props.activeButton === props.direction) {
    return props.activeButton === 1
      ? props.colors.tradebox.highActive
      : props.colors.tradebox.lowActive
  }

  return getButtonBackground(
    props,
    props.direction === 1 ? ButtonModes.high : ButtonModes.low
  )
}

export const ButtonsWrapper = styled.div<any>`
  display: flex;
  flex-direction: ${(props) =>
    isMobileLandscape(props.isMobile) ? 'column' : 'row'};
`

export const ButtonWrapper = styled.div<any>`
  height: ${(props) => (props.isMobile ? '50px' : '60px')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  pointer-events: ${(props) => (props.disable ? 'none' : 'unset')};
  color: ${(props) => getTextColor(props)};
  background: ${(props) => getBackground(props)};
  border: 1px solid ${(props) => getBackgroundBorder(props)};
  svg {
    stroke: ${(props) => getTextColor(props)};
  }

  &:hover,
  &.hover {
    color: ${(props) => props.colors.primaryText} !important;
    border: 1px solid
      ${(props) =>
        props.direction === 1
          ? props.colors.tradebox.highText
          : props.colors.tradebox.lowText} !important;

    svg {
      stroke: ${(props) => props.colors.primaryText} !important;
    }
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`

export const ButtonTitle = styled.div<any>`
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: ${(props) =>
    isMobileLandscape(props.isMobile) ? 'column' : 'row'};

  .dp__arrow {
    margin-right: ${(props) =>
      isMobileLandscape(props.isMobile) ? '0' : '6px'};
  }
`
