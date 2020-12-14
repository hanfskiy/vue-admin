<template>
  <div>
    <!--  <Category
      @change="getAttrList"
      :disabled="!isShowList"
      @clearList="clearList"
    /> -->
    <Category :disabled="!isShowList" />
    <el-card style="margin-top: 20px" v-show="isShowList">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="add"
        >添加属性</el-button
      >
      <el-table
        :data="attrList"
        border
        style="width: 100%; margin: 20px 0"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(scope.row)"
            ></el-button>
            <el-popconfirm
              :title="`确定删除${scope.row.attrName}吗？`"
              @onConfirm="delAttr(scope.row.id)"
            >
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
    </el-card>

    <el-card style="margin-top: 20px" v-show="!isShowList">
      <el-form :model="attr" inline>
        <el-form-item label="属性名">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addAttrVal"
        :disabled="!attr.attrName"
        >添加属性值</el-button
      >
      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
              ref="input"
              size="mini"
            ></el-input>
            <span
              v-else
              @click="edit(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popconfirm
              :title="`确定删除${scope.row.valueName}吗？`"
              @onConfirm="delAttrVal(scope.$index)"
            >
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
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="isShowList = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "@/components/Category";

export default {
  name: "AttrList",
  data() {
    return {
      loading: false,
      attrList: [],
      isShowList: true,
      attr: {
        attrName: "",
        attrValueList: [],
      },
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    //清空属性列表
    clearList() {
      this.attrList = [];
      this.category.category3Id = "";
    },
    // 删除属性列表
    async delAttr(attrId) {
      // console.log(attrId)
      const result = await this.$API.attr.delAttr(attrId);
      if (result.code === 200) {
        this.$message.success("成功删除数据");
        this.getAttrList(this.category);
      } else {
        this.$message.error(result.message);
      }
    },
    //添加属性
    add() {
      this.attr.attrName = "";
      this.attr.attrValueList = [];
      this.isShowList = false;
    },
    // 保存属性
    async save() {
      const isUpdate = !this.attr.id;

      const data = this.attr;

      if (isUpdate) {
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }

      const result = await this.$API.attr.saveAttr(data);
      if (result.code === 200) {
        this.$message.success("更新数据成功");
        this.isShowList = true;
        this.getAttrList(this.category);
      } else {
        this.$message.error(result.message);
      }
    },
    // 输入框验证
    editCompleted(row, index) {
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
      }
      row.edit = false;
    },
    //删除属性
    delAttrVal(index) {
      this.attr.attrValueList.splice(index, 1);
    },
    //添加属性
    addAttrVal() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //显示输入框并获取焦点
    edit(row) {
      //直接给对象添加新属性不是响应式数据, 通过this.$set添加的属性才是响应式
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //修改数据
    update(attr) {
      // 为了防止attr变化时直接修改原数据
      // 深度克隆：防止对象中对象还存在引用关系
      this.attr = JSON.parse(JSON.stringify(attr));
      this.isShowList = false;
    },

    // 获取属性值
    async getAttrList(category) {
      this.loading = true;
      this.category = category;
      const result = await this.$API.attr.getAttrList(category);
      if (result.code === 200) {
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
  },
  // 绑定全局事件总线
  mounted() {
    this.$bus.$on("change", this.getAttrList);
    this.$bus.$on("clearList", this.clearList);
  },
  // 解绑全局事件总线
  beforeDestroy() {
    this.$bus.$off("change", this.getAttrList);
    this.$bus.$off("clearList", this.clearList);
  },
  components: {
    Category,
  },
};
</script>
