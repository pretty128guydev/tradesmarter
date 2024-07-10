import { action } from "typesafe-actions";
import { IInstrument } from "../core/API";

const entity = 'instruments';

const SET = `${entity}/SET`

const actionSetInstrumentsAdvanced = (instruments: IInstrument[]) =>
    action(SET, instruments)

export {
    SET,
    actionSetInstrumentsAdvanced
}
