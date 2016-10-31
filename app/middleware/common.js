/**
 * Created by User on 2016-10-26.
 */
import * as commonAction from '../actions/common';

export default function common({dispatch}) {
    return next => action => {
        const { payload, error, meta={} } = action;
        if (error === true && payload && payload.message) {
            dispatch(commonAction.message(payload.message));
        }
        next(action);
    }
}