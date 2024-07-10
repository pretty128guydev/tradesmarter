import { isEqual } from 'lodash'
import { useEffect, useRef } from 'react'

const deepCompareEquals = (val1: any, val2: any) => isEqual(val1, val2)

const useDeepCompareMemoize = (value: any) => {
	const ref = useRef()

	if (!deepCompareEquals(value, ref.current)) {
		ref.current = value
	}

	return ref.current
}

export const useDeepCompareEffect = <T>(callback: () => void, inputs: T[]) => {
	useEffect(callback, inputs.map(useDeepCompareMemoize))
}
