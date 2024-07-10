import { action } from "typesafe-actions";

const entity = 'quotes';

const UPDATE = `${entity}/UPDATE`

const actionUpdateQuotes = (quotes: any[]) => action(UPDATE, quotes)

export {
    UPDATE,
    actionUpdateQuotes
}
