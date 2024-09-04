/**
 * Implements a floating panel with two items:
 * 1) Instruments picker
 * 2) Payouts
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import InstrumentsPicker from '../Chart/Instruments'
import ProductTypePanel from './ProductTypePanel'
import { isCfdOptionsProductType } from '../../selectors/trading'
import { isMobileLandscape } from '../../../core/utils'
import {
  ButtonsHolder,
  ListContainer,
  ListItem,
  PrimaryBlock,
  PrimaryHolder,
} from '../Chart/styled'
import Backdrop from '../../Backdrop'
import { IPeriod } from '../Chart/period'
import CfdSentimentSwitcher from '../Chart/CfdSentimentSwitcher'
import ThemedIcon from '../../ui/ThemedIcon'
import {
  ChartLibraryConfig,
  ChartLibrary,
  ChartType,
} from '../ChartLibraryConfig'
import {
  actionChangeChartLibrary,
  actionChangeChartType,
} from '../../../actions/registry'
import CurrentPayout from './CurrentPayout'
import { t } from 'ttag'
import UserStorage from '../../../core/UserStorage'
import SettingIcon from '../../SideMenuBar/icons/settingicon'
import list from '../../Dashboard/RecentUpdates/list'
import { Background } from '../../../App'
import Triangleactive from '../../SideMenuBar/icons/triangleactive'
import Triangle from '../../SideMenuBar/icons/triangle'

require('./MobileInstrument.scss')

const MobileInstrumentsBox = styled.div<{
  colors: any
}>`
  display: flex;
  align-content: flex-start;
  justify-content: start;
  margin: 0px 3px 0 3px;
  .chart-options-mobile {
    background-color: #514a4a38;
    padding: 8px;
    border-radius: 6px;
    margin-right: 5px;
  }
  .chart_selects {
    border-radius: 6px;
    background-color: #514a4a38;
    align-items: center;
    display: flex;
    .chart_options {
      padding: 0px 7px;
      display: flex;
      span:nth-child(1) {
        margin-right: 10px;
        font-size: 19px;
      }
    }
    .chart_options_open {
      border-radius: 6px;
      position: absolute;
      z-index: 41;
      top: 60px;
      background-color: #514a4a38;
      div:nth-child(1) {
        padding-top: 10px;
      }
      div:nth-child(3) {
        padding-bottom: 10px;
      }
      div {
        padding: 7px 7px;
        font-size: 11px;
        display: flex;
        justify-content: center;
        color: ${(props) => props.colors.secondaryText};
        svg {
          margin-left: 4px;
          margin-top: 3px;
        }
      }
      div:nth-child(${(props) => props.className}) {
        color: ${(props) => props.colors.primary};
      }
    }
  }
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    @media (orientation: portrait) {
    }
  }
`

const ChartButton = styled.button<{
  smallText?: boolean
  colors: any
  indicators?: any
  isMobile: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 30px;
  width: 30px;
  line-height: 28px;
  outline: none;
  border: none;

  font-size: ${(props) => (props.smallText ? '9' : '12')}px;
  font-weight: 500;
  letter-spacing: 0.1px;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;
  margin-right: -10px;

  color: ${(props) => props.colors.primaryText};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: ${(props) => props.colors.panelBorder};

  &.resolution-button {
    width: auto !important;
  }

  span {
    display: inline-block;
  }

  .period-label {
    border-bottom: 2px solid #75f986;
    font-size: 14px;
    line-height: 20px;
  }

  .arrow-period-label {
    margin-left: 10px;
    color: white;
    font-size: 16px;
  }
`

const calculateListPosition = (e: any, listType: number) => {
  const rect = e.currentTarget.getBoundingClientRect()
  console.log(rect, listType)
  return {
    listType,
    top: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right,
  }
}

interface IMobileInstrumentBarProps {
  colors: any
  isMobile: boolean
  isCfdOptions: boolean
  inTradingHours: boolean
  onChangeTimeframe?: (tf: IPeriod) => void
  timeframe?: IPeriod
  periodOptions?: IPeriod[]
  chartType?: string
  isHighCharts?: boolean
  chartLibraryConfig: ChartLibraryConfig
  currentChartLibrary: ChartLibrary
  actionChangeChartLibrary: (chartType: ChartLibrary) => void
  onChangeChartType?: (cType: ChartType) => void
  actionChangeChartType: (chartType: ChartType) => void
  //   onSearchAssetsButtonClick: () => void
}

interface IListType {
  listType: number
  top?: number
  bottom?: number
  left?: number
  right?: number
}

const MobileInstrumentsBar = (props: IMobileInstrumentBarProps) => {
  const [list, setList] = useState<IListType>({ listType: 0 })
  const [chart_open, setchart_open] = useState<boolean>(false)
  const [chart_type, setchart_type] = useState<number>(0)

  const openPeriodList = (e: React.SyntheticEvent<any>) =>
    setList(calculateListPosition(e, 1))

  const onSelectTimeframe = (timeframe: IPeriod) => {
    setList({ listType: 0 })
    props.onChangeTimeframe && props.onChangeTimeframe(timeframe)
  }

  const onChangeChart = (chartId: ChartLibrary) => {
    props.actionChangeChartLibrary(chartId)
  }

  const openChartTypeList = (e: React.SyntheticEvent<any>) =>
    setList(calculateListPosition(e, 2))

  const onSelectChartType = (ctype: ChartType) => {
    const isTick = props.isCfdOptions || props.timeframe?.period === 'tick'

    const nonTickTypes = [
      ChartType.candlestick,
      ChartType.ohlc,
      ChartType.heikinashi,
    ]

    setList({ listType: 0 })
    props.onChangeChartType?.(ctype)
    props.actionChangeChartType(ctype)
    UserStorage.setChartType(ctype)

    if (isTick && nonTickTypes.includes(ctype) && chartPeriods) {
      props.onChangeTimeframe?.(chartPeriods[1])
    }
  }

  const chartPeriods =
    props.isCfdOptions ||
    ['candlestick', 'ohlc', 'heikinashi'].includes(props.chartType || '')
      ? props.periodOptions?.filter(
          (p: IPeriod) => p.supportedOnCandleChartType
        )
      : props.periodOptions?.filter((p: IPeriod) => p.supportedOnLineChartType)

  const chartopen = (status: boolean) => setchart_open(!status)
  const charttype = (status: number) => setchart_type(status)

  return (
    <>
      <MobileInstrumentsBox colors={props.colors}>
        <div className="container chart-options-mobile">
          <InstrumentsPicker colors={props.colors} isMobile={props.isMobile} />
          <PrimaryBlock>
            {!props.isCfdOptions && (
              <CurrentPayout
                colors={props.colors}
                styles={{ marginLeft: 0, marginRight: 10 }}
              />
            )}
            {/* <PrimaryHolder>
              <ButtonsHolder>
                {props.currentChartLibrary === ChartLibrary.Basic &&
                  props.chartLibraryConfig.allowedLibraries.includes(
                    ChartLibrary.LightWeight
                  ) && (
                    <ChartButton
                      isMobile={props.isMobile}
                      colors={props.colors}
                      onClick={() => onChangeChart(ChartLibrary.LightWeight)}
                      className="chart-button-switch-mobile"
                    >
                      <div className="switch-chart-view-wrapper">
                        <ThemedIcon
                          width={16}
                          height={16}
                          verticalAlign="sub"
                          src={`${process.env.PUBLIC_URL}/static/icons/chart/lightweight-chart.svg`}
                        />
                      </div>
                    </ChartButton>
                  )}
                {props.currentChartLibrary === ChartLibrary.LightWeight &&
                  props.chartLibraryConfig.allowedLibraries.includes(
                    ChartLibrary.Basic
                  ) && (
                    <ChartButton
                      isMobile={props.isMobile}
                      colors={props.colors}
                      onClick={() => onChangeChart(ChartLibrary.Basic)}
                      className="chart-button-switch-mobile"
                    >
                      <div className="switch-chart-view-wrapper">
                        <ThemedIcon
                          width={16}
                          height={16}
                          verticalAlign="sub"
                          src={`${process.env.PUBLIC_URL}/static/icons/chart/highcharts.svg`}
                        />
                      </div>
                    </ChartButton>
                  )}
                    {
                        <ChartButton
                        isMobile={props.isMobile}
                        colors={props.colors}
                        onClick={openChartTypeList}
                        >
                        <ThemedIcon
                            width={16}
                            height={16}
                            fill="#FFFFFF"
                            verticalAlign="sub"
                            src={`${process.env.PUBLIC_URL}/static/icons/chart_types/${props.chartType}.svg`}
                        />
                        </ChartButton>
                    }
              </ButtonsHolder>
            </PrimaryHolder> */}
          </PrimaryBlock>
          {!props.isMobile &&
            isMobileLandscape(props.isMobile) &&
            props.inTradingHours && (
              <>
                <ChartButton
                  isMobile={props.isMobile}
                  colors={props.colors}
                  onClick={openPeriodList}
                  smallText={props.timeframe?.period === 'tick'}
                  className="resolution-button"
                >
                  <span className="period-label">
                    {props.timeframe?.periodLabel}
                  </span>
                  <span className="arrow-period-label">▾</span>
                </ChartButton>
                {list.listType === 1 && (
                  <ListContainer
                    top={list.top}
                    left={list.left}
                    colors={props.colors}
                    className="scrollable"
                    isMobile={props.isMobile}
                  >
                    {chartPeriods?.map((period: IPeriod) => (
                      <ListItem
                        colors={props.colors}
                        key={period.period}
                        onClick={() => onSelectTimeframe(period)}
                        active={props.timeframe?.period === period.period}
                        noOpen={''}
                      >
                        <span>{period.periodToolTip}</span>
                      </ListItem>
                    ))}
                  </ListContainer>
                )}
              </>
            )}
        </div>
        {props.isMobile && (
          <div className="chart_selects">
            <div
              className="chart_options"
              onClick={() => chartopen(chart_open)}
            >
              <span style={{ color: `${props.colors.secondaryText}` }}>
                {t`Chart`}
              </span>
              <span>
                <SettingIcon color={props.colors.primary} />
              </span>
            </div>
            {chart_open && (
              <>
                <div className="chart_options_open">
                  {chart_type === 1 ? (
                    <div
                      style={{ color: `${props.colors.primary}` }}
                      onClick={(e) => {
                        openPeriodList(e)
                        charttype(0)
                      }}
                    >
                      {t`Chart Period`}
                      <Triangleactive color={props.colors.primary} />
                    </div>
                  ) : (
                    <div
                      onClick={(e) => {
                        openPeriodList(e)
                        charttype(1)
                      }}
                    >
                      {t`Chart Period`}
                      <Triangle color={props.colors.secondaryText} />
                    </div>
                  )}
                  {chart_type === 2 ? (
                    <div
                      style={{ color: `${props.colors.primary}` }}
                      onClick={(e) => {
                        openPeriodList(e)
                        charttype(0)
                      }}
                    >
                      {t`Chart Type`}
                      <Triangleactive color={props.colors.primary} />
                    </div>
                  ) : (
                    <div
                      onClick={(e) => {
                        openChartTypeList(e)
                        charttype(2)
                      }}
                    >
                      {t`Chart Type`}
                      <Triangle color={props.colors.secondaryText} />
                    </div>
                  )}
                  {chart_type === 3 ? (
                    <div
                      style={{ color: `${props.colors.primary}` }}
                      onClick={() => {
                        charttype(3)
                        onSelectChartType(ChartType.candlestick)
                      }}
                    >
                      {t`Indicators`}
                      <Triangleactive color={props.colors.primary} />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        charttype(3)
                        onSelectChartType(ChartType.candlestick)
                      }}
                    >
                      {t`Indicators`}
                      <Triangle color={props.colors.secondaryText} />
                    </div>
                  )}
                </div>
                <Backdrop onClick={() => setchart_open(false)} />
              </>
            )}
          </div>
        )}
        {list.listType === 1 && chart_type === 1 && (
          <ListContainer
            top={list.top}
            left={Number(list.left) + 93}
            colors={props.colors}
            className="scrollable"
            isMobile={props.isMobile}
            periodpanel={'tradebox'}
          >
            {chartPeriods?.map((period: IPeriod) => (
              <ListItem
                periodpanel={'tradebox'}
                colors={props.colors}
                key={period.period}
                onClick={() => onSelectTimeframe(period)}
                active={props.timeframe?.period === period.period}
                noOpen={'tradebox'}
              >
                <span>{period.period}</span>
              </ListItem>
            ))}
          </ListContainer>
        )}
        {/* <div className="chart-option-select">
          <ProductTypePanel />
          {props.isCfdOptions && props.isHighCharts && (
            <CfdSentimentSwitcher colors={props.colors} />
          )}
        </div> */}
        {list.listType === 2 && chart_type === 2 && (
          <ListContainer
            top={list.top}
            left={Number(list.left) + 93}
            colors={props.colors}
            className="scrollable"
            isMobile={props.isMobile}
            periodpanel={'tradebox'}
          >
            <ListItem
              colors={props.colors}
              onClick={() => onSelectChartType(ChartType.candlestick)}
              active={props.chartType === ChartType.candlestick}
            >
              <ThemedIcon
                width={16}
                height={16}
                fill="#FFFFFF"
                verticalAlign="sub"
                src={`${process.env.PUBLIC_URL}/static/icons/chart_types/candlestick.svg`}
              />
              <span>{t`Candlestick`}</span>
            </ListItem>
            <ListItem
              colors={props.colors}
              onClick={() => onSelectChartType(ChartType.line)}
              active={props.chartType === ChartType.line}
            >
              <ThemedIcon
                width={16}
                height={16}
                fill="#FFFFFF"
                verticalAlign="sub"
                src={`${process.env.PUBLIC_URL}/static/icons/chart_types/line.svg`}
              />
              <span>{t`Line`}</span>
            </ListItem>
            <ListItem
              colors={props.colors}
              onClick={() => onSelectChartType(ChartType.area)}
              active={props.chartType === ChartType.area}
            >
              <ThemedIcon
                width={16}
                height={16}
                fill="#FFFFFF"
                verticalAlign="sub"
                src={`${process.env.PUBLIC_URL}/static/icons/chart_types/area.svg`}
              />
              <span>{t`Area`}</span>
            </ListItem>
            <ListItem
              colors={props.colors}
              onClick={() => onSelectChartType(ChartType.ohlc)}
              active={props.chartType === ChartType.ohlc}
            >
              <ThemedIcon
                width={16}
                height={16}
                fill="#FFFFFF"
                verticalAlign="sub"
                src={`${process.env.PUBLIC_URL}/static/icons/chart_types/ohlc.svg`}
              />
              <span>{t`OHLC`}</span>
            </ListItem>
            {props.isHighCharts && (
              <ListItem
                colors={props.colors}
                onClick={() => onSelectChartType(ChartType.heikinashi)}
                active={props.chartType === ChartType.heikinashi}
              >
                <ThemedIcon
                  width={16}
                  height={16}
                  fill="#FFFFFF"
                  verticalAlign="sub"
                  src={`${process.env.PUBLIC_URL}/static/icons/chart_types/heikinashi.svg`}
                />
                <span>{t`Heikin Ashi`}</span>
              </ListItem>
            )}
          </ListContainer>
        )}
      </MobileInstrumentsBox>
      {list.listType !== 0 && (
        <Backdrop onClick={() => setList({ listType: 0 })} />
      )}
    </>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
  isCfdOptions: isCfdOptionsProductType(state),
  inTradingHours: state.trading.inTradingHours,
  chartLibraryConfig: state.registry.data.partnerConfig.chartLibraryConfig,
  currentChartLibrary: state.registry.currentChartLibrary,
})

export default connect(mapStateToProps, {
  actionChangeChartLibrary,
  actionChangeChartType,
})(MobileInstrumentsBar)
