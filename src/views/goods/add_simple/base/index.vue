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
    <div class="good-add-base">
        <Form ref="form" :model="goodAddEditModel" :rules="$store.state.goodAddEdit.rules" :label-width="120">
            <!--商品类型-->
            <goods-type />
            <!--基本类型-->
            <basic-info></basic-info>
            <!--交易设置-->
            <transaction-settings></transaction-settings>
            <!--运费设置-->
            <!-- <freight-settings></freight-settings> -->
            <!--物流设置-->
            <logistics-settings />
            <!--商品状态-->
            <commodity-status></commodity-status>
        </Form>
        <!--商品标签选择器-->
        <shop-label-selector v-model="shopLabel.value" :current-list="shopLabel.data" @on-change="shopLabelChange" @on-cancel="shopLabelCancel"></shop-label-selector>
    </div>
</template>

<script>
    import ShopLabelSelector from "./components/ShopLabel";
    import BasicInfo from './components/BasicInfo';
    import GoodsType from './components/GoodsType';
    import TransactionSettings from './components/TransactionSettings';
    import LogisticsSettings from './components/LogisticsSettings';
    import CommodityStatus from './components/CommodityStatus';

    import {
        stateMap
    } from './components/binders.js';

    export default {
        name: "index",
        components: {
            ShopLabelSelector,
            GoodsType,
            BasicInfo,
            TransactionSettings,
            LogisticsSettings,
            CommodityStatus,

        },
        props: {
            curTab: {
                type: [String, Number],
                default: ''
            }
        },
        computed: {
            ...stateMap('shopLabel'),
            goodAddEditModel() {
                return this.$store.state.goodAddEdit.model
            },
        },
        methods: {
            shopLabelChange(list) {
                this.shopLabel = {
                    ...this.shopLabel,
                    data: list
                };
                this.$store.state.goodAddEdit.model.label_id = list.map(item => item.id);
                this.shopLabelCancel();
            },
            shopLabelCancel() {
                this.shopLabel = {
                    ...this.shopLabel,
                    value: false
                };
            },
            validate() {
                return new Promise(resolve => {
                    this.$refs['form'].validate(valid => {
                        resolve(valid);
                    });
                });
            }
        },
        mounted() {
            // this.$refs['form'].resetFields();
        },
        beforeDestroy() {
            this.$store.commit('goodAddEdit/multiOptions/init');//清理多规格缓存
        }
    };
</script>

<style scoped lang="scss">
    .good-add-base {
        // 问号提示框
        /deep/ .iconicon-test {
            vertical-align: -1px;
        }
        /deep/ .ivu-form {
            padding: 0 40px;
            .level {
                padding-bottom: 30px;
                /deep/ .ivu-form-item {
                    margin-bottom: 30px;
                }
            }
            .nest-box {
                padding: 30px 20px;
                margin-top: 10px;
                background-color: $background-color;
                .single-one {
                    display: flex;
                    flex-wrap: wrap;
                    /deep/ .ivu-form-item {
                        display: flex !important;
                    }
                }
            }
            // 库存设置
            .inventory-settings {
                padding-bottom: 20px;
                .hint-text {
                    padding-left: 25px;
                }
                .icon-line-right {
                    color: $brand-color;
                    font-size: 12px;
                }
            }
            // 运费设置
            .freight-setting {
                .ivu-btn-text {
                    padding-left: 20px;
                    font-size: 12px;
                }
                .ivu-form-item {
                    margin-bottom: 0;
                }
                // 规则提示
                .ivu-form-item-error-tip {
                    position: inherit;
                }
            }
        }
        /deep/ .collapse-panel {
            .ivu-collapse-header {
                display: inline-block;
            }
        }
    }
</style>
