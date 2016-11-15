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
    message: (data)=>{
        return {
            component: Page.Message,
            name: 'message',
            id: 'page',
            params: {
                location: data,
            }
        }
    },
    uc: ()=>{
        return {
            component: Page.UC,
            name: 'uc',
            id: 'main',
        }
    },
    hospital:(data)=>{
        return {
            component: Page.Hospital,
            name: 'hospital',
            id: 'page',
            params: {
                hospital: data,
            }
        }
    },
    setting:(data)=>{
        return {
            component: Page.Setting,
            name: 'setting',
            id: 'page',
            params: {

            }
        }
    }
}