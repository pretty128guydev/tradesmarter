/**
 * Implements a switcher for open positions
 * caption with knob and a target component (depends on choice)
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import GroupOpenPositions from './GroupOpenPositions'
import OpenPositionsList from './OpenPositionsList'
import PositionsModeSwitcher from './PositionsModeSwitcher'

interface IOpenPositionsProps {
	colors: any
	isMobile: boolean
}
const OpenPositions = (props: IOpenPositionsProps) => {
	const [groups, setGroups] = useState<boolean>(false)

	return (
		<>
			<PositionsModeSwitcher
				groups={groups}
				onChange={() => setGroups(!groups)}
				colors={props.colors}
			/>
			{groups ? (
				<GroupOpenPositions isMobile={props.isMobile} />
			) : (
				<OpenPositionsList />
			)}
		</>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
})

export default connect(mapStateToProps)(OpenPositions)
