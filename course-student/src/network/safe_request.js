/**
 * Created by MingzhengGu on 2020/12/8.
 * 封装的安全网络请求模块
 */

import {request} from './request'
import JSEncrypt from 'jsencrypt'

export async function safe_request(config) {
  let safe_request_res = await
    request({
      url: '/authorization/getPublicKey'
    }).then(res => {
    if (res.status != 200 || res.data.state != '200') {
      throw Error('网络请求错误！请求状态码：' + res.state);
    }
    else {
      let encryptor = new JSEncrypt();
      encryptor.setPublicKey(res.data.dataset["content"]);
      //对config中内容分别加密
      const params = config["params"];
      let final_params = {};
      for (let k in params) {
        final_params[k] = encryptor.encrypt(params[k]);
      }
      config["params"] = final_params;
      config["headers"] = {
        "publicKey": res.data.dataset["content"]
      };
      return request(config);
    }
  }).catch(err => {
    console.log(err);
    return undefined;
  });
  return safe_request_res;
}