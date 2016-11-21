/**
 * Created by User on 2016-11-16.
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
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar, } from 'react-native-scrollable-tab-view';
class Feedback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            loaded: true,
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
    renderLoading(){
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
                <ScrollableTabView
                    style={{ }}
                    renderTabBar={() => <DefaultTabBar />}
                    >
                    <Text tabLabel='我的意见'>My</Text>
                    <Text tabLabel='常见问题'>favorite</Text>
                </ScrollableTabView>);
        }
        return (
            <View style={{flex:1,}}>
                <Navbar title='意见反馈' leftIconOnPress={this.onBack.bind(this)}/>
                {webBody}
            </View>
        )
    }
}
module.exports = Feedback;