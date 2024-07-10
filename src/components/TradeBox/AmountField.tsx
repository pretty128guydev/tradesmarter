/**
 * Implements an amount field
 */
import React, { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import CurrencyInput from 'react-currency-input-field'

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

interface IAmountFieldProps {
  colors: any
  currencySymbol: string
  isMobile: boolean
  value: number | string
  minStake: number
  defaultStake: number
  maxStake: number
  precision: number
  onChange: (value: number) => void
  onFocus?: () => void
  isCfdOptions: boolean
  loggedIn: boolean
}

const AmountFieldPanel = styled.div<{ colors: any; isMobile: boolean }>`
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;

  .amount-input {
    flex: 1;
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

    color: ${(props) => props.colors.primaryText};
    background-color: ${(props) => props.colors.tradebox.fieldBackground};
  }
`
const SignButton = styled.div<{
  colors: any
  disabled: boolean
  isCfdOptions: boolean
}>`
  flex: 0 0 35px;
  height: 35px;
  line-height: 35px;
  border-radius: 3px;
  text-align: center;
  user-select: none;
  ${(props) =>
    props.isCfdOptions
      ? css``
      : css`
          font-size: 30px;
        `}
  color: ${(props) => props.colors.primaryText};
  background-color: ${(props) => props.colors.tradebox.fieldBackground};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

const AmountField = (props: IAmountFieldProps) => {
  const currencyInputRef: any = useRef(null)

  useEffect(() => {
    if (props.value === 0 && currencyInputRef?.current) {
      currencyInputRef.current.selectionStart = 2
      currencyInputRef.current.selectionEnd = 2
    }
  }, [props.value])

  const step = props.defaultStake
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
        isCfdOptions={props.isCfdOptions}
      >
        -
      </SignButton>
      <CurrencyInput
        ref={currencyInputRef}
        className="amount-input"
        name="amount"
        value={props.value}
        allowNegativeValue={false}
        decimalsLimit={props.precision}
        prefix={props.currencySymbol}
        onValueChange={(value) => props.onChange(value ? parseFloat(value) : 0)}
        onFocus={() => props.onFocus?.()}
        readOnly={props.onFocus != null}
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
        isCfdOptions={props.isCfdOptions}
      >
        +
      </SignButton>
    </AmountFieldPanel>
  )
}

export default AmountField
