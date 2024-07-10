import React, { useEffect, useState } from 'react'

interface IImageWrapperProps {
	src: string
	alt: string
	placeholderSrc: string
	klass?: string
}

const ImageWrapper = ({
	src,
	placeholderSrc,
	klass,
	alt,
}: IImageWrapperProps) => {
	const [source, setSource] = useState<any>(null)
	const [loaded, setLoaded] = useState<boolean>(false)

	useEffect(() => {
		setSource(src)
	}, [src])

	return (
		<img
			className={klass}
			style={{ visibility: loaded ? 'visible' : 'hidden' }}
			alt={alt}
			src={source}
			onError={() => setSource(placeholderSrc)}
			onLoad={() => setLoaded(true)}
		/>
	)
}

export default ImageWrapper
