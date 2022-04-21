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
    <div class="select-table-list">
        <div class="table-header">
            <table width="100%">
                <colgroup align="left">
                    <col v-for="(column, index) in columns" :key="index"
                         :width="column.width">
                </colgroup>
                <tr>
                    <th v-for="(column, index) in columns" :key="index">
                        <div class="table-cell">{{column.title}}</div>
                    </th>
                </tr>
            </table>
        </div>
        <div class="table-body">
            <table width="100%">
                <colgroup align="left">
                    <col v-for="(column, index) in columns" :key="index"
                         :width="column.width">
                </colgroup>
                <!--合并单元格-->
                <template v-if="data && data.length > 0">
                    <template v-for="(list, listIndex) in data">
                        <tr v-for="(goods,index) in list.order_goods" :key="goods.id">
                            <!--包裹-->
                            <template v-if="index === 0">
                                <td :rowspan="list.order_goods.length">
                                    <!--多选-->
                                    <template v-if="multiple">
                                        <Checkbox v-model="list.checked" @on-change="handleChange(listIndex, list)" style="margin-right: 0">
                                            包裹 {{listIndex + 1}}
                                        </Checkbox>
                                    </template>
                                    <!--单选-->
                                    <template v-else>
                                        <Radio v-model="list.checked" @on-change="handleChange(listIndex, list)" style="margin-right: 0">
                                            包裹 {{listIndex + 1}}
                                        </Radio>
                                    </template>
                                </td>
                            </template>
                            <!--商品信息-->
                            <td>
                                <div class="shop">
                                    <div class="shop-image">
                                        <img :src="$media(goods.thumb)"
                                             alt="" @error="replaceImage">
                                    </div>
                                    <div class="shop-information">
                                        <p class="title two-line-hide">
                                            {{goods.title}}
                                        </p>
                                        <div class="shop-label" v-if="goods.option_title">
                                            <span>{{goods.option_title}}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <!--商品价格、数量-->
                            <td>
                                <div class="shop-price-number">
                                    <p>X{{goods.total}}</p>
                                </div>
                            </td>
                        </tr>
                    </template>
                </template>
                <div v-else style="height: 30px;line-height: 30px;text-align: center">
                    暂无数据
                </div>
            </table>
        </div>
    </div>
</template>

<script>
  // 用于取消发货、修改物流信息
  export default {
    name: "SelectTableList",
    props: {
      data: {
        type: Array,
        default: () => [],
        required: true
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        columns: [
          {
            title: '包裹',
            key: 'checkbox',
            width: 100
          },
          {
            title: '商品',
            key: 'shop',
            width: 350
          },
          {
            title: '数量',
            key: 'number',
            width: 100
          }
        ]
      };
    },
    methods: {
      handleChange(index, row) {
        this.$emit('on-change', index, row);
      }
    }
  };
</script>

<style scoped lang="scss">
    .select-table-list {
        border: 1px solid $border-color;
        border-bottom: none;
        border-radius: 2px;
        // 表头
        > .table-header {
            height: 40px;
            /*box-sizing: border-box;*/
            border-bottom: 1px solid $border-color;
            /*margin-bottom: 20px;*/
            background-color: $background-color;

            > table {
                > tr {
                    > th {
                        > .table-cell {
                            @include font-14-20-bold;
                            color: $text-first;
                            padding: 10px 15px;
                            box-sizing: border-box;
                            text-align: left;
                        }
                    }
                }
            }
        }

        // table-body
        .table-body {
            > table {
                > tr {
                    > td {
                        @include font-14-20;
                        color: $text-first;
                        padding: 10px 15px;
                        border-bottom: 1px solid $border-color;

                        // 商品信息
                        > .shop {
                            display: flex;
                            flex-wrap: nowrap;
                            align-items: center;

                            > .shop-image {
                                width: 60px;
                                height: 60px;
                                margin-right: 10px;
                                box-sizing: border-box;
                                border: 1px solid $border-color;
                                border-radius: 2px;
                                overflow: hidden;
                                flex-shrink: 0;

                                > img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }

                            > .shop-information {
                                > .title {
                                    height: 40px;
                                }

                                > .shop-label {
                                    color: #197BE1;
                                    @include font-12-16;

                                    > span {
                                        background-color: $brand-light;
                                        border-radius: 2px;
                                        padding: 2px 8px;
                                    }
                                }
                            }
                        }

                        // 价格、数量
                        > .shop-price-number {

                        }
                    }
                }
            }
        }
    }
</style>
