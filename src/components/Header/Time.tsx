/**
 * Convert time from timestamp to string
 */
import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { ReactComponent as TimeIcon } from './access_time.svg'
import { trimMs } from '../Sidebar/PositionsPanel/Countdown'

const TimeContainer = styled.div<any>`
	flex: 0 1 150px;
	margin-right: 30px;
	font-size: 13px;
	letter-spacing: -0.22px;
	color: ${(props) => props.colors.primaryText};

	svg {
		vertical-align: middle;
		margin-right: 8px;
		margin-bottom: 1px;
	}
`
const Time = ({ time, colors }: any) => {
	const datetime = new Date(trimMs(time))
	const offset = Math.floor(Math.abs(datetime.getTimezoneOffset() / 60))
	const sign = offset > 0 ? '+' : ''

	return (
		<TimeContainer colors={colors}>
			<TimeIcon />
			{datetime.toLocaleTimeString()} {`${sign}${String(offset)}:00`}
		</TimeContainer>
	)
}

const mapStateToProps = (state: any) => ({ time: state.time })

export default connect(mapStateToProps)(Time)
