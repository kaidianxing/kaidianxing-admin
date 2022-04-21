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
    title="查看物流"
    :width="700"
    v-model="value"
    @on-cancel="handleCancel"
    @on-ok="handleOk"
  >
    <div class="order-list-package-express">
      <ul v-if="data && data.length > 0">
        <!--头部-->
        <li class="header">
          <div class="time">时间</div>
          <div class="schedule">地址和跟踪进度</div>
        </li>
        <!--快递信息-->
        <template>
          <li
            v-for="(item, index) in data"
            :key="index"
            :class="index === 0 ? 'active' : 'disabled'"
          >
            <div class="time">{{item.date_time}}</div>
            <div class="schedule">{{item.step}}</div>
            <div class="line" v-if="index !== data.length-1"></div>
            <!--图标-->
            <!--完成图标 状态标识码 0 => '在途',1 => '揽件', 2 => '疑难', 3 => '签收', 4 => '退签', 5 => '派件', 6 => '退回',	-->
            <Icon v-if="status==='3' && index === 0" type="ios-checkmark-circle" class="icon" />
            <!--开始图标-->
            <Icon
              v-else-if="(status !=='3'&&index===0)||index===data.length-1"
              type="ios-trophy"
              slot="dot"
              class="icon"
            ></Icon>
            <!--中间图标-->
            <Icon v-else type="ios-arrow-dropup" class="icon" />
          </li>
        </template>
      </ul>
      <div v-else style="text-align: center">暂无物流信息</div>
    </div>
  </kdx-modal-frame>
</template>

<script>
export default {
  name: 'index',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    sn: {
      type: String
    },
    code: {
      type: String
    }
  },
  data() {
    return {
      value: false,
      data: [],
      status: ''
    }
  },
  methods: {
    setValue() {
      this.value = !this.value
      if (this.value) {
        this.getData()
      }
    },
    getData() {
      this.$api.orderApi
        .queryExpress({
          order_id: this.id,
          express_sn: this.sn,
          express_code: this.code
        })
        .then(res => {
          if (res.error === 0) {
            this.data = res.data.data
            this.status = res.data.status
          }
        })
    },
    handleCancel() {
      this.setValue()
    },
    handleOk() {
      this.setValue()
    }
  }
}
</script>

<style scoped lang="scss">
.order-list-package-express {
  padding: 20px;

  > ul {
    > li {
      display: flex;
      flex-wrap: nowrap;
      position: relative;
      padding-bottom: 20px;

      > .time {
        width: 100px;
        box-sizing: border-box;
        padding-right: 20px;
        flex-shrink: 0;
        @include font-12-16;
      }

      > .schedule {
        width: 100%;
        padding-left: 20px;
        box-sizing: border-box;
        @include font-14-20;
        word-break: break-all;
      }

      > .line {
        position: absolute;
        left: 100px;
        top: 0;
        height: 100%;
        width: 1px;
        background-color: $border-color;
      }

      // 图标
      .icon {
        position: absolute;
        left: 100px;
        top: 0;
        transform: translateX(-50%);
        font-size: 20px;
      }
    }

    > .header {
      padding-bottom: 10px;

      .time,
      .schedule {
        @include font-14-20;
      }
    }

    // 选中
    > .active {
      color: $brand-color;
    }

    > .disabled {
      color: $text-third;
    }
  }
}
</style>
