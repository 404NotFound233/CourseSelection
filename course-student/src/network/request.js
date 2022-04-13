/**
 * Created by MingzhengGu on 2020/12/8.
 * 封装的网络请求模块
 */

import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://172.19.241.75:8080/',
    // baseURL: 'http://localhost:8082/',
    timeout: 30*60*1000
  });
  instance.defaults.validateStatus = function (status) {
    return status < 500;
  }
  return instance(config);
}

