<template>
  <div>
    <BreadCrumb class="BreadCrumb" :levels="['首页','数据统计','数据报表']" />
    <el-card>
      <VeLine :data="option" :settings="settings" :title="titleSetting" />
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
      option: {
        columns: ["date"],
        rows: []
      },
      settings: {
        stack: { 用户: ["华东", "华南", "华北", "西部", "其他"] },
        area: true
      },
      titleSetting: {
        text: "用户来源"
      }
    };
  },
  created() {
    this.getReport();
  },
  methods: {
    async getReport() {
      const res = await this.rquest_getReport();
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      let data = res.data;
      this.option.columns.push(...data.legend.data);
      for (const key in data.xAxis[0].data) {
        const date = data.xAxis[0].data[key];
        const row = {};
        row['date'] = date;
        data.series.forEach(el => {
          row[el.name] =  el.data[key];
        });
        this.option.rows.push(row);
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>