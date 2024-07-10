import React from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { t } from 'ttag'
import { actionShowModal, ModalTypes } from '../../actions/modal'
import { isLoggedIn } from '../selectors/loggedIn'
import {
  actionAddInstrumentToFavorites,
  actionRemoveInstrumentFromFavorites,
} from '../../actions/account'
import AddFavoritesIcon from '../ChartContainer/InstrumentsBar/icon-favorites.svg'
import RemoveFavoritesIcon from '../ChartContainer/InstrumentsBar/icon-favorites-active.svg'
import ThemedIcon from './ThemedIcon'
import styled from 'styled-components'

interface IFavIconProps {
  instrumentId: string
  isFav: boolean
  isLoggedIn: boolean
  actionAddInstrumentToFavorites: (id: any) => void
  actionRemoveInstrumentFromFavorites: (id: any) => void
  actionShowModal: (mt: ModalTypes, props?: any) => void
  colors: any
  size?: number
}

const Panel = styled.div<any>`
  display: inline-block;

  .tooltip-background {
    color: ${(props) => props.colors.secondaryText} !important;
    background-color: ${(props) => props.colors.background} !important;
  }
`

const FavIcon = ({
  isFav,
  instrumentId,
  isLoggedIn,
  actionAddInstrumentToFavorites,
  actionRemoveInstrumentFromFavorites,
  actionShowModal,
  colors,
  size,
}: IFavIconProps) => {
  const updateFavInstruments = (): void => {
    if (!isLoggedIn) {
      actionShowModal(ModalTypes.SESSION_EXPIRED, {})
      return
    }

    !isFav
      ? actionAddInstrumentToFavorites(instrumentId)
      : actionRemoveInstrumentFromFavorites(instrumentId)
  }

  const iconId = Math.floor(Math.random() * 999901 + 1000)

  return (
    <Panel data-tip="" data-for={'fav-icon' + iconId} colors={colors}>
      <span
        style={{ cursor: 'pointer' }}
        onClick={(e: React.SyntheticEvent<any>) => {
          e.stopPropagation()
          updateFavInstruments()
        }}
      >
        <ThemedIcon
          width={size || 16}
          height={size || 16}
          fill={colors.primary}
          stroke={colors.primary}
          src={isFav ? RemoveFavoritesIcon : AddFavoritesIcon}
        />
      </span>
      <ReactTooltip
        id={'fav-icon' + iconId}
        place="top"
        className="react-tooltip-small tooltip-background"
        offset={{ top: 5 }}
        backgroundColor={colors.background}
      >
        {isFav ? t`Remove from Favorites` : t`Add to Favorites`}
      </ReactTooltip>
    </Panel>
  )
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedIn(state),
  colors: state.theme,
})

export default connect(mapStateToProps, {
  actionAddInstrumentToFavorites,
  actionRemoveInstrumentFromFavorites,
  actionShowModal,
})(FavIcon)
