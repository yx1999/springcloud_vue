<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>安全管理</el-breadcrumb-item>
      <el-breadcrumb-item>登录历史</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="search">
      <el-form-item label="状态">
        <el-select v-model="queryForm.lstate">
          <el-option value="">--不限--</el-option>
          <el-option v-for="c in lei" v-bind:value="c.zstate">{{c.zstate}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="queryForm.userType">
          <el-option value="">--不限--</el-option>
          <!--<el-option v-for="c in types" v-bind:value="c.zstate">{{c.zstate}}</el-option>-->
          <el-option v-for="item in types" :key="item.tid" :label="item.tname" :value="item.tid"></el-option>

        </el-select>
      </el-form-item>

      <el-form-item label="登录名">
        <el-input v-model="queryForm.userName" placeholder="登录名"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary"  @click="deleteList">删除后三条</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchA">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="result" border style="width: 100%" max-height="450px">
      <el-table-column type="index" label="序列"  :index="indexMethod" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="userName" label="用户名" align="center" min-width="20">
      </el-table-column>
      <el-table-column prop="lstate" label="状态" align="center" min-width="15">
      </el-table-column>
      <el-table-column prop="lremark" label="说明" align="center" min-width="15">
      </el-table-column>
      <el-table-column prop="ltime" label="时间" type="datetime" :formatter="timestampToTime" align="center" min-width="20">
      </el-table-column>
      <el-table-column prop="userType" label="用户类型" align="center" min-width="10">
        <template slot-scope="scope">
          <span v-if="scope.row.userType==1">前台用户</span>
          <span v-if="scope.row.userType==2">后台管理员</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="25">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination style="margin-top: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryForm.page" :page-sizes="[5, 10, 20]" :page-size="queryForm.rows" layout="total, sizes, prev, pager, next, jumper"
                   :total="queryForm.total">
    </el-pagination>



  </div>
</template>

<script>
  export default {
    name: 'DengLu',
    data: function() {
      return {
        queryForm: {
          userName: null,
          lstate:null,
          userType:null,
          page: 1,
          rows: 5,
          total: 0
        },
        result: [],
        lei: [{zstate:"成功"},{zstate:"失败"}],
        types:[{tname:"后台管理员",tid:2},
          {tname:"前台用户",tid:1}]

      };
    },
    methods: {
      indexMethod: function(index) {
        return (this.queryForm.page - 1) * this.queryForm.rows + (index + 1)
      },
      handleSizeChange: function(rows) {
        this.queryForm.rows = rows;
        this.queryForm.page = 1;
        this.searchA();
      },
      handleCurrentChange: function function_name(page) {
        this.queryForm.page = page;
        this.searchA();

      },
      deleteList:function() {

        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.axios.urls.REN_HISTORY_DELLIST;
          this.axios.post(url, {}).then((resp) => {
            this.$message({
              message: "删除成功！",
              type: 'success'
            });

            this.searchA();

          }).catch((error) => {
            console.log('error');
          });


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
  },
      searchA: function() {
        let url = this.axios.urls.REN_HISTORY_LIST;
        this.axios.post(url, this.queryForm).then((resp) => {
          this.result = resp.data.result;
          this.queryForm.total = resp.data.total;
          this.queryForm.rows = resp.data.rows;
          this.queryForm.page = resp.data.page;
        }).catch((error) => {
          console.log('error');
        });
      },
      timestampToTime(row, column) {
        var date = new Date(row.ltime) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M + D + h + m + s
      },

      handleDelete: function(index, row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.axios.urls.REN_HISTORY_DEL;
          this.axios.post(url, {
            lid: row.lid
          }).then((resp) => {
            this.$message({
              message: "删除成功！",
              type: 'success'
            });

            this.searchA();

          }).catch((error) => {
            console.log('error');
          });


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    created: function() {
      this.searchA();
    }
  }
</script>

<style scoped>
  .search {
    margin-top: 20px;
  }

  userRole {
    width: 100%;
  }
</style>
