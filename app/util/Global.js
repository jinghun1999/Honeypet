'use strict';
import React, { Component, } from 'react';
let HOST = 'http://test.tuoruimed.com:802'
let API_HOST = HOST+'/api/';
var GLOBAL = {
    HOST: HOST,
    API_HOST:API_HOST,
    LOGIN: API_HOST + '/token',
    REQUEST : API_HOST + '/Request'
};
global.CONSTAPI = GLOBAL;
module.exports = GLOBAL;
