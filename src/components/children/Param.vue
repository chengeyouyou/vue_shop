<template>
  <div>
    <BreadCrumb :levels="['首页', '商品管理', '商品参数']" class="BreadCrumb" />
    <el-card>
      <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" show-icon></el-alert>
      <el-row>
        <el-col :span="12">
          选择商品分类 :
          <el-cascader
            v-model="checkedKeys"
            :options="cateList"
            :props="showProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many" :disabled="isDisbaled">
          <el-row>
            <el-col :span="12">
              <el-button type="primary" :disabled="isDisbaled" @click="showAddDialog">添加参数</el-button>
            </el-col>
          </el-row>
          <el-table :data="manyParamsList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div>
                  <el-tag
                    v-for="(tag,index) in scope.row.attr_array"
                    :key="index"
                    closable
                    @close="closeTag(scope.row, index)"
                  >{{tag}}</el-tag>
                  <el-input
                    class="input"
                    v-if="scope.row.inputVisible"
                    size="small"
                    ref="saveTagInput"
                    v-model="scope.row.inputValue"
                    @blur="handleInputConfirm(scope.row)"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showEditDialog(scope.row.cat_id, scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteParams(scope.row.cat_id, scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only" :disabled="isDisbaled">
          <el-row>
            <el-col :span="12">
              <el-button type="primary" :disabled="isDisbaled" @click="showAddDialog">添加属性</el-button>
            </el-col>
          </el-row>
          <el-table :data="onlyParamsList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div>
                  <el-tag
                    v-for="(tag,index) in scope.row.attr_array"
                    :key="index"
                    closable
                    @close="closeTag(scope.row, index)"
                  >{{tag}}</el-tag>
                  <el-input
                    class="input"
                    v-if="scope.row.inputVisible"
                    size="small"
                    ref="saveTagInput"
                    v-model="scope.row.inputValue"
                    @blur="handleInputConfirm(scope.row)"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showEditDialog(scope.row.cat_id, scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteParams(scope.row.cat_id, scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="addTitle"
      :visible.sync="isShowAddDialog"
      width="50%"
      @close="addDialogClose"
    >
      <el-form :model="addForm" :rules="commonFormRules" ref="addFormRef" label-width="80px">
        <el-form-item :label="addLabel" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="editTitle" :visible.sync="isShowEditDialog" width="50%">
      <el-form :model="editForm" :rules="commonFormRules" ref="editFormRef" label-width="80px">
        <el-form-item :label="addLabel" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "./BreadCrumb";
export default {
  components: {
    BreadCrumb
  },
  data() {
    return {
      cateList: [],
      checkedKeys: [],
      showProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      activeName: "many",
      manyParamsList: [],
      onlyParamsList: [],
      isShowAddDialog: false,
      addForm: {
        attr_name: ""
      },
      commonFormRules: {
        attr_name: [
          {
            required: true,
            message: "请添加名称",
            trigger: "blur"
          }
        ]
      },
      isShowEditDialog: false,
      editForm: {
        attr_name: ""
      }
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    isDisbaled() {
      return this.checkedKeys.length != 3;
    },
    addTitle() {
      return this.activeName == "only" ? "添加静态属性" : "添加动态参数";
    },
    addLabel() {
      return this.activeName == "only" ? "静态属性" : "动态参数";
    },
    editTitle() {
      return this.activeName == "only" ? "编辑静态属性" : "编辑动态参数";
    },
    paramsInfo() {
      return {
        cat_id:
          this.checkedKeys.length == 3
            ? this.checkedKeys[this.checkedKeys.length - 1]
            : "",
        attr_name: this.addForm.attr_name,
        attr_sel: this.activeName
      };
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
    handleChange() {
      console.log(this.checkedKeys);
      this.getParamsList();
    },
    tabClick() {
      this.getParamsList();
    },
    async getParamsList() {
      if (this.checkedKeys.length != 3) {
        this.onlyParamsList = [];
        this.manyParamsList = [];
        return;
      }
      const res = await this.rquest_getParamList({
        cat_id: this.checkedKeys[2],
        type: this.activeName
      });
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      res.data.forEach(item => {
        item.attr_array = item.attr_vals ? item.attr_vals.split(",") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });
      this[this.activeName + "ParamsList"] = res.data;
    },
    deleteParams(cat_id, attr_id) {
      const title =
        this.activeName == "only" ? "是否删除该属性" : "是否删除该参数";
      const tip = this.activeName == "only" ? "删除属性" : "删除参数";
      this.$confirm(title, tip, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.rquest_deleteParams({
            cat_id: cat_id,
            attr_id: attr_id
          });
          if (res.meta.status != 200) {
            return this.$message.error(res.meta.msg);
          }
          this.getParamsList();
          this.$message.success("删除成功");
        })
        .catch(err => {
          this.$message.info("取消删除");
        });
    },
    showAddDialog() {
      this.isShowAddDialog = true;
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$refs.addFormRef.validate(async res => {
        if (res) {
          const result = await this.rquest_addParams(this.paramsInfo);
          console.log(result);
          this.isShowAddDialog = false;
          if (result.meta.status != 201) {
            return this.$message.error(result.meta.msg);
          }
          this.$message.success("添加成功");
          this.getParamsList();
        }
      });
    },
    async showEditDialog(cat_id, attr_id) {
      const res = await this.rquest_getParams({
        cat_id: cat_id,
        attr_id: attr_id
      });
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      this.isShowEditDialog = true;
      this.editForm = res.data;
    },
    editParams() {
      console.log(this.editForm);
      this.$refs.editFormRef.validate(async res => {
        if (res) {
          const result = await this.rquest_editParams(this.editForm);
          this.isShowEditDialog = false;
          if (result.meta.status != 200) {
            return this.$message.error(result.meta.msg);
          }
          this.$message.success("修改成功");
          this.getParamsList();
        }
      });
    },
    closeTag(data, index) {
      data.attr_vals = data.attr_array.splice(index, 1).join();
      this.saveAttr(data);
    },
    showInput(data) {
      data.inputVisible = true;
      this.$nextTick(_ => {
        console.log(this.$refs.saveTagInput);
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(data) {
      data.inputVisible = false;
      if (data.inputValue) {
        data.attr_array.push(data.inputValue);
        data.attr_vals = data.attr_array.join();
        this.saveAttr(data);
      }
    },
    async saveAttr(data){
      const res = await this.rquest_editParams(data);
        if(res.meta.status != 200){
          this.$message.error(res.meta.msg);
        }else{
          this.$message.success(res.meta.msg);
        }
        data.inputValue = "";
    }
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin: 10px 0;
}
.el-tag {
  margin: 5px;
}

.input {
  width: 100px;
}
</style>