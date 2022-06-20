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
    <div class="layout_page">
        <!--头部-->
        <nav-bar :left="headerLeft"></nav-bar>
        <div class="layout-content">
            <sub-menu @shrink-menu="shrinkMenu"></sub-menu>
            <div class="content" :class="[$route.path === '/plugins/center/index' ? 'calcHeight' : '']">
                <div class="router-view" ref="router_view">
                    <router-view :containerScrollTop='scrollTop'>
                        <div style="width: 100%" :style="{height: copyrightHeight + 'px'}"></div>
                        <div class="copyright" ref="copyright">
                            <p><a href="https://www.kaidianxing.com" target="_blank">青岛开店星信息技术有限公司提供技术支持</a></p>
                            <p v-if="baseSetting.icp_code"><a href="https://beian.miit.gov.cn"
                                  target="_blank">
                                <br/>
                                网站备案号:{{ baseSetting.icp_code || '' }}</a></p>
                        </div>
                    </router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import NavBar from './components/StarNavBar.vue';
import SubMenu from './components/StarSubMenu.vue';

import {
    mapState
} from 'vuex';

let target = null;
export default {
    name: 'index',
    components: {
        SubMenu,
        NavBar,
    },
    provide() {
        return {
            returnToTop: this.returnToTop
        };
    },
    created() {
        this.getInit()
    },
    data() {
        return {
            headerLeft: 120,
            showLoginFlag: false,
            childCallback: null,
            copyrightHeight: 40
        };
    },
    computed: {
        ...mapState('menu', {
            openSubmenu: state => state.openSubmenu
        }),
        ...mapState('config', {
            baseSetting: state => state.baseSetting
        }),
    },
    mounted() {
        this.$refs.router_view.onscroll = (e) => {
            target = e.target;
            if (typeof this.childCallback == 'function') {
                this.childCallback({
                    height: target.clientHeight,
                    scrollTop: target.scrollTop
                });
            }
        };

        this.copyrightHeight = Math.max((this.$refs?.copyright?.clientHeight || 0) + 24, 40)
    },
    methods: {
        scrollTop(callback) {
            if (typeof callback == 'function') {
                this.childCallback = callback;
            }
        },
        // 返回顶部
        returnToTop(top = 0) {
            this.$refs['router_view']?.scrollTop && (this.$refs['router_view'].scrollTop = top);
        },
        // 用于计算menu的宽度
        shrinkMenu(type, distance) {
            if (type === 'nav-menu') {
                this.headerLeft = distance;
            }
        },
        getInit() {
            this.$store.dispatch('alone/getInitInfo').then(res => {
                this.setting = res || {}
            })
        },
    }
};
</script>

<style scoped lang="scss">
.layout_page {
    /*display: flex;*/
    /*flex-wrap: nowrap;*/
    min-width: 1336px;
    overflow-x: auto;
    overflow-y: hidden;

    .layout-content {
        display: flex;

        > .content {
            // margin-top: 56px;
            width: 100%;
            height: calc(100vh - 110px);
            overflow-y: auto;
            overflow-x: hidden;
            position: relative;
            /*background-color: #fff;*/
            &.calcHeight {
                height: calc(100vh - 64px);
            }

            .router-view {
                padding: 0 20px 0 20px;
                height: 100%;
                background-color: $background-color;
                /*box-sizing:border-box;*/
                overflow-y: auto;
                overflow-x: hidden;
                transition: all 10s ease-in-out;
                position: relative;

                .copyright {
                    width: 100%;
                    /*padding: 20px 0;*/
                    text-align: center;
                    @include font-12-16;
                    color: $text-zhushi;
                    position: absolute;
                    bottom: 0px;

                    /deep/ a {
                        color: $text-zhushi;
                    }
                }

                /deep/ > div {
                    position: relative;
                    min-height: 100%;
                }

                .router-top {
                    margin-bottom: 10px;

                }
            }
        }
    }
}
</style>
