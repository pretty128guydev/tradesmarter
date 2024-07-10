/**
 * Implements a Circular Progress without any charting libraries to reduce size
 *
 * This component consists of two circles:
 * first represents an empty state
 * second represents a filled state
 */
import React from 'react'

interface ICircularProgressProps {
  value: number
  filledColor: string
  normalColor: string
  size: number
  textColor?: string
  text?: string
  thickness: number
  withBackground?: boolean
  backgroundColor?: string
  fontSize?: number
}

const CircularProgress = ({
  value,
  filledColor,
  normalColor,
  textColor,
  size,
  text,
  thickness,
  withBackground,
  backgroundColor,
  fontSize,
}: ICircularProgressProps) => {
  /**
   * Mathematics to render sector
   */
  const circumference = 2 * Math.PI * ((size - thickness) / 2)
  const strokeDasharray = circumference.toFixed(3)
  const rootProps: any = {
    'aria-valuenow': Math.round(value),
    style: {
      display: 'block',
      flex: `0 0 ${size}px`,
      width: size,
      height: size,
      transform: 'rotate(-90deg)',
    },
  }
  const strokeDashoffset = `${(((100 - value) / 100) * circumference).toFixed(
    3
  )}px`

  const half = size / 2
  return (
    <div {...rootProps}>
      <svg viewBox={`${half} ${half} ${size} ${size}`}>
        <circle
          cx={size}
          cy={size}
          r={(size - thickness) / 2}
          fill="none"
          stroke={normalColor}
          strokeWidth={thickness}
        />
        <circle
          cx={size}
          cy={size}
          r={(size - thickness) / 2}
          fill="none"
          stroke={filledColor}
          strokeWidth={thickness}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
        {withBackground && (
          <circle
            transform={`translate(${size * 0.6}, ${size * 0.6})`}
            cx={`${size * 0.4}`}
            cy={`${size * 0.4}`}
            r={`${size * 0.375}`}
            fill={backgroundColor}
          />
        )}
        {text && (
          <text
            x={size}
            y={-size}
            textAnchor="middle"
            fill={textColor}
            dy=".3em"
            style={{ transform: 'rotate(90deg)', fontSize }}
          >
            {text}
          </text>
        )}
      </svg>
    </div>
  )
}

export default CircularProgress
