<template>
  <div style="margin-left: 30px;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>审核项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>发标审核管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" class="search" style="margin-left: 100px;">
      <el-form-item label="状态">
        <el-select v-model="queryForm.bidrequeststate" style="width: 100px;" size="mini" clearable placeholder="全部">
          <el-option v-for="item in list" :key="item.state" :label="item.value" :value="item.state"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" style="margin-left: 20px">
        <el-input v-model="queryForm.title" style="width: 200px;" size="mini" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="利率" style="margin-left: 20px">
        <el-input v-model="queryForm.currentrate" style="width: 100px;" size="mini" placeholder="利率"></el-input>
      </el-form-item>
      <el-form-item label="总利息" style="margin-left: 20px">
        <el-input v-model="queryForm.totalrewardamount" style="width: 120px;" size="mini" placeholder="总利息"></el-input>
      </el-form-item>

      <!--<el-form-item>-->
      <!--<el-button size="mini" type="primary" style="width: 100px" icon="el-icon-search" @click="ChaXun()">查询-->
      <!--</el-button>-->
      <!--</el-form-item>-->

    </el-form>

    <!-- 数据表格  -->
    <el-table :data="result" border style="width: 100%" max-height="430px">
      <el-table-column type="index" label="编号" :index="indexMethod" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="20" align="center">
      </el-table-column>
      <el-table-column prop="realname" label="用户名" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="applytime" type="datetime" :formatter="timestampToTime" label="申请时间" min-width="20"
                       align="center">
      </el-table-column>
      <el-table-column prop="bidrequestamount" label="金额" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="monthes2return" label="期限(月)" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="currentrate" label="利率" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="totalrewardamount" label="总利息" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="bidrequeststate" label="状态" min-width="10" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.bidrequeststate==0">待审核</span>
          <span v-if="scope.row.bidrequeststate==1" style="color: green">通过</span>
          <span v-if="scope.row.bidrequeststate==2" style="color: red">未审核</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="10" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.bidrequeststate==0">
            <el-button size="medium" icon="el-icon-message" circle type="success" @click="handleLoad(scope.$index, scope.row)">审核
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加和编辑 -->
    <el-dialog title="发标审核" :visible.sync="dialogVisible" @close="handleDialogClose" width="80%">
      <el-form :model="Form" :rules="FormRules" ref="Form" style="margin-top: -10px;"
               :label-position="labelPosition" label-width="80px">
        <el-input type="hidden" v-model="id"></el-input>
        <el-row style="margin-top: -30px">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="标题" size="small">
                <el-input v-model="title" size="small" disabled style="width: 300px; border: 1px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6" style="margin-left: 200px">
            <div class="grid-content bg-purple">
              <el-form-item label="借款人" size="small">
                <el-input v-model="realname" size="small" disabled style="width: 300px;"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row style="margin-top: -30px">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="申请时间" size="small">
                <div style="width: 300px;background-color: #F5F7FA;border: darkgrey">{{applytime|formatDate}}</div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6" style="margin-left: 200px">
            <div class="grid-content bg-purple">
              <el-form-item label="金额" size="small">
                <el-input v-model="bidrequestamount" size="small" disabled style="width: 300px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row style="margin-top: -30px">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="期限" size="small">
                <el-input v-model="monthes2return" size="small" disabled style="width: 300px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6" style="margin-left: 200px">
            <div class="grid-content bg-purple">
              <el-form-item label="利率" size="small">
                <el-input v-model="currentrate" size="small" disabled style="width: 300px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row style="margin-top: -30px">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="总利息" size="small">
                <el-input v-model="totalrewardamount" size="small" disabled style="width: 300px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div style="height: 50px;margin-left: 380px;background-color: #D3DCE6;width:100px; ">
              <el-form-item label="总利息" size="small">
                <el-input type="textarea" :rows="3" disabled
                          style="width: 840px;position: absolute;margin-top: 49px;margin-left: -820px"
                          v-model="note"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row style="margin-left: 100px;margin-top: 80px">

          <el-form-item label="审核备注" size="small" prop="remark">
            <el-input type="textarea" :rows="3" style="width: 750px"
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
    name: 'FaBiao',
    data: function () {
      return {
        queryForm: {
          bidrequeststate: null,
          title: null,
          currentrate: null,
          totalrewardamount: null,

          page: 1,
          rows: 5,
          total: 0,
        },
        result: [],
        list: [{
          state: 0,
          value: '申请中'
        }, {
          state: 2,
          value: '审核拒绝'
        }, {
          state: 1,
          value: '审核通过'
        }],
        dialogVisible: false,
        id: null,
        realname: null,
        applytime: null,
        bidrequestamount: null,
        monthes2return: null,
        currentrate: null,
        totalrewardamount: null,
        note: null,
        title: null,
        checkremark: null,

        Form: {
          remark: null,
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
        let url = this.axios.urls.BASE_JIEKUAN_LIST;
        this.axios.post(url, this.queryForm).then((resp) => {
          this.result = resp.data.result;

          this.queryForm.total = resp.data.total;
          this.queryForm.rows = resp.data.rows;
          this.queryForm.page = resp.data.page;
        }).catch((error) => {
          console.log('您的请求有误！请联系管理员。。。。');
        });
      },
      handleLoad: function (index, row) {
        this.id = row.id;
        this.title = row.title;
        this.realname = row.realname;
        this.bidrequestamount = row.bidrequestamount;
        this.currentrate = row.currentrate;
        this.monthes2return = row.monthes2return;
        this.totalrewardamount = row.totalrewardamount;
        this.description = row.description;
        this.applytime = row.applytime;
        this.note = row.note;
        this.Form.remark = row.checkremark;

        this.dialogVisible = true;
      },
      doSubmitForm: function (value) {
        this.$refs['Form'].validate((valid) => {
          if (false === valid) {
            return false;
          }
          let url = this.axios.urls.BASE_JIEKUAN_EDITBYYAO;
          if (value == 0) {
            this.axios.post(url, {
              id: this.id,
              bidrequeststate: 1,
              checkremark: this.Form.remark
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
              bidrequeststate: 2,
              checkremark: this.Form.remark
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
        this.ChaXun();
      },
      handleDialogClose: function () {
        this.Form.remark == null;
        this.dialogVisible = false;
        this.ChaXun();
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
        var date = new Date(row.applytime) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
      "queryForm.bidrequeststate"() {
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
      "queryForm.title"() {
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
      "queryForm.currentrate"() {
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
      "queryForm.totalrewardamount"() {
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
    },
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
