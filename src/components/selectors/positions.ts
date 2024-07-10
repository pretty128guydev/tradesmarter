/**
 * Open/Closed selectors
 * https://github.com/reduxjs/reselect#creating-a-memoized-selector
 */
import { IClosedTrade, IOpenTrade } from '../../core/interfaces/trades'
import { createSelector } from 'reselect'
import { IGame } from '../../reducers/games'

const openPositionsSelector = (state: any): IOpenTrade[] => state.trades.open

const closedPositionsSelector = (state: any): IClosedTrade[] =>
  state.trades.closed

/**
 * Create a hash where key is expiry timestamp
 * This structure is more effecient than N+1 on each expiry, because hash will be recalculated only when openTrades changes
 */
const openPositionsExpiries = createSelector(
  openPositionsSelector,
  (openTrades: IOpenTrade[]) => {
    const hash: any = {}
    openTrades.forEach((trade: IOpenTrade, index: number) => {
      const { expiryTimestamp, gameType } = trade
      if (gameType === 12) {
        hash[`${expiryTimestamp}${index}`] = [trade]
      } else {
        if (hash[expiryTimestamp]) {
          hash[expiryTimestamp].push(trade)
        } else {
          hash[expiryTimestamp] = [trade]
        }
      }
    })
    return hash
  }
)

/**
 * Create a function that will check a cached hash and return items if any or undefined
 * Returns a function which should be called with expiry as argument
 */
const getPositionsForExpiry = createSelector(
  openPositionsExpiries,
  (hash: any) => {
    return (expiry: IGame) => {
      const key = Number(new Date(expiry.timestamp))
      return hash[key]
    }
  }
)

/**
 * Transform a hash into array of Groups
 * { timestamp: [], .... } => [ [], [], [], [] ]
 */
const getPositionGroups = createSelector(openPositionsExpiries, (hash: any) =>
  Object.keys(hash).map((timestamp: string) => hash[timestamp])
)

export {
  openPositionsSelector,
  closedPositionsSelector,
  openPositionsExpiries,
  getPositionsForExpiry,
  getPositionGroups,
}
