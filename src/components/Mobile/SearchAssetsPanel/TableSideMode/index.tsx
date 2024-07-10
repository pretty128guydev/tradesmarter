/* eslint-disable react-hooks/exhaustive-deps */
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
import { IInstrument, IUserInfo } from '../../../../core/API'
import { actionSelectInstrument } from '../../../../actions/trading'
import { isLoggedIn } from '../../../selectors/loggedIn'
import { getUserInfo } from '../../../selectors/instruments'
import InstrumentDailyChange, {
  getChange,
} from '../../../ChartContainer/Chart/Instruments/instrumentDailyChange'
import FavIcon from '../../../ui/FavIcon'
import { actionAddInstrumentToTop } from '../../../../actions/account'
import { QuotesMap } from '../../../../reducers/quotes'
import InstrumentPayout from '../../../ChartContainer/Chart/Instruments/InstrumentPayout'

interface IAssetsTableProps {
  colors: any
  instruments: IInstrument[]
  actionSelectInstrument: (id: any) => void
  isLoggedIn: boolean
  userInfo: IUserInfo | null
  actionAddInstrumentToTop: (id: any) => void
  quotes: QuotesMap
  onClose: () => void
}

const AssetsTableSideMode = ({
  colors,
  instruments,
  actionSelectInstrument,
  userInfo,
  isLoggedIn,
  actionAddInstrumentToTop,
  quotes,
  onClose,
}: IAssetsTableProps) => {
  const [instrumentList, setInstrumentList] = useState<IInstrument[] | null>(
    null
  )

  const TableWrapperRef = useRef<any>(null)
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState<number>(0)

  const TableBodyWrapperRef = useRef<any>(null)

  useEffect(() => {
    if (TableWrapperRef.current) {
      const maxHeight =
        TableWrapperRef.current.offsetTop +
        TableWrapperRef.current.offsetParent.offsetTop +
        (isLoggedIn ? 163 : 131)
      setTableBodyMaxHeight(maxHeight)
    }
  }, [TableWrapperRef.current?.clientHeight])

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

  const selectInstrument = (id: number) => {
    actionSelectInstrument(id)
  }

  const onClick = (id: number) => {
    selectInstrument(id)
    actionAddInstrumentToTop(id)
    onClose()
  }

  return (
    <AssetsTableSpace ref={TableWrapperRef}>
      <AssetsTableTHead>
        <AssetsTableRow>
          <AssetsTableHeader
            colors={colors}
            widthPercent={35}
          >{t`instrmnt`}</AssetsTableHeader>
          <AssetsTableHeader colors={colors} widthPercent={15}>
            {t`payout`}
          </AssetsTableHeader>
          <AssetsTableHeader colors={colors} widthPercent={25}>
            {t`price`}
          </AssetsTableHeader>
          <AssetsTableHeader colors={colors} widthPercent={15}>
            {t`chg %`}
          </AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={10}
            alignCenter={true}
          ></AssetsTableHeader>
        </AssetsTableRow>
      </AssetsTableTHead>
      <AssetsTableTBody
        className="scrollable"
        ref={TableBodyWrapperRef}
        maxHeight={tableBodyMaxHeight}
      >
        {instrumentList?.map((item, key) => {
          const quote = quotes[item.instrumentID]
          const change: any = getChange(quote, item)

          return (
            <AssetsTableRow key={key}>
              <AssetsTableColumn
                colors={colors}
                color={colors.secondaryText}
                bold={true}
                widthPercent={35}
                minWidth={85}
                disabled={!item.isOpen}
              >
                <div
                  onClick={() => onClick(Number(item.instrumentID))}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    paddingRight: 5,
                  }}
                >
                  <AssetsTableHoverItem colors={colors}>
                    {item.name}
                  </AssetsTableHoverItem>
                </div>
              </AssetsTableColumn>
              <AssetsTableColumn
                colors={colors}
                widthPercent={15}
                minWidth={50}
                disabled={!item.isOpen}
              >
                <div
                  onClick={() => onClick(Number(item.instrumentID))}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                  }}
                >
                  {!(item.tradingHours as any).isOpen ? (
                    '...'
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
                widthPercent={25}
                minWidth={85}
                disabled={!item.isOpen}
              >
                <div
                  onClick={() => onClick(Number(item.instrumentID))}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    color:
                      change >= 0
                        ? colors.tradebox.highText
                        : colors.tradebox.lowText,
                  }}
                >
                  {!(item.tradingHours as any).isOpen
                    ? '...'
                    : quote?.last || ''}
                </div>
              </AssetsTableColumn>
              <AssetsTableColumn
                colors={colors}
                widthPercent={15}
                minWidth={50}
                disabled={!item.isOpen}
              >
                <div
                  onClick={() => onClick(Number(item.instrumentID))}
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
                  </AssetsTableChange>
                </div>
              </AssetsTableColumn>
              <AssetsTableColumn
                colors={colors}
                disabled={!item.isOpen}
                widthPercent={10}
                minWidth={30}
                alignCenter={true}
              >
                <div className="fav-icon-container">
                  <FavIcon
                    isFav={!!userInfo?.favAssets?.includes(item.instrumentID)}
                    instrumentId={item.instrumentID}
                  />
                </div>
              </AssetsTableColumn>
            </AssetsTableRow>
          )
        })}
      </AssetsTableTBody>
    </AssetsTableSpace>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isLoggedIn: isLoggedIn(state),
  userInfo: getUserInfo(state),
  quotes: state.quotes,
})

export default connect(mapStateToProps, {
  actionSelectInstrument,
  actionAddInstrumentToTop,
})(AssetsTableSideMode)
