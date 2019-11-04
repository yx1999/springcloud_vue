<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>模板管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="search">

      <el-form-item label="发送通知来源">
        <el-input v-model="queryForm.noFromUser" placeholder="发送通知来源"></el-input>
      </el-form-item>


      <el-form-item label="模板类型">
        <el-select v-model="mergeForm.noCategroy">
          <el-option v-for="item in myCategroy" :key="item.pid" :label="item.pname" :value="item.pid"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchA">查询</el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="dialogVisible=true">增加
        </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="result" border style="width: 100%" max-height="450px">
      <el-table-column type="index" label="序列" :index="indexMethod" min-width="10" align="center">
      </el-table-column>

      <el-table-column prop="noFromUser" label="发送通知来源" align="center" min-width="20">
      </el-table-column>
      <el-table-column prop="noCategroy" label="消息类型" align="center" min-width="15">
      </el-table-column>
      <el-table-column prop="noTime" label="创建时间" type="datetime" :formatter="timestampToTime" align="center"
                       min-width="20">
      </el-table-column>

      <el-table-column label="操作" min-width="25">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination style="margin-top: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryForm.page" :page-sizes="[5, 10, 20]" :page-size="queryForm.rows"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="queryForm.total">
    </el-pagination>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @closed="handelDialogClose" width="60%">
      <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="addNo">增加字段</el-button>
      <el-button size="mini" type="danger" @click="delNo">删除</el-button>

      <el-form label-width="60" :model="mergeForm" :rules="ruleMergeForm" ref="mergeForm">
        <el-form-item label="发送通知来源" prop="noFromUser">
          <el-input v-model="mergeForm.noFromUser" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="通知类型" prop="noCategroy">
          <el-select v-model="mergeForm.noCategroy">
            <el-option v-for="item in myCategroy" :key="item.pname" :label="item.pname" :value="item.pname"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="温馨提示" prop="noReminder">
          <el-input v-model="mergeForm.noReminder" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="noBack">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="mergeForm.noBack">
          </el-input>
        </el-form-item>

        <el-form-item label="字段一" prop="noOne" v-show=noticeOne>
          <el-input v-model="mergeForm.noOne1" style="width: 30%"></el-input>
          :
          <el-input v-model="mergeForm.noOne2" style="width: 60%"></el-input>
        </el-form-item>


        <el-form-item label="字段二" prop="noTwo" v-show=noticeTwo>
          <el-input v-model="mergeForm.noTwo1" style="width: 30%"></el-input>
          :
          <el-input v-model="mergeForm.noTwo2" style="width: 60%"></el-input>
        </el-form-item>

        <el-form-item label="字段三" prop="noThree" v-show=noticeThree>
          <el-input v-model="mergeForm.noThree1" style="width: 30%"></el-input>
          :
          <el-input v-model="mergeForm.noThree2" style="width: 60%"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSubmitMergeForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'Notice',
    data: function () {
      return {
        queryForm: {
          noFromUser: null,
          page: 1,
          rows: 5,
          total: 0
        },
        result: [],
        dialogVisible: false,
        noticeOne: false,
        noticeTwo: false,
        noticeThree: false,
        num:0,
        dialogTitle: '模板添加',
        myCategroy: [{pname: "动账通知", pid: 1}, {pname: "转账账通知", pid: 2}],
        mergeForm: {
          noId: null,
          noFromUser: null,
          noCategroy: null,
          noReminder: null,
          noBack: null,
          noOne1: null,
          noOne2: null,
          noOne: "",
          noTwo1: null,
          noTwo2: null,
          noTwo: "",
          noThree1: null,
          noThree2: null,
          noThree: "",
        },
        ruleMergeForm: {
          noFromUser: [{
            required: true,
            message: '发送通知来源',
            trigger: 'blur'
          },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur'
            }
          ]
        }

      };
    },
    methods: {
      indexMethod: function (index) {
        return (this.queryForm.page - 1) * this.queryForm.rows + (index + 1)
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
      addNo: function() {
          this.num++;
        if(this.num==1){
          this.noticeOne=true;
        }
        else if(this.num==2){
          this.noticeTwo=true;
        }
        else if(this.num==3){
          this.noticeThree=true;
        }

      },
      delNo:function() {
        this.num--;
        if (this.num==0){
          this.noticeOne=false;
          this.mergeForm.noOne1=null;
          this.mergeForm.noOne2=null;
        }
        if (this.num==1){
          this.noticeTwo=false;
          this.mergeForm.noTwo1=null;
          this.mergeForm.noTwo2=null;
        }
        if (this.num==2){
          this.noticeThree=false;
          this.mergeForm.noThree2=null;
          this.mergeForm.noThree2=null;
        }
      },
      doSubmitMergeForm: function () {
        if (this.mergeForm.noOne1!=null){
          this.mergeForm.noOne = this.mergeForm.noOne1 + ":";
        }
        if (this.mergeForm.noOne2!=null){
          this.mergeForm.noOne +=  this.mergeForm.noOne2 + ":";
        }
        if (this.mergeForm.noTwo1!=null){
          this.mergeForm.noTwo = this.mergeForm.noTwo1 + ":";
        }
        if (this.mergeForm.noTwo2!=null){
          this.mergeForm.noTwo +=  this.mergeForm.noTwo2 + ":";
        }
        if (this.mergeForm.noThree1!=null){
          this.mergeForm.noThree = this.mergeForm.noThree1 + ":";
        }
        if (this.mergeForm.noThree2!=null){
          this.mergeForm.noThree +=  this.mergeForm.noThree2 + ":";
        }
        this.$refs['mergeForm'].validate((valid) => { //表单验证不通过则不可以提交
          if (false === valid) {
            return false;
          }


          let url = this.axios.urls.REN_TEMPLATE_ADDUPDATE;
          this.axios.post(url, this.mergeForm).then((resp) => {
            this.$message({
              message: "成功！",
              type: 'success'
            });
            if (null == this.mergeForm.noId) { //增加提交之后要清空文本框
              this.clealMergeForm();
            }
            this.searchA();

          }).catch((error) => {
            console.log('error');
          });
        });

      },
      handelDialogClose: function () {
        this.clealMergeForm();
        dialogTitle: '模板添加';
        this.noticeOne=false;
        this.noticeTwo=false;
        this.noticeThree=false;
        this.num=0;
      },
      clealMergeForm: function () {
        this.$refs['mergeForm'].resetFields(); //清除表单验证，并且同时将旧值保存
        this.mergeForm.noId = null;
        this.mergeForm.noCategroy = null;
        this.mergeForm.noBack = null;
        this.mergeForm.noFromUser = null;
        this.mergeForm.noOne1 = null;
        this.mergeForm.noOne2 = null;
        this.mergeForm.noTwo1 = null;
        this.mergeForm.noTwo2 = null;
        this.mergeForm.noThree1 = null;
        this.mergeForm.noThree2 = null;

      },
      handleEdit: function (index, row) {
        this.dialogTitle = "模板编辑"
        this.mergeForm.noId = row.noId;
        this.mergeForm.noCategroy = row.noCategroy;
        this.mergeForm.noBack = row.noBack;
        this.mergeForm.noFromUser = row.noFromUser;
        this.mergeForm.noReminder = row.noReminder;
        if (row.noOne == "" || row.noOne == null) {
          this.noticeOne = false;
        } else {
          this.noticeOne = true;
          this.num=1;
          this.mergeForm.noOne1 = row.noOne.split(":")[0];
          this.mergeForm.noOne2 = row.noOne.split(":")[1];
        }
        if (row.noTwo == "" || row.noTwo == null) {
          this.noticeTwo = false;
        } else {
          this.noticeTwo = true;
          this.num=2;
          this.mergeForm.noTwo1 = row.noTwo.split(":")[0];
          this.mergeForm.noTwo2 = row.noTwo.split(":")[1];
        }
        if (row.noThree == "" || row.noThree == null) {
          this.noticeThree = false;
        } else {
          this.noticeThree = true;
          this.mergeForm.noThree1 = row.noThree.split(":")[0];
          this.mergeForm.noThree2 = row.noThree.split(":")[1];
        }

        this.dialogVisible = true;
      },
      searchA: function () {
        let url = this.axios.urls.REN_TEMPLATE_LIST;
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
        var date = new Date(row.noTime) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M + D + h + m + s
      },

      handleDelete: function (index, row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.axios.urls.REN_TEMPLATE_DEL;
          this.axios.post(url, {
            noId: row.noId
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
    created: function () {
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
