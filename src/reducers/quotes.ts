/**
 * Represents a store which hold meta data for instruments as a key-value hash where key is instrument id
 */
import { UPDATE } from "../actions/quotes"

export interface IQuote {
  instrumentID: any;
  timestamp: number;
  last: number;
  high: number;
  low: number;
  open: number;
  ask: number;
  bid: number;
}

export interface QuotesMap {
  [id: string]: IQuote;
}

/**
 * Updates multiple instruments and returns a new object
 * @param state 
 * @param quotes 
 */
const updateInstruments = (state: QuotesMap, quotes: IQuote[]): QuotesMap => {
  const newState = { ...state }
  quotes.forEach((quote: IQuote) => {
    newState[quote.instrumentID] = quote
  });

  return newState;
}

const quotesReducer = (state: QuotesMap = {}, action: any) => {
  switch (action.type) {
    case UPDATE:
      return updateInstruments(state, action.payload)
    default:
      return state
  }
}

export default quotesReducer