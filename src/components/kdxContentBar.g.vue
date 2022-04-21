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
    <div class="content-bar">
        <div class="content" ref="content_bar" v-error-box='"kdxContentBar"' v-loading="loading">
            <slot></slot>
            <div class="copyright">
                <p>Copyright 2020-2022 青岛开店星信息技术有限公司版权所有<br/> <br/>网站备案号/许可证号：鲁ICP备2021028233号-1</p>
            </div>
        </div>
        <div class="footer-btn" v-if="$slots.btn">
            <slot name="btn"></slot>
        </div>
    </div>
</template>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: "kdxContentBar",
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState('menu', {
            openSubmenu: state => state.openSubmenu
        }),
    },
    methods: {
        // 返回顶部
        returnToTop(top = 0) {
            this.$refs['content_bar']?.scrollTop && (this.$refs['content_bar'].scrollTop = top);
        },
        handleScroll(callback) {
            this.$refs['content_bar'].addEventListener('scroll', e => {
                if (typeof callback === 'function') {
                    callback(e);
                }
            })
        }
    },
    mounted() {
        this.handleScroll();
    }
};
</script>

<style scoped lang="scss">
.content-bar {
    width: 100%;
    /*min-width: 1336px;*/
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;

    > .content {
        flex: 1;
        overflow-y: auto;
        position: relative;
        border-radius: 2px;

        .copyright {
            width: 100%;
            /*padding: 20px 0;*/
            padding: 20px 0;
            text-align: center;
            @include font-12-16;
            color: $text-zhushi;

            /deep/ a {
                color: $text-zhushi;
            }
        }
    }

    > .footer-btn {
        flex: 0;
        border-top: 1px solid $border-color;
        padding: 16px 0 16px 160px; // border-top: 1px solid $border-color;
        box-sizing: border-box;
        bottom: 0;
        /*width: 100%;*/
        border-radius: 2px;
        background-color: #FFFFFF;
        z-index: 10;

        > .ivu-btn {
            margin-right: 20px;
        }
    }
}
</style>
