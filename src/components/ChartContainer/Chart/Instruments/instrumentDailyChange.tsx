/**
 * Showing daily change of instrument
 */
import React from 'react'
import { connect } from 'react-redux'
import { IInstrument } from '../../../../core/API'
import { IQuote } from '../../../../reducers/quotes'
import { DailyChangeItem } from './styled'

interface IInstrumentDailyChangeProps {
  instrumentID: string
  colors: any
  quote?: IQuote
  instrument?: IInstrument
  withArrow?: boolean
  withSign?: boolean
  height?: number | undefined
  fontSize?: number | undefined
}

export const getChange = (
  quote: IQuote | undefined,
  instrument: IInstrument | undefined
): number | null => {
  try {
    const lastPrice = quote ? quote.last : null
    const referencePrice = instrument
      ? parseFloat(instrument.referencePrice)
      : null
    if (lastPrice && referencePrice) {
      return Number(
        (((lastPrice - referencePrice) / referencePrice) * 100).toFixed(2)
      )
    }
    return null
  } catch (err) {
    console.warn(err)
    return null
  }
}

const InstrumentDailyChange = ({
  quote,
  instrument,
  colors,
  withArrow = false,
  withSign = false,
  height,
  fontSize,
}: IInstrumentDailyChangeProps) => {
  const change = getChange(quote, instrument)

  if (change && instrument?.isOpen) {
    return (
      <DailyChangeItem
        colors={colors}
        directionUp={change >= 0}
        height={height}
        fontSize={fontSize}
      >
        {withSign && change > 0 && <span>+</span>}
        {change}%{withArrow && <span>&nbsp; {change < 0 ? '▾' : '▴'}</span>}
      </DailyChangeItem>
    )
  }

  return <span>...</span>
}

const mapStateToProps = (state: any, props: IInstrumentDailyChangeProps) => ({
  quote: state.quotes[props.instrumentID],
  instrument: state.instruments[props.instrumentID],
})

export default connect(mapStateToProps)(InstrumentDailyChange)
