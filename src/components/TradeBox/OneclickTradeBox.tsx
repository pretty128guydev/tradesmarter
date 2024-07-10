/**
 * Implements one click trade button
 */

import React from 'react'
import styled from 'styled-components'
import Knob from '../AccountBar/Knob'
import { t } from 'ttag'

interface IOneClickTradeBox {
  active: boolean
  colors: any
  isMobile: boolean
  onChange: (newState: boolean) => void
}

const Box = styled.div<{ colors: any; active: boolean; isMobile: boolean }>`
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: center;

  span {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    margin-right: 5px;
    line-height: 19px;
    letter-spacing: 0.1px;
    color: ${(props) =>
      props.active
        ? props.colors.primaryText
        : props.colors.tradebox.oneClickTradeText};
  }
`

const OneClickTradeBox = (props: IOneClickTradeBox) => (
  <Box colors={props.colors} active={props.active} isMobile={props.isMobile}>
    <span>{t`One-click Trade`}</span>
    <Knob
      backgroundColor={
        props.active
          ? props.colors.primaryText
          : props.colors.tradebox.oneClickTradeText
      }
      pinColor={props.active ? props.colors.primary : props.colors.primaryText}
      knobOnLeft={!props.active}
      onChange={(e) => props.onChange(!e)}
    />
  </Box>
)

export { OneClickTradeBox }
