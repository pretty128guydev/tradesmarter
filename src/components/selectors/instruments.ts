/**
 * Memoized selectors for instruments
 */
import { createSelector } from 'reselect'
import uniq from 'lodash/uniq'
import { IInstrument, IUserInfo } from '../../core/API'
import { IGame } from '../../reducers/games'
import { InstrumentsMap } from '../../reducers/instruments'
import { QuotesMap } from '../../reducers/quotes'
import { isLoggedIn } from './loggedIn'
import { IShortInstrument } from '../ChartContainer/InstrumentsBar'
import { ProductType } from '../../reducers/trading'

/**
 * Get selected instrument id
 * @param state
 */
const selectedInstrument = (state: any) => state.trading.selected

const instrumentsFromTrading = (state: any) => state.trading.instruments
const instrumentsFromRegistry = (state: any) => state.instruments
/**
 * Access quotes hash
 * @param state
 */
const quotes = (state: any) => state.quotes
const instruments = (state: any) => state.instruments
const userInfo = (state: any) => state.account.userInfo

const getInstrumentObject = createSelector(
  selectedInstrument,
  instruments,
  (selected: string, instruments: InstrumentsMap) => instruments[selected]
)

const getInstrumentName = createSelector(
  [getInstrumentObject],
  (instrument: IInstrument) => instrument.name
)
/**
 * Return last price for selected instrument or 0 if not enough data
 */
const lastPriceForSelectedInstrument = createSelector(
  selectedInstrument,
  quotes,
  instruments,
  (selected: string, quotes: QuotesMap, instruments: InstrumentsMap) => {
    if (selected && quotes[selected]) {
      const { bid, ask } = quotes[selected]
      const { precision } = instruments[selected]
      /**
       * RoundUp with precision
       * Issue: https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
       */
      return parseFloat(String((bid + ask) / 2)).toFixed(Number(precision))
    }
    return 0.0
  }
)

const lastQuoteForSelectedInstrument = createSelector(
  selectedInstrument,
  quotes,
  (selected: string, quotes: QuotesMap) => {
    if (selected && quotes[selected]) {
      return quotes[selected]
    }
    return {}
  }
)

/**
 * Return list of games for selected asset as hash
 * @param state
 */
const games = (state: any) => state.games

const getActiveExpiries = createSelector(
  selectedInstrument,
  games,
  (selected: string, games: any) => {
    if (games && games[selected]) {
      return games[selected].filter((game: IGame) => !game.disabled)
    }
    return []
  }
)

const featuredInstrumentsIds = (state: any) => state.registry.data.featured

const defaultTopAssets = (state: any) => {
  let instruments: any

  switch (state.trading.selectedProductType) {
    case ProductType.cfdOptions:
      instruments = state.trading.cfdOptionsInstruments
      break

    case ProductType.aboveBelow:
      instruments = state.trading.aboveBelowInstruments
      break
    case ProductType.highLow:
      instruments = Object.values(state.instruments)
      break
  }

  const ids = state.registry.data.featured

  return ids
    .map((id: any) =>
      instruments.find(({ instrumentID }: any) => instrumentID === id)
    )
    .filter((item: any) => item && item.isOpen)
    .slice(0, 5)
}

const getUserInfo = (state: any) => state.account.userInfo

/**
 * Prioritize open vs closed
 * @param collection
 */
const sortOpen = (collection: IInstrument[]) =>
  collection.sort(
    (a: IInstrument, b: IInstrument) => Number(a.isOpen) - Number(b.isOpen)
  )
/**
 * Prioritize open vs closed
 * @param collection
 */
const sortOpenReversed = (collection: IInstrument[]) =>
  collection.sort(
    (a: IInstrument, b: IInstrument) => Number(b.isOpen) - Number(a.isOpen)
  )

/**
 * Is logged in? [fav instr, brand instr] : [brand instr]
 */
const filteredInstruments = createSelector(
  isLoggedIn,
  instrumentsFromTrading,
  featuredInstrumentsIds,
  getUserInfo,
  (
    loggedIn: boolean,
    instruments: any[],
    featured: string[],
    userInfo: IUserInfo
  ): IInstrument[] => {
    if (instruments.length > 0) {
      if (loggedIn && userInfo) {
        const mergedIds = uniq([...userInfo.favAssets, ...featured])
        const otherInstruments = instruments.filter(
          (instrument: IInstrument) =>
            !mergedIds.includes(instrument.instrumentID)
        )

        const priorityInstruments = mergedIds
          .map((id: string) =>
            instruments.find(
              (instrument: IInstrument) => instrument.instrumentID === id
            )
          )
          .filter((item: any) => !!item)

        return sortOpen([...priorityInstruments, ...otherInstruments])
      }

      const featuredInstruments = featured
        .map((id: string) =>
          instruments.find(
            (instrument: IInstrument) => instrument.instrumentID === id
          )
        )
        .filter((item: any) => !!item)
      const otherInstruments = instruments.filter(
        (instrument: IInstrument) => !featured.includes(instrument.instrumentID)
      )

      return sortOpen([...featuredInstruments, ...otherInstruments])
    }
    return []
  }
)

/**
 * Return 1 if we are practicing and 0 if not
 * @param state
 */
const practiceModeBinary = (state: any) =>
  state.account.userInfo ? (state.account.userInfo.practiceMode ? 1 : 0) : 0

/**
 * User Currency selector from wallet
 * Don't expose this to any component, because there is a formatter function
 * @param state
 */
// const userCurrencySelector = (state: any) =>
// 	state.wallets ? state.wallets.userCurrency : '$'

/**
 * Returns array of opened and than closed instruments
 * @param state
 */
const openInstruments = (state: any) => {
  const collection: any = {
    open: [],
    close: [],
  }
  filteredInstruments(state).forEach((i: IInstrument) =>
    i.isOpen ? collection.open.push(i) : collection.close.push(i)
  )
  return [...collection.open, ...collection.close]

  // Asset list order - Wrong order:
  // The order list should be divided to 2:
  // Assets that their isOpen status = true - Those assets should be first in order and not grayed out:
  // In here the assets on the left should be first the assets in get-registry → Featured
  // Then the rest of the isOpen assets according to instrumentID order
  // Assets that their isOpen status = false - Those assets should be last in order and grayed out
  // In here the assets order should be according to instrumentID order
}

const cfdInstruments = (state: any) => state.trading.cfdOptionsInstruments

const aboveBelowInstruments = (state: any) =>
  state.trading.aboveBelowInstruments

const simplify = (
  collection: IInstrument[],
  fav: string[],
  selectedInstrument: string
): IShortInstrument[] =>
  collection.map(
    ({ instrumentID, name, isOpen, type, tradingHours }: IInstrument) => ({
      instrumentID,
      name,
      isOpen,
      selected: instrumentID === selectedInstrument,
      favorite: fav.includes(instrumentID),
      type,
      tradingHours: tradingHours[0],
    })
  )

/**
 * Performance effective structure
 * Avoid rendering on each quote
 */
const shortOpenInstruments = createSelector(
  isLoggedIn,
  instrumentsFromRegistry,
  featuredInstrumentsIds,
  getUserInfo,
  selectedInstrument,
  (
    loggedIn: boolean,
    instrumentsFromRegistry: any,
    featured: string[],
    userInfo: IUserInfo,
    selectedInstrument: string
  ): IShortInstrument[] => {
    const instruments: IInstrument[] = Object.values(instrumentsFromRegistry)
    if (instruments.length > 0) {
      if (loggedIn && userInfo) {
        const mergedIds = uniq([...userInfo.favAssets, ...featured])
        const otherInstruments = instruments.filter(
          (instrument: IInstrument) =>
            !mergedIds.includes(instrument.instrumentID)
        )

        const priorityInstruments: any[] = mergedIds
          .map((id: string) =>
            instruments.find(
              (instrument: IInstrument) => instrument.instrumentID === id
            )
          )
          .filter((item: any) => !!item)

        return simplify(
          sortOpenReversed([...priorityInstruments, ...otherInstruments]),
          userInfo.favAssets,
          selectedInstrument
        )
      }

      const featuredInstruments: any[] = featured
        .map((id: string) =>
          instruments.find(
            (instrument: IInstrument) => instrument.instrumentID === id
          )
        )
        .filter((item: any) => !!item)
      const otherInstruments = instruments.filter(
        (instrument: IInstrument) => !featured.includes(instrument.instrumentID)
      )

      return simplify(
        sortOpenReversed([...featuredInstruments, ...otherInstruments]),
        [],
        selectedInstrument
      )
    }

    return []
  }
)

/**
 * Return first open instrument object
 */
const firstOpenInstrument = createSelector(
  openInstruments,
  (instruments) => instruments[0]
)

const firstOpenCfdInstrument = createSelector(
  openInstruments,
  cfdInstruments,
  (instruments, cfdInstruments) =>
    instruments.find(({ instrumentID }) =>
      cfdInstruments.find(
        (instrument: any) => instrument.instrumentID === instrumentID
      )
    )
)

const firstOpenAboveBelowInstrument = createSelector(
  openInstruments,
  aboveBelowInstruments,
  (instruments, aboveBelowInstruments) =>
    instruments.find(({ instrumentID }) =>
      aboveBelowInstruments.find(
        (instrument: any) => instrument.instrumentID === instrumentID
      )
    )
)

/**
 * Return defaultGameType for current instrument
 */
const defaultGameTypeSelector = createSelector(
  getInstrumentObject,
  (instrument: IInstrument) => Number(instrument.defaultGameType)
)

/**
 * Return max payout from instrument
 * @param payouts
 */
const getInstrumentPayout = ({ payouts }: IInstrument) => {
  if (!payouts) {
    return
  }

  return Math.max.apply(
    Math,
    payouts.map((item) => item.payout)
  )
}

/**
 * Return Payout and price of instrument if exist
 */
const getPriceAndPayoutForInstrument = createSelector(
  quotes,
  instruments,
  (quotes: any, instruments: any) => {
    return (instrumentID: number) => {
      const result: { payout: any; price: any } = {
        price: '...',
        payout: '...',
      }

      if (instrumentID && quotes[instrumentID] && instruments[instrumentID]) {
        const { bid, ask } = quotes[instrumentID]
        const { precision } = instruments[instrumentID]
        result.price = parseFloat(String((bid + ask) / 2)).toFixed(
          Number(precision)
        )
      }
      result.payout = getInstrumentPayout(instruments[instrumentID])
      return result
    }
  }
)

/**
 * Return array of favorites instruments
 */
const getFavoriteInstruments = createSelector(
  userInfo,
  (userInfo: IUserInfo) => userInfo?.favAssets ?? []
)

export {
  selectedInstrument,
  getInstrumentObject,
  getInstrumentName,
  lastPriceForSelectedInstrument,
  lastQuoteForSelectedInstrument,
  getActiveExpiries,
  filteredInstruments,
  getUserInfo,
  practiceModeBinary,
  openInstruments,
  firstOpenInstrument,
  defaultGameTypeSelector,
  getPriceAndPayoutForInstrument,
  getFavoriteInstruments,
  shortOpenInstruments,
  featuredInstrumentsIds,
  defaultTopAssets,
  firstOpenCfdInstrument,
  firstOpenAboveBelowInstrument,
}
