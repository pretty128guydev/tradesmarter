import React from 'react'
import { t } from 'ttag'
import styled from 'styled-components'

const FieldGroupContainer = styled.div<any>`
  margin-top: 8px;
  padding-bottom: 24px;
  display: block;
  position: relative;
`
const FieldLabel = styled.label<any>`
  display: block;
  height: 12px;
  line-height: 12px;
  font-size: 12px;
  letter-spacing: 0.1px;
  color: ${(props) => props.color};
`
const StyledInput = styled.input<any>`
  display: block;
  width: 100%;
  margin-top: 12px;
  height: 42px;
  line-height: 42px;
  padding: 15px 12px;
  border-radius: 3px;
  box-sizing: border-box;
  // opacity: 0.5;
  font-size: 16px;
  letter-spacing: 0.13px;
  background-color: ${(props) => props.theme.textfieldBackground};
  border: ${(props) => (props.valid ? 'none' : '1px solid #61253a')};
  outline: none;
  // color: ${(props) => props.theme.textfieldText};

  // &:active {
  // opacity: 1.0;
  color: ${(props) => props.theme.primaryText};
  // }
`
const ValidationMessage = styled.span<any>`
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.1px;
  color: #ffffff;
`

const labels: any = {
  email: t`Email address`,
  password: t`Password`,
}

const placeholders: any = {
  email: t`Enter your email address`,
  password: t`Enter your password`,
}

const validations: any = {
  email: t`Please enter valid email address`,
  password: t`Please enter your password`,
}

interface IFieldGroupProps {
  klass: string
  value: any
  valid: boolean
  theme: any
  onChange: (value: string) => void
  onTouched: () => void
}

const FieldGroup = ({
  klass,
  onChange,
  onTouched,
  value,
  valid,
  theme,
}: IFieldGroupProps) => (
  <FieldGroupContainer>
    <FieldLabel htmlFor={klass} color={theme.secondaryText}>
      {labels[klass]}
    </FieldLabel>
    <StyledInput
      name={klass}
      theme={theme}
      type={klass}
      value={value}
      valid={valid}
      placeholder={placeholders[klass]}
      onChange={(e: any) => onChange(e.target.value)}
      onFocus={() => onTouched()}
    />
    {!valid && <ValidationMessage>{validations[klass]}</ValidationMessage>}
  </FieldGroupContainer>
)

export default FieldGroup
