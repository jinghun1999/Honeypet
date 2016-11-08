/**
 * Created by User on 2016-10-26.
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator
    } from 'react-native';

import { CommonStyles, StyleConfig } from '../styles';

class Spinner extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[ CommonStyles.m_a_4, this.props.style ]}>
                <ActivityIndicator
                    size = { 'large' }
                    color={ StyleConfig.color_primary }
                    {...this.props} />
                <Text>{this.props.label}</Text>
            </View>
        )
    }
}

export default Spinner;