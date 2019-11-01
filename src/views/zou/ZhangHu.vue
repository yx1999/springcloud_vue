<template>
  <div style="margin-left: 30px; text-align: center;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>系统账户流失</el-breadcrumb-item>
      <el-breadcrumb-item>账户资金信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form  :inline="true" class="search">
      <el-form-item >
        <el-input v-model="queryForm.username" clearable placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item >
        <el-select v-model="queryForm.locked" filterable placeholder="状态">
          <el-option value="">请选择</el-option>
          <el-option v-for="item in list" :key="item.value" :label="item.zt" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" circle @click="searchA"></el-button>

      </el-form-item>


    </el-form>
    <el-table :data="result" border style="width: 100%" max-height="450px">
      <el-table-column prop="id" label="编号" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="username" label="用户名" min-width="15">
      </el-table-column>
      <el-table-column prop="yihuan" label="已还款金额" min-width="20">
      </el-table-column>

      <el-table-column prop="yinghuan" label="应还款金额" min-width="30">
      </el-table-column>
      <el-table-column prop="returntype" label="还款方式" min-width="20">
        <template slot-scope="scope">
          <span v-if="scope.row.returntype==1">分期付款</span>
        </template>
      </el-table-column>
      <el-table-column prop="returntime" type="datetime" :formatter="timestampToTime" label="还款时间" min-width="30">
      </el-table-column>

      <el-table-column prop="yinghuantime" type="datetime" :formatter="timestampToTime2" label="还款期限" min-width="30">
      </el-table-column>
      <el-table-column prop="shubi" label="期数" min-width="15">
      </el-table-column>
      <el-table-column prop="shouxu" label="手续费" min-width="15">
      </el-table-column>
      <el-table-column prop="state"   label="状态" min-width="20">
        <template slot-scope="scope">
          <span v-if="scope.row.returntype==1">未逾期</span>
          <span v-if="scope.row.returntype==2">已逾期</span>
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
             page: 1,
             rows: 5,
             total: 0
           },
           result:[],
           list:[{
             value: 1,
             zt:'未逾期'
           },{
             value: 2,
             zt:'已逾期'
           }
       ]
         };

       },
         methods : {
           timestampToTime(row, column) {
             var date = new Date(row.returntime) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
             var Y = date.getFullYear() + '-'
             var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
             var D = date.getDate() + ' '
             var h = date.getHours() + ':'
             var m = date.getMinutes() + ':'
             var s = date.getSeconds()
             return Y + M + D + h + m + s
           },
           timestampToTime2(row, column) {
             var date = new Date(row.yinghuantime) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
             var Y = date.getFullYear() + '-'
             var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
             var D = date.getDate() + ' '
             var h = date.getHours() + ':'
             var m = date.getMinutes() + ':'
             var s = date.getSeconds()
             return Y + M + D + h + m + s
           },
           searchA: function () {
             let url = this.axios.urls.BASE_ZHANGHU_LISTALL;
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

           handleSizeChange: function (rows) {
             this.queryForm.rows = rows;
             this.queryForm.page = 1;
             this.searchA();
           },
           handleCurrentChange: function function_name(page) {
             this.queryForm.page = page;
             this.searchA();
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
