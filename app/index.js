/**
 * Created by User on 2016-10-25.
 */
'use strict';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Store }  from './reducer/store';
import Navigation from './components/navigation';

class ReactNativeApp extends Component {
    render() {
        return (
            <Provider store={ Store }>
                <Navigation/>
            </Provider>
        );
    }
}
export default ReactNativeApp;