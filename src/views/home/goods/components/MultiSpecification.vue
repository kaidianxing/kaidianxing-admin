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
    <kdx-modal-frame v-model="value" title="多规格商品" :width="880" @on-cancel="handleCancel" @on-ok="handleOk">
        <div class="multi-specification">
            <Table ref="table" border :columns="columns" :data="data" v-loading="loading"></Table>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "MultiSpecification",
        props: {
            id: {
                type: [Number, String]
            }
        },
        data() {
            return {
                value: false,
                columns: [
                    {
                        title: '规格',
                        key: 'title'
                    },
                    {
                        title: '销量(件)',
                        key: 'total',
                        render: (h, params) => {
                            if (params.row[params.column.key]) {
                                return (
                                    <div>{params.row[params.column.key]}</div>
                                )
                            } else {
                                return (
                                    <div>-</div>
                                )
                            }
                        }
                    },
                    {
                        title: '销售额(元)',
                        key: 'price',
                        render: (h, params) => {
                            if (params.row[params.column.key]) {
                                return (
                                    <div>{params.row[params.column.key]}</div>
                                )
                            } else {
                                return (
                                    <div>-</div>
                                )
                            }
                        }
                    }
                ],
                data: [],
                loading: false
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
                if (this.value) {
                    this.getData();
                }
            },
            getData() {
                this.loading = true;
                this.$api.homeApi.getGoodsDetail({id: this.id})
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.data = res.data || [];
                        }
                    });
            },
            handleCancel() {
                this.setValue();
            },
            handleOk() {
                this.setValue();
            }
        }
    };
</script>

<style scoped lang="scss">
    .multi-specification {
        padding: 40px;
    }
</style>
