/**
 * Created by User on 2016-10-26.
 */
import * as Page from './page';
export default ViewPage = {
    index: ()=>{
        return {
            component: Page.Index,
            name: 'index',
            id: 'main',
        }
    },
    home: ()=>{
        return {
            component: Page.Home,
            name: 'home'
        }
    },
    startup: ()=>{
        return {
            component: Page.Startup,
            name: 'startup'
        }
    },
    login: ()=>{
        return {
            component: Page.Login,
            name: 'login'
        }
    },
    message: ()=>{
        return {
            component: Page.Message,
            name: 'message',
            id: 'main',
        }
    },
    uc: ()=>{
        return {
            component: Page.UC,
            name: 'uc',
            id: 'main',
        }
    },
}