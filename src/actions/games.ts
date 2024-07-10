import { action } from "typesafe-actions";
import { IGamesReducerState } from "../reducers/games";

const entity = 'games';

const SET_GAMES = `${entity}/SET`

const actionSetGames = (data: IGamesReducerState) => action(SET_GAMES, data)

export {
    SET_GAMES,
    actionSetGames
}
