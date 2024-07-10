import styled from 'styled-components'

const DashboardCardWrapper = styled.div<{
  colors: any
}>`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.colors.dashboardBackground};
  border-radius: 2px;
  padding: 15px 20px;
  overflow: auto;
  justify-content: space-between;
`

const DashboardCardTitle = styled.div<{
  colors: any
  bottomBorder?: boolean
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 20px;
  color: ${(props) => props.colors.primaryText};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.0941177px;

  ${(props) =>
    props.bottomBorder
      ? `border-bottom: 1px solid ${props.colors.panelBackground}`
      : ''};
`

const DashboardCardFooter = styled.button<{
  colors: any
}>`
  color: ${(props) => props.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  width: max-content;
  padding: 0 20px;
  justify-self: end;

  &:hover {
    text-decoration: underline;
  }
`

const DashboardCardName = styled.div<{
  colors: any
}>`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: -0.233333px;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => props.colors.textfieldText};
`

const DashboardCardValue = styled.div<{
  color: any
}>`
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 26px;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => props.color};
`

const DashboardWrapper = styled.div<{
  colors: any
  isMobile: boolean
}>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.isMobile
      ? 'repeat(auto-fit, calc(100vw - 40px))'
      : '1fr 1fr 1fr 1fr 1fr 1fr'};
  grid-template-rows: ${(props) =>
    props.isMobile ? 'auto' : 'min-content 244px 300px'};
  column-gap: 10px;
  row-gap: 10px;
  position: absolute;
  z-index: 30;
  inset: 0px;

  ${(props) =>
    props.isMobile
      ? ''
      : "grid-template-areas: 'cash cash cash bonus bonus bonus' 'topTradedAssets topTradedAssets tradeVolume tradeVolume tradeVolume tradeVolume''recentUpdates recentUpdates recentTrades recentTrades recentTrades profitableTraders'"};

  overflow: auto;
  width: 100%;
  padding: ${(props) =>
    props.isMobile ? '0 20px 20px 20px' : '20px 35px 20px 20px'};
  ${(props) => (props.isMobile ? 'margin-top: 50px' : '')};
  background-color: ${(props) => props.colors.panelBackground};
`

export {
  DashboardWrapper,
  DashboardCardName,
  DashboardCardValue,
  DashboardCardWrapper,
  DashboardCardTitle,
  DashboardCardFooter,
}
