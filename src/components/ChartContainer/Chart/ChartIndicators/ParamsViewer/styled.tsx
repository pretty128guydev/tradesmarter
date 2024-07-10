import styled from 'styled-components'

const ParamsContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 210px;
  margin-bottom: 20px;
  overflow-y: auto;
`

const ParamContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? 'column' : 'row')};
`

const ParamLabel = styled.div`
  width: 50%;
  margin-right: 20px;
  font-size: 14px;
`

const ParamInput = styled.input<{ colors: any }>`
  padding: 0 10px;
  margin: 5px 0;
  height: 30px;
  font-size: 14px;
  text-align: right;
  outline: none;
  border: none;
  background-color: ${(props) => props.colors.textfieldBackground};
  color: ${(props) => props.colors.primaryText};
`

const ArrayContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export {
  ParamsContainer,
  ParamContainer,
  ParamLabel,
  ParamInput,
  ArrayContainer,
}
