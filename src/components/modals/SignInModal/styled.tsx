import styled from 'styled-components'

const Modal = styled.div<any>`
  position: absolute;
  top: calc(50% - 200px);
  left: calc(50% - 190px);
  width: 380px;
  height: 405px;
  display: block;
  z-index: 9999;
`

const Contents = styled.form<any>`
  padding-top: 15px;
  height: 405px;
  position: relative;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 30px;
  background-color: ${(props) => props.backgroundColor};
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  overflow: hidden;
`

const Caption = styled.h2<{
  marginTop: number
  marginBottom: number
  color: string
}>`
  margin-top: ${(props) => props.marginTop}px;
  margin-bottom: ${(props) => props.marginBottom}px;
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
}
const SubmitButton = styled.button<any>`
  display: block;
  margin-top: 25px;
  min-width: 50%;
  width: ${(props) => props.width}%;
  max-width: 100%;
  height: 42px;
  line-height: 42px;

  border: none;
  outline: none;
  background: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

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
const FlexSubmitButton = styled.button<any>`
  flex: 1 1 auto;
  height: 42px;
  line-height: 42px;

  border: none;
  outline: none;
  background: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

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
const ButtonGroup = styled.div`
  margin-top: 8px;
  display: flex;
  height: 36px;
  line-height: 36px;

  #account_forgot {
    text-align: left;
  }
  #account_create {
    text-align: right;
  }
`
const TextButton = styled.a<any>`
  flex: 1 1 auto;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;

  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.08px;
  text-align: center;
  text-transform: uppercase;

  color: ${(props) => props.colors.primary};
  opacity: ${(props) => (props.disabled ? 0.3 : 1.0)};
`
const ContourButton = styled.a<any>`
  flex: 1 1 auto;
  height: 42px;
  line-height: 42px;
  text-align: center;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid ${(props) => props.colors.primary};

  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.08px;
  text-align: center;
  text-transform: uppercase;

  color: ${(props) => props.colors.primary};
  opacity: ${(props) => (props.disabled ? 0.3 : 1.0)};
`

const Paragraph = styled.p<any>`
  display: block;
  margin-top: 6px;
  margin-bottom: 25px;
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: -0.08px;
  color: ${(props) => props.colors.textfieldText};
`

const BlankSpace = styled.div`
  flex: 1 0 60%;
`
const BlankSpace30 = styled.div`
  flex: 1 1 auto;
`

const VerticalSpacer = styled.div`
  display: block;
  width: 100%;
  height: 25px;
`

const LoginStatusNotification = styled.div<{ colors: any; isError: boolean }>`
  @keyframes smooth-appear {
    to {
      bottom: 0;
      opacity: 1;
    }
  }

  position: absolute;
  left: 0;
  right: 0;
  bottom: -100%;
  opacity: 0;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 4px;
  background-color: ${(props) => props.colors.background};
  color: ${(props) =>
    props.isError
      ? props.colors.tradebox.lowNormal
      : props.colors.tradebox.highNormal};
  animation: smooth-appear 1s ease forwards;
  padding: 0 30px;
`

export {
  Modal,
  Contents,
  Caption,
  closeIconStyles,
  SubmitButton,
  FlexSubmitButton,
  ButtonGroup,
  TextButton,
  ContourButton,
  Paragraph,
  BlankSpace,
  BlankSpace30,
  VerticalSpacer,
  LoginStatusNotification,
}
