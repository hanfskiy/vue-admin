<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="trademark" border style="width: 100%; margin: 20px 0">
      <el-table-column prop="id" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="name" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.image" alt="image" class="trademark-logo" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作"
        ><template>
          <el-button type="warning" icon="el-icon-edit" size="mini"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[3, 6, 9]"
      :page-size="3"
      layout="prev, pager, next, jumper,sizes,total"
      :total="10"
      class="trademark-pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      trademark: [
        {
          id: 1,
          name: "iphone",
          image:
            "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1927241330,3991924330&fm=26&gp=0.jpg",
        },
      ],
    };
  },
};
</script>

<style lang="sass">
.trademark-logo
  width: 150px
.trademark-pagination
  text-align: right
.el-pagination__sizes
  margin-left: 320px
</style>
