'use strict';
import React, {
    Component,
    } from 'react';

import {
    Alert
} from 'react-native';

import Util from './Util';
import Global from './Global';
import Config, { storageKey, loginExpiredIn } from '../config';
import Toast from 'react-native-root-toast';
class NetUtil extends React.Component {

    static postJson(url, data, header, callback) {
        if (!header) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
        } else {
            if (!header.hasOwnProperty('Accept')) {
                header['Accept'] = 'application/json';
            }
            if (!header.hasOwnProperty('Content-Type')) {
                header['Content-Type'] = 'application/json';
            }
        }
        var fetchOptions = {
            method: 'POST',
            headers: header,
            body: JSON.stringify(data)
        };

        fetch(url, fetchOptions)
            .then((response) => response.text())
            .then((responseText) => {
                let result = {};
                try {
                    result = JSON.parse(responseText);
                } catch (e) {
                    result = {result: false, error: '【解析远程数据失败】' + responseText};
                }
                callback(result);
            }).catch(error => {
                callback({result: false, error: '访问数据出错：' + error});
            }).done();
    }
    //get请求
    static get(url, header, callback) {
        if (!header) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
        } else {
            if (!header.hasOwnProperty('Accept')) {
                header['Accept'] = 'application/json';
            }
            if (!header.hasOwnProperty('Content-Type')) {
                header['Content-Type'] = 'application/json';
            }
        }
        var fetchOptions = {
            method: 'GET',
            headers: header
        };
        fetch(url, fetchOptions)
            .then((response) => response.text())
            .then((responseText) => {
                let result = {};
                try {
                    result = JSON.parse(responseText);
                } catch (e) {
                    result = {result: false, error: '【解析远程数据失败】' + responseText};
                }
                callback(result);
            }).catch(error => {
                Toast.show(error);
            }).done();
    }

    static getAuth(success, error) {
        storage.load({
            key: storageKey.USER_TOKEN,
            autoSync: true,
            syncInBackground: true
        }).then(user => {
            success(user);
        }).catch(err => {
            switch (err.name) {
                case 'NotFoundError':
                    error('本App需要登录后才能使用');
                    break;
                case 'ExpiredError':
                    error('登录已过期');
                    break;
                default :
                    error('请先登录');
                    break;
            }
        });
    }

    static url_healthmonitnorm(checkItemCode) {
        const time = Util.getTime();
        const ul = Global.HOST + "?token=" + Util.getToken(time);
        return ul;
    }

    static headerAuthorization(mobile, hospitalcode, token) {
        return 'Mobile ' + Util.base64Encode(mobile + ':' + hospitalcode + ":" + token);
    }

    static headerClientAuth(user) {
        let authorization = 'Basic ' + Util.base64Encode(user.userid + ';' + user.AccessTokenExpiredAt + ';' + user.AccessToken);
        return {
            "Authorization":authorization
        };
    }

    static request(data,callback) {

        NetUtil.getAuth((ret)=>{
            let header = NetUtil.headerClientAuth(ret);
            NetUtil.postJson(CONSTAPI.REQUEST, data, header, (result)=>{
                    callback(result.result, result);
            });
        },(_mess)=>{
            callback(false, _mess);
        });
    }

    static login(phone, pwd, callback) {
        NetUtil.get(CONSTAPI.LOGIN + "?m=" + phone + "&r=" + pwd, false, (lg)=> {
            if (lg.result && lg.data) {
                storage.save({
                    key: storageKey.USER_TOKEN,
                    rawData: lg.data,
                    expires: 1000 * loginExpiredIn,
                });
                storage.save({
                    key: storageKey.LOGIN_INFO,
                    rawData: {
                        phone: phone,
                        password: pwd,
                    },
                });
                callback(true);
            } else {
                callback(false, lg.error)
            }
        });
    }
    static getVerifycode(phone, callback) {
        NetUtil.get(CONSTAPI.LOGIN + "?m=" + phone, false, function (lg) {
            if (lg.result && lg.data) {
                storage.save({
                    key: storageKey.USER_VERIFYCODE,
                    rawData: lg.data,
                    expires: 1000 * 9,
                });
                callback(true, lg.data);
            } else {
                callback(false, lg.error)
            }
        });
    }
}

module.exports = NetUtil;
