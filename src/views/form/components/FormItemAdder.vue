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
    <FormItem label="选择表单字段：">
        <Affix :offset-top="100" @on-change="change">
        <div class='form-item-adder'>
            <div class='btn' v-for="item in items" :key="item.id" @click='clickItem(item)'>
                <Button class="oper-btn" type="primary">
                    <i
                            :class="item.icon"
                            class="btn-icon"
                            v-if="!item.svg"
                    ></i>
                    <img
                            class="btn-svg"
                            :src="require(`@/assets/svg/decorateIcon/${item.svg}.svg`)"
                            alt
                            v-else
                    />
                    {{item.name}}
                    <div class="btn-shade">
                        添加字段
                    </div>
                </Button>
            </div>
        </div>
        </Affix>
    </FormItem>
</template>

<script>
    import {
        mapActions
    } from 'vuex';

    export default {
        props: {
            items: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            ...mapActions('form', ['addModal']),
            clickItem(item) {
                this.addModal(item);
            },
            change(e) {
                console.log('e', e);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .form-item-adder {
        display: flex;
        flex-wrap: wrap;
        // margin-bottom: -10px;
        margin-right: -10px;

        .btn {
            /*width: 87px;*/
            /*height: 87px;*/
            padding: 0 10px 10px 0;
            /*border: 1px solid #ccc;*/

            /deep/.ivu-btn {
                /*margin: 5px;*/
                width: 82px;
                height: 82px;
                box-sizing: border-box;
                padding: 0;
                /* global/bg */
                background: #f4f6f8;
                border-radius: 2px;
                border: none;
                position: relative;

                span {
                    font-family: PingFang SC;
                    font-style: normal;
                    font-weight: bold;
                    font-size: 14px;
                    line-height: 20px;
                    color: #636669;
                    display: flex;
                    flex-direction: column;

                    i {
                        font-size: 24px;
                        margin-bottom: 10px;
                    }
                }
                .btn-shade {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: 2px;
                    color: #FFFFFF;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    @include font-14-20-bold;
                }

                &:hover {
                    /*border: 1px solid $brand-color;*/
                    /*background: #f0faff;*/

                    /*span {*/
                    /*    color: $brand-color;*/
                    /*}*/
                    .btn-shade {
                        display: flex;
                    }
                }
            }

            .btn-svg,
            .btn-icon {
                width: 24px;
                height: 24px;
                font-size: 24px;
                text-align: center;
                line-height: 24px;
                margin: 11px auto;
                color: $brand-color;
            }
        }
    }
</style>
