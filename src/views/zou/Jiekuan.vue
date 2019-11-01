<template>
  <div style="margin-left: 30px; text-align: center;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>借款查询</el-breadcrumb-item>
      <el-breadcrumb-item>借款信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="search">
      <el-form-item>
        <el-input v-model="queryForm.realname" clearable placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker v-model="queryForm.preApplytime" style="width: 181px;" type="date"
                        placeholder="开始日期">
        </el-date-picker>&nbsp;&nbsp;&nbsp;
        ——&nbsp;&nbsp;&nbsp;
        <el-date-picker v-model="queryForm.nextApplytime" style="width: 181px;"type="date"
                        placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" circle @click="searchA"></el-button>
        <!--<el-button @click="doOpenDialog()">添加管理员</el-button>-->
      </el-form-item>


    </el-form>
    <el-table :data="result" border style="width: 100%" max-height="450px">
      <el-table-column type="index" label="序号" :index="indexMethod" min-width="25" align="center">
      </el-table-column>
      <el-table-column prop="realname" label="用户名" min-width="15">
      </el-table-column>
      <el-table-column prop="returntype" label="还款方式" min-width="15">
        <template slot-scope="scope">
          <span v-if="scope.row.returntype==1">分期付款</span>
        </template>
      </el-table-column>

      <el-table-column prop="bidrequesttype" label="借款类型" min-width="15">
        <template slot-scope="scope">
          <span v-if="scope.row.bidrequesttype==1">信用借款</span>
        </template>
      </el-table-column>
      <el-table-column prop="bidrequestamount" label="借款金额" min-width="20">
      </el-table-column>

      <el-table-column prop="title" label="借款标题" min-width="15">
    </el-table-column>
      <el-table-column prop="description" label="借款描述" min-width="30">
      </el-table-column>
      <el-table-column prop="note" label="风控评审意见" min-width="20">
      </el-table-column>
      <el-table-column prop="applytime" type="datetime" :formatter="timestampToTime" label="借款时间" min-width="30">
      </el-table-column>


    </el-table>
    <el-pagination style="margin-top: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryForm.page" :page-sizes="[5, 10, 20]" :page-size="queryForm.rows"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="queryForm.total">
    </el-pagination>


  </div>
</template>

<script>
  export default {
    data: function () {

      return {
        queryForm: {

          preApplytime: null,
          nextApplytime: null,

          page: 1,
          rows:
            5,
          total:
            0
        },
        result: [],
        list:[{
          value: 1,
          zt:'未禁用'
        },{
          value: 2,
          zt:'已禁用'
        }]
      };

    },
    methods: {
      timestampToTime(row, column) {
        var date = new Date(row.applytime) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M + D + h + m + s
      },
      indexMethod: function (index) {
        return (this.queryForm.page - 1) * this.queryForm.rows + (index + 1)
      },


      searchA: function () {
        let url = this.axios.urls.BASE_JIEKUAN_LISTALL;
        this.axios.post(url, this.queryForm).then((resp) => {
          this.result = resp.data.result;
          this.queryForm.total = resp.data.total;
          this.queryForm.rows = resp.data.rows;
          this.queryForm.page = resp.data.page;
        }).catch((error) => {
          console.log('error');
        });
      },
      doOpenDialog: function (rows) {
        this.dialogVisible1 = true;
      },
      handleSizeChange: function (rows) {
        this.queryForm.rows = rows;
        this.queryForm.page = 1;
        this.searchA();
      },
      handleCurrentChange: function function_name(page) {
        this.queryForm.page = page;
        this.searchA();
      },
      handleDelete: function (index, row) {
        this.$confirm('确定执行此操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.axios.urls.BASE_YONGHU_EDIT;
          this.axios.post(url, {
            id: row.id,
            locked: row.locked
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
