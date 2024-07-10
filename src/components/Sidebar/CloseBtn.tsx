import React, { useState } from 'react'
import styled from 'styled-components'

export const CloseBtn = styled.div<{ top: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  right: 10px;
  cursor: pointer;
  z-index: 999;
`
const CloseButton = (props: any) => {
  const [hovered, setHovered] = useState<boolean>(false)
  const stroke = hovered ? props.colors.primary : props.colors.secondaryText
  return (
    <CloseBtn
      id="close-btn__sidebar-panel"
      top={props.top ? props.top : 10}
      onClick={props.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
      >
        <g
          fill="none"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g stroke={stroke} strokeWidth="2">
            <g>
              <g>
                <g>
                  <path
                    d="M0 0L10 10M0 10L10 0"
                    transform="translate(-526 -104) translate(185 94) translate(341 10) translate(1 1)"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </CloseBtn>
  )
}

export default CloseButton
