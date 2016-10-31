/**
 * Created by User on 2016-10-26.
 */
import thunk from 'redux-thunk';
import logger from './logger';
import promise from './promise';
import common from './common';
import pending from './pending';
import callback from './callback';

export default [
    logger,
    thunk,
    promise,
    pending,
    callback,
    common
];