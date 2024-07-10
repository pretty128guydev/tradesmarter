import styled from 'styled-components'

const AssetsGroupsWrapper = styled.div`
  .scroll-container {
    display: flex;
    margin: 10px 0;
    overflow-x: auto;
  }
`

const AssetsGroupsItem = styled.div<{
  colors: any
  selected: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.colors.secondaryText};
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  cursor: pointer;
  background-color: ${(props) => props.colors.modalBackground};
  border-radius: 15px;
  height: 30px;
  margin: 0 8px 0 0;
  padding: 0 12px 0 8px;

  &:hover {
    color: ${(props) => props.colors.primaryText};
  }

  p {
    margin: 0;
    white-space: nowrap;

    &::first-letter {
      text-transform: uppercase;
    }
  }

  &:last-child {
    margin: 0;
  }
`

const AssetsGroupIconWrapper = styled.div<{
  colors: any
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  // background-color: ${(props) => props.colors.accentDefault};
  width: 24px;
  height: 24px;
  margin-right: 5px;
`

export { AssetsGroupsWrapper, AssetsGroupsItem, AssetsGroupIconWrapper }
