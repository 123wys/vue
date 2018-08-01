<template>
  <div class="orderAdd">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{ path: '/order' }">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单导入</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="title">导入的订单默认都要发货，已发货的订单请勿导入</h1>
    <input type="file" class="none" id="upload" @change="fileChange" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
    <el-form ref="form" label-width="80px">
      <el-form-item label="导入文件">
        <div>
          <el-button type="primary" size="small" @click="openUpload">+选择文件</el-button>
          <div v-if="file" class="file-msg">已选择：<i class="icon iconfont icon-xlxs01-copy file-icon"></i><span v-text="file.name"></span><span v-text="(file.size/1024).toFixed(2)" class="file-size"></span>KB
            <el-button type="danger" size="mini" icon="circle-close" style="margin-left:5px" @click="cancelSelect">取消选择</el-button>
          </div>
          <p class="tips" v-if="!file">支持xls和xlsx格式，文件数据不要超过1000条，默认为待审核订单<a href="https://frontfile.oss-cn-hangzhou.aliyuncs.com/template/%E5%B0%8F%E4%BA%9A%E9%80%9A%E9%80%9A%E7%94%A8%E6%A8%A1%E6%9D%BF.xlsx">通用模板下载</a><a href="https://frontfile.oss-cn-hangzhou.aliyuncs.com/template/%E7%B2%BE%E7%AE%80%E6%A8%A1%E6%9D%BF%E5%BE%AE%E5%95%86%E4%B8%93%E7%94%A8.xlsx">精简模板下载（微商专用）</a></p>
          <p class="excel-msg" v-if="file">共&nbsp<span v-text="persons.length" class="count"></span>&nbsp条待导入订单，为保障订单准确识别，请将文件表头与小亚通系统订单字段匹配对应</p>
        </div>
      </el-form-item>
      <template v-if="file">
        <el-table :data="tableData" style="width: 500px;margin:0px 0 5px 80px" :border="true" class="tabel">
          <el-table-column prop="columnTitle" label="小亚通系统订单字段" width="250">
            <template scope="scope">
              <div>{{scope.row.columnTitle}}
                <span v-if="scope.row.columnMandatory" class="required">必填</span>
                <span v-if="scope.row.columnTitle === '条形码'" class="noRequired">(商品唯一标志)</span>
                <span v-else class="noRequired">非必填</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="导入表头">
            <template scope="scope">
              <el-select v-model="excelMap[scope.row.columnCode]" placeholder="请选择" clearable>
                <el-option v-for="item in excelHeader" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin:0 0 15px 90px">非必填字段若不选择表头，系统将自动生成参数</div>
      </template>
      <el-form-item label="选择模板">
        <div>
          <el-radio-group v-model="templateId">
            <el-radio v-for="item in templateList" :label="item.templateBean.templateId">{{item.templateBean.templateName}}</el-radio>
          </el-radio-group>
          <el-button type="text" style="margin-left:20px" @click="createTemp">+新增自定义模板</el-button>
          <template v-if="addTemplate">
            <br />
            <el-input v-model="templateName" placeholder="模板名称" style="width:200px" size="small"></el-input>
            <el-button type="primary" style="margin-left:20px" size="small" @click="mergeOrderImportTemplate(null, 1)">确定</el-button>
            <el-button style="margin-left:20px" size="small" @click="addTemplate = false">取消</el-button>
          </template>
        </div>
      </el-form-item>
      <el-form-item label="选择店铺">
        <div>
          <el-radio-group v-model="offLineId">
            <el-radio v-for="item in virtualShopList" :label="item.shopId">{{item.shopTitle}}</el-radio>
          </el-radio-group>
          <el-button type="text" style="margin-left:20px" @click="virtualShop = true">+新增虚拟店铺</el-button>
          <template v-if="virtualShop">
            <br />
            <el-input v-model="virtualShopName" placeholder="虚拟店铺名称" style="width:200px;border-color:red" size="small"></el-input>
            <el-button type="primary" style="margin-left:20px" size="small" @click="createVirtualShop()">确定</el-button>
            <el-button style="margin-left:20px" size="small" @click="virtualShop = false">取消</el-button>
          </template>
        </div>
      </el-form-item>
    </el-form>
    <p style="margin-left: 80px">
      <el-button @click="filePreview" size="small" type="primary">提交</el-button>
      <el-button size="small" @click="goback">返回</el-button>
      <el-button size="small" type="success" @click="goTask">查看导入结果</el-button>
    </p>
    <el-dialog v-model="dialogVisible" size="small">
      <span slot="title" class="Novice">确认提交？</span>
      <OrderImportPreview :shopId="offLineId" :previewData="previewData" :count="persons.length" key="preview" v-if="dialogVisible"></OrderImportPreview>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="upload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import OrderImportPreview from './OrderImportPreview'
export default {
  name: 'orderAdd',
  props: {
    text: {
      default: '敬请期待'
    }
  },
  components: {
    OrderImportPreview
  },
  data() {
    return {
      virtualShop: false,
      virtualShopName: '',
      previewData: {},
      addTemplate: false,
      dialogVisible: false,
      virtualShopList: [],
      uploadEl: '',
      file: '',
      //  离线店铺ID
      offLineId: '',
      templateId: '',
      templateName: '',
      percentage: 0,
      //  数据格式为键值对数组
      persons: [],
      //  数据格式跟node解析excel一样二维数组，第一行为表头
      keys: [],
      //  传入excel表头
      excelHeader: [],
      excelHeader2: [],
      excelMap: {},
      //  租户模板
      templateList: [],
      //  小亚通模板规范
      tableData: []
    }
  },
  mounted() {
    this.queryDefaultTemplate();
  },
  computed: {},
  activated() {
    if (typeof FileReader === 'undefined') {
      this.$message({
        message: '您的浏览器不支持FileReader接口请更新',
        type: 'warning'
      });
      console.log('您的浏览器不支持FileReader接口请更新');
    }
    this.queryTemplate();
    this.queryVirtualShop();
    this.uploadEl = this.$el.querySelector('#upload');
  },
  watch: {
    'templateId': function(val, oldval) {
      if (val) {
        this.addTemplate = false;
      }
      if (oldval) {
        Object.keys(this.excelMap).forEach((key) => {
          this.excelMap[key] = ''
        })
      }
      this.templateList.forEach((el) => {
        if (el.templateBean.templateId === val) {
          el.formatBeans.forEach((subel) => {
            this.excelMap[subel.columnCode] = subel.columnTitle;
          })
        }
        return false;
      })
    }
  },
  methods: {
    goTask() {
      this.$router.push({
        path: '/taskcenter',
        query: {
          type: 'orderAdd'
        }
      })
    },
    cancelSelect() {
      this.uploadEl.value = '';
      this.file = '';
    },
    createTemp() {
      if (this.templateId) {
        Object.keys(this.excelMap).forEach((key) => {
          this.excelMap[key] = ''
        })
      }
      this.templateId = '';
      this.addTemplate = true;
    },
    goback() {
      this.$router.go(-1);
    },
    //  新增虚拟店铺
    createVirtualShop() {
      let query = {
        shopTitle: this.virtualShopName
      };
      this.axios.post('/customer/shopInfo/createVirtualShop', query).then(res => {
        this.$message.success('添加成功');
        this.virtualShop = false;
        this.offLineId = res.data;
        this.queryVirtualShop();
      }).catch((err) => {
        this.$msgbox({
          title: '提示',
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    //  新增或者更新模板 type = 1新增 2更新
    mergeOrderImportTemplate(callback, type) {
      if (!this.file) {
        this.$message.warning('提示，新增模板需要参考导入文件，请先点击上面“+选择文件”');
        return false;
      };
      var data = {
        fileTemplate: {
          formatBeans: [],
          templateBean: {}
        }
      };
      //  检测模板数据是否符合要求
      //  新增模板检测数据是否符合要求excelMap存储键值对
      if (type === 1) {
        if (!this.templateName) {
          this.$message({
            message: '模板名称不能为空！',
            type: 'warning'
          });
          return false;
        }
        data.fileTemplate.templateBean.templateName = this.templateName;
        var isOk = this.checkTemplate(this.excelMap, this.templateList);
        if (!isOk.check) {
          if (isOk.type === 1) {
            this.$message({
              message: '导入表头缺少必填字段！',
              type: 'warning'
            });
            return false;
          } else {
            this.$message({
              message: '导入表头与导入的excel表不匹配',
              type: 'warning'
            });
            return false;
          }
        }
      } else {
        data.fileTemplate.templateBean.templateId = this.templateId;
        this.templateList.forEach((el) => {
          if (el.templateBean.templateId === this.templateId) {
            data.fileTemplate.templateBean.templateName = el.templateBean.templateName;
          }
        })
      }
      for (let [key, value] of Object.entries(this.excelMap)) {
        if (value) {
          var item = {
            columnCode: key,
            columnTitle: value
          }
          data.fileTemplate.formatBeans.push(item);
        }
      }
      this.axios.post('/order/order/mergeOrderImportTemplate', data).then(res => {
        if (callback) {
          callback();
        }
        this.templateName = '';
        // this.templateId = '';
        this.templateId = res.data;
        this.addTemplate = false;
        this.queryTemplate();
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取添加模板失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    //  查询虚拟店铺 + 正常店铺
    queryVirtualShop() {
      this.axios.post('/customer/shopInfo/queryShop', {
        platformId: 'OFFLINE'
      }).then(res => {
        this.virtualShopList = res.data;
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取虚拟店铺数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    //  查询租户模板
    queryTemplate() {
      this.axios.post('/order/order/getOrderImportTemplateList', {
        tenantId: null
      }).then(res => {
        this.templateList = res.data;
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取默认模板失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    //  查询小亚通默认模板
    queryDefaultTemplate() {
      this.axios.post('/order/order/getOrderImportTemplateList', {
        tenantId: 0
      }).then(res => {
        this.tableData = res.data[0].formatBeans;
        this.tableData.forEach((el) => {
          this.$set(this.excelMap, el.columnCode, '')
        })
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取默认模板失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    //  查看模板是否改变
    //  只有当模板需要更新的时候返回true否则都返回false
    checkTemplateChange() {
      var check = false;
      this.templateList.forEach((el) => {
        if (el.templateBean.templateId === this.templateId) {
          var count = 0;
          Object.values(this.excelMap).forEach((value) => {
            if (value) {
              count += 1;
            }
          })
          if (el.formatBeans.length !== count) {
            check = true;
          } else {
            el.formatBeans.forEach((subel) => {
              if (subel.columnTitle !== this.excelMap[subel.columnCode]) {
                check = true;
              }
            })
          }
        }
      })
      return check;
    },
    //  检测映射是否有重复字段 重复返回ture 不重复返回false
    checkRepeat() {
      var arr1 = Object.values(this.excelMap);
      var arr2 = [...new Set(arr1)];
      if (arr1.length !== arr2.length) {
        return true;
      } else {
        return false;
      }
    },
    //  检查模板中的字段是否与传入的excel表格对应以及必填字段都有值
    checkTemplate(excelMap, templateList) {
      var check = true;
      //  1表示导入表头有空字段 2表示导入的表头与导入的表不符
      var type = 0;
      //  如果小亚通默认模板中必填字段映射为空则模板不符合条件
      Object.keys(excelMap).forEach((key) => {
        this.tableData.forEach((el) => {
          if (excelMap[key]) {
            if (!this.excelHeader2.includes(excelMap[key])) {
              check = false;
              type = 2;
            }
          }
          if (el.columnCode === key) {
            if (el.columnMandatory === 1) {
              if (!excelMap[key]) {
                check = false;
                type = 1;
              }
            }
          }
        })
      })
      return {
        check,
        type
      }
    },
    //  点击提交最终按钮
    upload() {
      var isChange = this.checkTemplateChange();
      if (isChange) {
        this.$confirm('您输入的模板有更新，点击确定修改模板并导入订单！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.mergeOrderImportTemplate(this.fileUpload, 2);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消上传'
          });
        });
      } else {
        this.fileUpload();
      }
    },
    //  文件上传
    fileUpload() {
      let fd = new window.FormData();
      let queryCondition = {
        shopId: this.offLineId,
        fileTemplateId: this.templateId
      };
      fd.append('file', this.file);
      fd.append('queryCondition', JSON.stringify(queryCondition));
      this.axios({
        method: 'post',
        url: '/upload/importOutOrder',
        data: fd,
        onUploadProgress: e => {
          this.percentage = Math.floor(e.loaded / e.total * 100)
        }
      }).then(response => {
        this.uploadEl.value = '';
        this.file = '';
        this.dialogVisible = false;
        this.shopId = '';
        this.templateId = '';
        Object.keys(this.excelMap).forEach((key) => {
          this.excelMap[key] = ''
        })
        this.$confirm('上传成功，稍后可在任务中心查看处理情况！', '提示', {
          cancelButtonText: '稍后再说',
          confirmButtonText: '现在前往',
          type: 'success',
        }).then(() => {
          this.$router.push({
            path: '/taskcenter',
            query: {
              type: 'orderAdd'
            }
          })
        });
      }).catch(err => {
        this.$msgbox({
          message: (err.response ? err.response.data : err),
          type: 'error',
        })
      });
    },
    //  预览数据
    getPreviewData() {
      // 生成第一条数据
      var realData = this.persons[0];
      for (let [key, value] of Object.entries(this.excelMap)) {
        this.previewData[key] = realData[value];
      }
    },
    //  文件上传预览
    filePreview() {
      if (!this.persons.length) {
        this.$message({
          message: '选择excel文件内容为空！',
          type: 'warning'
        });
        return false;
      };
      if (!this.offLineId || !this.templateId) {
        this.$message({
          message: '选择模板或者虚拟店铺不能为空！',
          type: 'warning'
        });
        return false;
      }
      var isOk = this.checkTemplate(this.excelMap, this.templateList);
      if (!isOk.check) {
        if (isOk.type === 1) {
          this.$message({
            message: '导入表头缺少必填字段！',
            type: 'warning'
          });
          return false;
        } else {
          this.$message({
            message: '导入表头与导入的excel表不匹配',
            type: 'warning'
          });
          return false;
        }
      }
      this.getPreviewData();
      this.dialogVisible = true;
    },
    //  选择上传文件
    openUpload() {
      this.uploadEl.click();
    },
    fileChange(e) {
      this.persons = [];
      this.keys = [];
      this.excelHeader = [];
      if (!e.target.files[0]) {
        this.file = '';
        return;
      };
      this.file = e.target.files[0];
      var fileReader = new window.FileReader();
      fileReader.onload = this.parsefile;
      fileReader.readAsBinaryString(this.file);
    },
    parsefile(ev) {
      try {
        var data = ev.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        }); // 以二进制流方式读取得到整份excel表格对象
        var persons = []; // 存储获取到的数据
      } catch (e) {
        this.$message({
          message: '文件类型不正确',
          type: 'warning'
        });
        return;
      }
      // 表格的表格范围，可用于判断表头是否数量是否正确
      var fromTo = '';
      // 遍历每张表读取
      for (var sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          fromTo = workbook.Sheets[sheet]['!ref'];
          console.log(fromTo);
          persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          this.keys = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
            header: 1
          });
          break; // 如果只取第一张表，就取消注释这行
        }
      }
      // console.log(this.keys)
      this.persons = persons;
      this.keys[0].forEach((el) => {
        this.excelHeader.push({
          value: el,
          label: el
        });
        this.excelHeader2.push(el);
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.none {
  display: none;
}

.required,
.noRequired {
  display: inline-block;
  transform: scale(0.9);
  margin-left: 5px;
  font-size: 12px;
}

.required {
  color: @dangerRed;
}

.noRequired {
  color: @lightGary;
}

.orderAdd {
  color: @lightBlack;
  padding: @normalSize;
  .title {
    font-size: 18px;
    font-weight: normal;
    color: @baseGary;
  }
  .subTitle {
    margin: 5px 0 30px 0;
    font-size: 14px;
    color: @lightGary;
    span {
      color: @baseGary;
    }
  }
  img {
    width: 100px;
    height: 100px;
  }
  .file-msg {
    line-height: 20px;
  }
  .tips {
    height: 20px;
    margin: 0;
    line-height: 20px;
    color: @lightGary;
    a {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .file-icon {
    color: @primaryBlue;
  }
  .file-size {
    margin-left: 20px;
  }
  .count {
    color: @warningYellow;
    font-weight: bold;
  }
  .excel-msg {
    margin: 0;
  }
}

.el-radio {
  margin: 5px 15px 0 0;
}
</style>
<style>
.orderAdd .tabel .el-input__inner {
  border: none;
}

.orderAdd .el-dialog--small {
  width: 700px;
}
</style>
