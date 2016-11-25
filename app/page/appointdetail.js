/**
 * Created by tuorui on 2016/11/24.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Alert,
    StyleSheet,
    ListView,
    Image,
} from 'react-native';
import Navbar from '../components/navbar';
class AppointDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appDetail:this.props.appDetail,
        }
    }
    componentDidMount() {
    }
    onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    renderChildren(){
        return(
            <View style={{flex:1,}}>
            <View style={styles.titleRow}>
                <Text style={styles.titleText}> 订单详情</Text>
                </View>
                <View style={[styles.row, styles.paddingV]}>
                    <Text style={styles.rowText}>名称:</Text>
                    <Text style={styles.rowValue}>{this.state.appDetail.entname}</Text>
                </View>
                <View style={[styles.row, styles.paddingV]}>
                    <Text style={styles.rowText}>手机:</Text>
                    <Text style={styles.rowValue}>{this.state.appDetail.entphone}</Text>
                </View>
                <View style={[styles.row, styles.paddingV]}>
                    <Text style={styles.rowText}>宠物:</Text>
                    <Text style={styles.rowValue}>{this.state.appDetail.requestpet}</Text>
                </View>
                <View style={[styles.row, styles.paddingV]}>
                    <Text style={styles.rowText}>地址:</Text>
                    <Text style={styles.rowValue}>{this.state.appDetail.entaddress}</Text>
                </View>
                <View style={[styles.row, styles.paddingV]}>
                    <Text style={styles.rowText}>请求时间:</Text>
                    <Text style={styles.rowValue}>{this.state.appDetail.requesttime}</Text>
                </View>
                <View style={[styles.row, styles.paddingV]}>
                    <Text style={styles.rowText}>应答时间:</Text>
                    <Text style={styles.rowValue}>{this.state.appDetail.responsetime}</Text>
                </View>
                <View style={[styles.row, styles.paddingV]}>
                    <Text style={styles.rowText}>接单状态:</Text>
                    <Text style={styles.rowValue}>{this.state.appDetail.state==0?'已接单':'未接单'}</Text>
                </View>
                <View style={[styles.row, styles.paddingV]}>
                    <Text style={styles.rowText}>详细描述:</Text>
                    <Text style={styles.rowValue}>
                        {this.state.appDetail.describe}{'\n'}
                    </Text>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <Navbar title={this.props.title} leftIconOnPress={this.onBack.bind(this)}/>
                {this.renderChildren()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#dcdcdc',
        flex:1,
    },
    titleRow:{
        height:40,
        backgroundColor:'#fff',
        justifyContent:'center',
        marginBottom:10,
    },
    titleText:{
        fontSize:18,
        color:'#DC143C',
        marginLeft:10,
        paddingLeft:5,
        borderLeftWidth:5,
        borderLeftColor:'#FA8072',
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
        alignItems: 'center'
    },
    paddingV: {
        paddingVertical: 15,
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
});
export default AppointDetail;