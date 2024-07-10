import { action } from "typesafe-actions";

const entity = 'time';

const TIME_UPDATE = `${entity}/UPDATE`
const TIME_START = `${entity}/START`

const actionSetTime = (time: number) => action(TIME_UPDATE, time)
const actionStartTimer = () => action(TIME_START)

export {
    TIME_UPDATE,
    TIME_START,
    actionSetTime,
    actionStartTimer
}
