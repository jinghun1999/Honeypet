/**
 * Created by User on 2016-09-22.
 */
import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';
var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
    sync: require('./Sync')
});
global.storage = storage;