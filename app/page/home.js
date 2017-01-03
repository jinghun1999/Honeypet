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
///import PureRenderMixin from '../common/pureRender';
import ViewPage from './view';
import AMapLocation from 'react-native-amap-location';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
import NetUtil from '../util/NetUtil';
import Spinner from '../components/spinner';
import { StyleConfig, ComponentStyles, CommonStyles } from '../styles';
import { getImageSource } from '../common';
import ViewPager from 'react-native-viewpager';
/*
var TimeAgo = require('react-native-timeago');
var moment = require('moment');
require('moment/locale/zh-cn');
moment.locale('zh-cn');
const backgroundImageSource = getImageSource(8);
<TimeAgo time={'2016-11-11 12:12:22'} />
*/
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
            imageSource: [],
            dsImage: new ViewPager.DataSource({pageHasChanged: (p1, p2)=>p1 !== p2}),
            maxDistance:999999999,
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
        this.fetchData(1);
        this.loadAD();
    }

    componentWillUnmount() {
        AMapLocation.stopLocation();
        this.listener.remove();
    }

    fetchData(pageIndex) {
        const _this = this;
        NetUtil.getAuth(ret=> {
            _this.setState({user: ret});
            let param = "lng="+_this.state.location.longitude+"&lat="+_this.state.location.latitude+"&maxDistance="+_this.state.maxDistance;
            NetUtil.get(CONSTAPI.API_HOST + '/hospital/Get?'+param, null, function (data) {
                if (data && data.result && data.data) {
                    _this.setState({
                        hosList: data.data,
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

    loadAD() {
        const _this = this;
        NetUtil.get(CONSTAPI.API_HOST + '/service/getfocusads', null, function (data) {
            if (data.result) {
                if (data.data.length > 0) {
                    _this.setState({
                        imageSource: data.data,
                    });
                }
            } else {
                Toast.show("获取广告失败：" + data.error);
            }
        });
    }

    _onPush(obj) {
        const _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push(ViewPage.webpage({title: obj.title, url: obj.link}));
        }
    }

    renderPage(data) {
        return (
            <TouchableOpacity onPress={this._onPush.bind(this, data)}>
                <Image source={{uri: data.imgurl}} style={styles.page}/>
            </TouchableOpacity>
        );
    }

    _renderHead() {
        return (
            <View>
                <View style={{height: 180}}>
                    <ViewPager style={{height:150}}
                               dataSource={this.state.dsImage.cloneWithPages(this.state.imageSource)}
                               renderPage={this.renderPage.bind(this)}
                               isLoop={true}
                               autoPlay={true}/>
                </View>
                <TouchableOpacity style={styles.location} underlayColor={'#F7F7F7'} onPress={()=>{}}>
                    <Icon name={'ios-pin'} size={22} color={'#FA8072'}/>
                    <Text style={styles.positionText}>{this.state.position}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    underlayColor={'#63B8FF'}
                    style={styles.callStyle}
                    onPress={()=>{
                        this.setState({modalVisiable: true});
                        }
                    }>
                    <Icon name={'ios-call'} size={32} color={'#fff'}/>
                    <Text style={{color:'#fff', fontSize:18, marginLeft:10,}}>免费呼叫宠物医生</Text>
                </TouchableOpacity>
                <View style={styles.nearHosHead}>
                    <Text style={{flex:1}}>附近医院</Text>
                    {/*<Icon name={'ios-arrow-forward-outline'} size={14} color={'#EDEDED'}/>*/}
                </View>
            </View>
        );
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

    renderModal() {
        return (
            <Modal
                animationType={ 'slide' }
                transparent={ true }
                onRequestClose={()=> null }
                visible={ this.state.modalVisiable }>
                <View style={ ComponentStyles.modal_container  }>
                    <View style={ ComponentStyles.modal_body }>
                        <Text
                            style={[ CommonStyles.text_center, CommonStyles.m_b_1, CommonStyles.font_lg, CommonStyles.text_dark ]}>
                            您确定要免费呼叫嘛？
                        </Text>
                        <Text style={[ CommonStyles.m_b_3, CommonStyles.font_md, CommonStyles.text_dark ]}>
                            本功能为免费呼叫，待医生抢单成功后，您可以与医生沟通预约爱宠就诊。
                        </Text>
                    </View>
                    <View style={ [ComponentStyles.modal_footer,{flexDirection:'row', }] }>
                        <TouchableOpacity
                            activeOpacity={ StyleConfig.touchable_press_opacity }
                            style={ [ ComponentStyles.btn, ComponentStyles.btn_danger,{flex:1, marginRight:10} ] }
                            onPress={()=>{this.setState({modalVisiable: false,})} }>
                            <Text style={ ComponentStyles.btn_text }>
                                取消
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={ StyleConfig.touchable_press_opacity }
                            style={ [ ComponentStyles.btn, ComponentStyles.btn_primary,{flex:1, marginLeft:10} ] }
                            onPress={()=>{
                                this.setState({modalVisiable: false,});
                                this.props.navigator.push(ViewPage.message(this.state.location, this.state.user));
                            } }>
                            <Text style={ ComponentStyles.btn_text }>
                                呼叫
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView style={{backgroundColor:'#F5F5F5'}}
                          enableEmptySections={true}
                          dataSource={this.state.ds.cloneWithRows(this.state.hosList)}
                          renderHeader={this._renderHead.bind(this)}
                          renderRow={this._renderRow.bind(this)}
                          renderFooter={()=>{return <View style={{height:50,}}></View>}}
                    />
                { this.renderLoading() }
                { this.renderModal() }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    page: {
        width: Dimensions.get('window').width,
        height: 180,
        resizeMode: 'stretch'
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
        padding:1,
        margin:1,
    },
});
export default HomePage;