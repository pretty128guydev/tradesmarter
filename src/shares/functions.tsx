import { difference, filter, split, toLower } from 'lodash'
import { IShortInstrument } from '../components/ChartContainer/InstrumentsBar'

export function searchInstruments(
  instruments: IShortInstrument[],
  searchValue: string
): IShortInstrument[] {
  const lowerSearch = toLower(searchValue)
  let result = instruments.filter((i: IShortInstrument) =>
    toLower(i.name).includes(lowerSearch)
  )
  if (result.length === 0) {
    const lowerSearchSpit = filter(
      split(lowerSearch, ''),
      (i: string) => i !== ' '
    )
    result = instruments.filter((i: IShortInstrument) => {
      const nameSplit = split(toLower(i.name), '')
      return difference(lowerSearchSpit, nameSplit).length === 0
    })
  }
  return result
}
