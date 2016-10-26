/**
 * Created by User on 2016-10-25.
 */
'use strict';
import { combineReducers } from 'redux';
import userReducer from './user';

export default combineReducers({
    userStore: userReducer,
});