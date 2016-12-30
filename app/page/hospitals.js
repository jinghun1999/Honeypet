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
    Modal,
    Dimensions,
} from 'react-native';
//import PureRenderMixin from 'react-addons-pure-render-mixin';
import ViewPage from './view';
import AMapLocation from 'react-native-amap-location';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
import NetUtil from '../util/NetUtil';
import Spinner from '../components/spinner';
import Navbar from '../components/navbar';
import { StyleConfig, ComponentStyles, CommonStyles } from '../styles';
import { getImageSource } from '../common';
const { height, width } = Dimensions.get('window');
const backgroundImageSource = getImageSource(8);

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            hosList: [],
            location: {
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
            position: '点击重新获取您的位置',
            dataString: null,
            loaded: false,
            modalVisiable: false,
            pageIndex:1,
        };
        //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        const _this = this;

        this.listener = AMapLocation.addEventListener((data) => {
            //Toast.show(JSON.stringify(data))
            if (data.latitude !== null) {
                _this.setState({
                    location: data,
                    position: data.address ? data.address : '未知位置',
                });
            } else {
                _this.setState({
                    location: {},
                    position: '定位失败，请点击重新定位',
                })
            }
        });
        this.onLocation();
        this.fetchData(this.state.pageIndex);
    }

    componentWillUnmount() {
        AMapLocation.stopLocation();
        this.listener.remove();
    }

    fetchData(pageIndex) {
        const _this = this;
        NetUtil.getAuth(ret=> {
            _this.setState({user: ret});
            NetUtil.get(CONSTAPI.API_HOST + '/hospital/gethospitals?pageindex='+pageIndex, null, function (data) {
                if (data && data.result && data.data) {
                    var dataSource = data.data;
                    if(pageIndex!==1){
                        data.data.forEach((d)=>{
                            dataSource.push(d)
                        })
                    }
                    _this.setState({
                        hosList: dataSource,
                        loaded: true,
                    });
                } else {
                    if (__DEV__) {
                        Toast.show(JSON.stringify(data));
                    } else {
                        Toast.show('获取医院列表失败');
                    }
                }
            });
        }, function (err) {
            Toast.show(err);
        });
    }

    onLocation() {
        AMapLocation.startLocation({
            accuracy: 'HighAccuracy',
            killProcess: true,
            needDetail: true,
        });
    }

    _onRowPress(data) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push(ViewPage.hospital(data));
        }
    }

    _renderHead() {
        return (
            <View style={styles.head}>
                <Text style={styles.headText}>附近医院</Text>
            </View>
        );
    }

    _endReached(){
        this.fetchData(this.state.pageIndex+1);
    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity underlayColor={'#EBEBEB'} style={styles.row}
                              onPress={this._onRowPress.bind(this, rowData)}>

                <Image source={{uri:rowData.Headpic}}
                       style={{width:80, height:60, marginRight:5,}}/>
                <View style={{flex:1,}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:16, flex:1,}}>{rowData.FullName}</Text>
                        <Text style={styles.distanceText}>{rowData.Distance} km</Text>
                    </View>

                    <Text><Icon name={'ios-call'} size={14} color={'#999'}/> {rowData.TelPhone}</Text>
                    <Text><Icon name={'ios-pin'} size={14} color={'#999'}/> {rowData.Address}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderLoading() {
        if (this.state.loaded !== true) {
            return (
                <Spinner style={ ComponentStyles.pending_container }/>
            )
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <ListView style={{backgroundColor:'#F5F5F5'}}
                          enableEmptySections={true}
                          dataSource={this.state.ds.cloneWithRows(this.state.hosList)}
                          renderHeader={this._renderHead.bind(this)}
                          renderRow={this._renderRow.bind(this)}
                          onEndReached={this._endReached.bind(this)}
                          renderFooter={()=>{return <View style={{height:50,}}></View>}}
                />
                { this.renderLoading() }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    location: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EDEDED',
        borderBottomWidth: 1,
        borderBottomColor: '#EDEDED',
        height: 40,
        backgroundColor: '#fff',
    },
    positionText: {
        paddingLeft: 5,
        fontSize: 14,
        color: '#FA8072',
    },
    callStyle: {
        flex: 1, flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        marginVertical: 15,
        borderRadius: 3,
        backgroundColor: '#87CEFF',
        paddingVertical: 10,
    },
    nearHosHead: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,

        backgroundColor: '#fff',
        borderLeftWidth: 5,
        borderLeftColor: '#EE4000'
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        marginTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#EDEDED',
        borderBottomWidth: 1,
        borderBottomColor: '#EDEDED',
    },
    distanceText: {
        textAlign: 'center',
        backgroundColor: '#FF8247',
        color: '#fff',
        width: 50
    },
    head:{
        height:50,
        width:width,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent:'center',
        paddingLeft:10,
    },
    headText:{
        color:'rgba(255, 255, 255, 1)',
        fontSize:18,
    },
});
export default HomePage;