import { forEach, keys, join, cloneDeep } from 'lodash'
import { ProductType } from '../reducers/trading'

const isLandscape = window.matchMedia('(orientation: landscape)').matches

/**
 * serializes object to encoded URI Component
 * @param obj
 */
export const serializeObject = (obj: { [key: string]: any }) => {
  const res: string[] = []

  forEach(keys(obj), (key: string) =>
    res.push(`${key}=${encodeURIComponent(obj[key])}`)
  )

  return join(res, '&')
}

/**
 * replaces item in generic array by index
 * @param array
 * @param index
 * @param item
 */
export const replaceByIndex = <T>(array: T[], index: number, item: T) => {
  const res = cloneDeep(array)
  res[index] = item

  return res
}

export const isMobileLandscape = (isMobile: boolean) => isMobile && isLandscape

export const randomColor = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}

export const convertHexToRGBA = (hexCode: string, opacity = 1) => {
  let hex = hexCode.replace('#', '')

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const getDifference = (array1: any, array2: any) => {
  return array1
    .filter((object1: any) => {
      return !array2.some((object2: any) => {
        return object1.tradeID === object2.tradeID
      })
    })
    .map((trade: any) => trade.tradeID)
}

export const getDifferenceTrades = (array1: any, array2: any) => {
  return array1.filter((object1: any) => {
    return !array2.some((object2: any) => {
      return object1.tradeID === object2.tradeID
    })
  })
}

export const getGameTypeFromProductType = (productType: ProductType) => {
  switch (productType) {
    case ProductType.highLow:
      return 1
    case ProductType.cfdOptions:
      return 2
    case ProductType.aboveBelow:
      return 3
    default:
      return null
  }
}
