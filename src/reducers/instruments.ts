/**
 * Represents a store which hold meta data for instruments as a key-value hash where key is instrument id
 */
import { SET } from "../actions/instruments"
import { IInstrument } from "../core/API";

export interface InstrumentsMap {
  [id: string]: IInstrument
}

const createInstrumentsHash = (instruments: IInstrument[]): InstrumentsMap => {
  const result: InstrumentsMap = {};
  instruments.forEach((instrument: IInstrument) => {
    result[instrument.instrumentID] = instrument
  })
  return result
}

const instrumentsReducer = (state: InstrumentsMap = {}, action: any) => {
  switch (action.type) {
    case SET:
      return createInstrumentsHash(action.payload)
    default:
      return state
  }
}

export default instrumentsReducer