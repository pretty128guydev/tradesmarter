/**
 * Implements a expiries list
 */

import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Overlay } from '@react-md/overlay'
import { actionCloseModal } from '../../../actions/modal'
import { List, ListItem } from 'react-md'
import { IGame } from '../../../reducers/games'
import { formatListExpiry } from '../../TradeBox/ExpirySelect'
import { actionSelectGame } from '../../../actions/game'
import { actionSetSelectedCfdOptionExpiry } from '../../../actions/trading'

const Modal = styled.div<{ colors: any; bottom: number }>`
	position: fixed;
	top: 20%;
	left: 20px;
	right: 20px;
	bottom: ${(props) => props.bottom + 'px'};
	z-index: 80;
	overflow: auto;

	ul {
		background: ${(props) => props.colors.textfieldBackground};
		color: ${(props) => props.colors.textfieldText};
	}
`

const ExpiriesModal = (props: any) => {
	const { items, bottomSpace } = props
	const onGameSelect = (game: IGame) => {
		game.isCfdOptions && game.cdfExpiry
			? props.actionSetSelectedCfdOptionExpiry(game.cdfExpiry)
			: props.actionSelectGame(game)

		props.actionCloseModal()
	}

	return (
		<>
			<Modal colors={props.colors} bottom={bottomSpace + 25}>
				<List className="md-cell md-paper md-paper--1">
					{items.map((item: IGame) => (
						<ListItem
							key={`${item.deadPeriod}-${item.expiry}`}
							onClick={() => onGameSelect(item)}
							primaryText={formatListExpiry(item)}
						/>
					))}
				</List>
			</Modal>
			<Overlay
				id="modal-overlay"
				visible={true}
				onRequestClose={props.actionCloseModal}
				style={{ zIndex: 79 }}
			/>
		</>
	)
}

const mapStateToProps = (state: any) => ({ colors: state.theme })

export default connect(mapStateToProps, {
	actionCloseModal,
	actionSelectGame,
	actionSetSelectedCfdOptionExpiry,
})(ExpiriesModal)
