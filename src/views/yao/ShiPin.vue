<template>
  <div style="margin-left: 30px;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>审核项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>视频认证管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" class="search" style="margin-left: 120px;">
      <el-form-item label="状态">
        <el-select v-model="queryForm.state" style="width: 100px;" size="mini" clearable placeholder="全部">
          <el-option v-for="item in list" :key="item.state" :label="item.value" :value="item.state"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="queryForm.applierName" size="mini" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker v-model="queryForm.preapplytime" style="width: 181px;" size="mini" type="date"
                        placeholder="开始日期">
        </el-date-picker>&nbsp;&nbsp;&nbsp;
        ——&nbsp;&nbsp;&nbsp;
        <el-date-picker v-model="queryForm.nextapplytime" style="width: 181px;" size="mini" type="date"
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
          <span v-if="scope.row.state==0">待审核</span>
          <span v-if="scope.row.state==1" style="color: green">审核通过</span>
          <span v-if="scope.row.state==2" style="color: red">审核拒绝</span>
        </template>
      </el-table-column>
      <el-table-column prop="auditorName" label="审核人" min-width="10" align="center">
      </el-table-column>
      <el-table-column prop="applytime" label="申请时间" type="datetime" :formatter="timestampToTime" min-width="30"
                       align="center">
      </el-table-column>
      <el-table-column label="操作" min-width="10" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state==0">
            <el-button size="medium" icon="el-icon-message" circle type="success" @click="handleLoad(scope.$index, scope.row)">审核
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加和编辑 -->
    <el-dialog title="材料认证审核" :visible.sync="dialogVisible" @close="handleDialogClose" width="80%" style="height:500px">
      <div style="width: 500px;height: 500px;border: 2px;border-color: aqua;text-align: center">
        <video-player class="video-player vjs-custom-skin"
                      ref="videoPlayer"
                      :playsinline="true"
                      :options="playerOptions"
        ></video-player>
      </div>
      <el-form :model="Form" :rules="FormRules" ref="Form" style="margin-left: 550px; margin-top: -500px; position: absolute"
               :label-position="labelPosition" label-width="80px">
        <el-input type="hidden" v-model="id"></el-input>
        <el-form-item label="用户名" size="small">
          <el-input v-model="applierName" size="small" disabled style="width: 350px; border: 1px"></el-input>
        </el-form-item>
        <el-form-item label="审核备注" size="small" prop="remark">
          <el-input type="textarea" :rows="8" style="width: 350px"
                    v-model="Form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-top: -290px; margin-left: 730px;position: absolute">
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
  //引入video样式
  import 'video.js/dist/video-js.css'
  import 'vue-video-player/src/custom-theme.css'

  //引入hls.js
  import 'videojs-contrib-hls.js/src/videojs.hlsjs'

  export default {
    name: 'ShiMing',
    data: function () {
      return {
        playerOptions: {
          playbackRates: [1.0, 2.0, 3.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "video/mp4",
            type: "video/ogg",
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4 " //url地址   http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4  https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm
          }],
          poster: "", //你的封面地址   https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg
          width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        },

        queryForm: {
          state: null,
          applierName: null,

          preapplytime: null,
          nextapplytime: null,

          page: 1,
          rows: 5,
          total: 0,
        },
        result: [],
        list: [{
          state: 0,
          value: '申请中'
        }, {
          state: 1,
          value: '审核通过'
        }, {
          state: 2,
          value: '审核拒绝'
        }],
        dialogVisible: false,
        id: null,
        applierName: null,
        auditorName: null,
        applytime: null,
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
        let url = this.axios.urls.YAO_VIDEOAUTH_LIST;
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

        this.dialogVisible = true;
      },
      doSubmitForm: function (value) {
        this.$refs['Form'].validate((valid) => {
          if (false === valid) {
            return false;
          }
          let url = this.axios.urls.YAO_VIDEOAUTH_EDIT;
          if (value == 0) {
            this.axios.post(url, {
              id: this.id,
              state: 1,
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
              state: 2,
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
      "queryForm.preapplytime"() {
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
      "queryForm.nextapplytime"() {
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

  .video-player vjs-custom-skin {
    width: 200px;
    height: 100px;
    border: 1px;
    border-color: aqua;
  }
</style>
