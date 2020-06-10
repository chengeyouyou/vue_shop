<template>
  <div>
    <BreadCrumb class="BreadCrumb" :levels="['首页', '管理权限', '权限列表']" />
    <el-card shadow="hover">
      <el-table :data="rightsList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 1">等级一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 2">等级二</el-tag>
            <el-tag type="info" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
      rightsList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const res = await this.rquest_getRightsList('list');
      console.log(res);
      if (res.meta.status == 200) {
        this.rightsList = res.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .el-card{
    max-height: 486px;
    overflow-y: scroll;
  }
</style>