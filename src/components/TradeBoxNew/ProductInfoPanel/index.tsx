import React, { FC } from 'react'
import { connect } from 'react-redux'
import { PanelContainer } from './styled'
import {
  getInstrumentObject,
  lastPriceForSelectedInstrument,
} from '../../selectors/instruments'
import ImageWrapper from '../../ui/ImageWrapper'
import AssetPlaceholder from '../../ChartContainer/InstrumentsBar/asset-placeholder.svg'
import { IInstrument } from '../../../core/API'
import InstrumentDailyChange from '../../ChartContainer/Chart/Instruments/instrumentDailyChange'

interface IProductInfoPanelProps {
  colors: any
  instrument: IInstrument
  lastPrice: any
  isCfdOptions: boolean
  isMobile: boolean
}

export const formatLastPrice = (lastPrice: any, precision: number): any => {
  try {
    const stringValue = lastPrice.toFixed(precision)
    const start = stringValue.substring(0, stringValue.length - 2)
    const end = stringValue.substring(stringValue.length - 2)
    const endBig = end.substring(0, 1)
    const endSmall = end.substring(1)
    return { start, endBig, endSmall }
  } catch (err) {
    console.log(
      'Debug ~ file: index.tsx ~ line 28 ~ formatLastPrice ~ err',
      err
    )
    return null
  }
}

const ProductInfoPanel: FC<IProductInfoPanelProps> = ({
  colors,
  instrument,
  lastPrice,
  isCfdOptions,
  isMobile,
}) => {
  const { start, endBig, endSmall } = formatLastPrice(
    Number(lastPrice),
    instrument?.precision || 3
  )
  return (
    <PanelContainer colors={colors} isMobile={isMobile}>
      <div className="instrument-image">
        <ImageWrapper
          klass={'instrument-image'}
          alt={`Instrument ${instrument.name}`}
          src={`${process.env.PUBLIC_URL}/static/icons/instruments/${instrument.instrumentID}.svg`}
          placeholderSrc={AssetPlaceholder}
        />
      </div>
      <div className="instrument-info">
        <span className="instrument-name">{instrument.name}</span>
        <div className="instrument-price-container">
          <span className="instrument-price">
            {start}
            <span className="instrument-price-big">{endBig}</span>
            <sup className="instrument-price-small">{endSmall}</sup>
          </span>
          {!isCfdOptions && (
            <InstrumentDailyChange
              instrumentID={instrument.instrumentID}
              colors={colors}
              withArrow
              withSign
              height={15}
              fontSize={14}
            />
          )}
        </div>
      </div>
    </PanelContainer>
  )
}

const mapStateToProps = (state: any) => ({
  instrument: getInstrumentObject(state),
  lastPrice: lastPriceForSelectedInstrument(state),
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, {})(ProductInfoPanel)
