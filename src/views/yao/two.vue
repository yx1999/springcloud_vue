<template>
  <div style="margin-left: 30px;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>审核项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>满标二审管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" class="search" style="margin-left: 200px">
      <el-form-item label="状态">
        <el-select v-model="queryForm.state" style="width: 120px;" size="mini" clearable placeholder="全部">
          <el-option v-for="item in list" :key="item.state" :label="item.value" :value="item.state"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="queryForm.applierName" style="width: 90px" size="mini" clearable
                  placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="银行卡号">
        <el-input v-model="queryForm.accountNumber" size="mini" clearable placeholder="银行卡号"></el-input>
      </el-form-item>

      <!--<el-form-item label="申请时间">-->
      <!--<el-date-picker v-model="queryForm.preApplytime" style="width: 120px;" clearable size="mini" type="date"-->
      <!--placeholder="开始日期">-->
      <!--</el-date-picker>&nbsp;&nbsp;&nbsp;-->
      <!--——&nbsp;&nbsp;&nbsp;-->
      <!--<el-date-picker v-model="queryForm.nextApplytime" style="width: 120px;" clearable size="mini" type="date"-->
      <!--placeholder="结束日期">-->
      <!--</el-date-picker>-->
      <!--</el-form-item>-->
    </el-form>

    <!-- 数据表格  -->
    <el-table :data="result" border style="width: 100%" max-height="430px">
      <el-table-column type="index" label="编号" :index="indexMethod" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="applierName" label="用户名" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="bidrequestamount" label="金额" min-width="15" align="center">
      </el-table-column>
      <el-table-column prop="currentrate" label="利率" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="totalrewardamount" label="利息" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="accountNumber" label="银行卡号" min-width="30" align="center">
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="10" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state=='待审核'">待审核</span>
          <span v-if="scope.row.state=='一级通过'" style="color: green">一级审核通过</span>
          <span v-if="scope.row.state=='一级未审核'" style="color: red">一级审核拒绝</span>
          <span v-if="scope.row.state=='二级通过'" style="color: greenyellow">二级审核通过</span>
          <span v-if="scope.row.state=='二级未审核'" style="color: firebrick">二级审核拒绝</span>
        </template>
      </el-table-column>
      <el-table-column prop="auditorNameOne" label="一级审核人" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="audittimeone" type="datetime" :formatter="timestampToTime" label="一级审核时间" min-width="20"
                       align="center">
      </el-table-column>
      <el-table-column label="操作" min-width="10" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state=='一级通过'">
            <el-button size="medium" icon="el-icon-message" circle type="success"
                       @click="handleLoad(scope.$index, scope.row)">审核
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加和编辑 -->
    <el-dialog title="满标二审审核" :visible.sync="dialogVisible" @close="handleDialogClose" width="80%">
      <el-form :model="Form" :rules="FormRules" ref="Form" style="margin-top: -10px;"
               :label-position="labelPosition" label-width="80px">
        <el-input type="hidden" v-model="id"></el-input>
        <el-row style="margin-top: -30px">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="用户名" size="small">
                <el-input v-model="applierName" size="small" disabled style="width: 300px; border: 1px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6" style="margin-left: 200px">
            <div class="grid-content bg-purple">
              <el-form-item label="金额" size="small">
                <el-input v-model="bidrequestamount" size="small" disabled style="width: 300px;"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row style="margin-top: -30px">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="利率" size="small">
                <el-input v-model="currentrate" size="small" disabled style="width: 300px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6" style="margin-left: 200px">
            <div class="grid-content bg-purple">
              <el-form-item label="利息" size="small">
                <el-input v-model="totalrewardamount" size="small" disabled style="width: 300px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row style="margin-top: -30px">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="银行卡号" size="small">
                <el-input v-model="accountNumber" size="small" disabled style="width: 300px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6" style="margin-left: 200px">
            <div class="grid-content bg-purple">
              <el-form-item label="借款期限" size="small">
                <el-input v-model="monthes2return" size="small" disabled style="width: 300px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row style="margin-top: -30px">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="借款描述" size="small">
                <el-input type="textarea" disabled :rows="3" style="width: 300px"
                          v-model="description"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6" style="margin-left: 200px;">
            <div class="grid-content bg-purple">
              <el-form-item label="申请时间" size="small">
                <div style="width: 300px;height: 70px;background-color: #F5F7FA;border: darkgrey">
                  {{applytime|formatDate}}
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row style="margin-top: -30px">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="审核人" size="small">
                <el-input disabled style="width: 300px"
                          v-model="auditorNameOne"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6" style="margin-left: 200px;">
            <div class="grid-content bg-purple">
              <el-form-item label="审核时间" size="small">
                <div style="width: 300px;background-color: #F5F7FA;border: darkgrey">
                  {{audittimeone|formatDate}}
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row style="margin-left: 100px">
          <el-form-item label="审核备注" size="small" prop="remark">
            <el-input type="textarea" :rows="3" style="width: 750px;"
                      v-model="Form.remark"></el-input>
          </el-form-item>
        </el-row>
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
          state: '二级审核',

          // preApplytime:null,
          // nextApplytime:null,

          page: 1,
          rows: 5,
          total: 0,
        },
        result: [],
        list: [{
          state: '二级审核',
          value: '全部'
        }, {
          state: '一级未审核',
          value: '一级审核拒绝'
        }, {
          state: '一级通过',
          value: '一级审核通过'
        }, {
          state: '二级未审核',
          value: '二级审核拒绝'
        }, {
          state: '二级通过',
          value: '二级审核通过'
        }],
        dialogVisible: false,
        id: null,
        applierName: null,
        bidrequestamount: null,
        currentrate: null,
        monthes2return: null,
        totalrewardamount: null,
        description: null,
        applytime: null,
        accountNumber: null,
        auditorNameOne: null,
        audittimeone: null,
        Form: {
          state: null,
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
        let url = this.axios.urls.YAO_FULLSCALETRIAL_LIST;
        console.log(this.queryForm.state)
        if (this.queryForm.state == '') {
          this.queryForm.state = '二级审核'
        }
        console.log(this.queryForm.state)
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
        this.bidrequestamount = row.bidrequestamount;
        this.currentrate = row.currentrate;
        this.monthes2return = row.monthes2return;
        this.totalrewardamount = row.totalrewardamount;
        this.description = row.description;
        this.applytime = row.applytime;
        this.accountNumber = row.accountNumber;
        this.audittimeone = row.audittimeone;
        this.auditorNameOne = row.auditorNameOne;

        this.dialogVisible = true;
      },
      doSubmitForm: function (value) {
        this.$refs['Form'].validate((valid) => {
          if (false === valid) {
            return false;
          }
          let url = this.axios.urls.YAO_FULLSCALETRIAL_EDIT;
          if (value == 0) {
            this.axios.post(url, {
              id: this.id,
              state: "二级通过",
              auditoridtwo: this.$store.getters.userId,
              remarktwo: this.Form.remark
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
              state: "二级未审核",
              auditoridtwo: this.$store.getters.userId,
              remarktwo: this.Form.remark
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
        var date = new Date(row.audittimeone) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
      "queryForm.applierName"() {
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
      "queryForm.accountNumber"() {
        this.ChaXun();
      },
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
