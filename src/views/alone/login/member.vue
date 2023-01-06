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
    <div class="container">
        <div class="form-title">个人账号资料设置</div>
        <Form class="form" :label-width="120" :model="model" ref="form" @submit.native.prevent>
            <form-item label="登录账号：" style="margin-bottom: 10px;">
                <div class="user-account">
                    <span class="user-mobile">{{ username }}</span>
                </div>
            </form-item>
            <form-item label="登录密码：">
                <div class="user-account">
                    <span class="user-mobile">********</span>
                    <log-button type="text" @click="toSetPass"
                    >修改密码</log-button
                    >
                </div>
            </form-item>
            <form-item label="个人头像：">
                <Avatar v-model="model.avatar" prop="name"/>
                <kdx-hint-text>建议尺寸：200x200px</kdx-hint-text>
            </form-item>
            <div class="btn" @click="setUserInfo">保存</div>
        </Form>
        <!-- 修改密码 -->
        <alone-modal v-model="showModal" width="510" title="修改密码">
            <Form
                :model="passModel"
                ref="pass"
                :rules="passRules"
                :label-width="100"
            >
                <form-item
                    class="form-item"
                    prop="original_password"
                    label="原密码："
                >
                    <pass-input
                        v-model="passModel.original_password"
                        placeholder="请输入原密码"
                    />
                </form-item>
                <form-item class="form-item" prop="password" label="新密码：">
                    <pass-input
                        v-model="passModel.password"
                        placeholder="请输入新密码"
                    />
                   <kdx-hint-text>请输入8-20位密码，区分大小写</kdx-hint-text>
                </form-item>
            </Form>
            <template #footer>
                <div class="modal-btn" @click="validatePass">
                    修改密码
                </div></template
            ></alone-modal
        >
    </div>
</template>

<script>
import LogButton from './components/Button.vue'
import Avatar from '../components/Avatar.vue'
import PassInput from './components/PassInput.vue'
import AloneModal from '../components/Modal.vue'

import { levelPass, requiredRule } from './components/validateRule'

export default {
    components: {
        Avatar,
        LogButton,
        AloneModal,
        PassInput
    },
    data() {
        return {
            model: {
                avatar: '',
            },
            passModel: {
                original_password: '',
                password: '',
            },
            passRules: {
                original_password: requiredRule('请输入原密码'),
                password: [
                    ...requiredRule('请输入密码'),
                    { pattern: /.{8,20}/, message: '8-20位密码，区分大小写', trigger: 'blur' },
                    {
                        validator: (filed, value, callback) => {
                            if (levelPass(value) >= 2) {
                                callback()
                            } else {
                                callback(new Error('密码强度太低'))
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            },
            username: '',
            showModal: false
        }
    },
    created() {
        this.getUserInfo()
    },
    methods: {
        getUserInfo() {
            return new Promise((resolve) => {
                this.$api.aloneApi.getUserRegist().then(res => {
                    if (res.error == 0) {
                        let { username, profile } = res.user_info
                        if (profile) {
                            let { avatar } = profile
                            this.model.avatar = avatar || ''
                        }
                        this.username = username
                        this.$store.commit('alone/setUserInfo', res.user_info)
                        resolve()
                    }
                })
            })
        },
        validate() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.setUserInfo()
                }
            })
        },
        setUserInfo() {
            this.$api.aloneApi.setUserRegist(this.model).then(res => {
                if (res.error === 0) {
                    this.$Message.success('用户资料设置成功')
                    this.getUserInfo().then(() => {
                        this.handleAjust(res.audit_status)
                    })
                    setTimeout(()=>{
                        this.$router.go(-1);
                    },500)
                }
            })
        },
        handleAjust(status) { // 处理审核状态
            switch (+status) {
                case 10: // 审核成功
                    this.$router.push('/')
                    break;
                case 1:
                default:
                    break;
            }
        },
        toSetPass() {
            this.showModal = true
        },
        validatePass() {
            this.$refs.pass.validate(valid => {
                if (valid) {
                    this.setPass()
                }
            })
        },
        setPass() {
            this.$api.aloneApi.modifyPass(this.passModel).then(res => {
                if (res.error === 0) {
                    this.$Message.success('密码修改成功')
                    this.$store.commit('alone/setLoginStatus', false)
                    this.$store.commit('alone/setUserInfo', {})
                    this.$router.replace('/account/login')
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    margin: 20px auto 60px;
    padding-top: 50px;
    width: 1280px;
    background: #fff;
    flex: 1;

    .form-title {
        font-weight: bold;
        font-size: 24px;
        text-align: center;
        line-height: 34px;
    }

    .form {
        overflow: hidden;
        margin: 40px auto 0;

        width: 470px;

        /deep/ .ivu-form-item-label {
            padding: 8px 10px 8px 0;
        }

        /deep/ .ivu-form-item-content {
            line-height: 36px;
        }

        .user-account {
            display: flex;
            align-items: center;

            .user-mobile {
                margin-right: 10px;
                font-size: 14px;
                color: #262b30;
            }
        }

        .form-input {
            /deep/ .ivu-input {
                border-radius: 4px;
                height: 36px;
                background: #fff;
            }
        }
    }

    .btn {
        margin: 0 auto 50px;
    }

    /deep/ .ivu-modal .ivu-modal-body {
        height: auto;
    }

    .btn,
    .modal-btn {
        border-radius: 2px;
        width: 180px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background: #1154ff;
        cursor: pointer;
    }

    .modal-btn {
        display: inline-block;
    }
}
</style>
