/**
 * Created by User on 2016-11-03.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    Text,
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
const navTitle = "呼叫医生";
const backgroundImageSource = getImageSource(15);
const category = postCategory.question;

const questionAddEnabled = false;
class Message extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user:{},
            petName:'',
            questionContent:'',
            questionTags:'',
            questionFlags:'',
            pending: false
        }
    }

    componentDidMount(){
        let _this = this;
        InteractionManager.runAfterInteractions(() => {
            NetUtil.getAuth((ret)=>{
                _this.setState({user: ret});
            },(ret)={

            });
        });
    }

    componentDidFocus(){
        Alert.alert(
            '系统提示',
            '呼叫系统还有一点儿问题没有解决',
            [
                {text: '好的', onPress: () => null }
            ]
        )
    }

    questionValidator(){
        let petName = this.state.petName,
            questionContent = this.state.questionContent,
            questionFlags = this.state.questionFlags || 0,
            message;
        if(!_.trim(petName)){
            message = "请输入您的手机号码";
        }
        else if(!_.trim(questionContent)){
            message = "请输入宠物名字";
        }
        else if(!numberValidator(questionFlags)){
            message = "请输入求助详情";
        }
        if(message){
            Toast.show(message);
            return false;
        }
        return {
            Title: petName,
            Content: questionContent,
            Flags: questionFlags,
        };
    }

    onQuestionSendPress(){
        if(questionAddEnabled === false){
            return;
        }
        const questionData = this.questionValidator();
        if(questionData){
            this.setState({ pending: true });
            //啦啦啦啦啦啦啦啦啦啦啦
        }
    }

    onQuestionResolved(){
        const { router } = this.props;
        Toast.show("恭喜你，请求发送发布成功");
        this.timer = TimerMixin.setTimeout(() => {
            if(router.getPreviousRoute().name === 'userAsset'){
                router.replacePreviousAndPop(ViewPage.userAsset(), {
                    category: category
                });
            }else{
                router.replace(ViewPage.userAsset(), {
                    category: category
                });
            }
        }, 2000);
    }

    onQuestionRejected(){
        this.setState({pending: false});
        Toast.show("请求呼叫失败，请稍候重试");
    }

    renderNavbar(){
        return (
            <Navbar title={navTitle} leftIconName={false} leftIconOnPress={()=>{}}/>
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
                        maxLength = { 80 }
                        multiline = { false }
                        editable = { questionAddEnabled }
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
                        maxLength = { 5 }
                        multiline = { false }
                        keyboardType='numeric'
                        editable = { questionAddEnabled }
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
                        maxLength = { 1000 }
                        multiline = { true }
                        editable = { questionAddEnabled }
                        style={ [ComponentStyles.textarea, styles.text_content] }
                        placeholder={'请输入求助详情...'}
                        placeholderTextColor={ StyleConfig.color_gray }
                        underlineColorAndroid = { 'transparent' }
                        onChangeText = {(val)=>this.setState({questionContent: val})}
                        value={ this.state.questionContent } />
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
                    {this.state.user.Phone}
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
        if(this.state.pending === true){
            return (
                <Spinner style={ ComponentStyles.pending_container }/>
            )
        }
    }

    renderContent(){
        return (
            <ScrollView
                keyboardDismissMode= { 'interactive'}
                showsVerticalScrollIndicator  = { false }
                keyboardShouldPersistTaps  = { true }>
                { this.renderPetName()}
                { this.renderQuestionFlags()}
                { this.renderQuestionContent() }
                { this.renderQuestionOp() }
            </ScrollView>
        )
    }

    renderPending(){
        if(this.state.pending === true){
            return (
                <Spinner style={ ComponentStyles.pending_container }/>
            )
        }
    }

    render() {
        return (
            <View style={ ComponentStyles.container }>
                { this.renderNavbar() }
                { this.renderContent() }
                { this.renderPending() }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    text_content:{
        height: StyleConfig.screen_height / 5
    }
})
export default Message;