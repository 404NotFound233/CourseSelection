<template>
  <div class="home">
    <div class="act-list">
      <div class="filter-container" style="border-bottom: 0.1vh solid black;">
        <div class="filter">
          <div>选课安排</div>
          <el-input  class='finput' v-model="filter.name" placeholder="选课安排" clearable></el-input>
        </div>
        <div class="filter">
          <div>开始日期</div>
          <el-date-picker v-model="filter.start" type="date"
              placeholder="开始日期">
          </el-date-picker>
        </div>
        <div class="filter">
          <div>结束时间</div>
          <el-date-picker v-model="filter.end" type="date"
                          placeholder="结束时间">
          </el-date-picker>
        </div>
        <div class="filter" style="diplay: flex; justify-content: center; align-items: center;margin-left: 2vw;">
          <div>&nbsp;</div>
          <i class="el-icon-search"></i>
        </div>
      </div>
      <div class="table-container">
        <el-table :data="activities" class="act-table" height="100%" emptyText="暂无符合条件的选课安排"
                  cellClassName="table-cell" headerRowClassName="header-row"
                  headerCellClassName="header-row" :rowClassName="rowClassHandler">
          <el-table-column prop="name" label="选课安排" sortable></el-table-column>
          <el-table-column prop="startd" label="开始日期" sortable></el-table-column>
          <el-table-column prop="endd" label="结束日期" sortable></el-table-column>
          <el-table-column prop="startt" label="开始时间" sortable></el-table-column>
          <el-table-column prop="endt" label="结束时间" sortable></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small"
                         v-if="scope.row.chosen == false">管理</el-button>
              <el-button @click="handleClick(scope.row)" type="text" size="small"
                         v-if="scope.row.chosen == false" disabled>已结束</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-avatar :src="avatarUrl" class="avatar" style="border: 0.2vh solid black;"></el-avatar>
    <div class="avatar-screen" @click="logout">登出</div>
    <div class="welcome">{{tnumber}}</div>
    <div class="welcome" style="top: 26vh;">{{tname}}</div>
    <el-button class="add-button" type="primary">添加安排</el-button>
  </div>
</template>

<script>
  import "../../assets/css/form.css";
  import "../../assets/css/fonts.css";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  export default {
    name: 'Home',
    components: {},
    data() {
      return {
        avatarUrl: require('../../assets/teacher_avatar.png'),
        tnumber: 'DG21130031',
        tname: '大大明',
        activities: [],
        filter: {}
      }
    },
    methods: {
      logout: function() {
        localStorage.removeItem("token");
        this.$router.push('/login');
      },
    }
  }
</script>

<style>
  body {
    background-image: url('../../assets/background.jpg');
    background-size: 100vw 100vh;
    background-repeat: no-repeat;
  }
  .act-list {
    width: 76vw;
    height: 94vh;
    position: fixed;
    left: 2vw;
    top: 3vh;
    background-color: rgba(255,255,255, 0.5);
    border: 0.2vh solid black;
    border-radius: 2vh;
    box-sizing: border-box;
    padding: 1vw;
    display: flex;
    flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .avatar {
    position: fixed;
    right: calc(11vw - 8vh);
    top: 3vh;
    width: 16vh;
    height: 16vh;
  }
  .avatar-screen {
    opacity: 0;
    position: fixed;
    right: calc(11vw - 8vh);
    top: 3vh;
    width: 16vh;
    height: 16vh;
    border-radius: 8vh;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    cursor: default;
  }
  .avatar-screen:hover {
    opacity: 0.5;
    background-color: black;
    color: white;
    font-weight: bold;
  }
  .welcome {
    position: fixed;
    right: calc(11vw - 8vh);
    top: 21vh;
    width: 16vh;
    display: flex;
    justify-content: center;
    align-content: center;
    font-weight: bolder;
  }
  .el-button--primary {
    background-color: rgba(255, 255, 255, 0);
    color: black;
    border: 0.2vh solid black;
    height: 6vh;
    width: 12vw;
    font-size: 2vh;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
  }
  .el-button--primary:focus {
    background-color: rgba(255, 255, 255, 0);
    color: black;
    border: 0.2vh solid black;
    height: 6vh;
    width: 12vw;
    font-size: 2vh;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
  }
  .el-button--primary:hover {
    background-color: rgba(0,0,0,0.1);
    color: black;
    border: 0.2vh solid black;
    height: 6vh;
    width: 12vw;
    font-size: 2vh;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
  }
  .el-button--primary:active {
    background-color: rgba(0,0,0,0.7);
    color: black;
    border: 0.2vh solid black;
    height: 6vh;
    width: 12vw;
    font-size: 2vh;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
  }
  .filter-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 76vw;
    height: 12vh;
    box-sizing: border-box;
    display: flex;
    /*border: 0.1vh solid red;*/
  }
  .table-container {
    position: absolute;
    left: 0;
    top: 12vh;
    width: 75.8vw;
    height: 81.7vh;
    box-sizing: border-box;
    border: 0;
    border-radius: 0;
    padding: 0;
    margin: 0
    /*border: 0.1vh solid blue;*/

  }
  .filter {
    padding: 0.8vw;
    font-weight: bold;
  }
  .el-input__inner{
    width: 12vw !important;
    height: 4vh !important;
    font-size: 1.5vh !important;
    color:#000000 !important;
    border:0.1vh solid black !important;
    margin-top: 1vh;
  }
  .el-date-picker{
    background-color: rgba(255, 255, 255, 0.9);
  }
  .act-table {
    height: 100%;
    width: 100%;
    border-radius: 2vh;
    background-color: rgba(255, 255, 255, 0);
    box-sizing: border-box;
    border: 0;
  }
  .el-table .header-row {
    background-color: rgba(255, 255, 255, 0) !important;
    color: black;
  }
  .el-table .table-cell {
    background-color: rgba(255, 255, 255, 0) !important;
  }
  .el-table .line-row-ended {
    background-color: rgba(255, 255, 255, 0) !important;
    color: #DC143C;
    -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
    -webkit-user-select:none; /*webkit浏览器*/
    -khtml-user-select:none; /*早期浏览器*/
    -moz-user-select:none;/*火狐*/
    -ms-user-select:none; /*IE10*/
    user-select:none;
    font-weight: bold;
  }
  .el-table .line-row-unended {
    background-color: rgba(255, 255, 255, 0) !important;
    color: #1E90FF;
    -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
    -webkit-user-select:none; /*webkit浏览器*/
    -khtml-user-select:none; /*早期浏览器*/
    -moz-user-select:none;/*火狐*/
    -ms-user-select:none; /*IE10*/
    user-select:none;
    font-weight: bold;
  }
  .add-button {
    position: fixed;
    right: 5vw;
    top: 50vh;
  }
</style>
