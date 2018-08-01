<template>
  <div class="content">
    <el-tooltip class="item" effect="dark" :content="ichannel.tenantInfo.enterpriseTitle" placement="top-start">
      <p class="channel-title">{{ichannel.tenantInfo.enterpriseTitle}}</p>
    </el-tooltip>
    <div class="channel-type">
      <span class='channel-common channel-mark' v-if='ichannel.tenantInfo.tenantType == 0'>渠道商</span>
      <span class='channel-common channel-mark' v-if='ichannel.tenantInfo.tenantType == 1'>供应商</span>
      <span class='channel-common channel-mark' v-if='ichannel.tenantInfo.tenantType == 2'>渠道商、供应商</span>
      <!-- <template v-if='!ichannel.authentication'>
        <el-popover ref="popover" placement="bottom-start" title="" width="200" trigger="hover" content="您还未认证，认证后享受更多功能">
        </el-popover>
        <span class='channel-common channel-certf no-certf' v-popover:popover>未认证</span>
      </template>
      <template v-if='ichannel.authentication'>
        <template v-if='ichannel.tenantInfo.authType == 1'>
          <el-popover v-if='!ichannel.authentication.auditStatus' ref="popover" placement="bottom-start" title="" width="200" trigger="hover" content="未处理">
          </el-popover>
          <el-popover v-if='ichannel.authentication.auditStatus == 1' ref="popover" placement="bottom-start" title="" width="200" trigger="hover" content="资料已提交，正在进行人工审核">
          </el-popover>
          <el-popover v-if='ichannel.authentication.auditStatus == 2' ref="popover" placement="bottom-start" title="" width="200" trigger="hover" content="已通过实名认证">
          </el-popover>
          <el-popover v-if='ichannel.authentication.auditStatus == 3' ref="popover" placement="bottom-start" title="" width="200" trigger="hover" content="个人认证失败">
          </el-popover>
          <span class='channel-common channel-certf doing-certf' v-if='!ichannel.authentication.auditStatus' v-popover:popover>个人认证未处理</span>
          <span class='channel-common channel-certf doing-certf' v-if='ichannel.authentication.auditStatus == 1' v-popover:popover>个人认证审核中</span>
          <span class='channel-common channel-certf done-certf' v-if='ichannel.authentication.auditStatus == 2' v-popover:popover>实名认证</span>
          <span class='channel-common channel-certf fail-certf' v-if='ichannel.authentication.auditStatus == 3' v-popover:popover>个人认证失败</span>
        </template>
        <template v-if='ichannel.tenantInfo.authType == 2'>
          <el-popover v-if='!ichannel.authentication.auditStatus' ref="popover" placement="bottom-start" title="" width="200" trigger="hover" content="未处理">
          </el-popover>
          <el-popover v-if='ichannel.authentication.auditStatus == 1' ref="popover" placement="bottom-start" title="" width="200" trigger="hover" content="资料已提交，正在进行人工审核">
          </el-popover>
          <el-popover v-if='ichannel.authentication.auditStatus == 2' ref="popover" placement="bottom-start" title="" width="200" trigger="hover" content="已通过企业认证">
          </el-popover>
          <el-popover v-if='ichannel.authentication.auditStatus == 3' ref="popover" placement="bottom-start" title="" width="200" trigger="hover" content="企业认证失败">
          </el-popover>
          <span class='channel-common channel-certf doing-certf' v-if='!ichannel.authentication.auditStatus' v-popover:popover>企业认证未处理</span>
          <span class='channel-common channel-certf doing-certf' v-if='ichannel.authentication.auditStatus == 1' v-popover:popover>企业认证审核中</span>
          <span class='channel-common channel-certf done-certf' v-if='ichannel.authentication.auditStatus == 2' v-popover:popover>企业认证</span>
          <span class='channel-common channel-certf fail-certf' v-if='ichannel.authentication.auditStatus == 3' v-popover:popover>企业认证失败</span>
        </template>
      </template> -->
      <svg class="icon mar-left zuan" aria-hidden="true">
        <use xlink:href="#icon-zuan"></use>
      </svg>
      <img src="../../../assets/img/identifyV.png" class='mar-left' alt="大V">
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  props: ['ichannel'],
  data() {
    return {

    }
  },
  computed: {},
  methods: {},
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../../main.less';
.mar-left {
  margin-right: 10px;
}

.content {
  float: left;
  height: 86px;
  .channel-title {
    max-width: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 10px 0 0 0;
    font-size: 28px;
  }
  .channel-type {
    margin-top: 13px;
    height: 25px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .channel-common {
      padding: 0 15px 0 15px;
      display: inline-block;
      height: 25px;
      margin-right: 10px;
      line-height: 26px;
      vertical-align: center;
      color: #fff;
      text-align: center;
      border-radius: 15px;
    }
    .channel-mark {
      background: #666;
    }
    .channel-certf {
      min-width: 80px;
      cursor: pointer;
    }
    .no-certf {
      background: @darkGary;
    }
    .doing-certf {
      background: @blue;
    }
    .done-certf {
      background: @success;
    }
    .fail-certf {
      background: @danger;
    }
    .zuan {
      width: 13px;
      height: 13px;
    }
  }
}
</style>
