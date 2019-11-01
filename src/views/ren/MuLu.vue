<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>安全管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据字典目录</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="search">

      <el-form-item label="名称">
        <el-input v-model="queryForm.title" placeholder="名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchA">查询</el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="dialogVisible=true">增加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="result" border style="width: 100%" max-height="450px">
      <el-table-column type="index" label="序列"  :index="indexMethod" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="title" label="名称" align="center" min-width="20">
      </el-table-column>
      <el-table-column prop="sn" label="编码" align="center" min-width="15">
      </el-table-column>
      <el-table-column prop="intro" label="简介" align="center" min-width="25">
      </el-table-column>
      <el-table-column label="操作" min-width="25">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination style="margin-top: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryForm.page" :page-sizes="[5, 10, 20]" :page-size="queryForm.rows" layout="total, sizes, prev, pager, next, jumper"
                   :total="queryForm.total">
    </el-pagination>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @closed="handelDialogClose" width="80%">
      <el-form label-width="80" :model="mergeForm" :rules="ruleMergeForm" ref="mergeForm">
        <el-form-item label="名称" prop="title">
          <el-input v-model="mergeForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="sn">
          <el-input v-model="mergeForm.sn" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="简介" prop="intro">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="mergeForm.intro">
          </el-input>
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
    name: 'MuLu',
    data: function() {
      return {
        queryForm: {
          title: null,
          page: 1,
          rows: 5,
          total: 0
        },
        result: [],
        dialogVisible: false,
        dialogTitle: '字典目录添加',
        mergeForm: {
          id: null,
          title: null,
          sn: null,
          intro:null
        },

        ruleMergeForm: {
          title: [{
            required: true,
            message: '名称',
            trigger: 'blur'
          },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur'
            }
          ],
          sn: [{
            required: true,
            message: '编码',
            trigger: 'blur'
          },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ]

        }
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
      doSubmitMergeForm: function() {
        this.$refs['mergeForm'].validate((valid) => { //表单验证不通过则不可以提交
          if (false === valid) {
            return false;
          }

          let url = this.axios.urls.REN_DICT_ADDEDIT;
          this.axios.post(url, this.mergeForm).then((resp) => {
            this.$message({
              message: "成功！",
              type: 'success'
            });
            if (null == this.mergeForm.id) { //增加提交之后要清空文本框
              this.clealMergeForm();
            }
            this.searchA();

          }).catch((error) => {
            console.log('error');
          });
        });

      },
      handelDialogClose: function() {
        this.clealMergeForm();
        dialogTitle: '字典目录添加';
      },
      clealMergeForm: function() {
        this.$refs['mergeForm'].resetFields(); //清除表单验证，并且同时将旧值保存
        console.info('表单验证');
        this.mergeForm.id = null;
        this.mergeForm.title = null;
        this.mergeForm.sn = null;


      },
      searchA: function() {
        let url = this.axios.urls.REN_DICT_LIST;
        this.axios.post(url, this.queryForm).then((resp) => {
          this.result = resp.data.result;
          this.queryForm.total = resp.data.total;
          this.queryForm.rows = resp.data.rows;
          this.queryForm.page = resp.data.page;
        }).catch((error) => {
          console.log('error');
        });
      },
      handleEdit: function(index, row) {
        this.dialogTitle = "字典目录编辑"

        this.mergeForm.id = row.id;
        this.mergeForm.title = row.title;
        this.mergeForm.sn = row.sn;
        this.mergeForm.intro = row.intro;
        this.dialogVisible = true;
      },
      handleDelete: function(index, row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.axios.urls.REN_DICT_DEl;
          this.axios.post(url, {
            id: row.id
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
