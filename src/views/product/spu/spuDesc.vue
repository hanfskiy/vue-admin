<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="spu" label-width="80px">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="tmId">
          <el-select v-model="spu.tmId" placeholder="请选择品牌">
            <el-option
              v-for="tm in tmList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description">
          <el-input
            type="textarea"
            v-model="spu.description"
            placeholder="SPU描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片" prop="logoUrl">
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :file-list="imgList"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
        <el-form-item label="销售属性" prop="saleAttrListId">
          <el-select
            v-model="spu.saleAttrListId"
            :placeholder="`还有${filterSaleAttrList.length}项未选择`"
          >
            <el-option
              v-for="sale in filterSaleAttrList"
              :key="sale.id"
              :label="sale.name"
              :value="sale.id"
            ></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        </el-form-item>
        <el-form-item>
          <el-table
            :data="spuSaleAttrList"
            border
            style="width: 100%; margin: 20px 0"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名称" width="150">
            </el-table-column>
            <el-table-column label="属性值列表">
              <template v-slot="{ row }">
                <el-tag
                  style="margin-right: 5px"
                  v-for="spuSale in row.spuSaleAttrValueList"
                  :key="spuSale.id"
                  >{{ spuSale.saleAttrValueName }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
      <el-dialog :visible.sync="visible">
        <img width="100%" :src="spuImageUrl" alt="" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuDesc",
  props: {
    item: Object,
  },
  data() {
    return {
      spu: this.item,
      tmList: [],
      imgList: [],
      visible: false,
      spuImageUrl: "",
      saleAttrList: [],
      spuSaleAttrList: [],
    };
  },
  computed: {
    filterSaleAttrList() {
      return this.saleAttrList.filter(
        (sale) =>
          !this.spuSaleAttrList.find(
            (spuSale) => spuSale.baseSaleAttrId === sale.id
          )
      );
    },
  },
  methods: {
    handleRemove(file, fileList) {
      this.imgList = this.imgList.filter((img) => img.id !== file.id);
    },
    handlePictureCardPreview(file) {
      this.spuImageUrl = file.url;
      this.visible = true;
    },
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success("成功获取品牌数据");
        this.tmList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    async getImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getImageList(id);
      if (result.code === 200) {
        this.$message.success("成功获取图片");
        this.imgList = result.data.map((img) => {
          return {
            name: img.imgName,
            url: img.imgUrl,
            id: img.id,
          };
        });
      } else {
        this.$message.error(result.message);
      }
    },
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.$message.success("成功获取所有属性");
        this.saleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    async getspuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getspuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("成功获取所有属性");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getTrademarkList();
    this.getImageList();
    this.getSaleAttrList();
    this.getspuSaleAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>
