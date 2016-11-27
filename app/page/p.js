/**
 * Created by User on 2016-11-03.
 */
'use strict';
import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    PixelRatio,
    TouchableOpacity,
    Image,
    Platform
    } from 'react-native';

import ImagePicker from 'react-native-image-picker';

export default class P extends React.Component {

    state = {
        avatarSource: null,
        videoSource: null
    };

    selectPhotoTapped() {
        const options = {
            title: '上传头像',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '从手机浏览',
            cancelButtonTitle: '取消',
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                var source;
                // You can display the image using either:
                //source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                //Or:
                if (Platform.OS === 'android') {
                    source = {uri: response.uri, isStatic: true};
                } else {
                    source = {uri: response.uri.replace('file://', ''), isStatic: true};
                }

                this.setState({
                    avatarSource: source
                });
            }
        });
    }

    ///
    /*
     1、首先我们new了一个FormData
     2、创建一个file对象，uri是什么？如下示例：
     Android:  file:///storage/emulated/0/Pictures/eb645893-4c00-44a3-a9b4-a2116e955f7c.jpg
     ios:      /Users/ashleydw/Library/Developer/CoreSimulator/Devices/23EE88D0-6E91-43AD-A3B6-06F87698C5A8/data/Containers/Data/Application/A73E68D3-7424-4301-9934-AD0F8251C1EB/tmp/7803DA8A-0E40-4FCB-A593-884805878172.jpg
     3、设置header
        'Content-Type':'multipart/form-data',
     4、将创建好的FormData赋值给body
     */
    uploadImage() {
        let url = CONSTAPI.API_HOST+'/token/imgupload';
        /*
        let formData = new FormData();
        let file = {uri: this.state.avatarSource.url, type: 'multipart/form-data', name: 'a.jpg'};
        formData.append("images", file);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        }).then((response) => response.text()).then((responseData)=> {
            console.log('responseData', responseData);
        }).catch((error)=> {
            console.error('error', error)
        });
        */
        let formData = new FormData();
        formData.append('image', {uri: this.state.avatarSource.url, type: 'image/jpg', name: 'image.jpg'});
        formData.append('description', String('aaaaaaaaaaaaaaaaaa'));
        let options = {
            headers:{
                'Content-Type':'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d'
            },
            body: formData,
        };
        return fetch(url, options).then((response) => {
            alert('ok')
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                    <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
                        { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
                            <Image style={styles.avatar} source={this.state.avatarSource}/>
                        }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.uploadImage.bind(this)}>
                    <Text>上传</Text>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        borderRadius: 75,
        width: 150,
        height: 150
    }
});