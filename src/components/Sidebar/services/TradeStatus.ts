import { t } from 'ttag'

export const getClosedMoneyStateString = (result: number) => {
	switch (result) {
		case 1:
			return t`In the money`
		case 0:
			return t`At the money`
		case -1:
			return t`Out of the money`
		case 2:
			return t`At the money`
		case 3:
			return t`Sold back`
		default:
			return ''
	}
}
