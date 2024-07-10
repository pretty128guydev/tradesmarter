/**
 * Implements a positions placeholder
 * You can see it if you don't have positions
 * accepts a color from parent to be able to styled
 */
import React from 'react'
import { t } from 'ttag'
import styled from 'styled-components'

const PlaceholderPanel = styled.div<any>`
  display: block;
  margin: ${(props) => (props.noOpen === 'tradebox' ? '10px' : '68px auto 0')};
  flex: ${(props) => props.noOpen === 'tradebox' && '1'};
  text-align: center;

  div {
    display: block;
    width: 45px;
    height: 45px;
    margin: 0 auto 10px;
  }
  span {
    margin-top: 10px;
    font-size: 12px;

    color: ${(props) => props.textColor};
  }
`

const Placeholder = ({ color, open, noOpen }: any) => (
  <>
    {noOpen === 'tradebox' && (
      <PlaceholderPanel textColor={color} noOpen="tradebox">
        <div>
          <svg
            enableBackground="new 0 0 60 60"
            viewBox="0 0 60 60"
            xmlns="http://www.w3.org/2000/svg"
            height="100%"
            width="100%"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
            fill={color}
          >
            <path d="m58.676 52.322-12.619-12.605c-1.495-1.495-3.787-1.703-5.517-.646l-6.916-6.909c3.084-3.419 4.979-7.927 4.979-12.88-.001-10.633-8.659-19.282-19.302-19.282s-19.301 8.649-19.301 19.282 8.658 19.282 19.301 19.282c4.966 0 9.484-1.899 12.908-4.987l6.896 6.889c-1.12 1.752-.921 4.165.603 5.616l12.61 12.597c1.706 1.702 4.493 1.787 6.245.109 1.806-1.731 1.982-4.7.113-6.466zm-56.675-33.04c0-9.528 7.761-17.281 17.301-17.281s17.301 7.752 17.301 17.281-7.761 17.281-17.301 17.281-17.301-7.753-17.301-17.281zm55.242 37.998c-.95 1.001-2.556.935-3.511-.019l-12.619-12.605c-2.179-2.347 1.246-5.803 3.531-3.525l12.638 12.625c1.02.966.924 2.561-.039 3.524z"></path>
            <path d="m10.551 20.637c-.552 0-1 .447-1 1v3.839c0 .553.448 1 1 1s1-.447 1-1v-3.839c0-.552-.448-1-1-1z"></path>
            <path d="m16.773 13.155c-.552 0-1 .447-1 1v11.322c0 .553.448 1 1 1s1-.447 1-1v-11.322c0-.553-.448-1-1-1z"></path>
            <path d="m22.995 16.362c-.552 0-1 .447-1 1v8.115c0 .553.448 1 1 1s1-.447 1-1v-8.115c.001-.553-.447-1-1-1z"></path>
            <path d="m29.217 12.086c-.552 0-1 .447-1 1v12.391c0 .553.448 1 1 1s1-.447 1-1v-12.391c.001-.553-.447-1-1-1z"></path>
          </svg>
        </div>
        <span>{t`No Open Positions`}</span>
      </PlaceholderPanel>
    )}
    {noOpen !== 'tradebox' && (
      <PlaceholderPanel textColor={color}>
        <div>
          <svg
            enableBackground="new 0 0 60 60"
            viewBox="0 0 60 60"
            xmlns="http://www.w3.org/2000/svg"
            height="100%"
            width="100%"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
            fill={color}
          >
            <path d="m58.676 52.322-12.619-12.605c-1.495-1.495-3.787-1.703-5.517-.646l-6.916-6.909c3.084-3.419 4.979-7.927 4.979-12.88-.001-10.633-8.659-19.282-19.302-19.282s-19.301 8.649-19.301 19.282 8.658 19.282 19.301 19.282c4.966 0 9.484-1.899 12.908-4.987l6.896 6.889c-1.12 1.752-.921 4.165.603 5.616l12.61 12.597c1.706 1.702 4.493 1.787 6.245.109 1.806-1.731 1.982-4.7.113-6.466zm-56.675-33.04c0-9.528 7.761-17.281 17.301-17.281s17.301 7.752 17.301 17.281-7.761 17.281-17.301 17.281-17.301-7.753-17.301-17.281zm55.242 37.998c-.95 1.001-2.556.935-3.511-.019l-12.619-12.605c-2.179-2.347 1.246-5.803 3.531-3.525l12.638 12.625c1.02.966.924 2.561-.039 3.524z"></path>
            <path d="m10.551 20.637c-.552 0-1 .447-1 1v3.839c0 .553.448 1 1 1s1-.447 1-1v-3.839c0-.552-.448-1-1-1z"></path>
            <path d="m16.773 13.155c-.552 0-1 .447-1 1v11.322c0 .553.448 1 1 1s1-.447 1-1v-11.322c0-.553-.448-1-1-1z"></path>
            <path d="m22.995 16.362c-.552 0-1 .447-1 1v8.115c0 .553.448 1 1 1s1-.447 1-1v-8.115c.001-.553-.447-1-1-1z"></path>
            <path d="m29.217 12.086c-.552 0-1 .447-1 1v12.391c0 .553.448 1 1 1s1-.447 1-1v-12.391c.001-.553-.447-1-1-1z"></path>
          </svg>
        </div>
        <span>{open ? t`No Open Positions` : t`No Closed Positions`}</span>
      </PlaceholderPanel>
    )}
  </>
)

export default Placeholder
