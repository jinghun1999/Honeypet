/**
 * Created by User on 2016-11-03.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    RefreshControl,
    Text,
    } from 'react-native';
import ViewPage from './view';
class UC extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    render() {
        return (
            <View>
                <Text>Message</Text>
            </View>
        );
    }
}

export default UC;