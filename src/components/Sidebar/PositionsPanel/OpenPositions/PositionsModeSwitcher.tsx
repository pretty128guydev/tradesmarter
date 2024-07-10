/**
 * Implements a switcher with a knob
 */
import React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import Knob from '../../../AccountBar/Knob'

const PositionsModeSwitcherPanel = styled.div<{ colors: any }>`
	display: block;
	height: 13px;
	line-height: 13px;
	margin-top: 0;
	margin-bottom: 12px;
	text-align: center;
	color: ${(props) => props.colors.secondaryText};
	position: relative;

	.knob_label {
		display: inline-block;
		font-weight: bold;
		font-size: 11px;
		line-height: 13px;
		text-transform: uppercase;
	}
`

interface IPositionsModeSwitcherProps {
	colors: any
	groups: boolean
	onChange: () => void
}

const PositionsModeSwitcher = (props: IPositionsModeSwitcherProps) => (
	<PositionsModeSwitcherPanel colors={props.colors}>
		<div className="knob_label">{t`Group by expiry time`}</div>
		<Knob
			knobOnLeft={!props.groups}
			backgroundColor={
				props.groups ? props.colors.primary : props.colors.secondaryText
			}
			pinColor={props.colors.primaryText}
			onChange={props.onChange}
			overrideStyles={`
                left: 5px;
                top: 3px;
            `}
		/>
	</PositionsModeSwitcherPanel>
)

export default PositionsModeSwitcher
