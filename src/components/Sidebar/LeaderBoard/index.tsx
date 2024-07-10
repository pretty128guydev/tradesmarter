/**
 * Implemens a list of video news
 */
import React, { useEffect, useRef, useState } from 'react'
import { t } from 'ttag'
import { connect } from 'react-redux'
import { SidebarCaption } from '..'
import CloseButton from '../CloseBtn'
import LeaderBoardItem from './LeaderBoardItem'
import { api } from '../../../core/createAPI'
import Tabs from '../../ui/Tabs'
import { LeaderBoardLists, LeaderBoardHeader } from './styled'
import SidebarContentsPanel from '../SidebarContentsPanel'
import { isArray, isEmpty } from 'lodash'
import styled from 'styled-components'

const ButtonLoadmore = styled.span`
  color: white;
  cursor: pointer;
  display: inline-block;
  background-color: #263346;
  border-radius: 3px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: bold;
`

interface ILeaderBoardProps {
  colors: any
  onClose?: () => void
  isMobile?: boolean
}

/**
 * Entry component
 * @param props
 */
const LeaderBoard = (props: ILeaderBoardProps) => {
  const [items, setItems] = useState<Array<any>>([])
  const [itemsDisplay, setItemsDisplay] = useState<Array<any>>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(1)
  const [tab, setTab] = useState<number>(0)
  const [showLoadMore, setShowLoadMore] = useState<boolean>(false)

  const tabs = [t`TODAY`, t`THIS WEEK`, t`THIS MONTH`]

  let timeout = useRef<any>(null)
  useEffect(() => {
    clearTimeout(timeout.current)
    fetchLeaderBoard()
    timeout.current = setTimeout(() => {
      fetchLeaderBoard()
    }, 300000)

    return () => clearTimeout(timeout.current)
  }, [tab])

  const fetchLeaderBoard = async () => {
    let resp = await api.fetchLeaderBoard(getPeriodName())
    if (isEmpty(resp)) resp = []
    setItems(resp)
    const totalPages = Math.ceil(resp.length / 10)
    setTotalPage(totalPages)
  }

  const getPeriodName = () => {
    switch (tab) {
      case 0:
        return 'day'
      case 1:
        return 'week'
      case 2:
        return 'month'
    }
  }

  useEffect(() => {
    if (currentPage <= totalPage) {
      let numberOfItems = currentPage * 10
      if (numberOfItems > items.length) numberOfItems = items.length
      const currentItems = items.slice()
      const datas = currentItems.splice(0, numberOfItems)
      setItemsDisplay(datas)
      setShowLoadMore(currentPage < totalPage)
    }
  }, [items, currentPage, totalPage])

  return (
    <SidebarContentsPanel
      colors={props.colors}
      adjustable={false}
      isMobile={props.isMobile || false}
    >
      <SidebarCaption
        colors={props.colors}
      >{t`Trader’s Performance`}</SidebarCaption>
      <CloseButton colors={props.colors} onClick={props.onClose} />
      <Tabs value={tab} tabs={tabs} onChange={setTab} />
      <LeaderBoardLists className="scrollable">
        <LeaderBoardHeader colors={props.colors}>
          <span className="rank">{t`Rank`}</span>
          <span className="name">{t`Name`}</span>
          <span className="pnl">{t`Profit`}</span>
        </LeaderBoardHeader>
        <div>
          {isArray(itemsDisplay) &&
            itemsDisplay.map((d, idx) => (
              <LeaderBoardItem
                key={idx}
                item={d}
                index={idx + 1}
                colors={props.colors}
                isMobile={props.isMobile || false}
              />
            ))}
        </div>
        {showLoadMore && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <ButtonLoadmore
              onClick={() => setCurrentPage(currentPage + 1)}
            >{t`Load more`}</ButtonLoadmore>
          </div>
        )}
      </LeaderBoardLists>
    </SidebarContentsPanel>
  )
}

const mapStateToProps = (state: any) => ({})

export default connect(mapStateToProps)(LeaderBoard)
