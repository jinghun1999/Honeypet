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
    message: (data,user)=>{
        return {
            component: Page.Message,
            name: 'message',
            id: 'page',
            params: {
                location: data,
                user:user
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
    userinfo:()=>{
      return {
          component: Page.UserInfo,
          name: 'userinfo',
          id: 'page',
      }
    },
    hospital: (data)=>{
        return {
            component: Page.Hospital,
            name: 'hospital',
            id: 'page',
            params: {
                hospital: data,
            }
        }
    },
    setting: (data)=>{
        return {
            component: Page.Setting,
            name: 'setting',
            id: 'page',
            params: {

            }
        }
    },
    webpage: (data)=>{
        return {
            component: Page.WebPage,
            name: 'setting_detail',
            id: 'page',
            params: {
                title: data.title,
                url: data.url,
            }
        }
    },
    feedback: ()=>{
        return {
            component: Page.Feedback,
            name: 'feedback',
            id: 'page'
        }
    },
    call: (data)=>{
        return {
            component: Page.Call,
            name: 'call',
            id:'page',
            params: {
                title: data.title
            }
        }
    },
    calldetail: (data)=>{
        return {
            component: Page.CallDetail,
            name: 'calldetail',
            id:'page',
            params: {
                title: data.title,
                callDetail:data.callDetail,
            }
        }
    },
    doctor: (data)=>{
        return {
            component: Page.Doctor,
            name: 'doctor',
            id:'page',
            params: {
                title: data.title,
                doctor:data.docData,
            }
        }
    },
}