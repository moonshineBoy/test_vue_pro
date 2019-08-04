/**
 * Created by ldl on 2019/8/4.
 */
import axios from 'axios'
import qs from 'qs'
import ApiSetting from './config'
import Cookies from 'js-cookie';


const Axios = axios.create(
  ApiSetting.AxiosConfig
);

Axios.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (
      config.method === "post" ||
      config.method === "put" ||
      config.method === "delete" ||
      config.method === "get"
    ) {
      // 序列化
    }

    // 若是有做鉴权token , 就给头部带上token
    if (Cookies.get('token') !== undefined) {  //
      config.headers['Authorization'] = 'Token ' + Cookies.get('token');
    }

    return config;
  },
  error => { //出错
    return Promise.reject(error.data.error.message);
  }
);
//拦截器
Axios.interceptors.response.use(
  res => {

    return res;
  },
  error => {

    //net::ERR_CONNECTION_REFUSED
    if (error.response.status == 401 && error.response.data.detail == "认证令牌无效。") {
      Cookies.remove('hasGreet');
      Cookies.remove('access');
      Cookies.remove('csrftoken');
      Cookies.remove('token');
      Cookies.remove('useradmin');
      window.location.href = window.location.origin + '/login'

    }

    return Promise.reject(error.response.data);
  }
);

export {Axios}

export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, "$http", {value: Axios});
  }
};

