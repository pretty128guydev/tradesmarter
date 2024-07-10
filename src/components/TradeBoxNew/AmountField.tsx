/**
 * Implements an amount field
 */
import React from 'react'
import styled, { css } from 'styled-components'
import CurrencyInput from 'react-currency-input-field'
import ThemedIcon from '../ui/ThemedIcon'
import ArrowUp from './icons/arrow-up.svg'
import ArrowDown from './icons/arrow-down.svg'

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

const AmountFieldPanel = styled.div<{ colors: any }>`
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: ${(props) => props.colors.tradebox.fieldBackground};
  border-radius: 3px;

  .amount-input {
    flex: 1;
    box-sizing: border-box;
    height: 35px;
    min-width: 0;
    font-size: 16px;
    text-align: right;
    border: none;
    outline: none;
    background-color: transparent;
    color: ${(props) => props.colors.primaryText};
  }

  .currency-container {
    width: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.colors.sidebarLabelText};
  }

  .button-container {
    width: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
`
const SignButton = styled.div<{ disabled: boolean }>`
  user-select: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

const AmountField = (props: IAmountFieldProps) => {
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
    <AmountFieldPanel colors={props.colors}>
      <div className="currency-container">{props.currencySymbol}</div>
      <CurrencyInput
        className="amount-input"
        name="amount"
        value={props.value}
        allowNegativeValue={false}
        decimalsLimit={props.precision}
        onValueChange={(value) => props.onChange(value ? parseFloat(value) : 0)}
        onFocus={() => props.onFocus?.()}
        readOnly={props.onFocus != null}
      />
      <div className="button-container">
        <SignButton
          disabled={isDisabled(
            Number(props.value),
            step,
            props.minStake,
            props.maxStake,
            props.loggedIn
          )}
          onClick={() => onAdjust(step)}
        >
          <ThemedIcon
            width={10}
            height={10}
            fill={props.colors.sidebarLabelText}
            src={ArrowUp}
          />
        </SignButton>
        <SignButton
          disabled={isDisabled(
            Number(props.value),
            -step,
            props.minStake,
            props.maxStake,
            props.loggedIn
          )}
          onClick={() => onAdjust(-step)}
        >
          <ThemedIcon
            width={10}
            height={10}
            fill={props.colors.sidebarLabelText}
            src={ArrowDown}
          />
        </SignButton>
      </div>
    </AmountFieldPanel>
  )
}

export default AmountField
