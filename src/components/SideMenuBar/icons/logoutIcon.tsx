import React from 'react'

const LogoutIcon = (props: any) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.8334 0H9.40479V1.42857H15.8334C16.2278 1.42857 16.5476 1.74837 16.5476 2.14286V17.8571C16.5476 18.2516 16.2278 18.5714 15.8334 18.5714H9.40479V20H15.8334C17.0168 20 17.9762 19.0406 17.9762 17.8571V2.14286C17.9762 0.95939 17.0168 0 15.8334 0V0Z"
        fill={props.color || '#8491A3'}
      />
      <path
        d="M9.40477 14.5714L12.9762 11C13.5301 10.4428 13.5301 9.54293 12.9762 8.98573L9.40477 5.41431L8.36906 6.42859L11.2262 9.28574H0.833344V10.7143H11.2548L8.39763 13.5714L9.40477 14.5714Z"
        fill={props.color || '#8491A3'}
      />
    </svg>
  )
}

export default LogoutIcon
