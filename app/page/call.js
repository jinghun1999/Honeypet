/**
 * Created by tuorui on 2016/11/22.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ListView,
    Dimensions,
} from 'react-native';
import NetUtil from '../util/NetUtil';
import Toast from 'react-native-root-toast';
import Navbar from '../components/navbar';
import Util from '../util/Util';
import Icon from 'react-native-vector-icons/FontAwesome';
const width=Dimensions.get('window').width;
class Call extends Component {
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
        const _this =this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push(ViewPage.calldetail({title:'呼叫详情',callDetail:app}));
        }
    }

    _renderRow(call) {
        return (
            <TouchableOpacity style={styles.row} onPress={()=>this._onPress(call)}>
                <View style={styles.calendar}>
                    <Text style={styles.month}>
                        <Text style={styles.day}>{Util.GetDatePart(call.requesttime,'day')} </Text>
                        {Util.GetDatePart(call.requesttime,'month')}月</Text>
                    <Text style={styles.year}>{Util.GetDatePart(call.requesttime,'year')}年</Text>
                </View>
                <View style={{flex:1,justifyContent:'center',margin:5,}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1,fontSize:16,fontWeight:'bold'}}>{call.entname}</Text>
                    </View>
                    <View style={{marginTop:5,flexDirection:'row'}}>
                        <Text style={{width:width-100}}>{call.describe}</Text>
                    </View>
                </View>
                {call.state===0?<Text style={styles.stated}>已接单</Text>
                    :<Text style={[styles.stated,{backgroundColor:'#EE4000'}]}>未接单</Text>}
                <Icon style={{marginRight:5,}} name={'angle-right'} size={20} color={'#ccc'}/>
            </TouchableOpacity>
        )
    }

    _endReached(){
        this.fetchData(this.state.page + 1,this.state.phone,  true);
    }

    renderChildren() {
        return (
            <ListView enableEmptySections={true}
                      dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                      renderRow={this._renderRow.bind(this)}
                      onEndReached={this._endReached.bind(this)}
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
    stated:{
        position:'absolute',
        top:5,
        right:15,
        color:'#FFF5EE',
        fontSize:14,
        backgroundColor:'#FF7F24',
        padding:2,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        margin: 5,
        justifyContent:'center',
        alignItems:'center',
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
export default Call;