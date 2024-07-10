/**
 * Implements a custom-made knob
 * Used in desktop and mobile
 */
import React from 'react'
import styled from 'styled-components'

interface IKnobProps {
	knobOnLeft: boolean
	backgroundColor: string
	pinColor: string
	overrideStyles?: string
	onChange: (newState: boolean) => void
}

const KnobContainer = styled.div<{ overrideStyles: any }>`
	position: relative;
	display: inline-block;
	width: 25px;
	height: 12px;
	cursor: pointer;
	${(props) => (props.overrideStyles ? props.overrideStyles : '')}
`
const KnobBackground = styled.div<any>`
	position: absolute;
	top: 2px;
	left: 5px;

	display: block;
	width: 12px;
	height: 6px;
	border-radius: 2px;
	background: ${(props) => props.backgroundColor};
`

const Pin = styled.div<any>`
	position: absolute;
	top: 0;
	left: ${(props) => props.left}px;

	width: 10px;
	height: 10px;
	border-radius: 50%;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
	background-color: ${(props) => props.pinColor};
`

const Knob = (props: IKnobProps) => (
	<KnobContainer
		overrideStyles={props.overrideStyles}
		onClick={() => props.onChange(!props.knobOnLeft)}
	>
		<KnobBackground backgroundColor={props.backgroundColor} />
		<Pin left={props.knobOnLeft ? 0 : 14} pinColor={props.pinColor} />
	</KnobContainer>
)

export default Knob
