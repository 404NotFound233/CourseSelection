<template>
  <div class="course">
    <div class="course-list">
      <div class="filter-container" style="border-bottom: 0.1vh solid black;">
        <div class="filter">
          <div>课程代码</div>
          <el-input  class='finput' v-model="filter.idx" placeholder="课程代码" clearable></el-input>
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
          <el-input  class='finput' v-model="filter.teacher" placeholder="任课教师" clearable></el-input>
        </div>
        <div class="filter">
          <div>授课校区</div>
          <el-input  class='finput' v-model="filter.campus" placeholder="授课校区" clearable></el-input>
        </div>
        <div class="filter" style="diplay: flex; justify-content: center; align-items: center;margin-left: 2vw;">
          <div>&nbsp;</div>
          <i class="el-icon-search" @click="queryWithFilter"></i>
        </div>
      </div>
      <div class="table-container">
        <el-table :data="courses" class="course-table" height="100%" emptyText="暂无符合条件的课程"
                  cellClassName="table-cell" headerRowClassName="header-row" row-class-name="table-cell"
                  headerCellClassName="header-row" highlight-current-row>
          <el-table-column prop="idx" label="课程代码" sortable></el-table-column>
          <el-table-column prop="name" label="课程名称" sortable></el-table-column>
          <el-table-column prop="college" label="开课学院" sortable></el-table-column>
          <el-table-column prop="teacher" label="任课老师" sortable></el-table-column>
          <el-table-column prop="time" label="授课时间" sortable></el-table-column>
          <el-table-column prop="campus" label="授课校区" sortable></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">管理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-avatar :src="avatarUrl" class="avatar" style="border: 0.2vh solid black;"></el-avatar>
    <div class="avatar-screen" @click="logout">登出</div>
    <div class="welcome">{{tnumber}}</div>
    <div class="welcome" style="top: 26vh;">{{tname}}</div>
    <el-button class="add-button" type="primary" @click="addDialogVisible = true">添加课程</el-button>
    <el-button class="upload-button" type="primary"@click="openMultiUpload">批量上传</el-button>
    <div class="dialogs">
      <el-dialog title="添加课程" :visible.sync="addDialogVisible">
        <el-form :model="courseForm" :rules="rules" label-width="80px" ref="courseForm">
          <el-form-item label="课程名称" prop="name">
            <el-input v-model="courseForm.name" placeholder="课程名称"></el-input>
          </el-form-item>
          <el-form-item label="开课学院" prop="college">
            <el-input v-model="courseForm.college" placeholder="开课学院"></el-input>
          </el-form-item>
          <el-form-item label="任课老师" prop="teachers">
            <el-input v-model="courseForm.teachers" placeholder="任课老师"></el-input>
          </el-form-item>
          <el-form-item label="授课校区" prop="campus">
            <el-input v-model="courseForm.campus" placeholder="授课校区"></el-input>
          </el-form-item>
          <el-form-item label="授课时间" prop="classHour">
            <el-button @click="addTimeVisible = true">添加</el-button>
            <el-dialog title="添加课时"
                :visible.sync="addTimeVisible" append-to-body>
              <el-form :model="classTime" labelWidth="80px">
                <el-form-item label="授课日">
                  <el-select v-model="classTime.weekday" placeholder="请选择">
                    <el-option key="1" value="1" label="周一"></el-option>
                    <el-option key="2" value="2" label="周二"></el-option>
                    <el-option key="3" value="3" label="周三"></el-option>
                    <el-option key="4" value="4" label="周四"></el-option>
                    <el-option key="5" value="5" label="周五"></el-option>
                    <el-option key="6" value="6" label="周六"></el-option>
                    <el-option key="7" value="7" label="周日"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="单双周">
                  <el-radio v-model="classTime.format" label="0">每周</el-radio>
                  <el-radio v-model="classTime.format" label="1">仅单周</el-radio>
                  <el-radio v-model="classTime.format" label="2">仅双周</el-radio>
                </el-form-item>
                <el-form-item label="授课课时">
                  <el-slider
                      v-model="classTime.lessons" range show-stops :min="1" :max="11" inputSize="mini">
                  </el-slider>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="addTimeVisible = false">取 消</el-button>
                <el-button @click="addTime">添加</el-button>
              </div>
            </el-dialog>
            <div v-show="classHourLength != 0">已添加{{classHourLength}}段课时</div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button @click="addCourseSingle">添加</el-button>
        </div>
      </el-dialog>
      <el-dialog title="批量上传" :visible.sync="csvDialogVisible">
        <el-upload class="upload-demo" drag :headers="additionalHeader"
            :action="uploadUrl" accept=".csv" :showFileList="false"
            :multiple="false" :before-upload="onBeforeUpload"
                   :onSuccess="onSuccess" :onError="onError">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传csv文件，且不超过1MB</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button @click="csvDialogVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import "../../assets/css/form.css";
  import "../../assets/css/fonts.css";
  import {request} from "../../network/request";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
  import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component";
  export default {
    name: 'Course',
    components: {
      ElDialog,
      ElFormItem},
    data() {
      return {
        avatarUrl: require('../../assets/teacher_avatar.png'),
        uploadUrl: 'http://localhost:8082/course/add/multiple',
        tnumber: 'DG21130031',
        tname: '大大明',
        addDialogVisible: false,
        addTimeVisible: false,
        csvDialogVisible: false,
        changeKey: Math.random(),
        rules: {
          'name': [
            { required: true, message: '请输入课程名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          'college': [
            { required: true, message: '请输入开课学院', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          'teachers': [
            { required: true, message: '请输入任课老师', trigger: 'blur' },
            { min: 2, max: 31, message: '长度在 2 到 31 个字符', trigger: 'blur' }
          ],
          'campus': [
            { required: true, message: '请输入授课校区', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          'classHour': [
            { required: true, message: '请输入授课课时', trigger: 'blur' },
          ]
        },
        courseForm: {},
        classTime: {},
        courses: [],
        filter: {},
        additionalHeader: {'token': null}
      }
    },
    computed: {
      classHourLength() {
        const key = this.changeKey;
        if (this.courseForm.classHour != null && typeof(this.courseForm.classHour) != 'undefined') {
          return this.courseForm.classHour.length;
        }
        else {
          return 0;
        }
      }
    },
    mounted: function () {
      this.refreshTable();
    },
    methods: {
      openMultiUpload() {
        const token = localStorage.getItem('token');
        if (typeof(token) != 'undefined' && token != null) {
          this.additionalHeader.token = localStorage.getItem('token');
        }
        this.csvDialogVisible = true;
      },
      logout: function() {
        localStorage.removeItem("token");
        this.$router.push('/login');
      },
      addCourseSingle: function() {
        const that = this;
        // 表单验证
        this.$refs['courseForm'].validate((valid) => {
          if (valid) {
            // 下面开始传输
            request({
              url: '/course/add/single',
              method: 'post',
              data: this.courseForm,
              headers: {
                'token': localStorage.getItem('token')
              }
            }).then(res => {
              if (res.status == 200 && res.data.state == '200') {
                that.$message.success('添加成功');
                that.addDialogVisible = false;
                that.courseForm = {};
                that.refreshTable();
              }
              else {
                that.$message.error('添加失败');
              }
            }).catch(err => {
              console.log(err);
              that.$message.error('添加失败');
              this.addDialogVisible = false;
              this.courseForm = {};
            })
          } else {
            console.log('error submit!!');
            this.addDialogVisible = false;
            this.courseForm = {};
            return false;
          }
        });
      },
      addTime: function() {
        if (this.courseForm.classHour == null || typeof(this.courseForm.classHour) == 'undefined') {
          this.courseForm.classHour = [];
        }
        this.courseForm.classHour.push({
          'weekDay': this.classTime.weekday,
          'startClass': this.classTime.lessons[0],
          'endClass': this.classTime.lessons[1],
          'classFormat': this.classTime.format
        });
        this.classTime = {lessons: [1, 11]};
        this.addTimeVisible = false;
        this.changeKey = Math.random();
      },
      onBeforeUpload: function (file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          this.$message.error('上传文件大小不能超过 1MB!');
        }
        return isLt1M;
      },
      onSuccess: function (res, file, fileList) {
        if (res.state == '200') {
          this.$message.success('上传成功!');
          this.refreshTable();
        }
        else {
          this.$message.error('上传失败!');
        }
      },
      onError: function (res, file, fileList) {
        this.$message.error('上传失败!');
      },
      refreshTable: function() {
        const that = this;
        request({
          url: '/course/query/all',
          headers: {
            'token': localStorage.getItem('token')
          }
        }).then(res => {
          if (res.status == 200 && res.data.state == 200) {
            const dataset = res.data.dataset;
            const size = dataset.size;
            const data = dataset.content;
            this.courses = [];
            for (let i = 0; i < size; ++i) {
              const single = data[i];
              this.courses.push({
                'idx': single.code,
                'name': single.name,
                'college': single.college,
                'teacher': single.teachers,
                'campus': single.campus,
                'time': single.classHour
              });
            }
          }
        }).catch(err => {
          console.log(err);
          that.$message.error('查询课程失败！');
        });
      },
      queryWithFilter: function () {
        request({
          url: '/course/query/filter',
          method: 'post',
          data: this.filter
        }).then(res => {
          if (res.status == 200 && res.data.state == 200) {
            const dataset = res.data.dataset;
            const size = dataset.size;
            const data = dataset.content;
            this.courses = [];
            for (let i = 0; i < size; ++i) {
              const single = data[i];
              this.courses.push({
                'idx': single.code,
                'name': single.name,
                'college': single.college,
                'teacher': single.teachers,
                'campus': single.campus,
                'time': single.classHour
              });
            }
          }
        }).catch(err => {
          console.log(err);
          that.$message.error('查询课程失败！');
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
  .course-list .el-input__inner{
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
    cursor: default;
  }
  .add-button {
    position: fixed;
    right: 5vw;
    top: 50vh;
  }
  .upload-button {
    position: fixed;
    right: 5vw;
    top: 60vh;
  }
  .el-slider{
    width: 75%;
    margin-left: 5px;
  }
</style>
