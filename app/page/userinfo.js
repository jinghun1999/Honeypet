/**
 * Created by User on 2016-11-15.
 */
'use strict';
import React, { Component ,PropTypes} from 'react';
import {
    View,
    RefreshControl,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet,
    ListView,
    Image,
    InteractionManager,
    TextInput,
    Modal,
    Platform
    } from 'react-native';
import _ from 'lodash';
import Head from '../components/head';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-root-toast';
import Navbar from '../components/navbar';
import { CommonStyles, ComponentStyles, StyleConfig } from '../styles';
import NetUtil from '../util/NetUtil';
import Picker from 'react-native-picker';
import BackAndroidTool from '../util/BackAndroidTool';
import NButton from '../components/NButton';
//import P from './p';
import ImagePicker from 'react-native-image-picker';
var options = {
    title: 'Select Avatar',
    customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
    ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            modalVisiable: false,
        };
    }

    componentDidMount() {
        //BackAndroidTool.customHandleBack(this.props.navigator, ()=> {
        //});
        InteractionManager.runAfterInteractions(() => {
            NetUtil.getAuth((ret)=> {
                this.setState({
                    user: ret,
                });
            });
        });
    }

    chooseSex() {
        this.setState({modalVisiable: !this.state.modalVisiable});
    }

    onBack() {
        let {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    onSave() {
        let _this = this;
        NetUtil.postJson(CONSTAPI.LOGIN + '/post', _this.state.user, null, (data)=> {
            if (data && data.result) {
                Toast.show('保存成功');
            } else if (data) {
                alert(data.error + JSON.stringify(_this.state.user));
            } else {
                Toast.show('系统异常，请稍后再试');
            }
        });
    }

    _setModalVisible(s) {
        let user = this.state.user;
        user.usersex = s;
        this.setState({
            user: user,
            modalVisiable: false,
        });

    }

    render() {
        return (
            <View style={styles.container}>
                <Navbar title={'个人信息'}
                        leftIconOnPress={this.onBack.bind(this)}
                        rightText={'保存'}
                        rightIconOnPress={this.onSave.bind(this)}
                    />
                <View style={{height:150, justifyContent:'center', alignItems:'center'}}>
                    <Image source={{uri: this.state.user.userhead}} style={{width:100, height:100, borderRadius:50}}
                           resizeMode='contain'/>
                    <Text style={{fontSize:16, fontWeight:'bold'}}>
                        {this.state.user.phone}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.rowText}>用户昵称</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={styles.input}
                        value={this.state.user.nickname}
                        maxLength={20}
                        onChangeText={(text) => {
                            let a = this.state.user;
                            a.nickname = text;
                            this.setState({user: a});
                        }}
                        />
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>真实姓名</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={styles.input}
                        value={this.state.user.realname}
                        maxLength={20}
                        onChangeText={(text) => {
                            let a = this.state.user;
                            a.realname = text;
                            this.setState({user: a});
                        }}
                        />
                </View>
                <View style={[styles.row, styles.paddingV]}>
                    <Text style={styles.rowText}>手机号码</Text>
                    <Text style={styles.rowValue}>{this.state.user.phone}</Text>
                </View>
                <TouchableOpacity style={[styles.row, styles.paddingV]} onPress={this.chooseSex.bind(this)}>
                    <Text style={styles.rowText}>性别</Text>
                    <Text style={styles.rowValue}>{this.state.user.usersex}</Text>
                    <Icon name="angle-right" size={16} color="#ccc" style={{marginLeft:10}}/>
                </TouchableOpacity>
                <View style={[styles.row, styles.paddingV, styles.bottom]}>
                    <Text style={styles.rowText}>我的积分</Text>
                    <Text style={styles.rowValue}>{this.state.user.integral}</Text>
                </View>

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.modalVisiable}
                    onShow={() => {}}
                    onRequestClose={() => {}}>
                    <View style={styles.modalStyle}>
                        <View style={styles.subView}>
                            <Text style={styles.titleText}>
                                设置您的性别
                            </Text>
                            <View style={styles.buttonView}>
                                <TouchableOpacity underlayColor='transparent'
                                                  style={styles.buttonStyle}
                                                  onPress={this._setModalVisible.bind(this, '男')}>
                                    <Text style={styles.buttonText}>
                                        男
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.verticalLine}/>
                                <TouchableOpacity underlayColor='transparent'
                                                  style={styles.buttonStyle}
                                                  onPress={this._setModalVisible.bind(this, '女')}>
                                    <Text style={styles.buttonText}>
                                        女
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5'
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
        alignItems: 'center'
    },
    paddingV: {
        paddingVertical: 15,
    },
    rowText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    rowValue: {
        fontSize: 12,
        color: '#555',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 0,
        textAlign: 'right',
        paddingRight: 0,
        fontSize: 12,
        color: '#333'
    },// modal的样式
    modalStyle: {
        //backgroundColor:'#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    // modal上子View的样式
    subView: {
        marginLeft: 60,
        marginRight: 60,
        backgroundColor: '#F4F4F4',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
    // 标题
    titleText: {
        marginTop: 10,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // 内容
    contentText: {
        margin: 8,
        fontSize: 14,
        textAlign: 'center',
    },
    // 水平的分割线
    horizontalLine: {
        marginTop: 5,
        height: 0.5,
        backgroundColor: '#ccc',
    },
    // 按钮
    buttonView: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        flexDirection: 'column',
        //alignItems: 'center',

    },
    buttonStyle: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // 竖直的分割线
    verticalLine: {
        flex: 1,
        height: 0.5,
        backgroundColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
        color: '#3393F2',
        textAlign: 'center',
    },
});
module.exports = UserInfo;