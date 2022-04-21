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
        <div class="channel-register">
            <Form :label-width="180" ref="form" :model="form" :rules="rules">
                <div class="item-box">
                    <div class="form-title-box">
                        <kdx-form-title :hasMargin="false">授权登录</kdx-form-title>
                        <kdx-hint-alert :show-icon="false" class="hint-tip"
                        >用户访问商城时，是否需要授权/登录后才可进行流程商城。</kdx-hint-alert>
                            <form-item label="强制授权登录：">
                                <RadioGroup v-model="model.coerce_auth">
                                    <Radio :label="1">开启</Radio>
                                    <Radio :label="0">关闭</Radio>
                                </RadioGroup>
                                <kdx-hint-text
                                >系统默认关闭强制授权登录，当触发加入购物车、立即购买、提交表单、领取优惠券时需要获取用户用户登录信息。
                                    <kdx-hint-tooltip
                                        type="image"
                                        :image="
                                        require('@/assets/image/channel/get-info.png')
                                    "
                                    ></kdx-hint-tooltip>
                                </kdx-hint-text>
                                <kdx-hint-text
                                >开启强制授权登录时，用户访问商城必须授权后才可进行商城浏览及下单操作。
                                    <kdx-hint-tooltip
                                        type="image"
                                        :image="
                                        require('@/assets/image/channel/force-login.png')
                                    "
                                    ></kdx-hint-tooltip>
                                </kdx-hint-text>
                                <div
                                    class="nest-box"
                                    v-if="model.coerce_auth == '1'"
                                >
                                    <form-item
                                        label="适用渠道："
                                        :label-width="120"
                                        prop="channels"
                                        class="channel-item"
                                    >
                                        <CheckboxGroup v-model="form.channels">
                                            <Checkbox
                                                v-for="item in filterChannel"
                                                :key="item.key"
                                                :label="item.key"
                                            >{{ item.name }}
                                            </Checkbox
                                            >
                                        </CheckboxGroup>
                                        <kdx-hint-text>
                                            因微信小程序用户登录规范要求不能强制弹窗要求登录，小程序开启此功能可能会被封号，暂不支持微信小程序。
                                            </kdx-hint-text>
                                    </form-item>
                                </div>
                            </form-item>

                            <form-item label="手机浏览器H5 登录方式：">
                                <RadioGroup v-model="model.h5_login_method">
                                    <Radio :label="1"
                                    >短信验证码登录
                                        <kdx-hint-tooltip
                                            type="image"
                                            :image="
                                            require('@/assets/image/channel/login-code.png')
                                        "
                                        ></kdx-hint-tooltip>
                                        >
                                    </Radio>
                                    <Radio :label="0"
                                    >账号密码登录
                                        <kdx-hint-tooltip
                                            type="image"
                                            :image="
                                            require('@/assets/image/channel/login-pass.png')
                                        "
                                        ></kdx-hint-tooltip>
                                        >
                                    </Radio>
                                </RadioGroup>
                                <kdx-hint-text>手机浏览器H5用户登录时默认登录方式</kdx-hint-text>
                            </form-item>
                    </div>
                </div>
                <div class="item-box">
                    <div class="form-title-box">
                        <kdx-form-title :hasMargin="false">
                            绑定手机号
                            <template #text>
                                （适用于全渠道账号统一）使用全网渠道商城，强烈推荐绑定手机号
                            </template>
                        </kdx-form-title>
                        <kdx-hint-alert style="margin:10px 0 30px 0;">
                            <p class="register-text">提示：</p>
                            <p class="register-text">
                                买家通过微信授权登录商城后，引导买家绑定手机号，识别买家唯一身份，解决买家在微信（公众号和小程序）等不同渠道账号不同的问题
                            </p>
                            <p class="register-text">需要开启消息通知功能。</p>
                            <Button type="text" @click="routePage"
                            >【立即开启】
                            </Button
                            >
                        </kdx-hint-alert>
                    </div>
                    <FormItem
                        label="绑定类型："
                        prop="bind_method"
                        class="r-form-item-checkbox"
                        :label-width="120"
                    >
                        <RadioGroup
                            v-model="model.bind_method"
                            style="margin-bottom: -10px; width: 100%;"
                        >
                            <div class="inventory-settings">
                                <Radio :label="2" :disabled="noManagePerm">
                                    <span>强制绑定</span>
                                    <remind-label title="推荐"></remind-label>
                                </Radio>
                                <kdx-hint-text>
                                    <span
                                    >买家进入商城授权后，必须进行绑定手机号成功后才可访问商城</span
                                    >
                                    <kdx-hint-tooltip
                                        type="image"
                                        :image="
                                            require('@/assets/image/channel/bind_mobile.png')
                                        "
                                    ></kdx-hint-tooltip>
                                </kdx-hint-text>
                                <div class="nest-box">
                                    <form-item
                                        label=""
                                        :label-width="0"
                                        prop="scenes"
                                    >
                                        <CheckboxGroup v-model="form.scenes">
                                            <Checkbox
                                                v-for="item in filterScenes"
                                                :key="item.key"
                                                :label="item.key"
                                            >{{ item.name }}
                                            </Checkbox
                                            >
                                        </CheckboxGroup>
                                    </form-item>
                                </div>
                            </div>
                            <div class="inventory-settings">
                                <Radio :label="1" :disabled="noManagePerm">
                                    <span>手动绑定</span>
                                </Radio>
                                <kdx-hint-text>
                                    <span
                                    >买家通过授权登录商城后，需要用户在个人中心主动操作绑定手机号</span
                                    >
                                    <kdx-hint-tooltip
                                        type="image"
                                        :image="
                                            require('@/assets/image/channel/bind_mobile_btn.png')
                                        "
                                    ></kdx-hint-tooltip>
                                </kdx-hint-text>
                            </div>
                            <!--                            <div class="inventory-settings">-->
                            <!--                                <Radio label="0">-->
                            <!--                                    <span>不启用</span>-->
                            <!--                                </Radio>-->
                            <!--                                <kdx-hint-text>-->
                            <!--                                    <span>不建议使用，同时运营多个渠道商城时，无法通过手机号识别买家唯一身份</span>-->
                            <!--                                </kdx-hint-text>-->
                            <!--                            </div>-->
                        </RadioGroup>
                    </FormItem>
                </div>
                <div class="item-box">
                    <kdx-form-title>
                        微信账号体系
                        <template #text>
                            （需配置微信开放平台）
                        </template>
                    </kdx-form-title>
                    <div class="title-box">
                        <div class="title">
                            <span class="number">01</span>
                            <span
                            >需要同时开启微信小程序渠道
                                、开启微信公众号渠道</span
                            >
                        </div>
                        <div class="text">
                            同时开启时，用户可进行多渠道访问商城。
                        </div>
                    </div>
                    <div class="title-box">
                        <div class="title">
                            <span class="number">02</span>
                            <span>在微信开放平台进行绑定配置</span>
                        </div>
                        <div class="btn">
                            <Button type="success" @click="openConfig"
                            >立即配置
                            </Button
                            >
                            <Button class="default-success" @click="openGuide"
                            >配置引导
                            </Button
                            >
                        </div>
                        <div class="text">
                            未配置开放平台前，同一个微信生成的不同会员，配置开放平台后也无法统一账号，只能通过手机号进行绑定。
                        </div>
                        <div class="text">
                            注：未配置开发平台前，同一个微信生成一个会员时，配置开放平台后生成另一个会员时会自动执行微信账号统一，识别买家唯一微信身份。
                        </div>
                    </div>
                </div>
            </Form>
        </div>
        <template #btn>
            <Button
                class="primary-long"
                :disabled="noManagePerm"
                @click="handleSave"
            >保存
            </Button
            >
        </template>
        <Guide-modal ref="guide_modal"></Guide-modal>
    </kdx-content-bar>
</template>

<script>
import RemindLabel from "@/components/little/RemindLabel";
import GuideModal from "./components/GuideModal";

export default {
    name: "index",
    components: {
        RemindLabel,
        GuideModal,
    },
    data() {
        return {
            rules: {
                channels: [{
                    validator: (rule, array, callback) => {
                        if (array.length == 0 && this.model.coerce_auth == 1) {
                            callback(new Error('请选择一个渠道'))
                        } else {
                            callback()

                        }
                    }
                }],
                scenes: [{
                    validator: (rule, array, callback) => {
                        if (array.length == 0 && this.model.bind_method == 2) {
                            callback(new Error('请选择一个场景'))
                        } else {
                            callback()
                        }
                    }
                }],
            },
            form: {
                channels: [],
                scenes: [],
            },
            channelsData: [
                {key: "wechat", name: "微信公众号"},
                {key: "h5", name: "手机浏览器H5"},
                {key: "byte_dance", name: "头条/抖音小程序"},
            ],
            scenesData: [
                {key: "add_cart", name: "点击加入购物车"},
                {key: "buy", name: "点击立即购买"},
                {key: "share", name: "买家进行分享"},
                {key: "submit_form", name: "买家提交表单"},
                {key: "get_coupon", name: "买家领取优惠券"},
            ],
            model: {
                bind_method: 1,
                coerce_auth: 1,
                h5_login_method: 1,
            },
        };
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("channel.registry.manage");
        },
        filterChannel() {
            return this.channelsData
        },
        filterScenes() {
            return this.scenesData
        },
    },
    methods: {
        getData() {
            this.$api.settingApi.getRegisterSetting().then((res) => {
                if (res.error === 0) {
                    let {
                        bind_method,
                        h5_login_method,
                        bind_scene,
                        coerce_auth,
                        coerce_auth_channel,
                    } = res.data;
                    this.form.scenes = Object.keys(bind_scene).filter(
                        (key) => +bind_scene[key] === 1
                    );
                    this.form.channels = Object.keys(
                        coerce_auth_channel
                    ).filter((key) => +coerce_auth_channel[key] === 1);
                    this.model = {
                        bind_method: +bind_method,
                        h5_login_method: +h5_login_method,
                        coerce_auth: +coerce_auth,
                    };
                }
            });
        },
        handleSave() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let coerce_auth_channel = {},
                        bind_scene = {};

                    this.channelsData.forEach((item) => {
                        coerce_auth_channel[
                            item.key
                            ] = this.form.channels.includes(item.key) ? "1" : "0";
                    });
                    this.scenesData.forEach((item) => {
                        bind_scene[item.key] = this.form.scenes.includes(
                            item.key
                        )
                            ? "1"
                            : "0";
                    });

                    this.$api.settingApi
                        .setRegisterSetting({
                            data: {
                                ...this.model,
                                coerce_auth_channel,
                                bind_scene,
                            },
                        })
                        .then((res) => {
                            if (res.error === 0) {
                                this.$Message.success("绑定设置，设置成功");
                                this.getData();
                            }
                        });
                }
            });
        },
        openGuide() {
            this.$refs["guide_modal"].setValue();
        },

        openConfig() {
            window.open("https://open.weixin.qq.com/");
        },
        routePage() {
            this.$utils.openNewWindowPage("/notice/buyer/basic");
        },
    },
    mounted() {
        this.getData();
    },
};
</script>

<style scoped lang="scss">
.channel-register {
    padding: 40px 40px 0 40px;
    background: #fff;
    min-height: 100%;
    margin: 20px auto 0;

    .nest-box {
        overflow: hidden;
        margin-top: 10px;
        border-radius: 2px;
        padding: 20px 30px 20px 0;
        background: #f4f6f8;

        /deep/ .ivu-form-item {

            margin-bottom: 0;


            .ivu-form-item-label {
                padding: 0 10px 0 0;
                height: 32px;
                line-height: 32px;
            }


        }

        .channel-item {
            /deep/ .ivu-form-item-content {
                margin-left: 120px !important;
            }
        }
    }

    .item-box {
        .form-title-box {
            .hint-tip /deep/ .ivu-alert {
                padding: 10px;
                height: 40px;
            }

            .hint-alert-component {
                margin-top: 10px;
                margin-bottom: 30px;

                .register-text {
                    @include font-12-24;
                    color: $text-second;
                }
            }
        }

        > .title-box {
            padding-bottom: 30px;
            padding-left: 40px;

            > .title {
                @include font-14-20-bold;
                color: $text-first;

                > .number {
                    padding-right: 10px;
                }
            }

            > .text {
                @include font-12-16;
                color: $text-third;
                padding-left: 20px;
                padding-top: 10px;

                &:first-child {
                    padding-top: 0;
                }
            }

            > .btn {
                padding: 10px 0 0 25px;

                .ivu-btn {
                    margin-right: 10px;
                }

                .default-success {
                    border-color: $success-color;
                    color: $success-color;
                }
            }
        }
    }

    // 库存设置
    .inventory-settings {
        padding-bottom: 20px;

        .nest-box {
            padding: 20px 30px;


        }

        .hint-text {
            padding-left: 20px;

            .inventory-label {
                .tag-label {
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>
