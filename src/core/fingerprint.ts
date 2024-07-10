/**
 * Will be called once module loaded
 */
import FingerprintJS from '@fingerprintjs/fingerprintjs'

;(async () => {
	const fp = await FingerprintJS.load()
	const result = await fp.get()
	const visitorId = result.visitorId
	;(window as any).fingerprint = visitorId
})()
