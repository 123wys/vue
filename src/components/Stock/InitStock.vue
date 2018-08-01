<template>
  <div class="init-stock">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>批量入库</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="body">
      <div class="title">批量入库</div>
      <el-card class="message">
        <p>系统已自动为您建立好一个商家虚拟仓库。若您有多个仓库，请先去 <span class="blue" @click="goWarehouse">我的仓库</span> 新建仓库。</p>
        <p>请先 <span class="blue" @click="exportProd">下载商品列表</span> 文件，在文件补充录入各个商品sku的<span class="yellow">可售数、次品数</span>，完成后点击 <span class="blue">导入库存数据</span> 即可</p>
        <div class="muted">请确保输入正确且不小于0的数字，不输或其他字符默认为0，可售数、次品数都为0不会被入库。</div>
        <div class="button">
          <el-button type="primary" size="small" @click="exportProd"><i class="iconfont icon-xiazai"></i>下载商品列表</el-button>
          <el-button type="primary" size="small" @click="dialogShow=true"><i class="iconfont icon-daoru2"></i>导入库存数据</el-button>
        </div>
      </el-card>
    </div>
    <el-dialog v-model="dialogShow" size="tiny" title="导入库存数据">
      <el-form :model='formData' :rules="rules" ref="form" label-width="80px">
        <el-form-item label="入库仓库" prop="wmsId">
          <el-select class="w200" v-model="formData.wmsId" size="small" clearable>
            <el-option v-for="(label,key) in repositoryEnum" :label="label" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件" prop="file">
          <input type="file" style="display:none" ref="fileinput" @change="fileChange" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
          <div v-if="formData.file" class="selected-file">已选：
            <span class="filename" :title="formData.file" @click="openUpload">{{formData.file}}</span>
          </div>
          <el-button v-else type="text" @click="openUpload">选择Excel文件...</el-button>
        </el-form-item>
      </el-form>
      <el-progress v-if="showProgress" :percentage="percentage"></el-progress>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogCancel">取 消</el-button>
        <el-button size="small" type="primary" @click="dialogSure">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
const exportProdUrl = '/product/prodoffering/exportProd';
const inStockBatchUrl = '/upload/inStockBatch';
export default {
  name: 'init-stock',
  components: {},
  data() {
    return {
      dialogShow: false,
      formData: {
        wmsId: '',
        file: '',
      },
      uploadFile: '',
      showProgress: false,
      percentage: 0,
      rules: {
        wmsId: {
          required: true,
          message: '请选择仓库',
          trigger: 'change',
        },
        file: {
          required: true,
          message: '请选择文件',
        }
      },
    }
  },
  computed: {
    repositoryEnum() {
      return this.$store.state.enumSet.repositoryEnum;
    },
  },
  activated() {},
  methods: {
    exportProd() {
      axios.post(exportProdUrl, {
        uploadFile: '商品列表' + Date.now(),
        pageSize: 2147483647,
      }).then(() => {
        this.$confirm('导出作业已启动，稍后可在任务中心下载！', '提示', {
          cancelButtonText: '稍后再说',
          confirmButtonText: '现在前往',
          type: 'success',
        }).then(() => {
          this.$router.push('/taskcenter')
        });
        this.$store.commit('addTask', 'prodExport');
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    goWarehouse() {
      this.$router.push('/warehouse');
    },
    openUpload() {
      this.$refs.fileinput.click();
    },
    fileChange(event) {
      this.formData.file = event.target.value;
      this.uploadFile = event.target.files[0];
      this.$refs.form.validateField('file', valid => {
        if (!valid) return false;
      })
    },
    dialogSure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.showProgress = true;
          let fd = new window.FormData();
          fd.append('file', this.uploadFile);
          fd.append('wmsId', this.formData.wmsId);
          axios({
            method: 'post',
            url: inStockBatchUrl,
            data: fd,
            onUploadProgress: e => {
              this.percentage = Math.floor(e.loaded / e.total * 100)
            }
          }).then(response => {
            this.percentage = 0;
            this.showProgress = false;
            this.dialogCancel();
            this.$message.success('批量入库成功！');
          }).catch(err => {
            this.percentage = 0;
            this.showProgress = false;
            this.$msgbox({
              message: (err.response ? err.response.data : err),
              type: 'error',
            })
          });
        } else {
          return false;
        }
      })
    },
    dialogCancel() {
      this.resetForm();
      this.dialogShow = false;
    },
    resetForm() {
      this.$refs.form.resetFields();
      this.$refs.fileinput.value = '';
      this.uploadFile = '';
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.init-stock {
  padding: @baseSpace*3;
  color: @black;
  font-size: 14px;
  .body {
    margin: 30px 0 0 25px;
  }
  .title {
    letter-spacing: 3px;
    font-size: 30px;
    margin-bottom: @baseSpace*4;
  }
  .message {
    width: 80%;
    padding-left: @baseSpace*4;
    .blue {
      text-decoration: underline;
      cursor: pointer;
      user-select: none;
    }
  }
  .selected-file {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .filename {
      color: @blue;
      cursor: pointer;
      user-select: none;
    }
  }
  .iconfont {
    font-size: 24px;
    margin-right: @baseSpace;
    vertical-align: middle;
  }
  .button {
    padding: 30px 0 0 10px;
  }
  .el-button+.el-button {
    margin-left: @baseSpace*4;
  }
}
</style>
<style lang="less">
@import '../../main.less';
.init-stock .el-form-item.is-required .el-form-item__label:before {
  display: none;
}
</style>
