/**
 * Implements an amount field
 */
import React from 'react'
import styled, { css } from 'styled-components'
import CurrencyInput from 'react-currency-input-field'
import { isMobileLandscape } from '../../../core/utils'

interface IMobileExpirySelect {
  colors: any
  games: any
  game: any
  actionSetSelectedCfdOptionExpiry: any
}

const MobileExpirySelectPanel = styled.div<{ colors: any; isMobile: boolean }>`
  display: flex;
  margin-top: ${(props) => (props.isMobile ? 10 : 0)}px;
  margin-bottom: ${(props) => (props.isMobile ? 15 : 10)}px;

  .amount-input {
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
    pointer-events: none;

    &::placeholder {
      color: ${(props) => props.colors.primary};
    }

    color: ${(props) => props.colors.primary};
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

  color: ${(props) => props.colors.primaryText};
  background-color: ${(props) => props.colors.tradebox.fieldBackground};

  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'unset')};
  opacity: ${(props) => (props.disabled ? '0.3' : '1')};
`
const MobileExpirySelect = (props: IMobileExpirySelect) => {
  const currentGameIndex = props.games
    .map((e: any) => e.cdfExpiry)
    .indexOf(props.game.cdfExpiry)
  const isDisabledNext = props.games[currentGameIndex + 1] == null
  const isDisabledPrevious = props.games[currentGameIndex - 1] == null

  return (
    <MobileExpirySelectPanel isMobile={true} colors={props.colors}>
      <SignButton
        colors={props.colors}
        disabled={isDisabledPrevious}
        onClick={() =>
          props.actionSetSelectedCfdOptionExpiry(
            props.games[currentGameIndex - 1].cdfExpiry
          )
        }
      >
        -
      </SignButton>
      <CurrencyInput
        className="amount-input"
        name="amount"
        placeholder={`${props.game.cdfExpiry ?? ''} H`}
        allowNegativeValue={false}
      />
      <SignButton
        colors={props.colors}
        disabled={isDisabledNext}
        onClick={() =>
          props.actionSetSelectedCfdOptionExpiry(
            props.games[currentGameIndex + 1].cdfExpiry
          )
        }
      >
        +
      </SignButton>
    </MobileExpirySelectPanel>
  )
}

export default MobileExpirySelect
