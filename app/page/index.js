/**
 * Created by User on 2016-10-26.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions
    } from 'react-native';

import TimerMixin from 'react-timer-mixin';
import Icon from 'react-native-vector-icons/FontAwesome';
import Config, { postCategory } from '../config';
import { getImageSource, logoImage } from '../common';
import ViewPage from './view';
import Page from './page';
import { CommonStyles, ComponentStyles, StyleConfig } from '../styles';
import BackAndroidTool from '../util/BackAndroidTool';

import Home from './home';
import Hospitals from './hospitals';
import UC from './uc';
import NetUtil from '../util/NetUtil';
const backgroundImageSource = getImageSource(1);
const TAB_HOMEPAGE = '首页';
const TAB_HOSPITALS = '附近医院';
const TAB_UC = '我的';
import TabNavigator from 'react-native-tab-navigator';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: TAB_HOMEPAGE,
            user_mobile: '',
            tabBarShow: true
        };
        this._renderTabItem = this._renderTabItem.bind(this);
        /*NetUtil.getAuth(u=> {
            this.setState({user_mobile: u.phone});
        });*/
    }

    componentDidMount() {
        // 添加返回键监听
        BackAndroidTool.addBackAndroidListener(this.props.navigator);
    }

    componentWillUnmount() {
        // 移除返回键监听
        BackAndroidTool.removeBackAndroidListener();
        this.timer && TimerMixin.clearTimeout(this.timer);
    }

    _renderTabItem(ico, tag, childView) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tag}
                renderIcon={() => <View style={styles.tabIcon}><Icon name={ico} size={26} color={'#b2b2b2'}/></View>}
                title={tag}
                renderSelectedIcon={() => <View style={styles.tabIcon}><Icon name={ico} size={26} color={'#63B8FF'}/></View>}
                onPress={() => this.setState({ selectedTab: tag })}>
                {childView}
            </TabNavigator.Item>
        );
    }

    _createChildView(tag) {
        let renderView;
        switch (tag) {
            case TAB_HOMEPAGE:
                renderView = <Home navigator={this.props.navigator}/>;
                break;
            case TAB_HOSPITALS:
                renderView = <Hospitals navigator={this.props.navigator}/>;
                break;
            case TAB_UC:
                renderView = <UC navigator={this.props.navigator}/>;
                break;
            default:
                break;
        }
        return (<View style={styles.container}>{renderView}</View>)
    }

    render() {
        let { tabBarShow } = this.props;
        return (
            <View style={{flex: 1}}>
                <TabNavigator hidesTabTouch={true} sceneStyle={{paddingBottom: 0}}
                              tabBarStyle={tabBarShow ? styles.tabNav : styles.tabNavHide}>
                    {this._renderTabItem('home', TAB_HOMEPAGE, this._createChildView(TAB_HOMEPAGE))}
                    {this._renderTabItem('h-square', TAB_HOSPITALS, this._createChildView(TAB_HOSPITALS))}
                    {this._renderTabItem('user', TAB_UC, this._createChildView(TAB_UC))}
                </TabNavigator>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabNav: {
        height: 45,
        backgroundColor: '#FFF',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E8E8E8'
    },
    tabNavHide: {
        //隐藏底部导航
        position: 'absolute',
        top: Dimensions.get('window').height,
        height: 0,
        overflow: 'hidden'
    },

    tabIcon: {
        flex: 1,
        height: 25,
        alignItems: 'center',
        //resizeMode: 'stretch',
        marginTop: 0.5
    },
});

export default Index;


