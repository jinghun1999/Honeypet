/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
class Head extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        var canAdd = null;
        if (this.props.canAdd) {
            canAdd = <TouchableOpacity style={styles.editBtn} onPress={this.props.editInfo}>
                <Text style={{fontSize: 16, color:'#fff'}}>{this.props.edit}</Text>
            </TouchableOpacity>
        }

        if (this.props.canBack) {
            return (
                <View style={styles.container}>
                    <TouchableHighlight underlayColor='#52b0ff' style={styles.backBtn} onPress={this.props.onLeftButtonPress}>
                        <Icon name={'ios-arrow-round-back'} size={40} color={'white'}/>
                    </TouchableHighlight>

                    <View style={styles.titleBox}>
                        <Text style={{fontSize: 20, color:'#fff'}}>
                            {this.props.title}
                        </Text>
                    </View>
                    <View style={styles.backBtn}>
                        {canAdd}
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View style={styles.titleBox}>
                    <Text style={{fontSize: 20, color:'#fff'}}>
                        {this.props.title}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 50,
        alignSelf: 'stretch',
        backgroundColor: '#9B30FF',
        justifyContent: 'center',
        paddingRight: 10,
    },
    backBtn: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleBox: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editBtn: {
        flex: 1,
        width: 60,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 3,
        backgroundColor: '#0099CC',
        justifyContent: 'center',
        alignItems:'center',
    },
});

module.exports = Head;
