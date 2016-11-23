/**
 * Created by User on 2016-11-15.
 */
'use strict';
import React, { Component ,PropTypes} from 'react';
import {
    View,
    RefreshControl,
    Text,
    TouchableOpacity,
    StyleSheet,
    ListView,
    Image,
    InteractionManager,
    TextInput,
    Modal,
    } from 'react-native';
import _ from 'lodash';
import Head from '../components/head';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-root-toast';
import Navbar from '../components/navbar';
import { CommonStyles, ComponentStyles, StyleConfig } from '../styles';
import NetUtil from '../util/NetUtil';
import Picker from 'react-native-picker';
import BackAndroidTool from '../util/BackAndroidTool';
import NButton from '../components/NButton';

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        };
    }

    componentDidMount() {
        BackAndroidTool.customHandleBack(this.props.navigator, ()=> {
        })
        InteractionManager.runAfterInteractions(() => {
            NetUtil.getAuth((ret)=> {
                this.setState({
                    user: ret,
                });
            });
        });
    }

    chooseSex() {
        let data = ['男', '女'];
        let _this = this;
        Picker.init({
            pickerData: data,
            selectedValue: [''],
            onPickerConfirm: s => {
                let user = _this.state.user;
                user.usersex = s;
                _this.setState({user: user});
            },
            onPickerCancel: s => {
                Toast.show(s);
            },
            onPickerSelect: s => {
                //Toast.show('select:' + s);
            }
        });
        Picker.show();
    }

    onBack() {
        let {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    onSave() {
        let _this = this;
        NetUtil.postJson(CONSTAPI.LOGIN, _this.state.user, null, (data)=> {
            if (data && data.result) {
                Toast.show('保存成功');
            } else if (data) {
                alert(data.error+JSON.stringify(_this.state.user));
            } else {
                Toast.show('系统异常，请稍后再试');
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Navbar title={'个人信息'}
                        leftIconOnPress={this.onBack.bind(this)}
                        rightText={'保存'}
                        rightIconOnPress={this.onSave.bind(this)}
                    />
                <View style={{height:150, justifyContent:'center', alignItems:'center'}}>
                    <Image source={{uri: this.state.user.userhead}} style={{width:100, height:100, borderRadius:50}}
                           resizeMode='contain'/>
                    <Text style={{fontSize:16, fontWeight:'bold'}}>
                        {this.state.user.phone}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.rowText}>用户昵称</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={styles.input}
                        value={this.state.user.nickname}
                        maxLength={20}
                        onChangeText={(text) => {
                            let a = this.state.user;
                            a.nickname = text;
                            this.setState({user: a});
                        }}
                        />
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>真实姓名</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={styles.input}
                        value={this.state.user.realname}
                        maxLength={20}
                        onChangeText={(text) => {
                            let a = this.state.user;
                            a.realname = text;
                            this.setState({user: a});
                        }}
                        />
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>手机号码</Text>
                    <Text style={styles.rowValue}>{this.state.user.phone}</Text>
                </View>
                <TouchableOpacity style={styles.row} onPress={this.chooseSex.bind(this)}>
                    <Text style={styles.rowText}>性别</Text>
                    <Text style={styles.rowValue}>{this.state.user.usersex}</Text>
                </TouchableOpacity>
                <View style={[styles.row,styles.bottom]}>
                    <Text style={styles.rowText}>我的积分</Text>
                    <Text style={styles.rowValue}>{this.state.user.integral}</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5'
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
        alignItems: 'center'
    },
    rowText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    rowValue: {
        fontSize: 12,
        color: '#555',
    },
    input: {
        flex: 1, height: 30, borderWidth: 0, textAlign: 'right',
        paddingRight: 0,
        fontSize: 12,
        color: '#333'
    },
});
module.exports = UserInfo;