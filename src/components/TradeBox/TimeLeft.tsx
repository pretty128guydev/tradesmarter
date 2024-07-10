/**
 * Implements a timer
 * Shows time before dead period of expiry
 */
import React from 'react'
import { connect } from 'react-redux'
import { IGame } from '../../reducers/games'
import { t } from 'ttag'
import { trimMs } from '../Sidebar/PositionsPanel/Countdown'
import { LocaleDate } from '../../core/localeFormatDate'

interface ITimeLeftProps {
	time: number
	game: IGame | null
}

const TimeLeft = ({ time, game }: ITimeLeftProps) => {
	if (game?.timestamp) {
		const target = Number(game.timestamp as Date) - game.deadPeriod * 1000
		if (target < time) {
			return <div>0 {t`seconds`}</div>
		}
		return (
			<div>{LocaleDate.formatDistanceStrict(trimMs(time), target)}</div>
		)
	}
	return null
}

const mapStateToProps = (state: any) => ({
	time: state.time,
})

export default connect(mapStateToProps)(TimeLeft)
