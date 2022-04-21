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
    <div class="login-modal" v-if="value" @click.stop>
        <div class="login-content">
            <div class="close">
                <Icon type="ios-close" @click="fnCloseModal" />
            </div>
            <div class="login-content-title">
                <span class="iconfont icon-xitongguanli-guanli"></span>
                <div class="text">清除店铺数据</div>
            </div>
            <kdx-hint-text
                >为了防止店铺数据误删除，请输入管理员密码进行操作</kdx-hint-text>
            <div class="login-content-password">
                <Form ref="form" @submit.native.prevent>
                    <FormItem :error="errorMsg">
                        <i-input
                            placeholder="请输入管理员密码"
                            style="width: 250px;"
                            ref="input"
                            v-model="password"
                            :type="inputType"
                            @on-enter="fnLogin"
                        >
                            <span
                                class="iconfont icon-lock1"
                                :class="{ error: errorMsg }"
                                slot="prefix"
                            ></span>
                            <span
                                class="iconfont"
                                :class="{
                                    'icon-eye': inputType === 'text',
                                    'icon-eye-off': inputType === 'password',
                                }"
                                slot="suffix"
                                @click="changeInputType"
                            ></span>
                        </i-input>
                    </FormItem>
                </Form>
            </div>
            <div class="login-content-login" @click="fnLogin">确认</div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["value", "errorMsg"],
    data() {
        return {
            inputType: "password",
            password: "",
        };
    },
    watch: {
        value(value) {
            if (value) {
                this.$nextTick(() => {
                    this.$refs["input"].focus();
                });
            }
        },
        password(value) {
            if (value) {
                this.$emit('update:errorMsg', '')
            }
        },
    },
    methods: {
        fnCloseModal() {
            this.$emit("input", false);
            this.password = "";
        },
        changeInputType() {
            this.inputType =
                this.inputType === "password" ? "text" : "password";
        },
        async fnLogin() {
            if (this.password.trim() === "") {
                this.$emit('update:errorMsg', '请输入密码')
                return;
            }
            this.$emit("on-submit", this.password);
        },
    },
};
</script>

<style scoped lang="scss">
.login-modal {
    z-index: 99999999;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    .login-content {
        width: 400px;
        background-color: #fff;
        border-radius: 2px;
        padding-top: 40px;
        padding-bottom: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        transform: translateY(-100px);
        .close {
            font-size: 31px;
            position: absolute;
            right: 8px;
            top: 1px;
            color: #999;
            overflow: hidden;
            cursor: pointer;
        }
        .login-content-title {
            display: flex;
            align-items: center;
            .iconfont {
                color: $brand-color;
                font-size: 20px;
                margin-right: 6px;
            }
            .text {
                font-weight: bold;
                font-size: 18px;
                line-height: 25px;
                color: $brand-color;
            }
        }

        /deep/ .hint-text {
            margin-bottom: 30px;
        }
        .login-content-password {
            /deep/ .ivu-input-suffix {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            /deep/ .ivu-input-prefix {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .iconfont {
                font-size: 14px;
                cursor: pointer;
                &.icon-lock1 {
                    color: $brand-color;
                    &.error {
                        color: #ff1f2c;
                    }
                }
            }
        }
        .login-content-login {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 250px;
            height: 32px;
            background: $brand-color;
            border-radius: 2px;
            font-size: 14px;
            line-height: 20px;
            color: #ffffff;
            margin-top: 10px;
            cursor: pointer;
        }
    }
}
</style>
