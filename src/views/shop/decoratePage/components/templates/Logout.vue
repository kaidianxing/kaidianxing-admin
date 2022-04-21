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
    <div class='logout'  :style="{paddingTop:px2rpx(componentData.style.margintop),paddingBottom:px2rpx(componentData.style.marginbottom)}" v-if="componentData&&componentData.id=='logout'">
        <div class="container">
            <p class="logout btn"  :style="{background:componentData.style.maincolor,color:componentData.style.subcolor}" @click='logout'>退出登录</p>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'logout',
        methods: {
            changePW() {
                this.$emit('custom-event', {
                    target: 'logout/changePW',
                    data: this.componentData
                })
            },
            logout() {
                this.$emit('custom-event', {
                    target: 'logout/logout',
                    data: this.componentData
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .logout {
        width: 100%;
        .container {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .btn {
                width: px2rpx(351);
                height: px2rpx(40);
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                flex-direction: column;
                text-align: center;
                font-size: px2rpx(14);
                margin: 0 auto;
                border-radius: px2rpx(40);
            }
            .logout {
                background: linear-gradient(172.93deg, $uni-color-primary 0%, #FF6F29 94.38%);
            }
            .changePw {
                border: px2rpx(0.5) solid #ccc;
            }
        }
    }
</style>