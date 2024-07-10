import React from 'react'
import { SliderTrackDirection } from '../..'
import {
	MoneyLabel,
	MarkerLine,
	ProfitLabel,
	LabelContainer,
	ValueTrackContainer,
} from './styled'

interface IValueTrackProps {
	color: string
	height: number
	moneyText: string
	profitText: string
	direction: SliderTrackDirection
}

export const ValueTrack = ({
	color,
	height,
	direction,
	moneyText,
	profitText,
}: IValueTrackProps) => {
	return (
		<ValueTrackContainer
			height={height}
			direction={direction}
			backgroundColor={color}
			id="slider-value-track"
		>
			<MarkerLine backgroundColor={color}>
				<LabelContainer direction={direction} borderColor={color}>
					<MoneyLabel color={color}>{moneyText}</MoneyLabel>
					<ProfitLabel color={color}>{profitText}</ProfitLabel>
				</LabelContainer>
			</MarkerLine>
		</ValueTrackContainer>
	)
}
