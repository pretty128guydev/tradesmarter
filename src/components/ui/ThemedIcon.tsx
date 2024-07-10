/**
 * Implements an icon which have painted contents
 */
import React, { Component } from 'react'
import axios from 'axios'

interface IThemedIconProps {
  stroke?: string
  fill?: string
  width?: number
  height?: number
  verticalAlign?: string
  src: string
  type?: string | undefined
}

export default class ThemedIcon extends Component<IThemedIconProps, any> {
  container: any

  constructor(props: IThemedIconProps) {
    super(props)
    this.state = {
      contents: null,
      error: false,
    }
    this.container = React.createRef()
  }

  componentDidCatch = () => {
    this.setState({ error: true })
  }

  async componentDidUpdate(
    prevProps: Readonly<IThemedIconProps>,
    prevState: Readonly<any>,
    snapshot?: any
  ) {
    if (prevProps.src !== this.props.src) {
      await this.getIcon()
    }
  }

  async componentDidMount() {
    await this.getIcon()
  }

  async getIcon() {
    try {
      const { data } = await axios.get(this.props.src)
      this.setState({ contents: data }, () => {
        const node = this.container.current
        if (node) {
          node.innerHTML = data
          const child = node.querySelector('svg')
          if (this.props.fill) {
            child.setAttribute('fill', this.props.fill)
          }
          if (this.props.stroke) {
            child.setAttribute('stroke', this.props.stroke)
          }
          if (this.props.width) {
            // node.style.width = this.props.width;
            child.setAttribute('width', this.props.width)
          }
          if (this.props.height) {
            // node.style.height = this.props.height;
            child.setAttribute('height', this.props.height)
          }
          if (this.props.verticalAlign) {
            child.style.verticalAlign = this.props.verticalAlign
          }
        }
      })
    } catch (err) {
      console.warn('Could not load icon:', err)
      this.setState({ error: true })
    }
  }

  render() {
    if (this.state.error) {
      return null
    }
    return (
      <div
        ref={this.container}
        style={{ display: 'flex', alignItems: 'center' }}
        className={
          this.props.type === 'avatar'
            ? 'themed_icon avatar-mobile'
            : 'themed_icon'
        }
      />
    )
  }
}
