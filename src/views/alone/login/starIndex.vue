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
    <div class="login-form">
        <div class="login-form_top">

            <img class="login-form_logo"
                 :src="getLogo"
                 alt="">
        </div>
        <div class="login-form_bt">
            <div class="login-form_form">
                <Form
                    label-position="top"
                    :model="model"
                    :rules="rules"
                    ref="form"
                    @submit.native.prevent
                >
                    <form-item label="手机号码" prop="username">
                        <log-input
                            :class="[focusInput === 'Mobile' ? 'input-focus' :'']"
                            @on-focus="onFocus('Mobile')"
                            @on-blur="onBlur"
                            v-model="model.username"
                            @on-enter="toLogin"
                            placeholder="请输入登录账号"
                        />
                    </form-item>
                    <form-item
                        label="密码"
                        prop="password"
                        style="margin-bottom: 20px"
                    >
                        <pass-input
                            :class="[focusInput === 'Pass' ? 'input-focus' :'']"
                            @on-focus="onFocus('Pass')"
                            @on-blur="onBlur"
                            v-model="model.password"
                            @on-enter="toLogin"
                            placeholder="请输入密码"
                        />
                    </form-item>
                </Form>

                <div class="login-form_pass">
                    <Checkbox v-model="rememberStatus" style="transform: scale(0.9)" label=""
                    >记住密码
                    </Checkbox
                    >
                </div>
                <div class="login-form_submit">
                    <log-button @click="toLogin" long>登录</log-button>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import LogInput from './components/LogInput.vue'
import PassInput from './components/PassInput.vue'
import LogButton from './components/Button.vue'

import {mapState} from 'vuex'

import {requiredRule} from './components/validateRule.js'

export default {
    components: {
        LogInput,
        PassInput,
        LogButton
    },
    data() {
        return {
            rememberStatus: true,
            focusInput: '',
            model: {
                username: '',
                password: ''
            },
            rules: {
                username: requiredRule('请输入登录账号'),
                password: requiredRule('请输入密码')
            },
            showCode: false
        }
    },
    created() {
        this.model.username = localStorage.getItem('username') || ''
        this.model.password = localStorage.getItem('password') || ''
    },
    computed: {
        ...mapState('alone', {
            setting: state => state.setting || {},
            qrcode_url: state => state.qrcode_url
        }),
        getLoginBg() {
            if (this.setting.login_show_img) {
                return this.setting?.login_show_img.length == '0' ? require('@/assets/image/alone/store/login_bg.png') : this.$utils.media(this.setting?.login_show_img, 'manage')
            } else {
                return require('@/assets/image/alone/store/login_bg.png')
            }
        },
        getLogo() {
            return require('@/assets/image/alone/store/loginLogo.png')
        }
    },
    methods: {
        onFocus(focusName) {
            this.focusInput = focusName
        },
        onBlur() {
            console.log('blur')
            this.focusInput = ''
        },
        toForget() {
            this.$router.push('/account/forget')
        },

        toLogin() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.submitLogin()
                }
            })
        },
        submitLogin() {
            let {username, password} = this.model

            this.$api.aloneApi.submitLogin(this.model).then(res => {
                let {error} = res
                if (error === 0) {
                    localStorage.setItem('userId', res.user.id)
                    if (this.rememberStatus) {
                        localStorage.setItem('username', username)
                        localStorage.setItem('password', password)
                    } else {
                        localStorage.removeItem('username')
                        localStorage.removeItem('password')
                    }
                    this.$store.commit('alone/setLoginStatus', true)
                    this.$router.push("/");
                } else if (error == 110022) {
                    this.$store.commit('alone/setLoginStatus', true)
                    // 当前已经登录
                    this.$router.replace({path: '/'})
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.login-form {
    position: relative;
    margin: auto;
    transform: translateY(-15px);
    border-radius: 10px;
    width: 490px;
    height: 630px;
    background: #FFFFFF;
    box-shadow: 0px 0px 30px rgba(133, 148, 162, 0.2);
    display: flex;
    align-items: center;
    flex-direction: column;

    /deep/ .ivu-form-item-error .ivu-input {
        border: 1px solid #ed4014 !important
    }

    /deep/ .input-focus {
        position: relative;
        z-index: 10;

        .ivu-input-group-append i {
            color: var(--theme-color);
            font-weight: bold;
        }

        &:before {
            content: '';
            width: 2px;
            height: 100%;
            position: absolute;
            left: -1px;
            top: 0;
            z-index: 10;
            background-color: var(--theme-color);
        }

        &:after {
            content: '';
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 10px;
            z-index: -1;
            background-color: var(--theme-color);
            filter: blur(10px);
            opacity: 1;
            opacity: 0.08;
        }
    }

    &_ {
        &top {
            padding-top: 60px;
            display: flex;
            align-items: center;
            justify-content: center;

            h1 {
                color: var(--theme-color);
                font-size: 44px;
            }
        }

        &logo {
            width: 200px;
            height: 100px;

        }

        &bt {
            padding-top: 78px;
        }

        &pass {
            /deep/ .ivu-checkbox-wrapper {
                color: #262B30;
                font-size: 14px;
            }
        }

        &submit {
            width: 370px;
            height: 50px;
            position: absolute;
            left: 60px;
            bottom: 83px;
        }
    }

}
</style>
