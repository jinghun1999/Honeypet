/**
 * Created by User on 2016-10-26.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    RefreshControl,
    Text
} from 'react-native';

class SendRequest extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {

    }
    render() {
        return (
            <View style={{flex: 1}}>
                <Text>宠物类型
                </Text>
                <Text>宠物昵称
                </Text>
                <Text>症状描述
                </Text>
            </View>
        );
    }
}

export default SendRequest;