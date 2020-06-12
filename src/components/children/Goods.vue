<template>
  <div>
    <BreadCrumb class="BreadCrumb" :levels="['首页','商品管理','商品列表']" />
    <el-card shadow="hover">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="clear"
          >
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="add">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" :index="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="500px"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="110px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template slot-scope="scope">{{scope.row.add_time | date_format}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="编辑商品" :visible.sync="isShowEditDialog" width="50%" @close="editDialogClose">
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "./BreadCrumb.vue";
import {format} from 'common/utils.js';

export default {
  components: {
    BreadCrumb
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      goodsList: [],
      total:0,
      isShowEditDialog:false
    };
  },
  created() {
    this.getGoodsList();
    
  },
  computed:{
    index(){
      return this.queryInfo.pagesize * (this.queryInfo.pagenum - 1) + 1
    }
  },
  methods: {
    async getGoodsList() {
      const res = await this.rquest_getGoodsList(this.queryInfo);
      console.log(res);
      if(res.meta.status != 200){
        return this.$message.error(res.meta.msg);
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(val){
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val){
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },
    clear(){
      this.getGoodsList();
    },
    deleteGoods(goods_id){
      this.$confirm("此操作将删除该商品, 是否继续?", "删除商品", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async res=>{
          if(res){
          const result = await this.rquest_deleteGoods({
              goods_id:goods_id
            })
            console.log(result);
            if(result.meta.status != 200){
              return this.$message.error(result.meta.msg);
            }
            this.getGoodsList();
            this.$message.success('删除成功');
          }
      }).catch(err=>{
        this.$message.info('已取消删除');
      });
    },
    showEditDialog(){
      this.isShowEditDialog = true;
    },
    add(){
      this.$router.push({
        name:'add'
      });
    },
    editGoods(){

    },
    editDialogClose(){
      
    }
  },
  filters:{
    date_format(date){
      return format(date * 1000, 'yyyy-MM-dd hh:mm:ss');
    }
  }
};
</script>

<style lang="less" scoped>
.el-table,.el-row {
  margin-bottom: 10px;
}
</style>