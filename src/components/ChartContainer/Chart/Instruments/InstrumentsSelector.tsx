/**
 * Assets selector button
 */

import React from 'react'
import { ReactComponent as Triangle } from '../isons/triangle.svg'
import { IInstrument, IUserInfo } from '../../../../core/API'
import { InstrumentSelector } from './styled'
import ImageWrapper from '../../../ui/ImageWrapper'
import AssetPlaceholder from '../../InstrumentsBar/asset-placeholder.svg'
import {
  getInstrumentObject,
  getUserInfo,
} from '../../../selectors/instruments'
import { connect } from 'react-redux'
import FavIcon from '../../../ui/FavIcon'
import { FavIconHolder } from '../styled'

interface InstrumentsSelectorProps {
  isMobile: boolean
  colors: any
  instrument: IInstrument
  user: IUserInfo | null
  onClick: () => void
}

const InstrumentsSelector = (props: InstrumentsSelectorProps) => {
  const { isMobile, colors, instrument, onClick } = props

  return (
    <InstrumentSelector isMobile={isMobile} onClick={onClick} colors={colors}>
      {!isMobile && (
        <FavIconHolder>
          <FavIcon
            size={20}
            isFav={
              props.user?.favAssets.includes(props.instrument.instrumentID) ||
              false
            }
            instrumentId={props.instrument.instrumentID}
          />
        </FavIconHolder>
      )}
      <ImageWrapper
        klass={'asset_icon_big'}
        alt={`Instrument ${instrument.name}`}
        src={`${process.env.PUBLIC_URL}/static/icons/instruments/${instrument.instrumentID}.svg`}
        placeholderSrc={AssetPlaceholder}
      />
      <span>{instrument.name}</span>
      <Triangle />
    </InstrumentSelector>
  )
}

const mapStateToProps = (state: any) => ({
  isMobile: state.registry.isMobile,
  colors: state.theme,
  instrument: getInstrumentObject(state),
  user: getUserInfo(state),
})

export default connect(mapStateToProps)(InstrumentsSelector)
