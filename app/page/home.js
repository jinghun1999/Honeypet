'use strict';
import React, { Component ,PropTypes} from 'react';
import {
    View,
    RefreshControl,
    Text,
    TouchableHighlight,
    StyleSheet,
    } from 'react-native';

//import PureRenderMixin from 'react-addons-pure-render-mixin';
import ViewPage from './view';
import AMapLocation from 'react-native-amap-location';
import Dimensions from 'Dimensions';

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            dataString: null,
        };
        //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        const _this = this;
        this.listener = AMapLocation.addEventListener((data) => {
            _this.setState({
                data: data,
                dataString: JSON.stringify(data),
            });
        });
        AMapLocation.startLocation({
            accuracy: 'HighAccuracy',
            killProcess: true,
            needDetail: true,
        });
    }

    componentWillUnmount() {
        AMapLocation.stopLocation();
        this.listener.remove();
    }

    render() {
        return (
            <View>
                <Text>{this.state.dataString}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({});
export default HomePage;