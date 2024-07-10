import { forEach, join } from 'lodash'
import { t } from 'ttag'

import { serializeObject } from './../../../../core/utils'

export interface IIndicatorParam {
  id: string
  title: string
  value: number | number[]
}

export interface IIndicatorMenuItem {
  type: string
  name: string
  color?: string
  supportedOnLineChartType: boolean
  supportedOnCandleChartType: boolean
  active: boolean
  params: IIndicatorParam[]
}

export const serializeIndicator = (type: string, params: object[]): string => {
  const res: any[] = []

  forEach(params, (param: any) => res.push(serializeObject(param)))

  return `${type}-${join(res, '&')}`
}

export const menuItems: IIndicatorMenuItem[] = [
  {
    type: 'sma',
    name: 'SMA',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 14,
      },
    ],
  },
  {
    type: 'rsi',
    name: 'RSI',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'period',
        title: t`Period`,
        value: 30,
      },
      {
        id: 'decimals',
        title: t`Decimals`,
        value: 70,
      },
    ],
  },
  {
    type: 'bb',
    name: 'BB',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 14,
      },
      {
        id: 'standardDeviation',
        title: t`Standard Deviation`,
        value: 4,
      },
    ],
  },
  {
    type: 'macd',
    name: 'MACD',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'shortPeriod',
        title: t`Short period`,
        value: 12,
      },
      {
        id: 'longPeriod',
        title: t`Long period`,
        value: 26,
      },
      {
        id: 'signalPeriod',
        title: t`Signal period`,
        value: 9,
      },
    ],
  },
  {
    type: 'aroon',
    name: 'Aroon',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 25,
      },
    ],
  },
  {
    type: 'aroonoscillator',
    name: 'Aroon Oscillator',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 25,
      },
    ],
  },
  {
    type: 'dpo',
    name: 'DPO',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 21,
      },
    ],
  },
  {
    type: 'ema',
    name: 'EMA',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 3,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 9,
      },
    ],
  },
  {
    type: 'tema',
    name: 'TEMA',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 3,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 9,
      },
    ],
  },
  {
    type: 'trix',
    name: 'TRIX',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 3,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 9,
      },
    ],
  },
  {
    type: 'apo',
    name: 'APO',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'period',
        title: t`Period`,
        value: [10, 20],
      },
    ],
  },
  {
    type: 'ppo',
    name: 'PPO',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 3,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 9,
      },
      {
        id: 'periods',
        title: t`Periods`,
        value: [12, 26],
      },
    ],
  },
  {
    type: 'wma',
    name: 'WMA',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 3,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 9,
      },
    ],
  },
  {
    type: 'linearRegression',
    name: 'Linear regression',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 14,
      },
    ],
  },
  {
    type: 'linearRegressionSlope',
    name: 'Linear regression slope',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 14,
      },
    ],
  },
  // {
  //   id: 'abands',
  //   name: 'Acceleration Bands',
  //
  //   supportedOnLineChartType: true,
  //   supportedOnCandleChartType: true,
  //   active: false,
  // },
  {
    type: 'ao',
    name: 'AO',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 14,
      },
    ],
  },
  {
    type: 'atr',
    name: 'ATR',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 14,
      },
    ],
  },
  {
    type: 'cci',
    name: 'CCI',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 14,
      },
    ],
  },
  {
    type: 'ikh',
    name: 'IKH',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 26,
      },
      {
        id: 'periodTenkan',
        title: 'Period tenkan',
        value: 9,
      },
      {
        id: 'periodSenkouSpanB',
        title: 'Period senkou span b',
        value: 52,
      },
    ],
  },
  {
    type: 'momentum',
    name: 'Momentum',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 14,
      },
    ],
  },
  {
    type: 'pivotpoints',
    name: 'Pivot points',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 28,
      },
    ],
  },
  {
    type: 'pc',
    name: 'Price Channel',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 20,
      },
    ],
  },
  {
    type: 'priceenvelopes',
    name: 'Price Envelopes',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 20,
      },
      {
        id: 'topBand',
        title: t`Top band`,
        value: 0.1,
      },
      {
        id: 'bottomBand',
        title: t`Bottom band`,
        value: 0.1,
      },
    ],
  },
  // {
  //   id: 'psar',
  //   name: 'PSAR',
  //
  //   supportedOnLineChartType: false,
  //   supportedOnCandleChartType: true,
  //   active: false,
  //   params: [{
  //     id: 'index',
  //     title: t`Index`,
  //     value: 2
  //   }, {
  //     id: 'period',
  //     title: t`Period`,
  //     value: 14
  //   }, {
  //     id: 'initialAccelerationFactor',
  //     title: 'Initial acceleration factor',
  //     value: 0.02
  //   }, {
  //     id: 'maxAccelerationFactor',
  //     title: 'Max acceleration factor',
  //     value: 0.2
  //   }, {
  //     id: 'increment',
  //     title: 'Increment',
  //     value: 0.02
  //   }, {
  //     id: 'decimals',
  //     title: t`Decimals`,
  //     value: 4
  //   }]
  // },
  {
    type: 'stochastic',
    name: 'Stochastic',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 14,
      },
      {
        id: 'periods',
        title: t`Periods`,
        value: [14, 3],
      },
    ],
  },
  // {
  //   id: 'slowstochastic',
  //   name: 'Slow stochastic',
  //
  //   supportedOnLineChartType: false,
  //   supportedOnCandleChartType: true,
  //   active: false,
  //   params: [{
  //     id: 'index',
  //     title: t`Index`,
  //     value: 0
  //   }, {
  //     id: 'period',
  //     title: t`Period`,
  //     value: [14, 14, 3, 3]
  //   }]
  // },
  {
    type: 'williamsr',
    name: 'Williamsr',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
    active: false,
    params: [
      {
        id: 'index',
        title: t`Index`,
        value: 0,
      },
      {
        id: 'period',
        title: t`Period`,
        value: 14,
      },
    ],
  },
]
