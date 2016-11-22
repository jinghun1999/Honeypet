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
    } from 'react-native';
import _ from 'lodash';
import Head from '../components/head';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-root-toast';
import Navbar from '../components/navbar';

import NetUtil from '../util/NetUtil';
import Picker from 'react-native-picker';
import BackAndroidTool from '../util/BackAndroidTool';
class UserInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            usrsex: '0'
        };
    }

    componentDidMount() {
        BackAndroidTool.customHandleBack(this.props.navigator, ()=>{})
        InteractionManager.runAfterInteractions(() => {
            NetUtil.getAuth((ret)=> {
                this.setState({
                    user: ret,
                })
            });
        });
    }
    chooseSex(){
        let data = ['男','女'];
        Picker.init({
            pickerData: data,
            selectedValue: [''],
            onPickerConfirm: data => {
                Toast.show(data);
            },
            onPickerCancel: data => {
                Toast.show(data);
            },
            onPickerSelect: data => {
                Toast.show(data);
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

    render() {
        return (
            <View style={styles.container}>
                <Navbar title={'设置'} leftIconOnPress={this.onBack.bind(this)}/>
                <View style={{height:150, justifyContent:'center', alignItems:'center'}}>
                    <Image source={{uri: this.state.user.userhead}} style={{width:100, height:100, borderRadius:50}}
                           resizeMode='contain'/>
                    <Text>
                        {this.state.user.phone}
                    </Text>
                </View>
                <Text>{JSON.stringify(this.state.user)}</Text>
                <View style={styles.row}>
                    <Text style={styles.rowText}>昵称</Text>
                    <Text style={styles.rowValue}>{this.state.user.nickname}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>姓名</Text>
                    <Text style={styles.rowValue}>{this.state.user.realname}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>手机</Text>
                    <Text style={styles.rowValue}>{this.state.user.phone}</Text>
                </View>
                <TouchableOpacity style={styles.row}onPress={this.chooseSex}>
                    <Text style={styles.rowText}>性别</Text>
                    <Text style={styles.rowValue}>{this.state.user.usersex}</Text>
                </TouchableOpacity>

                {/*<TouchableOpacity style={styles.row} onPress={()=>{this.props.navigator.push(ViewPage.feedback())}}>
                 <Text style={styles.rowText}>意见反馈</Text>
                 <Icon name="angle-right" size={16} color="#ccc" />
                 </TouchableOpacity>*/}
                <TouchableOpacity style={styles.row}
                                  onPress={()=>{this.props.navigator.push(ViewPage.setting_detail({title:'关于'}))}}>
                    <Text style={styles.rowText}>关于</Text>
                    <Icon name="angle-right" size={16} color="#ccc"/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.row,styles.bottom]} onPress={()=>{Toast.show('已是最新版本')}}>
                    <Text style={styles.rowText}>版本更新</Text>
                    <Icon name="angle-right" size={16} color="#ccc"/>
                </TouchableOpacity></View>
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
        fontSize:12,
        color:'#555',
    },
});
module.exports = UserInfo;