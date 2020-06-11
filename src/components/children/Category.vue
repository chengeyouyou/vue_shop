<template>
  <div>
    <BreadCrumb :levels="['首页', '商品管理', '商品分类']" class="BreadCrumb" />
    <el-card shadow="hover">
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        ref="treeTable"
        index-text="#"
        :data="cateList"
        :columns="cateColumns"
        :expand-type="false"
        :selection-type="false"
        border
        show-index
      >
        <template slot="is" scope="scope">
          <i class="el-icon-success" v-if="!scope.cat_deleted" style="color:blue"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" scope="scope">
          <el-tag type="success" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="info" v-else-if="scope.row.cat_level == 1">二级</el-tag>
          <el-tag type="danger" v-else>三级</el-tag>
        </template>
        <template slot="do" scope="scope">
          <el-button type="primary" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="添加分类" :visible.sync="isShowAddDialog" width="50%" @close="addDialogClose">
      <el-form :model="addCateInfo" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="checkedKeys"
            :options="pCateList"
            :props="showProps"
            @change="handleChange"
            clearable
          >
            <template slot-scope="{ node, data }">
              <span>{{data.cat_name}}</span>
              <span v-if="!node.isLeaf">({{ data.children.length }})</span>
            </template>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑分类" :visible.sync="isShowEditDialog" width="50%">
      <el-form :model="editCateInfo" :rules="addFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
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
  created() {
    this.getCateList();
  },
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 0,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      cateColumns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "is"
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "do"
        }
      ],
      isShowAddDialog: false,
      addFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      },
      addCateInfo: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0
      },
      checkedKeys: [],
      pCateList: [],
      showProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      },
      isShowEditDialog: false,
      editCateInfo: {
        cat_name: ""
      }
    };
  },
  methods: {
    async getCateList() {
      const res = await this.rquest_getCateList(this.queryInfo);
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getCateList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getCateList();
    },
    async showAddDialog() {
      this.isShowAddDialog = true;
      const res = await this.rquest_getCateList({
        type: 2
      });
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      this.pCateList = res.data;
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
      this.checkedKeys = [];
      this.addCateInfo.cat_level = 0;
      this.addCateInfo.cat_pid = 0;
      this.addCateInfo.cat_name = "";
    },
    addCate() {
      this.$refs.addFormRef.validate(async res => {
        if (res) {
          console.log(this.addCateInfo);
          const res = await this.rquest_addCate(this.addCateInfo);
          if (res.meta.status != 201) {
            return this.$message.error(res.meta.msg);
          }
          this.getCateList();
          this.isShowAddDialog = false;
          this.$message.success("添加成功");
        }
      });
    },
    handleChange() {
      console.log(this.checkedKeys);
      this.addCateInfo.cat_pid =
        this.checkedKeys.length > 0
          ? this.checkedKeys[this.checkedKeys.length - 1]
          : 0;
      this.addCateInfo.cat_level = this.checkedKeys.length;
    },
    deleteCate(cat_id) {
      this.$confirm("是否删除分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.rquest_deleteCate({
            id: cat_id
          });
          if (res.meta.status != 200) {
            return this.$message.error(res.meta.msg);
          }
          this.getCateList();
          this.$message.success("删除成功");
        })
        .catch(err => {
          this.$message.info("取消删除");
        });
    },
    async showEditDialog(id) {
      const res = await this.rquest_getCate({
        id: id
      });
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      this.isShowEditDialog = true;
      this.editCateInfo = res.data;
    },
    editCate() {
      this.$refs.editFormRef.validate(async res => {
        if (res) {
          const result = await this.rquest_editCate(this.editCateInfo);
          this.isShowEditDialog = false;
          if (result.meta.status != 200) {
            return this.$message.error(result.meta.msg);
          }
          this.$message.success("修改成功");
          this.getCateList();
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 10px;
}

.el-pagination {
  margin-top: 10px;
}

.el-cascader {
  width: 100%;
}
</style>