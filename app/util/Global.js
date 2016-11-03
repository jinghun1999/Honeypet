'use strict';
import React, { Component, } from 'react';

let API_HOST = 'http://test.tuoruimed.com/honeypet/api/';
var GLOBAL = {
    API_HOST:API_HOST,
    LOGIN: API_HOST + '/token',
};
global.CONSTAPI = GLOBAL;
module.exports = GLOBAL;
