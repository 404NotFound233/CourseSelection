<template>
  <div class="activity">
    <div class="course-list">
      <div class="filter-container" style="border-bottom: 0.1vh solid black;">
        <div class="filter">
          <div>课程代码</div>
          <el-input  class='finput' v-model="filter.code" placeholder="课程代码" clearable></el-input>
        </div>
        <div class="filter">
          <div>课程名称</div>
          <el-input  class='finput' v-model="filter.name" placeholder="课程名称" clearable></el-input>
        </div>
        <div class="filter">
          <div>开课学院</div>
          <el-input  class='finput' v-model="filter.college" placeholder="开课学院" clearable></el-input>
        </div>
        <div class="filter">
          <div>任课教师</div>
          <el-input  class='finput' v-model="filter.teachers" placeholder="任课教师" clearable></el-input>
        </div>
        <div class="filter">
          <div>授课校区</div>
          <el-input  class='finput' v-model="filter.campus" placeholder="授课校区" clearable></el-input>
        </div>
        <div class="filter" style="diplay: flex; justify-content: center; align-items: center;margin-left: 2vw;">
          <div>&nbsp;</div>
          <i class="el-icon-search" @click="generateCoursesAfterFilter"></i>
        </div>
      </div>
      <div class="table-container">
        <el-table :data="coursesAfterFilter" class="course-table" height="100%" emptyText="暂无符合条件的课程"
                  cellClassName="table-cell" headerRowClassName="header-row" :key="refreshKey"
                  headerCellClassName="header-row" :rowClassName="rowClassHandler">
          <el-table-column prop="code" label="课程代码" sortable></el-table-column>
          <el-table-column prop="name" label="课程名称" sortable></el-table-column>
          <el-table-column prop="college" label="开课学院" sortable></el-table-column>
          <el-table-column prop="teachers" label="任课老师" sortable></el-table-column>
          <el-table-column prop="classHour" label="授课时间" sortable></el-table-column>
          <el-table-column prop="campus" label="授课校区" sortable></el-table-column>
          <el-table-column prop="condition" label="选课情况"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleChoose(scope.row, scope.$index)" type="text" size="small"
                         v-if="scope.row.chosen == false">选课</el-button>
              <el-button @click="handleNotChoose(scope.row, scope.$index)" type="text" size="small"
                         style="color: red !important;"
                         v-show="scope.row.chosen == true">退选</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-avatar :src="avatarUrl" class="avatar" style="border: 0.2vh solid black;"></el-avatar>
    <div class="avatar-screen" @click="logout">登出</div>
    <div class="welcome">{{snumber}}</div>
    <div class="welcome" style="top: 26vh;">{{sname}}</div>
    <el-button class="chosen-button" type="primary" @click="chosenVisible = true">已选课程</el-button>
    <el-button class="schedule-button" type="primary" @click="scheduleVisible = true" v-show="false">我的课表</el-button>
    <el-button class="trade-button" type="primary" @click="tradeVisible = true">获取课程</el-button>
    <el-dialog title="已选课程"
        :visible.sync="chosenVisible">
      <el-table :data="coursesChosen" height="100%" emptyText="暂未选择课程"
                :key="refreshKeyChosen">
        <el-table-column prop="code" label="课程代码" sortable></el-table-column>
        <el-table-column prop="name" label="课程名称" sortable></el-table-column>
        <el-table-column prop="teachers" label="任课老师" sortable></el-table-column>
        <el-table-column prop="classHour" label="授课时间" sortable></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="giveClass(scope.row, scope.$index)" type="text" size="small">赠送</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="我的课表"
               :visible.sync="scheduleVisible">
    </el-dialog>
    <el-dialog title="获取课程"
               :visible.sync="tradeVisible">
      <div style="margin-bottom: 5px;">赠送码</div>
      <el-input  v-model="giveCode" placeholder="赠送码" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tradeVisible = false">取 消</el-button>
        <el-button @click="receiveClass">获取</el-button>
      </span>
    </el-dialog>
    <div class="copy-btn" v-clipboard:copy="giveCode" v-show="false" id="copybtn"
         v-clipboard:success="onCopy" v-clipboard:error="onError">empty</div>
  </div>
</template>

<script>
  import "../../assets/css/form.css";
  import "../../assets/css/fonts.css";
  import Clipboard from 'clipboard';
  import {request} from "../../network/request";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input";
  export default {
    name: 'Activity',
    components: {
      ElInput,
      ElButton},
    data() {
      return {
        avatarUrl: require('../../assets/student_avatar.png'),
        snumber: 'MF21320043',
        sname: '小小明',
        filter: {
          'code': '',
          'name': '',
          'campus': '',
          'college': '',
          'teachers': ''
        },
        courses: [],
        chosen: [],
        refreshKey: Math.random(),
        refreshKeyChosen: Math.random(),
        chosenVisible: false,
        scheduleVisible: false,
        tradeVisible: false,
        coursesChosen: [],
        giveCode: '',
        coursesAfterFilter: []
      }
    },
    mounted: function() {
      this.refreshTable();
      this.clipboard = new Clipboard(document.getElementById('copybtn'));
    },
    methods: {
      logout: function () {
        localStorage.removeItem("token");
        this.$router.push('/login');
      },
      rowClassHandler({row, rowIndex}) {
        if (row.chosen == true) {
          return 'line-row-chosen';
        }
        else {
          return 'line-row-unchosen';
        }
      },
      refreshTable() {
        const that = this;
        request({
          url: '/student/course/query/activity',
          headers: {
            'token': localStorage.getItem('token')
          },
          params: {
            id: this.$route.query.id
          }
        }).then(res => {
          if (res.status == 200 && res.data.state == '200') {
            that.courses = res.data.dataset.content;
            let courseIds = [];
            for (let i = 0; i < that.courses.length; ++i) {
              courseIds.push(that.courses[i].id);
              that.courses[i].chosen = false;
            }
            request({
              url: 'student/course/chosen',
              headers: {
                'token': localStorage.getItem('token')
              },
              data: {
                'token': localStorage.getItem('token'),
                'courses': courseIds
              },
              method: 'post'
            }).then(res => {
              if (res.status == 200 && res.data.state == '200') {
                that.chosen = [];
                for (let x in res.data.dataset.content) {
                  that.chosen.push(parseInt(x));
                  that.courses[parseInt(x)].chosen = true;
                }
                that.changeCoursesChosen();
                that.generateCoursesAfterFilter();
                this.refreshKey = Math.random();
              }
            }).catch(err => {
              that.$message.error('查询失败！');
              console.log(err);
            });
          }
          else {
            that.$message.error('查询失败！');
            console.log(res.data.message);
          }
        }).catch(err => {
          that.$message.error('查询失败！');
          console.log(err);
        });
      },
      handleChoose(row, idx) {
        const that = this;
        request({
          url: 'student/course/choose',
          headers: {
            'token': localStorage.getItem('token')
          },
          method: 'post',
          data: {
            'token': localStorage.getItem('token'),
            'course': row.id
          }
        }).then(res => {
          if (res.status == 200 && res.data.state == '200') {
            row.chosen = true;
            if (that.chosen.indexOf(idx) < 0) {
              that.chosen.push(idx);
            }
            that.changeCoursesChosen();
            that.refreshKey = Math.random();
          }
          else {
            console.log(res.data.message);
            that.$message.error('选课失败！');
          }
        }).catch(err => {
          console.log(err);
          that.$message.error('选课失败！');
        });
      },
      handleNotChoose(row, idx) {
        const that = this;
        request({
          url: 'student/course/quit',
          headers: {
            'token': localStorage.getItem('token')
          },
          method: 'post',
          data: {
            'token': localStorage.getItem('token'),
            'course': row.id
          }
        }).then(res => {
          if (res.status == 200 && res.data.state == '200') {
            row.chosen = false;
            if (that.chosen.indexOf(idx) >= 0) {
              that.chosen.splice(that.chosen.indexOf(idx), 1);
            }
            that.changeCoursesChosen();
            that.refreshKey = Math.random();
          }
          else {
            console.log(res.data.message);
            that.$message.error('退选失败！');
          }
        }).catch(err => {
          console.log(err);
          that.$message.error('退选失败！');
        });
      },
      changeCoursesChosen: function () {
        if (this.chosen == null || typeof(this.chosen) == 'undefined' || this.chosen.length == 0) {
          this.coursesChosen = [];
        }
        else{
          let res = [];
          for (let i = 0; i < this.chosen.length; ++i) {
            res.push({
              id: this.courses[this.chosen[i]].id,
              code: this.courses[this.chosen[i]].code,
              name: this.courses[this.chosen[i]].name,
              teachers: this.courses[this.chosen[i]].teachers,
              classHour: this.courses[this.chosen[i]].classHour
            });
          }
          this.coursesChosen = res;
          this.refreshKeyChosen = Math.random();
        }
      },
      onCopy (e) {
        this.$message.success("课程赠送码已复制到剪切板！")
      },
      onError (e) {
        this.$message.error("抱歉，复制失败！")
      },
      giveClass(row, idx) {
        const that = this;
        request({
          url: '/student/course/give',
          method: 'post',
          headers: {
            'token': localStorage.getItem('token')
          },
          data: {
            'token': localStorage.getItem('token'),
            'course': row.id
          }
        }).then(res => {
          if (res.status == 200 && res.data.state == '200') {
            that.giveCode = res.data.dataset.content[0];
            document.getElementById('copybtn').click();
          }
          else {
            console.log(res.data.message);
            that.$message.error('赠送失败!');
          }
        }).catch(err => {
          console.log(err);
          that.$message.error('赠送失败!');
        });
      },
      receiveClass() {
        const that = this;
        request({
          url: '/student/course/receive',
          method: 'post',
          headers: {
            'token': localStorage.getItem('token')
          },
          data: {
            'token': localStorage.getItem('token'),
            'giveCode': this.giveCode
          }
        }).then(res => {
          if (res.status == 200 && res.data.state == '200') {
            that.$message.success('领取成功！');
            that.tradeVisible = false;
            that.giveCode = '';
          }
          else {
            console.log(res.data.message);
            that.$message.error('赠送失败!');
          }
        }).catch(err => {
          console.log(err);
          that.$message.error('赠送失败!');
        });
      },
      generateCoursesAfterFilter: function () {
        this.coursesAfterFilter = [];
        for (let i = 0; i < this.courses.length; ++i) {
          this.coursesAfterFilter.push({
            'id': this.courses[i].id,
            'code': this.courses[i].code,
            'name': this.courses[i].name,
            'campus': this.courses[i].campus,
            'teachers': this.courses[i].teachers,
            'college': this.courses[i].college,
            'condition': this.courses[i].condition,
            'classHour': this.courses[i].classHour
          });
        }
        let res = false;
        if (this.filter.code != '') {
          res = this.doFilter('code')
        }
        if (!res && this.filter.name != '') {
          res = this.doFilter('name');
        }
        if (!res && this.filter.campus != '') {
          res = this.doFilter('campus');
        }
        if (!res && this.filter.college != '') {
          res = this.doFilter('college');
        }
        if (!res && this.filter.teachers != '') {
          res = this.doFilter('teachers');
        }
      },
      doFilter: function (item) {
        const filter = RegExp("^.*" + this.filter[item] + ".*$", "i");
        let todo = [];
        for (let i = 0; i < this.coursesAfterFilter.length; ++i) {
          if (this.coursesAfterFilter[i][item].match(filter) == null) {
            todo.push(i);
          }
        }
        for (let i = todo.length - 1; i >= 0; --i) {
          this.coursesAfterFilter.splice(todo[i], 1);
        }
        if (this.coursesAfterFilter.length == 0){
          return true;
        }
        else {
          return false;
        }
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
  .course-list {
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
  .course-list .el-input__inner{
    width: 12vw !important;
    height: 4vh !important;
    font-size: 1.5vh !important;
    color:#000000 !important;
    border:0.1vh solid black !important;
    margin-top: 1vh;
  }
  .course-table {
    height: 100%;
    width: 100%;
    border-radius: 2vh;
    background-color: rgba(255, 255, 255, 0);
    box-sizing: border-box;
    border: 0;
  }
  .course-list .el-table .header-row {
    background-color: rgba(255, 255, 255, 0) !important;
    color: black;
  }
  .course-list .el-table .table-cell {
    background-color: rgba(255, 255, 255, 0) !important;
  }
  .course-list .el-table .line-row-chosen {
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
  .course-list .el-table .line-row-unchosen {
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
    /*border: 1vh solid blue;*/
    display: flex;
    justify-content: center;
    align-content: center;
    font-weight: bolder;
  }
  .chosen-button {
    position: fixed;
    right: 5vw;
    top: 50vh;
  }
  .schedule-button {
    position: fixed;
    right: 5vw;
    top: 60vh;
  }
  .trade-button {
    position: fixed;
    right: 5vw;
    top: 70vh;
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
</style>
