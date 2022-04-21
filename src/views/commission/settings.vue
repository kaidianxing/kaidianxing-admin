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
        <div class='settings'>
            <Form ref="form" :model="settings" :rules="rules" :label-width="150">
                <div class="form-box">
                    <kdx-form-title content="分销层级选择"></kdx-form-title>
                    <FormItem label="分销层级：" prop="commission_level">
                        <div>

                        </div>
                        <MyRadioGroup :items='commission_level' v-model='settings.commission_level'
                                      @change="changeCommissionLevel">
                            <p slot='tip' class='tip primary-tip' v-if='settings.commission_level==0'>
                                分销层级关闭时，商城的分销系统为不可用状态。关闭之后不产生佣金</p>
                            <p slot='tip' class='tip' v-else>恭喜您，您的商城分销体系为 <span>{{ levelName }}</span>，默认佣金比例请到
                                <Button type="text" to="/commission/grade" target="_blank"
                                        style="font-size: 12px;line-height: 16px;vertical-align: unset">分销商等级
                                </Button>
                                进行设置
                            </p>
                        </MyRadioGroup>
                    </FormItem>
                    <FormItem label="分销内购：" prop="self_buy">
                        <MyRadioGroup :items='open' v-model='settings.self_buy' @change="changeSelfBuy">
                            <p class="tip" slot='tip' v-if='settings.self_buy==1'>
                                开启分销内购，分销商自己购买商品，享受一级佣金，上级享受二级佣金
                            </p>
                        </MyRadioGroup>
                    </FormItem>
                </div>
                <div class="form-box">
                    <kdx-form-title content="分销资格设置"></kdx-form-title>
                    <FormItem label="成为分销商条件：" prop="become_condition">
                        <MyRadioGroup :items='become_condition' :value='settings.become_condition' lazy
                                      @input='changeSettingsBecomeCondition'>
                            <p class="tip" slot='tip' v-if='settings.become_condition==0'>
                                用户注册成为商城会员即成为分销商
                            </p>
                            <div v-if='getCondition'>
                                <component :is='getCondition'></component>
                            </div>
                        </MyRadioGroup>
                    </FormItem>
                    <FormItem label="审核页面顶部图片：" prop="banner">
                        <MyAddImg class='add-img' type='image' :value='settings.banner' @change='getImg'></MyAddImg>
                        <p class='tip'>分销层级关闭时，商城的分销系统为不可用状态。关闭之后不产生佣金</p>
                    </FormItem>
                </div>
                <div class="form-box">
                    <kdx-form-title content="上下线关系设置"></kdx-form-title>
                    <FormItem label="成为下线条件：" prop="child_condition">
                        <MyRadioGroup :items='child_condition' :value='settings.child_condition' lazy
                                      @change='changeChildCondition'></MyRadioGroup>
                    </FormItem>

                    <FormItem label="下线关系保护：" v-if="settings.commission_type === 2">
                        <MyRadioGroup :items='guard_list' v-model='settings.compete_safe_type'>
                            <p class='tip' slot='tip' v-if="settings.compete_safe_type">
                                例：客户通过分销商A的分享链接/二维码进入商城成为下线，在设置保护期内绑定关系为A产生佣金，到期后如果点击其他分销商B的链接/二维码满足登录或下单付款，客户的分销关系将立即变更成为B的下线</p>
                            <p class='tip' slot='tip' v-else>
                                例:客户通过分销商A的分享链接/二维码进入商城成为下线，下单付款后为A产生佣金，如果再点击其他分销商B链接/二维码满足登录或下单付款，客户的分销关系将立即变更成为B的下线，下单付款后为B产生佣金</p>
                            <FormItem label="保护期时长：" prop="compete_safe_days" v-if="settings.compete_safe_type === 1">
                                <div class="flex">
                                    <span class="marginR-10">客户成为分销商下线后</span>
                                    <kdx-rr-input v-model="settings.compete_safe_days" class="width-172" placeholder="请输入"
                                              number :fixed="0" :min-value="1" :max-value="9999999">
                                        <span slot="append">天</span>
                                    </kdx-rr-input>
                                    <span class="marginL-10">内，点击其他分销商分享链接不会被抢客</span>
                                </div>
                            </FormItem>
                            <FormItem label="自动延续保护期：" prop="compete_delay_type" style="margin-bottom: 0;"
                                      v-if="settings.compete_safe_type === 1">
                                <RadioGroup v-model="settings.compete_delay_type">
                                    <div class="flex-column">
                                        <Radio class="check-radio" :label="1">
                                            <FormItem label="" style="margin-bottom: 0;" prop="compete_delay_one_price">
                                                <div class="flex">
                                                    <span class="marginR-10">达成单笔分销订单下单支付</span>
                                                    <kdx-rr-input v-model="settings.compete_delay_one_price"
                                                              class="width-172" placeholder="请输入" number :fixed="2"
                                                              :min-value="0.01" :max-value="9999999.99">
                                                        <span slot="append">元</span>
                                                    </kdx-rr-input>
                                                    <span class="marginL-10">，将自动延续保护期</span>
                                                </div>
                                            </FormItem>
                                        </Radio>
                                        <kdx-hint-text style="padding: 0 0 20px 20px;" content="">
                                            <p>客户在保护期内访问当前上线分销商的分享链接后下单支付满足金额的，保护期自动延长。</p>
                                            <p>
                                                举例：设置保护期30天，客户在6月10日绑定成为分销商A的下线，在6月20日点击分销商A的分享链接进入商城并下单支付满足100.00元，保护期在支付成功时自动重新计算，保护期为6月20日-7月19日</p>
                                        </kdx-hint-text>
                                        <Radio class="check-radio" :label="2">
                                            <FormItem label="" style="margin-bottom: 0;"
                                                      prop="compete_delay_total_price">
                                                <div class="flex">
                                                    <span class="marginR-10">达成累计分销订单下单支付总金额</span>
                                                    <kdx-rr-input v-model="settings.compete_delay_total_price"
                                                              class="width-172" placeholder="请输入" number :fixed="2"
                                                              :min-value="0.01" :max-value="9999999.99">
                                                        <span slot="append">元</span>
                                                    </kdx-rr-input>
                                                    <span class="marginL-10">，将自动延续保护期</span>
                                                </div>
                                            </FormItem>
                                        </Radio>
                                        <kdx-hint-text style="margin-left: -20px;margin-bottom: 20px;">
                                            客户在保护期内访问当前上线分销商的分享链接后下单支付满足金额的，保护期自动延长。
                                        </kdx-hint-text>
                                        <Radio :label="0">
                                            <span>关闭</span>
                                        </Radio>
                                    </div>
                                </RadioGroup>
                            </FormItem>
                        </MyRadioGroup>
                    </FormItem>

                </div>
                <div class="form-box">
                    <kdx-form-title content="其他设置"></kdx-form-title>
                    <FormItem label="佣金显示：" prop="internal">
                        <MyRadioGroup :items='open' v-model='settings.show_commission'>
                            <p class='tip' slot='tip'>开启分销佣金显示，会在商城首页、商品列表页、商品详情页显示用户可获得的佣金，多规格商品读取规格中价格最高的。</p>
                            <div v-if="settings.show_commission">
                                <RadioGroup v-model="settings.show_commission_level_type">
                                    <Radio :label="1">系统默认（一级佣金）</Radio>
                                    <Radio :label="2">二级佣金</Radio>
                                </RadioGroup>
                            </div>
                        </MyRadioGroup>
                    </FormItem>
                    <FormItem label="分销商等级：" prop="internal">
                        <MyRadioGroup :items='levelOpen' v-model='settings.show_commission_level'></MyRadioGroup>
                        <p class='tip'>开启后，分销商等级将会在分销首页进行展示。关闭后不展示</p>
                    </FormItem>
                </div>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :disabled='noManagePerm' @click="save">保存</Button>
            <!-- <Button class="default-long" @click="cancel">取消</Button> -->
        </template>
    </kdx-content-bar>
</template>

<script>
import MyRadioGroup from '@/components/decorate/RadioGroup'
import MyAddImg from '@/components/decorate/AddImgImg'
import {
    mapState,
    mapActions
} from 'vuex'

export default {
    components: {
        MyRadioGroup,
        MyAddImg,
        BuyGoods: () =>
            import ('./settings/BuyGoods'),
        Consumption: () =>
            import ('./settings/Consumption'),
        OrderNum: () =>
            import ('./settings/OrderNum'),
        // Agreement: () =>
        //     import ('./settings/Agreement'),
    },
    data() {
        return {

            rules: {
                banner: [
                    {required: true, message: '审核图片必填'}
                ],
                become_order_money: [
                    {required: true, message: '消费条件必填'}
                ],
                become_order_status: [
                    {required: true, message: '统计方式必填'}
                ],
                become_order_count: [
                    {required: true, message: '消费条件必填'}
                ],
                show_agreement: [
                    {required: true, message: '显示申请协议必填'}
                ],
                compete_safe_days: [
                    {required: true, message: '天数必填'}
                ],
                compete_delay_one_price: [
                    {
                        validator: (rule, value, callback) => {
                            if (this.settings.compete_delay_type === 1 && !value) {
                                callback(new Error(' '));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                compete_delay_total_price: [
                    {
                        validator: (rule, value, callback) => {
                            if (this.settings.compete_delay_type === 2 && !value) {
                                callback(new Error(' '));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
            }
        }
    },
    computed: {
        ...mapState('commission/settings', {
            settings: state => state.settings,
            lastLevel: state => state.lastLevel
        }),
        commission_level() {
            return [{
                label: '关闭',
                id: 0
            }, {
                label: '一级分销',
                id: 1
            }, {
                label: '二级分销',
                id: 2
            }].map(item => {
                item.disabled = this.noManagePerm
                return item
            })
        },
        noManagePerm() { //管理权限
            return !this.$getPermMap('commission.settings.commission.manage')
        },
        levelName() {
            return this.commission_level[this.settings.commission_level].label
        },
        getCondition() {
            let conditions = ['', 'BuyGoods', 'Consumption', 'OrderNum', 'Agreement']
            return conditions[this.settings.become_condition]
        },
        open() {
            return [{
                label: '开启',
                id: 1
            }, {
                label: '关闭',
                id: 0
            }].map(item => {
                item.disabled = this.settings.commission_level == 0 || this.noManagePerm
                return item
            })
        },
        levelOpen() {
            return [{
                label: '开启',
                id: 1
            }, {
                label: '关闭',
                id: 0
            }].map(item => {
                item.disabled = this.settings.commission_level == 0 || this.noManagePerm
                return item
            })
        },
        become_condition() {
            return [{
                label: '无条件',
                id: 0
            }, {
                label: '购买商品',
                id: 1
            }, {
                label: '消费金额',
                id: 2
            }, {
                label: '支付订单数量',
                id: 3
            }].map(item => {
                item.disabled = this.settings.commission_level == 0 || this.noManagePerm
                return item
            })
        },
        child_condition() {
            return [{
                label: '首次点击分享链接并登录',
                id: 1
            }, {
                label: '首次付款',
                id: 2
            }].map(item => {
                item.disabled = this.settings.commission_level == 0 || this.noManagePerm
                return item
            })
        },
        guard_list() {
            return [
                {
                    label: '无保护期',
                    id: 0
                },
                {
                    label: '自定义保护期',
                    id: 1
                },
            ]
        }
    },
    created() {
        this.getSettings();
    },
    methods: {
        ...mapActions('commission/settings', ['getSettings', 'editSettings']),
        changeSettingsBecomeCondition(val) {
            if (this.settings.child_condition == 2 && val == 0) {
                this.$Modal.info({
                    title: '提示',
                    content: '成为下线条件选择了首次付款,成为分销商条件不能选择无条件'
                })
            } else {
                this.settings.become_condition = val;
            }
        },
        changeChildCondition(val) {
            if (this.settings.become_condition == 0 && val == 2) {
                this.$Modal.info({
                    title: '提示',
                    content: '成为下线条件选择了首次付款,成为分销商条件不能选择无条件'
                })
            } else {
                this.settings.child_condition = val
            }
        },
        getImg(val) {
            this.settings.banner = val;
        },
        save() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.editSettings().then(res => {
                        if (res.error == 0) {
                            this.$Message.success('修改成功');
                            this.$store.dispatch('config/getCommissionSetting')
                        }
                    })
                }
            })
        },
        cancel() {
            this.$router.go(-1)
        },
        changeCommissionLevel() {
            let title;
            if (this.settings.commission_level == 0) {
                title = '是否关闭分销体系'
            } else if (this.settings.commission_level == 1) {
                title = '是否把分销体系设为一级分销';
            } else if (this.settings.commission_level == 2) {
                title = '是否把分销体系设为二级分销';
            }
            this.$Modal.confirm({
                title,
                render: () => {
                    return (
                        <div style="color: #939799">
                            默认佣金比例请到 <Button type="text" onClick={() => {
                            this.$utils.openNewWindowPage('/commission/grade')
                        }} style="lin-height: 20px;vertical-align: inherit">【分销商等级】</Button>进行设置
                        </div>
                    )
                },
                onOk: () => {
                    this.$store.commit('commission/settings/setLastLevel', this.settings.commission_level);
                },
                onCancel: () => {
                    this.settings.commission_level = this.lastLevel;
                }
            })
        },
        changeSelfBuy() {
            if (this.settings.self_buy == '1') {
                this.$Modal.confirm({
                    title: '开启内购',
                    render: () => {
                        return (
                            <div style="line-height: 16px; color: #939799">
                                开启分销内购后，分销商自己购买商品，享受一级佣金，上级享受二级佣金
                            </div>
                        )
                    },
                    onOk: () => {
                        this.settings.self_buy = '1';
                    },
                    onCancel: () => {
                        this.settings.self_buy = '0';
                    }
                })
            }
        },
        changeType() {
            this.$Modal.confirm({
                title: '分销模式变更',
                render: () => {
                    return (
                        <div
                            style="line-height: 16px; color: #939799">切换分销模式将立即变更分销关系为{this.type === 1 ? '保护期' : '永久有效'}确认切换？</div>
                    )
                },
                onOk: () => {
                    this.type = 1
                },
                onCancel: () => {
                    this.type = 0
                }
            })
        },
        goMoney() {
            this.$router.push({
                path: '/plugins/center/index'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/components/common.scss';

.settings {
    box-sizing: border-box;
    overflow: auto;
    padding: 40px 40px 0;
    margin: 0 auto;
    background: #fff;

    .form-box {
        padding-bottom: 30px;
    }

    /deep/ .ivu-table-cell {
        padding: 10px 15px;
    }

    /deep/ .good-info {
        display: flex;
        flex-wrap: nowrap;

        img {
            width: 60px;
            height: 60px;
            border: 1px solid #E9EDEF;
            box-sizing: border-box;
            border-radius: 2px;
            flex-shrink: 0;
            margin-right: 10px;
        }

        p {
            width: 0;
            flex: 1;
            text-align: left;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 20px;
            color: #262B30;
            height: fit-content;
            margin: auto 0;
        }
    }

    /deep/ .add-img-img {
        width: 100px;
        height: 100px;

        .img-img-box,
        img {
            width: 100px;
            height: 100px;
        }
    }

    .check-radio {
        display: flex;
        align-items: center;

        /deep/ .ivu-form-item-error-tip {
            margin-left: 220px;
        }

        &:first-child {
            /deep/ .ivu-form-item-error-tip {
                margin-left: 180px;
            }
        }
    }

    .multi-select {
        /deep/ .ivu-radio {
            display: none;
        }

        /deep/ .ivu-radio-group {
            display: flex;
            align-items: center;
        }

        .ivu-radio-group-item {
            position: relative;
            box-sizing: border-box;
            padding-left: 0;
            padding-right: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 160px;
            height: 60px;
            font-size: 14px;
            line-height: 20px;
            border-radius: 2px;
            margin-right: 10px;

            &:last-child {
                margin-right: 0;
            }

            .tit {
                font-size: 14px;
                line-height: 20px;
                font-weight: bold;
                color: #262b30;
            }

            .desc {
                font-size: 12px;
                line-height: 16px;
                color: #636669;
                margin-top: 2px;
            }

            .icon {
                position: absolute;
                font-size: 24px;
                bottom: -2px;
                right: 0;
                color: $brand-color;
                display: none;
            }
        }

        .ivu-radio-wrapper-disabled {
            background-color: $background-color;
        }

        .ivu-radio-wrapper-checked {
            background-color: #fff;
            border-width: 2px;
            border-color: $brand-color;

            .tit {
                color: $brand-color;
            }

            .icon {
                display: inline-block;
            }
        }

        .permModel {
            display: none;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 20px;
            background: #F4F6F8;
            cursor: pointer;

            &.is_perModel {
                display: flex;
            }

            p {
                font-size: 12px;
                color: #939799;
                line-height: 20px;
                text-align: center;
                display: flex;
                justify-content: center;

                .iconfont {
                    font-size: 12px;
                    color: #939799;
                    line-height: 20px;
                }

                &:hover {
                    color: #2D8CF0;

                    .iconfont:hover {
                        color: #2D8CF0;
                    }
                }
            }
        }
    }

    .error-165 {
        /deep/ .ivu-form-item-error-tip {
            margin-left: 165px;
        }
    }
}
</style>
