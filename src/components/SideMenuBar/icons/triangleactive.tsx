import React from 'react'

const Triangleactive = (props: any) => {
  return (
    <svg
      width="11"
      height="5"
      viewBox="0 0 11 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.5 5L0.5 -8.74228e-07L10.5 0L5.5 5Z"
        fill={props.color}
      />
    </svg>
  )
}

export default Triangleactive
