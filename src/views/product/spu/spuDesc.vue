<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="spu" label-width="80px" :rules="rules" ref="spuForm">
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
        <el-form-item label="SPU图片" prop="spuImgUrl">
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :file-list="formartImg"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
        <!--  <el-form-item label="销售属性" prop="saleAttrListId">
          <el-select
            v-model="spu.saleAttrListId"
            :placeholder="`还有${filterSaleAttrList.length}项未选择`"
          > -->
        <el-form-item label="销售属性" prop="saleAttr">
          <el-select
            v-model="spu.sale"
            :placeholder="`还有${filterSaleAttrList.length}项未选择`"
          >
            <el-option
              v-for="sale in filterSaleAttrList"
              :key="sale.id"
              :label="sale.name"
              :value="`${sale.id}-${sale.name}`"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="!spu.sale"
            @click="addSpuSaleAttr"
            >添加销售属性</el-button
          >
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
                  v-for="(spuSale, index) in row.spuSaleAttrValueList"
                  :key="spuSale.id"
                  closable
                  @close="delSpuAttrValue(row, index)"
                  >{{ spuSale.saleAttrValueName }}
                </el-tag>
                <el-input
                  style="width: 100px"
                  size="small"
                  v-if="row.edit"
                  v-model="saleAttrValueText"
                  @blur="editCompleted(row)"
                  @keyup.enter.native="editCompleted(row)"
                  ref="input"
                ></el-input>
                <el-button
                  icon="el-icon-plus"
                  size="small"
                  v-else
                  @click="addSpuSaleValueAttr(row)"
                  >添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template v-slot="{ $index }">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delSaleAttr($index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button
            @click="
              $emit('showList', {
                category1Id: spu.category1Id,
                category2Id: spu.category2Id,
                category3Id: spu.category3Id,
              })
            "
            >取消</el-button
          >
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
      saleAttrValueText: "",
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称" }],
        tmId: [{ required: true, message: "请选择品牌" }],
        description: [{ required: true, message: "请输入关于的SPU描述" }],
        spuImgUrl: [{ validator: this.imgListValidator, required: true }],
        saleAttr: [{ validator: this.saleAttrValidator, required: true }],
      },
    };
  },
  computed: {
    // 格式化图片 服务器返回图片字段，与组件使用字段不一致
    formartImg() {
      return this.imgList.map((img) => {
        return {
          name: img.imgName,
          url: img.imgUrl,
          uid: img.uid || img.id,
        };
      });
    },
    // 过滤所有销售属性
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
    // 保存
    save() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          const spu = {
            ...this.spu,
            spuImageList: this.imgList,
            spuSaleAttrList: this.spuSaleAttrList,
          };

          let result;
          if (this.spu.id) {
            result = await this.$API.spu.updateSpu(spu);
          } else {
            result = await this.$API.spu.saveSpu(spu);
          }

          if (result.code === 200) {
            this.$message.success(`${this.spu.id ? "保存" : "添加"}成功~`);
            this.$emit("showList", this.spu.category);
          } else {
            this.$message.error(result.message);
          }
        }

        /* {
              "category3Id": 0,
              "description": "string",
              "id": 0,
              "spuImageList": [],
              "spuName": "string",
              "spuSaleAttrList": []
            } */
      });
    },
    // 图片校验
    imgListValidator(rule, value, callback) {
      if (this.imgList.length === 0) {
        callback(new Error("请添加至少一张图片"));
        return;
      }
      callback();
    },
    // 销售属性校验
    saleAttrValidator(rule, value, callback) {
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error("请添加至少一个销售属性"));
        return;
      }

      const isErr = this.spuSaleAttrList.some(
        (sale) => sale.spuSaleAttrValueList.length === 0
      );

      if (isErr) {
        callback(new Error("请添加至少一个销售属性值"));
        return;
      }

      callback();
    },
    // 删除销售属性
    delSaleAttr(index) {
      this.spuSaleAttrList.splice(index, 1);
    },
    // 删除销售属性值
    delSpuAttrValue(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 添加销售属性值
    editCompleted(row) {
      if (this.saleAttrValueText) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.saleAttrValueText,
          spuId: row.spuId,
        });

        this.saleAttrValueText = "";

        row.edit = false;
      }
      row.edit = false;
    },
    // 添加属性值输入框并聚焦
    addSpuSaleValueAttr(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // 添加spu销售属性
    /* addSpuSaleAttr() {
      const { saleAttrListId, id } = this.spu;
      const sale = this.saleAttrList.find((sale) => sale.id === saleAttrListId);
      console.log(sale);
      this.spuSaleAttrList.push({
        baseSaleAttrId: sale.id,
        saleAttrName: sale.name,
        spuId: id,
        spuSaleAttrValueList: [],
      });
      this.spu.saleAttrListId = "";
    }, */
    addSpuSaleAttr() {
      const { sale, id } = this.spu;
      const [baseSaleAttrId, saleAttrName] = sale.split("-");

      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId,
        saleAttrName,
        spuId: id,
        spuSaleAttrValueList: [],
      });
      this.spu.sale = "";
    },
    // 图片上传成功的回调
    handleAvatarSuccess(res, file) {
      this.imgList.push({
        imgName: file.name,
        imgUrl: res.data,
        spuId: this.spu.id,
        uid: file.uid,
      });
    },
    // 图片上传之前的回调
    beforeAvatarUpload(file) {
      const imgTypes = ["image/jpeg", "image/png", "image/jpg"];
      const isValidateType = imgTypes.indexOf(file.type) > -1;
      const isLt = file.size / 1024 < 50;

      if (!isValidateType) {
        this.$message.error("上传图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传图片大小不能超过 50kb !");
      }
      return isValidateType && isLt;
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.imgList = this.imgList.filter((img) => img.imgUrl !== file.url);
    },
    //图片预览
    handlePictureCardPreview(file) {
      this.spuImageUrl = file.url;
      this.visible = true;
    },
    // 获取所有品牌
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success("成功获取品牌数据");
        this.tmList = result.data;
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
    //获取所有销售属性
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.$message.success("成功获取所有销售属性");
        this.saleAttrList = result.data;
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
  },
  mounted() {
    if (this.spu.id) {
      this.getImageList();
      this.getspuSaleAttrList();
    }

    this.getTrademarkList();
    this.getSaleAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>
