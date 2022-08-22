<template>
    <div class="remote-storage-ali">
        <kdx-hint-alert :show-icon="false">
            <p class="ali-text">
                如果切换到OSS后，需要将原有设置的附件传输至阿里云OSS
            </p>
            <p class="ali-text">
                相关工具：
                <a
                    href="https://market.aliyun.com/products/53690006/cmgj000281.html#sku=biaozhunban"
                    target="_blank"
                >
                    官方推荐OSS客户端工具（Windows版）
                </a>
                <a
                    href="https://developer.aliyun.com/ask/191405?spm=a2c6h.13524658"
                    target="_blank"
                >
                    其他官方推荐工具
                </a>
            </p>
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
        <Form ref="form" :model="model" :rules="rules" :label-width="160">
            <FormItem label="Access Key ID：" prop="access_key">
                <Input v-model="model.access_key" class="width-250" />
                <kdx-hint-text>Access Key ID是您访问阿里云API的密钥。</kdx-hint-text>
            </FormItem>
            <FormItem label="Access Key Secret：" prop="secret_key">
                <Input v-model="model.secret_key" search enter-button="获取Buckets" @on-search="getBucket" class="width-340">
                </Input>
                <kdx-hint-text>
                    Access Key Secret是您访问阿里云API的密钥。
                </kdx-hint-text>
            </FormItem>
            <FormItem label="存储空间(Bucket)：" prop="bucket">
                <Select v-model="model.bucket" class="width-250">
                    <Option
                        v-for="item in option.bucket"
                        :key="item.name"
                        :value="item.bucket"
                    >
                        {{ `${item.bucket}(${item.data_center})` }}
                    </Option>
                </Select>
                <kdx-hint-text>请保证存储空间(Bucket),为可公共读取的</kdx-hint-text>
            </FormItem>
            <FormItem label="自定义访问URL：" prop="url">
                <Input v-model="model.url" class="width-250">
                    <Select
                        v-model="model.scheme"
                        slot="prepend"
                        style="width: 80px"
                    >
                        <Option value="http://">http://</Option>
                        <Option value="https://">https://</Option>
                    </Select>
                </Input>
                <kdx-hint-text>
                    自定义访问域名，请以 http:// 或 https://
                    开头，如不填写会使用OSS默认域名
                </kdx-hint-text>
            </FormItem>
            <FormItem label="图片自动压缩：" v-if="mode === 'shop'">
                <RadioGroup v-model="model.image_compression">
                    <Radio :label="1">
                        <span>启用</span>
                    </Radio>
                    <Radio :label="0">
                        <span>不启用</span>
                    </Radio>
                </RadioGroup>
                <kdx-hint-text>启用自动压缩可以减少流量消耗，提高用户端访问速度</kdx-hint-text>
                <div class="next-box" v-if="1 === +model.image_compression">
                    <FormItem label="压缩规则：">
                        <RadioGroup v-model="model.image_compression_rule.is_default">
                            <Radio :label="1">
                                <span>系统默认</span>
                            </Radio>
                            <Radio :label="0">
                                <span>自定义</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="图片样式代码：" v-if="0 === +model.image_compression_rule.is_default">
                        <Input v-model="model.image_compression_rule.rule" placeholder="请输入压缩代码" class="width-250"/>
                        <kdx-hint-tooltip type="text">
                            <template #header>
                                <div class="tooltip-header">
                                    <i class="iconfont icon-icon-test" style="vertical-align:-1px;margin-left:5px;"></i>
                                    <span class="hint-text">代码获取说明</span>
                                </div>
                            </template>
                            <div class="storage-hint-tooltip">
                                <p class="title">阿里云OSS图片压缩使用说明</p>
                                <div class="item">
                                    <p class="number">
                                        1.
                                    </p>
                                    <p class="text">
                                        到https://www.aliyun.com/登录您的阿里云存储账号
                                    </p>
                                </div>
                                <div class="item">
                                    <p class="number">
                                        2.
                                    </p>
                                    <p class="text">
                                        进入【控制台】
                                    </p>
                                </div>
                                <div class="item">
                                    <p class="number">
                                        3.
                                    </p>
                                    <p class="text">
                                        点击【对象存储OSS】
                                    </p>
                                </div>
                                <div class="item">
                                    <p class="number">
                                        4.
                                    </p>
                                    <p class="text">
                                        在左侧存储空间中，选择您正在使用的Bucket，点击进入
                                    </p>
                                </div>
                                <div class="item">
                                    <p class="number">
                                        5.
                                    </p>
                                    <p class="text">
                                        点击【图片处理】
                                    </p>
                                </div>
                                <div class="item">
                                    <p class="number">
                                        6.
                                    </p>
                                    <p class="text">
                                        点击【新建样式】，按照您的要求，创建您的图片压缩规则
                                    </p>
                                </div>
                                <div class="item">
                                    <p class="number">
                                        7.
                                    </p>
                                    <p class="text">
                                        保存完成后，到【图片处理】选项卡中，复制该样式的代码，在管理端的操作弹窗中粘贴保存即可。
                                    </p>
                                </div>
                            </div>
                        </kdx-hint-tooltip>
                    </FormItem>
                </div>
            </FormItem>
            <!--            <FormItem label="图片压缩：" prop="has_option" class="r-form-item-checkbox">-->
            <!--                <RadioGroup v-model="model.has_option">-->
            <!--                    <Radio label="1">启用</Radio>-->
            <!--                    <Radio label="0">不启用</Radio>-->
            <!--                </RadioGroup>-->
            <!--            </FormItem>-->
        </Form>
    </div>
</template>

<script>
export default {
    name: 'FTP',
    props: {
        mode: {
            type: String
        },
        oldStorageUrl: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            model: {
                access_key: '',
                secret_key: '',
                bucket: '',
                url: '',
                scheme: 'http://',
            },
            rules: {
                access_key: [{ required: true, message: 'Access Key ID必填' }],
                secret_key: [
                    { required: true, message: 'Access Key Secret必填' },
                ],
                bucket: [{ required: true, message: '存储空间（Bucket）必填' }],
            },
            option: {
                bucket: [],
            },
        }
    },
    methods: {
        validate() {
            return new Promise((resolve) => {
                this.$refs['form'].validate().then((valid) => resolve(valid))
            })
        },
        getModel() {
            return this.model
        },
        getBucket() {
            if (this.model.access_key && this.model.secret_key) {
                let shop_id = this.$route.name === "storage" ? 0 : this.$route.query.id;
                let params = {
                    access_key: this.model.access_key,
                    secret_key: this.model.secret_key,
                    shop_id,
                }
                this.$api.systemApi.getAliBucket(params).then((res) => {
                    if (res.error === 0) {
                        this.option.bucket = res.bucket_list || []
                    }
                })
            }
        },
        resetModel(model) {
            let other = {};
            if (this.mode === 'shop') {
                other = {
                    image_compression: 0,
                    image_compression_rule: {
                        is_default: 0,
                        rule: '',
                    }
                }
            }
            this.model = Object.assign(
                {
                    access_key: '',
                    secret_key: '',
                    bucket: '',
                    url: '',
                    scheme: 'http://',
                },
                other,
                model
            )
            this.getBucket()
        },
    },
}
</script>

<style scoped lang="scss">
.remote-storage-ali {
    .hint-alert-component {
        margin: 30px 0;
        .ali-text {
            @include font-12-24;
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
}
.storage-hint-tooltip {
    font-size: 12px;
    line-height: 16px;
    color: $text-first;
    .title {
        font-weight: bold;
    }
    .item {
        display: flex;
        padding-top: 12px;
        .number {
            padding-right: 8px;
        }
    }
}
</style>
