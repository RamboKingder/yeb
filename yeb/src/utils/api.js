import axios from "axios";
import {Message} from "element-ui";
import router from "@/router";

//请求拦截器
axios.interceptors.request.use(config =>{
    // 如果存在token，请求时携带这个token
    if (window.sessionStorage.getItem('tokenStr')){
        config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
    }
    return config;
}, error => {
    console.log(error);
})

// 响应信息拦截器
// 成功地调用到了后端的接口
axios.interceptors.response.use(success => {
    // 成功调到了接口，判断业务逻辑错误
    if (success.status && success.status == 200) {
        if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403){
            Message.error({message: success.data.message});
            return;
        }

        if(success.data.message){
            Message.success({message: success.data.message});
        }
    }

    return success.data;

}, error => { // 连接口都调用失败了

    if (error.response.code == 504 || error.response.code == 404){
        Message.error({message: '服务器凉凉了!/(ㄒoㄒ)/~~'});
    }else if(error.response.code == 403){
        Message.error({message: '权限不足，请联系管理员!'});
    }else if(error.response.code == 401){
        Message.error({message: '尚未登录，请登录!'});
        router.replace('/')
    }else{
        if(error.response.message){
            Message.error({message: error.response.message});
        } else{
            Message.error({message: '未知错误'});
        }
    }
    return;
});

let base = '';

// 传送json格式的post请求
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        // 注意这个符号！！！
        url: `${base}${url}`,
        data: params
    })
}

export const putRequest=(url,params)=>{
    return axios({
        method:'put',
        url: `${base}${url}`,
        data:params
    })
}

export const getRequest=(url,params)=>{
    return axios({
        method:'get',
        url: `${base}${url}`,
        data:params
    })
}

export const deleteRequest=(url,params)=>{
    return axios({
        method:'delete',
        url: `${base}${url}`,
        data:params
    })
}