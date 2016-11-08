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
import Toast from 'react-native-root-toast';
class Hospital extends Component {

    constructor(props) {
        super(props);
        this.state = {
            info: this.props.hospital,
        };
    }

    componentDidMount() {
        Toast.show(JSON.stringify(this.state.info))
    }

    onMenuPress(){
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <HomeHead onMenuPress={this.onMenuPress.bind(this)}/>
                <View>
                    <Image source={{uri:this.state.info.HeadPic}}/>
                    <Text>{this.state.info.HospitalName}</Text>
                </View>
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