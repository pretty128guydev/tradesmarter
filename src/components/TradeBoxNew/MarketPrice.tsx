import React from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { isMobileLandscape } from '../../core/utils'
import { lastPriceForSelectedInstrument } from '../selectors/instruments'

const MarketPricePanel = styled.div<any>`
  display: block;
  min-width: 270px;

  margin-top: 10px;
  margin-bottom: ${(props) => (props.isMobile ? 5 : 10)}px;

  height: 35px;
  line-height: 35px;

  opacity: 0.7;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.13px;
  text-align: center;
  color: ${(props) => props.colors.primary};

  border-radius: 3px;
  background-color: ${(props) => props.colors.tradebox.marketPrice};

  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            min-width: 160px;
          }
        `
      : css``}
`

const MarketPrice = (props: any) => (
  <MarketPricePanel isMobile={props.isMobile} colors={props.colors}>
    {props.lastPrice}
  </MarketPricePanel>
)

const mapStateToProps = (state: any) => ({
  lastPrice: lastPriceForSelectedInstrument(state),
})

export default connect(mapStateToProps)(MarketPrice)
