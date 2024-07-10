/**
 * Implements an amount field
 */
import React from 'react'
import styled, { css } from 'styled-components'
import CurrencyInput from 'react-currency-input-field'
import { isMobileLandscape } from '../../core/utils'

const isDisabled = (
  curValue: number,
  investValue: number,
  minValue: number,
  maxValue: number,
  loggedIn: boolean
): boolean => {
  if (!loggedIn && (curValue > 0 || investValue > 0)) return false
  return curValue + investValue > maxValue || curValue + investValue < minValue
}

interface IBettingAmountFieldProps {
  colors: any
  currencySymbol: string
  isMobile: boolean
  value: number | string
  minStake: number
  defaultStake: number
  maxStake: number
  precision: number
  onChange: (value: number | string) => void
  onClick: () => void
  loggedIn: boolean
}

const AmountFieldPanel = styled.div<{ colors: any; isMobile: boolean }>`
  display: flex;
  margin-top: ${(props) => (props.isMobile ? 15 : 10)}px;
  margin-bottom: ${(props) => (props.isMobile ? 15 : 10)}px;
  position: relative;

  .amount-input,
  .amount-input:disabled {
    ${(props) =>
      isMobileLandscape(props.isMobile)
        ? css``
        : css`
            flex: 1 0 auto;
          `}
    box-sizing: border-box;
    height: 35px;
    border-radius: 3px;
    min-width: 0;
    margin: 0 5px;
    font-size: 16px;
    font-weight: 500;
    line-height: 0.75;
    letter-spacing: 0.13px;
    text-align: center;
    border: none;
    outline: none;
    opacity: 1;

    &::placeholder {
      color: ${(props) => props.colors.primaryText};
    }

    background-color: ${(props) => props.colors.tradebox.fieldBackground};
  }
`
const SignButton = styled.div<{ colors: any; disabled: boolean }>`
  flex: 0 0 35px;
  height: 35px;
  line-height: 35px;
  border-radius: 3px;
  text-align: center;
  user-select: none;
  font-size: 30px;
  color: ${(props) => props.colors.primaryText};
  background-color: ${(props) => props.colors.tradebox.fieldBackground};

  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

const WrappedDisableInput = styled.div`
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 0 40px;
`

const BettingAmountField = (props: IBettingAmountFieldProps) => {
  const step: number = props.defaultStake
  const onAdjust = (delta: number) => {
    if (
      isDisabled(
        Number(props.value),
        delta,
        props.minStake,
        props.maxStake,
        props.loggedIn
      )
    ) {
      // ignored
    } else {
      const value = Number(props.value) + delta
      props.onChange(value > 0 ? value : 0)
    }
  }

  return (
    <AmountFieldPanel isMobile={props.isMobile} colors={props.colors}>
      <WrappedDisableInput onClick={props.onClick} />
      <SignButton
        colors={props.colors}
        disabled={isDisabled(
          Number(props.value),
          -step,
          props.minStake,
          props.maxStake,
          props.loggedIn
        )}
        onClick={() => onAdjust(-step)}
      >
        –
      </SignButton>
      <CurrencyInput
        className="amount-input"
        name="amount"
        disabled={true}
        value={props.value}
        allowNegativeValue={false}
        decimalsLimit={props.precision}
        prefix={props.currencySymbol}
        onValueChange={(value) => props.onChange(value ? parseFloat(value) : 0)}
      />
      <SignButton
        colors={props.colors}
        disabled={isDisabled(
          Number(props.value),
          step,
          props.minStake,
          props.maxStake,
          props.loggedIn
        )}
        onClick={() => onAdjust(step)}
      >
        +
      </SignButton>
    </AmountFieldPanel>
  )
}

export default BettingAmountField
