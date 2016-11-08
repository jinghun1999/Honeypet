'use strict';
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Modal,
    NetInfo,
    StyleSheet,
    BackAndroid,
    TouchableOpacity
    } from 'react-native';

import TimerMixin from 'react-timer-mixin';
import * as Animatable from 'react-native-animatable';
//import * as ConfigAction from '../actions/config';
//import * as UserAction from '../actions/user';
import Config, { storageKey } from '../config';
import { getImageSource } from '../common';
import Logo from '../components/logo';
import ViewPage from './view';
import { CommonStyles, ComponentStyles, StyleConfig } from '../styles';
import Toast from 'react-native-root-toast';
import NetUtil from '../util/NetUtil';
const backgroundImageSource = getImageSource(8);
const hintText = "提示：进一步使用，需要先授权登录。使用您的手机号码一键获得验证码，使用验证码直接登陆本软件。";
const declareText = "声明：本软件需要在联网环境中使用，可能会消耗您的移动数据，我们不会以任何形式使用和传播您的账户信息，请放心使用。";

class StartupPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisiable: false,
            modalBackdropVisiable: false
        };
    }

    componentWillUnmount() {
        this.timer && TimerMixin.clearTimeout(this.timer);
    }

    componentDidMount() {
    }

    checkUserToken() {
        const _this = this;
        NetUtil.getAuth(function (ret) {
            if (ret && ret.SafetyCode && ret.Expiration) {
                _this.handleLoginResolved(ret);
            } else {
                _this.onCheckUserTokenRejected('登录已过期');
            }
        }, function (msg) {
            _this.onCheckUserTokenRejected(msg);
        });
    }

    onCheckUserTokenRejected(msg) {
        NetInfo.fetch().then((netinfo=> {
            Toast.show(msg);
            if (netinfo.toUpperCase() != 'NONE') {
                this.showLoginModal();
            }
        }));
    }

    handleLoginResolved(data) {
        const { navigator } = this.props;
        if(navigator) {
            navigator.replace(ViewPage.index());
        }
    }

    showLoginModal() {
        this.setState({
            modalBackdropVisiable: true
        });
    }

    onCancelPress() {
        BackAndroid.exitApp();
    }

    onLoginPress() {
        this.setState({
            modalVisiable: false
        });
        const {navigator} = this.props;
        this.timer = TimerMixin.setTimeout(() => {
            navigator.replace(ViewPage.login());
        }, 500);
    }

    onPageContentShow() {
        this.timer = TimerMixin.setTimeout(() => {
            this.checkUserToken();
        }, 1000);
    }

    onModelBackdropShow() {
        this.setState({
            modalVisiable: true
        });
    }

    renderModalBackdrop() {
        if (this.state.modalBackdropVisiable === true) {
            return (
                <Animatable.View
                    style={ ComponentStyles.modal_backdrop }
                    animation="fadeIn"
                    onAnimationEnd={()=> this.onModelBackdropShow() }
                    duration={ 500 }>
                </Animatable.View>
            )
        }
    }

    renderModalHeader() {
        return (
            <View style={ ComponentStyles.modal_header }>
                <Image
                    style={ ComponentStyles.modal_header_img }
                    source={ backgroundImageSource }/>
            </View>
        )
    }

    renderModalBody() {
        return (
            <View style={ ComponentStyles.modal_body }>
                <Text
                    style={[ CommonStyles.text_center, CommonStyles.m_b_1, CommonStyles.font_lg, CommonStyles.text_dark ]}>
                    { Config.appInfo.name }
                </Text>
                <Text
                    style={[ CommonStyles.text_center, CommonStyles.m_b_3, CommonStyles.font_md, CommonStyles.text_dark ]}>
                    { Config.appInfo.descr }
                </Text>
                <Text
                    style={[ CommonStyles.text_left, CommonStyles.m_b_1, CommonStyles.font_xs,  CommonStyles.text_dark, CommonStyles.line_height_sm ]}>
                    { hintText }
                </Text>
                <Text
                    style={[ CommonStyles.text_left, CommonStyles.text_dark, CommonStyles.font_xs, CommonStyles.line_height_sm ]}>
                    { declareText }
                </Text>
            </View>
        )
    }

    renderModalFooterLogin() {
        return (
            <TouchableOpacity
                activeOpacity={ StyleConfig.touchable_press_opacity }
                style={ [ ComponentStyles.btn, ComponentStyles.btn_primary, ComponentStyles.modal_button ] }
                onPress={()=>this.onLoginPress() }>
                <Text style={ ComponentStyles.btn_text }>
                    登录
                </Text>
            </TouchableOpacity>
        )
    }

    renderModalFooterCancel() {
        return (
            <TouchableOpacity
                activeOpacity={ StyleConfig.touchable_press_opacity }
                style={ CommonStyles.m_t_3 }
                onPress={()=>this.onCancelPress() }>
                <Text style={ CommonStyles.text_dark }>
                    放弃
                </Text>
            </TouchableOpacity>
        )
    }

    renderModalFooter() {
        return (
            <View style={ ComponentStyles.modal_footer }>
                { this.renderModalFooterLogin() }
            </View>
        )
    }

    renderModal() {
        return (
            <Modal
                animationType={ 'slide' }
                transparent={ true }
                onRequestClose={()=> null }
                visible={ this.state.modalVisiable }>
                <View style={ ComponentStyles.modal_container }>

                    { this.renderModalHeader() }
                    { this.renderModalBody() }
                    { this.renderModalFooter() }

                </View>
            </Modal>
        )
    }

    renderContent() {
        return (
            <Animatable.View
                onAnimationEnd={()=>this.onPageContentShow() }
                animation="fadeInDown">
                <Logo />
            </Animatable.View>
        )
    }

    render() {
        return (
            <View
                style={ [ ComponentStyles.container, CommonStyles.flexItemsCenter, CommonStyles.flexItemsMiddle, styles.container ] }>
                { this.renderContent() }
                { this.renderModal() }
                { this.renderModalBackdrop() }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: StyleConfig.screen_width,
        height: StyleConfig.screen_height
    }
});

export default StartupPage;