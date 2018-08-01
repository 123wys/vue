<template>
  <div class="GroupItem">
    <div class='group-name'>
      <slot></slot>{{group.customerSpec.specName}}
    </div>
    <div class='customer-count' @click='goList(group.customerSpec.specId)'>{{group.customerNum.toLocaleString()}}</div>
    <div class='group-rule'>
      <div v-if='group.groupRules.length'>
        <span v-for='item in group.groupRules'>
          <template v-if = 'item.ruleType !== 1'>
            {{mapGroupName(item.ruleType)}}：{{item.lowerBound}}&nbsp~&nbsp{{item.upperBound}};
          </template>
          <template v-else>
            {{mapGroupName(item.ruleType)}}：{{item.lowerBound}}&nbsp月内;
          </template>
        </span>
      </div>
      <div v-else>空</div>
    </div>
    <div class='action'>
      <slot name="edit"></slot>
      <slot name="delete"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GroupItem',
  data() {
    return {
      select: false,
      ruleMap: {
        1: '最近购买',
        2: '购买次数',
        3: '消费金额'
      },
    }
  },
  props: ['group'],
  components: {},
  mounted() {},
  activated() {},
  computed: {},
  methods: {
    //  返回客户列表
    goList(specId) {
      this.$router.push({
        path: '/customer',
        query: {
          group: specId
        }
      })
    },
    mapGroupName(type) {
      return this.ruleMap[type]
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.GroupItem {
  border: 1px solid @borderLine;
  border-bottom: none;
  display: flex;
  font-size: 12px;
  padding: @normalSize;
  line-height: 22px;
  transition: background-color 0.3s;
  .group-name {
    text-align: left;
    flex-basis: 24%;
  }
  .customer-count {
    box-sizing: border-box;
    padding-right: 80px;
    text-align: right;
    flex-basis: 13%;
    color: @primaryBlue;
    cursor: pointer;
  }
  .group-rule {
    flex-basis: 40%;
  }
  .action {
    text-align: right;
    flex-basis: 23%;
  }
}

.GroupItem:hover {
  background-color: #eef0f6;
}
</style>
<style lang="less">
@import '../../main.less';
</style>
