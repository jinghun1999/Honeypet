/**
 * Created by User on 2016-10-26.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    RefreshControl,
    TextInput,
    Image,
    StyleSheet,
    Text,
    Alert,
    TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import { StyleConfig, ComponentStyles, CommonStyles } from '../styles';
import Logo from '../components/logo';
import { getImageSource, openLink } from '../common';
import NetUtil from '../util/NetUtil';
const backgroundImageSource = getImageSource(8);

class SendRequest extends Component {
    constructor (props) {
        super(props);
        this.state = {
            petname:'狗狗',
            master:'',
            content:'',
            loading:false
        };
    }

    componentDidMount()
    {
    }

    renderMaster() {
        return (
            <View style={ [ComponentStyles.input_control,{marginLeft:50,marginRight:50,marginTop:10} ] }>
                <View style={{flex:1,}}>
                    <TextInput
                        ref="txtMaster"
                        maxLength={ 60 }
                        keyboardType={'ascii-capable'}
                        style={ [ComponentStyles.input ] }
                        blurOnSubmit={true}
                        placeholder={'请输入您的姓名'}
                        placeholderTextColor={StyleConfig.color_gray}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(val)=>this.setState({master: val})}
                        value={this.state.master}
                    />
                </View>
            </View>
        );
    }

    renderPetName() {
        return (
            <View style={ [ComponentStyles.input_control,{marginLeft:50,marginRight:50,marginTop:10} ] }>
                <View style={{flex:1,}}>
                    <TextInput
                        ref="txtPetName"
                        maxLength={ 60 }
                        keyboardType={'ascii-capable'}
                        style={ [ComponentStyles.input ] }
                        blurOnSubmit={true}
                        placeholder={'请输入宠物名称'}
                        placeholderTextColor={ StyleConfig.color_gray }
                        underlineColorAndroid={ 'transparent' }
                        onChangeText={(val)=>this.setState({petname: val})}
                        value={this.state.petname}
                    />
                </View>
            </View>
        );
    }
    renderPetDescribe() {
        return (
            <View style={ [ComponentStyles.input_control,{marginLeft:50,marginRight:50,marginTop:10,height:100} ] }>
                    <TextInput
                        ref="txtContent"
                        multiline={true}
                        keyboardType={'ascii-capable'}
                        style={ [ComponentStyles.input,{textAlignVertical:'top'}] }
                        placeholder={'请输入呼叫内容'}
                        placeholderTextColor={ StyleConfig.color_gray }
                        underlineColorAndroid={ 'transparent' }
                        onChangeText={(val)=>this.setState({content: val})}
                        value={this.state.content}
                        selectTextOnFocus={true}
                        androidnumberOfLines={5}
                    />
            </View>
        );
    }
    handleSend(){
        let re = this.Validator();
        if( !re ) {
            return;
        }



        NetUtil.getAuth((ret)=>{

            Alert.alert(ret.USERTOKEN);

            let data = {
                'Mobile':'1234567890',
                'RealName':this.state.master,
                'PetType':this.state.petname,
                'City':'上海',
                'Postion':'漕河泾',
                'Lat':'1.0',
                'Lng':'2.0',
                'Describe':this.state.content
            };

            NetUtil.request( data , (ok,msg)=>{
                if(ok){

                }
                Alert.alert(msg);
            } );


        });


    };

    Validator()
    {
        let message;
        if( !_.trim(this.state.petname) )
        {
            message='请输入宠物名称';
        }
        if( !_.trim(this.state.master) )
        {
            message='请输入主人姓名';
        }
        if( !_.trim(this.state.content) )
        {
            message='请输入问题描述';
        }
        if( message )
        {
            Alert.alert('校验',message)
            return false;
        }

        return true;
    }

    renderCommitAction(){
        return (
            <TouchableOpacity
                    style={{height:200,
                        paddingLeft:5,
                        alignItems:'center',
                        borderLeftWidth:.5,
                        borderLeftColor:'#EEE9E9',
                        marginRight:5}}
                    onPress={()=>this.handleSend()}>
                <Text style={[ComponentStyles.btn_text]}>
                    发送1
                </Text>
            </TouchableOpacity>
        );
    }

    renderContent(){
        return (
            <View style="{[CommonStyles.m_a_4],}">
                { this.renderMaster()  }
                { this.renderPetName() }
                { this.renderPetDescribe() }
            </View>
        );
    }
    renderModal() {
        return(
            <View style={{height:200,margin:0}}>
                {this.renderCommitAction()}
            </View>
        );
    }
    renderHeader() {
        return (
            <View style={[CommonStyles.m_b_4]}>
                <Image
                    style={ComponentStyles.header_img}
                    source={ backgroundImageSource } />
                <Logo style={ [ComponentStyles.pos_absolute, styles.header_logo] }/>
            </View>
        );
    }
    render() {
        return (
            <View style={[ComponentStyles.container,{backgroundColor:'red'}]}>
                { this.renderHeader()  }
                { this.renderContent() }
                { this.renderModal()   }
            </View>
        );
    }
}
export const styles = StyleSheet.create({
    header_logo: {
        left: StyleConfig.screen_width / 2 - StyleConfig.avatarSize_lg / 2,
        bottom: StyleConfig.avatarSize_lg / 2 - StyleConfig.avatarSize_lg
    },
    footer_copyright: {
        flex: 1,
        justifyContent: 'flex-end'
    }
});
export default SendRequest;