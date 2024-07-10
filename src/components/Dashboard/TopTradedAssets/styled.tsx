import styled from 'styled-components'

const DashboardTopTradedAssetsSpace = styled.div<{
  colors: any
  isMobile: boolean
}>`
  ${(props) => (props.isMobile ? '' : 'grid-area: topTradedAssets')};
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 49px 195px;
  border-radius: 2px;
  background-color: ${(props) => props.colors.dashboardBackground};
`

export { DashboardTopTradedAssetsSpace }
