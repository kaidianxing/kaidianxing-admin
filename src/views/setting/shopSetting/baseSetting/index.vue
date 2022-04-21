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
                    <!-- 商城状态 -->
                    <kdx-form-title>站点设置</kdx-form-title>
                    <FormItem label="商城状态：" prop="mall_status">
                        <RadioGroup v-model="model.mall_status">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>营业</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="0">
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="商城关闭跳转链接：" v-if="model.mall_status==0">
                        <Input :disabled='noManagePerm' v-model="model.mall_close_url" style="width: 500px"
                               placeholder="请输入">
                            <span slot="prepend">http://</span>
                        </Input>
                    </FormItem>
                    <FormItem label="商城名称：" prop="name" v-error-item.name>
                        <Input :disabled='noManagePerm' placeholder="请输入" maxlength="15" show-word-limit
                               style="width: 300px"
                               v-model="model.name"></Input>
                    </FormItem>
                    <FormItem label="商城简介：" prop="description" v-error-item.description>
                        <Input :disabled='noManagePerm'
                               type="textarea"
                               placeholder="用于商城系统分享副标题"
                               style="width: 500px"
                               v-model="model.description"
                        ></Input>
                    </FormItem>
                    <FormItem label="商城LOGO：" prop="logo" v-error-item.logo>
                        <kdx-image-video
                            type="image"
                            @on-change="changeThumb($event,'logo')"
                            :current="model.logo"
                        ></kdx-image-video>
                        <kdx-hint-text>图片为长方形，建议尺寸200*100，用于商城首页分享的系统默认宣传图</kdx-hint-text>
                    </FormItem>
                    <FormItem label="登录页背景图：" prop="login_show_img">
                        <kdx-image-video
                            :height="67"
                            type="image"
                            @on-change="changeThumb($event,'login_show_img')"
                            :current="model.login_show_img"
                        ></kdx-image-video>
                        <kdx-hint-text>登录页面背景图片，可进行自定义修改，建议尺寸1920*1080</kdx-hint-text>
                    </FormItem>
                    <FormItem label="售罄图标：" prop="sale_out">
                        <kdx-image-video
                            type="image"
                            @on-change="changeThumb($event,'sale_out')"
                            :current="model.sale_out"
                        ></kdx-image-video>
                        <div class="flex">
                            <kdx-hint-text content="建议尺寸比例为1:1，用于商品售罄后的提示图标"></kdx-hint-text>
                            <kdx-hint-tooltip
                                type="image"
                                :image="require('@/assets/image/example/sale_out.png')"
                            ></kdx-hint-tooltip>
                        </div>
                    </FormItem>
                    <FormItem label="加载图标：" prop="loading">
                        <kdx-image-video
                            type="image"
                            @on-change="changeThumb($event,'loading')"
                            :current="model.loading"
                        ></kdx-image-video>
                        <div class="flex">
                            <kdx-hint-text content="图片为正方形，建议尺寸200*200，用于网络较慢图片未加载出来时的占位图"></kdx-hint-text>
                            <kdx-hint-tooltip
                                type="image"
                                :image="require('@/assets/image/example/load_picture.png')"
                            ></kdx-hint-tooltip>
                        </div>
                    </FormItem>
                    <FormItem label="商城图片预览：">
                        <RadioGroup v-model="model.photo_preview">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>开启</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="0">
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                        <div class="flex">
                            <kdx-hint-text content="如果开启此选项，则商品详情、轮播图的图片可以放大预览"></kdx-hint-text>
                            <kdx-hint-tooltip
                                type="image"
                                :image="require('@/assets/image/example/preview_img.png')"
                            ></kdx-hint-tooltip>
                        </div>
                    </FormItem>
                </div>
                <div class="content-box">
                    <kdx-form-title>协议信息</kdx-form-title>
                    <FormItem label="协议标题：" prop="agreement_name">
                        <Input :disabled='noManagePerm'
                               placeholder="请输入协议标题"
                               maxlength="10"
                               show-word-limit
                               class="agree-input"
                               @on-blur="agreeInput"
                               v-model="model.agreement_name"
                        />
                        <kdx-hint-tooltip
                            type="image"
                            :image="require('../../../../assets/image/example/agreement.png')"
                        ></kdx-hint-tooltip>
                    </FormItem>
                    <FormItem label="协议内容：" prop="agreement_content">
                        <editor v-model="model.agreement_content" @input="contentInput" :height="667"></editor>
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
import Editor from '@/components/Editor';
import {mapState} from 'vuex'

export default {
    name: 'index',
    components: {
        Editor
    },
    computed: {
        ...mapState('account', {
            shopId: state => state.shop.shopId
        }),
        noManagePerm() {//管理权限
            return !this.$getPermMap('sysset.mall.basic.manage')
        },
        isRoot() { // 是否是管理员
            return this.$store.state.config?.user?.is_root == 1
        }
    },
    data() {
        return {
            model: {
                mall_status: '1',
                mall_close_url: '',
                name: '',
                logo: '',
                login_show_img: '',
                description: '',
                sale_out: '',
                loading: '',
                photo_preview: '1',
                agreement_name: '用户注册使用协议',
                agreement_content: '用户注册使用协议'
            },
            rules: {
                mall_status: [
                    {
                        required: true,
                        message: '请选择商城状态'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '请输入商城名称'
                    }
                ],
                logo: [
                    {
                        required: true,
                        message: '请上传商城LOGO',
                        trigger: 'change'
                    }
                ],
                login_show_img: [
                    {
                        required: true,
                        message: '请上传登录页展示图',
                        trigger: 'change'
                    }
                ],
                description: [
                    {
                        required: true,
                        message: '请输入商城简介'
                    }
                ],
            },
            submitLoading: false,
            shop_info: {},
            // 删除店铺
            passModel: {
                password: ''
            },
            passRules: {
                password: [{required: true, message: '请输入密码'}],
                checked: [{
                    required: true, validator(rule, value, callback) {
                        if (value) {
                            callback()
                        } else {
                            callback(new Error('请先确认风险'))
                        }
                    }
                }]
            },
        };
    },
    methods: {
        changeThumb(path, property) {
            this.$set(this.model, property, path);
        },
        getData() {
            this.$api.settingApi.getBaseSetting({}).then(res => {
                let {error, shop_info, ...info} = res;
                if (error === 0) {
                    this.model = {
                        ...this.model,
                        ...info
                    };
                    this.shop_info = shop_info || {}
                    this.$store.commit('config/setBaseSetting', info);
                }
            });
        },
        agreeInput() {
            if (this.model.agreement_name.trim() === '') {
                this.model.agreement_name = '用户注册使用协议';
            }
        },
        contentInput() {
            if (this.model.agreement_content.trim() === '') {
                this.model.agreement_content = '用户注册使用协议';
            }
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
            this.validate(valid => {
                if (valid) {
                    this.$api.settingApi
                        .changeBaseSetting(this.model)
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('操作成功');
                                this.getData();
                            }
                        });
                }
            });
        },

        okHandler() {
            this.$refs.passForm.validate(valid => {
                if (valid) {
                    this.$api.settingApi.deleleShop({password: this.passModel.password}).then(res => {
                        if (res.error == 0) {
                            this.getData();
                        }
                    })
                }
            })
        },
        reNewBtn() {
            this.$utils.openNewWindowPage('/create/renew', {shop_id: this.shopId})
        },
    },
    mounted() {
        this.getData();
    }
};
</script>

<style scoped lang="scss">
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
</style>
