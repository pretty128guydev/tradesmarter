export const balloonTemplate = (
  text: string,
  backgroundColor: string,
  textColor: string,
  numberOfTrades?: number
): string => {
  return `<div style="width: 40px; background-color: ${backgroundColor}; border: 1px solid ${textColor};" class="notification-container">
    <div style="background-color: ${backgroundColor}; border-top: 1px solid ${textColor}; border-right: 1px solid ${textColor};" class="triangle"></div>
    <div class="notification-container-title">Result (P/L)</div>
    <div style="color: ${textColor};" class="notification-container-content">${text}</div>
    ${
      numberOfTrades
        ? `${`<div class="number-of-trades" style="border: 1px solid ${textColor}; color: ${textColor}; background-color: ${backgroundColor};">${numberOfTrades}</div>`}`
        : ''
    }
  </div>`
}

export const showBalloon = (
  chart: any,
  xPos: number,
  yPos: number,
  text: string,
  backgroundColor: string,
  textColor: string,
  onClick: () => void,
  callback: () => void
) => {
  const y = -99999
  const duration = 3000
  const easing = 'ease-out'
  const timeout = 3000
  const ballon = chart.renderer
    .text(balloonTemplate(text, backgroundColor, textColor), xPos, yPos, true)
    .on('click', () => {
      onClick()
    })
    .add()

  setTimeout(() => {
    ballon.animate(
      { y },
      {
        duration,
        easing,
        complete: () => {
          ballon.destroy()
        },
      }
    )
    callback()
  }, timeout)
}
