<template>
  <div class="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.replace({
        name: "login"
      });
    }
  }
};
</script>
<style lang="less" scoped>
</style>