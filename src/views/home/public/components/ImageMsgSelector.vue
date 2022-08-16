/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息
 */
<template>
  <kdx-modal-frame
    v-model="value"
    title="选择素材"
    :width="1000"
    @on-cancel="handleCancel"
    @on-ok="handleOk"
    :loading="loading"
  >
    <template #header>
      <div class="image-selector-header">
        <div class="title">
          选择素材
        </div>
        <div class="search">
          <Input
            v-model="search"
            placeholder="搜索图文消息"
            search
            enter-button="搜索"
            @on-search="handleSearch"
            class="width-250"
          />
        </div>
      </div>
    </template>

    <div class="image-selector-poptip-content">
      <div class="img_msg_wrap">
        <div>
          <div class="date">更新于 4月20日</div>
          <div class="lq">
            <img class="img" :src="imgSrc('')" />
            <div class="sub_title">描述</div>
          </div>
        </div>
      </div>

      <div class="img_msg_wrap">
        <div>
          <div class="date">更新于 4月21日</div>
          <div class="lq">
            <img class="img" :src="imgSrc('')" />
            <div class="sub_title">描述</div>
          </div>
        </div>
      </div>
    </div>
  </kdx-modal-frame>
</template>
<script>
export default {
  data() {
    return {
      search: "",
      value: false,
      loading: false,
    };
  },
  props: {
    controlDialog: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    controlDialog: {
      handler(val) {
        this.value = val;
      },
      immediate: true,
    },
  },

  methods: {
    imgSrc(image = "") {
      return image
        ? this.$utils.media(image)
        : this.$utils.staticImg("decorate/goods_col2.png");
    },
    handleSearch() {},
    close() {
      this.value = false;
      this.$emit("close");
    },
    handleCancel() {
      this.close();
    },
    handleOk() {
      this.close();
    },
  },
};
</script>
<style scoped lang="scss">
.search {
  padding-top: 28px;
  display: flex;
  justify-content: flex-end;
}
.image-selector-poptip-content {
  padding: 28px 165px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .img_msg_wrap {
    border: 1px solid #e7e7eb;
    width: 320px;
    cursor: pointer;
  }
  .date {
    margin: 0 14px;
    padding: 12px 0;
    color: #353535;
    border-bottom: 1px solid #e7e7eb;
  }
  .lq {
    padding: 12px;
    .img {
      width: 100%;
    }
    .sub_title {
      padding-top: 5px;
    }
  }
  .opt {
    text-align: center;
    cursor: pointer;
    padding: 12px 0;
  }
}
</style>
