/**
 * Created by User on 2016-10-26.
 */
'use strict';
import _ from 'lodash';
import * as types from '../actions/types';

export default function (state = {}, action) {

    const { payload, meta = {}, type, error } = action;
    const { key, value } = meta;
    switch (type) {

        case types.GET_CONFIG:
            return {
                ...state,
                [key]: payload
            };
        case types.UPDATE_CONFIG:
            return {
                ...state,
                [key]: value
            }

        case types.REMOVE_CONFIG:
            delete state[key];
            return state;

        default:
            return state;
    }
}