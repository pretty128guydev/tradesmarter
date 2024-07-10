import React from 'react'
import { t } from 'ttag'
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import { actionSelectNextExpiry } from '../../actions/game'
import { isMobileLandscape } from '../../core/utils'

interface INextExpiryTime {
  colors: any
  actionSelectNextExpiry: () => void
  isMobile: boolean
}

const ExpiryBoxBackground = (props: any) => (
  <svg fill="none" height={405} width={295} {...props}>
    <rect fill="#0F1E2A" rx={3} height={28} width={46} y={44} x={11} />
    <rect fill="#0F1E2A" rx={3} height={28} width={46} y={44} x={113} />
    <rect fill="#0F1E2A" rx={3} height={28} width={46} y={44} x={62} />
    <rect fill="#0F1E2A" rx={3} height={28} width={56} y={44} x={164} />
    <rect fill="#0F1E2A" rx={3} height={28} width={56} y={44} x={225} />
    <rect fill="#0F1E2A" rx={5} height={35} width={270} y={152} x={11} />
    <rect fill="#0F1E2A" rx={3} height={35} width={270} y={197} x={11} />
    <rect fill="#0F1E2A" rx={3} height={35} width={35} y={3} x={11} />
    <rect fill="#0F1E2A" rx={3} height={35} width={35} y={3} x={246} />
    <rect fill="#0F1E2A" rx={3} height={35} width={190} y={3} x={51} />
    <path d="M25 20h8v2h-8z" fillOpacity={0.6} fill="#8B9097" />
    <path d="M259 20h10v2h-10z" fill="#5A626B" />
    <path d="M263 26V16h2v10z" fill="#5A626B" />
    <path
      strokeDasharray={2}
      stroke="#3A4856"
      d="M71.484 97.549H232M60.484 112.549H245M62.484 127.549H240"
      opacity={0.5}
    />
    <rect fill="#0F1E2A" rx={4} height={42} width={270} y={297} x={11} />
    <rect fill="#0F1E2A" rx={3} height={14} width={58} y={87} x={11} />
    <rect fill="#0F1E2A" rx={3} height={14} width={44} y={87} x={237} />
    <rect fill="#0F1E2A" rx={3} height={14} width={44} y={103} x={11} />
    <rect fill="#0F1E2A" rx={3} height={14} width={32} y={103} x={249} />
    <rect fill="#0F1E2A" rx={3} height={14} width={48} y={119} x={11} />
    <rect fill="#0F1E2A" rx={3} height={14} width={37} y={119} x={244} />
    <rect fill="#0F1E2A" rx={5} height={35} width={270} y={242} x={11} />
    <g filter="url(#a)" opacity={0.5}>
      <path d="M20 20h255v177H20z" fill="#1D2834" />
    </g>
    <defs>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height={217}
        width={295}
        y={0}
        x={0}
        id="a"
      >
        <feFlood result="BackgroundImageFix" floodOpacity={0} />
        <feBlend result="shape" in2="BackgroundImageFix" in="SourceGraphic" />
        <feGaussianBlur result="effect1_foregroundBlur" stdDeviation={10} />
      </filter>
    </defs>
  </svg>
)

const ExpiryBoxPanel = styled.div<{ colors: any; isMobile: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          width: calc(100% + 20px);
          @media (orientation: landscape) {
            width: 180px;
          }
        `
      : css`
          width: calc(100% - 10px);
        `};
  ${(props) => (props.isMobile ? 'left: -10px' : '')};
  height: 380px;
  z-index: 84;
  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          top: -30px;
          @media (orientation: landscape) {
            top: -10px;
          }
        `
      : ''};
  background-color: ${(props) =>
    props.isMobile
      ? 'rgba(0, 0, 0, 0.6)'
      : props.colors.tradebox.widgetBackground};
  ${(props) => (props.isMobile ? 'backdrop-filter: blur(8px)' : '')};

  svg {
    top: 30px;
    left: ${(props) => (props.isMobile ? '0' : '-11px')};
    position: relative;
  }

  .action {
    position: absolute;
    display: flex;
    justify-content: center;
    flex-direction: column;
    top: ${(props) => (props.isMobile ? '0' : '55px')};
    left: ${(props) => (props.isMobile ? '50%' : '29px')};
    transform: translate(${(props) => (props.isMobile ? 'calc(-50%)' : '0')});
    width: ${(props) => (props.isMobile ? '100%' : '213px')};
    ${(props) =>
      props.isMobile && isMobileLandscape(props.isMobile)
        ? css`
            padding: 26px;
            @media (orientation: landscape) {
              padding: 9px;
            }
          `
        : css`
            padding: 0;
          `};
    color: white;

    span {
      display: block;
      text-align: center;
      margin-bottom: ${(props) => (props.isMobile ? '6px' : '21px')};
      font-size: 14px;
      line-height: ${(props) => (props.isMobile ? '18px' : '20px')};
      color: #e7eaed;

      &:last-of-type {
        margin-bottom: ${(props) => (props.isMobile ? '20px' : '21px')};
      }
    }

    .next_expiry-button {
      display: block;
      margin: 0 auto 0;
      min-width: 164px;
      width: ${(props) => (props.isMobile ? '100%' : 'auto')};
      height: ${(props) => (props.isMobile ? '42px' : '28px')};
      line-height: ${(props) => (props.isMobile ? '42px' : '28px')};
      background: ${(props) => props.colors.primary};
      cursor: pointer;
      border-radius: 2px;
      color: ${(props) => props.colors.primaryTextContrast};
      text-transform: uppercase;
      box-sizing: border-box;
      font-size: ${(props) => (props.isMobile ? '16px' : '12px')};
      font-weight: 500;
      text-align: center;
    }
  }
`

const NextExpiryBox = (props: INextExpiryTime) => (
  <ExpiryBoxPanel colors={props.colors} isMobile={props.isMobile}>
    {!props.isMobile && <ExpiryBoxBackground colors={props.colors} />}
    <div className="action">
      <span>{t`It’s not possible to open a trade at this expiry time anymore, since the price is no longer in the range.`}</span>
      <span>{t`Pick another expiry time.`}</span>
      <div
        className="next_expiry-button"
        onClick={props.actionSelectNextExpiry}
      >{t`Next expiry time`}</div>
    </div>
  </ExpiryBoxPanel>
)

export default connect(null, { actionSelectNextExpiry })(NextExpiryBox)
