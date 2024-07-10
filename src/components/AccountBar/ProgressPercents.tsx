/**
 * Implements a filleable progress bar
 */
import React from 'react'
import styled from 'styled-components'

interface IProgressPercentsProps {
  colors: any
  value: number
  onClick: () => void
}
const Panel = styled.div`
  display: inline-block;
`

const ProgressContainer = styled.div`
  display: inline-block;
  width: 69px;
  height: 7px;
  line-height: 7px;
  border-radius: 3.5px;

  background-color: #000000;
`
const ActiveProgress = styled.div<any>`
  display: inline-block;
  width: ${(props) => props.value * 100}%;
  height: 7px;
  line-height: 7px;
  border-radius: 3.5px;

  background-color: ${(props) => props.colors.primary};
`
const Caption = styled.span<any>`
  display: inline-block;
  padding-left: 10px;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: -0.17px;

  color: ${(props) => props.colors.primary};
  cursor: default;
  user-select: none;
`

const ProgressPercents = ({
  colors,
  value,
  onClick,
}: IProgressPercentsProps) => {
  const formattedValue = `${Math.ceil(value * 100)}%`
  return (
    <Panel onClick={onClick}>
      <ProgressContainer>
        <ActiveProgress value={value} colors={colors} />
      </ProgressContainer>
      <Caption colors={colors}>{formattedValue} ▾</Caption>
    </Panel>
  )
}

export { ProgressContainer, ActiveProgress }
export default ProgressPercents
