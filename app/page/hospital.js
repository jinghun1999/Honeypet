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
import Icon from 'react-native-vector-icons/Ionicons';
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
                <View style={{padding:10, backgroundColor:'#fff'}}>
                    <Text style={{fontSize:18, borderLeftWidth:5, borderLeftColor:'#FA8072', paddingLeft:5,}}>{this.state.info.HospitalName}</Text>
                </View>
                <View style={{padding:10, marginVertical:10, backgroundColor:'#fff'}}>
                    <Text>{this.state.info.Description}</Text>
                </View>
                <View style={{padding:10, backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#EDEDED'}}>
                    <Text><Icon name={'ios-call'} size={18} color={'#FA8072'}/> {this.state.info.Tel}</Text>
                </View>
                <View style={{padding:10, backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#EDEDED'}}>
                    <Text><Icon name={'ios-pin'} size={18} color={'#FA8072'}/> {this.state.info.Address}</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#F5F5F5'
    },

});
export default Hospital;