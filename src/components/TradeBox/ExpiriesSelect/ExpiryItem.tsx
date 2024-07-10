// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react'
import {
  datesAreOnSameDay,
  formatExpiryTimestamp,
  // formatShortExpiry,
} from '../ExpirySelect'
import { ExpiryItemBox } from './styled'
import { IOpenTrade } from '../../../core/interfaces/trades'
import { IGame } from '../../../reducers/games'
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { LocaleDate } from '../../../core/localeFormatDate'
import { convertHexToRGBA, isMobileLandscape } from '../../../core/utils'
import { isAboveBelowProductType } from '../../selectors/trading'

interface Position {
  left: number
  top: number
}

interface ExpiryItemProps {
  game: IGame | undefined
  colors: any
  isMobile: boolean
  openTrades: IOpenTrade[]
  expiries: IGame[]
  getPositionsForExpiry: (game: IGame) => IOpenTrade[] | undefined
  onSelect: (game: IGame) => void
  distances: any
  isAboveBelow: boolean
}

const WrapBrowser = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;

  .container {
    position: relative;
    width: 100%;
    height: 100%;
  }
`

const TimeDurationLabel = styled.div<{
  isMobile: boolean
  top: number
  maxHeight: number
  tradesLength: number
  colors: any
}>`
  background-color: ${(props) => props.colors.background};
  position: absolute;

  ${(props) =>
    props.isMobile
      ? isMobileLandscape(props.isMobile)
        ? css`
            right: 10px;
          `
        : css`
            right: 60px;
          `
      : css`
          right: 69px;
        `};

  ${(props) =>
    props.isMobile && !isMobileLandscape(props.isMobile)
      ? css`
          bottom: ${(props) => props.top}px;
        `
      : css`
          top: ${(props) => props.top + 65}px;
        `};
  ${(props) =>
    props.isMobile
      ? isMobileLandscape(props.isMobile)
        ? css`
            width: 162px;
          `
        : css`
            width: ${window.innerWidth - 120}px;
          `
      : css`
          width: 170px;
        `};
  box-shadow: 0 0 15px #263346;
  border-radius: 4px;

  .time-duration-label-header {
    position: relative;
    height: 40px;
    font-weight: bold;
    font-size: 12px;
    color: #8b9097;
  }

  .time-duration-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: auto;
    max-height: ${(props) => props.maxHeight}px;
  }

  .scrollable-container {
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      width: 6px;
      border-radius: 3px;
      background-color: rgba(255, 255, 255, 0.7);
    }
  }
`

const DurationTimeItem = styled.div<{ colors: any; isActive: boolean }>`
  width: 100%;
  margin: 1px;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 9px 15px;
  ${(props) =>
    props.isActive
      ? css`
          background-color: ${convertHexToRGBA(props.colors.primary, 0.2)};
          pointer-events: none;
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
          background-color: transparent;
          border: 1px solid transparent;
        `}

  .top, .bottom {
    white-space: nowrap;
    display: flex;
  }

  .bottom {
    line-height: 12px;
  }

  .time {
    font-size: 13px;
    color: ${(props) =>
      props.isActive ? props.colors.primary : props.colors.secondaryText};
    font-weight: 500;
  }

  .count {
    display: inline-block;
    margin-left: 4px;
    color: ${(props) => props.colors.primary};
    border: 1px solid ${(props) => props.colors.primary};
    font-size: 10px;
    border-radius: 50%;
    min-width: 15px;
    font-weight: 700;
    padding: 0 2px;
    text-align: center;
    line-height: 13px;
  }

  .expiry {
    font-size: 13px;
    color: ${(props) =>
      props.isActive ? props.colors.primary : props.colors.secondaryText};
    font-weight: 400;
  }

  .divide {
    margin-left: 3px;
    margin-right: 3px;
    border-left: 0.5px solid
      ${(props) =>
        props.isActive ? props.colors.primary : props.colors.secondaryText};
    height: 10px;
    display: inline-block;
  }

  &:hover {
    border: 1px solid ${(props) => props.colors.primary};
  }
`

const ExpiryItem = (props: ExpiryItemProps) => {
  const {
    game,
    getPositionsForExpiry,
    colors,
    isMobile,
    openTrades,
    expiries,
    onSelect,
    distances,
    isAboveBelow,
  } = props
  const [showExpiriesInfoBox, setShowExpiriesInfoBox] = useState<boolean>(false)
  const [items, setItems] = useState<IGame[] | any>(expiries)

  useEffect(() => {
    if (isAboveBelow) {
      if (distances) setItems(distances)
    } else {
      setItems(expiries)
    }
  }, [distances, expiries, isAboveBelow])

  const expiryItemBoxRef = useRef<any>(null)

  const [top, setTop] = useState<number>(0)
  const [maxHeight, setMaxHeight] = useState<number>(0)

  const getExpiryItemPosition = () => {
    const { y = 0 } = expiryItemBoxRef.current?.getBoundingClientRect() || {}

    const windowHeight = window.innerHeight
    if (isMobile && !isMobileLandscape(isMobile)) {
      // const maxH = Math.floor((y - 15) / 41) * 41
      const maxH = y - 7
      setMaxHeight(maxH)
      setTop(windowHeight - y + 2)
    } else {
      // const maxH = Math.floor((windowHeight - (y + 50)) / 41) * 41
      const maxH = windowHeight - (y + 47)
      setMaxHeight(maxH)
      setTop(y + 38)
    }
  }

  // Re-calculate X and Y of the red box when the window gets resized by the user
  useEffect(() => {
    window.addEventListener('resize', getExpiryItemPosition)

    return () => window.removeEventListener('resize', getExpiryItemPosition)
  }, [])

  const trades = game ? getPositionsForExpiry(game) : null

  const tradesCountByExpiry = items.map((ex) => {
    const timestamp: number = new Date(ex.timestamp).getTime()
    const filterTrades: IOpenTrade[] = openTrades.filter(
      (trade: IOpenTrade) => trade.expiryTimestamp === timestamp
    )
    return { ...ex, trades: filterTrades }
  })

  const formatDateToTime = (date: string | Date): string => {
    if (typeof date === 'string') {
      date = new Date(Date.parse(date))
    }

    if (datesAreOnSameDay(date as Date, new Date())) {
      return LocaleDate.format(date as Date, 'HH:mm') // 10:23
    } else {
      return LocaleDate.format(date as Date, 'LLL-d') // Feb-26
    }
  }

  const formatShortExpiryAbbreviation = (
    expiry: number,
    abbreviation?: boolean
  ): string => {
    if (expiry < 60) {
      return `${expiry}${abbreviation ? ' ' + t`sec` : t`s`}`
    } else {
      if (expiry < 7200) {
        expiry = Math.round(expiry / 60)
        return `${expiry}${abbreviation ? ' ' + t`min` : t`m`}`
      } else {
        let hours = Math.round(expiry / 3600)
        if (hours <= 24) {
          return `${hours}${
            abbreviation ? (hours <= 1 ? ' ' + t`hour` : ' ' + t`hours`) : t`h`
          }`
        } else {
          hours = Math.round(hours / 24)
          return `${hours}${
            abbreviation ? (hours <= 1 ? ' ' + t`day` : ' ' + t`days`) : t`d`
          }`
        }
      }
    }
  }

  // Get the position of the red box in the beginning
  useEffect(() => {
    getExpiryItemPosition()
  }, [showExpiriesInfoBox])

  return (
    <>
      <ExpiryItemBox
        colors={colors}
        isMobile={isMobile}
        ref={expiryItemBoxRef}
        onClick={() => setShowExpiriesInfoBox(true)}
      >
        {game && (
          <div className="expiration">
            <span className="cursor-pointer">
              {formatExpiryTimestamp(game)}
            </span>
            {Array.isArray(trades) && !isMobile && (
              <span className="trades_count">{trades.length}</span>
            )}
          </div>
        )}
        {game && !game.isCfdOptions && !game.isAboveBelow && (
          <div className="expiry_payout_container">
            <span className="expiry_payout cursor-pointer">
              <span> {formatShortExpiryAbbreviation(game.expiry, true)}</span>
              <span>{game.payout}%</span>
            </span>
          </div>
        )}
      </ExpiryItemBox>
      {showExpiriesInfoBox && (
        <WrapBrowser onClick={() => setShowExpiriesInfoBox(false)}>
          <TimeDurationLabel
            isMobile={isMobile}
            top={top}
            maxHeight={maxHeight}
            tradesLength={
              Array.isArray(tradesCountByExpiry)
                ? tradesCountByExpiry.length
                : 0
            }
            colors={colors}
          >
            <div className="time-duration-container scrollable">
              {Array.isArray(tradesCountByExpiry) &&
                tradesCountByExpiry.map((expiry, index) => {
                  if (isAboveBelow)
                    return (
                      <DurationTimeItem
                        key={index}
                        colors={colors}
                        isActive={
                          game?.timestamp?.getTime() ===
                          expiry.timestamp.getTime()
                        }
                        onClick={() => {
                          setShowExpiriesInfoBox(false)
                          onSelect(items[index])
                        }}
                      >
                        <div className="top">
                          <span className="time">
                            {formatDateToTime(expiry.timestamp)}
                          </span>
                          {expiry.trades.length > 0 && (
                            <span className="count" data-expiry-index={index}>
                              {expiry.trades.length}
                            </span>
                          )}
                        </div>
                        <div className="bottom">
                          <span className="expiry">{expiry.payout}%</span>
                        </div>
                      </DurationTimeItem>
                    )

                  return (
                    <DurationTimeItem
                      key={index}
                      colors={colors}
                      isActive={game?.expiry === expiry.expiry}
                      onClick={() => {
                        setShowExpiriesInfoBox(false)
                        onSelect(items[index])
                      }}
                    >
                      <div className="top">
                        <span className="time">
                          {formatDateToTime(expiry.timestamp)}
                        </span>
                        {expiry.trades.length > 0 && (
                          <span className="count" data-expiry-index={index}>
                            {expiry.trades.length}
                          </span>
                        )}
                      </div>
                      <div className="bottom">
                        <span className="expiry">
                          {formatShortExpiryAbbreviation(expiry.expiry)}
                        </span>
                        <span className="divide"></span>
                        <span className="expiry">{expiry.payout}%</span>
                      </div>
                    </DurationTimeItem>
                  )
                })}
            </div>
          </TimeDurationLabel>
        </WrapBrowser>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => ({
  openTrades: state.trades.open,
  distances: state.trading.distances,
  isAboveBelow: isAboveBelowProductType(state),
})

export default connect(mapStateToProps, {})(ExpiryItem)
