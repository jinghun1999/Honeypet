/**
 * Created by User on 2016-11-03.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    RefreshControl,
    TouchableOpacity,
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
import Icon from 'react-native-vector-icons/FontAwesome'
class P extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        let _this = this;
        NetUtil.getAuth((ret)=> {
            _this.setState({user: ret});
        }, ()=> {
            Toast.show('获取用户信息失败');
        });
    }

    logout() {
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

    renderChildren() {
        return (
            <View style={{flex:1, paddingVertical:10, backgroundColor:'#F4F4F4'}}>
                <TouchableOpacity style={styles.row} onPress={()=>{}}>
                    <Icon name="user" size={26} color="#68228B" />
                    <Text style={styles.rowText}>个人信息</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row} onPress={()=>{}}>
                    <Icon name="rocket" size={26} color="#6495ED" />
                    <Text style={styles.rowText}>我的预约记录</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.row, styles.bottom]} onPress={()=>{}}>
                    <Icon name="phone-square" size={26} color="#CD661D" />
                    <Text style={styles.rowText}>我的呼叫历史</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.row,styles.bottom,{marginTop:10,}]} onPress={()=>{}}>
                    <Icon name="cog" size={26} color="#CDCD00" />
                    <Text style={styles.rowText}>设置</Text>
                </TouchableOpacity>
                <NButton onPress={this.logout.bind(this)} backgroundColor={'#FF6666'} text="注 销"/>
            </View>
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
    container: {
        flex: 1,
    },
    row: {
        backgroundColor: '#fff',
        padding:12,
        borderTopWidth:StyleSheet.hairlineWidth,
        borderTopColor:'#ccc',
        flexDirection:'row',
        alignItems:'center'
    },
    rowText:{
        fontSize:16,
        color:'#000',
        marginLeft:20,
    },
    bottom:{borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc',}
});
export default P;