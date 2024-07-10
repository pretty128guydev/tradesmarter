import React from 'react'
import { connect } from 'react-redux'
import './index.scss'
import classNames from 'classnames'
import { convertHexToRGBA } from '../../../../core/utils'
import SoundOff from './soundOff'
import SoundOn from './soundOn'
import { actionSetShowConfetti } from '../../../../actions/container'
import UserStorage from '../../../../core/UserStorage'

interface ISoundSwitchProps {
  showConfetti: boolean
  actionSetShowConfetti: (showConfetti: boolean) => void
  colors: any
}

const SoundSwitch = (props: ISoundSwitchProps) => {
  return (
    <div
      className="sound-switch-container"
      style={{ backgroundColor: props.colors.panelBackground }}
    >
      <div className="sound-off-container">
        <SoundOff size={16} color={props.colors.primaryText} />
      </div>
      <div
        className={classNames({
          'switch-checkbox': true,
          'switch-checked': props.showConfetti,
        })}
        onClick={() => {
          props.actionSetShowConfetti(!props.showConfetti)
          UserStorage.setSoundConfig(props.showConfetti ? 'off' : 'on')
        }}
      >
        <div
          className="switch-checkbox-background"
          style={{
            backgroundColor: props.colors.sidebarLabelText,
          }}
        ></div>
        <div
          className="switch-checkbox-toggler"
          style={{
            backgroundColor: props.showConfetti
              ? props.colors.primary
              : props.colors.primaryText,
          }}
        ></div>
      </div>
      <div className="sound-on-container">
        <SoundOn size={16} color={props.colors.primaryText} />
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  showConfetti: state.container.showConfetti,
})

export default connect(mapStateToProps, {
  actionSetShowConfetti,
})(SoundSwitch)
