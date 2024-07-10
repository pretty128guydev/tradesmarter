import React from 'react'

const TermsIcon = (props: any) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 10C0 4.47715 4.47715 0 10 0C12.6522 0 15.1957 1.05357 17.0711 2.92893C18.9464 4.8043 20 7.34784 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM1.42857 10C1.42857 14.7339 5.26613 18.5714 10 18.5714C12.2733 18.5714 14.4535 17.6684 16.0609 16.0609C17.6684 14.4535 18.5714 12.2733 18.5714 10C18.5714 5.26613 14.7339 1.42857 10 1.42857C5.26613 1.42857 1.42857 5.26613 1.42857 10Z"
        fill={props.color || '#8491A3'}
      />
      <path
        d="M7.85715 10.0001H9.28572V15.7144H10.7143V8.57153H7.85715V10.0001Z"
        fill={props.color || '#8491A3'}
      />
      <ellipse
        cx="10"
        cy="5.71422"
        rx="1.42857"
        ry="1.42857"
        fill={props.color || '#8491A3'}
      />
    </svg>
  )
}

export default TermsIcon
