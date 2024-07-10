import React from 'react'
import { renderToString } from 'react-dom/server'
import CircularProgress from '../Sentiment/CircularProgress'

export const ExpiryFlag = () => {
	return (
		<div>
			<svg width="40" height="40" viewBox="0 0 40 40">
				<g fill="none" fillRule="evenodd">
					<g>
						<g transform="translate(-821 -656) translate(822 657)">
							<circle
								cx="16"
								cy="16"
								r="16"
								stroke="#101924"
								strokeOpacity=".8"
								strokeWidth="2"
							/>
							<circle
								cx="16"
								cy="16"
								r="15"
								fill="#101923"
								fillOpacity=".02"
							/>
							<path
								stroke="#7E91A7"
								strokeWidth="2"
								d="M15.357 31.986c8.243.341 15.499-5.704 16.522-14.036C32.956 9.18 26.72 1.198 17.95.12 9.18-.955 1.199 5.28.122 14.05c-.657 5.346 1.405 10.4 5.1 13.775 1.142 1.041 2.439 1.923 3.86 2.604.804.386 1.648.707 2.525.957l1.594.376"
							/>
							<circle cx="16" cy="16" r="12" fill="#263346" />
							<g fill="#FFF" transform="translate(12, 8)">
								<g>
									<g>
										<g>
											<path
												d="M-6.25 7.5h14c.276 0 .5.224.5.5v.5c0 .276-.224.5-.5.5h-14c-.276 0-.5-.224-.5-.5V8c0-.276.224-.5.5-.5z"
												transform="translate(-683 -665) translate(683 665) translate(.5) rotate(90 .75 8.25)"
											/>
										</g>
										<path
											d="M.5.941h8.647c.276 0 .5.224.5.5 0 .12-.044.237-.123.328L7.786 3.767c-.164.189-.164.469 0 .657l1.738 1.998c.182.208.16.524-.049.705-.09.08-.207.123-.328.123H.5V.941z"
											transform="translate(-683 -665) translate(683 665) translate(.5)"
										/>
									</g>
								</g>
							</g>
						</g>
					</g>
				</g>
			</svg>
		</div>
	)
}

export const addExpiryFlag = (chartInstance: any, x: number, y: number) => {
	const { renderer } = chartInstance
	return (chartInstance.expiryFlag = renderer
		.label(
			renderToString(<ExpiryFlag />),
			x,
			y,
			null,
			null,
			'circle',
			true,
			null,
			'chart__expiry-flag'
		)
		.attr({
			zIndex: 54,
		})
		.css({
			cursor: 'pointer',
		})
		.add())
}

export const addCountDown = (
	chartInstance: any,
	x: number,
	y: number,
	value: number,
	text: string,
	backgroundColor: string,
	textColor: string,
	filledColor: string,
	normalColor: string
) => {
	const { renderer } = chartInstance
	return (chartInstance.countdown = renderer
		.label(
			renderToString(
				<CircularProgress
					value={value}
					filledColor={filledColor}
					normalColor={normalColor}
					size={34}
					text={text}
					textColor={textColor}
					thickness={2}
					withBackground={true}
					backgroundColor={backgroundColor}
				/>
			),
			x,
			y,
			null,
			null,
			'circle',
			true,
			null,
			'chart__countdown'
		)
		.attr({
			zIndex: 54,
		})
		.css({
			cursor: 'pointer',
		})
		.add())
}
