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
        <div class="sms-set">
            <div class="header">
                <kdx-form-title :has-margin="false">短信接口</kdx-form-title>
                <!--                <kdx-hint-alert :show-icon="false">-->
                <!--                    <div class="alert-box">-->
                <!--                        短信接口只能开启一种，用于注册登录及短信推送。-->
                <!--                    </div>-->
                <!--                </kdx-hint-alert>-->
            </div>
            <Form ref="form" :label-width="160" :model="data" :rules="rule">
                <FormItem label="短信平台：">
                    <RadioGroup v-model="data.type">
                        <Radio label="aliyun">
                            <span>阿里云短信</span>
                        </Radio>
                        <!--<Radio label="juhe">
                            <span>聚合短信</span>
                        </Radio>-->
                    </RadioGroup>
<!--                    <div class="sms-set-block" v-if="data.type == 'aliyun'">-->
                    <div class="sms-set-block" >
                        <FormItem label="Access Key ID：" prop="aliyun.access_key_id">
                            <Input class="width-330" v-model="data.aliyun.access_key_id"></Input>
                            <!-- <kdx-hint-text>没有这个地址id请<a class="brand-color" target="_blank" href="https://home.console.aliyun.com/">【立即申请】</a></kdx-hint-text>-->
                            <kdx-hint-text>点击<a class="brand-color" target="_blank" href="https://home.console.aliyun.com/">【立即申请】</a>，注册完毕后输入保存后生效。</kdx-hint-text>
                        </FormItem>
                        <FormItem label="Access Key Secret：" prop="aliyun.access_key_secret">
                            <Input class="width-330" v-model="data.aliyun.access_key_secret"></Input>
                        </FormItem>
                    </div>
                    <div class="sms-set-block" v-if="data.type == 'juhe'">
                        <FormItem label="App Key：" prop="juhe.app_key" style='margin-bottom:0;'>
                            <Input class="width-330" v-model="data.juhe.app_key"></Input>
                            <kdx-hint-text>没有这个地址id请<a class="brand-color" target="_blank" href="http://www.juhe.cn">【立即申请】</a></kdx-hint-text>
                        </FormItem>
                    </div>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>

export default {
    components: {
    },
    props: {},
    data() {
        return {
            loading: false,
            submitLoading: false,
            data: {
                type: 'aliyun',
                aliyun: {
                    access_key_id: "",
                    access_key_secret: ""
                },
                juhe: {
                    app_key: ""
                }
            },
            rule: {
                'aliyun.access_key_secret': [
                    {required: true, message: '请填写Access Key Secret', trigger: 'blur'},
                ],
                'aliyun.access_key_id': [
                    {required: true, message: '请填写Access Key ID', trigger: 'blur'},
                ],
                'juhe.app_key': [
                    {required: true, message: '请填写App Key', trigger: 'blur'},
                ]
            }
        }
    },
    computed: {},
    created() {
    },
    mounted() {
        this.getDetail()
    },
    methods: {
        getDetail() {
            this.loading = true;
            this.$api.noticeApi.getAccessKey({}).then(res => {
                this.data = res.settings;
                console.log(this.data,'data----')
                this.loading = false;
            })
        },
        // 表单验证
        validateForm() {
            return new Promise((resolve, reject) => {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        resolve(valid);
                    } else {
                        reject();
                    }
                });
            });
        },
        handleSave() {
            this.submitLoading = true;
            this.customForm(this.data);
        },
        async customForm(data) {
            try {
                await this.validateForm();
                this.submit(data);
            } catch (e) {
                this.submitLoading = false;
            }
        },
        submit(data) {
            this.$api.noticeApi.setAccessKey(data).then(res => {
                if (res.error == 0) {
                    this.$Message.success('保存成功');
                    this.getDetail()
                }
                this.submitLoading = false
            })
        }
    },
}
</script>

<style lang="scss">
.sms-set {
    min-height: calc(100vh - 40px);
    margin-top: 30px;
    padding: 40px;
    background:#fff;
    .header {
        margin-bottom: 30px;
        .hint-alert-component {
            margin-top: 10px;
            .alert-box {
                display: flex;
                flex-wrap: nowrap;
                .title {
                    @include font-12-24;
                }
            }
        }
    }

    .special {
        margin-left: -40px;
    }

    .sms-set-block {
        padding: 30px 0;
        /*margin: 0 0 60px 120px;*/
        margin-top: 10px;
        background-color: #F4F6F8;
        border-radius: 2px;
        .hint-text {
            padding-left: 160px;
        }
        /deep/ .ivu-form-item-error-tip {
            padding-left: 160px;
        }
        .ivu-form-item {
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    .sms-set-white {
        padding: 30px 20px 1px;
        margin: 0 0 40px 160px;
        background-color: #fff;
        border-radius: 2px;
    }
    .emay-money {
        color: #FF9900;
        font-size: 18px;
    }
}
</style>
