/**
 * Component to mount widget
 */
import React from 'react'

interface IWidgetProps {
	name?: string
}

const Widget = ({ name }: IWidgetProps) => {
	return <div>Widget</div>
}
export default Widget
