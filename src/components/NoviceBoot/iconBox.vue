<template>
  <div class="platform-box" @mouseenter='dialogShow = true' @mouseleave='dialogShow =false'>
    <slot></slot>
    <transition name="fades">
      <div v-show='dialogShow' class="upload-dialog">
        <div class="overlay"></div>
        <div class="content" v-if="type !== 'WEISHANG'">
          <p>
            <el-button type='primary' size='mini' @click='authshop(type)' style='width:60px'>授权</el-button>
          </p>
          <p><a :href='href' target='_blank' class='help'>如何授权？</a></p>
        </div>
        <div class="content" v-if="type === 'WEISHANG'">
          <p>
            <!-- <el-button type='primary' size='mini' style='width:60px' @click="virtualShop = true">添加店铺</el-button> -->
            <el-popover ref="popover5" placement="top" width="160" v-model="virtualShop">
              <p><el-input v-model="virtualShopName" size="mini" placeholder="店铺名称"></el-input></p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="virtualShop = false">取消</el-button>
                <el-button type="primary" size="mini" @click="createVirtualShop">确定</el-button>
              </div>
            </el-popover>
            <el-button v-popover:popover5>添加店铺</el-button>
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import axios from 'axios'
import {
  mapActions
} from 'vuex'

export default {
  name: 'iconBox',
  props: ['type', 'href'],
  data() {
    return {
      virtualShop: false,
      dialogShow: false,
      virtualShopName: ''
    }
  },
  computed: {},
  methods: {
    ...mapActions([
      'setShopEnum'
    ]),
    //  新增虚拟店铺
    createVirtualShop() {
      let query = {
        shopTitle: this.virtualShopName
      };
      this.axios.post('/customer/shopInfo/createVirtualShop', query).then(res => {
        this.virtualShop = false;
        this.$emit('createSuccess', this.virtualShopName);
        this.virtualShopName = '';
        this.$message.success('店铺添加成功');
        this.setShopEnum();
      }).catch((err) => {
        this.$msgbox({
          title: '提示',
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    //  店铺受权
    authshop(platform) {
      this.$emit('authStateChange', 1, platform)
      this.mark = platform;
      window.open(axios.defaults.baseURL + 'customer/shopInfo/getShopAuthUrl?platformId=' + platform);
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.platform-box {
  position: relative;
  width: 140px;
  height: 80px;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: @pageBg;
  cursor: pointer;
  overflow: hidden;
}

.upload-dialog {
  position: absolute;
  top: 0;
  left: 0;
  width: 140px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.7;
    z-index: 10;
  }
  .content {
    text-align: center;
    p {
      margin: 0;
      margin-top: 5px;
      color: #fff;
    }
    z-index: 11;
  }
}

a:link {
  font-size: 12px;
  text-decoration: none;
  color: #fff;
}

a:visited {
  color: #fff;
}

.fades-enter-active,
.fades-leave-active {
  transition: all .5s
}

.fades-enter,
.fades-leave-to {
  transform: translateY(120px);
  opacity: 0;
}
</style>
