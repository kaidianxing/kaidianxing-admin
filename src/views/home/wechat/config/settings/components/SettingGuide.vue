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
    <div class="setting-guide">
        <div class="setting-guide-item">
            <kdx-form-title>当前微信公众号</kdx-form-title>
            <div class="flex">
                <div class="wechat-box">
                    <div class="logo">
                        <img :src="$utils.media(info.logo)" alt="">
                    </div>
                    <div class="name">
                        {{ info.name }}
                    </div>
                </div>
            </div>
        </div>
        <div class="setting-guide-item">
            <kdx-form-title>公众号设置引导</kdx-form-title>
            <div class="guide-item">
                <div class="title">
                    第一步 登录 <span class="success-color">微信公众平台</span> ，点击左侧菜单 <span
                        class="success-color">开发  --> 基本配置</span>
                </div>
                <div class="nest-box">
                    <div class="image">
                        <img src="@/assets/image/home/wechat-config1.png" alt="">
                    </div>
                    <div class="text brand-color">
                        *如果您未成为开发者，请勾选页面上的同意协议，再点击[成为开发者]按钮
                    </div>
                </div>
                <div class="circle-num">1</div>
                <div class="line-num"></div>
            </div>
            <div class="guide-item">
                <div class="title">
                    第二步 在 <span class="success-color"> 基本配置  --> 服务器配置</span> 栏目下 <span class="success-color">设置URL、Token和EncodingAESKey</span>
                </div>
                <div class="nest-box">
                    <kdx-hint-alert :show-icon="false" type="warning">
                        *请将以下链接填入对应输入框，<span class="danger-color">请将以下信息提前保存好，提交保存后此页面将不会再展示</span>
                    </kdx-hint-alert>
                    <Form :label-width="120">
                        <FormItem label="URL：">
                            {{ data.url }}
                            <kdx-copy-text :text="data.url">
                                <Button type="text">复制</Button>
                            </kdx-copy-text>
                        </FormItem>
                        <FormItem label="Token：">
                            {{ data.token }}
                            <kdx-copy-text :text="data.token">
                                <Button type="text">复制</Button>
                            </kdx-copy-text>
                        </FormItem>
                        <FormItem label="EncodingAESKey:">
                            {{ data.encoding_aes_key }}
                            <kdx-copy-text :text="data.encoding_aes_key">
                                <Button type="text">复制</Button>
                            </kdx-copy-text>
                        </FormItem>

                    </Form>
                    <div class="image">
                        <img src="@/assets/image/home/wechat-config2.png" alt="">
                    </div>
                </div>
                <div class="nest-box marginT-10">
                    <kdx-hint-alert :show-icon="false" type="warning" class="marginB-10">
                        <p>*如果以前已填写过URL和Token,请点击[修改配置],再填写上述链接</p>
                        <p>*请点击 <span class="success-color">【启用】</span>，以启用服务器配置</p>
                    </kdx-hint-alert>
                    <div class="image">
                        <img src="@/assets/image/home/wechat-config3.png" alt="">
                    </div>
                </div>
                <div class="circle-num">2</div>
                <div class="line-num"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SettingGuide",
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            type: 'create', // create/edit/renew
            data: {}
        };
    },
    created() {
        this.type = this.$route.query.type || 'create';
        this.getToken();
    },
    methods: {
        getToken() {
            let params = {};
            if (this.type === 'renew') {
                params = {
                    sign: 'sign'
                }
            }
            this.$api.homeApi.getWechatToken(params).then(res => {
                if (res.error === 0) {
                    this.data = res.data || {};
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
.wechat-box {
    display: flex;
    align-items: center;
    padding: 13px 10px;
    border: 1px solid $success-color;
    margin-bottom: 60px;
    min-width: 230px;

    .logo {
        width: 36px;
        height: 36px;
        border-radius: 100%;
        flex-shrink: 0;

        img {
            width: 100%;
            height: 100%;
            border-radius: 100%;
        }
    }

    .name {
        @include font-16-22-bold;
        color: $text-first;
        padding-left: 10px;
    }
}

.guide-item {
    position: relative;
    padding-left: 40px;
    padding-bottom: 30px;
    &:last-child{
        padding-bottom: 0;
    }

    .title {
        @include font-16-22-bold;
        color: $text-first;
        padding-bottom: 14px;
    }

    .nest-box {
        background-color: $background-color;
        padding: 30px;

        .text {
            @include font-12-16;
        }
        .ivu-btn {
            color: $success-color;
            font-size: 12px;
        }
        /deep/.alert-warning {
            color: $text-second;
        }
    }

    .circle-num {
        position: absolute;
        top: 0;
        left: 3px;
        width: 25px;
        height: 25px;
        border: 1px solid $success-color;
        border-radius: 100%;
        color: $success-color;
        line-height: 25px;
        font-size: 12px;
        text-align: center;
        font-weight: bold;
        background-color: #ffffff;
        z-index: 1;
    }
    .line-num {
        background-color: $background-color;
        width: 1px;
        height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 15px;
        z-index: 0;
    }
}
</style>
