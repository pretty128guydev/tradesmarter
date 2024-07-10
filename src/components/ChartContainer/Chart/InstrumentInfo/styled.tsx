import styled from 'styled-components'

const Panel = styled.div<any>`
  position: absolute;
  display: flex;
  font-size: 14px;
  font-weight: 900;
  color: ${(props) => props.colors.secondaryText};
  top: 46px;

  .tooltip-background {
    color: ${(props) => props.colors.secondaryText} !important;
    background-color: ${(props) => props.colors.background} !important;
  }
`

export { Panel }
