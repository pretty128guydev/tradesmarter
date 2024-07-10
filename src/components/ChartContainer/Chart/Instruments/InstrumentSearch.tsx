/**
 * Showing search Input and list of search result
 */

import React, { useEffect, useState } from 'react'
import { ReactComponent as SearchIcon } from './search.svg'
import { InstrumentGroup } from './styled'
import ImageWrapper from '../../../ui/ImageWrapper'
import AssetPlaceholder from '../../InstrumentsBar/asset-placeholder.svg'
import { connect } from 'react-redux'
import { actionSelectInstrument } from '../../../../actions/trading'
import { shortOpenInstruments } from '../../../selectors/instruments'
import { IShortInstrument } from '../../InstrumentsBar'
import {
  isAboveBelowProductType,
  isCfdOptionsProductType,
} from '../../../selectors/trading'
import { searchInstruments } from '../../../../shares/functions'

interface InstrumentSearchProps {
  instruments: IShortInstrument[]
  cfdInstruments: any[]
  aboveBelowInstruments: any[]
  isCfdOptions: boolean
  isAboveBelow: boolean
  onSearch: (state: boolean) => void
  actionSelectInstrument: (id: any) => void
  onClose: () => void
  colors: any
}

const InstrumentSearch = ({
  instruments,
  onSearch,
  actionSelectInstrument,
  onClose,
  isCfdOptions,
  isAboveBelow,
  aboveBelowInstruments,
  cfdInstruments,
  colors,
}: InstrumentSearchProps) => {
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [currentInstruments, setCurrentInstruments] =
    useState<any[]>(instruments)

  useEffect(() => {
    setCurrentInstruments(
      isCfdOptions
        ? cfdInstruments
        : isAboveBelow
        ? aboveBelowInstruments
        : instruments
    )
  }, [
    isCfdOptions,
    isAboveBelow,
    cfdInstruments,
    aboveBelowInstruments,
    instruments,
  ])

  // const searchedItems = currentInstruments.filter(
  //   (i: IShortInstrument) =>
  //     i.name &&
  //     i.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
  // )

  const searchedItems = searchInstruments(currentInstruments, searchValue)

  useEffect(() => {
    const isSearch = searchValue.length >= 2
    setIsSearch(isSearch)
    onSearch(isSearch)
  }, [onSearch, searchValue])

  return (
    <>
      <div className="input__group">
        <SearchIcon width="24" height="24" fill="#9fabbd" />
        <input
          type="text"
          onChange={(e: any) => setSearchValue(e.target.value)}
          value={searchValue}
          placeholder="Search..."
        />
      </div>

      {isSearch &&
        searchedItems.map((item: IShortInstrument) => (
          <InstrumentGroup
            isOpen={(item.tradingHours as any).isOpen}
            key={item.instrumentID}
            onClick={() => {
              actionSelectInstrument(item.instrumentID)
              onClose()
            }}
            colors={colors}
          >
            <ImageWrapper
              alt={item.name}
              src={`${process.env.PUBLIC_URL}/static/icons/instruments/${item.instrumentID}.svg`}
              placeholderSrc={AssetPlaceholder}
            />
            <span>{item.name}</span>
          </InstrumentGroup>
        ))}
    </>
  )
}

const mapStateToProps = (state: any) => ({
  instruments: shortOpenInstruments(state),
  isCfdOptions: isCfdOptionsProductType(state),
  isAboveBelow: isAboveBelowProductType(state),
  cfdInstruments: state.trading.cfdOptionsInstruments,
  aboveBelowInstruments: state.trading.aboveBelowInstruments,
  colors: state.theme,
})

export default connect(mapStateToProps, { actionSelectInstrument })(
  InstrumentSearch
)
