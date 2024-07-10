import React, { FC } from 'react'
import { SliderTrackDirection } from '../../..'
import { ArrowContainer, ArrowFooter, ArrowUp, ArrowBottom } from './styled'

interface IArrowProps {}

export const Arrow: FC<IArrowProps> = () => {
	return (
		<ArrowContainer>
			<ArrowFooter />
		</ArrowContainer>
	)
}
