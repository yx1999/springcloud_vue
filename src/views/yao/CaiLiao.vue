<template>
  <div style="margin-left: 30px;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>审核项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>材料认证管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" class="search" style="margin-left: 150px;">
      <el-form-item label="状态">
        <el-select v-model="queryForm.state" style="width: 100px;" size="mini" clearable placeholder="全部">
          <el-option v-for="item in list" :key="item.state" :label="item.value" :value="item.state"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker v-model="queryForm.preApplytime" style="width: 181px;" size="mini" type="date"
                        placeholder="开始日期">
        </el-date-picker>&nbsp;&nbsp;&nbsp;
        ——&nbsp;&nbsp;&nbsp;
        <el-date-picker v-model="queryForm.nextApplytime" style="width: 181px;" size="mini" type="date"
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
      <el-table-column prop="state" label="状态" min-width="15" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state=='待审核'">待审核</span>
          <span v-if="scope.row.state=='通过'" style="color: green">审核通过</span>
          <span v-if="scope.row.state=='未审核'" style="color: red">审核拒绝</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分数" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="title" label="资料类型" min-width="10" align="center">
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
    <el-dialog title="材料认证审核" :visible.sync="dialogVisible" @close="handleDialogClose" width="50%">
      <el-form :model="Form" :rules="FormRules" ref="Form" style="margin-top: -50px;margin-left: 50px"
               :label-position="labelPosition" label-width="80px">
        <el-input type="hidden" v-model="id"></el-input>
        <el-form-item label="用户名" size="small">
          <el-input v-model="applierName" size="small" disabled style="width: 350px; border: 1px"></el-input>
        </el-form-item>

        <el-form-item label="资料类型" size="small">
          <el-input v-model="title" size="small" disabled style="width: 350px"></el-input>
        </el-form-item>

        <el-form-item label="资料图片" size="small">
          <el-image :src="image" style="width: 350px;height: 150px"></el-image>
        </el-form-item>

        <el-form-item label="征信分数" size="small" style="margin-top: -15px">
          <el-select v-model="Form.scroe" style="width: 350px;" size="mini" clearable placeholder="全部">
            <el-option v-for="item in scoreList" :key="item.key" :label="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核备注" size="small" prop="remark">
          <el-input type="textarea" :rows="3" style="width: 350px"
                    v-model="Form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-top: -50px; margin-left: 230px;position: absolute">
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
          state: '',

          preApplytime:null,
          nextApplytime:null,

          page: 1,
          rows: 5,
          total: 0,
        },
        result: [],
        list: [{
          state: '',
          value: '全部'
        }, {
          state: '待审核',
          value: '申请中'
        }, {
          state: '未审核',
          value: '审核拒绝'
        }, {
          state: '通过',
          value: '审核通过'
        }],
        scoreList: [{
          key: 1,
          value: 1
        }, {
          key: 2,
          value: 2
        }, {
          key: 3,
          value: 3
        }, {
          key: 4,
          value: 4
        }, {
          key: 5,
          value: 5
        }],
        dialogVisible: false,
        id: null,
        applierName: null,
        state: null,
        title: null,
        auditorName: null,
        image: null,
        Form: {
          remark: null,
          scroe: 1,
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
        let url = this.axios.urls.YAO_USERFILE_LIST;
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
        this.title = row.title;
        this.score=row.score;
        this.image = "https://20190820yaoxu.oss-cn-chengdu.aliyuncs.com/" + row.image;

        this.dialogVisible = true;
      },
      doSubmitForm: function (value) {
        this.$refs['Form'].validate((valid) => {
          if (false === valid) {
            return false;
          }
          let url = this.axios.urls.YAO_USERFILE_EDIT;
          if (value == 0) {
            this.axios.post(url, {
              id: this.id,
              state: "通过",
              auditorId: this.$store.getters.userId,
              score:parseInt(this.score)+parseInt(this.Form.scroe) ,
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
        this.ChaXun();
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
