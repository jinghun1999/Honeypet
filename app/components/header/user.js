import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    ScrollView,
    StyleSheet
    } from 'react-native';

import _ from 'lodash';
//import PureRenderMixin from '../common/pureRender';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { getImageSource } from '../../common';
import Navbar from '../navbar';
import { CommonStyles, ComponentStyles, StyleConfig } from '../../styles';

class UserRender extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cover: null
        };
        //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        const cover = getImageSource();
        this.setState({
            cover: cover
        });
    }

    componentWillUnmount() {
        this.setState({
            cover: null
        });
    }

    onParallaxViewScroll(e) {
        if (e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height + 20 > e.nativeEvent.contentSize.height) {
            if (!this.overThreshold) {
                this.props.onListEndReached && this.props.onListEndReached();
                this.overThreshold = true;
            }
        } else {
            if (this.overThreshold) {
                this.overThreshold = false
            }
        }
    }

    renderParallaxScrollComponent() {
        return (
            <ScrollView
                refreshControl={ this.props.refreshControl }
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
            </ScrollView>
        )
    }

    renderParallaxBackground(postInfo) {
        return (
            <View>
                <Image
                    resizeMode="cover"
                    style={ [ComponentStyles.header_img ] }
                    source={ this.state.cover }
                    ref={(view)=>{this.parallaxBackground = view}}>
                </Image>
                <View style={ [ ComponentStyles.header_backdrop ] }/>
            </View>
        )
    }

    renderParallaxForeground() {
        const { user } = this.props;
        return (
            <View
                style={ [ CommonStyles.flexColumn, CommonStyles.flexItemsMiddle, CommonStyles.flexItemsCenter, styles.foreground ] }>
                <Image
                    style={ [ ComponentStyles.avatar, CommonStyles.m_y_2 ] }
                    source={{ uri: user.userhead }}/>
                <Text style={[CommonStyles.text_white, CommonStyles.font_lg, CommonStyles.m_b_1 ]}>
                    {user.realname != null ? user.realname : user.phone}
                </Text>
            </View>
        )
    }

    renderParallaxStickyHeader() {
        const { user } = this.props;
        return (
            <Navbar
                backgroundImage={ this.state.cover }
                leftIconOnPress={()=>{}}
                leftIconName={ {uri:'http://www.easyicon.net/api/resizeApi.php?id=1201413&size=96'} }
                title={user.realname != null ? user.realname : user.phone}/>
        );
    }

    render() {

        return (
            <ParallaxScrollView
                ref={(view)=>{this.parallaxView = view}}
                headerBackgroundColor={ StyleConfig.color_dark }
                stickyHeaderHeight={ StyleConfig.navbar_height }
                onScroll={(e) => this.onParallaxViewScroll(e) }
                parallaxHeaderHeight={ StyleConfig.header_height }
                renderScrollComponent={()=> this.renderParallaxScrollComponent()}
                renderBackground={() => this.renderParallaxBackground()}
                renderForeground={() => this.renderParallaxForeground()}
                renderStickyHeader={() => this.renderParallaxStickyHeader()}>

                { this.props.children }

            </ParallaxScrollView>
        );
    }
}

const styles = StyleSheet.create({
    foreground: {
        height: StyleConfig.header_height,
        paddingTop: StyleConfig.space_4
    },
    foreground_meta: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.1)'
    }
});

export default UserRender;