<template>
  <div class="user">
    <BreadCrumb class="BreadCrumb" :levels="['首页', '用户管理', '用户列表']" />
    <el-card class="box-card" shadow="hover">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="showAddDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 内容区 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index" :index="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <el-switch
            v-model="scope.row.ms_status"
            slot-scope="scope"
            @change="userStatusChange(scope.row)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改信息" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditForm(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <el-dialog title="添加用户" :visible.sync="isShowAddDialog" width="50%">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username "></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="编辑用户" :visible.sync="isShowEditDialog" width="50%">
        <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="分配角色" :visible.sync="isShowRoleDialog" width="50%">
        <div>
          <p>当前用户: {{user.username}}</p>
          <p>当前角色: {{user.role_name}}</p>
          <p>
            请选择角色:
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="role in roleList"
                :key="role.id"
                :label="role.roleName"
                :value="role.id"
              ></el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelRole">取 消</el-button>
          <el-button type="primary" @click="assignRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { checkPhone, checkEmail } from "common/utils.js";

import BreadCrumb from "./BreadCrumb.vue";
export default {
  components: {
    BreadCrumb
  },
  created() {
    this.getUserList();
  },
  data() {
    var checkMyEmail = (rule, value, cb) => {
      if (checkEmail(value)) {
        cb();
      } else {
        cb(new Error("请输入正确格式的邮箱地址"));
      }
    };
    var checkMobile = (rule, value, cb) => {
      if (checkPhone(value)) {
        cb();
      } else {
        cb(new Error("请输入正确格式的手机号码"));
      }
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      selectedRoleId:'',
      user: {},
      isShowRoleDialog: false,
      userList: [],
      roleList:[],
      total: 0,
      isShowAddDialog: false,
      isShowEditDialog: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editForm: {
        username: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkMyEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    index() {
      return (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize + 1;
    }
  },
  methods: {
    async getUserList() {
      const res = await this.rquest_getUserList(this.queryInfo);
      if (res.meta.status == 200) {
        this.userList = res.data.users;
        this.total = res.data.total;
      } else {
        this.$message.error(res.meta.msg);
      }
      console.log(res);
    },
    async userStatusChange(user) {
      const res = await this.rquest_changeUserStatus({
        uId: user.id,
        type: user.ms_status
      });
      console.log(res);
      if (res.meta.status == 200) {
        this.$message.success("修改成功");
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    showAddDialog() {
      this.isShowAddDialog = true;
    },
    cancelAdd() {
      this.isShowAddDialog = false;
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.isShowAddDialog = false;
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const res = await this.rquest_addUser(this.addForm);
          if (res.meta.status == 200) {
            this.$message.success("添加成功");
            this.getUserList();
          } else {
            this.$message.error(res.meta.msg);
          }
        }
        this.$refs.addFormRef.resetFields();
      });
    },
    async showEditForm(id) {
      this.isShowEditDialog = true;
      const res = await this.rquest_getUser({
        id: id
      });
      if (res.meta.status == 200) {
        this.editForm = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    cancelEdit() {
      this.isShowEditDialog = false;
      this.$refs.editFormRef.resetFields();
    },
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const res = await this.rquest_editUser(this.editForm);
          console.log(res);
          if (res.meta.status == 200) {
            this.getUserList();
            this.$message.success("修改成功");
          } else {
            this.$message.error(res.meta.msg);
          }
        }
        this.$refs.editFormRef.resetFields();
      });
      this.isShowEditDialog = false;
    },
    deleteUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.rquest_deleteUser({
            id: id
          });
          console.log(res);
          if (res.meta.status == 200) {
            this.getUserList();
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async showRoleDialog(user) {
      this.user = user;
      this.isShowRoleDialog = true;
      const res = await this.rquest_getRoleList();
      if(res.meta.status != 200){
        this.$message.error(res.meta.msg);
      }
      this.roleList = res.data;
    },
    cancelRole() {
       this.isShowRoleDialog = false;
    },
    async assignRole() {
      const res = await this.rquest_assignRole({
        id:this.user.id,
        rid:this.selectedRoleId
      });
      if(res.meta.status != 200){
        this.$message.error(res.meta.msg);
      }else{
        this.$message.success('分配成功');
        this.getUserList();
      }
      this.cancelRole();

    }
  }
};
</script>

<style lang="less" scoped>
.user {
  .el-container {
    background-color: #fff;
  }
  .el-row {
    margin-bottom: 10px;
  }
}
</style>