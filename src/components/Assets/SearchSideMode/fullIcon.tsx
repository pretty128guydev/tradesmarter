import React from 'react'

const FullIcon = (props: any) => {
  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="30" height="30" rx="15" fill={props.stroke} />
      <path
        fill={props.fill}
        d="M9 14.25C8.58579 14.25 8.25 14.5858 8.25 15C8.25 15.4142 8.58579 15.75 9 15.75V14.25ZM21.5303 15.5303C21.8232 15.2374 21.8232 14.7626 21.5303 14.4697L16.7574 9.6967C16.4645 9.40381 15.9896 9.40381 15.6967 9.6967C15.4038 9.98959 15.4038 10.4645 15.6967 10.7574L19.9393 15L15.6967 19.2426C15.4038 19.5355 15.4038 20.0104 15.6967 20.3033C15.9896 20.5962 16.4645 20.5962 16.7574 20.3033L21.5303 15.5303ZM9 15.75L21 15.75V14.25L9 14.25V15.75Z"
      />
    </svg>
  )
}

export default FullIcon
