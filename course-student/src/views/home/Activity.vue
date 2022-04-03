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
          <i class="el-icon-search"></i>
        </div>
      </div>
      <div class="table-container">
        <el-table :data="coursesAfterFilter" class="course-table" height="100%" emptyText="暂无符合条件的课程"
                  cellClassName="table-cell" headerRowClassName="header-row"
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
              <el-button @click="handleChoose(scope.row)" type="text" size="small"
                         v-if="scope.row.chosen == false">选课</el-button>
              <el-button @click="handleNotChoose(scope.row)" type="text" size="small"
                         style="color: red !important;"
                         v-show="scope.row.chosen == true">退选</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-avatar :src="avatarUrl" class="avatar" style="border: 0.2vh solid black;"></el-avatar>
    <div class="avatar-screen">登出</div>
    <div class="welcome">{{snumber}}</div>
    <div class="welcome" style="top: 26vh;">{{sname}}</div>
    <el-button class="chosen-button" type="primary">已选课程</el-button>
    <el-button class="schedule-button" type="primary">我的课表</el-button>
    <el-button class="trade-button" type="primary">赠送课程</el-button>
  </div>
</template>

<script>
  import "../../assets/css/form.css";
  import "../../assets/css/fonts.css";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  export default {
    name: 'Activity',
    components: {ElButton},
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
        chosen: []
      }
    },
    mounted: function() {
      this.refreshTable();
    },
    methods: {
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
              }
            }).then(res => {
              if (res.status == 200 && res.data.state == '200') {
                for (x in res.data.dataset.content) {
                  that.courses[x].chosen = true;
                }
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
      handleChoose(row) {
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
      handleNotChoose(row) {
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
          }
          else {
            console.log(res.data.message);
            that.$message.error('退选失败！');
          }
        }).catch(err => {
          console.log(err);
          that.$message.error('退选失败！');
        });
      }
    },
    computed: {
      coursesAfterFilter: function () {

        if (this.filter.code != '') {
          const filter = RegExp("^.*" + this.filter.code + ".*$", "i");
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
  .el-input__inner{
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
  .el-table .header-row {
    background-color: rgba(255, 255, 255, 0) !important;
    color: black;
  }
  .el-table .table-cell {
    background-color: rgba(255, 255, 255, 0) !important;
  }
  .el-table .line-row-chosen {
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
  .el-table .line-row-unchosen {
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
