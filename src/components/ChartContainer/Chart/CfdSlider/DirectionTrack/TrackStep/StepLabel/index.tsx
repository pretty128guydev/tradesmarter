import React, { FC } from 'react'
import { SliderTrackDirection } from '../../..'
import { StepContainer, LineSeparator, TextWrapper } from './styled'

interface IStepLabelProps {
	labelText: string
	isTrackDisabled: boolean
	direction: SliderTrackDirection
}

export const StepLabel: FC<IStepLabelProps> = ({
	direction,
	labelText,
	isTrackDisabled,
}) => {
	return (
		<StepContainer direction={direction}>
			<LineSeparator />
			<TextWrapper isTrackDisabled={isTrackDisabled}>
				{labelText}
			</TextWrapper>
		</StepContainer>
	)
}
