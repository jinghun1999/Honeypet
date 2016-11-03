import React, { Component } from 'react';
import {
    View,
    RefreshControl,
    Text,
    } from 'react-native';

//import PureRenderMixin from 'react-addons-pure-render-mixin';
import ViewPage from './view';
//import HomeButton from '../components/button/home';
//import SingleButton from '../components/button/single';
//import HomeRender from '../components/header/home';
//import Config, { postCategory } from '../config';
//import { StyleConfig } from '../styles';
class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //category: postCategory.home
        };
        //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        //this.fetchData(this.state.category);
    }

    render() {
        return (
            <View>
                <Text>主页面</Text>
            </View>
        );
    }
}

export default HomePage;