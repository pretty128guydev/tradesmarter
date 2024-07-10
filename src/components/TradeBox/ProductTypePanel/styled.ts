import styled, { css } from 'styled-components'
import { isMobileLandscape } from '../../../core/utils'

export const PanelContainer = styled.div<any>`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  min-width: 270px;
  height: 50px;
  margin-bottom: 10px;
  border-radius: 3px;
  background-color: ${(props) => props.colors.tradebox.widgetBackground};

  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            min-width: 160px;
          }
        `
      : css``}

  .product-label {
    font-size: 12px;
    font-weight: 700;
    color: ${(props) => props.colors.primaryText};
    margin-right: 35px;
  }
`

export const SelectProductPanel = styled.div<any>`
  width: 140px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.colors.primary};
  padding: 0 10px;
  border: 1px solid ${(props) => props.colors.primary};
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  background: ${(props) => props.colors.tradebox.fieldBackground};

  .product-name {
    font-size: 12px;
    font-weight: 700;
    margin-left: 10px;
    margin-right: 10px;
  }

  .arrow_down {
    color: ${(props) => props.colors.secondaryText};
    font-size: 20px;
  }

  svg {
    width: 24px;
  }

  .high-low-icon {
    path {
      fill: ${(props) => props.colors.primary};
    }
  }

  .options-icon {
    path {
      stroke: ${(props) => props.colors.primary};
    }

    rect {
      fill: ${(props) => props.colors.primary};
    }
  }

  .above-below-icon {
    path {
      stroke: ${(props) => props.colors.primary};
    }

    rect {
      fill: ${(props) => props.colors.primary};
    }
  }
`

export const ListProductContainer = styled.div<any>`
  position: absolute;
  bottom: ${(props) => (props.productItems === 3 ? '-82px' : '-41px')};
  left: 0;
  background: ${(props) => props.colors.tradebox.fieldBackground};
  z-index: ${(props) => props.zIndex};
  overflow-y: auto;
  border-radius: 4px;
`

export const ListProductItem = styled.div<any>`
  width: 140px;
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 14px;
  letter-spacing: normal;
  color: ${(props) => props.colors.secondaryText};
  cursor: pointer;
  padding: 0 10px;

  svg {
    width: 24px;
  }

  .high-low-icon {
    path {
      fill: ${(props) => props.colors.secondaryText};
    }
  }

  .options-icon {
    path {
      stroke: ${(props) => props.colors.secondaryText};
    }

    rect {
      fill: ${(props) => props.colors.secondaryText};
    }
  }

  .above-below-icon {
    path {
      stroke: ${(props) => props.colors.secondaryText};
    }

    rect {
      fill: ${(props) => props.colors.secondaryText};
    }
  }

  &:hover {
    color: ${(props) => props.colors.primary};

    .high-low-icon {
      path {
        fill: ${(props) => props.colors.primary};
      }
    }

    .options-icon {
      path {
        stroke: ${(props) => props.colors.primary};
      }

      rect {
        fill: ${(props) => props.colors.primary};
      }
    }

    .above-below-icon {
      path {
        stroke: ${(props) => props.colors.primary};
      }

      rect {
        fill: ${(props) => props.colors.primary};
      }
    }
  }
`

export const PanelSelection = styled.div<any>`
  display: inline-block;
  margin-left: 19px;
  font-weight: bold;
  letter-spacing: -0.2px;
  cursor: pointer;

  user-select: none;
  color: ${(props) => props.colors.primary};

  &.disabled {
    cursor: not-allowed;
    opacity: 0.3;
    pointer-events: none;
  }

  &:hover {
    opacity: 0.7;
  }
`

export const ListContainer = styled.div<{ colors: any; isMobile: boolean }>`
  position: relative;
  top: 0;
  left: 85px;
  z-index: 42;
  width: 171px;
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: ${(props) => props.colors.listBackgroundActive};
`
export const Items = styled.div`
  display: block;
`

export const ListItem = styled.div<any>`
  width: 100%;
  padding: 4px 12px;
  font-size: 14px;
  cursor: pointer;

  color: ${(props) => props.colors.textfieldText};
  background-color: ${(props) =>
    props.active ? props.colors.listBackgroundNormal : 'transparent'};

  &:hover {
    background-color: ${(props) =>
      props.colors.listBackgroundNormal} !important;
  }
`
