<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>安全管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据字典明细</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="search">
      <el-form-item label="条目">
        <el-select v-model="queryForm.parentid">
          <el-option value="">--请选择--</el-option>
          <!--<el-option v-for="c in lei" v-bind:value="c.id">{{c.title}}</el-option>-->
          <el-option v-for="item in lei" :key="item.id" :label="item.title" :value="item.id"></el-option>

        </el-select>
      </el-form-item>

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
      <el-table-column prop="tvalue" label="值" align="center" min-width="15">
      </el-table-column>
      <el-table-column prop="sequence" label="排序" align="center" min-width="15">
      </el-table-column>
      <el-table-column prop="intro" label="说明" align="center" min-width="10">
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
        <el-form-item label="条目">
          <el-select v-model="mergeForm.parentid">
            <el-option v-for="item in lei" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="值" prop="tvalue">
          <el-input v-model="mergeForm.tvalue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sequence">
          <el-input v-model="mergeForm.sequence" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="说明" prop="intro">
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
    name: 'MingXi',
    data: function() {
      return {
        queryForm: {
          title: null,
          parentid:null,
          page: 1,
          rows: 5,
          total: 0
        },
        result: [],
        lei: [],
        dialogVisible: false,
        dialogTitle: '字典明细添加',
        mergeForm: {
          id: null,
          parentid:null,
          title: null,
          tvalue: null,
          sequence:null,
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
          parentid: [{
            required: true,
            message: '值',
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

          let url = this.axios.urls.REN_DICTITEM_ADDEDIT;
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
        dialogTitle: '添加字典项';
      },
      clealMergeForm: function() {
        this.$refs['mergeForm'].resetFields(); //清除表单验证，并且同时将旧值保存
        console.info('表单验证');
        this.mergeForm.id = null;
        this.mergeForm.parentid = null;
        this.mergeForm.tvalue = null;


      },
      searchA: function() {
        let url = this.axios.urls.REN_DICTITEM_LIST;
        this.axios.post(url, this.queryForm).then((resp) => {
          this.result = resp.data.result;
          this.queryForm.total = resp.data.total;
          this.queryForm.rows = resp.data.rows;
          this.queryForm.page = resp.data.page;
        }).catch((error) => {
          console.log('error');
        });
      },
      searchDict: function() {
        let url = this.axios.urls.REN_DICT_LIST;
        this.axios.post(url, {}).then((resp) => {
          this.lei = resp.data.result;

        }).catch((error) => {
          console.log('error');
        });
      },
      handleEdit: function(index, row) {
        this.dialogTitle = "编辑字典项"

        this.mergeForm.id = row.id;
        this.mergeForm.title = row.title;
        this.mergeForm.tvalue = row.tvalue;
        this.mergeForm.parentid = row.parentid;
        this.mergeForm.intro = row.intro;
        this.mergeForm.sequence = row.sequence;
        this.dialogVisible = true;
      },
      handleDelete: function(index, row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.axios.urls.REN_DICTITEM_DEL;
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
      this.searchDict();
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
