/**
 * So each of buttons have 4 states:
 * 	unselected (normal)
 * 	active (selected)
 * 	hover (any)
 * 	depressed (when opposite is selected)
 */
import React from 'react'
import styled, { css } from 'styled-components'
import { t } from 'ttag'
import { isMobileLandscape } from '../../core/utils'

interface IDirectionPanelProps {
  colors: any
  isMobile: boolean
  value: number
  payout: number | undefined
  onChange: (value: number) => void
  onHover: (value: number) => void
  disabled: boolean
  sendingTrade?: boolean
  isAboveBelow?: boolean
  controlWords?: any
}

export enum ButtonStates {
  normal,
  active,
  depressed,
}
export enum ButtonModes {
  high = 'high',
  low = 'low',
}

export const getButtonState = (
  props: IDirectionPanelProps | any,
  mode: ButtonModes
): ButtonStates => {
  switch (props.value) {
    case 0:
      return ButtonStates.normal
    case 1:
      return mode === ButtonModes.high
        ? ButtonStates.active
        : ButtonStates.depressed
    case -1:
      return mode === ButtonModes.low
        ? ButtonStates.active
        : ButtonStates.depressed
    default:
      return ButtonStates.normal
  }
}
/**
 * Get button background depending on two states
 */
export const getButtonBackground = (
  props: IDirectionPanelProps | any,
  mode: ButtonModes
): string => {
  // if (props.disabled) {
  //   return 'transparent'
  // }
  const state = getButtonState(props, mode)
  switch (state) {
    case ButtonStates.active:
      return props.colors.tradebox[`${mode}Active`]
    case ButtonStates.depressed:
      return props.colors.tradebox[`${mode}Depressed`]
    default:
      return props.colors.tradebox[`${mode}Normal`]
  }
}

export const getButtonBackgroundBorder = (
  props: IDirectionPanelProps | any,
  mode: ButtonModes
): string => {
  // if (props.disabled) {
  //   return props.colors.secondaryText
  // }
  const state = getButtonState(props, mode)
  switch (state) {
    case ButtonStates.active:
      return props.colors.tradebox[`${mode}Active`]
    case ButtonStates.depressed:
      return props.colors.tradebox[`${mode}Depressed`]
    default:
      return props.colors.tradebox[`${mode}Normal`]
  }
}

/**
 * Get button text color depending on two states
 */
export const getButtonTextColor = (
  props: IDirectionPanelProps | any,
  mode: ButtonModes
): string => {
  // if (props.disabled) {
  //   return props.colors.secondaryText
  // }
  const state = getButtonState(props, mode)
  switch (state) {
    case ButtonStates.active:
      return props.colors.tradebox.highlowDepressedTextColor
    default:
      return props.colors.primaryText
  }
}

const DirectionPanel = styled.div<{
  colors: any
  value: number
  isMobile: boolean
  disabled: boolean
  isCfdOptions: boolean
  sendingTrade?: boolean
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  margin-left: 10px;
  margin-right: 10px;
  padding: 20px 0;

  ${(props) =>
    isMobileLandscape(props.isMobile)
      ? css`
          padding: 5px 0;
        `
      : css``};

  ${(props) =>
    props.isCfdOptions
      ? css`
          gap: 8px;
          justify-content: center;
        `
      : css``}

  .dp__arrow {
    path {
      fill: ;
    }
  }

  .dp__caption {
    font-weight: 700;

    ${(props) =>
      isMobileLandscape(props.isMobile)
        ? css`
            line-height: 20px;
          `
        : css``}
  }

  .dp__payout {
    margin-left: ${(props) => (isMobileLandscape(props.isMobile) ? 5 : 12)}px;
    font-weight: bold;
    letter-spacing: 0.01px;
    ${(props) =>
      isMobileLandscape(props.isMobile)
        ? css`
            line-height: 20px;
          `
        : css``}
  }
`

const DirectionPanelHigh = styled(DirectionPanel)`
  margin-top: ${(props) => (props.isMobile ? 0 : 10)}px;
  margin-bottom: ${(props) => (props.isMobile ? 0 : 10)}px;
  color: ${(props) =>
    props.value === 1
      ? props.colors.primaryText
      : getButtonTextColor(props, ButtonModes.high)};
  background: ${(props) => getButtonBackground(props, ButtonModes.high)};
  border: 1px solid
    ${(props) => getButtonBackgroundBorder(props, ButtonModes.high)};

  svg {
    fill: ${(props) =>
      props.value === 1
        ? props.colors.primaryText
        : getButtonTextColor(props, ButtonModes.high)};
  }

  &:hover {
    ${(props) =>
      props.isMobile
        ? css`
            color: ${props.sendingTrade
              ? props.colors.primaryText
              : props.value === 1
              ? props.colors.primaryText
              : getButtonTextColor(props, ButtonModes.high)} !important;
          `
        : css`
            color: ${props.colors.primaryText} !important;
          `}

    ${(props) =>
      props.isMobile
        ? css`
            border: 1px solid
              ${props.sendingTrade
                ? props.colors.tradebox.highText
                : props.value === 1
                ? props.colors.tradebox.highText
                : getButtonBackground(props, ButtonModes.high)} !important;
          `
        : css`
            border: 1px solid ${props.colors.tradebox.highText} !important;
          `}

    svg {
      fill: ${(props) =>
        props.isMobile
          ? props.sendingTrade
            ? props.colors.primaryText
            : props.value === 1
            ? props.colors.primaryText
            : getButtonTextColor(props, ButtonModes.high)
          : props.colors.primaryText} !important;
    }
  }
`
const High = (props: IDirectionPanelProps) => (
  <DirectionPanelHigh
    disabled={props.disabled}
    colors={props.colors}
    value={props.value}
    isMobile={props.isMobile}
    isCfdOptions={props.payout == null}
    onClick={() => props.onChange(props.value === 1 ? 0 : 1)}
    onMouseEnter={() => props.onHover(1)}
    onMouseLeave={() => props.onHover(0)}
    sendingTrade={props.sendingTrade}
  >
    <span className="dp__arrow">
      <svg
        width="19"
        height="15"
        viewBox="0 0 19 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.0157 2.09084L12.8651 0H18.5V5.4782L16.3494 3.38736L10.4329 9.13033L6.67635 5.4782L0.500191 11.3477L0.5 8.9999L6.67635 2.89432L10.4329 6.54644L15.0157 2.09084Z"
          stroke="none"
        />
        <path
          d="M18.4998 6.6521L16.152 4.6956V14.0868H18.4998V6.6521Z"
          stroke="none"
        />
        <path
          d="M8.326 8.6086L10.6738 10.5651V14.0868H8.326V8.6086Z"
          stroke="none"
        />
        <path
          d="M12.239 9.3912L14.5868 7.0434V14.0868H12.239V9.3912Z"
          stroke="none"
        />
        <path
          d="M6.7608 7.0434L4.413 9.3912V14.0868H6.7608V7.0434Z"
          stroke="none"
        />
        <path
          d="M0.5 12.5216L2.8478 10.1738V14.0868H0.5V12.5216Z"
          stroke="none"
        />
      </svg>
    </span>
    <span className="dp__caption">
      {props.isAboveBelow
        ? props.controlWords['above'] || t`Above`
        : props.payout == null
        ? props.controlWords['up'] || t`UP`
        : props.controlWords['high'] || t`Higher`}
    </span>
  </DirectionPanelHigh>
)

const DirectionPanelLow = styled(DirectionPanel)`
  margin-top: ${(props) => (props.isMobile ? 0 : 10)}px;
  margin-bottom: ${(props) => (props.isMobile ? 0 : 10)}px;
  color: ${(props) =>
    props.value === -1
      ? props.colors.primaryText
      : getButtonTextColor(props, ButtonModes.low)};
  background: ${(props) => getButtonBackground(props, ButtonModes.low)};
  border: 1px solid
    ${(props) => getButtonBackgroundBorder(props, ButtonModes.low)};

  svg {
    fill: ${(props) =>
      props.value === -1
        ? props.colors.primaryText
        : getButtonTextColor(props, ButtonModes.low)} !important;
  }

  &:hover {
    ${(props) =>
      props.isMobile
        ? css`
            color: ${props.sendingTrade
              ? props.colors.primaryText
              : props.value === -1
              ? props.colors.primaryText
              : getButtonTextColor(props, ButtonModes.low)} !important;
          `
        : css`
            color: ${props.colors.primaryText} !important;
          `}
    ${(props) =>
      props.isMobile
        ? css`
            border: 1px solid
              ${props.sendingTrade
                ? props.colors.secondary
                : props.value === -1
                ? props.colors.secondary
                : getButtonBackground(props, ButtonModes.low)} !important;
          `
        : css`
            border: 1px solid ${props.colors.secondary} !important;
          `}

    svg {
      fill: ${(props) =>
        props.isMobile
          ? props.sendingTrade
            ? props.colors.primaryText
            : props.value === -1
            ? props.colors.primaryText
            : getButtonTextColor(props, ButtonModes.low)
          : props.colors.primaryText} !important;
    }
  }
`
const Low = (props: IDirectionPanelProps) => (
  <DirectionPanelLow
    disabled={props.disabled}
    colors={props.colors}
    value={props.value}
    isMobile={props.isMobile}
    isCfdOptions={props.payout == null}
    onClick={() => props.onChange(props.value === -1 ? 0 : -1)}
    onMouseEnter={() => props.onHover(-1)}
    onMouseLeave={() => props.onHover(0)}
    sendingTrade={props.sendingTrade}
  >
    <span className="dp__arrow">
      <svg
        width="19"
        height="15"
        viewBox="0 0 18 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.913 10.9565L14.8696 9.3913L9.93298 4.63575L6.17642 8.16198L0 2.26686L0.000191067 0L6.17642 5.66718L9.93298 2.14092L16.4348 8.21739L18 7.04348V10.9565H12.913Z"
          stroke="none"
        />
        <path
          d="M2.34783 6.26087L0 4.30435V10.9565H2.34783V6.26087Z"
          stroke="none"
        />
        <path
          d="M3.91304 7.82609L6.26087 9.78261V10.9565H3.91304V7.82609Z"
          stroke="none"
        />
        <path
          d="M13.3043 9.78261L11.7391 8.21739V10.9565L13.3043 9.78261Z"
          stroke="none"
        />
        <path
          d="M10.1739 6.65217L7.82609 8.6087V10.9565H10.1739V6.65217Z"
          stroke="none"
        />
      </svg>
    </span>
    <span className="dp__caption">
      {props.isAboveBelow
        ? props.controlWords['below'] || t`Below`
        : props.payout == null
        ? props.controlWords['down'] || t`DOWN`
        : props.controlWords['low'] || t`Lower`}
    </span>
  </DirectionPanelLow>
)

export { High, Low }
