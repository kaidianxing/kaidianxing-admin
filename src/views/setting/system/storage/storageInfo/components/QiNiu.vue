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
        <kdx-hint-alert :show-icon="false"
        >如果切换到七牛云存储后，需要将原有设置的附件传输至七牛云存储，相关工具：
            <a href="https://developer.qiniu.com/sdk#tool" target="_blank"
            >官方工具</a
            >
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
            <FormItem label="AccessKey：" prop="access_key">
                <Input
                    v-model="model.access_key"
                    class="width-250"
                    @on-blur="blurData"
                />
                <kdx-hint-text
                >用于签名的公钥，从
                    <a href="https://portal.qiniu.com/user/key" target="_blank">
                        https://portal.qiniu.com/user/key </a
                    >获取
                </kdx-hint-text>
            </FormItem>
            <FormItem label="SecretKey：" prop="secret_key">
                <Input
                    v-model="model.secret_key"
                    class="width-250"
                    @on-blur="blurData"
                />
                <kdx-hint-text
                >用于签名的公钥，从
                    <a href="https://portal.qiniu.com/user/key" target="_blank">
                        https://portal.qiniu.com/user/key </a
                    >获取
                </kdx-hint-text>
            </FormItem>
            <FormItem label="存储空间(Bucket)：" prop="bucket">
                <Input
                    v-model="model.bucket"
                    class="width-250"
                    @on-blur="blurData"
                />
                <kdx-hint-text>空间名称，请保证为公开空间</kdx-hint-text>
            </FormItem>
            <FormItem label="访问URL：" prop="url">
                <Select
                    v-model="model.scheme"
                    style="width: 80px"
                    class="url-http-select"
                >
                    <Option value="http://">http://</Option>
                    <Option value="https://">https://</Option>
                </Select>
                <Select v-model="model.url" style="width: 170px">
                    <Option
                        v-for="(item, index) in optionData.url"
                        :value="item.id"
                        :key="index"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
                <kdx-hint-text>访问域名，请以http://或者https://开头</kdx-hint-text>
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
                                <p class="title">七牛云图片压缩使用说明</p>
                                <div class="item">
                                    <p class="number">
                                        1.
                                    </p>
                                    <p class="text">
                                        到www.qiniu.com登录您的七牛云存储账号
                                    </p>
                                </div>
                                <div class="item">
                                    <p class="number">
                                        2.
                                    </p>
                                    <p class="text">
                                        进入【管理控制台】
                                    </p>
                                </div>
                                <div class="item">
                                    <p class="number">
                                        3.
                                    </p>
                                    <p class="text">
                                        点击左侧导航中【对象存储】
                                    </p>
                                </div>
                                <div class="item">
                                    <p class="number">
                                        4.
                                    </p>
                                    <p class="text">
                                        选择【图片样式】选项卡
                                    </p>
                                </div>
                                <div class="item">
                                    <p class="number">
                                        5.
                                    </p>
                                    <p class="text">
                                        点击【新建图片样式】
                                    </p>
                                </div>
                                <div class="item">
                                    <p class="number">
                                        6.
                                    </p>
                                    <p class="text">
                                        按照您的要求，创建您的图片压缩规则
                                    </p>
                                </div>
                                <div class="item">
                                    <p class="number">
                                        7.
                                    </p>
                                    <p class="text">
                                        保存完成后，到【图片样式】选项卡中，复制该样式的
                                        “处理接口”代码，在管理端的操作弹窗中粘贴保存即可
                                    </p>
                                </div>
                            </div>
                        </kdx-hint-tooltip>
                    </FormItem>
                </div>
            </FormItem>
            <!--            <FormItem label="图片压缩：" prop="has_option" class="r-form-item-checkbox">-->
            <!--                <RadioGroup v-model="model">-->
            <!--                    <Radio label="1">启用</Radio>-->
            <!--                    <Radio label="0">不启用</Radio>-->
            <!--                </RadioGroup>-->
            <!--                <kdx-hint-text>-->
            <!--                    <p>开启图片压缩将帮助您减少平台的流量消耗，节约费用。</p>-->
            <!--                    <p>若您需要自定义压缩规则，请点击-->
            <!--                        <Button type="text" @click="handleSetting">设置</Button>-->
            <!--                        。-->
            <!--                        (查看-->
            <!--                        <Button type="text" @click="checkUsing">使用说明</Button>-->
            <!--                        )-->
            <!--                    </p>-->
            <!--                </kdx-hint-text>-->
            <!--            </FormItem>-->
        </Form>
        <!--        <photo-compression ref="photo_compression"></photo-compression>-->
        <!--        <use-direction ref="use_direction"></use-direction>-->
    </div>
</template>

<script>
// import PhotoCompression from "./qiniu/PhotoCompression";
// import UseDirection from "./qiniu/UseDirection";

export default {
    name: 'FTP',
    // components: {
    //     PhotoCompression,
    //     UseDirection
    // },
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
                image_compression: 0,
                image_compression_rule: {
                    is_default: 0,
                    rule: '',
                }
            },
            rules: {
                access_key: [{required: true, message: 'AccessKey必填'}],
                secret_key: [{required: true, message: 'SecretKey必填'}],
                bucket: [{required: true, message: '存储空间(Bucket)必填'}],
                url: [{required: true, message: '访问URL必填'}],
            },
            loading: false,
            optionData: {
                url: [],
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
        blurData() {
            if (
                this.model.access_key &&
                this.model.secret_key &&
                this.model.bucket
            ) {
                let shop_id = this.$route.name === "storage" ? 0 : this.$route.query.id;
                let params = {
                    access_key: this.model.access_key,
                    secret_key: this.model.secret_key,
                    bucket: this.model.bucket,
                    shop_id,
                }
                this.getUrl(params)
            }
        },
        getUrl(params) {
            this.$api.systemApi.getQiniuUrl(params).then((res) => {
                let {error, domain_list = []} = res
                if (error === 0) {
                    this.optionData.url = domain_list.map((item) => {
                        return {
                            id: item,
                            name: item,
                        }
                    })
                }
            })
        },
        resetModel(model) {
            let other = {};
            if (this.mode === 'shop') {
                other = {
                    image_compression: 0,
                    image_compression_rule: {
                        is_default: 1,
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
            this.blurData()
        },
        handleSetting() {
            this.$refs['photo_compression'].setValue()
        },
        checkUsing() {
            this.$refs['use_direction'].setValue()
        },
    },
}
</script>

<style scoped lang="scss">
.remote-storage-ftp {
    .hint-alert-component {
        margin: 30px 0;
    }

    /deep/ .ivu-form {
        .url-http-select {
            .ivu-select-selection {
                background-color: $background-color;
            }
        }
    }

    .next-box {
        background-color: $background-color;
        padding: 30px 20px;
        margin-top: 10px;

        .ivu-form-item {
            &:last-child {
                margin-bottom: 0;
            }
        }

        .tooltip-header {
            padding-left: 10px;

            .iconfont {
                color: $brand-color;
            }

            .hint-text {
                color: $brand-color;
            }
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
