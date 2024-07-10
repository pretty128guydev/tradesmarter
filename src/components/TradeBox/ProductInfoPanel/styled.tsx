import styled, { css } from 'styled-components'
import { isMobileLandscape } from '../../../core/utils'

export const PanelContainer = styled.div<any>`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  border-radius: 3px;
  background-color: ${(props) => props.colors.tradebox.widgetBackground};

  .instrument-image {
    width: 40px;
    height: 40px;
  }

  .instrument-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    justify-content: space-between;

    .instrument-name {
      font-size: 16px;
      font-weight: 700;
      line-height: 13px;
      color: ${(props) => props.colors.secondaryText};
    }
    .instrument-price-container {
      display: flex;
      align-items: flex-end;

      ${(props) =>
        props.isMobile && isMobileLandscape(props.isMobile)
          ? css`
              @media (orientation: landscape) {
                margin-top: 4px;
                flex-direction: column;
                align-items: flex-start;
              }
            `
          : css``}

      .instrument-price {
        font-size: 16px;
        font-weight: 500;
        line-height: 16px;
        color: ${(props) => props.colors.primaryText};
        margin-right: 20px;
        position: relative;

        .instrument-price-big {
          font-size: 22px;
        }

        .instrument-price-small {
          font-size: 14px;
          position: absolute;
          top: -5px;
        }
      }
    }
  }
`
