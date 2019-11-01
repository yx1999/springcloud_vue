<template>

  <el-container class="main-container">
    <el-aside :class="collapsed?'main-aside-collapsed':'main-aside'">
      <LeftNav></LeftNav>
    </el-aside>
    <el-container>
      <el-header class="main-header">
        <TopNav></TopNav>
      </el-header>
      <el-main class="main-center">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import TopNav from '@/components/TopNav.vue'
  import LeftNav from '@/components/LeftNav.vue'

  export default {
    name: 'AppMain',
    data: function() {
      return {

      }
    },
    methods: {},
    computed: {
      collapsed: function() {
        return this.$store.getters.collapsed
      }
    },
    components: {
      TopNav,
      LeftNav
    }
  };
</script>


<style scoped>
  .main-container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .main-aside-collapsed {
    width: 64px !important;
    height: 100%;
    background-color: #334157;
    margin: 0px;
  }

  .main-aside {
    width: 240px !important;
    height: 100%;
    background-color: #334157;
    margin: 0px;
  }

  .main-header {
    padding: 0px;
    border-left: 2px solid #333;
  }

  .main-center {
    padding: 20px;
    border-left: 2px solid #333;
  }
</style>
