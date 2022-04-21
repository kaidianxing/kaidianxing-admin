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
    <div class='condition-consumption'>
        <FormItem label="消费条件：" :label-width='120' prop="become_order_money">
            <kdx-rr-input :fixed="2" :min-value="0.01" number :max-value="9999999.99" :maxlength="10" :disabled='noManagePerm' v-model="settings.become_order_money" style='width:250px;'>
                <span slot="prepend">消费满</span>
                <span slot="append">元</span>
            </kdx-rr-input>
        </FormItem>
        <FormItem label="统计方式：" :label-width='120' prop="become_order_status" style='margin-bottom:0;'>
            <MyRadioGroup :items='type' v-model='settings.become_order_status'></MyRadioGroup>
        </FormItem>
    </div>
</template>

<script>
    import MyRadioGroup from '@/components/decorate/RadioGroup'
    import {
        mapState
    } from 'vuex'
    export default {
        components: {
            MyRadioGroup
        },
        computed: {
            ...mapState('commission/settings', {
                settings: state => state.settings,
            }),
            noManagePerm() { //管理权限
                return !this.$getPermMap('commission.settings.commission.manage')
            },
            type(){
                return [{
                    label: '订单付款后',
                    id: '1'
                }, {
                    label: '订单完成后',
                    id: '2'
                }].map(item=>{
                    item.disabled=this.noManagePerm
                    return item
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .condition-consumption {
        /deep/ .content {
            padding: 30px 20px;
        }
        /deep/ .ivu-form-item {
            .ivu-form-item-error-tip {
                padding-left: 120px;
            }
        }
    }
</style>
