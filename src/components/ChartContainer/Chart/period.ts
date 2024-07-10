import { t } from 'ttag'

const mobileOptions = [
  0.25,
  // 1,
  // 2.5,
  15,
  // 2 * 15,
  5 * 15,
  15 * 15,
  30 * 15,
  15 * 60,
  // 2 * 15 * 60,
  4 * 15 * 60,
  24 * 15 * 60,
  168 * 15 * 60,
]

const chartPeriodOptions = [
  {
    chartPeriod: 0.25,
    range: 3 * 60 * 1000,
    candleStickRange: 10 * 60 * 1000,
    period: 'tick',
    tradingViewPeriod: '1T',
    candleStickPeriod: 0.25,
    periodLabel: t`Tick`,
    periodLabelEnglish: 'Tick',
    periodToolTip: t`Tick`,
    periodToolTipEnglish: 'Tick',
    unit: 'second',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: false,
  },
  // {
  //   chartPeriod: 1,
  //   range: 5 * 60 * 1000,
  //   candleStickRange: 10 * 60 * 1000,
  //   period: '5s',
  //   candleStickPeriod: 1,
  //   periodLabel: t`5s`,
  //   periodLabelEnglish: '5s',
  //   periodToolTip: t`5 Seconds`,
  //   periodToolTipEnglish: '5 Seconds',
  //   unit: 'second',
  //   supportedOnLineChartType: true,
  //   supportedOnCandleChartType: true,
  // },
  // {
  //   chartPeriod: 2.5,
  //   range: 7 * 60 * 1000,
  //   candleStickRange: 15 * 60 * 1000,
  //   period: '15s',
  //   candleStickPeriod: 1,
  //   periodLabel: t`15s`,
  //   periodLabelEnglish: '15s',
  //   periodToolTip: t`15 Seconds`,
  //   periodToolTipEnglish: '15 Seconds',
  //   unit: 'second',
  //   supportedOnLineChartType: true,
  //   supportedOnCandleChartType: true,
  // },
  {
    chartPeriod: 15,
    range:
      window.innerWidth > 1785
        ? 15 * 60 * 1000
        : window.innerWidth < 1118
        ? 5 * 60 * 1000
        : 10 * 60 * 1000,
    candleStickRange: 20 * 60 * 1000,
    period: '1m',
    tradingViewPeriod: '1',
    candleStickPeriod: 1,
    periodLabel: t`1m`,
    periodLabelEnglish: '1m',
    periodToolTip: t`1 Minute`,
    periodToolTipEnglish: '1 Minute',
    unit: 'minute',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
  },
  {
    chartPeriod: 2 * 15,
    range:
      window.innerWidth > 1785
        ? 15 * 2 * 60 * 1000
        : window.innerWidth < 1118
        ? 5 * 2 * 60 * 1000
        : 10 * 2 * 60 * 1000,
    candleStickRange: 20 * 2 * 60 * 1000,
    period: '2m',
    tradingViewPeriod: '2',
    candleStickPeriod: 2,
    periodLabel: t`2m`,
    periodLabelEnglish: '2m',
    periodToolTip: t`2 Minutes`,
    periodToolTipEnglish: '2 Minutes',
    unit: 'minute',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
  },
  {
    chartPeriod: 5 * 15,
    range:
      window.innerWidth > 1785
        ? 15 * 5 * 60 * 1000
        : window.innerWidth < 1118
        ? 5 * 5 * 60 * 1000
        : 10 * 5 * 60 * 1000,
    candleStickRange: 20 * 5 * 60 * 1000,
    period: '5m',
    tradingViewPeriod: '5',
    candleStickPeriod: 5,
    periodLabel: t`5m`,
    periodLabelEnglish: '5m',
    periodToolTip: t`5 Minutes`,
    periodToolTipEnglish: '5 Minutes',
    unit: 'minute',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
  },
  {
    chartPeriod: 15 * 15,
    range:
      window.innerWidth > 1785
        ? 15 * 20 * 60 * 1000
        : window.innerWidth < 1118
        ? 5 * 20 * 60 * 1000
        : 10 * 20 * 60 * 1000,
    candleStickRange: 20 * 20 * 60 * 1000,
    period: '15m',
    tradingViewPeriod: '15',
    candleStickPeriod: 15,
    periodLabel: t`15m`,
    periodLabelEnglish: '15m',
    periodToolTip: t`15 Minutes`,
    periodToolTipEnglish: '15 Minutes',
    unit: 'minute',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
  },
  {
    chartPeriod: 30 * 15,
    range:
      window.innerWidth > 1785
        ? 15 * 30 * 60 * 1000
        : window.innerWidth < 1118
        ? 5 * 30 * 60 * 1000
        : 10 * 30 * 60 * 1000,
    candleStickRange: 20 * 30 * 60 * 1000,
    period: '30m',
    tradingViewPeriod: '30',
    candleStickPeriod: 30,
    periodLabel: t`30m`,
    periodLabelEnglish: '30m',
    periodToolTip: t`30 Minutes`,
    periodToolTipEnglish: '30 Minutes',
    unit: 'minute',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
  },
  {
    chartPeriod: 1 * 15 * 60,
    range:
      window.innerWidth > 1785
        ? 15 * 60 * 60 * 1000
        : window.innerWidth < 1118
        ? 5 * 60 * 60 * 1000
        : 10 * 60 * 60 * 1000,
    candleStickRange: 20 * 60 * 60 * 1000,
    period: '1h',
    tradingViewPeriod: '1H',
    candleStickPeriod: 60,
    periodLabel: t`1H`,
    periodLabelEnglish: '1H',
    periodToolTip: t`1 Hour`,
    periodToolTipEnglish: '1 Hour',
    unit: 'hour',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
  },
  {
    chartPeriod: 2 * 15 * 60,
    range:
      window.innerWidth > 1785
        ? 15 * 2 * 60 * 60 * 1000
        : window.innerWidth < 1118
        ? 5 * 2 * 60 * 60 * 1000
        : 10 * 2 * 60 * 60 * 1000,
    candleStickRange: 20 * 2 * 60 * 60 * 1000,
    period: '2h',
    tradingViewPeriod: '2H',
    candleStickPeriod: 2 * 60,
    periodLabel: t`2H`,
    periodLabelEnglish: '2H',
    periodToolTip: t`2 Hours`,
    periodToolTipEnglish: '2 Hours',
    unit: 'hour',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
  },
  {
    chartPeriod: 4 * 15 * 60,
    range:
      window.innerWidth > 1785
        ? 15 * 5 * 60 * 60 * 1000
        : window.innerWidth < 1118
        ? 5 * 5 * 60 * 60 * 1000
        : 10 * 5 * 60 * 60 * 1000,
    candleStickRange: 20 * 5 * 60 * 60 * 1000,
    period: '4h',
    tradingViewPeriod: '4H',
    candleStickPeriod: 4 * 60,
    periodLabel: t`4H`,
    periodLabelEnglish: '4H',
    periodToolTip: t`4 Hours`,
    periodToolTipEnglish: '4 Hours',
    unit: 'hour',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
  },
  {
    chartPeriod: 24 * 15 * 60,
    range:
      window.innerWidth > 1785
        ? 15 * 24 * 60 * 60 * 1000
        : window.innerWidth < 1118
        ? 5 * 24 * 60 * 60 * 1000
        : 10 * 24 * 60 * 60 * 1000,
    candleStickRange: 20 * 24 * 60 * 60 * 1000,
    period: '1d',
    tradingViewPeriod: '1D',
    candleStickPeriod: 24 * 60,
    periodLabel: t`1d`,
    periodLabelEnglish: '1d',
    periodToolTip: t`1 Day`,
    periodToolTipEnglish: '1 Day',
    unit: 'day',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
  },
  {
    chartPeriod: 168 * 15 * 60,
    range:
      window.innerWidth > 1785
        ? 15 * 7 * 24 * 60 * 60 * 1000
        : window.innerWidth < 1118
        ? 5 * 7 * 24 * 60 * 60 * 1000
        : 10 * 7 * 24 * 60 * 60 * 1000,
    candleStickRange: 20 * 7 * 24 * 60 * 60 * 1000,
    period: '1w',
    tradingViewPeriod: '1W',
    candleStickPeriod: 24 * 60 * 7,
    periodLabel: t`1w`,
    periodLabelEnglish: '1w',
    periodToolTip: t`1 Week`,
    periodToolTipEnglish: '1 Week',
    unit: 'week',
    supportedOnLineChartType: true,
    supportedOnCandleChartType: true,
  },
]

const chartPeriodOptionsMobile = chartPeriodOptions.filter(({ chartPeriod }) =>
  mobileOptions.includes(chartPeriod)
)

export interface IPeriod {
  chartPeriod: number //  0.25,
  range: number
  candleStickRange: number
  period: string // 'tick',
  tradingViewPeriod: string // '1',
  candleStickPeriod: number // 0.25,
  periodLabel: string // 'Tick',
  periodLabelEnglish: string // 'Tick',
  periodToolTip: string // 'Tick',
  periodToolTipEnglish: string // 'Tick',
  unit: string // 'second',
  supportedOnLineChartType: boolean // true,
  supportedOnCandleChartType: boolean // false,
}

export { chartPeriodOptions, chartPeriodOptionsMobile }
