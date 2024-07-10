import React from 'react'
import { getFavoriteInstruments } from '../../../selectors/instruments'
import { connect } from 'react-redux'
import {
  actionAddInstrumentToFavorites,
  actionRemoveInstrumentFromFavorites,
} from '../../../../actions/account'
import FavoriteSvg from './starred.svg'
import NotFavoriteSvg from './not_starred.svg'
import { isLoggedIn } from '../../../selectors/loggedIn'
import { actionShowModal, ModalTypes } from '../../../../actions/modal'
import ThemedIcon from '../../../ui/ThemedIcon'

interface IInstrumentFavoriteProps {
  instrumentId: string
  isLoggedIn: boolean
  favoriteInstruments: string[]
  actionRemoveInstrumentFromFavorites: (id: any) => void
  actionAddInstrumentToFavorites: (id: any) => void
  actionShowModal: any
  colors: any
}

const InstrumentFavorite = ({
  instrumentId,
  isLoggedIn,
  favoriteInstruments,
  actionRemoveInstrumentFromFavorites,
  actionAddInstrumentToFavorites,
  actionShowModal,
  colors,
}: IInstrumentFavoriteProps) => {
  const favorite = favoriteInstruments.includes(instrumentId)
  const Favorite = favorite ? FavoriteSvg : NotFavoriteSvg

  const updateFavorite = (e: React.SyntheticEvent<any>) => {
    e.stopPropagation()

    if (!isLoggedIn) {
      actionShowModal(ModalTypes.SESSION_EXPIRED)
      return
    }

    const action = favorite
      ? actionRemoveInstrumentFromFavorites
      : actionAddInstrumentToFavorites

    action(instrumentId)
  }

  return (
    <span onClick={(e) => updateFavorite(e)}>
      <ThemedIcon
        width={14}
        height={14}
        fill={colors.primary}
        stroke={colors.primary}
        src={Favorite}
      />
    </span>
  )
}

const mapStateToProps = (state: any) => ({
  favoriteInstruments: getFavoriteInstruments(state),
  isLoggedIn: isLoggedIn(state),
})

export default connect(mapStateToProps, {
  actionRemoveInstrumentFromFavorites,
  actionAddInstrumentToFavorites,
  actionShowModal,
})(InstrumentFavorite)
