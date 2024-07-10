import styled from 'styled-components'

const AssetsSearchWrapper = styled.div<{
  colors: any
}>`
  .title-container {
    display: flex;
    flex: 1;
    padding: 5px 0;
    margin-right: 5px;
    justify-content: space-between;
    align-items: center;

    .title {
      color: ${(props) => props.colors.secondaryText};
      text-transform: uppercase;
      font-size: 15px;
      font-weight: 600;
    }
  }

  .input-container {
    display: flex;
    flex: 1;
    border-bottom: 1px solid ${(props) => props.colors.textfieldText};
    padding: 5px 0;
    margin-right: 8px;
  }

  .icon-full-mode {
    margin-bottom: -15px;
    margin-right: 5px;
    cursor: pointer;
  }
`

const AssetsSearchInput = styled.input<{
  colors: any
}>`
  width: 100%;
  background-color: transparent;
  border: unset;
  font-size: 14px;
  color: ${(props) => props.colors.primaryText};

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${(props) => props.colors.textfieldText};
    font-size: 12px;
  }
`

export { AssetsSearchWrapper, AssetsSearchInput }
