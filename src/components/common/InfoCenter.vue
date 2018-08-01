<template>
  <div class="infoCenter">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{path: '/index'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息中心</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="系统消息" name="systemMessage">
          <template v-if="sysMessage.length">
            <div v-for="message in sysMessage" v-loading="loading" element-loading-text="拼命加载中">
              <el-row class="info">
                <el-col :span="23">
                  <div style="display: flex;justify-content: flex-start;">
                    <div class="AllIcon">
                      <i :class="[message.icon]"></i>
                    </div>
                    <div>
                      <div>
                        <span v-text="message.moduleName" class="name"></span>
                        <span v-text="message.msgTitle" :class="[message.status === 1 ? 'success' : 'error']"></span>
                      </div>
                      <div>
                        <span v-text="message.content" class="content"></span>
                        <router-link :to="{ path: message.path, query: { data: message.query}}" class="link">
                          <span>{{message.link}}</span>
                        </router-link>
                        <!--<span v-text="message.link"></span>-->
                      </div>
                      <div v-text="message.time" class="date"></div>
                    </div>
                  </div>

                </el-col>
              </el-row>
            </div>
          </template>
          <template v-else>
            <div class="noInfo">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiaoxitixing"></use>
              </svg>
              <p>暂无未读消息</p>
            </div>
          </template>

          <el-pagination style="float:right;margin-top:40px;" @size-change="handleSizeChange"
                         @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50]"
                         :page-size="pageSize" class='pagination' layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="功能上新" name="function">
          <wait-product></wait-product>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default{
    data() {
      return {
        activeName: 'systemMessage',
        total: 0,
        pageNumber: 1,
        pageSize: 10,
        sysMessage: [],
        loading: false
      }
    },
    methods: {
      queryMessage() {
        let data = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        }
        this.loading = true;
        axios.post('/notice/notice/queryMessage', data).then(res => {
          this.total = res.data.amount;
          let msgList = res.data.beanList;
          let msg = [];
          if (msgList.length) {
            for (var i = 0; i < msgList.length; i++) {
              let time = msgList[i].sysMessage.createTime;
              let moduleId = msgList[i].sysMessage.moduleId;
              let moduleName = this.$store.state.enumSet.moduleName[moduleId];
              let status = msgList[i].sysMessage.status;
              let msgTitle = '';
              let icon = '';
              let link = '';
              let path = '';
              let query = '';
              if (status === 0) {
                switch (moduleId) {
                  case 130401:
                    msgTitle = '失效';
                    icon = 'el-icon-warning waring'
                    link = '重新授权'
                    break;
                  case 110101:
                    msgTitle = '失败';
                    icon = 'el-icon-circle-cross iconError';
                    link = '重新同步';
                    path = '/production';
                    query = '0'
                    break;
                  default:
                    msgTitle = '失败';
                    icon = 'el-icon-circle-cross iconError'
                }
              } else {
//                  供应商接受邀请
                if (moduleId === 130102) {
                  icon = 'el-icon-circle-check iconSuccess';
                  link = '查看详情';
                  path = '/supplierList';
                  query = '1'
//                  邀请供应商
                } else if (moduleId === 130101) {
                  icon = 'el-icon-information information';
                  link = '查看详情';
                  path = '/supplierList';
                  query = '1'
//                  邀请渠道商
                } else if (moduleId === 130103) {
                  icon = 'el-icon-information information';
                  link = '查看详情';
                  path = '/myChannel';
                  query = '1';
//                  渠道商接受邀请
                } else if (moduleId === 130104) {
                  icon = 'el-icon-circle-check iconSuccess';
                  link = '查看详情➔';
                  path = '/myChannel';
                  query = '1';
//                  欠费提醒
                } else if (moduleId === 100101) {
                  icon = 'el-icon-warning waring';
                  link = '联系客服';
                } else {
                  msgTitle = '成功';
                  icon = 'el-icon-circle-check iconSuccess'
                  switch (moduleId) {
//                      导入订单
                    case 150100:
                      link = '查看待审核订单';
                      path = '/order';
                      query = '7'
                      break;
//                      订单导出
                    case 150101:
                      link = '去下载';
                      path = '/taskcenter'
                      query = 'orderExport'
                      break;
//                      发货单导入
                    case 150102:
                      link = '查看已发货订单';
                      path = '/order';
                      query = '3';
                      break;
//                      同步商品
                    case 110101:
                      link = '去关联';
                      path = '/production'
                      query = '2'
                      break;
//                      商品导出
                    case 110103:
                      link = '去下载>';
                      path = '/taskcenter';
                      query = 'prodExport';
                      break;
//                      导出账单
                    case 160101:
                      link = '去下载>';
                      path = '/taskcenter';
                      query = 'accountExport'
                      break;
                  }
                }
              }
              let msgDetails = msgList[i].sysMessageDetails;
              let content = '';
              for (var j = 0; j < msgDetails.length; j++) {
                content += msgDetails[j].content;
              }
              msg.push({
                moduleName: moduleName,
                content: content,
                time: time,
                msgTitle: msgTitle,
                status: status,
                icon: icon,
                link: link,
                path: path,
                query: query
              })
            }
          }
          this.sysMessage = msg;
          this.loading = true;
        }).catch(err => {
          this.loading = true;
          this.$message.error({
            message: err.response ? err.response.data : err
          });
        })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.queryMessage();
      },
      handleCurrentChange(val) {
        this.pageNumber = val;
        this.queryMessage();
      },
    },
    mounted() {
      this.queryMessage();
    }
  }
</script>

<style lang="less" scoped>
  @import '../../main.less';

  .infoCenter {
    color: @lightBlack;
    padding: @normalSize;
    .noInfo {
      padding: 150px;
      color: @darkGary;
      text-align: center;
      .icon{
        font-size:50px;
      }
    }

  .info {
    border: 1px solid @gary;
    padding: 10px 0 10px 20px;

  &:not(:nth-child(1)) {
    border-top: 0;
  }

  }
  .AllIcon {
    padding-right: 10px;
    text-align: center;

  i {
    font-size: 18px;
    vertical-align: middle;
  }

  .iconSuccess {
    color: @successGreen;
  }

  .iconError {
    color: @dangerRed;
  }

  .warning {
    color: @warning;
  }

  .information {
    color: @primaryBlue;
  }

  }
  .name {
    font-size: @fontSize14;
    padding-right: 10px;
  }

  .success {
    font-size: @baseFont;
    padding: 10px 0 5px 0;
    color: @success;
  }

  .error {
    font-size: @baseFont;
    padding: 10px 0 5px 0;
    color: @dangerRed;
  }

  .content {
    display: inline-block;
    font-size: @baseFont;;
    padding: 5px 0;
  }

  .date {
    color: @lightBlack;
    font-size: @baseFont;
  }

  .link {
    font-size: @baseFont;
    padding-left: 10px;
    cursor: pointer;
    color: @btnhoverBg;
  }

  }
</style>
