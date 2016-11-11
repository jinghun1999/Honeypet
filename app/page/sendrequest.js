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
import Spinner from '../components/spinner';
import Toast from 'react-native-root-toast';
const backgroundImageSource = getImageSource(8);
import Signalr from 'react-native-signalr';

/*
* 场景汇总：
* 1、初始化：
*    SendRequesting:false,SucessRequest:"",WaitResponding:false,SucessRespond:""
* 2、请求运行中：
*    SendRequesting:true,SucessRequest:"",WaitResponding:false,SucessRespond:""
* 3、请求成功，等待回应
*    SendRequesting:false,SucessRequest:"true",WaitResponding:true,SucessRespond:""
* 4、成功接收到回应
*    SendRequesting:false,SucessRequest:"true",WaitResponding:false,SucessRespond:"true"
* 5、接收回应失败
*    SendRequesting:false,SucessRequest:"true",WaitResponding:false,SucessRespond:"false"
* 6、发送请求失败
*    SendRequesting:false,SucessRequest:"false",WaitResponding:false,SucessRespond:""
* 7、无人接单
*    SendRequesting:false,SucessRequest:"true",WaitResponding:false,SucessRespond:""
* */

class SendRequest extends Component {
    constructor (props) {
        super(props);
        this.state = {
            petname:'',
            master:this.props.user,
            content:'',
            SendRequesting:false,
            SucessRequest:'',
            WaitResponding:false,
            SucessRespond:''
        };
        this.startMonitor = this.startMonitor.bind(this);
    }
    componentDidMount()
    {

    }

    startMonitor(requestId,connCallBack, receiveCallBack, timeoutCallBack,failedCallBack){
        let connection = Signalr.hubConnection('http://test.tuoruimed.com:802');
        var proxy = connection.createHubProxy('MessageHub');
        proxy.on('AddMessage', (message) => {
            //收到消息
            receiveCallBack(message);
        });
        connection.start().done(() => {
            //链接成功
            let connid = connection.id;
            proxy.invoke("MasterConnect",requestId,connid);
            connCallBack();
        }).fail((error) => {
            //接收消息失败
            failedCallBack();
        });
        connection.connectionSlow(function () {
            //链接速度较慢
        });
        connection.error(function (error) {
            //出错
        });
        setTimeout(()=>{
            Alert.alert("断开连接");
            //关闭连接
            proxy.invoke("MasterDisconnected");
            timeoutCallBack();
        },1000 * 10);
    }

    renderReadOnlyMaster() {
        return (
            <View style={ [ComponentStyles.input_control,{marginLeft:50,marginRight:50,marginTop:10} ] }>
                    <Text
                        keyboardType={'ascii-capable'}
                        placeholderTextColor={ StyleConfig.color_gray }>
                        {this.state.master}
                    </Text>
            </View>
        );
    }
    renderReadOnlyPetName() {
        return (
            <View style={ [ComponentStyles.input_control,{marginLeft:50,marginRight:50,marginTop:10} ] }>
                    <Text
                        keyboardType={'ascii-capable'}
                        placeholderTextColor={ StyleConfig.color_gray }>
                        {this.state.petname}
                    </Text>
            </View>
        );
    }
    renderReadOnlyPetDescribe() {
        return (
            <View style={ [ComponentStyles.input_control,{marginLeft:50,marginRight:50,marginTop:10,height:100} ] }>
                <Text
                    keyboardType={'ascii-capable'}
                    placeholderTextColor={ StyleConfig.color_gray }>
                    {this.state.content}
                </Text>
            </View>
        );
    }
    renderMaster() {
        return (
            <View style={ [ComponentStyles.input_control,{marginLeft:50,marginRight:50,marginTop:10} ] }>
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
        );
    }
    renderPetName() {
        return (
            <View style={ [ComponentStyles.input_control,{marginLeft:50,marginRight:50,marginTop:10} ] }>
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
    setcene(value){
        if( value == 1 ){
            this.setState({SendRequesting:false,SucessRequest:"",WaitResponding:false,SucessRespond:""});
        }
        if( value == 2 ){
            this.setState({SendRequesting:true,SucessRequest:"",WaitResponding:false,SucessRespond:""});
        }
        if( value == 3 ){
            this.setState({SendRequesting:false,SucessRequest:"true",WaitResponding:true,SucessRespond:""});
        }
        if( value == 4 ){
            this.setState({SendRequesting:false,SucessRequest:"true",WaitResponding:false,SucessRespond:"true"});
        }
        if( value == 5 ){
            this.setState({SendRequesting:false,SucessRequest:"true",WaitResponding:false,SucessRespond:"false"});
        }
        if( value == 6 ){
            this.setState({SendRequesting:false,SucessRequest:"false",WaitResponding:false,SucessRespond:""});
        }
        if( value == 7 ){
            this.setState({SendRequesting:false,SucessRequest:"true",WaitResponding:false,SucessRespond:""});
        }
    }
    getcene(){
        if( this.state.SendRequesting == false && this.state.SucessRequest=='' && this.state.WaitResponding == false && this.state.SucessRespond=='' ){
            return 1;
        }if( this.state.SendRequesting == true && this.state.SucessRequest=='' && this.state.WaitResponding == false && this.state.SucessRespond==''){
            return 2;
        }if( this.state.SendRequesting == false && this.state.SucessRequest=='true' && this.state.WaitResponding == true && this.state.SucessRespond==''){
            return 3;
        }
        if( this.state.SendRequesting == false && this.state.SucessRequest=='true' && this.state.WaitResponding==false && this.state.SucessRespond=='true'){
            return 4;
        }
        if( this.state.SendRequesting == false && this.state.SucessRequest=='true' && this.state.WaitResponding==false && this.state.SucessRespond=='false'){
            return 5;
        }
        if( this.state.SendRequesting == false && this.state.SucessRequest=='false' && this.state.WaitResponding==false && this.state.SucessRespond==''){
            return 6;
        }
        if( this.state.SendRequesting==false && this.state.SucessRequest=="true" && this.state.WaitResponding==false && this.state.SucessRespond=="" ){
            return 7;
        }
        alert("发现错误的场景参数");
        return -1;
    }
    handleSend(){
        let re = this.Validator();
        if( !re ) {
            return;
        }
        let data = {
            'ID':'00000000-0000-0000-0000-000000000000',
            'ClientID':'00000000-0000-0000-0000-000000000000',
            'Mobile':this.props.user,
            'RealName':this.state.master,
            'PetType':this.state.petname,
            'City':'上海',
            'Postion':'漕河泾',
            'Lat':'1.0',
            'Lng':'2.0',
            'Describe':this.state.content
        };
        //设置场景2
        this.setcene(2);
        let _this = this;
        NetUtil.request( data , (ok,msg)=>{
            if(ok){
                if(msg.Sign){
                    _this.startMonitor(msg.Message,()=>{
                        //链接成功CallBack
                        this.setcene(3);
                    },(mess)=>{
                        //接收到消息CallBack
                        this.setcene(4);
                    },()=>{
                        //断开连接CallBack
                        if( this.getcene() == 3 ){
                            this.setcene(7);//无人结单
                        }
                    },()=>{
                        //链接出错CallBack
                        this.setcene(6);//报错
                    });
                }else{
                    //发送请求出错
                    this.setcene(6);//报错
                }
            }else{
                //发送请求出错
                this.setcene(6);//报错
            }
        });
    };

    Validator(){
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
                    activeOpacity="1.0"
                    onPress={()=>this.handleSend()}>
                <Text style={[ComponentStyles.btn_text]}>
                    发送
                </Text>
            </TouchableOpacity>
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
    renderLoading(label) {
            return (
                <Spinner label={label} style={ ComponentStyles.pending_container }/>
            )
    }

    renderContent() {
        let value = this.getcene();

        if( value == 1 ){
            //场景1：初始化
            return (<View style="{[CommonStyles.m_a_4],}">
                { this.renderMaster()  }
                { this.renderPetName() }
                { this.renderPetDescribe() }
                { this.renderCommitAction() }
            </View>);
        }if( value == 2 ){
            //场景2：请求运行中
            return (<View style="{[CommonStyles.m_a_4],}">
                { this.renderReadOnlyMaster()  }
                { this.renderReadOnlyPetName() }
                { this.renderReadOnlyPetDescribe() }
                { this.renderLoading('正在发送您的请求...') }
            </View>);
        }if( value == 3 ){
            //场景3：请求成功，等待回应
            return (<View style="{[CommonStyles.m_a_4],}">
                { this.renderReadOnlyMaster()  }
                { this.renderReadOnlyPetName() }
                { this.renderReadOnlyPetDescribe() }
                { this.renderLoading('请稍等，正在等待医院回应...') }
            </View>);
        }if( value == 4 ){
            //场景4：成功接收到回应
            return (<View style="{[CommonStyles.m_a_4],}">
                { this.renderReadOnlyMaster()  }
                { this.renderReadOnlyPetName() }
                { this.renderReadOnlyPetDescribe() }
            </View>);
        }if( value == 5 ){
            //场景5：接收回应失败
            return (<View style="{[CommonStyles.m_a_4],}">
                { this.renderReadOnlyMaster()  }
                { this.renderReadOnlyPetName() }
                { this.renderReadOnlyPetDescribe() }
            </View>);
        }if( value == 6 ){
            //场景6：发送请求失败
            return (<View style="{[CommonStyles.m_a_4],}">
                { this.renderReadOnlyMaster()  }
                { this.renderReadOnlyPetName() }
                { this.renderReadOnlyPetDescribe() }
            </View>);
        }if( value == 7 ){
            //场景6：无人接单
            return (<View style="{[CommonStyles.m_a_4],}">
                { this.renderMaster()  }
                { this.renderPetName() }
                { this.renderPetDescribe() }
                { this.renderCommitAction() }
            </View>);
        }
        return (<View />);
    }
    render() {
        return (
            <View style={[ComponentStyles.container]}>
                { this.renderHeader()  }
                { this.renderContent() }
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