import styled, { css } from 'styled-components'
import { isMobileLandscape } from '../../../../core/utils'

export const PanelBox = styled.div<{ isMobile: boolean; colors: any }>`
  border-radius: 4px;
  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            margin-left: 10px !important;
          }
        `
      : css``}
`
