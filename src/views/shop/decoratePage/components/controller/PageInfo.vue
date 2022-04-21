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
    <div class="pageInfo" v-if='currentModal.id=="pageInfo"&&lazyLoad'>
        <!-- 装修页面的页面设置 -->
        <page v-if='pageId=="page"'></page>
        <!-- 装修海报的海报设置 -->
        <poster v-else-if='pageId=="poster"'></poster>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import Poster from './PageInfo/Poster.vue'
    import Page from './PageInfo/Page.vue'
    export default {
        mixins: [mixin],
        components: {
            Page,
            Poster
        },
        data() {
            return {
                id: 'pageInfo'
            }
        },
        computed: {
            pageId() {
                let path = this.$route.path;
                let routes = {
                    '/decorate/:page': 'page',
                    '/decorate/poster/:page': 'poster',
                };
                for (let route in routes) {
                    if (this.$utils.samePath(route,path)) {
                        return routes[route];
                    }
                }
                return ''
            }
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>
