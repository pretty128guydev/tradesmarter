import React from 'react'

interface ISoundOffProps {
  size: number
  color: string
}

const SoundOff = ({ size, color }: ISoundOffProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.3827 0.0723791C10.0077 -0.0748695 9.57873 0.00682972 9.29273 0.278527L4.58587 4.75013H1.99994C0.896974 4.75013 0 5.60228 0 6.65012V12.3501C0 13.3979 0.896974 14.25 1.99994 14.25H4.58587L9.29273 18.7217C9.48373 18.9031 9.73972 19 9.99971 19C10.1287 19 10.2587 18.9762 10.3827 18.9278C10.7557 18.7806 10.9997 18.4338 10.9997 18.05V0.950171C10.9997 0.566374 10.7557 0.219628 10.3827 0.0723791Z"
        fill={color}
      />
      <path
        d="M16.4136 9.49999L17.7066 8.27165C18.0976 7.90021 18.0976 7.29981 17.7066 6.92837C17.3156 6.55692 16.6836 6.55692 16.2926 6.92837L14.9997 8.1567L13.7067 6.92837C13.3157 6.55692 12.6837 6.55692 12.2928 6.92837C11.9018 7.29981 11.9018 7.90021 12.2928 8.27165L13.5857 9.49999L12.2928 10.7283C11.9018 11.0998 11.9018 11.7002 12.2928 12.0716C12.4877 12.2569 12.7437 12.35 12.9997 12.35C13.2557 12.35 13.5117 12.2569 13.7067 12.0716L14.9997 10.8433L16.2926 12.0716C16.4876 12.2569 16.7436 12.35 16.9996 12.35C17.2556 12.35 17.5116 12.2569 17.7066 12.0716C18.0976 11.7002 18.0976 11.0998 17.7066 10.7283L16.4136 9.49999Z"
        fill={color}
      />
    </svg>
  )
}

export default SoundOff
