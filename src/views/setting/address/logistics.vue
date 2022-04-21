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
        <div class="logistics">
            <kdx-form-title :hasMargin="false">
                物流设置
            </kdx-form-title>
            <Alert class="marginT-10">
                <div class="tip">
                    <p>提示：</p>
                    <p>
                        快递鸟接口：目前只支持“圆通快递、申通快递、百世快递、天天快递”每天500次免费查询。
                    </p>
                    <p>
                        快递100接口：商城内置接口，因接口变更，暂时关闭。您可根据需求申请/购买快递100账号，使用免费接口和企业接口。
                    </p>
                </div>
            </Alert>
            <Form
                ref="form"
                :label-width="150"
                :model="generalData"
                :rules="rule"
            >
                <FormItem label="类型选择：">
                    <RadioGroup v-model="generalData.express_type">
                        <Radio :disabled='noManagePerm' label="0"><span>快递鸟</span></Radio>
                        <Radio :disabled='noManagePerm' label="1"><span>快递100</span></Radio>
                        <Radio :disabled='noManagePerm' label="2"><span>阿里云</span></Radio>
                    </RadioGroup>
                </FormItem>
                 <FormItem
                    label="接口类型："
                    v-if="generalData.express_type == 0"
                >
                    <RadioGroup v-model="generalData.bird_set.api_type">
                        <!--<Radio label="2">
                            <span>商城内置接口</span>
                        </Radio>-->
                        <Radio :disabled='noManagePerm' label="1">
                            <span>免费接口</span>
                        </Radio>
                        <Radio :disabled='noManagePerm' label="2">
                            <span>企业接口</span>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text
                        >因快递100接口变更，商城内置接口暂时关闭</kdx-hint-text>
                </FormItem>
                <FormItem
                    label="接口类型："
                    v-if="generalData.express_type == 1"
                >
                    <RadioGroup v-model="generalData.one_hundred_set.is_open">
                        <!--<Radio label="2">
                            <span>商城内置接口</span>
                        </Radio>-->
                        <Radio :disabled='noManagePerm' label="1">
                            <span>免费接口</span>
                        </Radio>
                        <Radio :disabled='noManagePerm' label="0">
                            <span>企业接口</span>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text
                        >因快递100接口变更，商城内置接口暂时关闭</kdx-hint-text>
                </FormItem>
                <FormItem label="用户ID：" v-if="generalData.express_type == 0">
                    <Input :disabled='noManagePerm'
                        class="width-250"
                        v-model="generalData.bird_set.express_bird_user_id"
                    ></Input>
                </FormItem>
                <FormItem
                    label="API Key："
                    v-if="generalData.express_type == 0"
                >
                    <Input :disabled='noManagePerm'
                        class="width-250"
                        v-model="generalData.bird_set.express_bird_apikey"
                    ></Input>
                </FormItem>
                <FormItem
                    label="授权密匙(Key)："
                    v-if="generalData.express_type == 1"
                >
                    <Input :disabled='noManagePerm'
                        class="width-250"
                        v-model="generalData.one_hundred_set.apikey"
                    ></Input>
                </FormItem>
                <FormItem
                    label="公司编号(Customer)："
                    v-if="
                        generalData.express_type == 1 &&
                            generalData.one_hundred_set.is_open == 0
                    "
                    key="index"
                >
                    <Input :disabled='noManagePerm'
                        class="width-250"
                        v-model="generalData.one_hundred_set.customer"
                    ></Input>
                </FormItem>
                <FormItem
                        label="阿里云APPCODE："
                        v-if="generalData.express_type == 2"
                        required
                        :error="aliapp_codeError"
                >
                    <Input :disabled='noManagePerm'
                            class="width-430"
                            v-model="generalData.aliyun_set.aliapp_code"
                    ></Input>
                    <kdx-hint-text
                    >用于获取物流信息，<a
                            class="brand-color"
                            target="_blank"
                            href="https://market.aliyun.com/products/56928004/cmapi023201.html?spm=5176.10695662.1996646101.searchclickresult.60ff5399ppm0i7#sku=yuncode1720100006"
                    >阿里云接口申请</a
                    ></kdx-hint-text>
                </FormItem>
                <FormItem
                    label="数据缓存时间："
                    v-if="generalData.express_type == 1"
                >
                    <Input :disabled='noManagePerm'
                        class="width-250"
                        v-model="generalData.one_hundred_set.cache"
                    >
                        <span slot="append">分钟</span>
                    </Input>
                    <kdx-hint-text
                        >正式接口可能存在次数限制问题,
                        设置缓存时间后在指定时间内只读取缓存并不调用接口(数据可能会延迟)</kdx-hint-text>
                </FormItem>
                <FormItem
                    label="数据缓存时间："
                    v-if="generalData.express_type == 0"
                >
                    <Input :disabled='noManagePerm'
                        class="width-250"
                        v-model="generalData.bird_set.express_bird_cache"
                    >
                        <span slot="append">分钟</span>
                    </Input>
                    <kdx-hint-text
                        >正式接口可能存在次数限制问题,
                        设置缓存时间后在指定时间内只读取缓存并不调用接口(数据可能会延迟)</kdx-hint-text>
                </FormItem>
                <FormItem
                        label="数据缓存时间："
                        v-if="generalData.express_type == 2"
                >
                    <Input :disabled='noManagePerm'
                            class="width-250"
                            v-model="generalData.aliyun_set.aliyun_catch"
                    >
                        <span slot="append">分钟</span>
                    </Input>
                    <kdx-hint-text
                    >正式接口可能存在次数限制问题,
                        设置缓存时间后在指定时间内只读取缓存并不调用接口(数据可能会延迟)</kdx-hint-text>
                </FormItem>
                <FormItem
                    label="京东商家编码："
                    v-if="generalData.express_type == 0"
                >
                    <Input :disabled='noManagePerm'
                        class="width-430"
                        v-model="
                            generalData.bird_set.express_bird_customer_name
                        "
                    ></Input>
                    <kdx-hint-text
                        >若您使用京东物流，则需填写“京东商家编码”，否则将会造成物流信息无法查询</kdx-hint-text>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :disabled='noManagePerm' @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {
            generalData: {
                express_type: '0', // 类型 0快递鸟 1快递一百 2阿里云
                bird_set: {
                    api_type: '1',
                    express_bird_user_id: '',
                    express_bird_apikey: '',
                    express_bird_customer_name: '',
                    express_bird_cache: '',
                }, // 快递鸟设置
                one_hundred_set: {
                    is_open: '1',
                    apikey: '',
                    customer: '',
                    cache: '',
                }, // 快递100
                aliyun_set: {
                    aliapp_code: '',
                    aliyun_catch: ''
                },
            },
            aliapp_codeError: '',
            rule: {
                'aliyun_set.aliapp_code': [
                    {
                        required: true,
                        message: '请填写阿里云APPCODE',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('sysset.express.manage')
        },
    },
    created() {},
    mounted() {
        this.getData()
    },
    methods: {
        getData(needReset=true) {
            needReset&&this.resetData();
            this.$api.settingApi.getExpress({}).then((res) => {
                let {error, one_hundred_set,bird_set,express_type,aliyun_set,} = res;
                if (error == 0) {
                    // 后台没有返默认值
                    this.generalData = {
                        express_type,
                        aliyun_set: {...this.generalData.aliyun_set,...aliyun_set},
                        one_hundred_set: {...this.generalData.one_hundred_set,...one_hundred_set},
                        bird_set: {...this.generalData.bird_set,...bird_set}
                    };
                }
            })
        },
        handleSave() {
            if (
                this.generalData.express_type == 2 &&
                !this.generalData.aliyun_set.aliapp_code
            ) {
                this.aliapp_codeError = '请填写阿里云APPCODE'
                return
            }
            this.submit()
        },
        submit() {
            let obj = {
                express_type: this.generalData.express_type,
                ...this.generalData.bird_set,
                ...this.generalData.one_hundred_set,
                ...this.generalData.aliyun_set,
            }
            this.$api.settingApi.addExpress({ ...obj }).then((res) => {
                if (res.error == 0) {
                    this.getData(false)
                    this.$Message.success('保存成功')
                }
            })
        },
        resetData() {
            this.generalData = {
                express_type: '0', // 类型 0快递鸟 1快递一百 2阿里云
                bird_set: {
                    api_type: '1',
                    express_bird_user_id: '',
                    express_bird_apikey: '',
                    express_bird_customer_name: '',
                    express_bird_cache: '',
                }, // 快递鸟设置
                one_hundred_set: {
                    is_open: '1',
                    apikey: '',
                    customer: '',
                    cache: '',
                }, // 快递100
                aliyun_set: {
                    aliapp_code: '',
                    aliyun_catch: ''
                }
            }
        }
    },
}
</script>

<style lang="scss">
.logistics {
    padding: 40px;
    margin: 20px auto 0;
    background:#fff;
    min-height: 100%;
    border-radius: 2px;
    .ivu-alert {
        max-width: 100%;
        margin-bottom: 40px;
    }
    .tip {
        color: $text-second;
        @include font-12-24;
    }
}
</style>
