<template>
  <div style="margin-left: 30px;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>审核项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>线下充值管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" class="search">
        <el-form-item label="状态">
          <el-select v-model="queryForm.state" style="width: 100px;" size="mini" clearable placeholder="全部">
            <el-option v-for="item in list" :key="item.state" :label="item.value" :value="item.state"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行账号">
         <el-input size="mini" style="width: 180px" clearable v-model="queryForm.accountNumber"></el-input>
        </el-form-item>
        <el-form-item label="交易号">
          <el-input v-model="queryForm.tradecode" style="width: 120px" clearable size="mini" placeholder="交易号"></el-input>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker v-model="queryForm.preApplytime" style="width: 150px;" clearable size="mini" type="date"
                          placeholder="开始日期">
          </el-date-picker>&nbsp;&nbsp;&nbsp;
          —
          <el-date-picker v-model="queryForm.nextApplytime" style="width: 150px;" clearable size="mini" type="date"
                          placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
    </el-form>

    <!-- 数据表格  -->
    <el-table :data="result" border style="width: 100%" max-height="430px">
      <el-table-column type="index" label="编号" :index="indexMethod" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="applierName" label="用户名" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="tradecode" label="交易号" min-width="15" align="center">
      </el-table-column>
      <el-table-column prop="tradetime" label="交易时间" type="datetime" :formatter="timestampToTime" min-width="15" align="center">
      </el-table-column>
      <el-table-column prop="amount" label="充值金额" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="accountNumber" label="平台账号" min-width="20" align="center">
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="10" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state=='待审核'">待审核</span>
          <span v-if="scope.row.state=='通过'" style="color: green">审核通过</span>
          <span v-if="scope.row.state=='未审核'" style="color: red">审核拒绝</span>
        </template>
      </el-table-column>
      <el-table-column prop="auditorName" label="审核人" min-width="10" align="center">
      </el-table-column>
      <el-table-column label="操作" min-width="10" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state=='待审核'">
            <el-button size="medium" icon="el-icon-message" circle type="success" @click="handleLoad(scope.$index, scope.row)">审核
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加和编辑 -->
    <el-dialog title="线下充值审核" :visible.sync="dialogVisible" @close="handleDialogClose" width="70%">
      <el-form :model="Form" :rules="FormRules" ref="Form" style="margin-top: -30px;margin-left: 50px"
               :label-position="labelPosition" label-width="80px">
        <el-input type="hidden" v-model="id"></el-input>
        <el-form-item label="用户名" size="small">
          <el-input v-model="applierName" size="small" disabled style="width: 750px; border: 1px"></el-input>
        </el-form-item>
        <el-form-item label="交易号" size="small">
          <el-input v-model="tradecode" size="small" disabled style="width: 750px;"></el-input>
        </el-form-item>

        <el-form-item label="交易金额" size="small">
          <el-input v-model="amount" size="small" disabled style="width: 750px"></el-input>
        </el-form-item>
        <el-form-item label="交易时间" size="small">
          <!--<el-input size="small" disabled style="width: 750px">{{this.tradetime|formatDate}}</el-input>-->
          <div>{{tradetime|formatDate}}</div>
        </el-form-item>

        <el-form-item label="审核备注" size="small" prop="remark">
          <el-input type="textarea" :rows="3" style="width: 750px"
                    v-model="Form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-top: -50px; margin-left: 630px;position: absolute">
        <el-button @click="handleDialogClose" size="mini">取 消</el-button>
        <el-button type="success" size="mini" @click="doSubmitForm(0)">审核通过</el-button>
        <el-button type="danger" size="mini" @click="doSubmitForm(1)">审核拒绝</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination style="margin-top: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryForm.page" :page-sizes="[3, 5, 10, 20]" :page-size="queryForm.rows"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="queryForm.total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'ShiMing',
    data: function () {
      return {
        queryForm: {
          state: '待审核',

          preApplytime:null,
          nextApplytime:null,

          page: 1,
          rows: 5,
          total: 0,
        },
        result: [],
        list: [{
          state: '待审核',
          value: '申请中'
        }, {
          state: '未审核',
          value: '审核拒绝'
        }, {
          state: '通过',
          value: '审核通过'
        }],
        dialogVisible: false,
        id: null,
        applierName: null,
        tradecode: null,
        tradetime: null,
        amount: null,
        accountNumber: null,
        auditorName: null,
        Form: {
          remark: null
        },
        FormRules: {
          remark: [{
            required: true,
            message: "请输入备注",
            trigger: 'blur'
          }]
        },
        labelPosition: 'right'
      };
    },
    methods: {
      indexMethod: function (index) {
        return (this.queryForm.page - 1) * this.queryForm.rows + (index + 1)
      },
      ChaXun: function () {
        let url = this.axios.urls.YAO_RECHARGEOFFFLINE_LIST;
        this.axios.post(url, this.queryForm).then((resp) => {
          this.result = resp.data.list;

          this.queryForm.total = resp.data.total;
          this.queryForm.rows = resp.data.rows;
          this.queryForm.page = resp.data.page;
        }).catch((error) => {
          console.log('您的请求有误！请联系管理员。。。。');
        });
      },
      handleLoad: function (index, row) {
        this.id = row.id;
        this.applierName = row.applierName;
        this.tradecode = row.tradecode;
        this.tradetime = row.tradetime;
        this.amount = row.amount;

        this.dialogVisible = true;
      },
      doSubmitForm: function (value) {
        this.$refs['Form'].validate((valid) => {
          if (false === valid) {
            return false;
          }
          let url = this.axios.urls.YAO_RECHARGEOFFFLINE_EDIT;
          if (value == 0) {
            this.axios.post(url, {
              id: this.id,
              state: "通过",
              auditorId: this.$store.getters.userId,
              remark: this.Form.remark
            }).then((resp) => {
              this.$message({
                message: "即将为您添加一条备注，请稍等。。。",
                type: 'warning'
              });
              setTimeout(() => {
                const loading = this.$loading({
                  lock: true,
                  text: 'Loading',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                  loading.close();
                }, 4000);
              }, 3000);
              this.handleDialogClose();
              setTimeout(() => {
                if (resp.data.code == 0) {
                  this.$message({
                    message: resp.data.message,
                    type: 'success'
                  });
                } else {
                  this.$message.error(
                    resp.data.message
                  );
                }
              }, 7000);
            }).catch((error) => {
            });
          } else {
            this.axios.post(url, {
              id: this.id,
              state: "未审核",
              auditorId: this.$store.getters.userId,
              remark: this.Form.remark
            }).then((resp) => {
              this.$message({
                message: "即将为您添加一条备注，请稍等。。。",
                type: 'warning'
              });
              setTimeout(() => {
                const loading = this.$loading({
                  lock: true,
                  text: 'Loading',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                  loading.close();
                }, 4000);
              }, 3000);
              this.handleDialogClose();
              setTimeout(() => {
                if (resp.data.code == 0) {
                  this.$message({
                    message: resp.data.message,
                    type: 'success'
                  });
                } else {
                  this.$message.error(
                    resp.data.message
                  );
                }
              }, 7000);
            }).catch((error) => {
            });
          }
        });
      },
      handleDialogClose: function () {
        this.Form.remark = null;
        this.dialogVisible = false;
      },
      handleSizeChange: function (rows) {
        this.queryForm.rows = rows;
        this.queryForm.page = 1;
        this.ChaXun();
      },
      handleCurrentChange: function function_name(page) {
        this.queryForm.page = page;
        this.ChaXun();
      },
      timestampToTime(row, column) {
        var date = new Date(row.tradetime) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M + D + h + m + s
      }
    },
    created: function () {
      this.ChaXun();
    },
    filters: {
      formatDate: function (value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + MM + '-' + d;
      }
    },
    watch: {
      "queryForm.state"() {
        setTimeout(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          loading.close();
          this.ChaXun();
        }, 4000);
      },
      "queryForm.preApplytime"() {
        setTimeout(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          loading.close();
          this.ChaXun();
        }, 4000);
      },
      "queryForm.nextApplytime"() {
        setTimeout(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          loading.close();
          this.ChaXun();
        }, 4000);
      },
      "queryForm.tradecode"() {
          this.ChaXun();
      },
      "queryForm.accountNumber"() {
          this.ChaXun();
      }
    }
  }
</script>

<style scoped>
  .search {
    margin-top: 20px;
  }

  .searchb {
    margin-top: -20px;
  }

  .userRole {
    width: 100%;
  }

  .el-dialog {
    margin-top: -100px;
  }

  .el-col {
    /*border-radius: 4px;*/
    margin-left: 100px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    /*min-height: 36px;*/
  }

  .row-bg {
    background-color: #f9fafc;
  }
</style>
