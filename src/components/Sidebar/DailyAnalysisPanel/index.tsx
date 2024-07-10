import React from 'react'
import { connect } from 'react-redux'
import { IInstrument, ILeftPanel } from '../../../core/API'
import { SidebarCaption } from '../index'
import { t } from 'ttag'
import CloseButton from '../CloseBtn'
import SidebarContentsPanel from '../SidebarContentsPanel'
import DailyAnalysisList from './DailyAnalysisList'

interface IDailyAnalysisProps {
  leftPanel: ILeftPanel
  colors: any
  instruments: IInstrument[]
  selectedInstrumentId: string
  onClose: () => void
  forceLoad: boolean
  isMobile?: boolean
}

const DailyAnalysisPanel = (props: IDailyAnalysisProps) => {
  const instrumentName: any = props.instruments.find(
    ({ instrumentID }) => instrumentID === props.selectedInstrumentId
  )?.name

  return (
    <SidebarContentsPanel
      colors={props.colors}
      adjustable={false}
      isMobile={props.isMobile || false}
    >
      <SidebarCaption colors={props.colors}>{t`daily analysis`}</SidebarCaption>
      <CloseButton colors={props.colors} onClick={props.onClose} />
      <DailyAnalysisList
        forceLoad={props.forceLoad}
        selectedInstrument={instrumentName
          .replaceAll('/', '')
          .replaceAll(' ', '')}
      />
    </SidebarContentsPanel>
  )
}

const mapStateToProps = (state: any) => ({
  leftPanel: state.registry.data.partnerConfig.leftPanel,
  instruments: state.trading.instruments,
  selectedInstrumentId: state.trading.selected,
})

export default connect(mapStateToProps)(DailyAnalysisPanel)
