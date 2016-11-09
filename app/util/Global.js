'use strict';
import React, { Component, } from 'react';

let API_HOST = 'http://test.tuoruimed.com:802/api/';
var GLOBAL = {
    API_HOST:API_HOST,
    LOGIN: API_HOST + '/token',
    REQUEST : API_HOST + '/Request'
};
global.CONSTAPI = GLOBAL;
module.exports = GLOBAL;
