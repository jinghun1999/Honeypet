/**
 * Created by User on 2016-10-25.
 */
'use strict';
import React, { Component,} from 'react';
import {
    Text,
    View,
    Platform,
    TextInput,
    Image,
    Alert,
    TouchableHighlight,
    StyleSheet,
    } from 'react-native';

import {connect} from 'react-redux';

import ModalBox from 'react-native-modalbox';
import Spinner from 'react-native-spinkit';

import {logIn, skipLogin} from '../actions/user';

import commonStyle from '../styles/common';
import loginStyle from '../styles/login';


class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '0',
            password: '0',
            btnFlag: true,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {

        if (nextProps.isLoggedIn != this.props.isLoggedIn && nextProps.isLoggedIn === true) {
            //will redirect

            this.refs.modal.close();
            this.toMain();
            return false;
        }
        if (nextProps.status == 'doing') {
            //loggining
            this.refs.modal.open();
            return false;
        }
        if (nextProps.status == 'error' || nextProps.status == 'done') {
            this.refs.modal.close();
            return false;
        }

        return true;
    }

    toMain() {
        const {router} = this.props;
        router.toMain();
    }

    handleLogin() {
        if (!this.state.username || !this.state.password) {
            Alert.alert(
                'username, password?'
            );
            return;
        }
        let opt = {
            'name': this.state.username,
            'password': this.state.password,
        };
        this.props.dispatch(logIn(opt));
    }

    handleRegister() {
        const {dispatch} = this.props;
        dispatch(skipLogin());
    }

    onChangeName(text) {
        this.setState({'username': text});
    }

    onChangePswd(text) {
        this.setState({'password': text});
    }


    render() {
        return (
            <View style={[commonStyle.wrapper, loginStyle.loginWrap]}>
                {/*<Image source={require('../img/icons/bg.png')} style={{resizeMode: 'stretch'}}>
                 <View style={loginStyle.loginMain}>
                 <View style={loginStyle.loginMainCon}>
                 <View style={loginStyle.comCulture}>
                 <Text style={[commonStyle.textCenter,{color:'#ccc'}]}>Welcome</Text>
                 <Text style={[commonStyle.textCenter,{color:'#ccc'}]}>You are the best.</Text>
                 </View>
                 <View style={loginStyle.formStyle}>
                 <View style={[loginStyle.formInput,loginStyle.formInputSplit]}>
                 <Image source={require('../img/icons/user.png')} style={{width:25,height:25,resizeMode: 'contain'}}/>
                 <TextInput
                 ref="login_name"
                 placeholder='username'
                 style={loginStyle.loginInput}
                 onChangeText={this.onChangeName.bind(this)} />
                 </View>
                 <View style={loginStyle.formInput}>
                 <Image source={require('../img/icons/passicon.png')} style={{width:25,height:25,resizeMode: 'contain'}}/>
                 <TextInput
                 ref="login_psw"
                 style={loginStyle.loginInput}
                 secureTextEntry={true}
                 placeholder='password'
                 onChangeText={this.onChangePswd.bind(this)} />
                 </View>
                 <View style={{alignItems: 'flex-end'}}>
                 <View style={loginStyle.forget}>
                 <View>
                 <Image source={require('../img/icons/prompt.png')} style={{width:15,height:15,resizeMode: 'contain',marginRight:10}}/>
                 </View>
                 <View >
                 <Text style={{color:'#62a2e0', backgroundColor: 'white'}}>forget password?</Text>
                 </View>
                 </View>
                 </View>
                 </View>
                 <View style={loginStyle.btn}>
                 <View style={loginStyle.btnWrap}>
                 <Text style={loginStyle.loginBtn1} onPress={this.handleLogin.bind(this)}>Log in</Text>
                 </View>
                 <View style={loginStyle.btnWrap}>
                 <Text style={loginStyle.loginBtn2} onPress={this.handleRegister.bind(this)}>Skip</Text>
                 </View>
                 </View>
                 </View>
                 </View>

                 </Image>*/}
                <View style={styles.container}>
                    <Image source={}
                    <View style={styles.marginTopview}/>
                    <View style={styles.inputview}>
                        <TextInput underlineColorAndroid='transparent' style={styles.textinput} ref="login_name"
                                   placeholder='手机号' onChangeText={this.onChangeName.bind(this)}/>
                        <View style={styles.dividerview}>
                            <Text style={styles.divider}></Text>
                        </View>
                        <TextInput underlineColorAndroid='transparent' style={styles.textinput} ref="login_psw"
                                   placeholder='密码'
                                   secureTextEntry={true} onChangeText={this.onChangePswd.bind(this)}/>
                    </View>
                    <View style={styles.bottomview}>
                        <TouchableHighlight style={styles.buttonview} underlayColor={'#A020F0'} onPress={this.handleLogin.bind(this)}>
                            <Text style={styles.logintext}>登 录</Text>
                        </TouchableHighlight>
                        <View style={styles.bottombtnsview}>
                            <TouchableHighlight style={styles.bottomleftbtnview}>
                                <Text style={styles.bottombtn}>无法登录？</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.bottomrightbtnview}>
                                <Text style={styles.bottombtn}>新用户</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                <ModalBox style={[commonStyle.modal,commonStyle.justAlign]}
                          ref={"modal"} backdropPressToClose={false}
                          animationDuration={10}
                          backdrop={true}
                          backdropOpacity={0}
                    >
                    <Spinner style={commonStyle.spinner}
                             isVisible={true}
                             size={50} type="Arc" color="#FFFFFF"/>
                </ModalBox>


            </View>
        );
    }
}


function select(store) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        user: store.userStore.user,
        status: store.userStore.status,
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        height: 50,
        backgroundColor: '#12B7F5',
        justifyContent: 'center',
    },
    headtitle: {
        alignSelf: 'center',
        fontSize: 20,
        color: '#ffffff',
    },
    avatarview: {
        height: 150,
        backgroundColor: '#ECEDF1',
        justifyContent: 'center',
    },
    avatarimage: {
        width: 100,
        height: 100,
        alignSelf: 'center'
    },
    marginTopview: {
        height: 15,
        backgroundColor: '#F7F7F9'
    },
    inputview: {
        height: 100,
    },
    textinput: {
        flex: 1,
        fontSize: 16,
    },
    dividerview: {
        flexDirection: 'row',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ECEDF1'
    },
    bottomview: {
        backgroundColor: '#ECEDF1',
        flex: 1,
    },
    buttonview: {
        backgroundColor: '#1DBAF1',
        margin: 10,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logintext: {
        fontSize: 17,
        color: '#FFFFFF',
        marginTop: 10,
        marginBottom: 10,
    },
    emptyview: {
        flex: 1,
    },
    bottombtnsview: {
        flexDirection: 'row',
    },
    bottomleftbtnview: {
        flex: 1,
        height: 50,
        paddingLeft: 10,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    bottomrightbtnview: {
        flex: 1,
        height: 50,
        paddingRight: 10,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    bottombtn: {
        fontSize: 15,
        color: '#1DBAF1',
    }
});

export default connect(select)(LoginPage);