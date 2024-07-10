import styled, { css } from 'styled-components'

export const TypeItemContainer = styled.div<{
  isSelected: boolean
  isDisabled: boolean
  colors: any
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 110px;
  height: 30px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 6px;
  background: ${(props) => props.colors.tradebox.widgetBackground};
  color: ${(props) =>
    props.isSelected ? props.colors.primary : props.colors.secondaryText};
  cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.isDisabled ? '0.3' : '1')};
  pointer-events: ${(props) => (props.isDisabled ? 'none' : 'unset')};
  ${(props) =>
    props.isSelected
      ? css`
          border: 1px solid ${props.colors.primary};
        `
      : css``}
`

export const TypeCaption = styled.span`
  font-size: 12px;
  font-weight: 700;
`
