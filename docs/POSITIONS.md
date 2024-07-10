# Positions
## Open / Closed positions
It is important to split open and closed into two different interfaces, because trades response format is completely different:
* for example lets get "EUR/USD" from positions object, in open position it will be instrumentName, in closed position - asset.
* A lot of fields like strike, stake are numbers in open position and string in closed position.
* You can't construct closed position from open position because there will be some missing fields like expiry, return.

For the new trade use IOpenPosition interface.

## Date formatting
Please don't use formatted date string for closed positions - because it will always be UTC, use timestamps and format them into local time.
