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
    <div class="sms-template">
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
                <kdx-hint-text>开启内购后，一级佣金获得者是自身时，自身不发送此消息，只给二佣金获得者发送消息提示</kdx-hint-text>
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
            <FormItem label="模板设置：">
                <Select v-model="model.template_id" class="width-430">
                    <Option v-for="item in template_list" :key="item.id" :value="item.id">{{item.name}}</Option>
                </Select>
                <default-template type="sms"></default-template>
            </FormItem>
        </Form>

        <vip-selector ref="VipSelector" :currentList="vipList" multiple @on-change="getVipList"></vip-selector>
    </div>
</template>

<script>
    import defaultTemplate from "./defaultTemplate";
    import VipSelector from '@/components/selector/VipSelector';

    export default {
        name: "smsTemplate",
        components: {
            defaultTemplate, VipSelector
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
            type_code: {
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
            }
        },
        data() {
            return {
                model: {
                    status: 0,
                    template_id: '',
                    commission_level: '1',
                    member_id: []
                },
                template_list: [],
                vipList: [], // 选中会员列表
                rules: {},
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
                    this.vipList = newValue?.member ?? []
                }
            },
        },
        computed: {},
        created() {
        },
        mounted() {
            this.getList()
        },
        methods: {
            getList() {
                this.$api.noticeApi.getSmsList({scene_code: this.type_code, pager: 0}).then(res => {
                    if (res.error == 0) {
                        this.template_list = res.list
                    }
                })
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
    .sms-template {
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
    }
</style>
