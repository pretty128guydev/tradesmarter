/**
 * Expiries slider
 */
import React from 'react'
import { IGame } from '../../../reducers/games'
import { IOpenTrade } from '../../../core/interfaces/trades'
import { ExpiriesContainer } from './styled'
import ExpiryItem from './ExpiryItem'
import styled from 'styled-components'

interface IExpiriesSelectProps {
  colors: any
  items: IGame[]
  disabled: boolean
  selected: (game: IGame) => boolean
  onSelect: (game: IGame) => void
  getPositionsForExpiry: (game: IGame) => IOpenTrade[] | undefined
  isMobile: boolean
}

const SignButton = styled.div<{ colors: any; disabled: boolean }>`
  flex: 0 0 35px;
  height: 35px;
  line-height: 35px;
  border-radius: 3px;
  text-align: center;
  user-select: none;
  font-size: 30px;
  color: ${(props) => props.colors.primaryText};
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  background-color: ${(props) => props.colors.tradebox.fieldBackground};

  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

const ExpiriesSelect = (props: IExpiriesSelectProps) => {
  const {
    items,
    selected,
    onSelect,
    colors,
    disabled,
    getPositionsForExpiry,
    isMobile,
  } = props

  const game = items.find((item) => selected(item))
  const gameIndex = items.findIndex((item) => selected(item))

  const onAdjust = (isNext: boolean) => {
    if (isNext && gameIndex < items.length && items[gameIndex + 1])
      return onSelect(items[gameIndex + 1])
    if (!isNext && gameIndex >= 1 && items[gameIndex - 1])
      return onSelect(items[gameIndex - 1])
  }

  return (
    <ExpiriesContainer>
      <SignButton
        colors={colors}
        disabled={gameIndex <= 0 || disabled}
        onClick={() => onAdjust(false)}
        className="expires-button-minus"
      >
        –
      </SignButton>
      <ExpiryItem
        game={game}
        colors={colors}
        getPositionsForExpiry={getPositionsForExpiry}
        isMobile={isMobile}
        expiries={items}
        onSelect={onSelect}
      />
      <SignButton
        colors={colors}
        disabled={gameIndex === items.length - 1 || disabled}
        onClick={() => onAdjust(true)}
        className="expires-button-plus"
      >
        +
      </SignButton>
    </ExpiriesContainer>
  )
}

export default ExpiriesSelect
