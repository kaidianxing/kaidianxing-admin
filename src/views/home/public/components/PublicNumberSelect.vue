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
  <div>
    <kdx-modal-frame
      v-model="value"
      title="选择关键字"
      :width="1000"
      @on-cancel="handleCancel"
      @on-ok="handleOk"
      :loading="loading"
    >
      <template #header>
        <div class="image-selector-header">
          <div class="title">
            选择关键字
          </div>
        </div>
        <ul class="tab" v-if="0">
          <li
            @click="selectTab"
            :class="{ ac: selectTabFlg == item.keyword }"
            v-for="item in tabList"
            :key="item.keyword"
            :data-value="item.keyword"
          >
            {{ item.key }}
          </li>
        </ul>
      </template>
      <div class="image-selector-poptip-content">
        <ul class="keyword">
          <li
            :class="{ ac: ckFlg == idx }"
            v-for="(item, idx) in keyword"
            :key="item.id"
            @click="changeCond(idx, item)"
          >
            {{ item.keyword }}
          </li>
        </ul>
      </div>
    </kdx-modal-frame>
  </div>
</template>
<script>
export default {
  created() {
    this.$api.homeApi.keyWorkList({}).then((r) => {
      this.keyword = r.list;
    });
  },
  data() {
    return {
      ckFlg: -1,
      value: false,
      loading: false,
      selectTabFlg: 0,
      cond: {},
      keyword: [
        {
          id: "1",
          val: "test01",
        },
        {
          id: "2",
          val: "test02",
        },
        {
          id: "3",
          val: "test03",
        },
        {
          id: "4",
          val: "test04",
        },
        {
          id: "5",
          val: "test05",
        },
      ],
      tabList: [
        {
          key: "已发送",
          val: "0",
        },
        {
          key: "素材库",
          val: "1",
        },
        {
          key: "历史消息",
          val: "2",
        },
        {
          key: "页面模版",
          val: "3",
        },
      ],
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
    changeCond(idx, obj) {
      this.ckFlg = idx;
      this.cond = obj;
    },
    selectTab(e) {
      this.selectTabFlg = e.target.dataset.value;
    },
    close() {
      this.value = false;
      this.$emit("close", this.cond);
    },
    handleCancel() {
      this.cond = {};
      this.close();
    },
    handleOk() {
      this.close();
    },
  },
};
</script>
<style scoped lang="scss">
.tab {
  padding-top: 40px;
  display: flex;
  justify-content: space-between;
  li {
    margin-bottom: -15px;
    padding-bottom: 16px;
    cursor: pointer;
    border: 0;
    &.ac {
      color: #2d8cf0;
      border-bottom: 2px solid #2d8cf0;
      padding-bottom: 14px;
    }
  }
}
.image-selector-poptip-content {
  padding: 20px;
}
.keyword {
  display: flex;
  flex-wrap: wrap;
  li {
    margin-right: 10px;
    padding: 4px 15px;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    cursor: pointer;
    &.ac {
      color: #2d8cf0;
      border-color: 1px solid var(--theme-color);
    }
  }
}
</style>
