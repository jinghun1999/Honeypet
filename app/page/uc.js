/**
 * Created by User on 2016-11-03.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    RefreshControl,
    TouchableHighlight,
    Text,
    Alert,
    StyleSheet,
    } from 'react-native';
import ViewPage from './view';
import Config, { storageKey } from '../config';
import UserHead from '../components/header/user';
import NButton from '../components/NButton';
import NetUtil from '../util/NetUtil';
import Toast from 'react-native-root-toast';
class UC extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user:{}
        };
    }

    componentDidMount() {
        let _this = this;
        NetUtil.getAuth((ret)=>{
            _this.setState({user: ret});
        },()=>{
            Toast.show('获取用户信息失败');
        });
    }
    logout(){
        let _this = this;
        Alert.alert(
            '注销提示',
            '您确定要注销登陆吗？',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                {
                    text: '确定', onPress: () => {
                    storage.remove({key: storageKey.USER_TOKEN});
                    const { navigator } = _this.props;
                    if (navigator) {
                        navigator.replace(ViewPage.startup());
                    }
                }
                },
            ]
        )
    }
    renderChildren(){
        return (
            <NButton onPress={this.logout.bind(this)} backgroundColor={'#FF6666'} text="注 销"/>
        );
    }
    render() {
        return (
            <View style={styles.container}>
                <UserHead user={this.state.user}>
                    {this.renderChildren()}
                </UserHead>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})
export default UC;