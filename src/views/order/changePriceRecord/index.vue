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
    <div class="change-price-record">
        <Table ref="table" v-loading="loading" :columns="columns" :data="data">
            <template #before_price = {row}>
                <span v-if="row.ext_info && row.ext_info.pay_credit">
                    <span v-if="row.ext_info.pay_credit != '0'">{{row.ext_info.pay_credit}}积分 + </span>
                    ￥{{row.before_price}}
                </span>
            </template>
            <template #after_price = {row}>
                <span v-if="row.ext_info && row.ext_info.pay_credit">
                    <span v-if="row.ext_info.pay_credit != '0'">{{row.ext_info.pay_credit}}积分 + </span>
                    ￥{{row.after_price}}
                </span>
            </template>
        </Table>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                columns: [
                    {
                        title: '变动金额',
                        key: 'change_price'
                    },
                    {
                        title: '改价前',
                        slot: 'before_price'
                    },
                    {
                        title: '改价后',
                        slot: 'after_price'
                    },
                    {
                        title: '改价时间',
                        key: 'created_at'
                    }
                ],
                data: [],
                loading: false
            };
        },
        methods: {
            getData() {
                this.loading = true;
                let id = this.$route.query.id;
                this.$api.orderApi.getChangePriceRecord({order_id: id})
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.data = res.list;
                        }
                    });
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped>
    .change-price-record {
        padding: 0 20px 20px 20px;
        background-color: #FFFFFF;
        margin-top: 20px;
    }
</style>
