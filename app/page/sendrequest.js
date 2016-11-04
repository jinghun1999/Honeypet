/**
 * Created by User on 2016-10-26.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    RefreshControl,
    Image,
    Text
} from 'react-native';
import { StyleConfig, ComponentStyles, CommonStyles } from '../styles';
import Logo from '../components/logo';
import { getImageSource, openLink } from '../common';
const backgroundImageSource = getImageSource(8);

class SendRequest extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount()
    {
    }
    renderContent()
    {
        return
        (
            <View>
            </View>
        );
    }
    renderModal()
    {
        return
        (
            <View>
            </View>>
        );
    }
    renderModalBackdrop()
    {
        return
        (
            <View>
            </View>
        );
    }
    renderHeader() {
        return (
            <View style={[CommonStyles.m_b_4]}>
                <Image
                    style={ComponentStyles.header_img}
                    source={ backgroundImageSource }/>
                <Logo style={ [ComponentStyles.pos_absolute, styles.header_logo] }/>
            </View>
        );
    }
    render() {
        return (
            <View style={[ComponentStyles.container, CommonStyles.flexItemsCenter, CommonStyles.flexItemsMiddle, styles.container]}>
                { this.renderHeader()  }
                { this.renderContent() }
                { this.renderModal()   }
                { this.renderModalBackdrop() }
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