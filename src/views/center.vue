<template>

  <div id="clock" style="height: 450px; width: 79%; margin-top: 27px; margin-left: 120px;">
    <img src="@/assets/18.png" />
    <h1>欢迎<span style="color:#FFFFFF; font-size: 30px;">{{name}}</span>来到客户管理系统</h1>
    <div style="width: 80%;margin-left: 100px;">
      <hr />
      <marquee>
        <div>
          欢迎您的的使用！！！
        </div>
      </marquee>
      <hr />
    </div>
    <div style="font-size: 50px;position: absolute; margin-top: 50px;margin-left: 180px;">系统为您获取当前时间为:<div>{{ date | formaDate }}</div>
    </div>

  </div>
</template>

<script>
  var padaDate = function(value) {
    return value < 10 ? '0' + value : value;
  };
  export default {
    name: 'center',
    data: function() {
      return {
        date: new Date(),
        name: this.$store.getters.username
      }
    },
    filters: {
      //设置一个函数来进行过滤
      formaDate: function(value) {
        //创建一个时间日期对象
        var date = new Date();
        var year = date.getFullYear(); //存储年
        var month = padaDate(date.getMonth() + 1); //存储月份
        var day = padaDate(date.getDate()); //存储日期
        var hours = padaDate(date.getHours()); //存储时
        var minutes = padaDate(date.getMinutes()); //存储分
        var seconds = padaDate(date.getSeconds()); //存储秒
        //返回格式化后的日期
        return year + '年' + month + '月' + day + '日' + hours + '时' + minutes + '分' + seconds + '秒';
      }
    },
    mounted: function() {
      //创建定时器更新时间
      var _this = this;
      this.timeId = setInterval(function() {
        _this.date = new Date();
      }, 1000);
    },
    beforeDestroy: function() {
      //实例销毁前青出于定时器
      if (this.timeId) {
        clearInterval(this.timeId);
      }
    },
  }
</script>

<style>
  #clock {
    background: #0f3854;
    background: -webkit-radial-gradient(center ellipse, #0a2e38 0%, #000000 70%);
    background: radial-gradient(ellipse at center, #0a2e38 0%, #000000 70%);
    background-size: 100%;
  }

  p {
    margin: 0;
    padding: 0;
  }

  #clock {
    font-family: 'Share Tech Mono', monospace;
    color: #ffffff;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    color: #daf6ff;
    text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
  }

  #clock .time {
    letter-spacing: 0.05em;
    font-size: 80px;
    padding: 5px 0;
  }

  #clock .date {
    letter-spacing: 0.1em;
    font-size: 24px;
  }

  #clock .text {
    letter-spacing: 0.1em;
    font-size: 12px;
    padding: 20px 0 0;
  }
</style>
