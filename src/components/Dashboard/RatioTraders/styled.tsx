import styled from 'styled-components'

const DashboardRatioTradersSpace = styled.div<{
  colors: any
  isMobile: boolean
}>`
  ${(props) => (props.isMobile ? '' : 'grid-area: profitableTraders')};
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 49px 251px;
  border-radius: 2px;
  background-color: ${(props) => props.colors.dashboardBackground};
`

export { DashboardRatioTradersSpace }
