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
import { IInstrument, IUserInfo } from '../../../core/API'
import { actionSelectInstrument } from '../../../actions/trading'
import { isLoggedIn } from '../../selectors/loggedIn'
import { getUserInfo } from '../../selectors/instruments'
import InstrumentDailyChange, {
  getChange,
} from '../../ChartContainer/Chart/Instruments/instrumentDailyChange'
import FavIcon from '../../ui/FavIcon'
import { actionAddInstrumentToTop } from '../../../actions/account'
import { QuotesMap } from '../../../reducers/quotes'
import InstrumentPayout from '../../ChartContainer/Chart/Instruments/InstrumentPayout'
import { isCfdOptionsProductType } from '../../selectors/trading'

interface IAssetsTableProps {
  colors: any
  instruments: IInstrument[]
  actionSelectInstrument: (id: any) => void
  isLoggedIn: boolean
  userInfo: IUserInfo | null
  actionAddInstrumentToTop: (id: any) => void
  quotes: QuotesMap
  isCfdOptions: boolean
}

const AssetsTableSideMode = ({
  colors,
  instruments,
  actionSelectInstrument,
  userInfo,
  isLoggedIn,
  actionAddInstrumentToTop,
  quotes,
  isCfdOptions,
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
  }

  return (
    <AssetsTableSpace ref={TableWrapperRef}>
      <AssetsTableTHead>
        <AssetsTableRow>
          <AssetsTableHeader colors={colors} width={'80px'}>
            <div>{t`instrmnt`}</div>
          </AssetsTableHeader>
          <AssetsTableHeader colors={colors} width={'70px'}>
            <div>{t`price`}</div>
          </AssetsTableHeader>
          <AssetsTableHeader colors={colors} width={'80px'}>
            <div>{t`payout`}</div>
          </AssetsTableHeader>
          <AssetsTableHeader colors={colors} width={'50px'}>
            <div>{t`chg %`}</div>
          </AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            width={'20px'}
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
            <AssetsTableTHead>
              <AssetsTableRow key={key}>
                <AssetsTableColumn
                  colors={colors}
                  color={colors.secondaryText}
                  bold={true}
                  width={'80px'}
                  disabled={!item.isOpen}
                  hideOverflow={true}
                >
                  <div onClick={() => onClick(Number(item.instrumentID))}>
                    <AssetsTableHoverItem colors={colors}>
                      {item.name}
                    </AssetsTableHoverItem>
                  </div>
                </AssetsTableColumn>
                <AssetsTableColumn
                  colors={colors}
                  width={'70px'}
                  disabled={!item.isOpen}
                >
                  <div
                    onClick={() => onClick(Number(item.instrumentID))}
                    style={{
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
                  width={'80px'}
                  disabled={!item.isOpen}
                >
                  <div
                    onClick={() => onClick(Number(item.instrumentID))}
                    style={{
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
                  width={'50px'}
                  disabled={!item.isOpen}
                >
                  <div onClick={() => onClick(Number(item.instrumentID))}>
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
                  width={'20px'}
                  alignCenter={true}
                >
                  <div
                    className="fav-icon-container"
                    style={
                      !!userInfo?.favAssets?.includes(item.instrumentID)
                        ? { visibility: 'visible' }
                        : {}
                    }
                  >
                    <FavIcon
                      isFav={!!userInfo?.favAssets?.includes(item.instrumentID)}
                      instrumentId={item.instrumentID}
                    />
                  </div>
                </AssetsTableColumn>
              </AssetsTableRow>
            </AssetsTableTHead>
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
  isCfdOptions: isCfdOptionsProductType(state),
})

export default connect(mapStateToProps, {
  actionSelectInstrument,
  actionAddInstrumentToTop,
})(AssetsTableSideMode)
