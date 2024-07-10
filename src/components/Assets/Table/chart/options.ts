import { Options } from 'highcharts/highstock'

export const getChartOptions = (
	renderTo: HTMLDivElement,
	data: number[][],
	color: string
): Options => ({
	chart: {
		renderTo,
		margin: 0,
	},
	boost: {
		useGPUTranslations: true,
		seriesThreshold: 1,
	},
	title: {
		text: void 0,
	},
	yAxis: {
		title: {
			text: void 0,
		},
		labels: {
			enabled: false,
		},
		gridLineWidth: 0,
	},
	xAxis: {
		labels: {
			enabled: false,
		},
	},
	tooltip: {
		enabled: false,
	},
	plotOptions: {
		series: {
			enableMouseTracking: false,
		},
		area: {
			marker: {
				enabled: false,
			},
			color: `rgb(${color})`,
			fillColor: {
				linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
				stops: [
					[0, `rgba(${color}, 0.5)`],
					[1, `rgba(${color}, 0)`],
				],
			},
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
			type: 'area',
			data,
			threshold: null,
			turboThreshold: 1,
		},
	],
})
