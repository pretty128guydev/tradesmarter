import React from 'react'
import { connect } from 'react-redux'
import { ItemContainer } from './styled'

interface Position {
  left: number
  top: number
}

interface ILeaderBoardItemProps {
  item: any
  colors: any
  index: number
  isMobile: boolean
}

const LeaderBoardItem = (props: ILeaderBoardItemProps) => {
  const { item, index, colors } = props
  const { firstName, sumPnl } = item

  const formatNumber = () => {
    if (sumPnl === null || isNaN(sumPnl)) return ''

    const transformedValue = Number(sumPnl)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    return transformedValue
  }

  return (
    <ItemContainer colors={colors}>
      <div className={`rank rank_${index < 4 ? index : ''}`}>{index}</div>
      <div className="name">{firstName}</div>
      <div className="pnl">{formatNumber()}</div>
    </ItemContainer>
  )
}

const mapStateToProps = (state: any) => ({})

export default connect(mapStateToProps)(LeaderBoardItem)
