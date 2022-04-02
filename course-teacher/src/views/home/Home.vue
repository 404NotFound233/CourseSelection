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
          <el-date-picker v-model="filter.start" type="date" value-format="timestamp"
              placeholder="开始日期">
          </el-date-picker>
        </div>
        <div class="filter">
          <div>结束时间</div>
          <el-date-picker v-model="filter.end" type="date" value-format="timestamp"
                          placeholder="结束时间">
          </el-date-picker>
        </div>
        <div class="filter" style="diplay: flex; justify-content: center; align-items: center;margin-left: 2vw;">
          <div>&nbsp;</div>
          <i class="el-icon-search" @click="queryWithFilter"></i>
        </div>
      </div>
      <div class="table-container">
        <el-table :data="activities" class="act-table" height="100%" emptyText="暂无符合条件的选课安排"
                  cellClassName="table-cell" headerRowClassName="header-row"
                  headerCellClassName="header-row" rowClassName="table-cell">
          <el-table-column prop="name" label="选课安排" sortable></el-table-column>
          <el-table-column prop="start" label="开始时间" sortable></el-table-column>
          <el-table-column prop="end" label="结束时间" sortable></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="manageActivity(scope.row)" type="text" size="small">管理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-avatar :src="avatarUrl" class="avatar" style="border: 0.2vh solid black;"></el-avatar>
    <div class="avatar-screen" @click="logout">登出</div>
    <div class="welcome">{{tnumber}}</div>
    <div class="welcome" style="top: 26vh;">{{tname}}</div>
    <el-button class="add-button" type="primary" @click="addVisible = true">添加安排</el-button>
    <el-dialog title="添加安排" :visible.sync="addVisible">
      <el-form :model="activityForm" :rules="rules" label-width="80px" ref="activityForm">
        <el-form-item label="安排名称" prop="name">
          <el-input v-model="activityForm.name" placeholder="安排名称"></el-input>
        </el-form-item>
        <el-form-item label="持续时间" prop="duration">
          <el-date-picker v-model="activityForm.duration"
              type="datetimerange" value-format="timestamp"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button @click="addActivity">添加</el-button>
      </div>
    </el-dialog>
    <el-dialog title="绑定课程" :visible.sync="bindVisible">
      <div>课程代码</div>
      <el-input v-model="bindCode" placeholder="课程代码"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindVisible = false">取 消</el-button>
        <el-button @click="realBind">绑定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import "../../assets/css/form.css";
  import "../../assets/css/fonts.css";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import {request} from "../../network/request";
  export default {
    name: 'Home',
    components: {},
    data() {
      var validateDuration = (rule, value, callback) => {
        if (value == null || typeof(value) == 'undefined' || value == '' || value == 0) {
          callback(new Error('请设置持续时间'));
        } else {
          const start = value[0];
          const end = value[1];
          if (start == null || typeof(start) == 'undefined' || start == '' || start == 0) {
            callback(new Error('请设置开始时间'));
          }
          else if (end == null || typeof(end) == 'undefined' || end == '' || end == 0) {
            callback(new Error('请设置结束时间'));
          }
          else {
            callback();
          }
        }
      };
      return {
        avatarUrl: require('../../assets/teacher_avatar.png'),
        tnumber: 'DG21130031',
        tname: '大大明',
        activities: [],
        filter: {
          'name': '',
          'start': 0,
          'end': 0
        },
        addVisible: false,
        rules: {
          name: [
            { required: true, message: '请输入安排名称', trigger: 'blur' },
          ],
          duration: [
            { required: true, message: '请设置持续时间', trigger: 'blur' },
            { validator: validateDuration, trigger: 'blur'}
          ]
        },
        activityForm: {},
        bindVisible: false,
        curRow: null,
        bindCode: ''
      }
    },
    mounted: function () {
      this.refreshTable();
    },
    methods: {
      logout: function() {
        localStorage.removeItem("token");
        this.$router.push('/login');
      },
      addActivity: function () {
        const that = this;
        this.$refs['activityForm'].validate((valid) => {
          if (valid) {
            request({
              url: '/activity/add',
              method: 'post',
              data: {
                'name': that.activityForm.name,
                'start': that.activityForm.duration[0],
                'end': that.activityForm.duration[1],
              },
              headers: {
                'token': localStorage.getItem('token')
              }
            }).then(res => {
              if (res.status == 200 && res.data.state == '200') {
                that.addVisible = false;
                that.activityForm = {};
                that.$message.success('添加成功！');
                that.refreshTable();
              }
              else {
                that.$message.error('添加失败！');
              }
            }).catch(err => {
              console.log(err);
              that.$message.error('添加失败！');
            })
          } else {
            that.$message.error('请检查您的安排设置！');
            return false;
          }
        });
      },
      refreshTable: function () {
        const that = this;
        request({
          url: '/activity/query/all',
          headers: {
            'token': localStorage.getItem('token')
          }
        }).then(res => {
          if (res.status == 200 && res.data.state == '200') {
            that.activities = res.data.dataset.content;
            for (let i = 0; i < that.activities.length; ++i) {
              const startdate = new Date(that.activities[i].start);
              const enddate = new Date(that.activities[i].end);
              that.activities[i].start = (startdate.getMonth() + 1).toString() + ' 月 ' +
                startdate.getDate().toString() + ' 日 ' + startdate.getHours().toString() + ':'
                + startdate.getMinutes().toString() + ':' + startdate.getSeconds().toString();
              that.activities[i].end = (enddate.getMonth() + 1).toString() + ' 月 ' +
                enddate.getDate().toString() + ' 日 ' + enddate.getHours().toString() + ':'
                + enddate.getMinutes().toString() + ':' + enddate.getSeconds().toString();
            }
          }
        }).catch(err => {
          console.log(err);
          that.$message.error('查询失败');
        })
      },
      manageActivity: function (row) {
        this.bindVisible = true;
        this.curRow = row;
      },
      realBind: function () {
        const activityId = this.curRow.id;
        const that = this;
        request({
          url: '/activity/bind',
          method: 'post',
          data: {
            activity: activityId,
            course: this.bindCode
          },
          headers: {
            'token': localStorage.getItem('token')
          }
        }).then(res => {
          if (res.status == 200 && res.data.state == '200') {
            that.bindVisible = false;
            that.curRow = null;
            that.$message.success('添加成功！');
          }
          else {
            console.log(err);
            that.$message.error('添加失败！');
          }
        }).catch(err => {
          console.log(err);
          that.$message.error('添加失败！');
        });
      },
      queryWithFilter: function () {
        const that = this;
        request({
          url: '/activity/query/filter',
          method: 'post',
          data: this.filter,
          headers: {
            'token': localStorage.getItem('token')
          }
        }).then(res => {
          if (res.status == 200 && res.data.state == '200') {
            that.activities = res.data.dataset.content;
            for (let i = 0; i < that.activities.length; ++i) {
              const startdate = new Date(that.activities[i].start);
              const enddate = new Date(that.activities[i].end);
              that.activities[i].start = (startdate.getMonth() + 1).toString() + ' 月 ' +
                startdate.getDate().toString() + ' 日 ' + startdate.getHours().toString() + ':'
                + startdate.getMinutes().toString() + ':' + startdate.getSeconds().toString();
              that.activities[i].end = (enddate.getMonth() + 1).toString() + ' 月 ' +
                enddate.getDate().toString() + ' 日 ' + enddate.getHours().toString() + ':'
                + enddate.getMinutes().toString() + ':' + enddate.getSeconds().toString();
            }
          }
          else {
            console.log(err);
            that.$message.error('查询失败');
          }
        }).catch(err => {
          console.log(err);
          that.$message.error('查询失败');
        });
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
  .act-list .el-input__inner{
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
    cursor: default;
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
