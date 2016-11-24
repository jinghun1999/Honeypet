/**
 * Created by tuorui on 2016/11/22.
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
} from 'react-native';
import NetUtil from '../util/NetUtil';
import Toast from 'react-native-root-toast';
import Navbar from '../components/navbar';
import Util from '../util/Util';
class Appoint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            page: 1,
            phone: 123,
            dataSource: [],
        };
    }

    componentDidMount() {
        this.fetchData(this.state.page, this.state.phone, false);
    }

    fetchData(page, phone, isNext) {
        //http://test.tuoruimed.com:802/api/bill/getbills?page=1&phone=123
        const _this = this;
        NetUtil.get(CONSTAPI.API_HOST+'bill/getbills?page=' + page + '&phone=' + phone, null, function (data) {
            if (data.result) {
                let dataSource = data.data;
                if (isNext) {
                    data.data.forEach((d)=> {
                        dataSource.push(d)
                    })
                } else {
                    dataSource = data.data;
                }
                _this.setState({
                    dataSource: dataSource,
                })
            } else {
                Toast.show('数据获取失败');
            }
        })
    }

    onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onPress(app) {
        alert(app.entname)
    }

    _renderRow(app) {
        return (
            <TouchableOpacity style={styles.row} onPress={()=>this._onPress(app)}>
                <View style={styles.calendar}>
                    <Text style={styles.month}>
                        <Text style={styles.day}>{Util.GetDatePart(app.requesttime,'day')} </Text>
                        {Util.GetDatePart(app.requesttime,'month')}月</Text>
                    <Text style={styles.year}>{Util.GetDatePart(app.requesttime,'year')}年</Text>
                </View>
                <View style={{flex:1,justifyContent:'center',margin:5,}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>{app.entname}</Text>
                        <Text>手机:{app.entphone}</Text>
                    </View>
                    <View style={{marginTop:5,flexDirection:'row'}}>
                        <Text>描述:{app.describe}</Text>
                    </View>
                </View>
                {app.state===0?<Text style={styles.success}>已接单</Text>
                    :<Text style={styles.fail}>未接单</Text>}
            </TouchableOpacity>
        )
    }

    renderChildren() {
        return (
            <ListView enableEmptySections={true}
                      dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                      renderRow={this._renderRow.bind(this)}
            />
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
    container: {
        flex: 1,
        backgroundColor:'#F0F0F0',
    },
    success:{
        marginRight:5,
        textAlign:'center',
        alignSelf:'center',
        color:'#4F9D9D',
    },
    fail:{
        marginRight:5,
        textAlign:'center',
        alignSelf:'center',
        color:'#EE4000',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        margin: 5,
    },
    calendar: {
        borderWidth:StyleSheet.hairlineWidth,
        borderColor: '#d0d0d0',
        flexDirection: 'column',
        margin: 5,

    },
    day: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    month: {
        fontSize: 10,
        margin: 1,
        flexDirection: 'row',
    },
    year: {
        textAlign: 'center',
        fontSize: 13,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#d0d0d0',
        margin: 2,
    },
})
export default Appoint;