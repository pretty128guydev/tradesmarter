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
  flex-direction: ${(props) => (props.isMobile ? 'row' : 'column')};
`

export const ButtonWrapper = styled.div<any>`
  height: ${(props) => (props.isMobile ? '50px' : 'unset')};
  padding: ${(props) => (props.isMobile ? 'unset' : '20px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin: 10px;
  cursor: pointer;
  border-radius: 5px;
  pointer-events: ${(props) => (props.disable ? 'none' : 'unset')};
  color: ${(props) => getTextColor(props)};
  background: ${(props) => getBackground(props)};
  border: 1px solid ${(props) => getBackgroundBorder(props)};
  svg {
    fill: ${(props) => getTextColor(props)};
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
      fill: ${(props) => props.colors.primaryText} !important;
    }
  }
`

export const ButtonTitle = styled.div<any>`
  font-size: ${(props) => (props.isMobile ? '18' : '12')}px;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: ${(props) => (props.isMobile ? 'row' : 'column')};

  .dp__arrow {
    margin-right: ${(props) => (props.isMobile ? '6px' : '0')};
  }
`
