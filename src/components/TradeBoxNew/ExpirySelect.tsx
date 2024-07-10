/**
 * Implements a two rows, first rows selects short-long mode for games
 * Second row shows available games
 * Selected games fetched from redux and passed back onSelect
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import styled from 'styled-components'
import { IGame } from '../../reducers/games'
import { actionSelectGame } from '../../actions/game'
import { actionShowModal, ModalTypes } from '../../actions/modal'
import { getPositionsForExpiry } from '../selectors/positions'
import { IOpenTrade } from '../../core/interfaces/trades'
import { actionSetSelectedCfdOptionExpiry } from '../../actions/trading'
import { LocaleDate } from '../../core/localeFormatDate'
import ExpiriesSelect from './ExpiriesSelect'
import moment from 'moment'
import { isAboveBelowProductType } from '../selectors/trading'

const ExpirySelectContainer = styled.div<any>`
  display: block;
  width: 100%;
  margin-top: ${(props) => (props.isMobile ? 0 : 9)}px;
  margin-bottom: 14px;
`
const Line = styled.div<any>`
  display: flex;
  height: 28px;
  line-height: 28px;
  ${(props) => (props.bottom ? 'margin-top: 5px;' : '')}
`

const LineButton = styled.span<any>`
  flex: 1 1 auto;
  height: 28px;
  line-height: 28px;
  text-align: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  ${(props) => (props.disabled ? 'opacity: .4' : '')};
  user-select: none;

  ${(props) => (props.isMobile ? 'max-width: 84px' : '')};

  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.11px;

  margin-left: 1px;
  margin-right: 1px;

  &:first-child {
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    margin-left: 0;
  }

  &:last-child {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    margin-right: 0;
  }

  ${(props) =>
    props.isMobile
      ? ``
      : `color: ${
          props.disabled
            ? props.colors.primaryText
            : props.active
            ? props.colors.primary
            : props.colors.primaryText
        }`};

  ${(props) =>
    !props.isMobile
      ? ``
      : `color: ${
          props.disabled
            ? props.colors.primaryText
            : props.active
            ? props.colors.primaryTextContrast
            : props.colors.primary
        }`};

  outline: ${(props) =>
    props.isMobile
      ? 'none'
      : props.active
      ? `1px solid ${props.colors.primary}`
      : 'none'};

  background-color: ${(props) =>
    !props.isMobile
      ? props.colors.tradebox.fieldBackground
      : props.active
      ? props.colors.primary
      : props.colors.background};

  opacity: ${(props) => (props.disabled ? '0.7' : '1')};

  &:hover {
    color: ${(props) =>
      props.disabled ? props.colors.primaryText : props.primary};
  }
`

interface IExpirySelectProps {
  colors: any
  isMobile: boolean
  games: any
  game: IGame
  disabled: boolean
  actionSelectGame: (game: IGame) => void
  actionShowModal: (mt: ModalTypes, mProps: any) => void
  getPositionsForExpiry: (game: IGame) => IOpenTrade[] | undefined
  actionSetSelectedCfdOptionExpiry: (expiry: number) => void
  positions: IOpenTrade[]
  disableShortLong?: boolean
  isCfdOptions: boolean
  isAboveBelow: boolean
  distances: any
  noOpen?: string
}
/**
 * Format expiry for shortGames
 * @param expiry
 */
export const formatShortExpiry = (expiry: number): string => {
  if (expiry) {
    if (expiry < 60) {
      return t`${expiry} seconds`
    } else {
      if (expiry < 7200) {
        expiry = expiry / 60
        return t`${expiry} min`
      } else {
        let hours = Math.round(expiry / 3600)
        if (hours <= 24) {
          return hours === 1 ? t`${hours} hour` : t`${hours} hours`
        } else {
          hours = Math.round(hours / 24)
          return hours === 1 ? t`${hours} day` : t`${hours} days`
        }
      }
    }
  }

  return ''
}

/**
 * Check if dates are the same day
 * @param first
 * @param second
 */
export const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()

/**
 * Formatters for long game types
 * @param game
 */
export const formatExpiryTimestamp = (game: IGame): string => {
  if (typeof game.timestamp === 'string') {
    game.timestamp = new Date(Date.parse(game.timestamp))
  }

  if (typeof game.timestamp === 'number') {
    game.timestamp = new Date(game.timestamp)
  }

  if (datesAreOnSameDay(game.timestamp as Date, new Date())) {
    return LocaleDate.format(game.timestamp as Date, 'HH:mm') // 10:23
  } else {
    return LocaleDate.format(game.timestamp as Date, 'LLL-d') // Feb-26
  }
}
/**
 * Formatters for long game types
 * @param game
 */
// const formatLongExpiry = (game: IGame): string => {
//   if (game.gameType === 1) {
//     return LocaleDate.format(game.timestamp as Date, 'HH:mm') // 10:23
//   } else {
//     return LocaleDate.format(game.timestamp as Date, 'LLL-d') // Feb-26
//   }
// }

// const tooltipFormatter = (game: IGame) =>
// 	LocaleDate.format(game.timestamp as Date, 'LLL-d HH:mm')

/**
 * Check if current game equals this game
 * @param selected
 * @param game
 */
export const isSameGame = (
  selected: IGame | null,
  game: IGame | null
): boolean => {
  if (selected && game) {
    if (game.isCfdOptions) {
      return game.cdfExpiry === selected.cdfExpiry
    }

    if (game.isAboveBelow) {
      return moment(selected.timestamp).isSame(moment(game.timestamp))
    }

    return (
      selected.deadPeriod === game.deadPeriod &&
      moment(selected.timestamp).isSame(moment(game.timestamp)) &&
      selected.gameType === game.gameType &&
      selected.payout === game.payout &&
      selected.round === game.round
    )
  }
  return false
}

/**
 * Expiries formatter like time (duration)
 */
export const formatListExpiry = (game: IGame): string =>
  game.isCfdOptions
    ? `${game.cdfExpiry}H`
    : `${formatExpiryTimestamp(game)} (${formatShortExpiry(game.expiry)})`

interface IGamesDictionary {
  [gameType: string]: IGame[]
}

/**
 * Ensure that all of the games have a positions
 * @param gamesArray
 * @param positions
 */
// const verifyGames = (
//   gameTypes: number[],
//   gamesArray: IGame[],
//   positions: IOpenTrade[]
// ): IGame[] => {
//   const missingList: IOpenTrade[] = []
//   // Create a array of present timestamps
//   const gamesTimestamps: number[] = gamesArray.map((game: IGame) => {
//     if (typeof game.timestamp === 'string') {
//       return Number(new Date(Date.parse(game.timestamp)))
//     }
//     return Number(game.timestamp)
//   })
//   // Verify that all of timestamps are included
//   positions.forEach((trade: IOpenTrade) => {
//     if (!gamesTimestamps.includes(trade.expiryTimestamp)) {
//       if (gameTypes.includes(trade.gameType)) {
//         missingList.push(trade)
//       }
//     }
//   })
//   // Add a missing expiries
//   if (missingList.length > 0) {
//     const newGames: IGame[] = missingList.map((trade: IOpenTrade) => {
//       return {
//         round: 0,
//         expiry: 0,
//         deadPeriod: 0,
//         gameType: trade.gameType,
//         payout: String(trade.payout),
//         rebate: String(trade.rebate),
//         timestamp: new Date(trade.expiryTimestamp),
//         disabled: true,
//       }
//     })
//     return [...newGames, ...gamesArray]
//   }
//   // Nothing to add, ignore
//   return gamesArray
// }

/**
 * Merge games between multiple gameTypes
 * @param games
 * @param gameTypes
 */
const collectGames = (
  games: IGamesDictionary,
  gameTypes: number[],
  isMobile: boolean,
  positions: IOpenTrade[]
) => {
  if (games) {
    return gameTypes
      .map((gameType: number) => (games as any)[gameType])
      .flat()
      .sort((game) => game.expiry)
      .filter((game: any) => !!game) // could be undefined in very rare cases
    /**
     * Check if there is a game for selected expiry
     */
    // if (positions.length > 0) {
    // 	gamesArray = verifyGames(gameTypes, gamesArray, positions)
    // }
  }
  return []
}

const ExpirySelect = (props: IExpirySelectProps) => {
  const {
    games,
    isMobile,
    positions,
    isAboveBelow,
    isCfdOptions,
    distances,
    disabled,
    actionSetSelectedCfdOptionExpiry,
    actionSelectGame,
    colors,
    getPositionsForExpiry,
    noOpen,
  } = props
  const gameTypes = [2, 1, 11]
  const items: IGame[] = !isCfdOptions
    ? isAboveBelow
      ? distances
      : collectGames(games, gameTypes, isMobile, positions)
    : games

  const onExpirySelect = (game: IGame) => {
    if (game.isCfdOptions && game.cdfExpiry) {
      return actionSetSelectedCfdOptionExpiry(game.cdfExpiry)
    }

    !disabled && actionSelectGame(game)
  }

  return (
    <ExpirySelectContainer isMobile={false}>
      <ExpiriesSelect
        items={items}
        colors={colors}
        disabled={disabled}
        selected={(game: IGame) => isSameGame(props.game, game)}
        onSelect={(game: IGame) => onExpirySelect(game)}
        getPositionsForExpiry={getPositionsForExpiry}
        isMobile={isMobile}
        isCfdOptions={isCfdOptions}
      />
    </ExpirySelectContainer>
  )
}

const mapStateToProps = (state: any) => ({
  getPositionsForExpiry: getPositionsForExpiry(state),
  positions: state.trades.open,
  isAboveBelow: isAboveBelowProductType(state),
  distances: state.trading.distances,
})

export default connect(mapStateToProps, {
  actionSelectGame,
  actionShowModal,
  actionSetSelectedCfdOptionExpiry,
})(ExpirySelect)
