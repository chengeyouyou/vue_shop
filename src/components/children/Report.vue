<template>
  <div>
      <BreadCrumb class="BreadCrumb" :levels="['首页','数据统计','数据报表']" />
      <el-card>
        <v-chart></v-chart>
      </el-card>
  </div>
</template>

<script>
import BreadCrumb from "./BreadCrumb.vue";
export default {
  components: {
    BreadCrumb
  },
}
</script>

<style lang="less" scoped>

</style>