const channelToSubscription = new Map()

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscribeUID,
  onResetCacheNeededCallback,
  lastDailyBar
) {
  const channelString = symbolInfo.full_name
  const handler = {
    id: subscribeUID,
    callback: onRealtimeCallback,
  }
  let subscriptionItem = channelToSubscription.get(channelString)
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
    subscriptionItem.handlers.push(handler)
    return
  }
  subscriptionItem = {
    subscribeUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  }
  channelToSubscription.set(channelString, subscriptionItem)
}

export function unsubscribeFromStream(subscriberUID) {
  // find a subscription with id === subscriberUID
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString)
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler) => handler.id === subscriberUID
    )

    if (handlerIndex !== -1) {
      // remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1)

      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        console.log(
          '[unsubscribeBars]: Unsubscribe from streaming. Channel:',
          channelString
        )
        channelToSubscription.delete(channelString)
        break
      }
    }
  }
}
export function reRenderTradingChart(instrumentName, lastQuote) {
  if (!instrumentName || !lastQuote) return

  const channelString = instrumentName

  const subscriptionItem = channelToSubscription.get(channelString)

  if (subscriptionItem === undefined || Object.keys(lastQuote).length === 0) {
    return
  }

  const { timestamp, open, low, high, last: close } = lastQuote
  const bar = {
    time: timestamp,
    open,
    high,
    low,
    close,
  }

  subscriptionItem.lastDailyBar = bar

  subscriptionItem.handlers.forEach((handler) => handler.callback(bar))
}
