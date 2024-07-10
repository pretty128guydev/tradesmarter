import React, { FC, useState, useEffect, useRef } from 'react'
import Highcharts, { Chart } from 'highcharts/highstock'
import { getChartOptions } from './options'

interface IAssetsFeaturedChart {
	color: string
	data: number[][]
	render: boolean
}

const AssetsFeaturedChart: FC<IAssetsFeaturedChart> = ({
	data,
	color,
	render,
}) => {
	const chartContainer = useRef<HTMLDivElement | null>(null)
	const [, setChart] = useState<Chart | null>(null)

	useEffect(() => {
		if (chartContainer.current && render) {
			const areaChart = new Highcharts.Chart(
				getChartOptions(chartContainer.current, data, color)
			)
			setChart(areaChart)
		}
	}, [data, render])

	return <div style={{ flex: '1' }} ref={chartContainer} />
}

export default AssetsFeaturedChart
