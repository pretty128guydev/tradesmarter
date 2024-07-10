import { action } from 'typesafe-actions'
import { IGame } from '../reducers/games'

const entity = 'game'

const SELECT_GAME = `${entity}/SELECT`
const SELECT_NEXT_GAME = `${entity}/SELECT_NEXT_GAME`
const actionSelectGame = (game: IGame | null) => action(SELECT_GAME, game)
const actionSelectNextExpiry = () => action(SELECT_NEXT_GAME)

export {
	SELECT_GAME,
	SELECT_NEXT_GAME,
	actionSelectGame,
	actionSelectNextExpiry,
}
