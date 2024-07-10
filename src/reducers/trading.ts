import {
  SELECT_BONUS_WALLET,
  SELECT_INSTRUMENT,
  SET_CURRENT_PAYOUT,
  SET_DIRECTION,
  SET_INSTRUMENTS,
  SET_IN_TRADING_HOURS,
  SET_TRADING_TIMEOUT,
  SUBMIT_TRADE_FAILURE,
  SUBMIT_TRADE_REQUEST,
  SUBMIT_TRADE_SUCCESS,
  GAME_ENTERED_DEAD_PERIOD,
  LOCK_ADD,
  LOCK_RELEASE,
  SET_PRODUCT_TYPE,
  SET_CFD_OPTIONS_ACTIVE_DIRECTION,
  SET_CFD_OPTIONS_INSTRUMENT,
  SET_CFD_SENTIMENT_SELECTED_OPTION,
  SET_SELECTED_CFD_OPTION_EXPIRY,
  SET_CFD_RISK_AMOUNT,
  SET_CFD_INSTRUMENTS,
  HOVER_DIRECTION,
  SET_PRODUCT_TYPES,
  SET_DISTANCES,
  SET_ABOVE_BELOW_INSTRUMENTS,
} from '../actions/trading'
import { IInstrument, ICfdOptionsInstrument } from '../core/API'

export enum ProductType {
  highLow = 'High/Low',
  cfdOptions = 'Options',
  aboveBelow = 'Above/Below',
}

export interface ISentimentItem {
  id: number
  label: string
}

interface ITradingReducerState {
  productTypes: ProductType[]
  selectedProductType: ProductType
  cfdOptionsActiveDirection: 1 | -1 | null
  instruments: IInstrument[]
  cfdOptionsInstruments: IInstrument[]
  aboveBelowInstruments: IInstrument[]
  selected: string | null
  selectedCfdOptionInstrument: ICfdOptionsInstrument | null
  selectedCfdOptionExpiry: number | null
  cfdSentimentOptions: ISentimentItem[]
  selectedCfdSentimentOption: ISentimentItem
  cfdRiskAmount: number
  bonusWallet: any | null
  distances: any
  sendingTrade: boolean
  inTradingHours: boolean
  tradeTimeout: number
  currentPayout: number
  gameEnteredDeadPeriod: boolean
  locked: any[] // array of tradeIDs
  hoveredDirection: number
}

const defaultState = {
  productTypes: [
    ProductType.highLow,
    ProductType.cfdOptions,
    ProductType.aboveBelow,
  ],
  selectedProductType: ProductType.highLow,
  cfdOptionsActiveDirection: null,
  instruments: [],
  cfdOptionsInstruments: [],
  aboveBelowInstruments: [],
  selected: '1',
  cfdRiskAmount: 100.0,
  selectedCfdOptionInstrument: null,
  selectedCfdOptionExpiry: null,
  cfdSentimentOptions: [
    {
      id: 1,
      label: 'Payout',
    },
    {
      id: 2,
      label: 'Price',
    },
    {
      id: 3,
      label: 'Multiplier',
    },
  ],
  selectedCfdSentimentOption: {
    id: 3,
    label: 'Multiplier',
  },
  bonusWallet: null,
  distances: [],
  sendingTrade: false,
  inTradingHours: true,
  tradeTimeout: 0,
  currentPayout: 0,
  gameEnteredDeadPeriod: false,
  direction: 0, // 1, -1 allowed
  locked: [],
  hoveredDirection: 0,
}

/**
 * If selected instrument is the same as in distances than update distances
 * @param state - current state
 * @param payload - action payload
 */
const setDistancesIf = (state: any, payload: any) => {
  const { itemName, distances } = payload

  const [, instrumentId] = itemName.split('_')
  if (String(instrumentId) !== String(state.selected)) {
    return state
  }

  return {
    ...state,
    distances,
  }
}

/**
 * This reducer holds actual trading state like current asset
 */
const tradingReducer = (
  state: ITradingReducerState = defaultState,
  action: any
) => {
  switch (action.type) {
    case SET_INSTRUMENTS:
      return {
        ...state,
        instruments: action.payload,
      }
    case SET_CFD_INSTRUMENTS: {
      return {
        ...state,
        cfdOptionsInstruments: action.payload,
      }
    }
    case SET_ABOVE_BELOW_INSTRUMENTS: {
      return {
        ...state,
        aboveBelowInstruments: action.payload,
      }
    }
    case SELECT_INSTRUMENT:
      if (!action.payload) return { ...state }

      return {
        ...state,
        selected: action.payload,
        selectedCfdOptionInstrument: null,
        selectedCfdOptionExpiry: null,
        cfdOptionsInstruments: state.cfdOptionsInstruments.map(
          (instrument) => ({
            ...instrument,
            selected: instrument.instrumentID === action.payload,
          })
        ),
        aboveBelowInstruments: state.aboveBelowInstruments.map(
          (instrument) => ({
            ...instrument,
            selected: instrument.instrumentID === action.payload,
          })
        ),
      }
    case SET_DISTANCES:
      return setDistancesIf(state, action.payload)
    case SUBMIT_TRADE_REQUEST:
      return {
        ...state,
        sendingTrade: true,
      }
    case SUBMIT_TRADE_FAILURE:
    case SUBMIT_TRADE_SUCCESS:
      return {
        ...state,
        sendingTrade: false,
      }
    case SET_IN_TRADING_HOURS:
      return {
        ...state,
        inTradingHours: action.payload,
      }
    case GAME_ENTERED_DEAD_PERIOD:
      return {
        ...state,
        gameEnteredDeadPeriod: action.payload,
      }
    case SELECT_BONUS_WALLET:
      return {
        ...state,
        bonusWallet: action.payload,
      }
    case SET_TRADING_TIMEOUT:
      return {
        ...state,
        tradeTimeout: action.payload,
      }
    case SET_CURRENT_PAYOUT:
      return {
        ...state,
        currentPayout: action.payload,
      }
    case SET_DIRECTION:
      return {
        ...state,
        direction: action.payload,
      }
    case HOVER_DIRECTION:
      return {
        ...state,
        hoveredDirection: action.payload,
      }
    case LOCK_ADD:
      return {
        ...state,
        locked: [...state.locked, action.payload],
      }
    case LOCK_RELEASE:
      return {
        ...state,
        locked: state.locked.filter((i: any) => i !== action.payload),
      }
    case SET_PRODUCT_TYPES:
      return {
        ...state,
        productTypes: action.payload,
        selectedCfdOptionInstrument:
          action.payload === ProductType.cfdOptions
            ? state.selectedCfdOptionInstrument
            : null,
        selectedCfdOptionExpiry:
          action.payload === ProductType.cfdOptions
            ? state.selectedCfdOptionExpiry
            : null,
        cfdOptionsInstruments: state.cfdOptionsInstruments.map(
          (instrument, index) => ({
            ...instrument,
            selected: index === 0,
          })
        ),
        aboveBelowInstruments: state.aboveBelowInstruments.map(
          (instrument, index) => ({
            ...instrument,
            selected: index === 0,
          })
        ),
      }
    case SET_PRODUCT_TYPE:
      return {
        ...state,
        selectedProductType: action.payload,
      }
    case SET_CFD_OPTIONS_ACTIVE_DIRECTION:
      return {
        ...state,
        cfdOptionsActiveDirection: action.payload,
      }
    case SET_CFD_OPTIONS_INSTRUMENT: {
      if (!action.payload) {
        return {
          ...state,
        }
      }

      const expiries = Object.keys(action.payload)
      return {
        ...state,
        selectedCfdOptionInstrument: action.payload,
        selectedCfdOptionExpiry: state.selectedCfdOptionExpiry ?? expiries[0],
      }
    }
    case SET_SELECTED_CFD_OPTION_EXPIRY: {
      return {
        ...state,
        selectedCfdOptionExpiry: action.payload,
      }
    }
    case SET_CFD_SENTIMENT_SELECTED_OPTION: {
      return {
        ...state,
        selectedCfdSentimentOption: action.payload,
      }
    }
    case SET_CFD_RISK_AMOUNT: {
      return {
        ...state,
        cfdRiskAmount: action.payload,
      }
    }
    default:
      return state
  }
}

export default tradingReducer
