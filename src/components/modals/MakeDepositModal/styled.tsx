import styled, { css } from 'styled-components'
import { isMobileLandscape } from '../../../core/utils'

const Modal = styled.div<any>`
  position: absolute;
  top: calc(50% - 200px);
  left: ${(props) =>
    !props.isMobile || isMobileLandscape(props.isMobile)
      ? 'calc(50% - 255px)'
      : '20px'};
  ${(props) =>
    !props.isMobile || isMobileLandscape(props.isMobile)
      ? css`
          width: 510px;
        `
      : css`
          right: 20px;
        `};
  padding-top: 15px;
  padding-bottom: 15px;
  max-height: 405px;
  display: block;
  z-index: 41;
`

const Contents = styled.div<any>`
  padding: 40px 30px;
  max-height: 405px;
  box-sizing: border-box;
  background-color: ${(props) => props.backgroundColor};
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  position: relative;
`

const Caption = styled.h2<any>`
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.12px;
  color: ${(props) => props.color};
`

const SubCaption = styled.h3<any>`
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.12px;
  color: ${(props) => props.color};
  padding-right: 50px;
`

const SubmitButton = styled.a<any>`
  display: block;
  margin-top: 25px;
  height: 42px;
  line-height: 42px;
  padding: 0 20px;
  width: 240px;

  border: 1px solid ${(props) => props.colors.primary};
  outline: none;
  background: none;
  cursor: pointer;

  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.09px;
  text-align: center;

  border-radius: 4px;
  text-transform: uppercase;
  color: ${(props) => props.colors.primary};
  opacity: ${(props) => (props.disabled ? 0.3 : 1.0)};
`

export { Modal, Contents, Caption, SubCaption, SubmitButton }
