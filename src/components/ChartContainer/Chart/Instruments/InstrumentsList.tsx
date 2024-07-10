/**
 * Showing search box and Groups of instruments
 */

import React, { useState } from 'react'
import InstrumentSearch from './InstrumentSearch'
import Backdrop from '../../../Backdrop'
import InstrumentsGroup from './InstrumentGroups'
import { InstrumentsGroupBox, Panel } from './styled'

interface InstrumentsListProps {
  onClose: () => void
  colors: any
}

const InstrumentsList = ({ onClose, colors }: InstrumentsListProps) => {
  const [isSearch, setIsSearch] = useState<boolean>(false)

  return (
    <>
      <Backdrop onClick={onClose} />
      <Panel colors={colors}>
        <InstrumentSearch onSearch={setIsSearch} onClose={onClose} />
        {!isSearch && (
          <InstrumentsGroupBox>
            <InstrumentsGroup onClose={onClose} colors={colors} />
          </InstrumentsGroupBox>
        )}
      </Panel>
    </>
  )
}
export default InstrumentsList
