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
//import HomeHead from '../components/header/home';
import Head from '../components/head';
import Toast from 'react-native-root-toast';
class Hospital extends Component {

    constructor(props) {
        super(props);
        this.state = {
            info: this.props.hospital,
        };
    }

    componentDidMount() {

    }
    onBack(){
        let {navigator} = this.props;
        if(navigator){
            navigator.pop();
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Head title={'医院详情'} canBack={true} onLeftButtonPress={this.onBack.bind(this)}/>
                <View style={{height:200,}}>
                    <Image source={{uri:this.state.info.HeadPic}} resizeMode={'stretch'} style={{flex:1,}} />
                </View>
                <View style={{flex:1, padding:10,}}>
                    <Text style={{fontSize:18, borderLeftWidth:5, borderLeftColor:'#EE4000', paddingLeft:5,}}>{this.state.info.HospitalName}</Text>
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