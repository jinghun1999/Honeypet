/**
 * Created by User on 2016-10-22.
 */
'use strict';
import Config, { storageKey, loginExpiredIn } from '../config';
var Sync = {
    USERTOKEN(params) {
        let {id, resolve, reject } = params;
        storage.load({key: storageKey.LOGIN_INFO}).then(li=> {
            let url = CONSTAPI.LOGIN + "?m=" + li.phone + "&r=" + li.password;
            fetch(url)
                .then((response) => response.text())
                .then((responseText) => {
                    let r = {};
                    try {
                        r = JSON.parse(responseText);
                        if (r.result && r.data) {
                            let _expires = 1000 * loginExpiredIn;
                            storage.save({
                                key: storageKey.USER_TOKEN,
                                rawData: r.data,
                                expires: _expires,
                            });
                            resolve && resolve({user: r.data});
                            //alert('自动登陆成功，' + _expires + 'ms后过期')
                        } else {
                            //alert('自动登陆失败！')
                            reject && reject(new Error('登陆信息已过期，请重新登陆'));
                        }
                    } catch (e) {
                        alert(e)
                        reject && reject(new Error('data parse error'));
                    }
                }).done();
        }).catch(err=> {
            reject && reject(new Error(err.message));
        });
    }
}
module.exports = Sync;