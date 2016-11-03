/**
 * Created by User on 2016-09-22.
 */
'use strict';
var Sync = {
    USER(params) {
        let {id, resolve, reject } = params;
        storage.load({key: 'LoginData'}).then(l=> {
            let url = CONSTAPI.Auth + '/ad?identity=' + l.identity + '&password=' + l.password + '&verCode=&type=m';
            //let url = CONSTAPI.Auth + '/ad?identity=18307722503&password=abc123&type=m';
            fetch(url)
                .then((response) => response.text())
                .then((responseText) => {
                    let r = {};
                    try {
                        r = JSON.parse(responseText);
                        if (r.Sign && r.Message) {
                            let _expires = 1000 * (r.Message.Token.expires_in - 16200);
                            storage.save({
                                key: 'USER',
                                rawData: {
                                    user: r.Message,
                                },
                                expires: _expires,
                            });
                            resolve && resolve({user: r.Message});
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