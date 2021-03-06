/**
 * Created by User on 2016-10-25.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity
    } from 'react-native';
import _ from 'lodash';
import Toast from 'react-native-root-toast';
import TimerMixin from 'react-timer-mixin';
//import * as ConfigAction from '../actions/config';
//import * as UserAction from '../actions/user';
import { getImageSource, openLink } from '../common';
import Logo from '../components/logo';
import ViewPage from './view';
import Spinner from '../components/spinner';
//import { JSEncrypt } from '../common/jsencrypt';
import Config, { authData, storageKey } from '../config';
import { StyleConfig, ComponentStyles, CommonStyles } from '../styles';
import NetUtil from '../util/NetUtil';
const navTitle = "登录";
const backgroundImageSource = getImageSource(8);

class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loading: false,
            canSend: false,
            canLogin: false,
        };
    }

    componentWillUnmount() {
        this.timer && TimerMixin.clearTimeout(this.timer);
    }

    encryptData(data) {
        let encrypt = new JSEncrypt({
            default_key_size: 1024,
            default_public_exponent: '010001'
        });
        encrypt.setPublicKey(authData.pubKey);
        return encrypt.encrypt(data);
    }

    loginValidator() {
        let username = this.state.username;
        let password = this.state.password;
        let message;
        if (!_.trim(username)) {
            message = "请输入手机号码";
        }
        else if (!_.trim(password)) {
            message = "请输入验证码";
        }
        if (message) {
            Toast.show(message);
            return false;
        }
        //username = this.encryptData(username);
        //password = this.encryptData(password);
        return {
            username,
            password
        };
    }

    handleLogin() {
        const loginData = this.loginValidator();
        const _this = this;
        if (loginData) {
            this.setState({loading: true});
            NetUtil.login(loginData.username, loginData.password, function (ok, msg) {
                if (ok) {
                    const {navigator} = _this.props;
                    if (navigator) {
                        _this.timer = TimerMixin.setTimeout(() => {
                            _this.setState({loading: false});
                            navigator.replace(ViewPage.index());
                        }, 500);
                    }
                } else {
                    _this.setState({loading: false});
                    Toast.show(msg);
                }
            });
        }
    }

    handleSend() {
        let _this = this;
        let username = _this.state.username;
        if (username === null || username.length !== 11) {
            Toast.show("请输入正确的手机号");
            return false;
        } else {
            var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
            if (!reg.test(username)) {
                Toast.show("请输入正确的手机号");
                return false;
            }
            _this.setState({loading: true});
            NetUtil.getVerifycode(username, (ok, ret)=> {
                if (ok) {
                    Toast.show('验证码已发送至您的手机，请注意查收');
                    _this.setState({
                        password: ret.verifycode.toString(),
                        canLogin: true,
                    });
                } else {
                    Toast.show(ret);
                }
                _this.setState({loading: false});
            });
        }
    }

    handleLoginResolved(data) {
        if (!data.Sign) {
            Toast.show("登录失败，手机号或验证码错误");
            return;
        }
        Toast.show("恭喜您，登录成功");
        this.timer = TimerMixin.setTimeout(() => {
            this.props.navigator.replace(ViewPage.home());
        }, 2000);
    }

    handleLoginRejected(data) {
        this.setState({loading: false});
        Toast.show("登录失败，请重试");
    }

    handleRegisterPress() {
        openLink(Config.appInfo.registerUri)
    }

    renderHeader() {
        return (
            <View style={[ CommonStyles.m_b_4 ]}>
                <Image
                    style={ ComponentStyles.header_img }
                    source={ backgroundImageSource }/>
                <Logo style={ [ComponentStyles.pos_absolute, styles.header_logo] }/>
            </View>
        );
    }

    renderFormPanel() {
        return (
            <View style={ [ CommonStyles.m_a_4 ] }>
                { this.renderUserName() }
                { this.renderPassword() }
                { this.renderButtons() }
            </View>
        );
    }

    renderCopyRight() {
        return (
            <View style={ [ styles.footer_copyright ]}>
                <Text style={ [ CommonStyles.text_center, CommonStyles.m_b_4, CommonStyles.text_muted ] }>
                    { Config.appInfo.copyright }
                </Text>
            </View>
        )
    }

    renderUserName() {
        return (
            <View style={ [ComponentStyles.input_control ,{flexDirection:'row', borderBottomWidth:0}] }>
                <View
                    style={styles.phone86}>
                    <Text>+86</Text>
                </View>
                <View style={{flex:1,}}>
                    <TextInput
                        ref="txtUserName"
                        maxLength={ 11 }
                        keyboardType={'numeric'}
                        blurOnSubmit={true}
                        autoFocus={true}
                        style={ [ComponentStyles.input ] }
                        placeholder={'请输入手机号码'}
                        placeholderTextColor={ StyleConfig.color_gray }
                        underlineColorAndroid={ 'transparent' }
                        onChangeText={(val)=>{
                            this.setState({username: val});
                            if(val.length===11){
                                this.setState({canSend: true});
                            }
                        }}
                        value={ this.state.username }/>
                </View>
            </View>
        )
    }

    renderPassword() {
        return (
            <View style={ [ComponentStyles.input_control,{flexDirection:'row', paddingHorizontal:5,} ] }>
                <View style={{flex:1,}}>
                    <TextInput
                        ref="txtPassword"
                        maxLength={ 6 }
                        keyboardType={'numeric'}
                        style={ [ComponentStyles.input ] }
                        blurOnSubmit={true}
                        placeholder={'请输入验证码'}
                        placeholderTextColor={ StyleConfig.color_gray }
                        underlineColorAndroid={ 'transparent' }
                        onChangeText={(val)=>{
                            this.setState({password: val});
                            if(val.length===6){
                                this.setState({canLogin: true});
                            }
                        }}
                        value={ this.state.password }/>
                </View>
                <TouchableOpacity
                    activeOpacity={ StyleConfig.touchable_press_opacity }
                    style={styles.sendBtn}
                    disabled={!this.state.canSend}
                    onPress={()=>this.handleSend()}>
                    <Text style={!this.state.canSend?{color:'#ccc'}:{}}>
                        发送验证码
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderLoginButton() {
        return (
            <TouchableOpacity
                activeOpacity={ StyleConfig.touchable_press_opacity }
                disabled={!this.state.canLogin}
                style={ [ComponentStyles.btn, {flex:1,}, this.state.canLogin?ComponentStyles.btn_primary:ComponentStyles.btn_dark] }
                onPress={()=>this.handleLogin()}>
                <Text style={ ComponentStyles.btn_text }>
                    登录
                </Text>
            </TouchableOpacity>
        )
    }

    renderLoading() {
        if (this.state.loading === true) {
            return (
                <Spinner style={ ComponentStyles.pending_container }/>
            )
        }
    }

    renderButtons() {
        return (
            <View
                style={ [ CommonStyles.flexRow, CommonStyles.flexItemsMiddle, CommonStyles.flexItemsBetween, CommonStyles.m_t_4 ] }>
                { this.renderLoginButton() }
            </View>
        )
    }

    render() {
        return (
            <View style={ ComponentStyles.container }>
                { this.renderHeader() }
                { this.renderFormPanel() }
                { this.renderCopyRight() }
                { this.renderLoading() }
            </View>
        );
    }
}

export const styles = StyleSheet.create({
    header_logo: {
        left: StyleConfig.screen_width / 2 - StyleConfig.avatarSize_lg / 2,
        bottom: StyleConfig.avatarSize_lg / 2 - StyleConfig.avatarSize_lg
    },
    footer_copyright: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    phone86: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: .5,
        borderRightColor: '#EEE9E9',
        marginRight: 5,
    },
    sendBtn: {
        justifyContent: 'center',
        paddingLeft: 5,
        alignItems: 'center',
        borderLeftWidth: .5,
        borderLeftColor: '#EEE9E9',
        marginRight: 5,
    },
});

export default LoginPage;