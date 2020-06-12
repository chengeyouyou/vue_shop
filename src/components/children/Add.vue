<template>
  <div>
    <BreadCrumb :levels="['首页','商品管理','添加商品']" />
    <el-card shadow="hover">
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-form label-position="top" ref="addFormRef" :model="addForm" :rules="addFormRule">
        <el-steps :active="+activeIndex" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="tabBeforeLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="showProps"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyParamsList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.checked">
                <el-checkbox
                  :label="attr"
                  v-for="(attr,index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item) in onlyParamsList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="postImgUrl"
              :on-preview="imgPreview"
              :on-remove="imgRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quillEditor :options="editorOption" v-model="addForm.goods_introduce"></quillEditor>
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible.sync="isShowImgDialog" width="50%">
      <img :src="imgUrl" alt style="width:100%" />
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "./BreadCrumb";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import { deep } from "common/utils.js";

export default {
  components: {
    BreadCrumb,
    quillEditor
  },
  data() {
    return {
      activeIndex: "0",
      cateList: [],
      checked: [],
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      editorOption: {
        placeholder: "请输入商品简介"
      },
      addFormRule: {
        goods_name: [
          { required: true, message: "请填写商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请填写商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请填写商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请填写商品数量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请填写商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请填写商品数量", trigger: "blur" }
        ]
      },
      showProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      manyParamsList: [],
      onlyParamsList: [],
      postImgUrl: "https://www.liulongbin.top:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("TOKEN")
      },
      isShowImgDialog: false,
      imgUrl: ""
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat.length == 3
        ? this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
        : 0;
    }
  },
  methods: {
    async getCateList() {
      const res = await this.rquest_getCateList();
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      this.cateList = res.data;
    },
    tabBeforeLeave(activeName, oldActiveName) {
      if (oldActiveName == 0 && this.addForm.goods_cat.length != 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
      return true;
    },
    async tabClick(tab) {
      console.log(tab.index);
      if (this.addForm.goods_cat.length != 3) return;
      if (tab.index == 1) {
        const res = await this.rquest_getParamList({
          cat_id: this.cateId,
          type: "many"
        });
        console.log(res);
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg);
        }

        this.manyParamsList = res.data;

        this.$set;
        this.manyParamsList.forEach(el => {
          el.attr_vals = el.attr_vals.length != 0 ? el.attr_vals.split(",") : [];
          this.$set(el, "checked", [...el.attr_vals]);
        });
      }

      if (tab.index == 2) {
        const res = await this.rquest_getParamList({
          cat_id: this.cateId,
          type: "only"
        });
        console.log(res);
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg);
        }
        this.onlyParamsList = res.data;
      }
    },
    imgPreview(file) {
      this.imgUrl = file.response.data.url;
      this.$nextTick(() => {
        this.isShowImgDialog = true;
      });
    },
    imgRemove(file) {
      //  console.log(file.response.data.tmp_path);
      const index = this.addForm.pics.findIndex(
        item => item.pic == file.response.data.tmp_path
      );
      this.addForm.pics.splice(index, 1);
    },
    uploadSuccess(response, file) {
      //console.log(response.data.tmp_path);
      this.addForm.pics.push({
        pic: response.data.tmp_path
      });
    },
    add() {
      this.$refs.addFormRef.validate(async res => {
        if (res) {
          const form = deep(this.addForm);
          form.goods_cat = form.goods_cat.join(",");
          this.manyParamsList.forEach(el => {
            form.attrs.push({
              attr_id: el.attr_id,
              attr_value: el.checked.join(",")
            });
          });
          this.onlyParamsList.forEach(el => {
            form.attrs.push({
              attr_id: el.attr_id,
              attr_value: el.attr_vals
            });
          });
          console.log(form);
          const result = await this.rquest_addGoods(form);
          if (result.meta.status != 201) {
            return this.$message.error(result.meta.msg);
          }
          this.$message.success(result.meta.msg);
          this.activeIndex += 2;
        } else {
          this.$message.error("请填写必填信息");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 20px 0;
}
.el-checkbox {
  margin: 0;
  margin-left: 10px;
}
.el-button {
  margin-top: 10px;
}
</style>