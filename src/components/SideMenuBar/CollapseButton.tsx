import React, { useState } from 'react'
import styled, { css } from 'styled-components'

export const CollapseBtn = styled.div<{ collapsed: boolean }>`
  position: absolute;
  top: 0;
  right: 5px;
  cursor: pointer;
  z-index: 1;
  transition: transform 0.4s;
  ${(props) =>
    props.collapsed
      ? css`
          transform: rotate(180deg);
        `
      : css``}
`

const CollapseButton = (props: any) => {
  const [hovered, setHovered] = useState<boolean>(false)
  const stroke = hovered ? props.colors.primary : props.colors.secondaryText

  return (
    <CollapseBtn
      collapsed={props.collapsed}
      onClick={props.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        width="32"
        height="40"
        viewBox="0 0 32 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 26L12 20L18 14"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CollapseBtn>
  )
}

export default CollapseButton
