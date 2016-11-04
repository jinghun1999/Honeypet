'use strict';
import React, { Component ,PropTypes} from 'react';
import {
    View,
    RefreshControl,
    Text,
    TouchableHighlight,
    StyleSheet,
    } from 'react-native';

//import PureRenderMixin from 'react-addons-pure-render-mixin';
import ViewPage from './view';
import {
    MapView,
    MapTypes,
    MapModule,
    Geolocation
    } from 'react-native-baidu-map';

import Dimensions from 'Dimensions';

class Buttton extends Component {
    static propTypes = {
        label: PropTypes.string,
        onPress: PropTypes.func
    };

    static defaultProps = {
        label: 'Buttton',
        onPress() {

        }
    };
    render() {
        return (
            <TouchableHighlight
                style={styles.btn}
                onPress={this.props.onPress}>
                <Text style={{color: 'white'}}>{this.props.label}</Text>
            </TouchableHighlight>
        );
    }
};

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mayType: MapTypes.NORMAL,
            zoom: 15,
            center: {
                longitude: 113.981718,
                latitude: 22.542449
            },
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            markers: [{
                longitude: 113.981718,
                latitude: 22.542449,
                title: "Window of the world"
            },{
                longitude: 113.995516,
                latitude: 22.537642,
                title: ""
            }]
        };
        //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        //this.fetchData(this.state.category);
    }

    render() {
        return (
            <View style={styles.container}>


                <View style={styles.row}>
                    <Buttton label="Normal" onPress={() => {
            this.setState({
              mapType: MapTypes.NORMAL
            });
          }}/>
                    <Buttton label="Satellite" onPress={() => {
            this.setState({
              mapType: MapTypes.SATELLITE
            });
          }}/>

                    <Buttton label="Locate" onPress={() => {
            Geolocation.getCurrentPosition()
              .then(data => {
              alert(JSON.stringify(data));
                this.setState({
                  zoom: 15,
                  marker: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    title: 'Your location'
                  },
                  center: {
                    latitude: data.latitude,
                    longitude: data.longitude
                  }
                });
              })
              .catch(e =>{
                console.warn(e, 'error');
              })
          }}/>
                </View>

                <View style={styles.row}>
                    <Buttton label="Zoom+" onPress={() => {
            this.setState({
              zoom: this.state.zoom + 1
            });
          }}/>
                    <Buttton label="Zoom-" onPress={() => {
            if(this.state.zoom > 0) {
              this.setState({
                zoom: this.state.zoom - 1
              });
            }

          }}/>
                </View>

                <View style={styles.row}>
                    <Buttton label="Traffic" onPress={() => {
            this.setState({
              trafficEnabled: !this.state.trafficEnabled
            });
          }}/>

                    <Buttton label="Baidu HeatMap" onPress={() => {
            this.setState({
              baiduHeatMapEnabled: !this.state.baiduHeatMapEnabled
            });
          }}/>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    btn: {
        height: 24,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#cccccc',
        paddingLeft: 8,
        paddingRight: 8,
        margin: 4
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 200,
        marginBottom: 16
    }
});
export default HomePage;