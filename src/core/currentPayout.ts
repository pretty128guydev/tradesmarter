import { IInstrument, IPayout } from './API'

/**
 * So if game type is not 11 than fetch payout from instrument using distance
 * Is not used for 1,2 and 11
 */
const getCurrentPayout = (
	gameType: number,
	instrument: IInstrument,
	payoutDeltas: any,
	maxClientPayouts: any
) => {
	if (instrument.payouts) {
		const payoutObject: any = instrument.payouts.find(
			(payoutObject: any) => payoutObject.gameType === gameType
		)

		if (!payoutObject) {
			return null
		}

		const { payout } = payoutObject
		const maxPayout: number = Number(maxClientPayouts[gameType])
		const payoutDelta: number = payoutDeltas[gameType]

		if (payoutDelta) {
			return Math.min(payout + payoutDelta, maxPayout)
		}

		return Math.min(payout, maxPayout)
	}
	return 0
}

/**
 * Port from pro4
 * @param instruments
 */
const setPayoutsPerGameType = (instruments: IInstrument[]) =>
	instruments.map((instrument: IInstrument) => {
		const { payouts } = instrument
		if (payouts) {
			let payoutsPerGameType: any = {}
			payouts.forEach((gameTypePayout: IPayout) => {
				const { gameType } = gameTypePayout
				payoutsPerGameType[gameType] = gameTypePayout
			})

			return {
				...instrument,
				payouts: payoutsPerGameType,
			}
		} else {
			return {
				...instrument,
			}
		}
	})

export { getCurrentPayout, setPayoutsPerGameType }
