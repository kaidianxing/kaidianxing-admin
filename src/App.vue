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
    <div id="app" v-loading="routerEntering">
        <transition name="fade">
            <router-view/>
        </transition>
    </div>
</template>
<script>
import {
    mapState,
    mapGetters
} from 'vuex'


export default {
    computed: {
        ...mapState('layout', {
            routerEntering: state => state.routerEntering,
        }),
        ...mapState('config', {
            user: state => state.user,
        }),
        ...mapState({
            requestInfo: state => state.requestInfo
        }),
        ...mapGetters({
            getRequestInfo: 'getRequestInfo'
        }),
        ...mapState('account', {
            shopId: state => state.shop.shopId,
        }),
    },
    async created() {
        await this.$store.dispatch('config/init')
        localStorage.setItem('shopFlag', 1);
        window.env = {...this.__proto__.process.env}

        window.addEventListener("storage", (e) => {
            // console.log(e)
            if (new Set(['sessionId']).has(e.key)) {
                let content = ''
                content = '账户信息变更，需要刷新后才能继续操作'
                this.$Modal.warning({
                    title: '提示',
                    content,
                    onOk: () => {
                        this.$store.commit('account/setShopInfo', {
                            shopLogo: '',
                            shopName: '',
                        })
                        sessionStorage.clear()
                        location.reload()
                    },
                })
            }
        })
    },
    watch: {
        user: {
            immediate: true,
            handler() {
                if (this.user) {
                    document.getElementById('app-loading').style.display = 'none'
                }
            }
        },
        requestInfo() {
            let settings = this.getRequestInfo?.requestInfo?.settings || {};
            if (this.getRequestInfo?.result?.error != '0' && this.getRequestInfo?.result?.message) {//接口错误
                if (settings.nomessage) {//禁用全局提示，具体参数看@/api/README.md
                    return
                } else {
                    this.$Message.error((settings.errormessage || this.getRequestInfo.result.message) + `[${this.getRequestInfo?.result?.error}]`);
                }
            }
        },
        "$route.path": {
            handler() {
                document.title = this.$route?.name || '';
            },
            immediate: true
        },
    },
    methods: {
    }
}
</script>

<style lang="scss">
/*@import "assets/font/font.css";*/
#app {
    font-family: "PingFang SC", "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background-color: $background-color;
    /*font-weight: 500;*/
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>
