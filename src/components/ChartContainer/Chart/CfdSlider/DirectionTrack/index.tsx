import React, { FC, useState } from 'react'
import { SliderTrackDirection } from '..'
import { round } from 'lodash'
import { ICfdOptionsInstrument } from '../../../../../core/API'
import { ISentimentItem } from '../../CfdSentimentSwitcher'
import { TrackContainer } from '../styled'
import { TrackStep } from './TrackStep'
import { ValueTrack } from './ValueTrack'

const calculateProfit = (
  direction: SliderTrackDirection,
  trackStepLen: number,
  directionHeight: number,
  productPrice: number,
  lastPrice: number,
  sentimentOption: ISentimentItem
): string => {
  if (sentimentOption.id === 1) {
    return `${Math.floor((directionHeight / trackStepLen) * 100)}%`
  }

  if (sentimentOption.id === 2) {
    return `${round(
      +lastPrice + (direction * (productPrice * directionHeight)) / 100,
      4
    )}`
  }

  if (sentimentOption.id === 3) {
    return `${round(directionHeight / trackStepLen, 1)}x`
  }

  return ''
}

interface IDirectionTrackProps {
  lastPrice: number
  cfdRiskAmount: number
  currencySymbol: string
  trackStepLen: number
  trackStepsCount: number
  valueTrackColor: string
  activeTrackColor: string
  inactiveTrackColor: string
  instrument: ICfdOptionsInstrument | null
  expiry: number | null
  direction: SliderTrackDirection
  activeDirection: SliderTrackDirection | null
  selectedCfdSentimentOption: ISentimentItem
  setActiveDirection: (direction: SliderTrackDirection | null) => void
  trackStepLabelFormatter: (
    direction: SliderTrackDirection,
    index: number,
    array: number[]
  ) => string
  isPrimaryTheme: boolean
}

export const DirectionTrack: FC<IDirectionTrackProps> = ({
  lastPrice,
  direction,
  cfdRiskAmount,
  currencySymbol,
  trackStepLen,
  trackStepsCount,
  valueTrackColor,
  activeTrackColor,
  inactiveTrackColor,
  instrument,
  expiry,
  activeDirection,
  setActiveDirection,
  trackStepLabelFormatter,
  selectedCfdSentimentOption,
  isPrimaryTheme,
}) => {
  const [moneyText, setMoneyText] = useState<string>('')
  const [profitText, setProfitText] = useState<string>('')
  const [showValueTrack, setShowValueTrack] = useState<boolean>(false)
  const [valueTrackHeight, setValueTrackHeight] = useState<number>(0)

  const onMouseMove = (e: any) => {
    const { target, clientY, touches } = e

    const id = target.getAttribute('id')
    if (id) {
      const index = parseInt(id.match(/\d+/)[0])
      const { top } = target.getBoundingClientRect()
      const y = (clientY ?? touches[0].pageY) - top
      const isDownDirection = direction === -1
      const height = isDownDirection
        ? trackStepLen * index + y
        : trackStepLen * (index + 1) - y
      setValueTrackHeight(height)

      if (height < 0 || trackStepLen * trackStepsCount < height) {
        onMouseLeave()
      }

      if (expiry && instrument) {
        const product = instrument[expiry]
        setProfitText(
          calculateProfit(
            direction,
            trackStepLen,
            height,
            +product.price,
            lastPrice,
            selectedCfdSentimentOption
          )
        )

        setMoneyText(
          `${currencySymbol}${Math.floor(
            (cfdRiskAmount * height) / trackStepLen
          )}`
        )
      }
    }
  }

  const onMouseEnter = () => {
    setShowValueTrack(true)
    setActiveDirection(direction)
  }

  const onMouseLeave = () => {
    setShowValueTrack(false)
    setActiveDirection(null)
  }

  const isTrackDisabled = !!activeDirection && activeDirection !== direction

  return (
    <TrackContainer
      onTouchMove={onMouseMove}
      onTouchStartCapture={onMouseEnter}
      onTouchEndCapture={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showValueTrack && (
        <ValueTrack
          moneyText={moneyText}
          profitText={profitText}
          direction={direction}
          color={valueTrackColor}
          height={valueTrackHeight}
        />
      )}
      {[...Array(trackStepsCount)].map((_, index: number, array: number[]) => (
        <TrackStep
          key={index}
          direction={direction}
          trackStepLen={trackStepLen}
          isTrackDisabled={isTrackDisabled}
          showArrow={direction === 1 ? index === 0 : index === array.length - 1}
          stepIndex={direction === -1 ? index : array.length - index - 1}
          labelText={trackStepLabelFormatter(direction, index, array)}
          isPrimaryTheme={isPrimaryTheme}
        />
      ))}
    </TrackContainer>
  )
}
