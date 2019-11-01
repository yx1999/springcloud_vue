<template>   <!-- :default-active="$route.path" -->
  <el-menu router default-active="/center"  class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
    background-color="#334157" text-color="#fff" active-text-color="#ffd04b" :collapse="collapsed" :collapse-transition="my">
    <div class="logobox">
      <!-- <img class="logoimg" src="../assets/img/logo.png" alt=""> -->
			<span style="margin-left: -180px;">NEW TEAM</span>
    </div>
     <el-menu-item  index="/center">
      <i class="el-icon-menu"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu v-for="na in treeNodeList" :key="'key-'+na.treeNodeId" :index="na.url">

      <template slot="title">
        <i :class="na.icon"></i>
        <span>{{na.treeNodeName}}</span>
      </template>
      <el-menu-item v-for="nb in na.childN" :key="'key-'+nb.treeNodeId" :index="nb.url">
        <i :class="nb.icon"></i>
        <span>{{nb.treeNodeName}}</span>

      </el-menu-item>

    </el-submenu>

  </el-menu>
</template>
<script>
  export default {
    data: function() {
      return {
        // collapsed: false,
        my: true,
        treeNodeList: [],
        // userId:null
      };
    },
    created: function() {
      let url = this.axios.urls.BASE_TREENODE_LISTALL;
      // let url = "http://localhost:8080/ssmVue/base/listAll";
      // console.log("----------------------------------"+url);
      this.axios.post(url, {userId:this.userId}).then((resp) => {
        this.treeNodeList = resp.data.result;
      }).catch((error) => {
        console.log('error');
      });
      this.$router.push({ //核心语句
      	path: '/center', //跳转的路径
      })
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    computed: {
      collapsed: function() {
        return this.$store.getters.collapsed;
      },
      userId: function() {
        return this.$store.getters.userId;
      }
    }

  }
</script>
<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 400px;
    min-height: 100%;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    border: none;
    text-align: left;
  }

  .el-menu-item-group__title {
    padding: 0px;
  }

  .el-menu-bg {
    background-color: #1f2d3d !important;
  }

  .el-menu {
    border: none;
  }

  .logobox {
    height: 40px;
    line-height: 40px;
    color:#DAF6FF;
    font-size: 20px;
    text-align: center;
    padding: -100px 20px;
  }

  .logoimg {
    height: 40px;
  }
</style>
