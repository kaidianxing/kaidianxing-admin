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
    <kdx-content-bar class='rank-settings'>
        <Form ref="form" style="background:#fff;height:100%" :label-width="120" class='body'>
            <kdx-form-title content="排行榜设置"></kdx-form-title>
            <FormItem label="排行榜状态：" prop="">
                <MyRadioGroup :disabled="noManagePerm" :items='status' v-model='settings.open'>
                    <div v-if="settings.open == 1">
                        <FormItem label="排行榜类型：" :label-width='110' prop="self_buy" style='margin-bottom:20px;'>
                            <MyRadioGroup :disabled="noManagePerm" :items='type' v-model='settings.commission_type'></MyRadioGroup>
                        </FormItem>
                        <FormItem label="显示数量：" :label-width='110' prop="self_buy" style='margin-bottom:0;'>
                            <MyRadioGroup :disabled="noManagePerm" :items='num' v-model='settings.show_total'></MyRadioGroup>
                        </FormItem>
                    </div>
                </MyRadioGroup>
            </FormItem>
        </Form>
        <template #btn>
            <Button class="primary-long" @click="save">保存</Button>
            <!-- <Button class="default-long" @click="cancel">取消</Button> -->
        </template>
    </kdx-content-bar>
</template>

<script>
    import MyRadioGroup from '@/components/decorate/RadioGroup'
    import {
        mapState,
        mapActions
    } from 'vuex'
    export default {
        components: {
            MyRadioGroup
        },
        computed: {
            ...mapState('commission/rankSettings', {
                settings: state => state.settings,
            }),
            noManagePerm() { //管理权限
                return !this.$getPermMap('commission.settings.rank.manage')
            },
        },
        data() {
            return {
                status: [{
                    label: '开启',
                    id: '1'
                }, {
                    label: '关闭',
                    id: '0'
                }],
                type: [{
                    label: '按累计佣金',
                    id: '0'
                }, {
                    label: '按已提现佣金',
                    id: '1'
                }],
                num: [{
                    label: '10',
                    id: 10
                }, {
                    label: '20',
                    id: 20
                }, {
                    label: '30',
                    id: 30
                }, ]
            }
        },
        methods: {
            ...mapActions('commission/rankSettings', ['getSettings', 'editSettings']),
            save() {
                this.editSettings().then(res => {
                    if (res.error == 0) {
                        this.$Message.success('修改成功');
                    }
                })
            },
            cancel() {
                this.$router.go(-1)
            }
        },
        beforeMount() {
            this.getSettings();
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/components/common.scss';
    .body {
        padding: 40px;
    }
</style>
