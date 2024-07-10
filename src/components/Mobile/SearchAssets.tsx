/**
 * Component which acts like a drawer but contains a positions item from sidebar
 */
import React from 'react'
import styled from 'styled-components'
import { ThemeContextConsumer } from '../ThemeContext'
import SearchAssetsPanel from './SearchAssetsPanel'

interface IDrawerProps {
  onClose: () => void
}

const Panel = styled.div<any>`
  position: fixed;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.colors.backgroundDefault};
  display: flex;
  flex-direction: column;
  z-index: 999;
`

const SearchAssets = (props: IDrawerProps) => (
  <ThemeContextConsumer>
    {(colors) => (
      <Panel colors={colors}>
        <SearchAssetsPanel onClose={props.onClose} />
      </Panel>
    )}
  </ThemeContextConsumer>
)

export default SearchAssets
