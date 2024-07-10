import styled from 'styled-components'
import arrowLeftNormal from './icon-ico-arrow-left.svg'
import arrowRightNormal from './icon-ico-arrow-right.svg'
import arrowLeftActive from './icon-ico-arrow-left-white.svg'
import arrowRightActive from './icon-ico-arrow-right-white.svg'

const Panel = styled.div<any>`
  flex: 0 0 40px;

  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: -0.23px;
  color: #8491a3;
  border-bottom: 1px solid ${(props) => props.colors.panelBorder};
  background-color: ${(props) => props.colors.tradebox.widgetBackground};
`

const InstrumentCaption = styled.div<{
  selected: boolean
  colors: any
}>`
  display: inline-flex;
  align-items: center;
  padding: 10px;
  min-width: 120px;
  text-align: center;
  border-right: 1px solid ${(props) => props.colors.panelBorder};
  text-transform: uppercase;
  cursor: pointer;
  overflow: hidden;
  color: ${(props) => (props.selected ? props.colors.primaryText : '#8491a3')};

  fill: ${(props) => (props.selected ? props.colors.primaryText : '#8491a3')};

  &:hover {
    color: ${(props) => props.colors.primaryText};
    fill: ${(props) => props.colors.primaryText};
  }
`

const InstrumentTop = styled.div`
  display: flex;
  align-items: center;

  img {
    visibility: hidden;
  }
`

/**
 * Implements an Instrument container which accepts selected and isOpen state
 */
const Instrument = styled.div<{
  selected: boolean
  isOpen: boolean
  colors: any
}>`
  display: block;
  float: left;
  min-width: 120px;
  max-width: 250px;
  text-align: center;
  border-right: 1px solid ${(props) => props.colors.panelBorder};
  text-transform: uppercase;
  cursor: ${(props) => (props.selected ? 'default' : 'pointer')};
  overflow: hidden;
  padding: 0 8px;

  opacity: ${(props) => (props.selected ? 1.0 : props.isOpen ? 1.0 : 0.3)};
  background-color: ${(props) =>
    props.selected ? props.colors.background : 'transparent'};
  color: ${(props) =>
    props.selected ? props.colors.primaryText : props.colors.secondaryText};

  &:hover {
    ${InstrumentTop} img {
      visibility: visible;
    }
  }

  .asset_icon {
    flex: 0 0 24px;
    height: 40px;
    padding: 8px 0;
    vertical-align: middle;
  }
  span {
    flex: 1 1 auto;
    height: 40px;
    user-select: none;
    line-height: 40px;
    margin: 0 8px 0 10px;
  }
  svg {
    flex: 0 0 16px;
    width: 16px;
    height: 40px;
  }
`
const Arrow = styled.div`
  position: absolute;
  top: 0;
  display: inline-block;
  width: 30px;
  height: 100%;
  text-align: center;
  user-select: none;
  cursor: pointer;
`
const ArrowLeft = styled(Arrow)<any>`
  left: 0;
  background: url(${arrowLeftNormal}) no-repeat center;
  border-right: 1px solid ${(props) => props.colors.panelBorder};

  &:active {
    background: ${(props) => props.colors.background} url(${arrowLeftActive})
      no-repeat center;
  }
`
const ArrowRight = styled(Arrow)<any>`
  right: 0;
  background: url(${arrowRightNormal}) no-repeat center;
  border-left: 1px solid ${(props) => props.colors.panelBorder};

  &:active {
    background: ${(props) => props.colors.background} url(${arrowRightActive})
      no-repeat center;
  }
`
const FlexWrapper = styled.div`
  display: flex;
`
const InstrumentsContainer = styled.div`
  flex: 1 1 auto;
  position: relative;
`

const InstrumentsHolder = styled.div`
  display: block;
  position: absolute;
  top: 0;
  left: 30px;
  right: 30px;
  bottom: 0;
  overflow: hidden;
  white-space: nowrap;
`

const Instruments = styled.div<any>`
  min-width: ${(props) => props.width}px;

  &:after {
    display: block;
    content: ' ';
    clear: both;
  }
`

export {
  Panel,
  InstrumentCaption,
  InstrumentsHolder,
  Instrument,
  Arrow,
  ArrowLeft,
  ArrowRight,
  FlexWrapper,
  InstrumentsContainer,
  Instruments,
  InstrumentTop,
}
