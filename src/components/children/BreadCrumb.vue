<template>
  <div class="bread">
    <el-breadcrumb separator="/" >
      <el-breadcrumb-item :to="index == 0 ? { path: '/welcome' } : ''" v-for="(level,index) in levels" :key="index">{{level}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
    props:{
        levels:{
            type:Array,
            default(){
                return [];
            }
        }
    },
    data(){
        return {
            
        }
    }
};
</script>

<style lang="less" scoped>
.el-breadcrumb{
    font-size:16px;
    padding: 5px 0;
}
</style>