import React, { FC } from 'react'
import { SliderTrackDirection } from '../..'
import { TrackStepContainer } from './styled'
import { StepLabel } from './StepLabel'

interface ITrackStepProps {
  stepIndex: number
  labelText: string
  showArrow: boolean
  trackStepLen: number
  isTrackDisabled: boolean
  direction: SliderTrackDirection
  isPrimaryTheme: boolean
}

export const TrackStep: FC<ITrackStepProps> = ({
  stepIndex,
  labelText,
  showArrow,
  direction,
  trackStepLen,
  isTrackDisabled,
  isPrimaryTheme,
}) => {
  const isUpDirection = direction === 1
  const isBottomDirection = direction === -1

  const startUpImage = isPrimaryTheme
    ? 'dark-cfd-ladder-start-up.png'
    : 'white-cfd-ladder-start-up.png'
  const startDownImage = isPrimaryTheme
    ? 'dark-cfd-ladder-start-down.png'
    : 'white-cfd-ladder-start-down.png'
  const trackUpImage = isPrimaryTheme
    ? 'dark-cfd-ladder-track-up.png'
    : 'white-cfd-ladder-track-up.png'
  const trackDownImage = isPrimaryTheme
    ? 'dark-cfd-ladder-track-down.png'
    : 'white-cfd-ladder-track-down.png'

  const isFirst = stepIndex === 0

  const image = isFirst
    ? isUpDirection
      ? startUpImage
      : startDownImage
    : isUpDirection
    ? trackUpImage
    : trackDownImage

  return (
    <>
      <TrackStepContainer
        height={trackStepLen}
        id={`track-${stepIndex}`}
        backgroundImage={image}
        isTrackDisabled={isTrackDisabled}
        alignItems={isBottomDirection ? 'flex-end' : 'flex-start'}
      >
        <StepLabel
          direction={direction}
          labelText={labelText}
          isTrackDisabled={isTrackDisabled}
        />
      </TrackStepContainer>
    </>
  )
}
