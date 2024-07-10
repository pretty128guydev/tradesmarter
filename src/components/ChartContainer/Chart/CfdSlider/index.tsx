import React, { FC, useState, useEffect } from 'react'
import { round } from 'lodash'
import { SliderContainer } from './styled'
import { StartTrack } from './StartTrack'
import { DirectionTrack } from './DirectionTrack'
import { connect } from 'react-redux'
import { ICfdOptionsInstrument } from '../../../../core/API'
import { actionSetCfdOptionsActiveDirection } from '../../../../actions/trading'
import { ISentimentItem } from '../CfdSentimentSwitcher'
import { getWalletCurrencySymbol } from '../../../selectors/currency'

export type SliderTrackDirection = 1 | -1

interface ICfdSliderProps {
  isMobile: boolean
  lastPrice: number
  cfdRiskAmount: number
  currencySymbol: string
  trackStepLen: number
  trackStepsCount: number
  valueTrackColor: string
  activeTrackColor: string
  inactiveTrackColor: string
  activeDirection: SliderTrackDirection | null
  instrument: ICfdOptionsInstrument | null
  expiry: number | null
  selectedCfdSentimentOption: ISentimentItem
  actionSetCfdOptionsActiveDirection: (
    direction: SliderTrackDirection | null
  ) => void
  isPrimaryTheme: boolean
}

const CfdSliderFC: FC<ICfdSliderProps> = ({
  isMobile,
  lastPrice,
  currencySymbol,
  trackStepLen,
  trackStepsCount,
  valueTrackColor,
  activeTrackColor,
  inactiveTrackColor,
  instrument,
  expiry,
  cfdRiskAmount,
  selectedCfdSentimentOption,
  activeDirection,
  actionSetCfdOptionsActiveDirection,
  isPrimaryTheme,
}) => {
  const [active, setActive] = useState<SliderTrackDirection | null>(
    activeDirection
  )

  const setActiveCallback = (direction: SliderTrackDirection | null) => {
    setActive(direction)
    actionSetCfdOptionsActiveDirection(direction)
  }

  useEffect(() => {
    setActive(activeDirection)
  }, [activeDirection])
  const steps = Math.max(Math.floor(trackStepsCount / 2), 0)

  const trackStepLabelFormatter = (
    direction: SliderTrackDirection,
    index: number,
    array: number[]
  ) => {
    const { id } = selectedCfdSentimentOption

    if (id === 2) {
      return direction === -1
        ? `${round(+lastPrice - (index + 1) * +instrument![expiry!].price, 5)}`
        : `${round(
            +lastPrice + (array.length - index) * +instrument![expiry!].price,
            5
          )}`
    }

    if (id === 3) {
      return direction === -1 ? `${index + 1}x` : `${array.length - index}x`
    }

    return direction === -1
      ? `${(index + 1) * 100}%`
      : `${(array.length - index) * 100}%`
  }

  return (
    <SliderContainer isMobile={isMobile} trackStepLen={trackStepLen}>
      <DirectionTrack
        direction={1}
        lastPrice={lastPrice}
        cfdRiskAmount={cfdRiskAmount}
        currencySymbol={currencySymbol}
        trackStepsCount={steps}
        trackStepLen={trackStepLen}
        valueTrackColor={valueTrackColor}
        activeTrackColor={activeTrackColor}
        inactiveTrackColor={inactiveTrackColor}
        instrument={instrument}
        expiry={expiry}
        selectedCfdSentimentOption={selectedCfdSentimentOption}
        activeDirection={active}
        setActiveDirection={setActiveCallback}
        trackStepLabelFormatter={trackStepLabelFormatter}
        isPrimaryTheme={isPrimaryTheme}
      />
      <StartTrack trackStepLen={10} />
      <DirectionTrack
        direction={-1}
        lastPrice={lastPrice}
        cfdRiskAmount={cfdRiskAmount}
        currencySymbol={currencySymbol}
        trackStepsCount={steps}
        trackStepLen={trackStepLen}
        valueTrackColor={valueTrackColor}
        activeTrackColor={activeTrackColor}
        inactiveTrackColor={inactiveTrackColor}
        instrument={instrument}
        expiry={expiry}
        activeDirection={active}
        selectedCfdSentimentOption={selectedCfdSentimentOption}
        setActiveDirection={setActiveCallback}
        trackStepLabelFormatter={trackStepLabelFormatter}
        isPrimaryTheme={isPrimaryTheme}
      />
    </SliderContainer>
  )
}

const mapStateToProps = (state: any) => ({
  cfdRiskAmount: state.trading.cfdRiskAmount,
  activeDirection: state.trading.cfdOptionsActiveDirection,
  selectedCfdSentimentOption: state.trading.selectedCfdSentimentOption,
  currencySymbol: getWalletCurrencySymbol(state),
  isPrimaryTheme:
    state.registry.data.partnerConfig.defaultTheme === 'themePrimary',
})

export const CfdSlider = connect(mapStateToProps, {
  actionSetCfdOptionsActiveDirection,
})(CfdSliderFC)
