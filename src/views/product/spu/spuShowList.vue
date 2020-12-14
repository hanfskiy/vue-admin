<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
      <el-table
        :data="spuList"
        border
        style="width: 100%; margin: 20px 0"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="$emit('showUpdateList', scope.row)"
            ></el-button>
            <el-button type="info" icon="el-icon-info" size="mini"></el-button>
            <el-popconfirm :title="`确定删除${scope.row.spuName}吗？`">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="getPageList(page, limit)"
        @current-change="getPageList(page, limit)"
        :current-page.sync="page"
        :page-sizes="[3, 6, 9]"
        :page-size.sync="limit"
        layout="prev, pager, next, jumper,sizes,total"
        :total="total"
        class="pagination"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { category } from "@/api";
export default {
  name: "SpuShowList",
  data() {
    return {
      loading: false,
      page: 1,
      limit: 3,
      total: 0,
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      spuList: [],
    };
  },
  methods: {
    async getPageList(page, limit) {
      const { category3Id } = this.category;
      const result = await this.$API.spu.getPageList({
        page,
        limit,
        category3Id,
      });
      if (result.code === 200) {
        this.$message.success("成功获取数据");
        // console.log(result.data);
        this.spuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error(result.message);
      }
    },
    handleChange(category) {
      this.category = category;
      this.getPageList(this.page, this.limit);
    },
    clearList() {
      this.spuList = [];
      this.page = 1;
      this.limit = 3;
      this.total = 0;
      this.category.category3Id = "";
    },
  },
  mounted() {
    this.$bus.$on("change", this.handleChange);
    this.$bus.$on("clearList", this.clearList);
  },
  beforeDestroy() {
    this.$bus.$off("change", this.handleChange);
    this.$bus.$off("clearList", this.clearList);
  },
};
</script>

<style lang="less" scoped>
</style>
