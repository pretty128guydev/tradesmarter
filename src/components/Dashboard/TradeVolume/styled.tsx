import styled from 'styled-components'

const DashboardTradeVolumeSpace = styled.div<{
  isMobile: boolean
}>`
  ${(props) => (props.isMobile ? '' : 'grid-area: tradeVolume')};
  display: grid;
  grid-template-columns: ${(props) =>
    props.isMobile ? '1fr' : ' 1fr 1fr 1fr 1fr'};
  grid-template-rows: ${(props) => (props.isMobile ? 'auto auto' : '244px')};
  column-gap: 2px;
  row-gap: 2px;
  grid-template-areas: ${(props) =>
    props.isMobile
      ? "'tradeVolumeChart' 'tradeVolumeInfo'"
      : "'tradeVolumeChart tradeVolumeChart tradeVolumeChart tradeVolumeInfo'"};
`

const TradeVolumeInfo = styled.div<{
  isMobile: boolean
}>`
  grid-area: tradeVolumeInfo;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 80px;
  row-gap: 2px;
`

const TradeVolumeChartSpace = styled.div<{
  colors: any
}>`
  grid-area: tradeVolumeChart;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 49px 195px;
  border-radius: 2px;
  background-color: ${(props) => props.colors.dashboardBackground};
`

export { DashboardTradeVolumeSpace, TradeVolumeChartSpace, TradeVolumeInfo }
