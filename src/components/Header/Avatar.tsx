/**
 * Handles case when we can't load image
 */
import React, { Component } from 'react'
import { isMobileLandscape, randomColor } from '../../core/utils'
import { ImgAvatar } from './styled'

interface IAvatarProps {
  src: string
  isMobile: boolean
  acronym: string
}

export default class Avatar extends Component<IAvatarProps, any> {
  constructor(props: IAvatarProps) {
    super(props)
    this.state = {
      error: false,
      acronymColor: randomColor(props.acronym),
    }
  }

  onError = () => this.setState({ error: true })

  render() {
    const { src } = this.props
    if (this.state.error) {
      return <div className="avatar_fallback" />
    }
    return (
      <>
        <ImgAvatar
          size={isMobileLandscape(this.props.isMobile) ? 30 : 40}
          content={this.props.acronym}
          color={this.state.acronymColor}
        >
          <img
            width={isMobileLandscape(this.props.isMobile) ? 30 : 40}
            height={isMobileLandscape(this.props.isMobile) ? 30 : 40}
            src={src}
            alt="avatar"
            style={{
              borderRadius: '50%',
            }}
            onError={this.onError}
          />
        </ImgAvatar>
        {isMobileLandscape(this.props.isMobile) && (
          <span style={{ marginLeft: 10, color: 'white', fontSize: 16 }}>
            ▾
          </span>
        )}
      </>
    )
  }
}
