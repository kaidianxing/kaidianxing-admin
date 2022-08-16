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
        <div class="container">
            <Form class="content" ref="form" :model="model" :rules="rules" :label-width="140" @on-validate='onValidate'>
                <div class="content-box">
                    <!-- 基础信息 -->
                    <kdx-form-title>基础信息</kdx-form-title>
                    <FormItem label="渠道状态：" prop="channel_status">
                        <RadioGroup v-model="model.channel_status">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>开启</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="0">
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="默认访问地址：" prop="default_url">
                        <!--                        <Input :disabled='noManagePerm' placeholder="请输入"-->

                        <Input :disabled='true' placeholder="请输入"
                               class="width-300"
                               v-model="model.default_url"></Input>
                    </FormItem>
                    <FormItem label="登录页LOGO：" prop="logo" v-error-item.logo>
                        <kdx-image-video
                            type="image"
                            @on-change="changeThumb($event,'logo')"
                            :current="model.logo"
                        ></kdx-image-video>
                        <!--                        <kdx-hint-text>建议尺寸142*142</kdx-hint-text>-->
                    </FormItem>
                    <!-- 微信开放平台设置 -->
                    <kdx-form-title>微信开放平台设置</kdx-form-title>
                    <FormItem :label-width="0">
                        <kdx-hint-alert :show-icon="false">
                            微信扫码登录需要在微信开放平台创建网站应用并审核通过，同时开发平台需要开发者资质认证通过。
                            <a href="https://kf.qq.com/faq/170824URbmau170824r2uY7j.html" target="_blank">查看配置引导</a>
                        </kdx-hint-alert>
                    </FormItem>
                    <FormItem label="微信扫码登录：" prop="qrcode_login_status">
                        <RadioGroup v-model="model.qrcode_login_status">
                            <Radio :disabled='noManagePerm' label="0">
                                <span>关闭</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="1">
                                <span>开启</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="AppId：" prop="app_id">
                        <Input
                            :disabled='noManagePerm'
                            class="width-300"
                            v-model="model.app_id"
                            placeholder="请填写AppId"
                        />
                    </FormItem>
                    <FormItem label="AppSecret：" prop="secret">
                        <Input
                            :disabled='noManagePerm'
                            class="width-300"
                            v-model="model.secret"
                            placeholder="请填写AppSecret"
                        />
                    </FormItem>
                    <!-- 推广设置 -->
                    <kdx-form-title>推广设置</kdx-form-title>
                    <FormItem label="网站标题：">
                        <Input
                            :disabled='noManagePerm'
                            class="width-500"
                            v-model="model.site_title"
                            placeholder="请输入"
                        />
                    </FormItem>
                    <FormItem label="网站图标：" >
                        <kdx-image-video
                            type="image"
                            @on-change="changeThumb($event,'site_logo')"
                            :current="model.site_logo"
                        ></kdx-image-video>
                        <kdx-hint-text>建议尺寸100*100</kdx-hint-text>
                    </FormItem>
                    <FormItem label="网站描述：">
                        <Input
                            :disabled='noManagePerm'
                            class="width-500"
                            v-model="model.site_description"
                            placeholder="请输入"
                        />
                    </FormItem>
                    <FormItem label="网站关键词：">
                        <Input
                            :disabled='noManagePerm'
                            class="width-500"
                            v-model="model.site_keywords"
                            placeholder="请输入"
                        />
                    </FormItem>
                    <FormItem label="工具代码：">
                        <Input
                            :disabled='noManagePerm'
                            type="textarea"
                            class="width-500"
                            v-model="model.site_analysis_code"
                            placeholder="请输入"
                            :rows="8"
                        />
                        <kdx-hint-text>支持CNZZ网站统计、百度统计等，请前往相应网站统计后台，获取代码。</kdx-hint-text>
                    </FormItem>

                </div>
            </Form>
        </div>
        <template #btn>
            <Button class="handler-btn primary-long" :disabled='noManagePerm' @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>

</template>
<script>
import {mapState} from 'vuex'


export default {
    name: 'settings',
    computed: {

        ...mapState('account', {
            shopId: state => state.shop.shopId
        }),
        noManagePerm() {//管理权限
            return !this.$getPermMap('pc.sysset.basic.manage')
        },
        isRoot() { // 是否是管理员
            return this.$store.state.config?.user?.is_root == 1
        },
        goodSelector() {
            if (this.goodsSelectType == 0 || this.goodsSelectType == 1 || this.goodsSelectType == 2) {
                return "GoodSelector" + this.goodsSelectType
            }
            return ''
        },
        addGoods() {
            return !this.goodsList.some(item => {
                return this.goodsSelectType && this.goodsSelectType == item.id
            })
        },
    },
    data() {
        return {
            model: {
                "channel_status": "",
                "logo": "",
                "wx_scan_login_status": "",
                "wx_app_id": "",
                "wx_app_secret": "",
                "site_title": "",
                "site_logo": "",
                "site_description": "",
                "site_keywords": "",
                "site_analysis_code": "",
                "default_url": ""
            },
            rules: {
                channel_status: [
                    {
                        required: true,
                        message: '请选择渠道状态'
                    }
                ],
                default_url: [
                    {
                        required: true,
                        message: '请输入默认访问地址'
                    }
                ],
                logo: [
                    {
                        required: true,
                        message: '请上传登陆页LOGO',
                        trigger: 'change'
                    }
                ],
                app_id: [
                    {
                        required: true,
                        message: '请输入AppId',
                        trigger: 'change'
                    }
                ],
                secret: [
                    {
                        required: true,
                        message: '请输入AppSecret'
                    }
                ],
            },
        };
    },
    methods: {
        validateGoodsForm() {
            this.$nextTick(() => {
                this.$refs.goods.validate().then(res => {
                    if (res && this.errorInfo === this.currentModal) {
                        this.checkError(null);
                    }
                })
            })
        },
        changeThumb(path, property) {
            this.$set(this.model, property, path);
        },
        getData() {
            this.$api.homeApi.basicGet({}).then(res => {
                if (res.error === 0) {
                    this.model = Object.assign({}, res.data)
                }
            });
        },
        onValidate(prop, status) {
            this.cacheError = {
                ...this.cacheError,
                [prop]: status
            }
        },
        validate(fn = () => {
        }) {
            return new Promise(resolve => {
                this.$refs['form'].validate(valid => {
                    resolve(valid);
                    fn(valid);
                    this.$nextTick(() => {
                        if (!valid) {
                            for (let k in this.cacheError) {
                                if (!this.cacheError[k]) {
                                    this.$focusError(k);
                                    break;
                                }
                            }
                        }
                    })
                });
            });
        },
        handleSave() {
            console.log(this.model, 'model')
            this.validate(valid => {
                if (valid) {
                    this.$api.homeApi
                        .basicSet(this.model)
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('操作成功');
                                this.getData();
                            }
                        });
                }
            });
        },
    },
    mounted() {
        this.getData();
    }
};
</script>

<style scoped lang="scss">
.classFortItem {
    height: 32px;
}

.container {
    min-height: 100%;
    padding-top: 20px;
    border-radius: 2px;
}

.renew-btn {
    margin-left: 10px;
    cursor: pointer;
    color: var(--danger-color);
}

.meal-info {
    /deep/ .ivu-form-item-label {
        padding: 0px 10px 0px 0;
        line-height: 32px;
    }
}

.content {
    padding: 40px;
    overflow: auto;
    background: #fff;

    /deep/ .show-img + .ivu-form-item-error-tip {
        top: 84%;
    }

    .content-box {
        padding-bottom: 30px;
    }

    .agree-input {
        margin-right: 10px;
        width: 340px;
    }

    .example {
        color: #939799;

        &:hover {
            color: #2b85e4;
        }
    }

    .danger {
        background: var(--danger-color);
        border: 1px solid var(--danger-color);
    }


}

/deep/ .ivu-btn-error {
    background: #fff;
}

.pass-model {
    /deep/ .ivu-modal {
        .content {
            padding: 20px;
        }
    }

    .tip {
        margin-bottom: 10px;
        color: var(--danger-color);
    }

    .check-box {
        margin-right: 10px;
    }
}

.ck {
    cursor: pointer;
    color: #576b95;
    margin-left: 10px;
}
</style>
