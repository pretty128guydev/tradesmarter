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
    case ButtonStates.depressed:
      return props.colors.tradebox[`${mode}Text`]
    default:
      return props.colors.tradebox[`${mode}Text`]
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
  height: ${(props) => (isMobileLandscape(props.isMobile) ? 70 : 50)}px;
  line-height: 50px;
  font-size: 18px;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
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
    ${(props) =>
      props.isCfdOptions
        ? css`
            padding-top: 4px;
          `
        : css`
            margin-right: ${isMobileLandscape(props.isMobile) ? 0 : 14}px;
            padding-top: 4px;
          `}
    ${(props) =>
      isMobileLandscape(props.isMobile)
        ? css`
            line-height: 20px;
          `
        : css``}
  }

  .dp__caption {
    font-weight: bold;
    letter-spacing: 0.01px;

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
      ? props.colors.primaryTextContrast
      : getButtonTextColor(props, ButtonModes.high)};
  background: ${(props) => getButtonBackground(props, ButtonModes.high)};
  border: 1px solid
    ${(props) => getButtonBackgroundBorder(props, ButtonModes.high)};
  display: flex;
  justify-content: center;
  flex-direction: ${(props) => isMobileLandscape(props.isMobile) && 'column'};

  svg {
    stroke: ${(props) =>
      props.value === 1
        ? props.colors.primaryTextContrast
        : getButtonTextColor(props, ButtonModes.high)};
  }

  &:hover {
    ${(props) =>
      props.isMobile
        ? css`
            color: ${props.sendingTrade
              ? props.colors.primaryTextContrast
              : props.value === 1
              ? props.colors.primaryTextContrast
              : getButtonTextColor(props, ButtonModes.high)} !important;
          `
        : css`
            color: ${props.colors.primaryTextContrast} !important;
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
      stroke: ${(props) =>
        props.isMobile
          ? props.sendingTrade
            ? props.colors.primaryTextContrast
            : props.value === 1
            ? props.colors.primaryTextContrast
            : getButtonTextColor(props, ButtonModes.high)
          : props.colors.primaryTextContrast} !important;
    }
  }
`
const High = (props: IDirectionPanelProps) => {
  return (
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
          width="18"
          height="18"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 8L8 1" strokeLinecap="round" />
          <path d="M2 1H8V7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!props.isMobile && props.payout && (
        <span className="dp__payout">{props.payout}%</span>
      )}
      <span className="dp__caption">
        {props.isAboveBelow
          ? props.controlWords['above'] || t`Above`
          : props.payout == null
          ? props.controlWords['up'] || t`UP`
          : props.controlWords['high'] || t`High`}
      </span>
      {/* {(!isMobileLandscape(props.isMobile) || !props.isMobile) &&
        props.payout && <span className="dp__payout">{props.payout}%</span>} */}
    </DirectionPanelHigh>
  )
}

const DirectionPanelLow = styled(DirectionPanel)`
  margin-top: ${(props) => (props.isMobile ? 0 : 10)}px;
  margin-bottom: ${(props) => (props.isMobile ? 0 : 10)}px;
  color: ${(props) =>
    props.value === -1
      ? props.colors.primaryTextContrast
      : getButtonTextColor(props, ButtonModes.low)};
  background: ${(props) => getButtonBackground(props, ButtonModes.low)};
  border: 1px solid
    ${(props) => getButtonBackgroundBorder(props, ButtonModes.low)};
  display: flex;
  justify-content: center;
  flex-direction: ${(props) => isMobileLandscape(props.isMobile) && 'column'};

  svg {
    stroke: ${(props) =>
      props.value === -1
        ? props.colors.primaryTextContrast
        : getButtonTextColor(props, ButtonModes.low)} !important;
  }

  &:hover {
    ${(props) =>
      props.isMobile
        ? css`
            color: ${props.sendingTrade
              ? props.colors.primaryTextContrast
              : props.value === -1
              ? props.colors.primaryTextContrast
              : getButtonTextColor(props, ButtonModes.low)} !important;
          `
        : css`
            color: ${props.colors.primaryTextContrast} !important;
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
      stroke: ${(props) =>
        props.isMobile
          ? props.sendingTrade
            ? props.colors.primaryTextContrast
            : props.value === -1
            ? props.colors.primaryTextContrast
            : getButtonTextColor(props, ButtonModes.low)
          : props.colors.primaryTextContrast} !important;
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
        width="18"
        height="18"
        viewBox="0 0 9 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1 1L8 8" strokeLinecap="round" />
        <path d="M2 8H8V2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    {!props.isMobile && props.payout && (
      <span className="dp__payout">{props.payout}%</span>
    )}
    <span className="dp__caption">
      {props.isAboveBelow
        ? props.controlWords['below'] || t`Below`
        : props.payout == null
        ? props.controlWords['down'] || t`DOWN`
        : props.controlWords['low'] || t`Low`}
    </span>
    {/* {(!isMobileLandscape(props.isMobile) || !props.isMobile) &&
      props.payout && <span className="dp__payout">{props.payout}%</span>} */}
  </DirectionPanelLow>
)

export { High, Low }
