import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { actionSetContainer } from '../../../actions/container'
import { ContainerState } from '../../../reducers/container'
import { AssetPanelSideMode } from './styled'
import { AssetGroup } from './GroupsSideMode/constants/groupsEnum'
import { IShortInstrument } from '../../ChartContainer/InstrumentsBar'
import {
  featuredInstrumentsIds,
  getFavoriteInstruments,
  shortOpenInstruments,
} from '../../selectors/instruments'
import { api } from '../../../core/createAPI'
import { actionSelectInstrument } from '../../../actions/trading'
import { actionAddInstrumentToTop } from '../../../actions/account'
import {
  isAboveBelowProductType,
  isCfdOptionsProductType,
} from '../../selectors/trading'
import { searchInstruments } from '../../../shares/functions'
import SearchSideMode from './SearchSideMode'
import GroupsSideMode from './GroupsSideMode'
import TableSideMode from './TableSideMode'

interface IAssetsPanelProps {
  colors: any
  favorites: any
  instruments: any
  siteID: number
  featuredInstrumentIds: string[]
  isCfdOptions: boolean
  isAboveBelow: boolean
  cfdInstruments: any[]
  aboveBelowInstruments: any[]
  actionSetContainer: (state: ContainerState) => void
  actionSelectInstrument: (id: any) => void
  actionAddInstrumentToTop: (id: any) => void
  onClose: () => void
}

interface ISearch {
  value: string
  force: boolean
}

const fetchRecentlyTraded = async (
  platformID: string,
  siteId: number
): Promise<any> => {
  try {
    return await api.fetchRecentlyTraded(platformID, siteId)
  } catch (err) {
    console.log(err)
  }
}

const fetchTopChangingAssets = async (): Promise<any> => {
  try {
    return await api.fetchTopChangingAssets()
  } catch (err) {
    console.log(err)
  }
}

const AssetsPanel = ({
  colors,
  actionSetContainer,
  instruments,
  favorites,
  actionAddInstrumentToTop,
  actionSelectInstrument,
  siteID,
  featuredInstrumentIds,
  isCfdOptions,
  isAboveBelow,
  cfdInstruments,
  aboveBelowInstruments,
  onClose,
}: IAssetsPanelProps) => {
  const getCurrentInstruments = () =>
    isCfdOptions
      ? cfdInstruments
      : isAboveBelow
      ? aboveBelowInstruments
      : instruments

  const [selectedGroup, setSelectedGroup] = useState<AssetGroup | null>(null)
  const [search, setSearch] = useState<ISearch>({
    value: '',
    force: false,
  })
  const [assets, setAssets] = useState<any>([])
  const [recentlyTradedAssets, setRecentlyTradedAssets] = useState<any>([])
  const [topChangingAssets, setTopChangingAssets] = useState<any>([])
  const [featuredAssets, setFeaturedAssets] = useState<any>([])
  const [, setHistory] = useState<{ [key: string]: number[][] }>({})

  const isSearch = search.value.length > 0

  const fetchHistory = async () => {
    const period = 1
    const points = 30
    const instrumentsID = instruments.map((i: any) => i.instrumentID).join(',')
    setHistory(
      await api.fetchInstrumentHistory(instrumentsID, false, period, points)
    )
  }

  useEffect(() => {
    fetchHistory().then((_) => {})
  }, [instruments.length])

  useEffect(() => {
    const currentInstruments = getCurrentInstruments()

    fetchRecentlyTraded('1', siteID).then((data) => {
      const assets = Object.keys(data)
        .map((id) =>
          currentInstruments.find(
            ({ instrumentID }: any) => instrumentID === id
          )
        )
        .filter((asset) => asset)

      setRecentlyTradedAssets(assets)
    })

    fetchTopChangingAssets().then((data) => {
      const positive = Object.keys(data.positive)?.map((id) =>
        currentInstruments.find(({ instrumentID }: any) => instrumentID === id)
      )
      const negative = Object.keys(data.negative)?.map((id) =>
        currentInstruments.find(({ instrumentID }: any) => instrumentID === id)
      )

      const assets = [...positive, ...negative].filter((asset) => asset)

      setTopChangingAssets(assets)
    })

    const featuredInstruments = featuredInstrumentIds
      .map((id) =>
        currentInstruments.find(({ instrumentID }: any) => instrumentID === id)
      )
      .filter((asset) => asset)

    setFeaturedAssets(featuredInstruments)
  }, [siteID, isCfdOptions, isAboveBelow])

  useEffect(() => {
    const currentInstruments = getCurrentInstruments()

    let group

    switch (selectedGroup) {
      case AssetGroup.favorites:
        group = currentInstruments.filter((i: IShortInstrument) =>
          favorites.includes(i.instrumentID)
        )
        break
      case AssetGroup.mostTraded:
        group = featuredAssets
        break
      case AssetGroup.recentlyAdded:
        group = recentlyTradedAssets
        break
      case AssetGroup.gainersLosers:
        group = topChangingAssets
        break
      default:
        group = currentInstruments.filter(
          (i: IShortInstrument) => Number(i.type) === selectedGroup
        )
    }

    if (isSearch) {
      const instruments = search.force ? group : currentInstruments
      group = searchInstruments(instruments, search.value)
    }
    if (!isSearch && selectedGroup === null) {
      setSelectedGroup(AssetGroup.mostTraded)
    }

    setAssets(group)
  }, [
    search,
    selectedGroup,
    topChangingAssets,
    recentlyTradedAssets,
    isCfdOptions,
  ])

  useEffect(() => {
    if (search.value === '') {
      setSearch({ ...search, force: false })
    }
  }, [search.value])

  return (
    <AssetPanelSideMode colors={colors}>
      <SearchSideMode
        onSearch={(value) => setSearch({ ...search, value })}
        onClickClose={onClose}
      />
      <GroupsSideMode
        selected={isSearch && !search.force ? null : selectedGroup}
        onSetGroup={(value) => {
          setSelectedGroup(value)
          if (isSearch) {
            setSearch({ ...search, force: true })
          }
        }}
      />
      <TableSideMode instruments={assets} onClose={onClose} />
    </AssetPanelSideMode>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  siteID: state.registry.data.siteID,
  favorites: getFavoriteInstruments(state),
  featuredInstrumentIds: featuredInstrumentsIds(state),
  instruments: Object.values(shortOpenInstruments(state)),
  isCfdOptions: isCfdOptionsProductType(state),
  isAboveBelow: isAboveBelowProductType(state),
  cfdInstruments: state.trading.cfdOptionsInstruments,
  aboveBelowInstruments: state.trading.aboveBelowInstruments,
})

export default connect(mapStateToProps, {
  actionSetContainer,
  actionSelectInstrument,
  actionAddInstrumentToTop,
})(AssetsPanel)
