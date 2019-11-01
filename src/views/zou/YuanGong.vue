<template>
  <div style="margin-left: 30px; text-align: center;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form  :inline="true" class="search">
      <el-form-item >
        <el-input v-model="queryForm.username" clearable placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryForm.locked" filterable placeholder="状态">
          <el-option value="">请选择</el-option>
          <el-option v-for="item in list" :key="item.value" :label="item.zt" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" circle @click="searchA"></el-button>
        <el-button @click="doOpenDialog()">添加管理员</el-button>
      </el-form-item>


    </el-form>
    <el-table  :data="result"  border style="width: 100%" max-height="450px">
      <el-table-column type="index" label="序号" :index="indexMethod" min-width="25" align="center">
      </el-table-column>
      <el-table-column prop="username" label="用户名" min-width="15">
      </el-table-column>


      <el-table-column prop="state"   label="状态" min-width="20">
        <template slot-scope="scope">
          <span v-if="scope.row.state==1">未登录</span>
          <span v-if="scope.row.state==2">已登录</span>
        </template>
      </el-table-column>
      <el-table-column prop="locked" label="账号状态" min-width="20">
        <template slot-scope="scope">
          <span v-if="scope.row.locked==1">未禁用</span>
          <span v-if="scope.row.locked==2">已禁用</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="40">
        <template slot-scope="scope">
          <span v-if="scope.row.locked=='1'">
          <el-tooltip content="禁用" placement="bottom" effect="light">
            <el-button type="danger" icon="el-icon-time" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
          </el-tooltip>

					</span>
          <span v-else>
          <el-tooltip content="解禁" placement="bottom" effect="light">
            <el-button type="success" icon="el-icon-time" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
          </el-tooltip>
					</span>

          <el-button type="primary"   round @click="handleSelect(scope.$index)">查看角色</el-button>

          <!--<el-button type="primary"    round @click="doOpenDialog2(scope.$index, scope.row)">分配角色</el-button>-->


        </template>

      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryForm.page" :page-sizes="[5, 10, 20]" :page-size="queryForm.rows" layout="total, sizes, prev, pager, next, jumper"
                   :total="queryForm.total">
    </el-pagination>
    <el-dialog :title="dialogTitle" style="font-size: 30px" :visible.sync="dialogVisible" width="40%" @close="dialogVisible = false">
      <!--<li v-for='value,index in msg'>值:{{value}}   索引:{{index}} </li>-->
      <el-form v-for="value,index in result1">
        <textarea style="text-align: center; border-radius: 30px; font-size: 28px" >{{value}}</textarea>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
        <!--<el-button type="primary" @click="doSubmitMergeForm">确 定</el-button>-->
      </div>
    </el-dialog>


    <el-dialog :title="dialogTitle1" style="font-size: 30px" :visible.sync="dialogVisible1" width="30%" @close="handleDialogClose">
      <el-form :model="mergeForm" :rules="mergeFormRules" ref="mergeForm" :label-position="labelPosition" label-width="100px">
        <el-form-item label="账号名称" prop="username">
          <el-input v-model="mergeForm.username"></el-input>
        </el-form-item>

        <el-form-item label="账号密码" prop="password">
          <el-input type="password" v-model="mergeForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input type="password" v-model="mergeForm.password2" show-password></el-input>
        </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">返 回</el-button>
        <el-button type="primary" @click="toAddYuanGong">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="dialogTitle2" style="font-size: 30px" :visible.sync="dialogVisible2" width="30%" @close="dialogVisible2 = false">
      <el-form :model="addForm"  :label-position="labelPosition" label-width="100px">
        <template>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">返 回</el-button>
        <el-button type="primary" @click="AddroleName">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const cityOptions = ['ren', 'zou', 'yao', 'admin', 'guest'];
    export default {
       data:function () {
         var validatePass = (rule, value, callback) => {
           if (value === '') {
             callback(new Error('请再次输入密码'));
           } else if (value !== this.mergeForm.password) {
             console.log('value',value)
             console.log('this.password',this.password)
             callback(new Error('两次输入密码不一致!'));
           } else {
             callback();
           }
         };
         return {
           queryForm: {
             page: 1,
             rows: 10,
             total: 0
           },
           addForm:{
             userId:null,
             roleName:null
           },
           answer:[],
           dialogVisible: false,
           dialogVisible1: false,
           dialogVisible2: false,
           labelPosition: 'left',
           dialogTitle: '角色查看',
           dialogTitle1: '添加管理员',
           dialogTitle2: '分配角色',
           result:[],
           result1:[],
           checkAll: false,
           checkedCities: ["ren"],
           cities: cityOptions,
           isIndeterminate: true,
           list:[{
             value: 1,
             zt:'未禁用'
           },{
             value: 2,
             zt:'已禁用'
           }],
           password2:null,
           mergeForm:{
             username: null,
             password: null,
             salt: 1,
             state: 1,
             locked: 1,
             usertype: 2
           },
           mergeFormRules: {
             username: [{
               required: true,
               message: '请输入账号名称',
               trigger: 'blur'
             },
               {
                 min: 2,
                 max: 10,
                 message: '长度在 2 到 10 个字符',
                 trigger: 'blur'
               }],
             password: [{
               required: true,
               message: '请输入账号密码',
               trigger: 'blur'
             },
               {
                 min: 6,
                 max: 20,
                 message: '长度在 6 到 20 个字符',
                 trigger: 'blur'
               }],
             password2: [{
               required:  true,
               message: '请再次输入账号密码',
               trigger: 'blur'
             },
               { validator: validatePass, trigger: 'change' }]
           }
         };
       },
         methods : {
           handleCheckAllChange(val) {
             this.checkedCities = val ? cityOptions : [];
             this.isIndeterminate = false;
           },
           handleCheckedCitiesChange(value) {
             let checkedCount = value.length;
             this.checkAll = checkedCount === this.cities.length;
             this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
           },
           indexMethod: function(index) {
             return (this.queryForm.page - 1) * this.queryForm.rows + (index + 1)
           },
           handleDialogClose: function() {
             this.$refs['mergeForm'].resetFields();
             this.mergeForm.id = null; //清空表单数据
             this.mergeForm.username = null;
             this.mergeForm.password = null;
           },
           handleSelect:function(index){
             let url = this.axios.urls.BASE_YONGHU_LIST1;
             this.axios.post(url, {
               id: index+1
             }).then((resp) => {
               this.result1 = resp.data.result;
             }).catch((error) => {
               console.log('error');
             });
             this.dialogVisible=true;

           },
           AddroleName:function(index){
             console.log("--------userId---------------------------"+this.addForm.userId);

             this.addForm.roleName=this.checkedCities;
             console.log("------roleId---------------------------"+this.checkedCities);
             let url = this.axios.urls.REN_ROLE_ADD;
             this.axios.post(url,
               this.addForm
             ).then((resp) => {
               this.result1 = resp.data.result;
             }).catch((error) => {
               console.log('error');
             });
             this.dialogVisible2=false;

           },
           toAddYuanGong: function() {
             this.$refs['mergeForm'].validate((valid) => {
               if (false === valid) {
                 return false;
               }
               let url = this.axios.urls.BASE_YONGHU_ADD;
               this.axios.post(url, this.mergeForm).then((resp) => {
                 this.$message({
                   message: "增加成功!",
                   type: 'success'
                 });
                 this.dialogVisible1=false;
                 this.searchA();

               }).catch((error) => {});
             });
           },
           searchA: function() {
             let url = this.axios.urls.BASE_YONGHU_LIST1;
             this.axios.post(url, this.queryForm).then((resp) => {
               this.result = resp.data.result;
               this.queryForm.total = resp.data.total;
               this.queryForm.rows = resp.data.rows;
               this.queryForm.page = resp.data.page;
             }).catch((error) => {
               console.log('error');
             });
           },
           doOpenDialog:function(rows){
             this.dialogVisible1=true;
           },
           doOpenDialog2:function(index,rows){
             this.addForm.userId=rows.id;
             this.dialogVisible2=true;
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
           handleDelete: function(index, row) {
             this.$confirm('确定执行此操作吗?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
               let url = this.axios.urls.BASE_YONGHU_EDIT;
               this.axios.post(url, {
                 id: row.id,
                 locked:row.locked
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
