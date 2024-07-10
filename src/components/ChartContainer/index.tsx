/**
 * Component which contains assets bar and a chart
 */
import React from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import Chart, { ChartPanel } from './Chart/index'
import OutOfTradingHours from './OutOfTradingHours'
import MobileInstrumentsBar from './MobileInstrumentsBar'
import { isCfdOptionsProductType } from '../selectors/trading'
import { isLoggedIn } from '../selectors/loggedIn'
import { isMobileLandscape } from '../../core/utils'
import { ChartLibraryConfig, ChartLibrary } from './ChartLibraryConfig'
import AdvancedChart from './Chart/advancedChart'

const MobileChartArea = styled.section<{
  loggedIn: boolean
  isMobile: boolean
  isPosition: boolean
}>`
  flex: 1 1 auto;
  display: flex;
  position: relative;
  ${(props) =>
    !isMobileLandscape(props.isMobile)
      ? css`
          height: ${props.loggedIn
            ? props.isPosition
              ? `calc(${window.innerHeight}px - 397px)`
              : `calc(${window.innerHeight}px - 312px)`
            : `calc(${window.innerHeight}px - 278px)`};
        `
      : css`
          height: ${props.loggedIn
            ? `calc(${window.innerHeight}px - 169px)`
            : `calc(${window.innerHeight}px - 116px)`};
        `};
`

const ChartArea = styled.div<{ colors: any; isCfdOptions: boolean }>`
  background-color: ${(props) => props.colors.panelBackground};
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
`

interface IChartContainer {
  isCfdOptions: boolean
  inTradingHours: boolean
  isMobile: boolean
  colors: any
  loggedIn: boolean
  chartLibraryConfig: ChartLibraryConfig
  currentChartLibrary: ChartLibrary
  isPosition: boolean
}

const ChartContainer = (props: IChartContainer) => {
  if (props.isMobile) {
    return (
      <>
        <MobileChartArea
          loggedIn={props.loggedIn}
          isMobile={props.isMobile}
          isPosition={props.isPosition}
        >
          {props.inTradingHours ? (
            <>
              {props.currentChartLibrary === ChartLibrary.Basic && <Chart />}
              {props.currentChartLibrary !== ChartLibrary.Basic && (
                <AdvancedChart />
              )}
            </>
          ) : (
            <ChartPanel isMobile={props.isMobile} colors={props.colors}>
              <MobileInstrumentsBar />
              <OutOfTradingHours />
            </ChartPanel>
          )}
        </MobileChartArea>
      </>
    )
  }

  return (
    <ChartArea
      id="chart-area"
      colors={props.colors}
      isCfdOptions={props.isCfdOptions}
    >
      {props.inTradingHours ? (
        <>
          {props.currentChartLibrary === ChartLibrary.Basic && <Chart />}
          {props.currentChartLibrary !== ChartLibrary.Basic && (
            <AdvancedChart />
          )}
        </>
      ) : (
        <OutOfTradingHours />
      )}
    </ChartArea>
  )
}

const mapStateToProps = (state: any) => ({
  isCfdOptions: isCfdOptionsProductType(state),
  inTradingHours: state.trading.inTradingHours,
  colors: state.theme,
  loggedIn: isLoggedIn(state),
  chartLibraryConfig: state.registry.data.partnerConfig.chartLibraryConfig,
  currentChartLibrary: state.registry.currentChartLibrary,
  isPosition: state.trades.open.length !== 0,
})

export default connect(mapStateToProps)(ChartContainer)
