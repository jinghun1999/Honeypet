'use strict';
import React, {
    Component,
    } from 'react';
import Util from './Util';
import Global from './Global';
import Config, { storageKey } from '../config';
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
                    result = {Sign: false, Message: '【解析远程数据失败】' + responseText};
                }
                callback(result);
            }).catch(error => {
                alert(error);
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
                    result = {Sign: false, Message: '【解析远程数据失败】' + responseText};
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
                    error('not found user');
                    break;
                case 'ExpiredError':
                    error('user login expired');
                    break;
                default :
                    error('请重新登陆应用');
                    break;
            }
        });
    }
    static getUserInfo(success, error) {
        storage.load({
            key: "USER",
            autoSync: false,
            syncInBackground: false
        }).then(user => {
            success(user);
        }).catch(err => {
            switch (err.name) {
                case 'NotFoundError':
                    error('not found user');
                    break;
                case 'ExpiredError':
                    error('user login expired');
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

    /*
    static headerClientAuth(user, hos) {
        let hoscode = '*';
        if (hos && hos.hospital) {
            hoscode = hos.hospital.Registration
        }
        return {
            'Authorization': 'Mobile ' + Util.base64Encode(user.Mobile + ':' + hoscode + ":" + user.Token.token)
        }
    }*/

    static headerClientAuth(user,hos) {
        return {
            'Authorization': 'Basic ' + Util.base64Encode(user.UserID + ';' + user.use.CreatedOn + ';' + user.use.SafetyCode)
        };
    }

    static request(data,callback) {
        NetUtil.getUserInfo((ret)=>{
            let header = NetUtil.headerClientAuth(ret);
            NetUtil.postJson(CONSTAPI.REQUEST,data,header,callback);
        });
    }

    static login(phone, pwd, callback) {
        NetUtil.get(CONSTAPI.LOGIN + "?m=" + phone + "&r=" + pwd, false, function (lg) {
            if (lg.Sign && lg.Message) {
                /*保存登陆信息*/
                storage.save({
                    key: storageKey.USER_TOKEN,
                    rawData: lg.Message,
                });
                /*保存用户信息*/
                storage.save({
                    key: 'USER',
                    rawData: {
                        userid:phone,
                        user: lg.Message
                    },
                    expires: 1000 * 7200,
                });
                callback(true);
            } else {
                callback(false, lg.Exception)
            }
        });
    }
}

module.exports = NetUtil;
