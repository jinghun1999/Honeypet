'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View
    } from 'react-native';
var _navigator;

class NButton extends React.Component {
    render() {
        return (
            <TouchableHighlight
                style={[styles.button,{backgroundColor:this.props.backgroundColor?this.props.backgroundColor:'#63B8FF'}]}
                underlayColor="#B5B5B5"
                onPress={this.props.onPress}>
                <Text style={styles.buttonText}>{this.props.text}</Text>
            </TouchableHighlight>
        );
    }
}
const styles = StyleSheet.create({
    button: {
        marginTop:15,
        marginLeft:10,
        marginRight:10,
        //backgroundColor:'#63B8FF',
        borderColor:'#5bc0de',
        height:45,
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color:'#fff',
        fontSize:16,
    }
});
module.exports = NButton;
