import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TouchableHighlight
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import Icon from 'react-native-vector-icons/Ionicons';
//import PureRenderMixin from 'react-addons-pure-render-mixin';
import Config, { postCategory } from '../config';
import drawerItems from '../config/drawer';
import { getImageSource, logoImage } from '../common';
import ViewPage from './view';
import { CommonStyles, ComponentStyles, StyleConfig } from '../styles';
import PostList from './listview/postList';
const backgroundImageSource = getImageSource(1);
const TAB_HOMEPAGE = '首页';
const TAB_KNOWLEDGE = '知识库';
const TAB_BBS = '医师社区';
const TAB_APP = '应用服务';
const TAB_UC = '我的';
import TabNavigator from 'react-native-tab-navigator';
class DrawerPanel extends Component {

	constructor (props) {
	    super(props);
	    this.state = {
	    	flag: postCategory.home
	    };
	    //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	componentWillUnmount() {
	  this.timer && TimerMixin.clearTimeout(this.timer);
	}

	onItemPress(item){
		const { onDrawerHide, onDrawerPress } = this.props;
		if (item.action === "refresh") {
			this.setState({
				flag: item.flag
			});
		}
		
		onDrawerHide && onDrawerHide(item);

		this.timer = TimerMixin.setTimeout(() => { 
			onDrawerPress && onDrawerPress(item);
	    }, 300);
	}

	onUserPress(){
		const pressItem = {
			action: "push",
			flag:"user"
		};
		this.onItemPress(pressItem);
	}

	onAboutPress(){
		const pressItem = {
			action: "push",
			flag:"about"
		};
		this.onItemPress(pressItem);
	}

	renderHeaderBackground(){
		return (
			<View>
				<Image 
					style={[ComponentStyles.header_img]}
					resizeMode="stretch"
					source={ backgroundImageSource }>
				</Image>
				<View style={ ComponentStyles.header_backdrop }/>
			</View>
		)
	}

	renderHeaderUserInfo(){
		const { user } = this.props;
		let avatar;
		if(user.DisplayName === Config.appInfo.name){
			avatar = logoImage;
		}else{
			avatar = { uri: user.Avatar };
		}

		let userNamepPatchStyle = null;
		if(user.DisplayName.length <= 4){
			userNamepPatchStyle = CommonStyles.flexItemsMiddle;
		}

		return (
			<View style={[ CommonStyles.flexColumn, userNamepPatchStyle ]}>
				<Image
					style={ [ComponentStyles.avatar, CommonStyles.m_b_3] } 
					source={ avatar }/>
				<Text style={ [CommonStyles.text_white, CommonStyles.font_md ] }>
					{ user.DisplayName }
				</Text>	
			</View>
		)
	}

	renderHeaderUserOp(){
		const { user } = this.props;
		if(user.DisplayName !== Config.appInfo.name){
			return (
				<View style={[ CommonStyles.flexRow, CommonStyles.flexItemsMiddle ]}>
					<Icon 
						name={ "ios-log-in-outline" }  
						size= { StyleConfig.icon_size }
						color={ StyleConfig.color_white } />
				</View>
			)
		}
	}

	renderHeaderForeground(){
		const { user } = this.props;
		let onPress;
		if(user.DisplayName !== Config.appInfo.name){
			onPress = ()=> this.onUserPress();
		}else{
			onPress = ()=>null;
		}
		return (
			<TouchableOpacity 
				activeOpacity={ StyleConfig.touchable_press_opacity }
				onPress={ onPress }
				style={ [ ComponentStyles.pos_absolute, styles.header_content, CommonStyles.flexRow, CommonStyles.flexItemsBottom, CommonStyles.flexItemsBetween ] }>
				{ this.renderHeaderUserInfo() }
				{ this.renderHeaderUserOp() }
			</TouchableOpacity>
		)
	}

	renderHeader(){
		const { router } = this.props;
		return (
			<View style={ styles.header_container }>
				{ this.renderHeaderBackground() }
				{ this.renderHeaderForeground() }
			</View>
		)
	}

	renderNavActiveItem(item, index){
		const onDrawerHide = this.props.onDrawerHide || (()=>null);
		return (
			<TouchableHighlight 
				underlayColor ={ StyleConfig.touchable_press_color }
				key={ index } 
				style={[ CommonStyles.p_a_3 ]}
				onPress={ ()=> onDrawerHide(item) }>
				<View style={ [ CommonStyles.flexRow, CommonStyles.flexItemsMiddle, CommonStyles.flexItemsBetween ] }>
					<View style={ [CommonStyles.flexRow, CommonStyles.flexItemsMiddle] }>
						<View style={ [ CommonStyles.flexRow, CommonStyles.flexItemsCenter, CommonStyles.m_r_3, styles.list_icon] }>
							<Icon 
								name={ item.icon } size={ StyleConfig.icon_size }
								style={ [ CommonStyles.text_danger ] } />
						</View>
						<Text style={ [ CommonStyles.font_sm, CommonStyles.text_danger ] }>
							{ item.text }
						</Text>
					</View>
					<View>
						<Icon name={ "ios-checkbox-outline" }
							size={ StyleConfig.icon_size }
							style={[ CommonStyles.text_danger ]} />
					</View>
				</View>
			</TouchableHighlight>
		)
	}

	renderNavNormalItem(item, index){
		return (
			<TouchableHighlight 
				underlayColor ={ StyleConfig.touchable_press_color }
				key={ index } 
				style={[ CommonStyles.p_a_3 ]}
				onPress={ ()=> this.onItemPress(item) }>
	            <View style={ [ CommonStyles.flexRow, CommonStyles.flexItemsMiddle, CommonStyles.flexItemsBetween ] }>
					<View style={ [CommonStyles.flexRow, CommonStyles.flexItemsMiddle] }>
						<View style={ [ CommonStyles.flexRow, CommonStyles.flexItemsCenter, CommonStyles.m_r_3, styles.list_icon] }>
							<Icon name={ item.icon } 
								size={ StyleConfig.icon_size } 
								style={[ CommonStyles.text_dark ]}/>
						</View>
						<Text style={ [ CommonStyles.font_sm, CommonStyles.text_dark ] }>
							{ item.text }
						</Text>
	                </View>
	            </View>
	        </TouchableHighlight>
		)
	}

	renderNavItem(item, index){
		if (item.flag === this.state.flag) {
			return this.renderNavActiveItem(item, index);
		}
		return this.renderNavNormalItem(item, index);
	}

	renderContentFooter(){
		return (
			<TouchableHighlight 
				underlayColor ={ StyleConfig.touchable_press_color }
				style={[ CommonStyles.p_a_3, styles.border ]}
				onPress={ ()=> this.onAboutPress() }>
	            <View style={ [ CommonStyles.flexRow, CommonStyles.flexItemsMiddle ] }>
					<View style={ [ CommonStyles.flexRow, CommonStyles.flexItemsCenter, CommonStyles.m_r_3, styles.list_icon] }>
						<Icon name={ 'ios-code-outline' } 
							size={ StyleConfig.icon_size } 
							style={[ CommonStyles.text_dark ]}/>
					</View>
					<Text style={ [ CommonStyles.font_sm, CommonStyles.text_dark ] }>
						关于
					</Text>
				</View>
			</TouchableHighlight>
		)
	}

	renderContent(){
		if(drawerItems && drawerItems.length){
			return (
				<ScrollView
					showsVerticalScrollIndicator  = { false } 
					style={ [ CommonStyles.p_y_1 ] }>
					{
						drawerItems.map((nav, index)=>{
							return this.renderNavItem(nav, index);
						})
					}
					{ this.renderContentFooter() }
				</ScrollView>
			)
		}
	}

	_renderTabItem(ico, tag, childView) {
		return (
			<TabNavigator.Item
				selected={this.state.selectedTab === tag}
				renderIcon={() => <View style={styles.tabIcon}><Icon name={ico} size={32} color={'#b2b2b2'}/></View>}
				title={tag}
				renderSelectedIcon={() => <View style={styles.tabIcon}><Icon name={ico} size={32} color={'#63B8FF'}/></View>}
				onPress={() => this.setState({ selectedTab: tag })}>
				{childView}
			</TabNavigator.Item>
		);
	}
	_createChildView(tag) {
		let renderView;
		switch (tag) {
			case TAB_HOMEPAGE:
				renderView = <PostList navigator={this._navigator}/>;
				break;
			case TAB_BBS:
				renderView = <PostList navigator={this._navigator}/>;
				break;
			case TAB_UC:
				renderView = <PostList navigator={this._navigator}/>;
				break;
			default:
				break;
		}
		return (<View style={styles.container}>{renderView}</View>)
	}
	render() {
		let { tabBarShow } = this.props;
		return (

			<View style={{flex: 1}}>
				<TabNavigator hidesTabTouch={true}
							  sceneStyle={{paddingBottom: 0}}
							  tabBarStyle={tabBarShow ? styles.tabNav : styles.tabNavHide}>
					{this._renderTabItem('ios-home', TAB_HOMEPAGE, this._createChildView(TAB_HOMEPAGE))}
					{this._renderTabItem('ios-chatbubbles', TAB_BBS, this._createChildView(TAB_BBS))}
					{this._renderTabItem('ios-person', TAB_UC, this._createChildView(TAB_UC))}
				</TabNavigator>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container:{
		height: StyleConfig.screen_height,
	},
	header_container: {
		height: StyleConfig.header_height
	},
	header_content: {
		left: StyleConfig.space_3,
		right: StyleConfig.space_3,
		bottom: StyleConfig.space_4,
	},
	list_icon:{
		width: StyleConfig.icon_size
	},
	border: {
		borderTopWidth: .5,
		borderTopColor: StyleConfig.border_color
	}
});

export default connect((state, props) => ({
  user: state.user
}), dispatch => ({ 

}))(DrawerPanel);


