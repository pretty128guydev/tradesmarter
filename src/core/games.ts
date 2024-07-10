/**
 * This file contains data logic for fetching available games for instrument
 */
import { getSeconds } from 'date-fns'
import { IInstrument, IRegistry } from './API'

interface IInstrumentPayout {
  gameType: number
  payout: number
  payoutRanges: number
  rebate: number
}
interface IPayoutObject {
  payout: number
  rebate: number
}
interface IPayoutsByGameType {
  [Identifier: number]: IPayoutObject
}
interface IExpiryInfo {
  expiry: number // seconds
  round: number // seconds
  gameType: number
  payout: number
  rebate: number
  timestamp: Date | number
}
/**
 * Convert payout array into key-value hash including deltas
 * @param instrument
 * @param registry
 */
export function getPayoutsByGameType(
  instrument: any,
  registry: any
): IPayoutsByGameType {
  const { payoutDeltas } = registry
  const { payouts } = instrument
  const result: IPayoutsByGameType = {}

  payouts.forEach((item: IInstrumentPayout) => {
    result[item.gameType] = {
      payout: item.payout,
      rebate: item.rebate,
    }
  })
  /**
   * Deltas are hash when you signed in
   */
  if (payoutDeltas) {
    Object.keys(payoutDeltas).forEach((gameType: string) => {
      const value = payoutDeltas[gameType]
      const payoutObject = result[Number(gameType)]
      if (payoutObject) {
        result[Number(gameType)].payout += value
      }
    })
  }
  return result
}

/**
 * Game type 11 don't have duration
 * Return amount of seconds - duration of this expiry
 * @param timestamp
 */
const getExpiryForLongtermGames = (timestamp: number): number => {
  const target = Number(new Date(timestamp))
  const now = Number(new Date())
  const seconds = Math.ceil((target - now) / 1000.0)
  return seconds
}

export function getExpiriesByGameType(
  instrument: any,
  gameTypes: any,
  registry: any,
  clock: any
) {
  const { maxClientPayouts, instrumentExpiries, expiries } = registry
  const { instrumentID } = instrument
  const expiriesByGameType: any = {}
  const payoutsByGameType: IPayoutsByGameType = getPayoutsByGameType(
    instrument,
    registry
  )

  gameTypes.forEach((gameType: number) => {
    const maxClientPayout = +maxClientPayouts[gameType]
    const payoutPerGameType: IPayoutObject = payoutsByGameType[gameType]
    let expiryInfos = []

    if (!payoutPerGameType) {
      return
    }
    const target = payoutPerGameType.payout
    const payout: number = maxClientPayout < target ? maxClientPayout : target
    const { rebate } = payoutPerGameType

    switch (gameType) {
      case 1:
      case 2:
        if (gameType === 1) {
          if (
            instrumentExpiries[instrumentID] &&
            instrumentExpiries[instrumentID]['expiry_high_low']
          ) {
            expiryInfos = instrumentExpiries[instrumentID]['expiry_high_low']
          } else {
            expiryInfos = expiries['expiry_high_low']
          }
        } else {
          if (
            instrumentExpiries[instrumentID] &&
            instrumentExpiries[instrumentID]['expiry_sixty_second']
          ) {
            expiryInfos =
              instrumentExpiries[instrumentID]['expiry_sixty_second']
          } else {
            expiryInfos = expiries['expiry_sixty_second']
          }
        }

        expiryInfos.forEach((expiryInfo: IExpiryInfo) => {
          /* Round down the time to nearest expiryInfo.round second, and add expiry time */
          const timestamp = new Date(
            clock -
              (clock % (expiryInfo.round * 1000)) +
              expiryInfo.expiry * 1000
          )

          expiryInfo.gameType = gameType
          expiryInfo.payout = payout
          expiryInfo.rebate = rebate
          expiryInfo.timestamp = timestamp
        })

        break
      case 11:
        expiryInfos = []
        if (registry.longTermGames.includes(String(instrumentID))) {
          registry.longTermOptionExpiryTimestamps.forEach(
            (timestamp: number) => {
              expiryInfos.push({
                gameType: 11,
                payout,
                rebate,
                expiry: getExpiryForLongtermGames(timestamp),
                timestamp: new Date(timestamp),
                deadPeriod: 7200,
                /**
                 * Changed to 2hours
                 * Originally dead period was 7600
                 * but 7600 is 2.111h or 126.66minutes and could not be round up properly
                 * This magic number appeared when old logic was ported into pro4 (3 years before options6 development started)
                 */
              })
            }
          )
        }
        break
    }
    expiriesByGameType[gameType] = expiryInfos
  })
  return expiriesByGameType
}

export function openExpiriesByGameType(
  registry: IRegistry,
  instrument: IInstrument,
  gameTypes: number[],
  clock: number
) {
  if (!instrument) return {}

  const { instrumentID, tradingHours } = instrument

  const gameTypeExpiries = getExpiriesByGameType(
    instrument,
    gameTypes,
    registry,
    clock
  )
  const gameTypeOpenExpiries: any = {}

  tradingHours.forEach((tradingHours: any) => {
    const { gameType } = tradingHours

    if (gameType === 7) {
      gameTypeOpenExpiries[gameType] = gameTypeExpiries[gameType]
    } else {
      gameTypeOpenExpiries[gameType] = []

      if (gameType === 2) {
        // Short games should are only available when explicitly enabled per instrument
        // Check if instrumentID is present in shortGames array, if not - return from this iterator tradingHours
        if (!registry.shortGames.includes(instrumentID)) {
          return
        }
      }
      if (gameTypeExpiries[gameType]) {
        gameTypeExpiries[gameType].forEach((expiry: any) => {
          if (
            !expiry ||
            !expiry.timestamp ||
            !expiry.timestamp.getTime ||
            expiry.timestamp.getTime() < clock
          ) {
            return
          } else if (
            expiry.timestamp.getTime() - expiry.deadPeriod * 1000 < clock &&
            getSeconds(clock) >= 30
          ) {
            expiry.disabled = true
          } else {
            expiry.disabled = false
          }
          var expiryTimestamp = expiry.timestamp.getTime()

          tradingHours.tradingHourRanges.forEach((tradingHourRanges: any) => {
            if (
              clock > tradingHourRanges.from &&
              clock <= tradingHourRanges.to &&
              (gameType === 11 ||
                (expiryTimestamp > tradingHourRanges.from &&
                  expiryTimestamp <= tradingHourRanges.to)) &&
              gameTypeOpenExpiries[gameType].indexOf(expiry) === -1
            ) {
              gameTypeOpenExpiries[gameType].push(expiry)
            }
          })
        })
      }
      //  else {
      // 	console.warn('Not found', gameType)
      // }
    }
  })

  return gameTypeOpenExpiries
}
