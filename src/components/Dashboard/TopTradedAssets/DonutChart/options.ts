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
    width: '40%',
    align: 'right',
    verticalAlign: 'top',
    layout: 'vertical',
    itemMarginTop: 5,
    itemMarginBottom: 5,
    useHTML: true,
    symbolRadius: 0,
    itemStyle: {
      color: colors.primaryText,
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'normal',
    },
    itemHoverStyle: {
      color: colors.primaryText,
    },
    labelFormatter: function (this: any) {
      const percent = (this.y / this.total) * 100
      const y = Math.round(percent * 10) / 10

      return `<div style="display: flex; justify-content: space-between; width: ${
        document.body.clientWidth * 0.1 - 20
      }px;">
					<div>${this.name}</div>
					<div style="color: #75f986; margin-left: 10px">${y}%</div>
				</div>`
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
