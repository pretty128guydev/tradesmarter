import React from 'react'

type Props = {
  colors: any
  active: boolean
}

export const LeftMenuIcoAnalysis = (props: Props) => {
  const { colors, active } = props
  const color = active ? colors.primary : colors.primaryText

  return (
    <svg
      width="26"
      height="24"
      viewBox="0 0 26 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.89062 20.1718L8.56506 14.4973V22.0632H2.89062V20.1718Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.457 12.6058L16.1315 18.2803V22.0632H10.457V12.6058Z"
        fill={color}
      />
      <path d="M1 16.9056L9.7093 7.71993L17.217 14.6673L25 2" stroke={color} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.0234 18.2803L23.6979 8.82288V22.0632H18.0234V18.2803Z"
        fill={color}
      />
    </svg>
  )
}

export const LeftMenuIcoDashboard = (props: Props) => {
  const { colors, active } = props
  const color = active ? colors.primary : colors.primaryText

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 1.5C2.17614 1.5 1.5 2.17614 1.5 3V10.6H10.6V1.5H3ZM0.5 3C0.5 1.62386 1.62386 0.5 3 0.5H11.6V11.6H0.5V3Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4004 0.5H21.0004C22.3765 0.5 23.5004 1.62386 23.5004 3V11.6H12.4004V0.5ZM13.4004 1.5V10.6H22.5004V3C22.5004 2.17614 21.8242 1.5 21.0004 1.5H13.4004Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4004 12.3999H23.5004V20.9999C23.5004 22.376 22.3765 23.4999 21.0004 23.4999H12.4004V12.3999ZM13.4004 13.3999V22.4999H21.0004C21.8242 22.4999 22.5004 21.8238 22.5004 20.9999V13.3999H13.4004Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.5 12.3999H11.6V23.4999H3C1.62386 23.4999 0.5 22.376 0.5 20.9999V12.3999ZM1.5 13.3999V20.9999C1.5 21.8238 2.17614 22.4999 3 22.4999H10.6V13.3999H1.5Z"
        fill={color}
      />
    </svg>
  )
}

export const LeftMenuIcoMarkets = (props: Props) => {
  const { colors, active } = props
  const color = active ? colors.primary : colors.primaryText

  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.88235 4H3L3 7H6.88235L6.88235 4ZM3 3C2.44772 3 2 3.44772 2 4V7C2 7.55228 2.44771 8 3 8H6.88235C7.43464 8 7.88235 7.55228 7.88235 7V4C7.88235 3.44772 7.43464 3 6.88235 3H3ZM13.9409 4H10.0586V7H13.9409V4ZM10.0586 3C9.50631 3 9.05859 3.44772 9.05859 4V7C9.05859 7.55228 9.50631 8 10.0586 8H13.9409C14.4932 8 14.9409 7.55228 14.9409 7V4C14.9409 3.44772 14.4932 3 13.9409 3H10.0586ZM17.1172 4H20.9995V7H17.1172V4ZM16.1172 4C16.1172 3.44772 16.5649 3 17.1172 3H20.9995C21.5518 3 21.9995 3.44772 21.9995 4V7C21.9995 7.55228 21.5518 8 20.9995 8H17.1172C16.5649 8 16.1172 7.55228 16.1172 7V4ZM21 10H3V12H21V10ZM21 13H3V15H21V13ZM3 18V16H21V18H3ZM3 19V21H21V19H3ZM3 9C2.44772 9 2 9.44772 2 10V21C2 21.5523 2.44772 22 3 22H21C21.5523 22 22 21.5523 22 21V10C22 9.44772 21.5523 9 21 9H3Z"
        fill={color}
      />
    </svg>
  )
}

export const LeftMenuIcoNews = (props: Props) => {
  const { colors, active } = props
  const color = active ? colors.primary : colors.primaryText

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g fill="none" fillRule="evenodd">
        <g fill={color} fillRule="nonzero">
          <g>
            <g>
              <g>
                <path
                  d="M6.516 15.5H12c.3 0 .543.224.543.5s-.243.5-.543.5H6.516c-.3 0-.543-.224-.543-.5s.243-.5.543-.5zM6.516 3h13.683c.3 0 .543.224.543.5S20.5 4 20.2 4H6.516c-.3 0-.543-.224-.543-.5s.243-.5.543-.5zM14.715 15.5h5.484c.3 0 .543.224.543.5s-.243.5-.543.5h-5.484c-.3 0-.543-.224-.543-.5s.243-.5.543-.5zM6.516 5.5H12c.3 0 .543.224.543.5s-.243.5-.543.5H6.516c-.3 0-.543-.224-.543-.5s.243-.5.543-.5zM6.516 8H12c.3 0 .543.224.543.5S12.3 9 12 9H6.516c-.3 0-.543-.224-.543-.5s.243-.5.543-.5zM6.516 10.5H12c.3 0 .543.224.543.5s-.243.5-.543.5H6.516c-.3 0-.543-.224-.543-.5s.243-.5.543-.5zM6.516 13H12c.3 0 .543.224.543.5S12.3 14 12 14H6.516c-.3 0-.543-.224-.543-.5s.243-.5.543-.5zM14.715 13h5.484c.3 0 .543.224.543.5s-.243.5-.543.5h-5.484c-.3 0-.543-.224-.543-.5s.243-.5.543-.5zM14.715 5.5h5.484c.3 0 .543.224.543.5v5.05c0 .276-.243.5-.543.5h-5.484c-.3 0-.543-.224-.543-.5V6c0-.276.243-.5.543-.5zm.543 5.05h4.398V6.5h-4.398v4.05z"
                  transform="translate(-204 -208) translate(185 94) translate(19 114) translate(0 2)"
                />
                <path
                  d="M1.086 2.5h1.629V1c0-.551.487-1 1.086-1h19.113C23.513 0 24 .449 24 1v16c0 1.378-1.218 2.5-2.715 2.5H2.715C1.218 19.5 0 18.378 0 17V3.5c0-.551.487-1 1.086-1zm0 14.5c0 .827.73 1.5 1.629 1.5h18.57c.898 0 1.629-.673 1.629-1.5V1H3.801v15.25c0 .69-.61 1.25-1.358 1.25-.3 0-.543-.224-.543-.5s.244-.5.543-.5c.144.006.266-.106.272-.25V3.5H1.086V17z"
                  transform="translate(-204 -208) translate(185 94) translate(19 114) translate(0 2)"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export const LeftMenuIcoPositions = (props: Props) => {
  const { colors, active } = props
  const color = active ? colors.primary : colors.primaryText

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 29.047 30.044"
      height="100%"
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
    >
      <g transform="translate(29.047 15.732) rotate(135)">
        <path
          fill={color}
          d="M20.234,5.167a.564.564,0,0,0-.526-.6H1.789l3.15-3.561a.645.645,0,0,0,0-.837.48.48,0,0,0-.74,0L.154,4.746a.645.645,0,0,0,0,.837L4.2,10.155a.485.485,0,0,0,.745,0,.645.645,0,0,0,0-.837L1.793,5.757H19.716A.558.558,0,0,0,20.234,5.167Z"
          transform="translate(-0.702 11.217)"
        ></path>
        <path
          fill={color}
          d="M20.085,4.741,16.041.174a.481.481,0,0,0-.74,0,.645.645,0,0,0,0,.837l3.15,3.561H.526a.564.564,0,0,0-.526.6.564.564,0,0,0,.526.6H18.45L15.3,9.313a.645.645,0,0,0,0,.837.485.485,0,0,0,.745,0l4.044-4.572A.651.651,0,0,0,20.085,4.741Z"
        ></path>
      </g>
    </svg>
  )
}

export const LeftMenuIcoTrade = (props: Props) => {
  const { colors, active } = props
  const color = active ? colors.primary : colors.primaryText

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 0.5C3 0.223858 3.22386 0 3.5 0C3.77614 0 4 0.223858 4 0.5V5H5C5.55228 5 6 5.44772 6 6V18C6 18.5523 5.55228 19 5 19H4V23.5C4 23.7761 3.77614 24 3.5 24C3.22386 24 3 23.7761 3 23.5V19H2C1.44772 19 1 18.5523 1 18V6C1 5.44772 1.44772 5 2 5H3V0.5ZM3.5 18H5V6H3.5H2L2 18H3.5Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 5.5C10 5.22386 10.2239 5 10.5 5C10.7761 5 11 5.22386 11 5.5V7H12C12.5523 7 13 7.44772 13 8V14C13 14.5523 12.5523 15 12 15H11V22.5C11 22.7761 10.7761 23 10.5 23C10.2239 23 10 22.7761 10 22.5V15H9C8.44772 15 8 14.5523 8 14V8C8 7.44772 8.44772 7 9 7H10V5.5ZM10.5 14H12V8H10.5H9L9 14H10.5Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.0333 0.5H23.5V0.954741C23.5026 0.9842 23.5026 1.01385 23.5 1.04331V6C23.5 6.27614 23.2761 6.5 23 6.5C22.7239 6.5 22.5 6.27614 22.5 6V2.20808L17.3555 7.35258C17.1602 7.54784 16.8437 7.54784 16.6484 7.35258C16.4531 7.15731 16.4531 6.84073 16.6484 6.64547L21.7939 1.5H18C17.7239 1.5 17.5 1.27614 17.5 1C17.5 0.723858 17.7239 0.5 18 0.5H22.9706C22.9915 0.498698 23.0124 0.498698 23.0333 0.5Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.5 18.0443V18.498H23.0462C23.0168 18.5007 22.9871 18.5007 22.9577 18.498H18C17.7239 18.498 17.5 18.2742 17.5 17.998C17.5 17.7219 17.7239 17.498 18 17.498H21.7929L16.6484 12.3536C16.4531 12.1583 16.4531 11.8417 16.6484 11.6464C16.8437 11.4512 17.1602 11.4512 17.3555 11.6464L22.5 16.7909V12.998C22.5 12.7219 22.7239 12.498 23 12.498C23.2761 12.498 23.5 12.7219 23.5 12.998L23.5 17.9557C23.5026 17.9852 23.5026 18.0148 23.5 18.0443Z"
        fill={color}
      />
    </svg>
  )
}

export const LeftMenuIcoTutorial = (props: Props) => {
  const { colors, active } = props
  const color = active ? colors.primary : colors.primaryText

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <defs>
        <path id="fowu6jzo7a" d="M0 0H24V18.634H0z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <g>
          <g>
            <g>
              <g transform="translate(-204 -376) translate(185 94) translate(19 282) translate(0 3)">
                <g mask="url(#3uafn2ycab)">
                  <g>
                    <g fill={color} fillRule="nonzero">
                      <path
                        d="M22.93 5.202c-.04-.087-.108-.156-.195-.194L11.638.034c-.1-.045-.214-.045-.313 0L.227 5.009C.089 5.07 0 5.207 0 5.358c0 .151.089.288.227.35l3.6 1.612v6.84c0 .112.05.22.137.292 4.34 3.668 10.694 3.668 15.035 0 .086-.073.136-.18.136-.293V7.32l1.53-.685v6.644l-.573.86c-.126.188-.192.41-.192.636v.444c0 .633.514 1.147 1.148 1.147.634 0 1.148-.514 1.148-1.147v-.445c0-.227-.066-.448-.191-.637l-.574-.858V6.292l1.304-.585c.193-.086.28-.312.194-.505zm-4.56 8.778c-4.008 3.277-9.77 3.277-13.777 0V7.666l6.732 3.017c.1.045.213.045.313 0l6.732-3.019v6.316zm3.061 1.237c0 .212-.171.383-.382.383-.212 0-.383-.171-.383-.383v-.443c0-.076.022-.15.064-.212l.319-.479.318.477c.042.063.064.137.064.212v.445zm-.6-9.495l-9.32-.747c-.21-.017-.396.141-.413.352-.016.212.141.397.353.414l7.928.634-7.898 3.537L1.32 5.358 11.48.804l10.163 4.554-.813.364z"
                        transform="translate(.447 .717) translate(0 .029)"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export const LeftMenuIcoVideo = (props: Props) => {
  const { colors, active } = props
  const color = active ? colors.primary : colors.primaryText

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g fill="none" fillRule="evenodd">
        <g fill={color} fillRule="nonzero">
          <g>
            <g>
              <g>
                <path
                  d="M24 .368c0-.194-.157-.352-.352-.352H.352C.157.016 0 .174 0 .368v15.85c0 .454.703.454.703 0v-.683h22.594v3.058H.703v-.546c0-.454-.703-.454-.703 0v.898c0 .194.157.351.352.351h23.296c.195 0 .352-.157.352-.351V.368zM.703.72h22.594v14.103H.703V.72z"
                  transform="translate(-204 -292) translate(185 94) translate(19 198) translate(0 2)"
                />
                <path
                  d="M15.116 7.087L9.61 3.91c-.517-.298-1.185.092-1.185.684v6.357c0 .592.669.982 1.185.684l3.315-1.914c.393-.227.04-.836-.352-.61L9.26 11.026c-.072.025-.116 0-.13-.075V4.593c.014-.075.058-.1.13-.075l5.505 3.178c.058.05.058.1 0 .15l-.502.29c-.393.227-.041.836.351.61l.503-.29c.516-.298.516-1.07 0-1.369zM3.674 17.416c.143.382.511.656.943.656.432 0 .8-.274.943-.656h15.674c.454 0 .454-.704 0-.704H5.56c-.143-.382-.51-.656-.943-.656-.432 0-.8.274-.943.656h-.908c-.454 0-.454.704 0 .704h.908zm.943-.657c.168 0 .305.137.305.305 0 .168-.137.305-.305.305-.168 0-.304-.137-.304-.305 0-.168.136-.305.304-.305z"
                  transform="translate(-204 -292) translate(185 94) translate(19 198) translate(0 2)"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export const LeftMenuIcoRecentTrades = (props: Props) => {
  const { colors, active } = props
  const color = active ? colors.primary : colors.primaryText

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21 3H3V20H21V3ZM3 2C2.44772 2 2 2.44772 2 3V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V3C22 2.44772 21.5523 2 21 2H3Z"
        fill={color}
      />
      <rect x="3" y="11" width="18" height="1" fill={color} />
      <rect x="3" y="8" width="18" height="1" fill={color} />
      <rect x="3" y="5" width="18" height="1" fill={color} />
      <rect
        x="12"
        y="21"
        width="18"
        height="1"
        transform="rotate(-90 12 21)"
        fill={color}
      />
      <rect
        x="11"
        y="21"
        width="18"
        height="1"
        transform="rotate(-90 11 21)"
        fill={color}
      />
      <rect x="3" y="14" width="18" height="1" fill={color} />
      <rect x="3" y="17" width="18" height="1" fill={color} />
    </svg>
  )
}
