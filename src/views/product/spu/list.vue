<template>
  <div>
    <SkuList v-if="isShowSkpList" :spuItem="spuItem" />
    <div v-else>
      <Category :disabled="!isShowList" />
      <SpuShowList
        v-if="isShowList"
        @showUpdateList="showUpdateList"
        @UpdateList="UpdateList"
      />
      <SpuDesc v-else :item="item" @showList="showList" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuDesc from "./spuDesc";
import SkuList from "./skuList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
      isShowSkpList: false,
      spuItem: {},
    };
  },
  methods: {
    showUpdateList(row, category) {
      this.isShowList = false;
      this.item = { ...row, ...category };
    },
    showList(category) {
      this.isShowList = true;
      this.$nextTick(() => {
        this.$bus.$emit("change", category);
      });
    },
    UpdateList(row) {
      this.isShowSkpList = true;
      this.spuItem = { ...row };
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuDesc,
    SkuList,
  },
};
</script>
