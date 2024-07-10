/**
 * Showing instruments group and open short or extended subgroup
 */

import React, { useEffect, useState } from 'react'
import ThemedIcon from '../../../ui/ThemedIcon'
import { t } from 'ttag'
import { InstrumentGroup, InstrumentGroupsBox } from './styled'
import { shortOpenInstruments } from '../../../selectors/instruments'
import { connect } from 'react-redux'
import InstrumentSubGroup from './InstrumentSubGroup'
import InstrumentSubGroupShort from './InstrumentSubGroupShort'
import { IShortInstrument } from '../../InstrumentsBar'
import {
  isAboveBelowProductType,
  isCfdOptionsProductType,
} from '../../../selectors/trading'

interface InstrumentGroupsProps {
  types: any
  isMobile: boolean
  isCfdOptions: boolean
  isAboveBelow: boolean
  instruments: IShortInstrument[]
  cfdInstruments: IShortInstrument[]
  aboveBelowInstruments: IShortInstrument[]
  onClose: () => void
  colors: any
  lang: string
}

const InstrumentGroups = ({
  types,
  isMobile,
  isCfdOptions,
  isAboveBelow,
  instruments,
  cfdInstruments,
  aboveBelowInstruments,
  onClose,
  colors,
  lang,
}: InstrumentGroupsProps) => {
  const [subgroup, setSubgroup] = useState<{
    top: number
    group: IShortInstrument[]
  }>({ top: 0, group: [] })

  const [groupTitles, setGroupTitle] = useState<any>({
    'game-filter-crypto': t`Crypto`,
    'game-filter-commodities': t`Commodities`,
    'game-filter-forex': t`Currencies`,
    'game-filter-indices': t`Indices`,
    'game-filter-stocks': t`Stocks`,
  })

  useEffect(() => {
    setGroupTitle({
      'game-filter-crypto': t`Crypto`,
      'game-filter-commodities': t`Commodities`,
      'game-filter-forex': t`Currencies`,
      'game-filter-indices': t`Indices`,
      'game-filter-stocks': t`Stocks`,
    })
  }, [lang])

  const [typeList, setTypeList] = useState<string[] | null>(null)

  const Subgroup = isMobile ? InstrumentSubGroupShort : InstrumentSubGroup

  const updateSubgroup = (groupName: string, target: any) => {
    if (types[groupName] !== subgroup.group[0]?.type) {
      const group = (
        isCfdOptions
          ? cfdInstruments
          : isAboveBelow
          ? aboveBelowInstruments
          : instruments
      ).filter((i: IShortInstrument) => i.type === types[groupName])
      setSubgroup({ top: target.offsetTop - 32, group })
    }
  }

  useEffect(() => {
    const typeTmp = Object.keys(types)
    typeTmp.unshift(typeTmp.pop() as string)
    setTypeList(typeTmp)
  }, [types])

  return (
    <InstrumentGroupsBox>
      {typeList?.map((group: string) => (
        <InstrumentGroup
          key={group}
          isOpen={true}
          onMouseEnter={({ target }) => updateSubgroup(group, target)}
          onClick={({ target }) => updateSubgroup(group, target)}
          colors={colors}
        >
          <ThemedIcon
            width={24}
            height={24}
            fill={colors.secondaryText}
            src={`${process.env.PUBLIC_URL}/static/icons/instrument_types/${group}.svg`}
          />
          <span>{groupTitles[group]}</span>
        </InstrumentGroup>
      ))}

      {subgroup.group.length > 0 && (
        <Subgroup
          isCfdOptions={isCfdOptions}
          subgroup={subgroup.group}
          top={subgroup.top}
          onClose={onClose}
        />
      )}
    </InstrumentGroupsBox>
  )
}

const mapStateToProps = (state: any) => ({
  types: state.registry.data.types,
  isMobile: state.registry.isMobile,
  instruments: shortOpenInstruments(state),
  isCfdOptions: isCfdOptionsProductType(state),
  isAboveBelow: isAboveBelowProductType(state),
  cfdInstruments: state.trading.cfdOptionsInstruments,
  aboveBelowInstruments: state.trading.aboveBelowInstruments,
  lang: state.registry.data.lang,
})

export default connect(mapStateToProps)(InstrumentGroups)
