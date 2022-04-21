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
    <div class="header">
        <div class="container">
            <div class="left">
                <img :src="getLogo" class="logo" @error="replaceImage" />
                <div class="login" v-if="setting">{{ setting.name }}</div>
                <div class="login" v-else></div>
            </div>
            <div class="right" v-if="user.username">
                <span>{{ user.username }}</span>
                <Button type="text" class="btn" @click="logOut">退出</Button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState('alone', ['setting', 'user']),
        getLogo() {
            if (this.setting?.logo) {
                return this.$utils.media(this.setting?.logo, 'manage')
            }
            return ''
        }
    },
    methods: {
        toSet() {
            this.$router.push('/account/member')
        },
        logOut() {
            this.$store.dispatch('alone/loginOut').then(() => {
                this.$Message.success('退出成功')
                this.$router.replace({path: '/account/login'})
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.header {
    background: #fff;

    .container {
        display: flex;
        align-items: center;
        height: 70px;
        justify-content: space-between;
        margin: 0 auto;
        width: 1280px;

        .left {
            display: flex;
            align-items: center;
            cursor: pointer;
            .logo {
                max-height: 30px;
                max-width: 120px;
            }
            .login {
                position: relative;
                margin-left: 20px;
                font-size: 16px;
                line-height: 22px;
                color: #262b30;

                &::after {
                    content: "";
                    position: absolute;
                    transform: translateY(-50%);
                    top: 50%;
                    left: -10px;
                    width: 1px;
                    height: 20px;
                    background: #e9edef;
                }
            }
        }

        .right {
            display: flex;
            align-items: center;
            .btn {
                margin-left: 10px;
            }
        }
    }
}
</style>
