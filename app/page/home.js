'use strict';
import React, { Component ,PropTypes} from 'react';
import {
    View,
    RefreshControl,
    Text,
    TouchableHighlight,
    StyleSheet,
    ListView,
    Image,
    } from 'react-native';
//import PureRenderMixin from 'react-addons-pure-render-mixin';
import ViewPage from './view';
import AMapLocation from 'react-native-amap-location';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
import NetUtil from '../util/NetUtil';
import Hospital from './hospital';
import Spinner from '../components/spinner';
import { StyleConfig, ComponentStyles, CommonStyles } from '../styles';
class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            hosList: [],
            location: {},
            position: '点击重新获取您的位置',
            dataString: null,
            loaded: false,
        };
        //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        const _this = this;
        this.listener = AMapLocation.addEventListener((data) => {
            if (data.address != '') {
                _this.setState({
                    location: data,
                    position: data.address,
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
    }

    componentWillUnmount() {
        AMapLocation.stopLocation();
        this.listener.remove();
    }

    fetchData(pageIndex) {
        const _this = this;
        NetUtil.getAuth(function (ret) {
            NetUtil.postJson(CONSTAPI.API_HOST + '/hospital', {
                pageIndex: pageIndex,
                pageSize: 35
            }, null, function (data) {
                if (data && data.Sign && data.Message) {
                    _this.setState({
                        hosList: data.Message,
                        loaded: true,
                    })
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
            <View>
                <View style={{height: 180}}>
                    <Image
                        resizeMode={'stretch'}
                        style={{flex:1,overflow: 'visible'}}
                        source={{uri: 'http://img.zcool.cn/community/019a9e554b3fbd000001bf72ac0029.jpg'}}
                        />
                </View>
                <TouchableHighlight underlayColor={'#F7F7F7'} onPress={this.onLocation.bind(this)}>
                    <View style={styles.location}>
                        <Icon name={'ios-pin'} size={22} color={'#FA8072'}/>
                        <Text style={styles.positionText}>{this.state.position}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#6495ED'}
                    style={styles.callStyle}
                    onPress={()=>{this.props.navigator.push(ViewPage.message())}}>
                    <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
                        <Icon name={'ios-call'} size={32} color={'#fff'}/>
                        <Text style={{color:'#fff', fontSize:18, marginLeft:10,}}>免费呼叫宠物医生</Text>
                    </View>
                </TouchableHighlight>
                <View style={styles.nearHosHead}>
                    <Text style={{flex:1}}>附近医院</Text>
                    {/*<Icon name={'ios-arrow-forward-outline'} size={14} color={'#EDEDED'}/>*/}
                </View>
            </View>
        );
    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableHighlight underlayColor={'#EBEBEB'} style={styles.row}
                                onPress={this._onRowPress.bind(this, rowData)}>
                <View style={{flexDirection:'row', flex:1,}}>
                    <Image source={{uri:rowData.HeadPic}}
                           style={{width:80, height:60, marginRight:5,}}/>
                    <View style={{flex:1,}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:16, flex:1,}}>{rowData.HospitalName}</Text>
                            <Text style={styles.distanceText}>{rowData.Distance} km</Text>
                        </View>

                        <Text><Icon name={'ios-call'} size={14} color={'#999'}/> {rowData.Tel}</Text>
                        <Text><Icon name={'ios-pin'} size={14} color={'#999'}/> {rowData.Address}</Text>
                    </View>
                </View>
            </TouchableHighlight>
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
        marginHorizontal: 10,
        marginVertical: 15,
        borderRadius: 3,
        backgroundColor: '#87CEFF',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nearHosHead: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderTopWidth: 1,
        borderTopColor: '#EDEDED',
        borderBottomWidth: 1,
        borderBottomColor: '#EDEDED',
        backgroundColor: '#fff',
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
});
export default HomePage;