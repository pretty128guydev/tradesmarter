import { Options } from 'highcharts/highstock'

import { IPieChartData } from '../../../../core/interfaces/highcharts'

export const getChartOptions = (
  renderTo: HTMLDivElement,
  data: IPieChartData[],
  colors: any
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
  },
  plotOptions: {
    pie: {
      shadow: false,
      borderColor: '#1d2834',
      borderWidth: 2,
    },
  },
  legend: {
    itemMarginTop: 5,
    itemMarginBottom: 5,
    symbolRadius: 0,
    itemStyle: {
      color: colors.primaryText,
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'normal',
    },
    itemHoverStyle: {
      color: colors.primaryText,
    },
  },
  tooltip: {
    formatter() {
      return `
				<span style="display: block; margin-right: 2px; color: ${this.point.color}">\u25CF</span>
				<span>${this.point.name}</span>: <span style="font-weight: bold">${this.point.y}</span>`
    },
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      type: 'pie',
      data,
      size: '100%',
      innerSize: '80%',
      showInLegend: true,
      dataLabels: {
        enabled: false,
      },
    },
  ],
})
