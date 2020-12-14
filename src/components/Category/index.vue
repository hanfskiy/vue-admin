<template>
  <div>
    <el-card>
      <el-form inline :model="category" :disabled="disabled">
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            placeholder="请选择"
            @change="handleChange1"
          >
            <el-option
              v-for="c1 in category1List"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            placeholder="请选择"
            @change="handleChange2"
          >
            <el-option
              v-for="c2 in category2List"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category.category3Id"
            placeholder="请选择"
            @change="handleChange3"
          >
            <el-option
              v-for="c3 in category3List"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "category",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  props: ["disabled"],
  methods: {
    async handleChange1(category1Id) {
      this.category.category2Id = "";
      this.category.category3Id = "";
      this.category2List = [];
      this.category3List = [];

      const result = await this.$API.attr.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      } else {
        this.$message.error(result.message);
      }

      this.$emit("clearList");
    },
    async handleChange2(category2Id) {
      this.category.category3Id = "";
      this.category3List = [];

      const result = await this.$API.attr.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      } else {
        this.$message.error(result.message);
      }

      this.$emit("clearList");
    },
    async handleChange3(category3Id) {
      const category = {
        ...this.category,
        category3Id,
      };

      this.$emit("change", category);
    },
  },
  async mounted() {
    const result = await this.$API.attr.getCategory1();
    if (result.code === 200) {
      this.category1List = result.data;
    } else {
      this.$message.error(result.message);
    }
  },
};
</script>

<style lang="less" scoped>
</style>
