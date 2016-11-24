/**
 * Created by tuorui on 2016/9/23.
 */
'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
    WebView,
    InteractionManager
    } from 'react-native';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';
class WebPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            loaded: false,
        };
    }

    onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

        });
    }

    componentWillUnmount() {

    }

    renderLoading() {
        return (
            <View style={{flex:1, justifyContent:'center'}}>
                <Spinner/>
            </View>
        )
    }

    render() {

        return (
            <View style={{flex:1,}}>
                <Navbar title={this.props.title} leftIconOnPress={this.onBack.bind(this)}/>
                <WebView
                    ref="webView"
                    style={{backgroundColor:'#e7e7e7',flex:1,}}
                    source={{uri: this.props.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    renderLoading={this.renderLoading.bind(this)}
                    />
            </View>
        )
    }
}
module.exports = WebPage;