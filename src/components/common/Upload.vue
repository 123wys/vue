<template>
  <div>
    <input type="file" class="none" id="upload" @change="fileChange" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
    <el-dialog :title="dialogTitle" v-model="showDialog" size="tiny" custom-class="uploaddialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div v-if="!showProgress">
        <slot name="content-top"></slot>
        <el-button type="text" @click="openUpload">选择Excel文件...</el-button>
        <div v-if="file">已选择：<span v-text="file.name"></span></br>
          大小：<span v-text="(file.size/1024).toFixed(2)"></span>KB</div>
        <slot name="content-bottom"></slot>
      </div>
      <el-progress v-if="showProgress" :percentage="percentage"></el-progress>
      <span slot="footer" v-if="!showProgress">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="fileUpload">上 传</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
// const typeLimit = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
export default {
  name: 'upload',
  props: {
    url: {
      required: true,
    },
    value: {
      required: true,
      default: false,
    },
    title: {
      default: '',
    },
  },
  data() {
    return {
      uploadEl: '',
      showProgress: false,
      percentage: 0,
      file: '',
    }
  },
  computed: {
    dialogTitle() {
      let msg = this.showProgress ? '上传中，请勿关闭页面' : '上传文件';
      return (this.title + msg);
    },
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val)
          // this.$emit('change', val)
      }
    },
  },
  methods: {
    fileChange(e) {
      if (!e.target.files[0]) {
        this.file = '';
        return;
      };
      // let type = e.target.files[0].type;
      // if (typeLimit.includes(type)) {
      this.file = e.target.files[0];
      // } else {
      //   console.error(type, '文件类型有误！')
      //   this.$message.error('选择文件类型有误，请重新选择');
      // }
    },
    fileUpload() {
      if (!this.file) {
        this.$message.error('请选择文件');
        return;
      }
      this.showProgress = true;
      let fd = new window.FormData();
      fd.append('file', this.file);
      axios({
        method: 'post',
        url: this.url,
        data: fd,
        onUploadProgress: e => {
          this.percentage = Math.floor(e.loaded / e.total * 100)
        }
      }).then(response => {
        this.percentage = 0;
        this.showProgress = false;
        this.showDialog = false;
        this.uploadEl.value = '';
        this.file = '';
        this.$emit('callback');
      }).catch(err => {
        this.percentage = 0;
        this.showProgress = false;
        this.showDialog = false;
        this.uploadEl.value = '';
        this.file = '';
        this.$msgbox({
          message: (err.response ? err.response.data : err),
          type: 'error',
        })
      });
    },
    openUpload() {
      this.uploadEl.click();
    },
    cancel() {
      this.showDialog = false;
      this.uploadEl.value = '';
      this.file = '';
    }
  },
  mounted() {
    this.uploadEl = this.$el.querySelector('#upload');
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.none {
  display: none;
}
</style>
<style>
/*.el-message-box {
  width: 600px;
}*/

.el-message-box__message p {
  word-break: break-all!important;
}
</style>
