/**
 * Created by User on 2016-10-26.
 */
import { createAction } from 'redux-actions';
import _ from 'lodash';
import * as types from './types';

export const message = createAction(types.SHOW_MESSAGE, (text)=> {
    let id = _.uniqueId();
    return {
        id: id,
        text
    }
});