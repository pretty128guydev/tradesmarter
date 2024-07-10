/**
 * Showing extended list of instrument group
 */

import React from 'react'
import { SubGroup, SubGroupHeader, SubGroupItem } from './styled'
import { List } from 'react-virtualized'
import { selectedInstrument } from '../../../selectors/instruments'
import { connect } from 'react-redux'
import InstrumentDailyChange from './instrumentDailyChange'
import { t } from 'ttag'
import InstrumentPayout from './InstrumentPayout'
import { actionSelectInstrument } from '../../../../actions/trading'
import { IShortInstrument } from '../../InstrumentsBar'
import InstrumentFavorite from './instrumentFavorite'
import InstrumentPrice from './InstrumentPrice'
import ImageWrapper from '../../../ui/ImageWrapper'
import AssetPlaceholder from '../../InstrumentsBar/asset-placeholder.svg'
import { actionAddInstrumentToTop } from '../../../../actions/account'

interface InstrumentSubGroupProps {
  subgroup: IShortInstrument[]
  colors: any
  isMobile: boolean
  isCfdOptions: boolean
  selectedInstrument: string
  top: number
  onClose: () => void
  actionSelectInstrument: (id: any) => void
  actionAddInstrumentToTop: (id: any) => void
}

const InstrumentSubGroup = ({
  subgroup,
  isMobile,
  isCfdOptions,
  selectedInstrument,
  colors,
  top,
  onClose,
  actionSelectInstrument,
  actionAddInstrumentToTop,
}: InstrumentSubGroupProps) => {
  const subGroupList = ({ index, style }: any) => {
    const item = subgroup[index]

    return (
      <SubGroupItem
        key={item.instrumentID}
        onClick={() => {
          actionSelectInstrument(item.instrumentID)
          actionAddInstrumentToTop(item.instrumentID)
          onClose()
        }}
        active={selectedInstrument === item.instrumentID}
        isOpen={(item.tradingHours as any).isOpen}
        style={style}
        colors={colors}
        isMobile={isMobile}
      >
        <ImageWrapper
          alt={item.name}
          src={`${process.env.PUBLIC_URL}/static/icons/instruments/${item.instrumentID}.svg`}
          placeholderSrc={AssetPlaceholder}
        />
        <span>{item.name}</span>
        <InstrumentPrice instrumentId={item.instrumentID} />
        {!isCfdOptions && (
          <InstrumentDailyChange
            instrumentID={item.instrumentID}
            colors={colors}
          />
        )}
        {!isCfdOptions && (
          <InstrumentPayout
            instrumentId={item.instrumentID}
            color={colors.primary}
          />
        )}
        <InstrumentFavorite instrumentId={item.instrumentID} colors={colors} />
      </SubGroupItem>
    )
  }

  return (
    <SubGroup top={top} colors={colors}>
      <SubGroupHeader scroll={subgroup.length > 5} colors={colors}>
        <span>{t`price`}</span>
        {!isCfdOptions && <span>{t`daily %`}</span>}
        {!isCfdOptions && <span>{t`payout`}</span>}
      </SubGroupHeader>
      <List
        width={364}
        height={182}
        rowCount={subgroup.length}
        rowHeight={35}
        rowRenderer={subGroupList}
        className="scrollable"
      />
    </SubGroup>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
  selectedInstrument: selectedInstrument(state),
})

export default connect(mapStateToProps, {
  actionSelectInstrument,
  actionAddInstrumentToTop,
})(InstrumentSubGroup)
