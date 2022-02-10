<template>
  <div class="signin">
    <el-alert
        title="网络出错啦~~>_<~~"
        type="error"
        description="请检查您的网络设置或稍后重试！"
        @close="close_warning"
        v-show="error_occur"
        closeText="知道了"
        showIcon>
    </el-alert>
    <div class="card-form" v-if="!submitted">
      <div class="input-line">
        <div class="intro" style="width:6vw;">设置账号</div>
        <el-input class="my-input" placeholder="请设置您的账号" v-model="username"
                  maxlength="15" @change="check_has_username" @focus="username_focus"></el-input>
        <i class="el-icon-check" v-show="has_username == 1"></i>
        <i class="el-icon-close" v-show="has_username == -1"></i>
      </div>
      <div class="input-line">
        <div class="intro" style="width:6vw;">设置密码</div>
        <el-input class="my-input" placeholder="请设置您的密码" v-model="password" maxlength="20"
                  @input="judge_password" @focus="password_focus" @change="password_submit"
                  showPassword></el-input>
        <div class="pswd-red" v-show="password_strength == 0"></div>
        <div class="pswd-red-blank" v-show="password_strength != 0 && password_strength != -1"></div>
        <div class="pswd-yellow" v-show="password_strength == 1"></div>
        <div class="pswd-yellow-blank" v-show="password_strength != 1 && password_strength != -1"></div>
        <div class="pswd-green" v-show="password_strength == 2"></div>
        <div class="pswd-green-blank" v-show="password_strength != 2 && password_strength != -1"></div>
      </div>
      <div class="input-line">
        <div class="intro" style="width:6vw;">确认密码</div>
        <el-input class="my-input" placeholder="请确认您的密码" v-model="confirm" maxlength="20"
                  @change="check_consistency" @focus="confirm_focus"
                  showPassword></el-input>
        <i class="el-icon-check" v-show="consistency == 1"></i>
        <i class="el-icon-close" v-show="consistency == -1"></i>
      </div>
      <div class="input-line">
        <div class="intro" style="width:6vw;">设置邮箱</div>
        <el-autocomplete
            class="my-input"
            v-model="email"
            :fetch-suggestions="email_extension"
            placeholder="请设置您的邮箱"
            @select="handle_select" @change="check_has_email" @focus="email_focus"></el-autocomplete>
        <i class="el-icon-check" v-show="has_email == 1"></i>
        <i class="el-icon-close" v-show="has_email == -1"></i>
      </div>
      <el-button type="form-button" @click="signin()">注册</el-button>
      <div class="href-container">
        <el-link icon="el-icon-s-custom" type="warning" href="/login">已有账号？ 立即登录>></el-link>
      </div>
    </div>
    <div v-else class="card-form">
      <div class="media-container">
        <img class="logo" src="../../assets/success.png" />
      </div>
      <div class="check-please">
        请前往您的邮箱进行验证，完成最终注册
      </div>
      <div class="href-container">
        <el-link icon="el-icon-s-custom" type="warning" href="/login">已完成邮箱验证？ 立即登录>></el-link>
      </div>
    </div>
  </div>
</template>

<script>
  import "../../assets/css/form.css"
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input";
  import {safe_request} from "../../network/safe_request";
  import {request} from "../../network/request";
  export default {
    name: 'Signin',
    components: {ElInput},
    data() {
      return {
        username: '',
        password: '',
        email: '',
        confirm: '',
        submitted: false,
        error_occur: false,
        has_username: 0,
        has_email: 0,
        consistency: 0,
        password_strength: -1
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
      validate_email(email) {
        const reg=/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
        return reg.test(email);
      },
      signin() {
        // 先进行表单校验
        if (this.has_username == -1 || this.has_email == -1) {
          this.$message({
            showClose: true,
            message: '用户名或邮箱已存在',
            type: 'warning'
          });
        }
        else if (!this.validate_username(this.username)) {
          this.$message({
            showClose: true,
            message: '用户名不合法，请勿包含中文或特殊字符，长度1~15个字符',
            type: 'warning'
          });
        }
        else if (!this.validate_password(this.password)) {
          this.$message({
            showClose: true,
            message: '密码不合法，请勿输入空字符或中文，长度10~20个字符',
            type: 'warning'
          });
        }
        else if (this.password != this.confirm) {
          this.$message({
            showClose: true,
            message: '两次输入的密码不一致',
            type: 'warning'
          });
        }
        else if (!this.validate_email(this.email)) {
          this.$message({
            showClose: true,
            message: '非法邮箱地址，请检查您的邮箱',
            type: 'warning'
          });
        }
        else {
          const signin_request = safe_request({
            url: '/authorization/signin',
            params: {
              'username': this.username,
              'password': this.password,
              'confirm': this.confirm,
              'email': this.email
            }
          });
          if (typeof(signin_request) != 'undefined' && typeof(signin_request.then) === 'function') {
            signin_request.then(res => {
              if (res.status != 200 || res.data.state != '200') {
                throw Error('出现了某些网络错误~请稍后重试~');
              }
              else {
                this.submitted = true;
              }
            }).catch(err => {
              console.log(err);
              this.error_occur = true;
            })
          }
          else {
            this.error_occur = true;
          }
        }
      },
      email_extension(queryString, callback) {
        const email_server_names = ['qq', 'gmail', '163', '126', 'icloud', 'sohu', 'yahoo', 'sina'];
        if (queryString) {
          if (queryString.indexOf("@") != -1 || queryString.indexOf(".") != -1) {
            const res = []
            return callback(res);
          }
          let res = [];
          for (let i=0;i<email_server_names.length;++i) {
            res.push({'value': queryString + '@' + email_server_names[i] + '.com'});
          }
          return callback(res);
        }
        else {
          let res = [];
          for (let i=0;i<email_server_names.length;++i) {
            res.push({'value': '@' + email_server_names[i] + '.com'});
          }
          return callback(res);
        }
      },
      close_warning() {
        this.error_occur = false;
      },
      check_has_username(value) {
        if (!this.validate_username(this.username)) {
          this.has_username = -1;
        }
        else {
          request({
            url: '/authorization/checkUsername',
            params: {
              username: this.username
            }
          }).then(res => {
            if (res.status == 200 && res.data.state == "200") {
              this.has_username = 1;
            }
            else if (res.status == 200 && res.data.state != "200") {
              this.has_username = -1;
            }
            else {
              throw Error("network error...");
            }
          }).catch(err => {
            console.log(err);
          });
        }
      },
      check_has_email(value) {
        // 点->必没有 <=> 有->没点=自己输入 + (自己输入@和.后无法点) = 有==自己输入(正确输入)
        if (value.indexOf("@") == -1 && value.indexOf(".") == -1) {
          // 选了或者自己输入了肯定不是邮箱的内容
          // 不处理
          return;
        }
        else {
          if (this.validate_email(this.email)) {
            request({
              url: '/authorization/checkEmail',
              params: {
                email: this.email
              }
            }).then(res => {
              if (res.status == 200 && res.data.state == "200") {
                this.has_email = 1;
              }
              else if (res.status == 200 && res.data.state != "200") {
                this.has_email = -1;
              }
              else {
                throw Error("network error...");
              }
            }).catch(err => {
              console.log(err);
            });
          }
          else {
            this.has_email = -1;
          }
        }
      },
      handle_select(item) {
        this.email = item.value;
        request({
          url: '/authorization/checkEmail',
          params: {
            email: this.email
          }
        }).then(res => {
          if (res.status == 200 && res.data.state == "200") {
            this.has_email = 1;
          }
          else if (res.status == 200 && res.data.state != "200") {
            this.has_email = -1;
          }
          else {
            throw Error("network error...");
          }
        }).catch(err => {
          console.log(err);
        });
      },
      username_focus(event) {
        this.has_username = 0;
      },
      email_focus(event) {
        this.has_email = 0;
      },
      confirm_focus(event) {
        this.consistency = 0;
      },
      password_focus(event) {
        this.password_strength = -1;
        this.consistency = 0;
      },
      check_consistency(value) {
        if (this.confirm == this.password) {
          this.consistency = 1;
        }
        else {
          this.consistency = -1;
        }
      },
      password_submit(value) {
        this.password_strength = -1;
      },
      judge_password(value) {
        this.password = value;
        if (this.password.length < 10) {
          this.password_strength = 0;
        }
        else {
          let rank = 0;
          if (this.password.length > 12) {
            rank += 1
          }
          let haslower = 0;
          let hasupper = 0;
          let hasnum = 0;
          let hasspecial = 0;
          for (let i=0;i<this.password.length;++i) {
            const code = this.password.charCodeAt(i);
            if (code >= 65 && code <= 90) {
              hasupper = 1;
            }
            else if (code >= 97 && code <= 122) {
              haslower = 1;
            }
            else if (code >=48 && code <=57) {
              hasnum = 1;
            }
            else {
              hasspecial = 1;
            }
          }
          rank += haslower + hasupper + hasnum + hasspecial - 2;
          if (rank > 0 && rank < 2) {
            this.password_strength = rank;
          }
          else if (rank <= 0) {
            this.password_strength = 0;
          }
          else {
            this.password_strength = 2;
          }
        }
      }
    },
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
  .el-icon-check {
    position: absolute;
    right: -3vw;
  }
  .el-icon-close {
    position: absolute;
    right: -3vw;
  }
  .pswd-red {
    box-sizing: border-box;
    position: absolute;
    right: -4vw;
    width: 2vw;
    height: 1vh;
    background-color: darkred;
    border-left: 0.1vh black solid;
    border-top: 0.1vh black solid;
    border-bottom: 0.1vh black solid;
  }
  .pswd-yellow {
    box-sizing: border-box;
    position: absolute;
    right: -6vw;
    width: 2vw;
    height: 1vh;
    background-color: darkorange;
    border-top: 0.1vh black solid;
    border-bottom: 0.1vh black solid;
  }
  .pswd-green {
    box-sizing: border-box;
    position: absolute;
    right: -8vw;
    width: 2vw;
    height: 1vh;
    background-color: darkgreen;
    border-left: 0.1vh black solid;
    border-top: 0.1vh black solid;
    border-bottom: 0.1vh black solid;
  }
  .pswd-red-blank {
    box-sizing: border-box;
    position: absolute;
    right: -4vw;
    width: 2vw;
    height: 1vh;
    background-color: rgba(255, 255,255, 0);
    border-left: 0.1vh black solid;
    border-top: 0.1vh black solid;
    border-bottom: 0.1vh black solid;
  }
  .pswd-yellow-blank {
    box-sizing: border-box;
    position: absolute;
    right: -6vw;
    width: 2vw;
    height: 1vh;
    background-color: rgba(255, 255,255, 0);
    border-top: 0.1vh black solid;
    border-bottom: 0.1vh black solid;
  }
  .pswd-green-blank {
    box-sizing: border-box;
    position: absolute;
    right: -8vw;
    width: 2vw;
    height: 1vh;
    background-color: rgba(255, 255,255, 0);
    border-right: 0.1vh black solid;
    border-top: 0.1vh black solid;
    border-bottom: 0.1vh black solid;
  }
</style>
