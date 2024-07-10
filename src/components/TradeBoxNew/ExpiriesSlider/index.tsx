/**
 * Expiries slider
 */
import React, { useEffect, useRef, useState } from 'react'
import { IGame } from '../../../reducers/games'
import { IOpenTrade } from '../../../core/interfaces/trades'
import {
  ExpiriesContainer,
  SliderArrowLeft,
  SliderArrowRight,
  SliderContainer,
  SliderItemsWrapper,
} from './styled'
import ExpiryItem from './ExpiryItem'

interface IExpiriesSliderProps {
  colors: any
  items: IGame[]
  disabled: boolean
  selected: (game: IGame) => boolean
  onSelect: (game: IGame) => void
  getPositionsForExpiry: (game: IGame) => IOpenTrade[] | undefined
}

const SCROLL_STEP = 74
const SLIDER_CONTAINER_WIDTH = 230

const ExpiriesSlider = (props: IExpiriesSliderProps) => {
  const sliderWrapper: any = useRef(null)
  const [sliderWrapperWidth, setSliderWrapperWidth] = useState<number>(0)
  const [slidingWidth, setSlidingWidth] = useState<number>(0)
  const { items, selected, onSelect, colors, getPositionsForExpiry } = props

  useEffect(() => {
    setSliderWrapperWidth(sliderWrapper.current.scrollWidth)
    setSlidingWidth(0)
  }, [items.length])

  const onSlideLeft = () => {
    const canSlide = slidingWidth !== 0 && slidingWidth - SCROLL_STEP > 0

    setSlidingWidth((slidingWidth) =>
      canSlide ? slidingWidth - SCROLL_STEP : 0
    )
  }

  const onSlideRight = () => {
    const canSlide =
      slidingWidth + SCROLL_STEP < sliderWrapperWidth - SLIDER_CONTAINER_WIDTH

    setSlidingWidth((slidingWidth) =>
      canSlide
        ? slidingWidth + SCROLL_STEP
        : sliderWrapperWidth - SLIDER_CONTAINER_WIDTH
    )
  }

  return (
    <ExpiriesContainer>
      <SliderArrowLeft
        colors={colors}
        disabled={slidingWidth === 0}
        onClick={onSlideLeft}
      />
      <SliderContainer>
        <SliderItemsWrapper ref={sliderWrapper} slidingWidth={slidingWidth}>
          {items.map((game: IGame, index: number) => (
            <ExpiryItem
              key={index}
              game={game}
              colors={colors}
              getPositionsForExpiry={getPositionsForExpiry}
              onSelect={onSelect}
              selected={selected}
            />
          ))}
        </SliderItemsWrapper>
      </SliderContainer>
      <SliderArrowRight
        colors={colors}
        disabled={slidingWidth === sliderWrapperWidth - SLIDER_CONTAINER_WIDTH}
        onClick={onSlideRight}
      />
    </ExpiriesContainer>
  )
}

export default ExpiriesSlider
