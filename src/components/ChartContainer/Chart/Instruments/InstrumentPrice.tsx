import React from 'react'
import { getPriceAndPayoutForInstrument } from '../../../selectors/instruments'
import { connect } from 'react-redux'

interface IInstrumentPriceProps {
	instrumentId: string
	dataForInstrument: (instrumentId: number) => any
	fixed?: number
}

const InstrumentPrice = ({
	instrumentId,
	dataForInstrument,
	fixed,
}: IInstrumentPriceProps) => {
	const { price } = dataForInstrument(Number(instrumentId))

	if (!fixed) {
		return <span>{price}</span>
	}

	const floatPrice = parseFloat(price).toFixed(fixed)

	return <span>{isNaN(Number(floatPrice)) ? price : floatPrice}</span>
}

const mapStateToProps = (state: any) => ({
	dataForInstrument: getPriceAndPayoutForInstrument(state),
})

export default connect(mapStateToProps)(InstrumentPrice)
