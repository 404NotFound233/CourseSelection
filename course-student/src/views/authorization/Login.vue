<template>
  <div class="login">
    <el-alert
        title="出错啦~~>_<~~"
        type="error"
        description="请检查您的网络后重试！"
        @close="close_warning"
        v-show="error_occur"
        closeText="知道了"
        showIcon>
    </el-alert>
    <div class="card-form">
      <div class="media-container">
        <img class="logo" src="../../assets/student.png" />
      </div>
      <div class="input-line">
        <div class="intro">账号</div>
        <el-input class="my-input" placeholder="请输入您的账号" v-model="username"></el-input>
      </div>
      <div class="input-line">
        <div class="intro">密码</div>
        <el-input class="my-input" placeholder="请输入您的密码" v-model="password" showPassword></el-input>
      </div>
      <el-button type="form-button" @click="login()">登录</el-button>
      <div class="href-container">
        <el-link icon="el-icon-bank-card" type="warning" href="/signin">还没有账号？ 立即申请>></el-link>
      </div>
    </div>
  </div>
</template>

<script>
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input";
  import "../../assets/css/form.css";
  import {safe_request} from "../../network/safe_request";
  export default {
    name: 'Login',
    components: {ElInput},
    data() {
      return {
        username: '',
        password: '',
        error_occur: false
      }
    },
    methods: {
      charisnum(code) {
        return code >=48 && code <= 57;
      },
      charisalpha(code) {
        return (code >= 65 && code <= 90) || (code >= 97 && code <=122);
      },
      validate_username(username) {
        if (this.username.length == 0 || this.username.length > 15) {
          return false;
        }
        for (let i=0;i < username.length;++i) {
          const code = username.charCodeAt(i);
          if (!this.charisnum(code) && !this.charisalpha(code)) {
            return false;
          }
        }
        return true;
      },
      validate_password(password) {
        if (this.password.length < 10 || this.password.length > 20) {
          return false;
        }
        for (let i=0;i < password.length;++i) {
          const code = password.charCodeAt(i);
          if (code < 33 || code > 126) {
            return false;
          }
        }
        return true;
      },
      login() {
        // 表单验证
        if (!this.validate_username(this.username)) {
          this.$message({
            showClose: true,
            message: '非法用户名',
            type: 'warning'
          });
        }
        else if (!this.validate_password(this.password)) {
          this.$message({
            showClose: true,
            message: '非法密码',
            type: 'warning'
          });
        }
        else {
          const that = this;
          const login_request = safe_request({
            url: '/authorization/login',
            params: {
              'username': this.username,
              'password': this.password
            }
          });
          if (typeof(login_request) != 'undefined' && typeof(login_request.then) === 'function') {
            // 至上面只验证了是否请求到了 未验证结果
            // 下面验证结果
            login_request.then(res => {
              if (res.status == 200) {
                const token = res.headers["token"];
                localStorage.removeItem("token");
                localStorage.setItem("token", token);
                this.$router.push({path: '/home'});
              }
              else {
                // alert用户名或密码错误
                this.$message({
                  showClose: true,
                  message: '用户名或密码错误',
                  type: 'warning'
                });
              }
            }).catch(err => {
              console.log(err);
              this.error_occur = true;
            });
          }
          else {
            this.error_occur = true;
          }
        }
      },
      close_warning() {
        this.error_occur = false;
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
</style>
