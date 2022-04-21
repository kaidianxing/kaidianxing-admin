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
    <kdx-content-bar v-loading="loading">
        <div class="notice-title">
            <img src="@/assets/image/notice/bg.png" alt="">
            <div class="notice-title-content flex">
                <i class="iconfont" :class="icon"></i>
                <span>{{ tempTitle }}</span>
            </div>
        </div>
        <div class="notice-buyer-edit" v-if="type_code">
            <Tabs v-model="tabPoint" :animated="false" @on-click="changeTab">
                <TabPane label="微信公众号模板消息" name="wechat" v-if="items.includes('wechat')">
                    <div style="padding-left: 40px;">
                        <wechat-template ref="wechatTemplate"
                                         v-model="wechatData"
                                         :sendTime="sendTime"
                                         :is_showNoticeMember="is_showNoticeMember"
                                         :isShow_level="isShow_level"
                                         :type_code="type_code">
                        </wechat-template>
                    </div>
                </TabPane>
                <TabPane label="微信小程序订阅消息" name="wxapp" v-if="items.includes('wxapp')">
                    <div style="padding-left: 40px;">
                        <wxapp-template v-model="wxappData" :type_code="type_code"
                                        :sendTime="sendTime"></wxapp-template>
                    </div>
                </TabPane>
                <TabPane label="短信通知" name="sms" v-if="items.includes('sms')">
                    <div style="padding-left: 40px;">
                        <sms-template v-model="smsData"
                                      :type_code="type_code"
                                      :sendTime="sendTime"
                                      :is_showNoticeMember="is_showNoticeMember"
                                      :isShow_level="isShow_level">
                        </sms-template>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <template #btn>
            <Button class="primary-long" :loading="submitLoading" @click="handleSave">保存</Button>
            <Button class="default-long" @click="handleBack">返回列表</Button>
        </template>
    </kdx-content-bar>
</template>

<script>

import wechatTemplate from "./template/wechatTemplate";
import wxappTemplate from "./template/wxappTemplate";
import smsTemplate from "./template/smsTemplate";
import templateCode from "./noticeConfig";

export default {
    name: "index",
    components: {
        wechatTemplate, wxappTemplate, smsTemplate
    },
    props: {
        is_showNoticeMember: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loading: false,
            submitLoading: false,
            icon: '',
            items: [],
            tempTitle: '', // 模板标题
            tabPoint: '',
            type_code: '',
            wechatData: {
                status: 0,
                is_default: 1,
                commission_level: '1',
                member_id: []
            },
            wxappData: {
                status: 0,
                is_default: 1,
            },
            smsData: {
                status: 0,
                template_id: '',
                commission_level: '1',
                member_id: []
            }
        }
    },
    computed: {
        sendTime() {
            return templateCode[this.type_code].sendTime
        },
        isShow_level() {
            return this.type_code == 'commission_buyer_agent_add_child' || this.type_code == 'commission_buyer_child_pay' || this.type_code == 'commission_buyer_agent_add_child_line'
        }
    },
    created() {
    },
    mounted() {
        this.type_code = this.$route.query.type_code;
        this.tempTitle = templateCode[this.type_code].title;
        this.icon = templateCode[this.type_code].icon;
        this.items = this.$route.query.items;
        this.tabPoint = Array.isArray(this.items) ? this.items[0] : this.items;
        this.getData()
    },
    methods: {
        getData() {
            this.loading = true;
            if (this.tabPoint == 'wechat') {
                this.$api.noticeApi.getWechatNotice({type_code: this.type_code}).then(res => {
                    this.loading = false;
                    if (res.error == 0) {
                        delete res.error;
                        if (res.is_default == 0) {
                            let content = [];
                            res.template?.content.map(item => {
                                content.push({
                                    key: item.key,
                                    customValue: item.value
                                })
                            });
                            res.template.content = content;
                        }
                        this.wechatData = res;
                        if (res?.member) {
                            this.wechatData.member_id = res.member.map(item => item.id);
                        }
                    }
                })
            } else if (this.tabPoint == 'wxapp') {
                this.$api.noticeApi.getWxappNotice({type_code: this.type_code}).then(res => {
                    this.loading = false;
                    if (res.error == 0) {
                        delete res.error;
                        this.wxappData = {
                            ...res,
                            is_default: 1
                        }
                    }
                })
            } else if (this.tabPoint == 'sms') {
                this.$api.noticeApi.getSmsNotice({type_code: this.type_code}).then(res => {
                    this.loading = false;
                    if (res.error == 0) {
                        delete res.error;
                        this.smsData = res;
                        if (res?.member) {
                            this.smsData.member_id = res.member.map(item => item.id);
                        }
                    }
                })
            }
        },
        changeTab(name) {
            this.tabPoint = name;
            this.getData()
        },
        handleSave() {
            this.submitLoading = true;
            if (this.tabPoint == 'wechat') {
                this.wechatSave()
            } else if (this.tabPoint == 'wxapp') {
                this.wxappSave()
            } else if (this.tabPoint == 'sms') {
                this.smsSave()
            }
        },
        wechatSave() {
            let obj = {
                type_code: this.type_code,
                status: this.wechatData.status,
                is_default: this.wechatData.is_default,
                commission_level: this.wechatData.commission_level,
                // commission_level: '1',
                // ...this.wechatData
            };
            if (this.is_showNoticeMember) {
                obj.member_id = this.wechatData.member_id
            }
            // 自定义模板验证表单
            if (obj.is_default == 0) {
                this.$refs.wechatTemplate.$refs.customTemplate.validateForm().then(res => {
                    obj.content = res.content;
                    obj.template_id = res.template_id
                })
            }
            this.$api.noticeApi.addWechatNotice(obj).then(res => {
                if (res.error == 0) {
                    this.$Message.success('保存成功')
                    this.getData()
                }
                this.submitLoading = false;
            })
        },
        wxappSave() {
            let obj = {
                type_code: this.type_code,
                ...this.wxappData
            };
            this.$api.noticeApi.addWxappNotice(obj).then(res => {
                if (res.error == 0) {
                    this.$Message.success('保存成功')
                    this.getData()
                }
                this.submitLoading = false;
            })
        },
        smsSave() {
            let obj = {
                type_code: this.type_code,
                ...this.smsData
            };

            if (this.is_showNoticeMember) {
                obj.member_id = this.smsData.member_id
            }
            if (!obj.hasOwnProperty('template_id') || typeof obj.template_id.length == 'undefined' || obj.template_id + '' === '0') {
                this.$Message.error('选择模板');
                this.submitLoading = false;
                return
            }
            this.$api.noticeApi.addSmsNotice(obj).then(res => {
                if (res.error == 0) {
                    this.$Message.success('保存成功')
                    this.getData()
                }
                this.submitLoading = false;
            })
        },
        handleBack() {
            this.$router.go(-1);
        }
    },
}
</script>

<style lang="scss">
.notice-title {
    position: relative;
    margin-top: 20px;
    padding-left: 40px;
    width: 100%;
    height: 70px;
    background-color: #FAFAFF;
    border: 1px solid $border-color;
    border-radius: 4px;
    overflow: hidden;

    img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 70px;
    }

    .notice-title-content {
        align-items: center;
        height: 70px;
        font-weight: bold;
        font-size: 24px;
        color: $brand-color;

        i {
            margin-right: 10px;
            font-size: 34px;
            font-weight: 500;
            color: $brand-color;
        }
    }
}

.notice-buyer-edit {
    margin-top: 10px;
    min-height: 100%;
    background-color: #FFFFFF;

    .ivu-tabs-nav {
        margin-left: 29px;

        .ivu-tabs-tab {
            padding: 12px 13px;
            margin-right: 20px;
            @include font-16-22-bold;
        }
    }

    .tip {
        margin: 20px 0;
        font-size: 12px;
        line-height: 24px;
        color: $text-second;
    }
}
</style>