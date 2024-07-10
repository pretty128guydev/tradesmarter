import React, { useState, useEffect } from 'react'
import { isNil } from 'lodash'
import {
	LegendContainer,
	IndicatorBrief,
	IndicatorColor,
	LineColor,
} from './styled'
import LegendMenu from './LegendMenu'

/**
 * Return indicator representation as a string
 * Will be in use unless each indicator will have its own component
 * @param indicator
 */
const formatIndicatorAsString = (indicator: any): string => {
	return `${indicator.name} (${indicator.params
		.flatMap((param: any) => param.value)
		.join(',')})`
}

interface ILegendsProps {
	indicator: any
	withBrief?: boolean
	x?: number
	y?: number
}

const Legend = ({ indicator, withBrief = true, x, y }: ILegendsProps) => {
	const [menuVisible, setMenuVisible] = useState<boolean>(false)

	useEffect(() => {
		if (!isNil(withBrief)) setMenuVisible(!withBrief)
	}, [indicator, withBrief])

	return (
		<LegendContainer>
			<IndicatorBrief
				onMouseEnter={() => setMenuVisible(true)}
				onMouseLeave={() => setMenuVisible(false)}
			>
				{indicator.color && (
					<IndicatorColor>
						<LineColor backgroundColor={indicator.color} />
					</IndicatorColor>
				)}
				{formatIndicatorAsString(indicator)}
				{menuVisible && (
					<LegendMenu indicator={indicator} x={x} y={y} />
				)}
			</IndicatorBrief>
		</LegendContainer>
	)
}

export default Legend
