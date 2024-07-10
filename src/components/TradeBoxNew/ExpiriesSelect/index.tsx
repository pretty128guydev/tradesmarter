/**
 * Expiries slider
 */
import React from 'react'
import { IGame } from '../../../reducers/games'
import { IOpenTrade } from '../../../core/interfaces/trades'
import { ExpiriesContainer } from './styled'
import ExpiryItem from './ExpiryItem'
import styled from 'styled-components'
import ThemedIcon from '../../ui/ThemedIcon'
import ArrowUp from '../icons/arrow-up.svg'
import ArrowDown from '../icons/arrow-down.svg'
import Clock from '../icons/clock.svg'

interface IExpiriesSelectProps {
  colors: any
  items: IGame[]
  disabled: boolean
  selected: (game: IGame) => boolean
  onSelect: (game: IGame) => void
  getPositionsForExpiry: (game: IGame) => IOpenTrade[] | undefined
  isMobile: boolean
  isCfdOptions: boolean
}

const SignButton = styled.div<{ disabled: boolean }>`
  user-select: none;
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
    isCfdOptions,
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
    <ExpiriesContainer colors={colors}>
      <div className="currency-container">
        <ThemedIcon
          width={16}
          height={16}
          fill={colors.sidebarLabelText}
          src={Clock}
        />
      </div>
      <ExpiryItem
        game={game}
        colors={colors}
        getPositionsForExpiry={getPositionsForExpiry}
        isMobile={isMobile}
        expiries={items}
        onSelect={onSelect}
        isCfdOptions={isCfdOptions}
        selected={selected}
      />
      <div className="button-container">
        <SignButton
          disabled={gameIndex === items.length - 1 || disabled}
          onClick={() => onAdjust(true)}
        >
          <ThemedIcon
            width={10}
            height={10}
            fill={colors.sidebarLabelText}
            src={ArrowUp}
          />
        </SignButton>
        <SignButton
          disabled={gameIndex <= 0 || disabled}
          onClick={() => onAdjust(false)}
        >
          <ThemedIcon
            width={10}
            height={10}
            fill={colors.sidebarLabelText}
            src={ArrowDown}
          />
        </SignButton>
      </div>
    </ExpiriesContainer>
  )
}

export default ExpiriesSelect
