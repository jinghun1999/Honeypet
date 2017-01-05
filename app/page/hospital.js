/**
 * Created by User on 2016-11-07.
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
    InteractionManager
    } from 'react-native';
//import HomeHead from '../components/header/home';
import Head from '../components/head';
import AMapLocation from 'react-native-amap-location';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';
import NetUtil from '../util/NetUtil';
import Icons from 'react-native-vector-icons/FontAwesome';
import { StyleConfig, ComponentStyles, CommonStyles } from '../styles';
class Hospital extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: this.props.hospital,
            entid: this.props.hospital.Id,
            loaded: false,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataSource: [],
            location:{
                accuracy: 29,
                adCode: "310114",
                address: "上海市嘉定区嘉三路靠近同济大学嘉定校区华楼",
                altitude: 0,
                bearing: 0,
                city: "上海市",
                cityCode: "021",
                country: "中国",
                district: "嘉定区",
                latitude: 31.285728,
                locationDetail: "-1",
                locationType: 4,
                longitude: 121.217404,
                poiName: "同济大学嘉定校区华楼",
                provider: "lbs",
                province: "上海市",
                satellites: 0,
                speed: 0,
                street: "嘉松北路",
                streetNum: "6128号"
            },
        };
    }

    componentDidMount() {
        let _this =this;
        this.listener = AMapLocation.addEventListener((data) => {
            if (data.latitude !== null) {
                _this.setState({
                    location: data,
                });
            } else {
                _this.setState({
                    location: {},
                })
            }
        });
        InteractionManager.runAfterInteractions(() => {
            this._loading();
        });
    }

    componentWillUnmount() {
        AMapLocation.stopLocation();
        this.listener.remove();
    }

    _loading() {
        //http://test.tuoruimed.com:802/api/Hospital/GetNearDoctors?lng=121.50006&lat=31.239682&maxDistance=999999999
        //http://test.tuoruimed.com:802/api/Hospital/GetDoctors?r=9A2DA24E-822F-4C94-9E02-6919A4F9C398
        let _this = this;
        NetUtil.get(CONSTAPI.API_HOST + 'Hospital/GetDoctors?r=' + _this.state.entid, null, function (data) {
            if (data.result) {
                let dataSource = data.data;
                _this.setState({
                    dataSource: dataSource,
                    loaded: true,
                })
            } else {
                Toast.show('数据获取失败');
                _this.setState({loaded: true,})
            }
        });
    }

    onBack() {
        let {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onPress(row) {
        const _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push(ViewPage.doctor({title: '医生详情', docData: row}));
        }
    }

    _renderRow(row) {
        var isOnLine = row.connectionid,onLine="在线";
        if(isOnLine==null || isOnLine == ""){
            onLine = "离线";
        }
        return (
            <TouchableOpacity style={styles.row} onPress={()=>this._onPress(row)}>
                <View style={{flexDirection:'column',marginLeft:15,alignSelf:'center',}}>
                    <Image source={{uri:row.head}}
                           style={{height:50,width:50,borderRadius:30,borderColor:'#ccc',borderWidth:1,}}/>
                    <Text style={{textAlign:'center',fontSize:14,}}>{row.name}</Text>
                </View>
                <View style={{flex:1,flexDirection:'column',}}>
                    <View style={{flexDirection:'row',margin:10,padding:5,borderBottomColor:'#ccc',borderBottomWidth:1,}}>
                        <Icons style={{marginRight:10}} name={'star'} size={20} color={'#87CEFA'}/>
                        <Text style={{marginRight:30}}>{row.position}({onLine})</Text>
                        <Icons style={{marginRight:10}} name={'fire'} size={20} color={'#EE4000'}/>
                        <Text style={{marginRight:30}}>{row.hot}</Text>
                    </View>
                    <View style={{flexDirection:'row',padding:5,marginLeft:10,}}>
                        <Icons style={{marginRight:10}} name={'hospital-o'} size={20} color={'#9BCD9B'}/>
                        <Text style={{marginRight:10,}}>{row.entname}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderHeader() {
        return (<View>
            <View style={{height:200,}}>
                <Image source={{uri:this.state.info.Headpic}} resizeMode={'stretch'} style={{flex:1,}}/>
            </View>
            <View style={styles.title}>
                <Text style={{flex:1,fontSize:18}}>{this.state.info.FullName}</Text>
            </View>
            <View style={{padding:10, marginVertical:10, backgroundColor:'#fff'}}>
                <Text>{this.state.info.Description}</Text>
            </View>
            <View style={{padding:10, backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#EDEDED'}}>
                <Text><Icon name={'ios-call'} size={18} color={'#FA8072'}/> {this.state.info.TelPhone}</Text>
            </View>
            <View style={{padding:10, backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#EDEDED'}}>
                <Text><Icon name={'ios-pin'} size={18} color={'#FA8072'}/> {this.state.info.Address}</Text>
            </View>
            <View style={[styles.title,{marginTop:5}]}>
                <Text style={{flex:1}}>医生列表</Text>
            </View>
        </View>)
    }

    render() {
        var listView = <Spinner style={ ComponentStyles.pending_container }/>;
        if (this.state.loaded) {
            listView = <ListView enableEmptySections={true}
                                 dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                                 renderHeader={this.renderHeader.bind(this)}
                                 renderRow={this._renderRow.bind(this)}
                                 renderFooter={()=>{return <View style={{height:50,}}></View>}}
                />
        }
        return (
            <View style={styles.container}>
                <Navbar title={'医院详情'} leftIconOnPress={this.onBack.bind(this)}/>
                {listView}
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
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginTop: 5,
        justifyContent: 'flex-start',
        height: 100,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: '#fff',
        borderLeftWidth: 5,
        borderLeftColor: '#FA8072',
    },

});
export default Hospital;