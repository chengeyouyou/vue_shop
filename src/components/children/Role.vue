<template>
  <div>
    <BreadCrumb class="BreadCrumb" :levels="['首页', '管理权限', '角色列表']" />
    <el-card shadow="hover">
      <el-row>
        <el-col :span="10">
          <el-button type="primary" style="margin-bottom:10px" @click="showAddDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" style="width: 100%" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="levelOne in scope.row.children"
              :key="levelOne.id"
              :class="['border-bottom', 'vcenter']"
            >
              <el-col :span="6">
                <el-tag closable @close="deleteRights(scope.row, levelOne.id)">{{levelOne.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  v-for="(levelTwo,index) in levelOne.children"
                  :key="levelTwo.id"
                  :class="[index != 0 ? 'border-top' : '', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="warning"
                      closable
                      @close="deleteRights(scope.row, levelTwo.id)"
                    >{{levelTwo.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <el-col
                        :span="6"
                        v-for="levelThree in levelTwo.children"
                        :key="levelThree.id"
                      >
                        <el-tag
                          type="danger"
                          closable
                          @close="deleteRights(scope.row, levelThree.id)"
                        >{{levelThree.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="120px"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="150px"></el-table-column>
        <el-table-column prop="level" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-search"
              size="mini"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-search"
              size="mini"
              @click="showAuthDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限窗口 -->
    <el-dialog title="分配权限" :visible.sync="isShowAuthDialog" width="50%">
      <el-tree
        ref="treeRef"
        :default-expand-all="true"
        :data="rightsList"
        :props="rightsProps"
        node-key="id"
        :default-checked-keys="checkedKeys"
        show-checkbox
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAuthDialog = false">取 消</el-button>
        <el-button type="primary" @click="assignRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色窗口-->
    <el-dialog title="添加角色" :visible.sync="isShowAddDialog" width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName "></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc "></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="isShowEditDialog" width="50%">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName "></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc "></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "./BreadCrumb.vue";
export default {
  components: {
    BreadCrumb
  },
  data() {
    return {
      roleList: [],
      isShowAuthDialog: false,
      rightsList: [],
      rightsProps: {
        label: "authName",
        children: "children"
      },
      checkedKeys: [],
      //将分配权限的角色id
      roleId: 0,
      isShowAddDialog: false,
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      addFormRules: {
        roleName: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      isShowEditDialog: false,
      editForm: {}
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const res = await this.rquest_getRoleList();
      console.log(res);
      if (res.meta.status == 200) {
        this.roleList = res.data;
      }
    },
    deleteRights(role, rightId) {
      // return console.log(rightId);
      this.$confirm("是否删除该权限?", "删除权限", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.rquest_deleteRoleRights({
            roleId: role.id,
            rightId: rightId
          });
          console.log(res);
          if (res.meta.status != 200) {
            this.$message.error(res.meta.msg);
          }
          role.children = res.data;
          this.$message.success("删除成功");
        })
        .catch(err => this.$message.info("已取消删除"));
    },
    deleteRole(roleId) {
      this.$confirm("是否删除该角色?", "删除角色", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.rquest_deleteRole({
            roleId: roleId
          });
          console.log(res);
          if (res.meta.status != 200) {
            this.$message.error(res.meta.msg);
          }
          this.getRoleList();
          this.$message.success("删除成功");
        })
        .catch(err => this.$message.info("已取消删除"));
    },
    async showAuthDialog(role) {
      this.isShowAuthDialog = true;
      this.rightsList = [];
      const res = await this.rquest_getRightsList('tree');
      console.log(res);
      if (res.meta.status != 200) {
        this.$message.error(res.meta.msg);
      }
      this.rightsList = res.data;
      this.checkedKeys = [];
      console.log(role);
      this.getCheckedKeys(role, this.checkedKeys);
      this.roleId = role.id;
    },
    async assignRights() {
      const res = await this.rquest_getAssignRights({
        roleId: this.roleId,
        rids: [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ].join()
      });
      if (res.meta.data != 200) {
        this.$message.error(res.meta.msg);
      }
      this.$message.success("授权成功");
      this.getRoleList();
      this.isShowAuthDialog = false;
    },
    //获取角色的所有三级权限
    getCheckedKeys(role, checkedKeys) {
      if (role.children == null) {
        return checkedKeys.push(role.id);
      }
      role.children.forEach(item => {
        this.getCheckedKeys(item, checkedKeys);
      });
    },
    showAddDialog() {
      this.isShowAddDialog = true;
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const res = await this.rquest_addRole(this.addForm);
          console.log(res);
          if (res.meta.status != 201) {
            this.$message.error(res.meta.msg);
          } else {
            this.$message.success("添加成功");
            this.getRoleList();
          }
          this.isShowAddDialog = false;
        } else {
          this.$message.error("请填写必要信息");
        }
      });
    },
    showEditDialog(roleId) {
      this.isShowEditDialog = true;
      this.getRole(roleId);
    },
    async getRole(roleId) {
      const res = await this.rquest_getRoleById({
        roleId: roleId
      });
      if(res.meta.status != 200){
        this.$message.error(res.meta.msg);
      }
      this.editForm = res.data;
    },
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const res = await this.rquest_editRole(this.editForm);
          if(res.meta.status != 200){
            this.$message.error(res.meta.msg);
          }else{
            this.$message.success('修改成功');
            this.getRoleList(); 
          }
          this.isShowEditDialog = false;
        } else {
          this.$message.error("请填写必要信息");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.border-bottom {
  border-bottom: 1px solid #ccc;
}
.border-top {
  border-top: 1px solid #ccc;
}

.el-row {
  margin-bottom: 10px;
}
.el-tag {
  margin: 5px 0;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>