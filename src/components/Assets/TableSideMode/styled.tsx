import styled from 'styled-components'

const AssetsTableSpace = styled.table`
  display: flex;
  flex-direction: column;
  padding: 2px;
  border-spacing: 0;
  overflow: auto;
`

const AssetsTableTHead = styled.thead`
  display: table;
  table-layout: fixed;
  width: 100%;
  padding-right: 8px;
`

const AssetsTableTBody = styled.tbody<{ maxHeight: number }>`
  display: block;
  height: inherit;
  overflow: auto;
  max-height: ${(props) => `calc(100vh - ${props.maxHeight}px)`};
  position: relative;
`

const AssetsTableRow = styled.tr`
  display: table;
  table-layout: fixed;
  width: 100%;

  &:hover .fav-icon-container {
    visibility: visible !important;
  }

  .fav-icon-container {
    visibility: hidden;
  }
`

const AssetsTableHeader = styled.th<{
  colors: any
  alignRight?: boolean
  alignCenter?: boolean
  width: string
}>`
  font-style: normal;
  font-weight: 900;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.2px;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${(props) => props.width};
  color: ${(props) => props.colors.primary};
  border-bottom: 1px solid ${(props) => props.colors.panelBorder};

  div {
    padding-right: 5px;
    text-align: ${(props) => {
      if (props.alignRight) {
        return 'right'
      }
      if (props.alignCenter) {
        return 'center'
      }
      return 'left'
    }};
  }
`

const AssetsTableColumn = styled.td<{
  colors: any
  width: string
  alignRight?: boolean
  alignCenter?: boolean
  color?: string
  disabled?: boolean
  bold?: boolean
  hideOverflow?: boolean
}>`
  font-style: normal;
  font-size: 14px;
  line-height: 30px;
  letter-spacing: -1px;
  white-space: nowrap;
  color: ${(props) =>
    props.color && !props.disabled ? props.color : props.colors.secondaryText};
  border-bottom: 1px solid ${(props) => props.colors.panelBorder};
  width: ${(props) => props.width};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};

  > div:not(.fav-icon-container) {
    overflow: hidden;
    text-overflow: ${(props) => (props.hideOverflow ? 'unset' : 'ellipsis')};
    cursor: pointer;
    padding-right: 5px;
    text-align: ${(props) => {
      if (props.alignRight) {
        return 'right'
      }
      if (props.alignCenter) {
        return 'center'
      }
      return 'left'
    }};
  }

  img {
    transform: translateY(4px);
    margin-right: 10px;
    width: 16px;
    height: 16px;
    align-self: center;
  }
`

const AssetsTableHoverItem = styled.span<{ colors: any }>`
  display: block;
  color: ${(props) => props.colors.textfieldText};

  &:hover {
    color: ${(props) => props.colors.primary};
    border-bottom: ${(props) => `3px solid ${props.colors.primary}`};
    padding-bottom: 3px;
  }
`

const AssetsTableChange = styled.div`
  display: flex;
  align-items: center;

  span {
    width: 50px;
  }

  div {
    width: calc(100% - 50px);
  }
`

export {
  AssetsTableSpace,
  AssetsTableRow,
  AssetsTableHeader,
  AssetsTableColumn,
  AssetsTableTHead,
  AssetsTableTBody,
  AssetsTableChange,
  AssetsTableHoverItem,
}
