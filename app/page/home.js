'use strict';
import React, { Component ,PropTypes} from 'react';
import {
    View,
    RefreshControl,
    Text,
    TouchableHighlight,
    StyleSheet,
    } from 'react-native';

//import PureRenderMixin from 'react-addons-pure-render-mixin';
import ViewPage from './view';
import AMapLocation from 'react-native-amap-location';
import Icon from 'react-native-vector-icons/Ionicons';

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            location: {},
            position: '点击重新获取您的位置',
            dataString: null,
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
    }

    componentWillUnmount() {
        AMapLocation.stopLocation();
        this.listener.remove();
    }

    onLocation() {
        AMapLocation.startLocation({
            accuracy: 'HighAccuracy',
            killProcess: true,
            needDetail: true,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight underlayColor={'#F7F7F7'} onPress={this.onLocation.bind(this)}>
                    <View style={styles.location}>
                        <Icon name={'ios-pin'} size={22} color={'#FA8072'}/>
                        <Text style={styles.positionText}>{this.state.position}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#6495ED'}
                    style={styles.callStyle}
                    onPress={()=>{}}>
                    <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
                        <Icon name={'ios-call'} size={32} color={'#fff'}/>
                        <Text style={{color:'#fff', fontSize:18, marginLeft:10,}}>免费呼叫宠物医生</Text>
                    </View>
                </TouchableHighlight>
                <View style={{flexDirection:'row', alignItems:'center', paddingVertical:2, borderTopWidth:1, borderTopColor:'#ccc'}}>
                    <Text>附近医院</Text>
                    <Icon name={'ios-arrow-forward-outline'} size={14} color={'#ccc'}/>
                </View>
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
        borderTopColor: '#ccc',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        height: 40,
    },
    positionText: {
        paddingLeft: 5,
        fontSize: 14,
        color: '#FA8072',
    },
    callStyle: {
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius:3,
        backgroundColor:'#87CEFF',
        paddingVertical:5,
        justifyContent:'center',
        alignItems:'center'
    },
});
export default HomePage;