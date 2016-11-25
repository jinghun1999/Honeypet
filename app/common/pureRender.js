/**
 * Created by User on 2016-10-26.
 */
'use strict';

import React from 'react';
if (React) {
    module.exports = React.addons.PureRenderMixin;
}
else {
    var g;
    if (typeof window != 'undefined') {
        g = window;
    } else if (typeof global != 'undefined') {
        g = global;
    } else {
        g = this;
    }
    if (g.React) {
        module.exports = React.addons.PureRenderMixin;
    }
}