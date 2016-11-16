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
    } from 'react-native';
import Head from '../components/head';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-root-toast';
import Navbar from '../components/navbar';
class Setting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            info: {},
        };
    }

    componentDidMount() {

    }
    onBack(){
        let {navigator} = this.props;
        if(navigator){
            navigator.pop();
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Navbar title={'设置'} leftIconOnPress={this.onBack.bind(this)}/>
                <View style={{height:150, justifyContent:'center', alignItems:'center'}}>
                    <Image source={require('../img/logo.png')} style={{height:100}} resizeMode='contain'/>
                    <Text>
                        当前版本：V1.0.1
                    </Text>
                </View>
                <TouchableOpacity style={styles.row} onPress={()=>{}}>
                    <Text style={styles.rowText}>版本更新</Text>
                    <Icon name="angle-right" size={16} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.row} onPress={()=>{}}>
                    <Text style={styles.rowText}>协议</Text>
                    <Icon name="angle-right" size={16} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.row} onPress={()=>{this.props.navigator.push(ViewPage.feedback())}}>
                    <Text style={styles.rowText}>意见反馈</Text>
                    <Icon name="angle-right" size={16} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.row,styles.bottom]} onPress={()=>{this.props.navigator.push(ViewPage.setting_detail({title:'关于'}))}}>
                    <Text style={styles.rowText}>关于</Text>
                    <Icon name="angle-right" size={16} color="#ccc" />
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#F5F5F5'
    },
    row: {
        flexDirection:'row',
        backgroundColor: '#fff',
        padding:12,
        borderTopWidth:StyleSheet.hairlineWidth,
        borderTopColor:'#ccc',
        alignItems:'center'
    },
    rowText:{
        flex:1,
        fontSize:16,
        color:'#000',
    },
});
export default Setting;