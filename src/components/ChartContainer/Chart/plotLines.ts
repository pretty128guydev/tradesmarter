import { t } from 'ttag'

enum ChartPlotLines {
  quote = 'quote-line',
  deadPeriod = 'deadPeriod-line',
  expiry = 'expiry-line',
  breakeven = 'breakeven',
}

const quoteLineText = (value: number, color: string) => {
  return `<span class="chart-indicator-triangle-full"
    style="border-right-color: ${color};"></span>
    <span class="chart-indicator"
    style="background: ${color}; font-weight: bold; font-size: 11px;">
    ${value}
  </span>`
}

const quoteLine = (
  value: number,
  color: string,
  width: number = 2,
  zIndex: number = 9,
  id: any = ChartPlotLines.quote
) => ({
  id,
  value,
  color,
  width,
  zIndex,
  dashStyle: 'ShortDot',
  label: {
    text: null,
    align: 'right',
    y: 3,
    x: 63,
  },
})

const deadPeriodLine = (
  value: number,
  color: string,
  label?: string,
  x?: number
) => ({
  id: `${ChartPlotLines.deadPeriod}_${value}`,
  value,
  color,
  width: 1,
  zIndex: 9,
  label: {
    text: label || '',
    useHTML: true,
    style: {
      color,
      fontFamily: 'Roboto, sans-serif',
    },
    x: x || -16,
    y: 80,
    rotation: 0,
  },
})

const expiryLine = (value: number, color: string) => ({
  id: ChartPlotLines.expiry,
  value,
  width: 1,
  zIndex: 3,
  color,
  label: {
    text: '',
    verticalAlign: 'top',
    useHTML: true,
    style: {
      color,
      fontFamily: 'Roboto, sans-serif',
    },
    x: -16,
    y: 80,
    rotation: 0,
  },
})

const breakevenLine = (
  value: number,
  direction: number,
  color: string,
  isMobile: boolean
) => ({
  id: ChartPlotLines.breakeven,
  value,
  color,
  width: 2,
  zIndex: 7,
  x: 26,
  dashStyle: 'ShortDot',
  label: {
    useHTML: true,
    formatter: function () {
      const containerStyles =
        'padding: 2px 10px; border-radius: 20px; background: #06141F; color: #75F986; font-size: 11px;'
      let text = ''
      if (direction === 1) {
        text = t`If the asset price above this level at expiry time, you're making profits`
      } else {
        text = t`If the asset price below this level at expiry time, you're making profits`
      }
      const html = isMobile
        ? ''
        : `<div style="${containerStyles}">${text}</div>`

      return `
				<div style="display: flex; justify-content: space-between; margin-top: 8px;">
					${html}
					<div style="${containerStyles}">${t`Breakeven`}: ${value}</div>
				</div>
			`
    },
  },
})

export {
  ChartPlotLines,
  quoteLine,
  quoteLineText,
  deadPeriodLine,
  expiryLine,
  breakevenLine,
}
