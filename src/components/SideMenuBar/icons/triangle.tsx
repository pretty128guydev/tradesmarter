import React from 'react'

const Triangle = (props: any) => {
  return (
    <svg
      width="10"
      height="5"
      viewBox="0 0 10 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5 0L10 5L0 5L5 0Z"
        fill={props.color}
      />
    </svg>
  )
}

export default Triangle
