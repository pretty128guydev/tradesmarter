import React from 'react'
import styled from 'styled-components'

export const CloseBtn = styled.div<{ top: number; right: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  right: ${(props) => props.right}px;
  cursor: pointer;
  z-index: 999;
`
const CloseBtnRound = (props: any) => {
  return (
    <CloseBtn
      id="close-btn__sidebar-panel"
      top={props.top ? props.top : 10}
      right={props.right ? props.right : 10}
      onClick={props.onClick}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="17" cy="17" r="17" fill="#263346" />
        <path
          d="M12 12L22 22"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22L22 12"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CloseBtn>
  )
}

export default CloseBtnRound
