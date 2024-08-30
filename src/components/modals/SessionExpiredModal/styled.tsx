import { Pointer } from 'highcharts'
import styled from 'styled-components'

const Modal = styled.div<any>`
  position: absolute;
  top: calc(50% - 200px);
  left: calc(50% - 190px);
  width: 380px;
  max-height: 405px;
  display: block;
  z-index: 9999;
`

const Contents = styled.div<any>`
  padding-top: 15px;
  padding-bottom: 15px;
  max-height: 405px;

  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 30px;
  background-color: ${(props) => props.backgroundColor};
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
`
const Paragraph = styled.p<{ colors: any }>`
  color: ${(props) => props.colors.primaryText};
`

const Caption = styled.h2<any>`
  margin-top: 0;
  margin-bottom: 35px;
  font-size: 20px;
  font-weight: bold;
  line-height: 1;
  letter-spacing: -0.12px;
  color: ${(props) => props.color};
`

const closeIconStyles = {
  position: 'absolute' as any,
  top: 24,
  right: 29,
  cursor: 'pointer'
}
const SubmitButton = styled.a<any>`
  display: block;
  margin-top: 25px;
  width: 100%;
  height: 42px;
  line-height: 42px;

  border: none;
  outline: none;
  background: none;
  cursor: pointer;

  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.09px;
  text-align: center;

  border-radius: 4px;
  text-transform: uppercase;
  background-color: ${(props) => props.colors.primary};
  color: ${(props) => props.colors.primaryTextContrast};
  opacity: ${(props) => (props.disabled ? 0.3 : 1.0)};
`

export { Modal, Contents, Caption, closeIconStyles, SubmitButton, Paragraph }
