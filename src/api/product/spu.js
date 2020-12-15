import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
  获取spu分页列表
  */
  getPageList({ page, limit, category3Id }) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET",
      params: {
        category3Id
      }
    });
  },
  /*
  获取spu信息
  */
  getSpu(spuId) {
    return request({
      url: `${api_name}/getSpuById/${spuId}`,
      method: "GET"
    });
  },
  /*
  删除spu
  */
  delSpu(spuId) {
    return request({
      url: `${api_name}/deleteSpu/${spuId}`,
      method: "DELETE"
    });
  },
  /*
  添加spu
  */
  saveSpu(spu) {
    return request({
      url: `${api_name}/saveSpuInfo`,
      method: "POST",
      data: spu
    });
  },
  /*
  更新spu
  */
  updateSpu(spu) {
    return request({
      url: `${api_name}/updateSpuInfo`,
      method: "POST",
      data: spu
    });
  },
  /*
  获取所有销售属性
  */
  getSaleAttrList() {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: "GET"
    });
  },
  /*
  获取所有品牌数据
  */
  getTrademarkList() {
    return request({
      url: `${api_name}/baseTrademark/getTrademarkList`,
      method: "GET"
    });
  },
  /*
  获取图片数据
  */
  getImageList(spuId) {
    return request({
      url: `${api_name}/spuImageList/${spuId}`,
      method: "GET"
    });
  },
  /*
  获取spu属性列表
  GET /admin/product/spuSaleAttrList/{spuId}
  */
  getspuSaleAttrList(spuId) {
    return request({
      url: `${api_name}/spuSaleAttrList/${spuId}`,
      method: "GET"
    });
  }
};
