/**
 * Implements a countdown component
 * Green if money state > 0
 * Red if money state < 0
 */
import React from 'react'
import { connect } from 'react-redux'
import CircularProgress from '../../ChartContainer/Chart/Sentiment/CircularProgress'

interface ICountdownProps {
  created: number
  expiry: number
  moneyState: number
  colors: any
  time: number
  size?: number
  fontSize?: number
}

const formatSeconds = (value: number): string => {
  if (value > 9) {
    return String(value)
  }
  return `0${value}`
}

/**
 * Remove milliseconds to make floor predictable
 * @param distance
 */
export const trimMs = (distance: number): number =>
  Math.round(distance / 1000) * 1000

const HOUR_IN_MS = 3600000
const FIVEMIN_IN_MS = 300000
const MINUTE_IN_MS = 60000
const DAY_IN_MS = HOUR_IN_MS * 24
const WEEK_IN_MS = DAY_IN_MS * 7
/**
 * Implement a behavior described in design
 * @param timestamp - in milliseconds like 26418
 */
export const timeDistanceFormatter = (distanceWithMs: number): string => {
  const distance = trimMs(distanceWithMs)
  if (distance > WEEK_IN_MS) {
    return `${Math.ceil(distance / WEEK_IN_MS)}w`
  }
  if (distance > DAY_IN_MS) {
    return `${Math.ceil(distance / DAY_IN_MS)}d`
  }
  if (distance > HOUR_IN_MS) {
    return `${Math.ceil(distance / HOUR_IN_MS)}h`
  }
  if (distance > FIVEMIN_IN_MS) {
    return `${Math.round(distance / MINUTE_IN_MS)}m`
  }
  if (distance > MINUTE_IN_MS) {
    const minutes = Math.floor(distance / MINUTE_IN_MS)
    const seconds = Math.round((distance % MINUTE_IN_MS) / 1000)
    return `${minutes}:${formatSeconds(seconds)}`
  }
  // Less than a minute
  const seconds = Math.round(distance / 1000)
  return `${seconds}`
}

const Countdown = (props: ICountdownProps) => {
  const expectedTime = props.expiry - props.created
  const realTime = props.expiry - props.time
  const expired = realTime < 0
  const fillRate = Math.ceil(((realTime - expectedTime) / expectedTime) * 100)

  const color =
    props.moneyState < 0 ? props.colors.primary : props.colors.secondary
  const timeDistance = timeDistanceFormatter(realTime)

  if (expired) {
    return null
  }

  return (
    <div className="trade__countdown">
      <CircularProgress
        value={100 - fillRate}
        filledColor={color}
        normalColor="transparent"
        size={props.size || 30}
        text={timeDistance}
        textColor={props.colors.primaryText}
        thickness={1.5}
        fontSize={props.fontSize || 12}
      />
    </div>
  )
}

const mapStateToProps = (state: any) => ({ time: state.time })

export default connect(mapStateToProps)(Countdown)
