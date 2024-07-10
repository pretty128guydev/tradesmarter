import { Options } from 'highcharts/highstock'

import { IPieChartData } from '../../../../core/interfaces/highcharts'

export const getChartOptions = (
	renderTo: HTMLDivElement,
	data: IPieChartData[],
	currencySymbol: string
): Options => ({
	chart: {
		renderTo,
	},
	title: {
		text: void 0,
	},
	yAxis: {
		title: {
			text: void 0,
		},
		labels: {
			format: `${currencySymbol} {value:,.0f}`,
			style: {
				fontFamily: 'Roboto, sans-serif',
				fontWeight: 'normal',
				fontSize: '9px',
			},
		},
		tickColor: '#263346',
		gridLineColor: '#263346',
	},
	xAxis: {
		tickColor: '#263346',
		lineColor: '#263346',
		labels: {
			style: {
				fontFamily: 'Roboto, sans-serif',
				fontWeight: 'normal',
				fontSize: '9px',
			},
		},
		type: 'datetime',
		tickInterval: 3600 * 1000 * 24,
	},
	tooltip: {
		formatter() {
			return `
				<span style="display: block; margin-right: 2px; color: ${this.point.color}">\u25CF</span>
				<span>${this.point.name}</span>: <span style="font-weight: bold">${this.point.y}</span>`
		},
	},
	plotOptions: {
		column: {
			borderWidth: 0,
		},
	},
	legend: {
		enabled: false,
	},
	credits: {
		enabled: false,
	},
	series: [
		{
			type: 'column',
			data,
		},
	],
})
