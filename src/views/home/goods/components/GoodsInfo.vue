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
    <div class="data-goods-info-header" v-loading="loading">
        <header-title title="商品信息" :text="updateTimeText" :max-width="340">
            <template #right>
                <DatePicker v-model="date" type="date" :options="dateOptions" confirm split-panels placeholder="时间"
                            :clearable="false" @on-change="changeDate" @on-ok="okDate" class="width-250"></DatePicker>
            </template>
            <template #tooltip>
                <Form :label-width="115">
                    <FormItem label="被浏览商品数量/件：">
                        统计时间内，商品详情页浏览次数大于0的商品数
                    </FormItem>
                    <FormItem label="加购商品数量/件：">
                        统计时间内，成功添加至购物车的商品件数。
                    </FormItem>
                    <FormItem label="购买商品数量/件：">
                        统计时间内，成功付款的商品件数之和（包含退款订单）
                    </FormItem>
                </Form>
            </template>
        </header-title>
        <Row>
            <Col span="8">
                <card-panel type="warning" icon="icon-fenxiao-leijiyongjin-" title="被浏览商品数量(件)">
                    {{data.goods_pv_count || '0'}}
                </card-panel>
            </Col>
            <Col span="8">
                <card-panel type="warning" icon="icon-shuju-jiagou" title="加购商品数量(件)">
                    {{data.cart_goods_count || '0'}}
                </card-panel>
            </Col>
            <Col span="8">
                <card-panel type="warning" icon="icon-shuju-shouchu" title="购买商品数量(件)">
                    {{data.pay_goods_count || '0'}}
                </card-panel>
            </Col>
        </Row>
    </div>
</template>

<script>
    import HeaderTitle from "../../compnents/HeaderTitle";
    import CardPanel from "../../compnents/CardPanel";
    import {formatDate} from '@/assets/helpers';

    export default {
        name: "SearchHeader",
        components: {HeaderTitle, CardPanel},
        props: {
            data: {
                type: Object,
                default: () => {
                }
            },
            loading: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                date: formatDate(new Date(new Date() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
                dateOptions: {
                    disabledDate(date) {
                        return date.valueOf() > Date.now() - 24 * 60 * 60 * 1000;
                    }
                }
            };
        },
        computed: {
            updateTimeText() {
                return this.$store.state.config?.data?.updateTimeText;
            }
        },
        methods: {
            changeDate(date) {
                this.date = date;
            },
          okDate() {
            this.$emit('on-date-change', this.date);
          },
        }
    };
</script>

<style scoped lang="scss">
    .data-goods-info-header {
        background-color: #ffffff;
        padding: 30px 40px;
        position: relative;

        .data-header-title {
            padding-bottom: 30px;
        }

        .ivu-row {
            margin-left: -10px;
            margin-right: -10px;

            .data-card-panel {
                padding: 0 10px;
            }
        }
    }
</style>
