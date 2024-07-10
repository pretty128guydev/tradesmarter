/**
 * Showing assets list button and showing instruments list onClick
 */
import { InstrumentsBox } from './styled'
import InstrumentsSelector from './InstrumentsSelector'
import InstrumentsList from './InstrumentsList'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { actionChangeChartLibrary } from '../../../../actions/registry'
import { ChartLibraryConfig, ChartLibrary } from '../../ChartLibraryConfig'
import SearchAssetsPanel from '../../../Mobile/SearchAssetsPanel'

const InstrumentsPicker = (props: {
  colors: any
  isMobile?: boolean
  chartLibraryConfig: ChartLibraryConfig
  currentChartLibrary: ChartLibrary
  actionChangeChartLibrary: (chartType: ChartLibrary) => void
  //   onSearchAssetsButtonClick: () => void
}) => {
  const [picker, setPicker] = useState<boolean>(false)

  return (
    <InstrumentsBox>
      <div>
        <InstrumentsSelector onClick={() => setPicker(true)} />
      </div>
      {picker && (
        <>
          {props.isMobile ? (
            <div
              style={{
                position: 'fixed',
                top: '60px',
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                zIndex: 999,
              }}
            >
              <SearchAssetsPanel onClose={() => setPicker(false)} />
            </div>
          ) : (
            <InstrumentsList
              onClose={() => setPicker(false)}
              colors={props.colors}
            />
          )}
        </>
      )}
    </InstrumentsBox>
  )
}

const mapStateToProps = (state: any) => ({
  chartLibraryConfig: state.registry.data.partnerConfig.chartLibraryConfig,
  currentChartLibrary: state.registry.currentChartLibrary,
})

export default connect(mapStateToProps, {
  actionChangeChartLibrary,
})(InstrumentsPicker)
