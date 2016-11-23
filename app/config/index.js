/**
 * Created by User on 2016-10-26.
 */
'use strict';
export default {
    appInfo:{
        name:'宠宝',
        descr:'爱宠健康快速呼叫助手',
        site:'www.tuoruimed.com',
        version: 'v1.0.0',
        copyright: '©2016 powered by tuoruimed',
        registerUri: 'http://www.tuoruimed.com',
        declare: '爱宠，是一个面向全国宠物主人的呼叫宠物医生求助专业平台。自创建以来，一直致力并专注于为宠物主打造一个便捷的快速问诊服务中心，推动并帮助宠物医生通过互联网实现网上快速沟通交流，从而让更多宠物及主人从中受益。宠宝的使命是帮助宠物主和宠物医生实现闪电交流敏捷通道。'
    },
    authorInfo: {
        name:'tuoruimed',
        email:'tuoruimed@sina.com',
        homepage: 'http://yun.tuoruimed.com',
        declare: '本软件内容来源于宠宝官方接口，版权归宠宝及原作者所有。'
    },
    commentTail: ' 【from [url=http://fir.im/togayther]rn-cnblogs[/url]】',
    apiDomain: 'http://test.tuoruimed.com/Honeypet/'
};

export const postCategory = {
    home: "home",
    rank: "rank",
    news: "news",
    blink: "blink",
    question: "question",
    favorite: "favorite",
    answer: "answer"
};

export const authData = {
    pubKey : "",     //拓瑞API加密公钥
    clientId: "a",    //拓瑞官方申请clientId
    clientSecret: "a" //拓瑞官方申请clientSecret
};

export const pageSize = 10;
export const loginExpiredIn = 100;//秒
export const storageKey = {
    OFFLINE_POSTS: "OFFLINEPOSTS",
    USER_TOKEN: "USERTOKEN",
    USER_VERIFYCODE: 'USERVERIFYCODE',
    LOGIN_INFO: 'LOGININFO'
};