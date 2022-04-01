<template>
  <div class="validate-email">
    <div class="card-form" v-loading.fullscreen.lock="loading">
      <div class="media-container">
        <img class="logo" :src="img_url" />
      </div>
      <div class="check-please">
        {{tip}}
      </div>
      <div class="href-container">
        <el-link icon="el-icon-s-custom" type="warning" href="/login">点我立即跳转登录界面 >></el-link>
      </div>
    </div>
  </div>
</template>

<script>
  import "../../assets/css/form.css"
  import {request} from "../../network/request"
  export default {
    name: 'ValidateEmail',
    data() {
      return {
        tip: '',
        img_url: '',
        loading: true
      }
    },
    created: function() {
      const token = this.$route.query.token;
      if (token == null || typeof(token) == 'undefined') {
        this.tip = '非法访问！此页面尚不支持访问！';
        this.img_url = '/unauthenticated.png';
        this.loading = false;
      }
      else {
        console.log("!")
        request({
          url: '/authorization/validateEmail',
          params: {
            'token': token
          }
        }).then(res => {
          if (res.status == 200 && res.data.state == '200') {
            this.tip = '账户已经成功激活！可前往登录！';
            this.img_url = '/success.png';
            this.loading = false;
          }
          else {
            throw Error('Invalid token');
          }
        }).catch(err =>{
          this.tip = '网络或链接错误，或链接已过期，请重新进行注册';
          this.img_url = '/failure.png';
          this.loading = false;
        })
      }
    }
  }
</script>

<style>
  body {
    background-image: url('../../assets/background.jpg');
    background-size: 100vw 100vh;
    background-repeat: no-repeat;
  }
  .check-please {
    width: 38vw;
    font-size: 3vh;
    font-weight: bolder;
    text-align: center;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
