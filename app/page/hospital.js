/**
 * Created by User on 2016-11-07.
 */
'use strict';
import React, { Component ,PropTypes} from 'react';
import {
    View,
    RefreshControl,
    Text,
    TouchableHighlight,
    StyleSheet,
    ListView,
    Image,
    } from 'react-native';
import HomeHead from '../components/header/home';
class Hospital extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <HomeHead />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

});
export default Hospital;