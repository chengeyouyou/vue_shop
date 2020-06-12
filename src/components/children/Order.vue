<template>
  <div>
    <BreadCrumb class="BreadCrumb" :levels="['首页','订单管理','订单列表']" />
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
            <el-button @click="getOrderList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column type="index" :index="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="400px"></el-table-column>
        <el-table-column label="订单价格(元)" prop="order_price" width="110px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="100px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status != 1">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="90px"></el-table-column>
        <el-table-column label="创建时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | date_format}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
          <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressDialog"></el-button>
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

    <el-dialog title="编辑订单" :visible.sync="isShowEditDialog" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="city">
          <el-cascader
            v-model="editForm.city"
            :options="cities"
            clearable
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="物流信息"
      :visible.sync="isShowProgressDialog"
      width="50%"
      @close="progressDialogClose"
    >
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in wuLiu"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "./BreadCrumb.vue";
import { format } from "common/utils.js";
import { cities } from "common/cityData";

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
      orderList: [],
      total: 0,
      cities,
      isShowEditDialog: false,
      editForm: {
        city: [],
        address: ""
      },
      editFormRules: {
        city: [{ required: true, message: "请选择省市区", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      isShowProgressDialog: false,
      wuLiu: []
    };
  },
  created() {
    this.getOrderList();
  },
  computed: {
    index() {
      return this.queryInfo.pagesize * (this.queryInfo.pagenum - 1) + 1;
    }
  },
  methods: {
    async getOrderList() {
      const res = await this.rquest_getOrderList(this.queryInfo);
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    clear() {
      this.getOrderList();
    },
    showEditDialog() {
      this.isShowEditDialog = true;
    },
    editOrder() {
      this.isShowEditDialog = false;
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
      this.editForm.city = [];
    },
    async showProgressDialog() {
      this.isShowProgressDialog = true;
      const res = await this.rquest_getWuLiu();
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      this.wuLiu = res.data;
    },
    progressDialogClose(){}
  },
  filters: {
    date_format(date) {
      return format(date * 1000, "yyyy-MM-dd hh:mm:ss");
    }
  }
};
</script>

<style lang="less" scoped>
.el-table,
.el-row {
  margin-bottom: 10px;
}
</style>