<template>
  <div class="bread">
    <el-breadcrumb separator="/" >
      <el-breadcrumb-item :to="{ path: '/welcome' }" v-for="(level,index) in levels" :key="index">{{level}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
    props:{
        levels:{
            type:Array,
            default(){
                return ['首页', '用户管理', '用户列表'];
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