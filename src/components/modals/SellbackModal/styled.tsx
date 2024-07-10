import styled from 'styled-components'

const ModalHolder = styled.div<{ colors: any; x: number; y: number }>`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  z-index: 41;
  display: block;

  width: 210px;
  min-height: 252px;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);

  background-color: ${(props) => props.colors.modalBackground};
`
const Line = styled.div<{ colors: any }>`
  display: flex;
  height: 16px;
  line-height: 16px;
  margin-top: 12px;

  div,
  span,
  b {
    flex: 1 1 auto;
    letter-spacing: normal;
  }
  span {
    text-align: left;
    font-size: 12px;
    font-weight: normal;

    color: ${(props) => props.colors.secondaryText};
  }
  b,
  div {
    font-size: 12px;
    font-weight: normal;
    text-align: right;

    img {
      vertical-aling: top;
      margin-right: 10px;
    }
    color: ${(props) => props.colors.primaryText};
  }
`

const SellbackButton = styled.button<{ colors: any }>`
  border: none;
  outline: none;
  margin-top: 2px;
  margin-left: 15px;

  display: block;
  flex: 1 1 auto;
  height: 28px;
  line-height: 25px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.07px;
  text-align: center;
  border-radius: 2px;

  color: ${(props) => props.colors.primaryTextContrast};
  background: ${(props) => props.colors.primary};
  border: solid 1px ${(props) => props.colors.primary};
  cursor: pointer;
`
const Caption = styled.h2<{ colors: any }>`
  display: block;
  width: 100%;
  text-align: center;
  height: 34px;
  line-height: 34px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.07px;
  margin-top: 0;
  color: ${(props) => props.colors.primaryText};
  border-bottom: 1px solid ${(props) => props.colors.sidebarBorder};
`

const ReturnBlock = styled.div<{ colors: any }>`
  display: flex;
  margin-top: 12px;
  margin-bottom: 15px;
  width: 190px;
  height: 33px;
  line-height: 33px;
  border-radius: 2px;
  backdrop-filter: blur(2px);
  background-color: rgba(123, 138, 158, 0.2);
  color: ${(props) => props.colors.primaryText};

  div {
    padding-left: 10px;
    flex: 1 1 auto;
    text-align: left;
    font-size: 12px;
  }
  span {
    flex: 1 1 auto;
    text-align: right;
    font-size: 14px;
    font-weight: bold;
    padding-right: 10px;
  }
`

const ButtonsBlock = styled.div<any>`
  margin-top: 15px;
  display: flex;
  svg {
    flex: 0 0 30px;
  }
`

const Contents = styled.div<any>`
  display: block;
  margin: 10px auto;
  padding-left: 10px;
  padding-right: 10px;
`

export {
  ModalHolder,
  Line,
  SellbackButton,
  Caption,
  ReturnBlock,
  ButtonsBlock,
  Contents,
}
