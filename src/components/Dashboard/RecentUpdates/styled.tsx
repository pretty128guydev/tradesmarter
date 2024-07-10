import styled from 'styled-components'

const DashboardRecentUpdatesSpace = styled.div<{
  colors: any
  isMobile: boolean
}>`
  ${(props) => (props.isMobile ? '' : 'grid-area: recentUpdates')};
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 49px 251px;
  border-radius: 2px;
  background-color: ${(props) => props.colors.dashboardBackground};
`
const RecentUpdatesListSpace = styled.div<{
  colors: any
}>`
  overflow: auto;
`

const RecentUpdatesListTitle = styled.div<{
  colors: any
}>`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;
  color: ${(props) => props.colors.primaryText};
  padding: 10px 20px 0 20px;
`

const RecentUpdatesListDescription = styled.div<{
  colors: any
  expanded: boolean
}>`
  font-style: normal;
  font-weight: normal;
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: ${(props) => (props.expanded ? 'unset' : 2)};
  -webkit-box-orient: vertical;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.007692px;
  color: ${(props) => props.colors.secondaryText};
  padding: 5px 20px 0 20px;
`

const RecentUpdatesListMore = styled.button<{
  colors: any
}>`
  color: ${(props) => props.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
`

const RecentUpdatesListDate = styled.div<{
  colors: any
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.00641px;
  color: ${(props) => props.colors.leftPanel.textColor};
  padding: 8px 20px 10px 20px;
  border-bottom: 1px solid ${(props) => props.colors.panelBackground};
`

export {
  DashboardRecentUpdatesSpace,
  RecentUpdatesListSpace,
  RecentUpdatesListTitle,
  RecentUpdatesListDescription,
  RecentUpdatesListDate,
  RecentUpdatesListMore,
}
