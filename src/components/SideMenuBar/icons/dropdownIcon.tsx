import React from 'react'

const DropdownIcon = (props: any) => {
  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4L0 0L8 0L4 4Z"
        fill={props.color}
      />
    </svg>
  )
}

export default DropdownIcon
