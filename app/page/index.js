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
import Icon from 'react-native-vector-icons/Ionicons';
import Config, { postCategory } from '../config';
import { getImageSource, logoImage } from '../common';
import ViewPage from './view';
import Page from './page';
import { CommonStyles, ComponentStyles, StyleConfig } from '../styles';

import SendRequest from './sendrequest';
import Home from './home';
import Message from './message';
import UC from './uc';

const backgroundImageSource = getImageSource(1);
const TAB_REQUEST  = '求助';
const TAB_HOMEPAGE = '首页';
const TAB_MESSAGE  = '消息';
const TAB_UC       = '我的';
import TabNavigator from 'react-native-tab-navigator';
class Index extends Component {

    constructor (props) {
        super(props);
        this.state = {
            selectedTab: TAB_HOMEPAGE,
            tabBarShow: true
        };
        this._renderTabItem = this._renderTabItem.bind(this);
    }

    componentWillUnmount() {
        this.timer && TimerMixin.clearTimeout(this.timer);
    }
    _renderTabItem(ico, tag, childView) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tag}
                renderIcon={() => <View style={styles.tabIcon}><Icon name={ico} size={32} color={'#b2b2b2'}/></View>}
                title={tag}
                renderSelectedIcon={() => <View style={styles.tabIcon}><Icon name={ico} size={32} color={'#63B8FF'}/></View>}
                onPress={() => this.setState({ selectedTab: tag })}>
                {childView}
            </TabNavigator.Item>
        );
    }
    _createChildView(tag) {
        let renderView;
        switch (tag) {
            case TAB_HOMEPAGE:
                renderView = <Home router={this.props.router}/>;
                break;
            case TAB_MESSAGE:
                renderView = <Message router={this.props.router}/>;
                break;
            case TAB_UC:
                renderView = <UC router={this.props.router}/>;
                break;
            case TAB_REQUEST:

                renderView = <SendRequest user="1234567890" router={this.props.router} />;

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
                    {this._renderTabItem('ios-home', TAB_HOMEPAGE, this._createChildView(TAB_HOMEPAGE))}
                    {this._renderTabItem('ios-paper-plane', TAB_REQUEST, this._createChildView(TAB_REQUEST))}
                    {this._renderTabItem('ios-chatbubbles', TAB_MESSAGE, this._createChildView(TAB_MESSAGE))}
                    {this._renderTabItem('ios-person', TAB_UC, this._createChildView(TAB_UC))}
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


