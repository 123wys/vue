<template>
  <div class="CreateGroup">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/groupRule' }">客户分组</el-breadcrumb-item>
      <el-breadcrumb-item v-if='!type'>新增分组</el-breadcrumb-item>
      <el-breadcrumb-item v-if='type'>编辑分组</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title">分组规则<span class="subTitle">请至少选择一个规则，不选默认为不限</span></div>
    <div class="select-option">
      <el-checkbox v-model='ruleType[1].isSelect'></el-checkbox>&nbsp<span class="option-name">累计购买次数</span>
      <el-input size='mini' class='Einput' v-model='ruleType[1].lowerBound' @keyup.native='clearNumMin(ruleType[1])'></el-input>-
      <el-input size='mini' class='Einput' v-model='ruleType[1].upperBound' @keyup.native='clearNumMax(ruleType[1])'></el-input>次
    </div>
    <div class="select-option">
      <el-checkbox v-model='ruleType[2].isSelect'></el-checkbox>&nbsp<span class="option-name">累计消费金额</span>
      <el-input size='mini' class='Einput' v-model='ruleType[2].lowerBound' @keyup.native='clearNoNumMin(ruleType[2])'></el-input>-
      <el-input size='mini' class='Einput' v-model='ruleType[2].upperBound' @keyup.native='clearNoNumMax(ruleType[2])'></el-input>元
    </div>
    <div class="select-option">
      <el-checkbox v-model='ruleType[0].isSelect'></el-checkbox>&nbsp<span class="option-name">最近消费时间</span>
      <el-input size='mini' class='Einput' v-model='ruleType[0].lowerBound' @keyup.native='clearNumMin(ruleType[0])'></el-input>
  <!--     -
      <el-input size='mini' class='Einput' v-model='ruleType[0].upperBound' @keyup.native='clearNumMax(ruleType[0])'></el-input> -->
      月内
    </div>
    <div class="errorText" v-show='error1'>请至少选择一个规则</div>
    <div class="title">分组名称
      <el-input size='mini' class='Einput-name' v-model="groupName"></el-input>
    </div>
    <div class="errorText" v-show='error2'>请输入名称</div>
    <div class="action">
      <el-button size='small' type='primary' @click='submit'>提交</el-button>
      <el-button size='small' @click='goBack'>取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CreateGroup',
  data() {
    return {
      error1: false,
      error2: false,
      //  0是新增分组 1是修改分组
      type: 0,
      //  更新数据
      specId: '',
      //  初始化设置
      groupName: '',
      //  ruleType[0] 最近消费 1累计购买次数 2累计购买金额
      ruleType: [{
        isSelect: false,
        ruleType: 1,
        lowerBound: '',
        upperBound: '',
        remark: ''
      }, {
        isSelect: false,
        ruleType: 2,
        lowerBound: '',
        upperBound: '',
        remark: ''
      }, {
        isSelect: false,
        ruleType: 3,
        lowerBound: '',
        upperBound: '',
        remark: ''
      }],
    }
  },
  props: ['group'],
  components: {},
  mounted() {},
  activated() {
    this.init();
    if (this.$route.query.type) {
      this.type = Number(this.$route.query.type);
    }
    if (Number(this.type) === 1) {
      // console.log('更新分组');
      var data = JSON.parse(window.sessionStorage.group);
      // console.log(data);
      this.groupName = data.customerSpec.specName;
      this.specId = data.customerSpec.specId;
      data.groupRules.forEach((el) => {
        if (el.ruleType === 1) {
          this.ruleType[0].isSelect = true;
          this.ruleType[0].lowerBound = el.lowerBound;
          this.ruleType[0].upperBound = el.upperBound;
        }
        if (el.ruleType === 2) {
          this.ruleType[1].isSelect = true;
          this.ruleType[1].lowerBound = el.lowerBound;
          this.ruleType[1].upperBound = el.upperBound;
        }
        if (el.ruleType === 3) {
          this.ruleType[2].isSelect = true;
          this.ruleType[2].lowerBound = el.lowerBound;
          this.ruleType[2].upperBound = el.upperBound;
        }
      });
    } else {
      this.init();
    }
  },
  computed: {},
  methods: {
    //  初始化
    init() {
      // console.log('新增分组')
      this.ruleType = [{
        isSelect: false,
        ruleType: 1,
        lowerBound: '',
        upperBound: '',
        remark: ''
      }, {
        isSelect: false,
        ruleType: 2,
        lowerBound: '',
        upperBound: '',
        remark: ''
      }, {
        isSelect: false,
        ruleType: 3,
        lowerBound: '',
        upperBound: '',
        remark: ''
      }];
      this.groupName = '';
      this.specId = '';
      // console.log('初始化完成')
    },
    clearNumMin(ruleType) {
      ruleType.lowerBound = ruleType.lowerBound.replace(/[^\d]/g, '')
    },
    clearNumMax(ruleType) {
      ruleType.upperBound = ruleType.upperBound.replace(/[^\d]/g, '')
    },
    clearNoNumMax(ruleType) {
      //  先把非数字的都替换掉，除了数字和.
      ruleType.upperBound = ruleType.upperBound.replace(/[^\d.]/g, '');
      //  必须保证第一个为数字而不是.
      ruleType.upperBound = ruleType.upperBound.replace(/^\./g, '');
      //  保证只有出现一个.而没有多个.
      ruleType.upperBound = ruleType.upperBound.replace(/\.{2,}/g, '.');
      //  保证.只出现一次，而不能出现两次以上
      ruleType.upperBound = ruleType.upperBound.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    },
    clearNoNumMin(ruleType) {
      //  先把非数字的都替换掉，除了数字和.
      ruleType.lowerBound = ruleType.lowerBound.replace(/[^\d.]/g, '');
      //  必须保证第一个为数字而不是.
      ruleType.lowerBound = ruleType.lowerBound.replace(/^\./g, '');
      //  保证只有出现一个.而没有多个.
      ruleType.lowerBound = ruleType.lowerBound.replace(/\.{2,}/g, '.');
      //  保证.只出现一次，而不能出现两次以上
      ruleType.lowerBound = ruleType.lowerBound.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    },
    goBack() {
      this.$router.go(-1);
    },
    submit() {
      var groupRules = this.ruleType.filter((el) => {
        if (el.upperBound && el.lowerBound) {
          if (Number(el.upperBound) < Number(el.lowerBound)) {
            var x = el.upperBound;
            el.upperBound = el.lowerBound;
            el.lowerBound = x;
          }
        }
        return el.isSelect
      })
      groupRules.forEach((el) => {
        if (el.lowerBound) {
          el.lowerBound = Number(el.lowerBound);
        };
        if (el.upperBound) {
          el.upperBound = Number(el.upperBound);
        };
      })
      var url = '';
      var data = '';
      //  0是新增分组 1是修改分组
      if (!groupRules.length) {
        this.error1 = true;
        return false;
      } else {
        this.error1 = false;
      }
      if (!this.groupName) {
        this.error2 = true;
        return false;
      } else {
        this.error2 = false;
      }
      if (Number(this.type) === 1) {
        url = '/customer/customer/updateCustomerGroup';
        data = {
          specId: this.specId,
          groupName: this.groupName,
          groupRules: groupRules,
          remark: ''
        }
      } else {
        url = '/customer/customer/createCustomerGroup';
        data = {
          groupName: this.groupName,
          groupRules: groupRules,
          remark: ''
        }
      }
      this.axios.post(url, data).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.$router.go(-1);
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.CreateGroup {
  color: @lightBlack;
  padding: @normalSize;
}

.title {
  margin-top: 10px;
}

.subTitle {
  margin-left: 20px;
  color: @lightGary;
}

.Einput {
  width: 90px;
  margin: 0 10px 0 10px;
}

.Einput-name {
  width: 200px;
  margin-left: 20px;
}

.select-option {
  padding-left: 70px;
  margin-top: 20px;
}

.action {
  margin-top: 20px;
  padding-left: 70px;
}

.errorText {
  margin-top: 10px;
  padding-left: 70px;
  color: @dangerRed;
}
</style>
<style lang="less">
@import '../../main.less';
</style>
