import React, { Component } from 'react'
import TradeBox from '../../TradeBox'
import {
  Overlay,
  Panel,
  Collapser,
  CollapserContainer,
  ClosePanelButton,
} from './styled'
import UserStorage from '../../../core/UserStorage'
import { connect } from 'react-redux'
import { getWalletCurrencySymbol } from '../../selectors/currency'
import { isCfdOptionsProductType } from '../../selectors/trading'

interface IMobileTradeBoxProps {
  colors: any
  isCfdOptions: boolean
  onClose: () => void
  oneClickTrade: boolean
  currencySymbol: string
}
interface IMobileTradeBoxState {
  dragging: boolean
  height: number
  maxHeight: number
}

const BASE_HEIGHT = 90
class MobileTradeBox extends Component<
  IMobileTradeBoxProps,
  IMobileTradeBoxState
> {
  constructor(props: IMobileTradeBoxProps) {
    super(props)
    const height = BASE_HEIGHT + this.getInitialHeight()
    this.state = {
      dragging: false,
      height,
      maxHeight: height,
    }

    setTimeout(() => {
      this.setState({
        height: this.getInitialHeight(),
      })
    }, 500)
  }

  getInitialHeight(): number {
    let height = this.props.isCfdOptions ? 207 : 192

    if (!this.isOneClickTrade()) {
      height += 64
    }

    if (!this.isBitcoin()) {
      height += 42
    }

    return height
  }

  isOneClickTrade(): boolean {
    return UserStorage.getOneClickTrade() ?? this.props.oneClickTrade
  }

  isBitcoin(): boolean {
    return this.props.currencySymbol === 'Ƀ'
  }

  onTouchStart = () => {
    this.setState({
      dragging: true,
      maxHeight: BASE_HEIGHT + this.getInitialHeight(),
    })
  }

  onTouchMove = (e: any) => {
    if (this.state.dragging) {
      const touch = e.changedTouches[0]
      if (touch) {
        const target = window.innerHeight - touch.clientY
        const height = Math.min(target, this.state.maxHeight)
        this.setState({ height })
      }
    }
  }

  onTouchEnd = () => {
    let { height } = this.state
    if (height < 30) {
      this.props.onClose()
    }

    this.setState({
      dragging: false,
      height,
    })
  }

  onKeyboardToggled = (val: boolean): void => {
    if (val) {
      this.setState({
        dragging: false,
        height: 393,
      })
    } else {
      this.setState({
        dragging: false,
        height: this.getInitialHeight(),
        maxHeight: BASE_HEIGHT + this.getInitialHeight(),
      })
    }
  }

  render = () => {
    return (
      <>
        <Overlay onClick={() => this.props.onClose()} />
        <Panel
          colors={this.props.colors}
          height={this.state.height}
          dragging={this.state.dragging}
        >
          <ClosePanelButton
            onClick={() => this.props.onClose()}
            colors={this.props.colors}
          />
          <CollapserContainer
            onTouchStart={this.onTouchStart}
            onTouchMove={this.onTouchMove}
            onTouchEnd={this.onTouchEnd}
            onTouchCancel={this.onTouchEnd}
          >
            <Collapser colors={this.props.colors} />
          </CollapserContainer>
          <TradeBox
            isMobile={true}
            onKeyboardOpened={this.onKeyboardToggled}
            mobileTradeHeight={this.state.height}
            setActive={() => {}}
          />
        </Panel>
      </>
    )
  }
}

const mapStateToProps = (state: any) => ({
  isCfdOptions: isCfdOptionsProductType(state),
  oneClickTrade: state.registry.data.partnerConfig.oneClickTrade,
  currencySymbol: getWalletCurrencySymbol(state),
})

export default connect(mapStateToProps)(MobileTradeBox)
