/**
 * Implements and colored icons which contains fill and stroke with primary color
 */
import React from 'react'

interface IIconProps {
  primary: string
  style: any
  onClick: () => void
}
const HedgeIcon = (props: IIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="29"
    height="29"
    viewBox="0 0 28 28"
    {...props.style}
    onClick={props.onClick}
  >
    <g fill="none" fillRule="evenodd">
      <g>
        <g>
          <g>
            <g transform="translate(-430 -360) translate(185 94) translate(73 255) translate(172 11)">
              <circle cx="14" cy="14" r="13.5" stroke={props.primary} />
              <g fill={props.primary}>
                <path
                  d="M8 1L12 6 4 6z"
                  transform="translate(6 6) rotate(-180 8 3.5)"
                />
                <path
                  d="M8 10L12 15 4 15z"
                  transform="translate(6 6) matrix(-1 0 0 1 16 0)"
                />
                <path d="M4 7.5H12V8.5H4z" transform="translate(6 6)" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
)

const DoubleUpIcon = (props: IIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="29"
    height="29"
    viewBox="0 0 28 28"
    {...props.style}
    onClick={props.onClick}
  >
    <g fill="none" fillRule="evenodd">
      <g>
        <g>
          <g>
            <g transform="translate(-465 -360) translate(185 94) translate(73 255) translate(207 11)">
              <circle cx="14" cy="14" r="13.5" stroke={props.primary} />
              <g fill={props.primary} fillRule="nonzero">
                <path
                  d="M5.683 11.396l.984-.998-2.102-2.142 2.102-2.142-.984-.998L3.58 7.258 1.485 5.116.5 6.114l2.102 2.142L.5 10.398l.985.998L3.58 9.26l2.103 2.136zM14.5 12.82v-1.29h-4.497l2.368-2.536c.621-.674 1.068-1.276 1.34-1.806.273-.53.41-1.037.41-1.52 0-.834-.272-1.487-.815-1.96C12.762 3.237 12.02 3 11.08 3c-.652 0-1.227.13-1.726.393-.5.261-.883.628-1.151 1.1-.268.473-.403 1.004-.403 1.594h1.617c0-.554.144-.991.433-1.31.288-.32.694-.48 1.217-.48.44 0 .788.142 1.048.426.26.284.39.657.39 1.118 0 .35-.1.7-.297 1.048-.197.348-.529.781-.995 1.3l-3.226 3.52v1.11H14.5z"
                  transform="translate(6 6)"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
)

export { DoubleUpIcon, HedgeIcon }
