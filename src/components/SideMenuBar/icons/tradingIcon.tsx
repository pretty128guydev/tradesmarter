import React from 'react'

const TradingIcon = (props: any) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3.33334"
        y="9.1665"
        width="4.83333"
        height="3.33333"
        rx="1"
        stroke={props.color || '#8491A3'}
        strokeWidth="1.6"
      />
      <rect
        x="5"
        y="3.3335"
        width="1.33333"
        height="5.83333"
        fill={props.color || '#8491A3'}
      />
      <rect
        x="5"
        y="12.5"
        width="1.33333"
        height="4.16667"
        fill={props.color || '#8491A3'}
      />
      <rect
        x="13.3333"
        y="15"
        width="1.33333"
        height="4.16667"
        fill={props.color || '#8491A3'}
      />
      <rect
        x="13.3333"
        y="0.833496"
        width="1.33333"
        height="3.33333"
        fill={props.color || '#8491A3'}
      />
      <rect
        x="11.6667"
        y="4.1665"
        width="4.83333"
        height="10.8333"
        rx="1"
        stroke={props.color || '#8491A3'}
        strokeWidth="1.6"
      />
    </svg>
  )
}

export default TradingIcon
