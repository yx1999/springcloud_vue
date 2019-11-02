<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>安全管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理aaaaaaaaaaaaaaaaaaaaaaaaaa</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="search">

      <el-form-item label="角色名">
        <el-input v-model="queryForm.roleName" placeholder="角色名"></el-input>
      </el-form-item>


      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchA">查询</el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="dialogVisible=true">增加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="result" border style="width: 100%" max-height="450px">
      <el-table-column type="index" label="序列"  :index="indexMethod" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名" align="center" min-width="20">
      </el-table-column>

      <el-table-column prop="available" label="是否可用" align="center" min-width="25">
        <template  slot-scope="scope">
          <span style="color: limegreen" v-if="scope.row.available==1" size="mini" >可用</span>
          <span style="color: crimson;" v-if="scope.row.available==0" size="mini" type="danger" >禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="简介" align="center" min-width="25">
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
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="mergeForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否禁用" prop="dictTwo">
          <template  slot-scope="scope">
            <el-switch v-model="myswitch1" v-if="mergeForm.available==1" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            <el-switch v-model="myswitch2" v-else active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input v-model="mergeForm.description" autocomplete="off"></el-input>
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
    name: 'JueSe',
    data: function() {
      return {
        queryForm: {
          roleName: null,
          page: 1,
          rows: 5,
          total: 0
        },
        dictTwo:null,
        myswitch1:true,
        myswitch2:false,
        result: [],
        dialogVisible: false,
        dialogTitle: '角色添加',
        mergeForm: {
          roleId: null,
          roleName: null,
          available:null,
          description:null
        },

        ruleMergeForm: {
          permissionName: [{
            required: true,
            message: '角色名',
            trigger: 'blur'
          },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur'
            }
          ],
          permission: [{
            required: true,
            message: '权限',
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

          if (this.dictTwo){
            this.mergeForm.available=0;
          } else{
            this.mergeForm.available=1;
          }
          let url = this.axios.urls.REN_ROLE_ADDEDIT;
          this.axios.post(url, this.mergeForm).then((resp) => {
            this.$message({
              message: "成功！",
              type: 'success'
            });
            if (null == this.mergeForm.roleId) { //增加提交之后要清空文本框
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
        dialogTitle: '角色添加';
      },
      clealMergeForm: function() {
        this.$refs['mergeForm'].resetFields(); //清除表单验证，并且同时将旧值保存
        this.mergeForm.roleId = null;
        this.mergeForm.roleName = null;

      },
      searchA: function() {
        let url = this.axios.urls.REN_ROLE_LIST;
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
        this.dialogTitle = "权限编辑"

        this.mergeForm.roleId = row.roleId;
        this.mergeForm.roleName = row.roleName;
        this.mergeForm.available = row.available;
        this.mergeForm.description=row.description;
        this.dialogVisible = true;
      },
      handleDelete: function(index, row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.axios.urls.REN_PERMISSION_DEL;
          this.axios.post(url, {
            permissionId: row.permissionId
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
