<template>
  <div class="home">
    <div class="activities-list">
      <div class="activity" v-for="(activity, idx) in activities" @click="routeTo(activity.id)">
        <div class="act-logo">
          {{activity.name[0]}}
        </div>
        <el-tooltip class="item" effect="dark" :content="activity.name" placement="bottom">
          <div class="act-intro">
            {{actIntroContent(activity.name)}}
          </div>
        </el-tooltip>
      </div>
      <div class="empty-info" v-if="activities.length == 0">
        暂时还没有开始的选课活动
      </div>
    </div>
  </div>
</template>

<script>
  import "../../assets/css/form.css";
  import "../../assets/css/fonts.css";
  import {request} from "../../network/request";
  export default {
    name: 'Home',
    components: {},
    data() {
      return {
        activities: []
      }
    },
    methods: {
      actIntroContent: function (str) {
        if (str.length > 9) {
          return str.substring(0, 8) + '...'
        }
        return str;
      },
      refreshActivities: function () {
        const that = this;
        request({
          url: '/student/activity/list',
          headers: {
            'token': localStorage.getItem('token')
          }
        }).then(res => {
          if (res.status == 200 && res.data.state == '200') {
            that.activities = res.data.dataset.content;
          }
          else {
            console.log(err);
            that.$message.error('查询失败！');
          }
        }).catch(err => {
          console.log(err);
          that.$message.error('查询失败！');
        });
      },
      routeTo: function (id) {
        this.$router.push({path:'/act',query: {id: id}});
      }
    },
    mounted: function (){
      this.refreshActivities();
    }
  }
</script>

<style>
  body {
    background-image: url('../../assets/background.jpg');
    background-size: 100vw 100vh;
    background-repeat: no-repeat;
  }
  .activities-list {
    width: 96vw;
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
  .activity {
    padding: 1vw;
    margin-top: 3vh;
    margin-left: 4vw;
    /*border: 0.2vh solid black;*/
  }
  .act-logo {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    width: 22vh;
    height: 22vh;
    border-radius: 11vh;
    font-weight: bolder;
    color: white;
    font-size: 9vh;
    font-family: Hei, Arial, Helvetica, sans-serif;
    background-color: #6495ED;
    padding: 0;
    box-sizing: border-box;
    cursor: default;
  }
  .act-logo:hover {
    border: 0.5vh solid black;
    font-size: 10vh;
  }
  .act-intro {
    margin-top: 5vh;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 2.5vh;
    cursor: default;
  }
  .empty-info {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 3vw;
    color: darkgrey;
    font-family: Hei, Arial, Helvetica, sans-serif;
  }
</style>
