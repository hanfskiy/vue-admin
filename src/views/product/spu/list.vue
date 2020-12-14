<template>
  <div>
    <Category />
    <SpuShowList v-if="isShowList" @showUpdateList="showUpdateList" />
    <SpuDesc v-else :item="item" />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuDesc from "./spuDesc";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
    };
  },
  methods: {
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuDesc,
  },
};
</script>
