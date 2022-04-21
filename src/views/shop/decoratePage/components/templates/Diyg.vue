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
  <div class="diyg-titleBox" v-if="componentData && componentData.id == 'diyg'">
    <div class="diyg-titleBox__title" :style="{
      'background': componentData.style.background
    }">
      <div class="diyg-titleBox__left" :style="{
        'text-align':componentData.style.textalign
      }">
        <h4>{{ componentData.params.title || "" }}</h4>
      </div>
      <div class="diyg-titleBox__right flexC">
        <span>{{ componentData.params.subtitle || "" }}</span>
        <i
          class="_i"
          :class="componentData.params.righticon"
          :style="{ color: componentData.style.righticoncolor }"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./mixin.js";
// let throttleImgLoad = null;
export default {
  mixins: [mixin],
  name: "diyg",
  data() {
    return {
      imgs: {},
      loading: {},
      preloading: true,
      preloadingText: true,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./decorate.scss";
@import "../templates-shim/goods.scss";
.flexC {
  display: flex;
  align-items: center;
}
.diyg-titleBox {
  padding: 0 px2rpx(12);
  height: px2rpx(50);
  display: flex;
  align-items: center;
  justify-content: space-between;
  &__ {
    &title {
      padding: 0 px2rpx(12);
      background: #ffffff;
      border-radius: px2rpx(5);
      height: px2rpx(46);
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &left {
      text-align: left;
      flex: 1;
    }
    &right {
      position: absolute;
      right: px2rpx(16);
    }
  }
}
.goods {
  width: 100%;
  overflow: auto;
  padding: px2rpx(8) px2rpx(12) 0;
  -webkit-overflow-scrolling: touch;
  background-size: cover !important;

  i {
    font-style: normal;
  }
  .goods-list {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    min-width: 100%;
    box-sizing: border-box;
    padding-left: 0;
    .good-box {
      flex-shrink: 0;
      overflow: hidden;

      &.scroll-box {
        &:first-child {
          padding-left: 0;
        }
      }

      &-item {
        overflow: hidden;
      }
      .good-img {
        display: block;
        width: 100%;
        &.loading {
          display: block;
          height: 0;
          opacity: 0;
        }
      }
      .good-img-box {
        position: relative;
        overflow: hidden;
        &.soldOut {
          position: relative;
          &::after {
            position: absolute;
            content: "";
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.36);
          }
        }
      }
      .img-box {
        overflow: hidden;
        position: relative;
        .marker {
          position: absolute;
          z-index: 100;
          &.system {
            left: 0;
            top: 0;
            color: #ffffff;
            font-size: rpx(24);
            text-align: center;
            display: flex;
            flex-direction: column;
            text-align: center; // width: px2rpx(36);
            height: px2rpx(19);
            display: flex;
            padding: 0 px2rpx(6);
            .icon {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
            .bgImgSpan {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              display: flex;
              justify-content: space-between;
              .bgImgAft {
                height: 100%;
              }
            }
            .name {
              position: relative;
              z-index: 10;
              display: block;
              font-size: px2rpx(12);
              line-height: px2rpx(12);
              height: px2rpx(12);
              margin: auto;
              white-space: nowrap;
              text-align: center;
            }
            &.circle {
              .bgImgSpan {
                background: #367bf5;
                border-bottom-right-radius: px2rpx(9);
              }
            }
            &.rectangle {
              .bgImgSpan {
                .bgImgPre {
                  height: px2rpx(19);
                  width: 0;
                  flex: 1;
                  background: #367bf5;
                }
                .bgImgAft {
                  width: px2rpx(7);
                  height: px2rpx(19);
                  flex-shrink: 0;
                  background-size: px2rpx(36) px2rpx(19);
                  background-position: px2rpx(-29) 0;
                  background-repeat: no-repeat;
                }
              }
            }
            &.triangle {
              .bgImgSpan {
                .bgImgPre {
                  height: px2rpx(19);
                  width: 0;
                  flex: 1;
                  background: #09c15f;
                }
                .bgImgAft {
                  width: px2rpx(7);
                  height: px2rpx(19);
                  flex-shrink: 0;
                  background-size: px2rpx(36) px2rpx(19);
                  background-position: px2rpx(-29) 0;
                  background-repeat: no-repeat;
                }
              }
            }
            &.echelon {
              background: linear-gradient(to right, #ff7e24, #fcd10e);
              border-bottom-right-radius: px2rpx(10);
              border-top-right-radius: px2rpx(10);
              border-bottom-left-radius: px2rpx(2);
            }
            &.square {
              // width: px2rpx(28);
              height: px2rpx(33);
              .name {
                padding-bottom: px2rpx(4);
              }
              .bgImgSpan {
                background: #ff3c29;
                border-bottom-right-radius: px2rpx(17);
                border-bottom-left-radius: px2rpx(17);
                border-top-right-radius: px2rpx(2);
              }
            }
            &.istime {
              // width: px2rpx(50);
              .name {
                padding-right: px2rpx(4);
              }
            }
            &.bigsale {
              .name {
                padding-right: px2rpx(4);
              }
            }
            &.istime.square {
              // width: px2rpx(44);
              .name {
                padding-right: 0;
              }
            }
          }
          &.custom {
            position: absolute;
            z-index: 100;
            width: 100%;
            &.top {
              top: 0 !important;
            }
            &.right {
              right: 0 !important;
            }
            &.bottom {
              bottom: 0 !important;
            }
            &.left {
              left: 0 !important;
            }
          }
        } // 售磬图标
        .soldout,
        .soldOutIcon {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%; // bottom: 0; // 内置
          z-index: 10;
          color: #fff;
        }

        .soldout {
          background: rgba(0, 0, 0, 0.5);
          height: 100%;

          &-img {
            position: absolute;
            width: 100%;
            height: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
          }
        }
        .soldOutIcon {
          width: px2rpx(100);
          height: px2rpx(100);
          line-height: px2rpx(100);
          text-align: center;
          font-size: px2rpx(86);
          z-index: 100;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .title {
        width: 100%;
        box-sizing: border-box;
        color: $uni-text-color;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: px2rpx(14);
        line-height: px2rpx(20);
        max-height: px2rpx(40);
        padding: 0 px2rpx(8);
        margin: px2rpx(8) 0 px2rpx(4);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all;
      }
      .price {
        .del-price {
          display: flex;
          align-items: center;
          height: px2rpx(14);
          line-height: px2rpx(14);
          .del-num {
            text-decoration: line-through;
          }
          .del-icon,
          .del-num {
            display: inline-block;
            color: inherit;
            font-size: px2rpx(10);
            height: px2rpx(14);
            line-height: px2rpx(14);
          }
        }
        .pro-price {
          box-sizing: border-box;
          font-size: px2rpx(12);
          line-height: px2rpx(17);
          i,
          ._i {
            font-size: px2rpx(14);
            height: px2rpx(24);
            line-height: px2rpx(24);
            text-overflow: ellipsis;
            box-sizing: border-box;
            white-space: nowrap;
            overflow: hidden;
            font-style: normal;
            font-weight: bold;
          }
        }
      }
      .btn {
        display: flex;
        flex-direction: column;
        margin: 0;
        justify-content: flex-end;
        .buybtn {
          font-size: px2rpx(24);
          height: px2rpx(24);
          line-height: px2rpx(24);
          text-align: right;
        }
        .sales-num {
          height: px2rpx(14);
          font-size: px2rpx(10);
          line-height: px2rpx(14);
          /* 商品组color/96 */
          color: $uni-text-color-grey;
          text-align: right;
        }
      }
      .box-bottom,
      .right-bottom {
        width: 100%;
        display: flex;
        box-sizing: border-box;
        .price {
          display: flex;
          flex-direction: column;
        }
      }
    }
    &.block {
      // 普通模式
      .good-box {
        &-item {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .good-img {
          min-height: 100%;
          &.loading {
            display: block;
            height: 0;
            opacity: 0;
          }
        }
        .box-bottom {
          padding: 0 px2rpx(8) px2rpx(8);
          justify-content: space-between;
          .pro-price,
          .buybtn {
            height: px2rpx(24);
          }
          .del-price,
          .sales-num {
            margin-top: px2rpx(4);
          }
          .pro-price {
            line-height: px2rpx(24);
          }
        }
      }

      //双列
      &.two {
        .good-box {
          width: 50%;

          &:nth-child(odd) {
            padding-right: px2rpx(4);
          }

          &:nth-child(even) {
            padding-left: px2rpx(4);
          }

          &:nth-child(n + 3) {
            margin: px2rpx(8) 0 0;
          }
          .pro-price {
            min-height: px2rpx(24);
            height: auto;
          }
        }

        .good-img-box {
          height: px2rpx(172);

          .good-img {
            height: px2rpx(172);
          }
        }
      }

      &.one {
        // 单列显示
        .good-box {
          width: 100%;

          &:nth-child(n + 2) {
            margin-top: px2rpx(8);
          }

          .good-box-item {
            padding-bottom: px2rpx(8);
          }
          .good-img-box {
            height: px2rpx(161);
          }
          .box-bottom {
            padding: 0 px2rpx(8) 0;
          }
          .price,
          .btn {
            flex-direction: row;
            align-items: center;
          }
          .pro-price,
          .buybtn {
            margin-bottom: px2rpx(0);
          }
          .price {
            .pro-price {
              margin-right: px2rpx(8);
            }
            .del-price {
              margin-top: 0;
              height: px2rpx(24);
              line-height: px2rpx(24);
              .del-icon,
              .del-num {
                font-size: px2rpx(10);
                height: px2rpx(24);
                line-height: px2rpx(24);
              }
            }
          }
          .btn {
            .sales-num {
              margin-top: 0;
              margin-right: px2rpx(4);
              height: px2rpx(24);
              line-height: px2rpx(24);
            }
            .buybtn {
              order: 2;
            }
          }
        }
      }

      &.three {
        // 3列显示
        .title {
          font-size: px2rpx(12);
          line-height: px2rpx(17);
          max-height: px2rpx(34);
        }
        .good-box {
          width: 33.33%;

          &:nth-child(3n-2),
          &:nth-child(3n-1) {
            padding-right: px2rpx(4);
          }
          &:nth-child(3n-1),
          &:nth-child(3n) {
            padding-left: px2rpx(4);
          }

          &:nth-child(3) {
            margin: 0 0 0;
          }
          &:nth-child(n + 4) {
            margin: px2rpx(8) 0 0;
          }
          .good-img-box {
            height: px2rpx(112);
            margin-bottom: px2rpx(8);
            .soldOutIcon {
              font-size: px2rpx(80);
            }
          }
          .price,
          .btn {
            height: px2rpx(24);
          }
          .pro-price {
            i {
              font-size: px2rpx(12);
            }
          }
          .pro-price,
          .btn {
            margin-bottom: 0;
          }
          .sales-num,
          .del-price {
            display: none;
          }
        }
      }
    }
    &.list {
      // 列表模式
      flex-direction: column;
      padding: 0;
      margin: 0 auto;
      .good-box {
        border-radius: 0;
        width: 100%;
        margin: 0 auto;
        flex-direction: row;
        padding: px2rpx(8) px2rpx(12) 0;
        &:last-child {
          .right {
            &.van-hairline--bottom:after {
              border-width: 0;
            }
          }
        }

        &-item {
          display: flex;
        }
        .img-box {
          width: rpx(180);
          height: rpx(180);
          flex-shrink: 0;
          margin-right: px2rpx(8);
          .good-img-box {
            height: 100%;
            display: block;
            border-radius: px2rpx(6);
            .good-img {
              width: 100%;
              height: 100%;
              &.loading {
                display: block;
                height: 0;
                opacity: 0;
              }
            }
          }
        }
        .right {
          height: px2rpx(108);
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-bottom: px2rpx(8);
          box-sizing: content-box;
          overflow: hidden;
          &.van-hairline--bottom:after {
            border-bottom-color: $uni-border-color;
            border-style: solid;
          }
          .title {
            margin-top: 0;
            padding: 0;
            max-height: px2rpx(34);
            line-height: px2rpx(17);
            font-size: px2rpx(12);
          }

          .subtitle {
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: $uni-text-color-grey;
            padding: 0;
            margin-bottom: px2rpx(11);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            box-sizing: border-box;
          }
          .right-bottom {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            margin-bottom: 0;
            .pro-price {
              height: px2rpx(22);
              i {
                font-size: px2rpx(16);
              }
            }
            .pro-price.price-end,
            .btn.btn-end {
              justify-content: flex-end;
            }
            .btn .sales-num {
              margin-top: px2rpx(2);
            }
          }
        }
      }
    }
    &.scroll {
      flex-direction: row !important;
      flex-wrap: nowrap;

      .good-box {
        padding-left: px2rpx(8);

        &-item {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .good-img-box {
          height: px2rpx(156);
          overflow: hidden;

          .good-img {
            min-height: 100%;
          }
        }
        .box-bottom {
          padding: 0 px2rpx(8) px2rpx(8);
          justify-content: space-between;
          .del-price,
          .sales-num {
            margin-top: px2rpx(4);
          }
          .pro-price {
            height: px2rpx(24);
          }
        }
      }

      &.two {
        .good-box-item {
          width: px2rpx(156);
        }
      }
      &.one {
        flex-direction: column;
        .good-box {
          width: px2rpx(296);
          .good-img-box {
            overflow: hidden;
            width: 100%;
            height: px2rpx(138);
          }
          .soldout-img {
            width: 100%;
          }
        }
      }
      &.three {
        // 3列显示
        justify-content: flex-start;
        .good-box {
          .good-box-item {
            width: px2rpx(102);
          }
          .good-img-box {
            width: 100%;
            height: px2rpx(102);
            margin-bottom: px2rpx(8);
            .soldOutIcon {
              font-size: px2rpx(80);
            }
          }
          .title {
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            max-height: px2rpx(34);
          }
          .pro-price {
            i {
              font-size: px2rpx(12);
            }
          }
          .del-price,
          .sales-num {
            display: none;
          }
        }
      }
    } // 双列
  }
  .commision-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: px2rpx(21);
    background: linear-gradient(171.66deg, #ff3c29 0%, #ff6f29 94.38%);
  }

  .commision-box {
    position: absolute;
    left: 0;
    bottom: 0;
    height: px2rpx(21);
    width: 100%;
    overflow: hidden;

    &.style2 {
      width: fit-content;
      border-radius: 0;

      .commision-bg {
        border-top-right-radius: px2rpx(2);
      }
    }
  }

  .commision-money {
    position: relative;
    padding: 0 px2rpx(4);
    font-size: px2rpx(10);
    line-height: px2rpx(21);
    text-align: center;
    color: #fff;
    z-index: 1000;
  }
}
</style>
