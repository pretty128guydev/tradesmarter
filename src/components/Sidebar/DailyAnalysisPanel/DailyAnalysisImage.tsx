import React from 'react'
import Backdrop from '../../Backdrop'
import { ArticleImgEnlarged } from './styled'

interface IDailyAnalysisImageProps {
	src: string
	alt: string
	onClick: () => void
}

const DailyAnalysisImage = ({
	src,
	alt,
	onClick,
}: IDailyAnalysisImageProps) => {
	return (
		<Backdrop
			onClick={onClick}
			style={{ backgroundColor: 'rgba(0,0,0, 0.6)' }}
		>
			<ArticleImgEnlarged src={src} alt={alt} />
		</Backdrop>
	)
}

export default DailyAnalysisImage
