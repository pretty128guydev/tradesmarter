/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect, useRef } from 'react'
import Highcharts, { Chart } from 'highcharts/highstock'
import { getChartOptions } from './options'
import { connect } from 'react-redux'
import { getChange } from '../../../../ChartContainer/Chart/Instruments/instrumentDailyChange'

interface ITableChart {
  quote?: any
  data: number[][]
  index: number
  instrumentID: number
  instrument?: any
  wrapperViewPort: { top: number; height: number }
}

const ROW_HEIGHT = 31

const TableChart: FC<ITableChart> = ({
  data,
  quote,
  instrument,
  wrapperViewPort,
  index,
}) => {
  const chartContainer = useRef<HTMLDivElement | null>(null)
  const [, setChart] = useState<Chart | null>(null)
  const [render, setRender] = useState<boolean>(false)
  const [currentInstrumentId, setCurrentInstrumentId] = useState<any>(null)

  useEffect(() => {
    if (chartContainer.current && render) {
      const change = getChange(quote, instrument) ?? 0
      const color = change < 0 ? '255, 71, 71' : '117, 249, 134'

      const areaChart = new Highcharts.Chart(
        getChartOptions(chartContainer.current, data, color)
      )

      setChart(areaChart)
    }
  }, [data, render])

  useEffect(() => {
    setRender(false)
    setCurrentInstrumentId(instrument.instrumentID)
  }, [instrument.instrumentID])

  useEffect(() => {
    chartRender()
  }, [wrapperViewPort.height, wrapperViewPort.top, currentInstrumentId])

  const chartRender = () => {
    if (!render) {
      const top = index * ROW_HEIGHT
      setRender(top <= wrapperViewPort.top + wrapperViewPort.height)
    }
  }

  return (
    <div
      style={{
        height: '19px',
        maxWidth: '70px',
        display: render ? 'block' : 'none',
      }}
      ref={chartContainer}
    />
  )
}

const mapStateToProps = (state: any, props: ITableChart) => ({
  quote: state.quotes[props.instrumentID],
  instrument: state.instruments[props.instrumentID],
})

export default connect(mapStateToProps)(TableChart)
