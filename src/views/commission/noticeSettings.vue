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
        <kdx-content-bar>
            <div class="notice-settings">
<!--            <div style='background:#fff;height:100%;margin-top:20px;'>-->
                <Tabs v-model="value" :animated="false" name="floor1">
                    <TabPane label="卖家通知" name="style">
                        <keep-alive>
                            <Form class='container' :label-width='150'>
                                <FormItem label="申请成为分销商：" prop="category_id">
                                    <MyRadioGroup :items='open' v-model='settings.seller.apply.template.state'>
                                        <ModelList style='margin-bottom:20px;' v-model='settings.seller.apply.template.id' v-if='settings.seller.apply.template.state==1'></ModelList>
                                        <AddNoticeObject v-model='settings.seller.apply.template.member_id' type='apply' v-if='settings.seller.apply.template.state==1'></AddNoticeObject>
                                    </MyRadioGroup>
                                </FormItem>
                                <FormItem label="分销商提现：" prop="category_id">
                                    <MyRadioGroup :items='open' v-model='settings.seller.withdraw.template.state'>
                                        <ModelList style='margin-bottom:20px;' v-model='settings.seller.withdraw.template.id' v-if='settings.seller.withdraw.template.state==1'></ModelList>
                                        <AddNoticeObject v-model='settings.seller.withdraw.template.member_id' type='withdraw' v-if='settings.seller.withdraw.template.state==1'></AddNoticeObject>
                                    </MyRadioGroup>
                                </FormItem>
                            </Form>
                        </keep-alive>
                    </TabPane>
                    <TabPane label="买家通知" name="agreement">
                        <keep-alive>
                            <Form class='container' :label-width='180'>
                                <kdx-form-title content="成为分销商"></kdx-form-title>
                                <FormItem label="成为分销商通知：" prop="category_id">
                                    <MyRadioGroup v-model='settings.buyer.agent.become.template.state' :items='open'>
                                        <ModelList v-model='settings.buyer.agent.become.template.id' v-if='settings.buyer.agent.become.template.state==1'></ModelList>
                                    </MyRadioGroup>
                                </FormItem>
                                <FormItem label="新增下级通知：" prop="category_id">
                                    <MyRadioGroup v-model='settings.buyer.agent.add_child.template.state' :items='open'>
                                        <FormItem label="下级级数：" :label-width='130' prop="category_id" v-if='settings.buyer.agent.add_child.template.state==1'>
                                            <MyRadioGroup v-model='settings.buyer.agent.add_child.template.level' :items='vipLevels'></MyRadioGroup>
                                        </FormItem>
                                        <ModelList v-model='settings.buyer.agent.add_child.template.id' v-if='settings.buyer.agent.add_child.template.state==1'></ModelList>
                                    </MyRadioGroup>
                                </FormItem>
                                <kdx-form-title content="下级通知"></kdx-form-title>
                                <FormItem label="下级付款通知：" prop="category_id">
                                    <MyRadioGroup :items='open' v-model='settings.buyer.child.pay.template.state'>
                                        <FormItem label="下级级数：" :label-width='130' prop="category_id" v-if='settings.buyer.child.pay.template.state==1'>
                                            <MyRadioGroup v-model='settings.buyer.child.pay.template.level' :items='vipLevels'></MyRadioGroup>
                                        </FormItem>
                                        <ModelList v-model='settings.buyer.child.pay.template.id' v-if='settings.buyer.child.pay.template.state==1'></ModelList>
                                    </MyRadioGroup>
                                </FormItem>
                                <FormItem label="下级确认收货通知：" prop="category_id">
                                    <MyRadioGroup :items='open' v-model='settings.buyer.child.receive.template.state'>
                                        <FormItem label="下级级数：" :label-width='130' prop="category_id" v-if='settings.buyer.child.receive.template.state==1'>
                                            <MyRadioGroup v-model='settings.buyer.child.receive.template.level' :items='vipLevels'></MyRadioGroup>
                                        </FormItem>
                                        <ModelList v-model='settings.buyer.child.receive.template.id' v-if='settings.buyer.child.receive.template.state==1'></ModelList>
                                    </MyRadioGroup>
                                </FormItem>
                                <kdx-form-title content="提现通知"></kdx-form-title>
                                <FormItem label="提现申请提交通知：" prop="category_id">
                                    <MyRadioGroup v-model='settings.buyer.withdraw.apply.template.state' :items='open'>
                                        <ModelList v-model='settings.buyer.withdraw.apply.template.id' v-if='settings.buyer.withdraw.apply.template.state==1'></ModelList>
                                    </MyRadioGroup>
                                </FormItem>
                                <FormItem label="提现申请审核完成通知：" prop="category_id">
                                    <MyRadioGroup v-model='settings.buyer.withdraw.finish.template.state' :items='open'>
                                        <ModelList v-model='settings.buyer.withdraw.finish.template.id' v-if='settings.buyer.withdraw.finish.template.state==1'></ModelList>
                                    </MyRadioGroup>
                                </FormItem>
                                <kdx-form-title content="佣金通知"></kdx-form-title>
                                <FormItem label="佣金打款通知：" prop="category_id">
                                    <MyRadioGroup v-model='settings.buyer.commission.pay.template.state' :items='open'>
                                        <ModelList v-model='settings.buyer.commission.pay.template.id' v-if='settings.buyer.commission.pay.template.state==1'></ModelList>
                                    </MyRadioGroup>
                                </FormItem>
                                <FormItem label="分销商等级提升通知：" prop="category_id">
                                    <MyRadioGroup v-model='settings.buyer.commission.upgrade.template.state' :items='open'>
                                        <ModelList v-model='settings.buyer.commission.upgrade.template.id' v-if='settings.buyer.commission.upgrade.template.state==1'></ModelList>
                                    </MyRadioGroup>
                                </FormItem>
                            </Form>
                        </keep-alive>
                    </TabPane>
                </Tabs>
            </div>
            <template #btn>
                    <Button class="primary-long" @click="save">保存</Button>
                    <!-- <Button class="default-long" @click="cancel">取消</Button> -->
            </template>
        </kdx-content-bar>
</template>

<script>
    import MyRadioGroup from '@/components/decorate/RadioGroup'
    import AddNoticeObject from './noticeSettings/AddNoticeObject'
    import ModelList from './noticeSettings/ModelList'
    import {
        mapState,
        mapMutations,
        mapActions
    } from 'vuex'
    export default {
        components: {
            MyRadioGroup,
            AddNoticeObject,
            ModelList
        },
        computed: {
            ...mapState('commission/noticeSettings', {
                settings: state => state.settings,
                vipLevels: state => state.vipLevels
            }),
        },
        data() {
            return {
                value: 'style',
                open: [{
                    label: '开启',
                    id: '1'
                }, {
                    label: '关闭',
                    id: '0'
                }]
            }
        },
        methods: {
            ...mapMutations('commission/noticeSettings', []),
            ...mapActions('commission/noticeSettings', ['getSettings', 'editSettings']),
            save() {
                this.editSettings().then(res => {
                    if (res.error == 0) {
                        this.$Message.success('修改成功');
                    }
                })
            },
            cancel() {
                this.$router.go(-1)
            },
        },
        beforeMount() {
            this.getSettings();
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/components/common.scss';
    .notice-settings {
        min-height: 100%;
        background-color: #FFFFFF;
        margin-top: 20px;
    }
    .container {
        width: 100%;
        padding: 10px 30px;
        height: 100%;
    }
</style>
