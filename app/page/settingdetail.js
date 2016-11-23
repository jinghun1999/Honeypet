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
class SettingDetail extends React.Component {
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
            let name = '';
            switch (this.props.title) {
                case '服务条款':
                    name = 'service';
                    break;
                case '使用帮助':
                    name = 'help';
                    break;
                case '关于':
                    name = 'index';
                    break;
                case '联系我们':
                    name = 'contact';
                    break;
                default:
                    name = 'error';
                    break;
            }
            this.setState({
                url: CONSTAPI.HOST + '/about/' + name,
                loaded: true,
            });

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
        var webBody;
        if (!this.state.loaded) {
            webBody = this.renderLoading();
        }
        else {
            webBody = (
                <WebView
                    ref="webView"
                    style={{backgroundColor:'#e7e7e7',flex:1,}}
                    source={{uri: this.state.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    renderLoading={this.renderLoading.bind(this)}
                    />);
        }
        return (
            <View style={{flex:1,}}>
                <Navbar title={this.props.title} leftIconOnPress={this.onBack.bind(this)}/>
                {webBody}
            </View>
        )
    }
}
module.exports = SettingDetail;