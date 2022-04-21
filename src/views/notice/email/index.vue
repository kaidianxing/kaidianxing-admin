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
    <kdx-content-bar :loading="loading">
        <div class="content">
            <Form ref="form" :model="model" :rules="rules" :label-width="180">
                <kdx-form-title>基础信息</kdx-form-title>
                <FormItem label="邮箱开启：">
                    <RadioGroup v-model="model.status">
                        <Radio :label="1">开启</Radio>
                        <Radio :label="0">关闭</Radio>
                    </RadioGroup>
                    <kdx-hint-text>开启邮箱后虚拟卡密商品可以通过邮件形式发送到用户。</kdx-hint-text>
                </FormItem>
                <div v-if="model.status === 1">
                    <FormItem label="选择邮箱：" prop="type">
                        <div class="multi-select">
                            <RadioGroup v-model="model.type" @on-change="changeType">
                                <Radio border label="qq">
                                    <div>
                                        <img class="select-img" :src="require('@/assets/image/notice/qq.png')" alt="">
                                    </div>
                                    <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
                                </Radio>
                                <Radio border label="wangyi">
                                    <div>
                                        <img class="select-img" :src="require('@/assets/image/notice/163.png')" alt="">
                                    </div>
                                    <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
                                </Radio>
                                <!--<Radio border label="aliyun">
                                    <div>
                                        <img class="select-img" :src="require('@/assets/image/notice/ali.png')" alt="">
                                    </div>
                                    <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
                                </Radio>-->
                                <Radio border label="customize">
                                    <div class="flex customize">
                                        <i class="iconfont icon-youxiang"></i>
                                        <span style="font-size: 16px">自定义</span>
                                    </div>
                                    <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
                                </Radio>
                            </RadioGroup>
                        </div>
                    </FormItem>
                    <FormItem label="SMTP服务器：" prop="host" v-if="model.type === 'customize'" :key="`${model.type}host`">
                        <Input v-model="model.host" class="width-340" placeholder="请输入SMTP服务器"/>
                    </FormItem>
                    <FormItem label="SMTP端口：" prop="port" v-if="model.type === 'customize'" :key="`${model.type}port`">
                        <Input v-model="model.port" class="width-340" placeholder="请输入SMTP端口"/>
                    </FormItem>
                    <FormItem label="发件人邮件地址：" prop="username" :key="`${model.type}username`">
                        <Input v-model="model.username" class="width-340" placeholder="请输入发件人邮件地址"/>
                        <kdx-hint-text>商城统一发送给用户的邮件地址</kdx-hint-text>
                    </FormItem>
                    <!--<FormItem label="SMTP身份验证用户名：" prop="smtp_id">
                        <Input v-model="model.smtp_id" class="width-340" placeholder="请输入SMTP身份验证用户名"/>
                    </FormItem>-->
                    <FormItem label="发件人名称：" prop="shop_name" :key="`${model.type}shop_name`">
                        <Input v-model="model.shop_name" class="width-340" placeholder="请输入发件人名称"/>
                        <kdx-hint-text>
                            <span>发送邮件中发件人名称</span>
                            <kdx-hint-tooltip width="300px" type="image" :image="require('@/assets/image/notice/send-name.png')"></kdx-hint-tooltip>
                        </kdx-hint-text>
                    </FormItem>
                    <FormItem label="发送主题：">
                        <Input v-model="model.mailer_title" class="width-340" placeholder="请输入发送主题"/>
                        <kdx-hint-text>
                            <span>发送邮件的主题内容</span>
                            <kdx-hint-tooltip width="300px" type="image" :image="require('@/assets/image/notice/send-theme.png')"></kdx-hint-tooltip>
                        </kdx-hint-text>
                    </FormItem>
                    <FormItem label="SMTP身份验证码：" prop="password" :key="`${model.type}password`">
                        <Input v-model="model.password" class="width-340" placeholder="请输入SMTP身份验证码"/>
                        <kdx-hint-text>
                            <span>添加该邮箱的SMTP身份验证码</span>
                            <Button v-if="model.type === 'qq'" class="marginL-10" type="text"
                                    to="https://service.mail.qq.com/cgi-bin/help?subtype=1&&no=1001256&&id=28" target="_blank">点击查看如何获取</Button>
                            <Button v-if="model.type === 'wangyi'" class="marginL-10" type="text"
                                    to="https://help.mail.163.com/faqDetail.do?code=d7a5dc8471cd0c0e8b4b8f4f8e49998b374173cfe9171305fa1ce630d7f67ac2cda80145a1742516" target="_blank">点击查看如何获取</Button>
                        </kdx-hint-text>
                    </FormItem>
                    <FormItem label="是否使用安全链接：">
                        <RadioGroup v-model="model.ssl">
                            <Radio label="1">开启</Radio>
                            <Radio label="0">关闭</Radio>
                        </RadioGroup>
                        <kdx-hint-text>开启后发送邮件以加密形式发送，邮件更加安全可靠</kdx-hint-text>
                    </FormItem>
                    <FormItem label="测试接收邮件地址：">
                        <Input v-model="model.test_address" class="width-340" placeholder="请输入接收邮件地址"/>
                        <Button class="marginL-10" type="text" @click="testSend">测试发送</Button>
                    </FormItem>
                </div>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :loading="submitLoading" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
    export default {
        name: "index",
        components: {},
        props: {},
        data() {
            return {
                loading: true,
                submitLoading: false,
                model: {
                    status: 0,
                    type: 'qq',
                    host: '',
                    port: '', // smtp端口
                    username: '', // 发件人邮件地址
                    // smtp_id: '', // SMTP身份验证用户名
                    shop_name: '', // 发件平台名称
                    mailer_title: '', // 邮件发送主题
                    password: '', // SMTP身份验证码
                    ssl: '0', // 是否使用安全链接
                    test_address: '', // 测试接收邮件地址
                },
                cacheData: {}, // 缓存值
                rules: {
                    type: [
                        { required: true, message: '邮箱必选' }
                    ],
                    host: [
                        { required: true, message: 'SMTP服务器必填' }
                    ],
                    port: [
                        { required: true, message: 'SMTP端口必填' }
                    ],
                    username: [
                        { required: true, message: '发件人邮件地址必填' }
                    ],
                    // smtp_id: [
                    //     { required: true, message: 'SMTP身份验证用户名必填' }
                    // ],
                    shop_name: [
                        { required: true, message: '发件平台名称必填' }
                    ],
                    password: [
                        { required: true, message: 'SMTP身份验证码必填' }
                    ]
                }
            }
        },
        computed: {},
        created() {
            this.getData()
        },
        mounted() {
        },
        methods: {
            getData() {
                this.$api.noticeApi.getMailer({}).then(res => {
                    if (res.error === 0) {
                        let {status, type, ...data} = res;
                        this.cacheData = data;
                        this.model = {
                            status: +status,
                            type,
                            ...data[type],
                            ssl: data[type].ssl.toString()
                        };
                    }
                    this.loading = false
                })
            },
            changeType(data) {
                this.model = {
                    status: 1,
                    type: data,
                    ...this.cacheData[data],
                    ssl: this.cacheData[data].ssl.toString()
                }
            },
            testSend() {
                // 测试发送
                let params = this.handleParams();
                this.$api.noticeApi.testSendMailer(params).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('发送成功')
                    }
                })
            },
            async handleSave() {
                this.submitLoading = true;
                try {
                    if (this.model.status == 1) {
                        await this.validateForm();
                    }
                    this.submit()
                } catch (e) {
                    this.submitLoading = false;
                }
            },
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            resolve(valid)
                        } else {
                            reject()
                        }
                    })
                })
            },
            handleParams() {
                let {status, type, ...data} = this.model;
                let params = {
                    status,
                    type,
                    [type]: data
                };
                return params
            },
            submit() {
                let params = this.handleParams();
                this.$api.noticeApi.setMailer(params).then(res => {
                    this.submitLoading = false;
                    if (res.error === 0) {
                        this.$Message.success('保存成功')
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .content {
        min-height: calc(100vh - 40px);
        margin-top: 30px;
        background-color: #fff;
        padding: 40px;
        min-height: 100%;
        border-radius: 2px;
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
                width: 150px;
                height: 48px;
                font-size: 14px;
                /*line-height: 20px;*/
                border-radius: 2px;
                margin-right: 10px;
                &:last-child {
                    margin-right: 0;
                }
                .select-img {
                    position: relative;
                    top: 2px;
                    /*width: 148px;*/
                    height: 44px;
                }
                .icon {
                    position: absolute;
                    font-size: 24px;
                    bottom: -2px;
                    right: 0;
                    color: $brand-color;
                    display: none;
                }
                .customize {
                    .icon-youxiang {
                        margin-right: 6px;
                        font-size: 22px;
                        color: $text-second;
                    }
                }
            }
            .ivu-radio-wrapper-disabled {
                background-color: $background-color;
            }
            .ivu-radio-wrapper-checked {
                border-width: 2px;
                .icon {
                    display: inline-block;
                }
                &.ivu-radio-wrapper-disabled {
                    border-color: $brand-color;
                }
            }
        }
    }
</style>