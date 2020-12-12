<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
    <el-table
      :data="trademarkList"
      border
      style="width: 100%; margin: 20px 0"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="logoUrl" class="trademark-logo" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="update(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scope.row)"
            >删除</el-button
          >
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
      class="trademark-pagination"
    >
    </el-pagination>
    <el-dialog
      :title="`${trademarkForm.id ? '修改' : '添加'}品牌`"
      :visible.sync="visible"
      width="50%"
    >
      <el-form
        :model="trademarkForm"
        :rules="rules"
        label-width="100px"
        ref="trademarkForm"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      trademarkList: [],
      page: 1,
      limit: 3,
      total: 0,
      visible: false,
      loading: false,
      trademarkForm: { tmName: "", logoUrl: "" },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请上传品牌LOGO" }],
      },
    };
  },
  methods: {
    add() {
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      this.visible = true;

      this.trademarkForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    update(row) {
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      this.visible = true;
      this.trademarkForm = { ...row };
    },
    // 删除
    async del(row) {
      /*   if (window.confirm("确定删除该品牌吗？")) {
        await this.$API.trademark.delTrademark(id);
        this.getPageList(this.page, this.limit);
       */
      this.$confirm(`确定删除${row.tmName}吗, 是否继续?`, "提示", {
        type: "warning",
      })
        .then(async () => {
          await this.$API.trademark.delTrademark(row.id);
          this.getPageList(this.page, this.limit);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //取消按钮
    cancel() {
      this.visible = false;
      this.trademarkForm.tmName = "";
      this.trademarkForm.logoUrl = "";
    },
    // 提交表单
    submitForm(Form) {
      this.$refs[Form].validate(async (valid) => {
        if (valid) {
          const { trademarkForm } = this;
          // 代表是不是修改 !!转换为boolean
          const isUpdate = !!trademarkForm.id;

          // 是修改需要验证
          if (isUpdate) {
            const tm = this.trademarkList.find(
              (tm) => tm.id === trademarkForm.id
            );

            if (
              tm.tmName === trademarkForm.tmName &&
              tm.logoUrl === trademarkForm.logoUrl
            ) {
              this.$message.warning("不能提交相同数据");
              return;
            }
          }

          let result;
          if (isUpdate) {
            result = await this.$API.trademark.updateTrademark(trademarkForm);
          } else {
            result = await this.$API.trademark.addTrademark(trademarkForm);
          }

          if (result.code === 200) {
            this.$message.success(`${isUpdate ? "修改" : "添加"}品牌成功`);
            this.visible = false;
            trademarkForm.tmName = "";
            trademarkForm.logoUrl = "";
            this.getPageList(this.page, this.limit);
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    // 图片上传成功的回调
    handleAvatarSuccess(res) {
      this.trademarkForm.logoUrl = res.data;
    },
    // 图片上传之前的回调
    beforeAvatarUpload(file) {
      const imgTypes = ["image/jpeg", "image/png", "image/jpg"];
      const isValidateType = imgTypes.indexOf(file.type) > -1;
      const isLt = file.size / 1024 < 50;

      if (!isValidateType) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO大小不能超过 50kb !");
      }
      return isValidateType && isLt;
    },

    //请求分页列表
    async getPageList() {
      this.loading = true;
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.$message.success("成功获取品牌数据");
        this.trademarkList = result.data.records;
        this.total = result.data.total;
        this.page = result.data.current;
        this.limit = result.data.size;
      } else {
        this.$message.error("没有获取到品牌~~");
      }
      this.loading = false;
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit);
  },
};
</script>

<style lang="sass" scoped>
.trademark-logo
  width: 150px
.trademark-pagination
  text-align: right
>>>.el-pagination__sizes
  margin-left: 320px

>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>

