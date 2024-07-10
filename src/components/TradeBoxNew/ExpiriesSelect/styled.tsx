import styled from 'styled-components'

const ExpiriesContainer = styled.div<any>`
  display: flex;
  box-sizing: border-box;
  height: 36px;
  margin-top: 6px;
  border-radius: 2px;
  background: ${(props) => props.colors.tradebox.fieldBackground};

  .button-container {
    width: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }

  .currency-container {
    width: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.colors.primaryText};
  }
`

const ExpiryItemBox = styled.div<{
  colors: any
  isMobile: boolean
}>`
  flex: 1;
  display: flex;
  flex-direction: row;
  height: 100%;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  position: relative;
  justify-content: ${(props) => (props.isMobile ? 'center' : 'flex-end')};

  // &:hover {
  //   border-color: ${(props) => props.colors.primary};
  // }

  .expiration {
    flex: 0.53;
    display: flex;
    justify-content: ${(props) => (props.isMobile ? 'center' : 'flex-end')};
    align-items: center;
    font-size: 16px;
    color: ${(props) => props.colors.primaryText};

    .trades_count {
      display: inline-block;
      min-width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      font-size: 14px;
      border-radius: 50%;
      border: 1px solid ${(props) => props.colors.primary};
      margin-left: 4px;
      padding: 0 2px;
    }
  }

  .expiry_payout_container {
    flex: 0.47;
    justify-content: flex-start;
    display: flex;
    padding-left: 5px;

    .expiry_payout {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      letter-spacing: 0.13px;
      height: 100%;
      color: ${(props) => props.colors.sidebarLabelText};
    }
  }

  .expiry-time-container {
    position: absolute;
    top: 0;
    right: 10px;
  }

  .cursor-pointer {
    cursor: pointer;
  }
`

export { ExpiriesContainer, ExpiryItemBox }
