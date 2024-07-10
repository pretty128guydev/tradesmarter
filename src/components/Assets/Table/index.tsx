import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  AssetsTableChange,
  AssetsTableColumn,
  AssetsTableHeader,
  AssetsTableHoverItem,
  AssetsTableRow,
  AssetsTableSpace,
  AssetsTableTBody,
  AssetsTableTHead,
} from './styled'
import { IInstrument, IUserInfo } from '../../../core/API'
import { actionSelectInstrument } from '../../../actions/trading'
import ImageWrapper from '../../ui/ImageWrapper'
import AssetPlaceholder from '../../ChartContainer/InstrumentsBar/asset-placeholder.svg'
import InstrumentPayout from '../../ChartContainer/Chart/Instruments/InstrumentPayout'
import InstrumentPrice from '../../ChartContainer/Chart/Instruments/InstrumentPrice'
import { isLoggedIn } from '../../selectors/loggedIn'
import { defaultTopAssets, getUserInfo } from '../../selectors/instruments'
import InstrumentDailyChange from '../../ChartContainer/Chart/Instruments/instrumentDailyChange'
import { IOpenTrade } from '../../../core/interfaces/trades'
import FavIcon from '../../ui/FavIcon'
import TopIcon from '../../ui/TopIcon'
import TableChart from './chart'
import { actionAddInstrumentToTop } from '../../../actions/account'
import { LocaleDate } from '../../../core/localeFormatDate'
import { isCfdOptionsProductType } from '../../selectors/trading'

interface IAssetsTableProps {
  colors: any
  history: any
  instruments: IInstrument[]
  actionSelectInstrument: (id: any) => void
  onClose: () => void
  isLoggedIn: boolean
  userInfo: IUserInfo | null
  defaultTopAssets: any[]
  openTrades: IOpenTrade[]
  actionAddInstrumentToTop: (id: any) => void
  isCfdOptions: boolean
}

const AssetsTable = ({
  colors,
  history,
  instruments,
  actionSelectInstrument,
  onClose,
  openTrades,
  userInfo,
  isLoggedIn,
  actionAddInstrumentToTop,
  defaultTopAssets,
  isCfdOptions,
}: IAssetsTableProps) => {
  const [instrumentList, setInstrumentList] = useState<IInstrument[] | null>(
    null
  )

  const topAssets = isLoggedIn
    ? userInfo?.topAssets
    : defaultTopAssets.map(({ instrumentID }) => instrumentID)

  const TableWrapperRef = useRef<any>(null)
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState<number>(0)

  const TableBodyWrapperRef = useRef<any>(null)
  const [wrapperViewPort, setWrapperViewPort] = useState<any>({
    top: null,
    height: null,
  })

  useEffect(() => {
    if (TableWrapperRef.current) {
      const maxHeight =
        TableWrapperRef.current.offsetTop +
        TableWrapperRef.current.offsetParent.offsetTop +
        67
      setTableBodyMaxHeight(maxHeight)
    }
  }, [TableWrapperRef.current?.clientHeight])

  useEffect(() => {
    setViewPort()
  }, [TableBodyWrapperRef.current?.clientHeight])

  useEffect(() => {
    let sorted = [...instruments].sort((a, b) =>
      (b.tradingHours as any).isOpen ? 1 : -1
    )
    sorted = sorted.sort((a, b) =>
      (b.tradingHours as any).isOpen
        ? 1
        : (a.tradingHours as any).opensAt - (b.tradingHours as any).opensAt
    )

    TableBodyWrapperRef.current.scrollTop = 0
    setInstrumentList(sorted)
  }, [instruments])

  const selectInstrument = (id: string) => {
    actionSelectInstrument(id)
    onClose()
  }

  const getOpenTime = (instrument: any) => {
    const { opensAt } = instrument.tradingHours

    return (
      t`Opens in` +
      ' ' +
      LocaleDate.formatDistanceStrict(opensAt, new Date().getTime())
    )
  }

  const getTradesCount = (id: string): number | string => {
    const count = openTrades.filter(
      ({ instrumentID }) => instrumentID === Number(id)
    ).length
    return count === 0 ? '' : count
  }

  const setViewPort = () => {
    if (TableBodyWrapperRef.current) {
      const { scrollTop: top, clientHeight: height } =
        TableBodyWrapperRef.current

      setWrapperViewPort({ top, height })
    }
  }

  const onClick = (id: string) => {
    selectInstrument(id)
    actionAddInstrumentToTop(id)
  }

  return (
    <AssetsTableSpace ref={TableWrapperRef}>
      <AssetsTableTHead>
        <AssetsTableRow>
          <AssetsTableHeader
            colors={colors}
            widthPercent={14}
          >{t`instrument`}</AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={14}
          >{t`description`}</AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={10}
          >{t`payout`}</AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={10}
          >{t`status`}</AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={7}
          >{t`price`}</AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={13}
            alignCenter={true}
          >
            {t`24h change`}
          </AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={14}
            alignCenter={true}
          >{t`open trades`}</AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={9}
            alignCenter={true}
          >{t`add/remove`}</AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={9}
            alignCenter={true}
          >{t`actions`}</AssetsTableHeader>
        </AssetsTableRow>
      </AssetsTableTHead>
      <AssetsTableTBody
        className="scrollable"
        onScroll={setViewPort}
        ref={TableBodyWrapperRef}
        maxHeight={tableBodyMaxHeight}
      >
        {instrumentList?.map((item, key) => (
          <AssetsTableRow key={key}>
            <AssetsTableColumn
              colors={colors}
              color={colors.secondaryText}
              bold={true}
              widthPercent={14}
              minWidth={65}
              disabled={!(item.tradingHours as any).isOpen}
            >
              <div
                onClick={() => onClick(item.instrumentID)}
                style={{
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              >
                <ImageWrapper
                  alt={item.name}
                  src={`${process.env.PUBLIC_URL}/static/icons/instruments/${item.instrumentID}.svg`}
                  placeholderSrc={AssetPlaceholder}
                />
                <AssetsTableHoverItem colors={colors}>
                  {item.name}
                </AssetsTableHoverItem>
              </div>
            </AssetsTableColumn>
            <AssetsTableColumn
              colors={colors}
              color={colors.secondaryText}
              widthPercent={14}
              minWidth={111}
              disabled={!(item.tradingHours as any).isOpen}
            >
              <div
                onClick={() => onClick(item.instrumentID)}
                style={{
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              >
                {item.name}
              </div>
            </AssetsTableColumn>
            <AssetsTableColumn
              colors={colors}
              widthPercent={10}
              minWidth={111}
              disabled={!(item.tradingHours as any).isOpen}
            >
              <div
                onClick={() => onClick(item.instrumentID)}
                style={{
                  cursor: 'pointer',
                  display: 'inline-block',
                  color: colors.primaryText,
                }}
              >
                {!(item.tradingHours as any).isOpen ? (
                  '...'
                ) : isCfdOptions ? (
                  '100%~500%'
                ) : (
                  <InstrumentPayout
                    color={colors.primaryText}
                    instrumentId={Number(item.instrumentID)}
                  />
                )}
              </div>
            </AssetsTableColumn>
            <AssetsTableColumn
              colors={colors}
              widthPercent={10}
              minWidth={70}
              color={colors.tradebox.highText}
              disabled={!(item.tradingHours as any).isOpen}
            >
              <div
                onClick={() => onClick(item.instrumentID)}
                style={{
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              >
                {(item.tradingHours as any).isOpen
                  ? t`Open`
                  : getOpenTime(item)}
              </div>
            </AssetsTableColumn>
            <AssetsTableColumn
              colors={colors}
              color={colors.primaryText}
              widthPercent={7}
              minWidth={72}
              disabled={!(item.tradingHours as any).isOpen}
            >
              <div
                onClick={() => onClick(item.instrumentID)}
                style={{
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              >
                {(item.tradingHours as any).isOpen ? (
                  <InstrumentPrice fixed={2} instrumentId={item.instrumentID} />
                ) : (
                  <span>...</span>
                )}
              </div>
            </AssetsTableColumn>
            <AssetsTableColumn
              colors={colors}
              widthPercent={13}
              minWidth={72}
              disabled={!(item.tradingHours as any).isOpen}
            >
              <div
                onClick={() => onClick(item.instrumentID)}
                style={{
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              >
                <AssetsTableChange>
                  <InstrumentDailyChange
                    instrumentID={item.instrumentID}
                    colors={colors}
                  />
                  {(item.tradingHours as any).isOpen ? (
                    <TableChart
                      index={key}
                      wrapperViewPort={wrapperViewPort}
                      instrumentID={item.instrumentID}
                      data={history[item.instrumentID]}
                    />
                  ) : (
                    ''
                  )}
                </AssetsTableChange>
              </div>
            </AssetsTableColumn>
            <AssetsTableColumn
              disabled={!(item.tradingHours as any).isOpen}
              colors={colors}
              widthPercent={14}
              minWidth={76}
              alignCenter={true}
            >
              {getTradesCount(item.instrumentID)}
            </AssetsTableColumn>
            <AssetsTableColumn
              colors={colors}
              disabled={!(item.tradingHours as any).isOpen}
              widthPercent={9}
              minWidth={72}
              alignCenter={true}
            >
              <TopIcon
                isTop={!!topAssets?.includes(item.instrumentID)}
                instrumentId={item.instrumentID}
              />
            </AssetsTableColumn>
            <AssetsTableColumn
              colors={colors}
              disabled={!(item.tradingHours as any).isOpen}
              widthPercent={9}
              minWidth={72}
              alignCenter={true}
            >
              <FavIcon
                isFav={!!userInfo?.favAssets.includes(item.instrumentID)}
                instrumentId={item.instrumentID}
              />
            </AssetsTableColumn>
          </AssetsTableRow>
        ))}
      </AssetsTableTBody>
    </AssetsTableSpace>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isLoggedIn: isLoggedIn(state),
  userInfo: getUserInfo(state),
  openTrades: state.trades.open,
  defaultTopAssets: defaultTopAssets(state),
  isCfdOptions: isCfdOptionsProductType(state),
})

export default connect(mapStateToProps, {
  actionSelectInstrument,
  actionAddInstrumentToTop,
})(AssetsTable)
