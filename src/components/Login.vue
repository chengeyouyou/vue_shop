<template>
  <div class="login">
    <div class="box">
      <div class="avatar">
        <img src="~assets/img/logo.png" alt />
      </div>
      <div class="info">
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="iconfont icon-touxiang"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              prefix-icon="iconfont icon-suo "
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item class="actions">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    clear() {
      console.log(this.$refs.loginForm);
      this.$refs.loginForm.resetFields();
    },
    login() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          const res = await this.rquest_login(this.loginForm);
           console.log(res);
          if(res.meta.status == 200){
            this.$message.success('登录成功');
            window.sessionStorage.setItem('TOKEN', res.data.token);
            this.$router.push({
              name:'home'
            });
          }else{
             this.$message.error('登录失败');
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #2b4b6b;

  .box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar {
      height: 130px;
      width: 130px;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #eee;
      position: absolute;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px #ddd;
      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        background-color: #eee;
      }
    }

    .info {
      box-sizing: border-box;
      padding: 0 20px;
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;

      .actions {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>