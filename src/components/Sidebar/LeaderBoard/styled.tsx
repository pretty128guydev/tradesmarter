import styled from 'styled-components'

const LeaderBoardLists = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: -5px;
  height: 100%;
  overflow: auto;
`

const LeaderBoardHeader = styled.div<{ colors: any }>`
  display: flex;
  flex-direction: row;
  margin-bottom: 6px;
  margin-top: 15px;

  .rank {
    width: 40px;
    font-size: 11px;
    color: ${(props) => props.colors.secondaryText};
    margin-right: 10px;
    display: flex;
    justify-content: center;
  }

  .name {
    min-width: 100px;
    font-size: 11px;
    color: ${(props) => props.colors.secondaryText};
    margin-right: 10px;
  }

  .pnl {
    flex: 1;
    font-size: 11px;
    color: ${(props) => props.colors.secondaryText};
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
  }
`

const ItemContainer = styled.div<{ colors: any }>`
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.colors.background};
  margin-bottom: 5px;
  border-radius: 4px;

  .rank {
    width: 40px;
    height: 40px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    font-size: 16px;
    font-weight: 700;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1c2b35;
    margin-right: 10px;

    &.rank_1 {
      background: #ffcc00;
      color: #06141f;
    }

    &.rank_2 {
      background: #8491a3;
    }

    &.rank_3 {
      background: #a3804b;
    }
  }

  .name {
    display: flex;
    align-items: center;
    min-width: 100px;
    color: white;
    font-size: 12px;
    font-weight: 700;
    margin-right: 10px;
  }

  .pnl {
    flex: 1;
    color: ${(props) => props.colors.primaryText};
    font-size: 12px;
    font-weight: 700;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 20px;
  }
`

const TooltipContainer = styled.div<{ colors: any }>`
  display: flex;
  flex-direction: row;
  background-color: #06141f;
  border-radius: 4px;
  width: 285px;

  .rank {
    width: 40px;
    height: 40px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    font-size: 16px;
    font-weight: 700;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${(props) => props.colors.background};
    margin-right: 10px;

    &.rank_1 {
      background: #ffcc00;
      color: #06141f;
    }

    &.rank_2 {
      background: #8491a3;
    }

    &.rank_3 {
      background: #a3804b;
    }
  }

  .name {
    display: flex;
    align-items: center;
    min-width: 100px;
    color: white;
    font-size: 12px;
    font-weight: 700;
    margin-right: 10px;
  }

  .pnl {
    flex: 1;
    color: ${(props) => props.colors.primaryText};
    font-size: 12px;
    font-weight: 700;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 20px;
  }
`

export { LeaderBoardLists, LeaderBoardHeader, ItemContainer, TooltipContainer }
