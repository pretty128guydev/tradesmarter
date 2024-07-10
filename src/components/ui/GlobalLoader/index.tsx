/**
 * Implements a global loader from bpFxCfd
 * Uses bodymovin library which contains definition
 */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createGlobalStyle } from 'styled-components'
import * as bodymovin from 'bodymovin'
import './styles.scss'

interface IGlobalLoaderProps {
  theme: any
  zIndex?: number
  top?: number
}

const GlobalStyle = createGlobalStyle<{ color: string }>`
	.bg-loader-container svg path {
    	fill: ${(props) => props.color};
	}
`

/**
 * Keep in mind:
 * Default zIndex for GlobalLoader is 100 (to overlay all stuff except theme editor)
 * Should be reduced for chart to 40
 */
const GlobalLoader = ({ theme, zIndex, top }: IGlobalLoaderProps) => {
  useEffect(() => {
    bodymovin.loadAnimation({
      container: document.getElementById('mainLoader'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('./data.json'),
    })
    bodymovin.play()

    return () => {
      bodymovin.stop()
    }
  }, [])

  const styles = {
    backgroundColor: theme.background,
    zIndex: zIndex || 100,
    top: top || 0,
  }

  return (
    <div className="bg-loader-container" style={styles}>
      <GlobalStyle color={theme.primary} />
      <div className="main-loader" id="mainLoader" />
    </div>
  )
}

const mapStateToProps = (state: any) => ({ theme: state.theme })

export default connect(mapStateToProps)(GlobalLoader)
