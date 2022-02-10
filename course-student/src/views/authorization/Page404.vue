<template>
  <div class="page404">
    <div class="card-form">
      <div class="media-container">
        <img class="logo" src="../../assets/failure.png" />
      </div>
      <div class="check-please">
        您要找的页面不见了...
      </div>
      <div class="href-container">
        <el-link icon="el-icon-s-custom" type="warning" href="/login">点我立即跳转登录界面 >></el-link>
      </div>
    </div>
  </div>
</template>

<script>
  import "../../assets/css/form.css"
  export default {
    name: 'Page404',
    components: {}
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
