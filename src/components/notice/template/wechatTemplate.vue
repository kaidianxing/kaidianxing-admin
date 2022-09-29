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
    <div class="wechat-template">
        <div class="tip">
            <kdx-hint-alert :show-icon="false">
                <div>
                    请将公众平台模板消息所在行业选择为：
                    <span class="warning-color">IT科技/互联网|电子商务 其他|其他</span>，所选行业不一致将会导致模板消息不可用
                </div>
                <div>
                    微信公众平台模板消息最多支持可添加25条
                    <!--<span class="warning-color">已添加15条，剩余10条</span>-->
                    <Button type="text" to="/notice/wxappTemplate/list" target="_blank">查看详情</Button>
                </div>
            </kdx-hint-alert>
        </div>
        <kdx-form-title>发送设置</kdx-form-title>
        <Form ref="form" :model="model" :rules="rules" :label-width="120">
            <FormItem class="r-form-item-checkbox" label="发送设置：">
                <RadioGroup v-model="model.status">
                    <Radio :label="1">开启</Radio>
                    <Radio :label="0">关闭</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem class="r-form-item-checkbox" label="发送时间：">
                <span>{{sendTime}}</span>
                <kdx-hint-text v-if="type_code==='credit_sign_notice'">系统将在该时间点为当天未进行签到的用户发送签到提醒</kdx-hint-text>
            </FormItem>
            <FormItem class="r-form-item-checkbox" label="通知等级：" v-if="isShow_level">
                <RadioGroup v-model="model.commission_level">
                    <Radio label="1">一级</Radio>
                    <Radio label="2">一级+二级</Radio>
                </RadioGroup>
                <kdx-hint-text v-if="type_code === 'commission_buyer_child_pay'">开启内购后，一级佣金获得者是自身时，自身不发送此消息，只给二佣金获得者发送消息提示</kdx-hint-text>
            </FormItem>
            <FormItem label="通知人员：" v-if="is_showNoticeMember">
                <Button class="default-primary" @click="selectVip">+添加</Button>
                <div class="vip-table" v-show="vipList.length > 0">
                    <Table :columns="columns" :data="vipList" size="small">
                        <template slot-scope="{ row }" slot="nickname">
                            <div class="vip-info">
                                <img :src="row.avatar" alt="" @error="replaceImage($event, 'avatar')"/>
                                <p class="name">
                                    <span style="margin-bottom:4px;">{{ row.nickname }}</span>
                                    <i class="iconfont" :class="{
                                        'icon-H': row.source === '10',
                                        'icon-weixin': row.source === '20',
                                        'icon-weixinxiaochengxu': row.source === '21'}"
                                        v-if="new Set(['10', '20', '21']).has(row.source)">
                                    </i>
                                    <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2" v-else-if="row.source === '30'"></kdx-svg-icon>
                                    <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban" v-else-if="row.source === '32'"></kdx-svg-icon>
                                    <kdx-svg-icon class="iconfont" type="icon-douyin" v-else-if="row.source === '31'"></kdx-svg-icon>
                                    <span style="color:#12aa9c;font-size:16px" class="iconfont icon-PCduan" v-else-if="row.source === '70'"></span>
                                </p>
                            </div>
                        </template>
                    </Table>
                </div>
            </FormItem>
            <FormItem class="r-form-item-checkbox" label="模板设置：">
                <RadioGroup v-model="model.is_default">
                    <Radio :label="1">系统默认</Radio>                    
                    <Radio :label="0" v-if="type_code !== 'credit_sign_notice' && type_code !== 'creditSign_qrcode_bind_success'">自定义模板</Radio>
                </RadioGroup>
                <default-template type="wechat" v-if="model.is_default == 1"></default-template>
                <custom-template ref="customTemplate" v-if="model.is_default == 0" v-model="model.template"></custom-template>
            </FormItem>
        </Form>

        <vip-selector ref="VipSelector" :currentList="vipList" multiple @on-change="getVipList"></vip-selector>
    </div>
</template>

<script>

    import VipSelector from '@/components/selector/VipSelector'
    import defaultTemplate from "./defaultTemplate";
    import customTemplate from "./customTemplate";

    export default {
        name: "wechatTemplate",
        components: {
            VipSelector, defaultTemplate, customTemplate
        },
        props: {
            value: {
                type: Object,
                default: () => {}
            },
            sendTime: {
                type: String,
                default: ''
            },
            is_showNoticeMember: {
                type: Boolean,
                default: false
            },
            isShow_level: {
                type: Boolean,
                default: false
            },
            type_code: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                model: {
                    status: 0,
                    is_default: 1,
                    commission_level: '1',
                    member_id: [],
                    is_send_message: '0',
                    message_num: 0,
                    is_send_line: '0',
                    line_num: 0
                },
                messageList: ["10", "20", "50", "100", "200", "500"],
                lineList: ["1", "5", "10", "20", "50"],
                vipList: [], // 选中会员列表
                columns: [
                    {
                        title: '会员',
                        slot: 'nickname',
                    },
                    {
                        key: 'option',
                        title: '操作',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            return (
                                <p class="option" style="text-align:center;">
                                    <span style="color: $brand-color;font-size: 14px;cursor:pointer;" onClick={() => {this.delete(params.index)}}>删除</span>
                                </p>
                            )
                        },
                    },
                ],
                rules: {
                    trigger: [
                        { validator: this.validateTrigger, trigger: "change" },
                    ]
                }
            }
        },
        watch: {
            model: {
                handler(newValue) {
                    this.$emit('input', newValue)
                },
                deep: true
            },
            value: {
                handler(newValue) {
                    this.model = newValue;
                    this.model.is_send_messages = newValue.is_send_message;
                    this.model.is_send_line = newValue.is_send_line;
                    this.vipList = newValue?.member ?? []
                },
                deep: true,
                immediate: true
            },
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            // 校验触发条件
            validateTrigger(rule, value, callback) {
                let res = false;
                if(!this.model.is_send_message && !this.model.is_send_line) {
                    res = true;
                }else if(!this.model.is_send_message && this.model.is_send_line) {
                    if(!this.model.line_num) {
                        res = true
                    }
                }else if(this.model.is_send_message && !this.model.is_send_line) {
                    if(!this.model.message_num) {
                        res = true
                    }
                }
                if(this.model.is_send_message && this.model.is_send_line) {
                    if(!this.model.message_num && !this.model.line_num) {
                        res = true
                    }
                }
                if (res) {
                    callback("触发条件必选");
                    return;
                }
                callback();
            },
            validate() {
                return new Promise(resolve => {
                    this.$refs['form'].validate(valid => {
                        resolve(valid);
                    });
                });
            },
            getVipList(list) {
                this.vipList = list.map((item) => {
                    return {
                        id: item.id,
                        source: item.source,
                        avatar: item.avatar,
                        nickname: item.nickname,
                    }
                });
                this.model.member_id = this.vipList.map(item => item.id);
                this.$emit('input', this.model)
            },
            delete(index) {
                this.vipList.splice(index, 1);
                this.model.member_id = this.vipList.map(item => item.id);
                this.$emit('input', this.model)
            },
            selectVip() {
                this.$refs.VipSelector.setValue()
            },
        },
    }
</script>

<style lang="scss">
    .wechat-template {
        .tip .hint-alert-component{
            .ivu-alert {
                line-height: 24px;
            }
            .ivu-btn {
                margin-left: 20px;
                margin-top: -3px;
            }
            .warning-color {
                font-size: 14px;
                font-weight: 600;
            }
        }
        .vip-table {
            width: 520px;
            margin-top: 10px;
            background-color: #ffffff;
            border: 1px solid $border-color;
            .ivu-table {
                .ivu-table-tip,
                .ivu-table-body {
                    table {
                        margin-bottom: -2px;
                    }
                }
                .ivu-table-header {
                    tr th {
                        background-color: $background-color;
                    }
                }
            }
            .vip-info {
                display: flex;
                flex-wrap: nowrap;
                img {
                    width: 46px;
                    height: 46px;
                    border: 1px solid #e9edef;
                    box-sizing: border-box;
                    border-radius: 50%;
                    margin-right: 10px;
                }
                .name {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .iconfont {
                    font-size: 20px;
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                }
                .icon-weixin {
                    color: $success-color;
                }
                .icon-weixinxiaochengxu {
                    color: #677de0;
                }
                .icon-toutiaoxiaochengxu {
                    color: #239bff;
                }

                .icon-zhifubaoxiaochengxu {
                    color: #2094e7;
                }

                .icon-baiduxiaochengxu {
                    color: #306cff;
                }

                .icon-H {
                    color: #ff6004;
                }
            }
        }
        .checkbox-item {
            margin-bottom: 20px;
        }
        .select {
            margin: 0 10px;
        }
    }
</style>