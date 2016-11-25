/**
 * Created by tuorui on 2016/11/25.
 */
import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ListView,
    Image,
    Dimensions,
} from 'react-native';
import NetUtil from '../util/NetUtil';
import Toast from 'react-native-root-toast';
import Navbar from '../components/navbar';
const width=Dimensions.get('window').width;
class Doctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.doctor,
        };
    }

    onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    renderHeader() {
        return (
            <View style={{height:200, justifyContent:'center', alignItems:'center',backgroundColor:'#FFD700'}}>
                <View style={{borderWidth:1,borderColor:'#AAAAAA',borderRadius:50}}>
                    <Image source={{uri: this.state.dataSource.head}} style={{width:100, height:100,borderRadius:50 }}
                           resizeMode='contain'/>
                </View>
                <Text style={{fontSize:16, fontWeight:'bold'}}>{this.state.dataSource.name}</Text>
                <Text style={{fontSize:16,}}>医生</Text>
                <Text style={{fontSize:16,}}>{this.state.dataSource.entname}</Text>
            </View>
        )
    }

    renderChildren() {
        return (
            <View style={{flex:1,}}>
                <View
                    style={{height:40,justifyContent:'center',backgroundColor:'#fff',}}>
                    <View style={{flexDirection:'row',}}>
                        <Text style={{fontSize:16,marginLeft:10,}}>年龄: </Text>
                        <Text style={{marginLeft:20,fontSize:16,}}>{this.state.dataSource.age}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row',height:60,backgroundColor:'#fff',marginTop:5}}>
                    <Text style={{fontSize:16,marginLeft:10,}}>从业简介: </Text>
                    <Text style={{width:width-100,}}>{this.state.dataSource.describe}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Navbar title={this.props.title} leftIconOnPress={this.onBack.bind(this)}/>
                {this.renderHeader()}
                {this.renderChildren()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
})
export default Doctor;