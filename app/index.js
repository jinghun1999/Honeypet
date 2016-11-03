/**
 * Created by User on 2016-10-25.
 */
'use strict';

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Alert,
    Navigator,
    Image,
    ToastAndroid,
    View
    } from 'react-native';
//import MainPage from './MainPage';
import StartUp from './page/startup';
import Storage from './util/Storage';
//import NetWorkTool from './app/util/NetWorkTool'
class Index extends React.Component {
    constructor(props) {
        super(props);
        /*
         NetWorkTool.checkNetworkState((isConnected)=> {
         if (!isConnected) {
         ToastAndroid.show(NetWorkTool.NOT_NETWORK, ToastAndroid.SHORT);
         }
         });
         NetWorkTool.removeEventListener(NetWorkTool.TAG_NETWORK_CHANGE, this.handleNetConnect);
         */
    }

    /*
     handleNetConnect(isConnected) {
     //console.log('test', (isConnected ? 'online' : 'offline'));
     }
     */
    render() {
        return (
            <Navigator
                initialRoute={{ name: 'StartUp', component: StartUp, id: 'main' }}
                configureScene={(route) => {
                            let gestureType = Navigator.SceneConfigs.HorizontalSwipeJump;
                            gestureType.gestures.jumpForward = null;
                            gestureType.gestures.jumpBack = null;
                            return gestureType;
                        }
                    }
                renderScene={(route, navigator) => {
                        this._navigator = navigator;
                        let Component = route.component;
                        return <Component {...route.params} navigator={navigator} tabBarShow={route.id==='main'} />
                    }
                }/>
        );
    }
}

export default Index;