/**
 * Created by User on 2016-11-03.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    Text,
    Modal,
    Image,
    Alert,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    InteractionManager
    } from 'react-native';
import _ from 'lodash';
import ViewPage from './view';
import TimerMixin from 'react-timer-mixin';
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/Ionicons';
import { getImageSource, numberValidator } from '../common';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';
import { postCategory } from '../config';
import { StyleConfig, ComponentStyles, CommonStyles } from '../styles';
import NetUtil from '../util/NetUtil';
import Signalr from 'react-native-signalr';
const navTitle = "呼叫医生";
const backgroundImageSource = getImageSource(8);
const category = postCategory.question;
import * as Animatable from 'react-native-animatable';

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

class Message extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user:{},/*用户名称*/
            petName:'',/*宠物名称*/
            content:'',/*内容*/
            questionFlags:'',/*手机号*/
            petType:'',/*宠物类型*/
            /*订单*/
            Bill:{
                EntName:'',
                EntAddress:'',
                EntPhone:'',
                ResponseName:'',
                Phone:''
            },

            openmodel:false,
            openShelter:false,

            SendRequesting:false,
            SucessRequest:'',
            WaitResponding:false,
            SucessRespond:''
        }

        this.sucessExit = this.sucessExit.bind(this);
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

    componentDidMount(){
        let _this = this;
        InteractionManager.runAfterInteractions(() => {
            NetUtil.getAuth((ret)=>{
                _this.setState({user: ret});
            },(ret)=>{
                Toast.show(ret);
            });
        });
    }

    componentDidFocus(){
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
            //关闭连接
            proxy.invoke("MasterDisconnected");
            timeoutCallBack();
        },1000 * 10);
    }

    questionValidator(){
        let petName = this.state.petName,
            content = this.state.content,
            questionFlags = this.state.questionFlags || 0,
            message;
        if(!_.trim(content)){
            message = "请输入求助详情";
        }
        else if(!_.trim(petName)){
            message = "请输入宠物名字";
        }
        else if(!numberValidator(questionFlags)){
            message = "请输入您的手机号码";
        }
        if(message){
            Toast.show(message);
            return false;
        }
        return {
            Title: petName,
            Content: content,
            Flags: questionFlags,
        };
    }

    onQuestionSendPress(){
        const questionData = this.questionValidator();
        if( !questionData ) {
            return;
        }

        let data = {
            'ID':'00000000-0000-0000-0000-000000000000',
            'ClientID':'00000000-0000-0000-0000-000000000000',
            'Mobile':this.state.user.phone,
            'RealName':this.state.user.realname,
            'PetType':this.state.petType,
            'City':'上海',
            'Postion':this.props.location.address,
            'Lat':this.props.location.latitude,
            'Lng':this.props.location.longitude,
            'Describe':this.state.content
        };

        //设置场景2
        this.setcene(2);
        let _this = this;
        NetUtil.request( data , (ok,msg)=>{
            if(ok){
                if(msg.result){
                    _this.startMonitor(msg.data,()=>{
                        //链接成功CallBack
                        Toast.show("正在等待医院回应...");
                        this.setcene(3);
                    },(mess)=>{
                        //接收到消息CallBack
                        let bill = JSON.parse(mess);
                        this.setState({Bill:{
                            EntName:bill.EntName,
                            EntAddress:bill.EntAddress,
                            EntPhone:bill.EntPhone,
                            ResponseName:bill.ResponseName,
                            Phone:bill.Phone},openShelter:true});
                        this.setcene(4);
                    },()=>{
                        //断开连接CallBack
                        if( this.getcene() == 3 ){
                            Toast.show("暂时无人结单，可以再试一次...");
                            this.setcene(7);//无人结单
                        }
                    },()=>{
                        //链接出错CallBack
                        Alert.alert("2");
                        Toast.show("链接服务器出错...");
                        this.setcene(6);//报错
                    });
                }else{
                    //发送请求出错
                    Alert.alert("1");
                    Toast.show("链接服务器出错...");
                    this.setcene(6);//报错
                }
            }else{
                //发送请求出错
                Toast.show("链接服务器出错...");
                this.setcene(6);//报错
            }
        });
    }

    renderNavbar(){
        return (
            <Navbar title={navTitle} leftIconOnPress={()=>this.props.navigator.pop()}/>
        )
    }

    renderQuestionFlags(){
        return (
            <View>
                <View style={[ CommonStyles.flexRow, CommonStyles.flexItemsMiddle, CommonStyles.flexItemsBetween, CommonStyles.p_a_3, ComponentStyles.panel_bg ]}>
                    <Text style={[CommonStyles.text_danger, CommonStyles.font_xs]}>
                        手机号码
                    </Text>
                </View>
                <View style={[ CommonStyles.p_a_3 ]}>
                    <TextInput
                        ref="txtFlags"
                        onFocus={() => {this.refs.txtFlags.focus()}}
                        maxLength = { 11 }
                        multiline = { false }
                        keyboardType='numeric'
                        style={ [ComponentStyles.input] }
                        placeholder={'请输入手机号码'}
                        placeholderTextColor={ StyleConfig.color_gray }
                        underlineColorAndroid = { 'transparent' }
                        onChangeText = {(val)=>this.setState({questionFlags: val})}
                        value={ this.state.questionFlags } />
                </View>
            </View>
        )
    }

    renderPetName(){
        return (
            <View>
                <View style={[ CommonStyles.flexRow, CommonStyles.flexItemsMiddle, CommonStyles.flexItemsBetween, CommonStyles.p_a_3, ComponentStyles.panel_bg ]}>
                    <Text style={[CommonStyles.text_danger, CommonStyles.font_xs]}>
                        爱宠名字
                    </Text>
                </View>
                <View  style={[ CommonStyles.p_a_3 ]}>
                    <TextInput
                        ref="txtTitle"
                        onFocus={() => {this.refs.txtTitle.focus()}}
                        maxLength = { 80 }
                        multiline = { false }
                        style={ [ComponentStyles.input] }
                        placeholder={'请输入您的爱宠名字...'}
                        placeholderTextColor={ StyleConfig.color_dark }
                        underlineColorAndroid = { 'transparent' }
                        onChangeText = {(val)=>this.setState({petName: val})}
                        value={ this.state.petName } />
                </View>
            </View>
        )
    }

    renderQuestionContent(){
        return (
            <View>
                <View style={[ CommonStyles.flexRow, CommonStyles.flexItemsMiddle, CommonStyles.flexItemsBetween, CommonStyles.p_a_3, ComponentStyles.panel_bg ]}>
                    <Text style={[CommonStyles.text_danger, CommonStyles.font_xs]}>
                        求助详情
                    </Text>
                </View>
                <View style={[ CommonStyles.p_a_3 ]}>
                    <TextInput
                        ref="txtContent"
                        onFocus={() => {this.refs.txtContent.focus()}}
                        maxLength = { 1000 }
                        multiline = { true }
                        style={ [ComponentStyles.textarea, styles.text_content] }
                        placeholder={'请输入求助详情...'}
                        placeholderTextColor={ StyleConfig.color_gray }
                        underlineColorAndroid = { 'transparent' }
                        onChangeText = {(val)=>this.setState({content: val})}
                        value={ this.state.content } />
                </View>
            </View>
        )
    }

    renderUserInfo(){
        return (
            <View style={[ CommonStyles.flexRow, CommonStyles.flexItemsMiddle ]}>
                <Image ref={view => this.imgView=view}
                       style={ [ ComponentStyles.avatar_mini, CommonStyles.m_r_2] }
                       source={ {uri: 'http://www.easyicon.net/api/resizeApi.php?id=1201413&size=96' } }>
                </Image>
                <Text style={ [ CommonStyles.text_gray, CommonStyles.font_xs ] }>
                    {this.state.user.realname}
                </Text>
            </View>
        )
    }



    renderSendButton(){
        return (
            <TouchableOpacity
                activeOpacity={ StyleConfig.touchable_press_opacity }
                style={[ ComponentStyles.btn, ComponentStyles.btn_sm, ComponentStyles.btn_primary_outline ]}
                onPress={()=>this.onQuestionSendPress()}>
                <Text style={[ComponentStyles.btn_text, CommonStyles.text_primary, CommonStyles.font_xs]}>
                    提交
                </Text>
            </TouchableOpacity>
        )
    }

    renderQuestionOp(){
        return (
            <View style={[ CommonStyles.flexRow, CommonStyles.flexItemsMiddle, CommonStyles.flexItemsBetween, CommonStyles.p_a_3, ComponentStyles.panel_bg ]}>
                { this.renderUserInfo() }
                { this.renderSendButton() }
            </View>
        )
    }

    renderPending(){
            return (
                <Spinner style={ ComponentStyles.pending_container }/>
            )
    }

    renderContent(){
        return (
            <ScrollView
                keyboardDismissMode= { 'interactive'}
                showsVerticalScrollIndicator  = { false }
                keyboardShouldPersistTaps  = { true }>
                { this.renderQuestionFlags()}
                { this.renderPetName()}
                { this.renderQuestionContent() }
                { this.renderQuestionOp() }
            </ScrollView>
        )
    }
    sucessExit(){
        //this.setState( { openmodel:true,openShelter:false } );
        this.props.navigator.pop();
    }
    renderPending(){
            return (
                <Spinner style={ ComponentStyles.pending_container }/>
            )
    }
    renderModalBackdrop() {
        if( this.state.openShelter ){
            return (
                <Animatable.View
                    style={ ComponentStyles.modal_backdrop }
                    animation="fadeIn"
                    seeckers="bounce"
                    onAnimationEnd={ ()=>{ this.setState( { openmodel:true } ) } }
                    duration={ 500 }>
                </Animatable.View>
            );
        }else {
            return <View visible="false"></View>
        }
    }
    renderModel() {

        if( !this.state.openmodel ){
            return (<View visible="false"></View>);
        }else{
            return (
                <Modal
                    animationType={ 'slide' }
                    transparent={ true }
                    onRequestClose={()=> null }>
                    <View style={ ComponentStyles.modal_container }>
                        <View style={ ComponentStyles.modal_header }>
                            <Image
                                style={ ComponentStyles.modal_header_img }
                                source={ backgroundImageSource }/>
                        </View>
                        <View style={ [ComponentStyles.modal_body,ComponentStyles.model_width] }>
                            <Text
                                style={[ CommonStyles.text_center, CommonStyles.m_b_1, CommonStyles.font_lg, CommonStyles.text_dark ]}>
                                医院已经结单，请等待医院的电话：
                            </Text>

                            <Text
                                style={[ CommonStyles.text_left, CommonStyles.m_b_1, CommonStyles.font_lg, CommonStyles.text_dark ]}>
                                名  称：{this.state.Bill.EntName}
                            </Text>
                            <Text
                                style={[ CommonStyles.text_left, CommonStyles.m_b_1, CommonStyles.font_lg, CommonStyles.text_dark ]}>
                                地  址：{this.state.Bill.EntAddress}
                            </Text>
                            <Text
                                style={[ CommonStyles.text_left, CommonStyles.m_b_1, CommonStyles.font_lg, CommonStyles.text_dark ]}>
                                电  话：{this.state.Bill.Phone}
                            </Text>
                            <Text
                                style={[ CommonStyles.text_left, CommonStyles.m_b_1, CommonStyles.font_lg, CommonStyles.text_dark ]}>
                                联系人：{this.state.Bill.ResponseName}
                            </Text>
                        </View>
                        <View style={ ComponentStyles.modal_footer }>
                            <TouchableOpacity
                                activeOpacity={ StyleConfig.touchable_press_opacity }
                                style={ [
                                    ComponentStyles.btn, ComponentStyles.btn_primary,
                                    ComponentStyles.modal_button
                                ] }
                                onPress={()=> this.sucessExit() }>
                                <Text style={ ComponentStyles.btn_text }>
                                    知道了
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )
        }
    }

    render() {
        let cene = this.getcene();
        switch(cene)
        {
            case 1://初始化
                return (
                    <View style={ ComponentStyles.container }>
                        { this.renderNavbar()  }
                        { this.renderContent() }
                    </View>
                );
                break;
            case 2://请求运行中
                return (
                    <View style={ ComponentStyles.container }>
                        { this.renderNavbar()  }
                        { this.renderContent() }
                        { this.renderPending() }
                    </View>
                );
                break;
            case 3://请求成功，等待回应
                return (
                    <View style={ ComponentStyles.container }>
                        { this.renderNavbar()  }
                        { this.renderContent() }
                        { this.renderPending() }
                    </View>
                );
                break;
            case 4://成功接收到回应
                return (
                    <View style={ ComponentStyles.container }>
                        { this.renderNavbar()  }
                        { this.renderContent() }
                        { this.renderModalBackdrop() }
                        { this.renderModel() }
                    </View>
                );
                break;
            case 5://接收回应失败
                return (
                    <View style={ ComponentStyles.container }>
                        { this.renderNavbar()  }
                        { this.renderContent() }
                    </View>
                );
                break;
            case 6://发送请求失败
                return (
                    <View style={ ComponentStyles.container }>
                        { this.renderNavbar()  }
                        { this.renderContent() }
                    </View>
                );
                break;
            case 7://无人接单
                return (
                    <View style={ ComponentStyles.container }>
                        { this.renderNavbar()  }
                        { this.renderContent() }
                    </View>
                );
                break;
        }
    }
}
const styles = StyleSheet.create({
    text_content:{
        height: StyleConfig.screen_height / 5
    }
})
export default Message;