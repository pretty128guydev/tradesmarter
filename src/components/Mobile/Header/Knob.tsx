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
  width: 38px;
  cursor: pointer;
  ${(props) => (props.overrideStyles ? props.overrideStyles : '')}
`

const KnobBackground = styled.div<any>`
  position: absolute;
  top: 1px;
  left: 0;
  display: block;
  width: 28px;
  height: 8px;
  border-radius: 4px;
  background: ${(props) => props.backgroundColor};
`

const Pin = styled.div<any>`
  position: absolute;
  top: -2px;
  left: ${(props) => props.left}px;
  width: 14px;
  height: 14px;
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
