/**
 * Component which acts like a drawer but contains a positions item from sidebar
 */
import React from 'react'
import styled from 'styled-components'
import { ThemeContextConsumer } from '../ThemeContext'
import HomeMenuPanel from './HomeMenuPanel'

interface IDrawerProps {
  mobileDrawers: any
  setActive: any
}

const Panel = styled.div<any>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.colors.background};
  display: flex;
  flex-direction: column;
  z-index: 999;
`

const HomeMenu = (props: IDrawerProps) => (
  <ThemeContextConsumer>
    {(colors) => (
      <Panel colors={colors}>
        <HomeMenuPanel
          colors={colors}
          isMobile={true}
          mobileDrawers={props.mobileDrawers}
          setActive={props.setActive}
        />
      </Panel>
    )}
  </ThemeContextConsumer>
)

export default HomeMenu
