/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="remote-storage-ftp">
        <kdx-hint-alert :show-icon="false">
            如果切换到COS后，需要将原有设置的附件传输至腾讯COS, 相关工具：
            <a href="https://developer.aliyun.com/ask/191405?spm=a2c6h.13524658" target="_blank">官方工具</a>
            <div class="old-url-box">
                <div class="label">
                    当前店铺的附件地址：
                </div>
                <div class="old-url">
                    <div class="old-url-item" v-for="(item, index) in oldStorageUrl" :key="index">
                        {{item}}；
                    </div>
                </div>
            </div>
        </kdx-hint-alert>
        <Form ref="form" :model="model" :rules="rules" :label-width="150">
            <FormItem label="App ID：" prop="app_id">
                <Input v-model="model.app_id" class="width-250"/>
                <kdx-hint-text>App ID 是您项目的ID</kdx-hint-text>
            </FormItem>
            <FormItem label="Secret ID：" prop="secret_id">
                <Input v-model="model.secret_id" class="width-250"/>
                <kdx-hint-text>Secret ID 是您项目的安全秘钥，具有该账户完全的权限，请妥善保管</kdx-hint-text>
            </FormItem>
            <FormItem label="Secret Key：" prop="secret_key">
                <Input v-model="model.secret_key" search enter-button="获取Buckets" @on-search="getBucket" class="width-250">
                </Input>
                <kdx-hint-text>Secret Key 是您项目的安全秘钥，具有该账户完全的权限，请妥善保管</kdx-hint-text>
            </FormItem>
            <FormItem label="存储空间(Bucket)：" prop="bucket">
                <Select v-model="model.bucket" class="width-250" @on-change="getRegion">
                    <Option v-for="item in option.bucket" :key="item.bucket" :value="item.bucket">{{item.bucket}}</Option>
                </Select>
                <kdx-hint-text>请保证空间属性为 公有读私有写</kdx-hint-text>
            </FormItem>
            <FormItem label="地域：" prop="region">
                <Select v-model="model.region" class="width-250">
                    <Option v-for="(item, index) in option.region" :key="index" :value="item.region">{{item.region}}</Option>
                </Select>
                <kdx-hint-text>存储空间(Bucket)所在的地域</kdx-hint-text>
            </FormItem>
            <FormItem label="自定义访问URL：" prop="url">
                <Input v-model="model.url" class="width-250">
                    <Select v-model="model.scheme" slot="prepend" style="width: 80px">
                        <Option value="http://">http://</Option>
                        <Option value="https://">https://</Option>
                    </Select>
                </Input>
                <kdx-hint-text>自定义访问域名，请以 http:// 或 https:// 开头，如不填写会使用OSS默认域名</kdx-hint-text>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        name: "FTP",
        props: {
            oldStorageUrl: {
                type: Array,
                default: () => []
            },
            mode: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                model: {
                    app_id: '',
                    secret_id: '',
                    secret_key: '',
                    bucket: '',
                    region: '',
                    url: '',
                    scheme: 'http://'
                },
                rules: {
                    app_id: [
                        {required: true, message: 'APP ID必填'}
                    ],
                    secret_id: [
                        {required: true, message: 'Secret ID必填'}
                    ],
                    secret_key: [
                        {required: true, message: 'Secret Key必填'}
                    ],
                    bucket: [
                        {required: true, message: '存储空间(Bucket)必填'}
                    ],
                    region: [
                        {required: true, message: '地域必填'}
                    ]
                },
                option: {
                    bucket: [],
                    region: []
                },
            };
        },
        methods: {
            validate() {
                return new Promise(resolve => {
                    this.$refs['form'].validate().then(valid => resolve(valid));
                });
            },
            getModel() {
                return this.model;
            },
            getBucket() {
                if (this.model.app_id && this.model.secret_id && this.model.secret_key) {
                    let shop_id = this.$route.name === "storage" ? 0 : this.$route.query.id;
                    let params = {
                        app_id: this.model.app_id,
                        secret_id: this.model.secret_id,
                        secret_key: this.model.secret_key,
                        shop_id,
                    }
                    this.$api.systemApi.getTencentBucket(params).then((res) => {
                        if (res.error === 0) {
                            this.option.bucket = res.bucket_list || []
                            this.getRegion('res');
                        }
                    })
                }
            },
            getRegion(res) {
                if (this.option.bucket?.length) {
                    if (this.model.bucket) {
                        this.option.region = this.option.bucket.filter(item => item.bucket === this.model.bucket);
                    } else {
                        this.option.region = [...this.option.bucket]
                    }
                } else {
                    this.option.region = [];
                }
                (res !== 'res') && (this.model.region = '') // 当为数据请求时不清空地域字段
            },
            resetModel(model) {
                this.model = Object.assign({
                    app_id: '',
                    secret_id: '',
                    secret_key: '',
                    bucket: '',
                    region: '',
                    url: '',
                    scheme: 'http://'
                }, model);
                this.getBucket();
            },
        }
    };
</script>

<style scoped lang="scss">
    .remote-storage-ftp {
        .hint-alert-component {
            margin: 30px 0;
        }
    }
    .old-url-box {
        font-size: 12px;
        line-height: 20px;
        color: $text-second;
        display: flex;
        .old-label {
            flex-shrink: 0;
        }
        .old-url {
            flex: 1;
            display: flex;
        }
    }
</style>
