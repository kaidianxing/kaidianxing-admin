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
    <FormItem label="显示申请协议：" :label-width='120' prop="show_agreement" style='margin-bottom:0'>
        <MyRadioGroup :items='agreement' v-model='settings.show_agreement'></MyRadioGroup>
    </FormItem>
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
            agreement() {
                return [{
                    label: '显示',
                    id: '1'
                }, {
                    label: '隐藏',
                    id: '0'
                }].map(item => {
                    item.disabled = this.noManagePerm
                    return item
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    /deep/ .content {
        padding: 30px 20px;
    }
</style>
