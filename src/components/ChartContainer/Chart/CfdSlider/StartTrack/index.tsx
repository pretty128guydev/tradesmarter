import React, { FC } from 'react'
import { MiddleTrackContainer } from './styled'

interface IStartTrackTrackProps {
	trackStepLen: number
}

export const StartTrack: FC<IStartTrackTrackProps> = ({ trackStepLen }) => {
	return <MiddleTrackContainer height={trackStepLen}></MiddleTrackContainer>
}
