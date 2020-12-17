<template>
  <el-card>
    <el-form :model="spu" label-width="100px" :rules="rules" ref="skuForm">
      <el-form-item label="SPU 名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU 名称" prop="skuName">
        <el-input placeholder="SKU名称" v-model="spu.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input-number
          controls-position="right"
          placeholder="SKU价格"
          v-model="spu.skuprice"
          :min="1"
          style="width: 100%"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number
          controls-position="right"
          placeholder="SKU重量"
          :min="1"
          style="width: 100%"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="description">
        <el-input
          type="textarea"
          v-model="spu.des"
          placeholder="SPU规格描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div
          class="sku-option"
          v-for="attr in attrList"
          :key="attr.id"
          :lable="attr.attrName"
          :value="attr.id"
        >
          <span>{{ attr.attrName }}</span>
          <el-select v-model="attr.value">
            <el-option
              v-for="value in attr.attrValueList"
              :key="value.id"
              :label="value.valueName"
              :value="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div
          class="sku-option"
          v-for="sale in spuSaleAttrList"
          :key="sale.id"
          :label="sale.saleAttrName"
          :value="sale.id"
        >
          <span>{{ sale.saleAttrName }}</span>
          <el-select v-model="sale.value">
            <el-option
              v-for="attrValue in sale.spuSaleAttrValueList"
              :key="attrValue.id"
              :label="attrValue.saleAttrValueName"
              :value="attrValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table :data="imgList" border style="width: 100%; margin: 10px 0">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row }"
              ><img
                :src="row.imgUrl"
                alt="row.imgName"
                style="width: 200px" /></template
          ></el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button type="primary">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "SkuList",
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spu: this.spuItem,
      rules: {},
      spuSaleAttrList: [],
      imgList: [],
      attrList: [],
    };
  },
  methods: {
    //获取平台属性
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this.spu;
      const result = await this.$API.attr.getAttrList({
        category1Id,
        category2Id,
        category3Id,
      });
      if (result.code === 200) {
        this.$message.success("成功获取平台属性");
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //获取spu销售属性
    async getspuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getspuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("成功获取spu销售属性");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取图片
    async getImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getImageList(id);
      if (result.code === 200) {
        this.$message.success("成功获取图片");
        this.imgList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getImageList();
    this.getspuSaleAttrList();
    this.getAttrList();
  },
};
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left
.sku-option
  margin-left: 30px
  display: inline-block
</style>
