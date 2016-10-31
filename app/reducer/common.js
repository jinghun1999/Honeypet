/**
 * Created by User on 2016-10-26.
 */
'use strict';
import * as types from '../actions/types';

const initialState = {
    message: {
        id: null,
        text: null
    }
};

export default function (state = initialState, action) {
    const { payload = {} } = action;
    switch (action.type) {
        case types.SHOW_MESSAGE:
            return {
                ...state,
                message: {
                    ...state.message,
                    ...payload
                }
            };
        default:
            return state;
    }
}