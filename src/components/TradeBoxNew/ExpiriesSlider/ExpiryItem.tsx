import React from 'react'
import { formatExpiryTimestamp, formatShortExpiry } from '../ExpirySelect'
import { ExpiryItemBox } from './styled'
import { IGame } from '../../../reducers/games'
import { IOpenTrade } from '../../../core/interfaces/trades'
import { t } from 'ttag'

interface ExpiryItemProps {
  game: IGame
  colors: any
  selected: (game: IGame) => boolean
  onSelect: (game: IGame) => void
  getPositionsForExpiry: (game: IGame) => IOpenTrade[] | undefined
}

const ExpiryItem = (props: ExpiryItemProps) => {
  const { game, selected, onSelect, getPositionsForExpiry } = props
  const trades = getPositionsForExpiry(game)

  return (
    <ExpiryItemBox
      key={`${game.deadPeriod}-${game.timestamp}`}
      colors={props.colors}
      disabled={game.disabled}
      onClick={() => onSelect(game)}
      active={selected(game)}
    >
      <div className="expiration">
        <span>
          {game.isCfdOptions
            ? t`${game.cdfExpiry}H`
            : formatExpiryTimestamp(game)}
        </span>
        {Array.isArray(trades) && (
          <span className="trades_count">{trades.length}</span>
        )}
      </div>
      {!game.isCfdOptions && (
        <div className="expiry_payout">
          {formatShortExpiry(game.expiry)}
          <span>|</span>
          {game.payout}%
        </div>
      )}
    </ExpiryItemBox>
  )
}

export default ExpiryItem
