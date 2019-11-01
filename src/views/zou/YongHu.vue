<template>
  <div style="margin-left: 30px; text-align: center;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>平台用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>平台用户信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form  :inline="true" class="search">
      <el-form-item >
        <el-input v-model="queryForm.username" clearable placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item >
        <el-select v-model="queryForm.locked" filterable placeholder="状态">
          <el-option value="">请选择</el-option>
          <el-option v-for="item in list" :key="item.value" :label="item.zt" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" circle @click="searchA"></el-button>

      </el-form-item>

      <el-form-item>
        <el-button type="info" round  @click="Tojiekuan">借款用户</el-button>

      </el-form-item>
    </el-form>
    <el-table :data="result" border style="width: 100%" max-height="450px">
      <el-table-column prop="id" label="编号" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="username" label="用户名" min-width="15">
      </el-table-column>

      <el-table-column prop="state"   label="状态" min-width="20">
        <template slot-scope="scope">
          <span v-if="scope.row.state==1">未登录</span>
          <span v-if="scope.row.state==2">已登录</span>
        </template>
      </el-table-column>
      <el-table-column prop="locked" label="账号状态" min-width="20">
        <template slot-scope="scope">
          <span v-if="scope.row.locked==1">未禁用</span>
          <span v-if="scope.row.locked==2">已禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="usertype" label="用户类型" min-width="15">
        <template slot-scope="scope">
          <span v-if="scope.row.usertype==1">平台用户</span>
          <span v-if="scope.row.usertype==2">后台管理</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="40">
        <template slot-scope="scope">
          <span v-if="scope.row.locked=='1'">
          <el-tooltip content="禁用" placement="bottom" effect="light">
            <el-button type="danger" icon="el-icon-time" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
          </el-tooltip>

					</span>
          <span v-else>
          <el-tooltip content="解禁" placement="bottom" effect="light">
            <el-button type="success" icon="el-icon-time" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
          </el-tooltip>

					</span>




        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryForm.page" :page-sizes="[5, 10, 20]" :page-size="queryForm.rows" layout="total, sizes, prev, pager, next, jumper"
                   :total="queryForm.total">
    </el-pagination>
  </div>
</template>

<script>
    export default {
       data:function () {
         return {
           queryForm: {
             id: null,
             username: null,
             password: null,
             salt: null,
             state: null,
             locked: null,
             usertype: null,
             page: 1,
             rows: 5,
             total: 0
           },
           result:[],
           list:[{
             value: 1,
             zt:'未禁用'
           },{
             value: 2,
             zt:'已禁用'
           }]
         };

       },
         methods : {
           searchA: function() {
             let url = this.axios.urls.BASE_YONGHU_LISTALL;
             this.axios.post(url, this.queryForm).then((resp) => {
               this.result = resp.data.result;
               this.queryForm.total = resp.data.total;
               this.queryForm.rows = resp.data.rows;
               this.queryForm.page = resp.data.page;
               // console.log('成功！');
             }).catch((error) => {
               console.log('error');
             });
           },
           Tojiekuan:function(){
             this.$router.push({
               path:'/zou/Jie'
             });
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
           handleDelete: function(index, row) {
             this.$confirm('确定执行此操作吗?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
               let url = this.axios.urls.BASE_YONGHU_EDIT;
               this.axios.post(url, {
                 id: row.id,
                 locked:row.locked
               }).then((resp) => {
                 this.$message({
                   message: "操作成功！",
                   type: 'success'
                 });
                 this.searchA();
               }).catch((error) => {
                 console.log('error');
               });
             }).catch(() => {
               this.$message({
                 type: 'info',
                 message: '已取消操作'
               });
             });
           }
         },
         created() {
          this.searchA();
         }

    }
</script>

<style scoped>
  .search {
    margin-top: 40px;
  }

  .userRole {
    width: 100%;
  }
</style>
