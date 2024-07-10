import React from 'react'
import { connect } from 'react-redux'
import RemoveTopIcon from '../ChartContainer/InstrumentsBar/icon-top.svg'
import ReactTooltip from 'react-tooltip'
import { t } from 'ttag'
import AddTopIcon from '../ChartContainer/InstrumentsBar/icon-top-active.svg'
import { actionShowModal, ModalTypes } from '../../actions/modal'
import { isLoggedIn } from '../selectors/loggedIn'
import {
  actionAddInstrumentToTop,
  actionRemoveInstrumentFromTop,
} from '../../actions/account'
import ThemedIcon from './ThemedIcon'
import styled from 'styled-components'

const Panel = styled.div<any>`
  display: inline-flex;

  .tooltip-background {
    color: ${(props) => props.colors.secondaryText} !important;
    background-color: ${(props) => props.colors.background} !important;
  }
`

interface ITopIconProps {
  instrumentId: string
  isTop: boolean
  isLoggedIn: boolean
  actionAddInstrumentToTop: (id: any) => void
  actionRemoveInstrumentFromTop: (id: any) => void
  actionShowModal: (mt: ModalTypes, props?: any) => void
  colors: any
}

const TopIcon = ({
  isTop,
  instrumentId,
  isLoggedIn,
  actionAddInstrumentToTop,
  actionRemoveInstrumentFromTop,
  actionShowModal,
  colors,
}: ITopIconProps) => {
  const updateTopInstruments = (): void => {
    if (!isLoggedIn) {
      actionShowModal(ModalTypes.SESSION_EXPIRED, {})
      return
    }

    !isTop
      ? actionAddInstrumentToTop(instrumentId)
      : actionRemoveInstrumentFromTop(instrumentId)
  }

  const iconId = Math.floor(Math.random() * 999901 + 1000)

  return (
    <Panel data-tip="" data-for={'top-icon' + iconId} colors={colors}>
      <span
        style={{ cursor: 'pointer' }}
        onClick={(e: React.SyntheticEvent<any>) => {
          e.stopPropagation()
          updateTopInstruments()
        }}
      >
        <ThemedIcon
          width={16}
          height={16}
          fill={colors.primary}
          stroke={colors.primary}
          src={isTop ? RemoveTopIcon : AddTopIcon}
        />
      </span>
      <ReactTooltip
        offset={{ top: 5 }}
        id={'top-icon' + iconId}
        place="top"
        className="react-tooltip-small tooltip-background"
        backgroundColor={colors.background}
      >
        {isTop ? t`Remove from chart` : t`Add to chart`}
      </ReactTooltip>
    </Panel>
  )
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedIn(state),
  colors: state.theme,
})

export default connect(mapStateToProps, {
  actionAddInstrumentToTop,
  actionShowModal,
  actionRemoveInstrumentFromTop,
})(TopIcon)
