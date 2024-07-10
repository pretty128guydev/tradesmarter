import React, { FC, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { t } from 'ttag'
import { actionSetCfdSentimentSelectedOption } from '../../../actions/trading'
import Backdrop from '../../Backdrop'
import { isMobileLandscape } from '../../../core/utils'

const SwitcherContainer = styled.div<any>`
  // box-shadow: 0px 100px 80px rgba(0, 0, 0, 0.21),
  //   0px 41.7776px 33.4221px rgba(0, 0, 0, 0.150959),
  //   0px 22.3363px 17.869px rgba(0, 0, 0, 0.125183),
  //   0px 12.5216px 10.0172px rgba(0, 0, 0, 0.105),
  //   0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0848175),
  //   0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0590406);

  .scrollable {
    & > div {
      border: 1px solid ${(props) => props.colors.panelBorder};

      &:first-child {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }

      &:last-child {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      &.active {
        border: 1px solid ${(props) => props.colors.primary};
      }
    }
  }
`

const ListContainer = styled.div<any>`
  position: fixed;
  ${(props) => (props.top ? `top: ${props.top}px` : '')};
  ${(props) => (props.left ? `left: ${props.left}px` : '')};
  ${(props) => (props.bottom ? `bottom: ${props.bottom}px` : '')};
  z-index: ${(props) => props.zIndex ?? 41};
  max-height: ${(props) => (isMobileLandscape(props.isMobile) ? 200 : 400)}px;
  overflow-y: auto;
  padding-top: 8px;
  padding-bottom: 8px;
  width: 171px;
  border-radius: 2px;
`

const ListItem = styled.div<any>`
  width: 47px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.colors.background};
`

const SentimentSelection = styled.div<any>`
  height: 100%;
  width: 47px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  background: ${(props) => props.colors.background};
  border: 1px solid ${(props) => props.colors.panelBorder};
  box-sizing: border-box;
  border-radius: 4px;
`
const Title = styled.span`
  color: #8491a3;
  font-size: 9px;
  line-height: 11px;
`

const Arrow = styled.div`
  color: #8491a3;
  text-align: center;
  font-size: 18px;
`

export interface ISentimentItem {
  id: number
  label: string
}

interface ICfdSentimentSwitcherProps {
  colors: any
  cfdSentimentOptions?: ISentimentItem[]
  selectedCfdSentimentOption?: ISentimentItem
  actionSetCfdSentimentSelectedOption: (option: ISentimentItem) => void
  isMobile: boolean
}

const CfdSentimentSwitcher: FC<ICfdSentimentSwitcherProps> = ({
  colors,
  cfdSentimentOptions,
  selectedCfdSentimentOption,
  actionSetCfdSentimentSelectedOption,
  isMobile,
}) => {
  const [visibility, setVisibility] = useState<boolean>(false)

  const onItemClick = (item: ISentimentItem) => {
    setVisibility(false)
    actionSetCfdSentimentSelectedOption(item)
  }

  const getItemLabelTranslation = (label: string | undefined) => {
    switch (label) {
      case 'Payout':
        return t`Payout`
      case 'Price':
        return t`Price`
      case 'Multiplier':
        return t`Multiplier`
      default:
        return ''
    }
  }

  return (
    <SwitcherContainer colors={colors} className="switcher-container">
      <SentimentSelection colors={colors} onClick={() => setVisibility(true)}>
        <Title>
          {getItemLabelTranslation(selectedCfdSentimentOption?.label)}
          <Arrow>▾</Arrow>
        </Title>
      </SentimentSelection>
      <ListContainer
        isMobile={isMobile}
        colors={colors}
        style={{
          display: visibility ? '' : 'none',
          width: 47,
          marginTop: '-57px',
        }}
      >
        <div className="scrollable">
          {cfdSentimentOptions?.map((item) => (
            <ListItem
              key={item.id}
              colors={colors}
              onClick={() => onItemClick(item)}
              className={
                selectedCfdSentimentOption?.id === item.id ? 'active' : ''
              }
            >
              <Title>{getItemLabelTranslation(item.label)}</Title>
            </ListItem>
          ))}
        </div>
      </ListContainer>
      {visibility && <Backdrop onClick={() => setVisibility(false)} />}
    </SwitcherContainer>
  )
}

const mapStateToProps = (state: any) => ({
  cfdSentimentOptions: state.trading.cfdSentimentOptions,
  selectedCfdSentimentOption: state.trading.selectedCfdSentimentOption,
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, {
  actionSetCfdSentimentSelectedOption,
})(CfdSentimentSwitcher)
