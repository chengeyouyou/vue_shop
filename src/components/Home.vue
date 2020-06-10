<template>
  <el-container class="home">
    <el-header>
      <div>
        <img src="~assets/img/logo.png" alt />
        <span>电商后台系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="trigger-collapse" @click="collapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <el-submenu :index="subMenu.id.toString()" v-for="subMenu in menuList" :key="subMenu.id">
            <template slot="title">
              <i :class="icons[subMenu.id]"></i>
              <span>{{subMenu.authName}}</span>
            </template>
            <el-menu-item
              :index="'/' + item.path"
              v-for="item in subMenu.children"
              :key="item.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      icons: {
        "125": "iconfont icon-user-group",
        "103": "iconfont icon-icon--quanxian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju-tianchong",
        "145": "iconfont icon-baobiao"
      },
      isCollapse: false
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.replace({
        name: "login"
      });
    },
    async getMenuList() {
      const res = await this.rquest_getMenuList();
      if (res.meta.status == 200) {
        this.menuList = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
      console.log(res);
    },
    collapse(){
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>
<style lang="less" scoped>
.home {
  height: 100%;

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    img {
      height: 60px;
      border-radius: 50%;
      margin-right: 10px;
    }

    div {
      display: flex;
      align-items: center;
    }
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border: none;
    }

    .trigger-collapse{
      height: 40px;
      color: #fff;
      letter-spacing: 0.3em;
      text-align: center;
      line-height: 40px;
      background-color: #ccc;
      cursor: pointer;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
}

.iconfont {
  margin-right: 8px;
}
</style>