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
    <div class="app-center">
        <div class="app-center-box">
            <application-header
                :keywords="keywords"
                @handleSearch="handleSearch"
                @handleReset="handleReset"
            />
            <app-list v-if="list && list.length > 0" :list="list" @on-route="navTo"></app-list>
            <div class="nodata" v-else-if="!loading && list.length === 0">
                <no-data @handleReset="handleReset"/>
            </div>
        </div>
    </div>
</template>
<script>
import ApplicationHeader from '../components/ApplicationHeader'
import NoData from '../components/NoData'
import AppList from "../components/AppList";
import permMapper from '@/router/router-permit/permMap.js'

export default {
    components: {
        ApplicationHeader,
        NoData,
        AppList,
    },
    data() {
        return {
            keywords: '',
            list: [],
            loading: false,
            permMapper: null,
            buy: {
                data: {}
            }
        }
    },
    created() {
        this.permMapper=permMapper
        this.getAppsList()
    },
    computed: {
        permList() {
            return this.$store.state.config.user?.perms || []
        },
        allRoutes() {
            return this.$store.state.config.routes
        },
    },
    methods: {
        navTo(item) {
            //  && item.plugin_has // 当前后台没有该插件代码
          if (
                item.route &&
                this.permMapper.getPermsMap(this.permList).hasPerm(item.route)
            ) {
                //判断页面权限
                if (item.route) {
                    this.$router.push({
                        path: item.route,
                    })
                } else {
                    this.$Message.info('该功能暂未开启，敬请期待')
                }
            } else {
                this.$Message.info('暂无权限')
            }
        },
        // 获取列表
        getAppsList() {
            this.loading = true
            this.$api.applicationApi['getAppsList']({
                    keywords: this.keywords,
                })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                            if (
                                res.category_list &&
                                res.category_list.length > 0
                            ) {
                                res.category_list.forEach((item) => {
                                    if (item.list && item.list.length > 0) {
                                        item.list.forEach((subItem) => {
                                            subItem['statusFlag'] =
                                                subItem.status === '1'
                                        })
                                    } else {
                                        item.list = []
                                    }
                                })
                            }
                            this.list = res.category_list || []


                    } else {
                        this.$Message.error(res.message)
                    }
                })
        },
        // 搜索
        handleSearch(searchData) {
            this.keywords = searchData.keywords
            this.list = []
            this.getAppsList()
        },
        // 重置
        handleReset() {
            this.keywords = ''
            this.list = []
            this.getAppsList()
        },
    },
}
</script>

<style lang="scss" scoped>
    .app-center {
        display: flex;
        margin: 0px auto;
        flex-direction: column;
        padding: 20px 0;
        width: 100%;
        .app-center-box{
            position: relative;
            background: #ffffff;
            padding: 40px;
            width: 100%;
        }
    }
    @media screen and (max-width: 1500px) {
        .app-center-box {
            width: auto;
            /deep/ .app-list {
                .wrap {
                    ul {
                        li {
                            width: calc(25% - 12px);
                            &:nth-child(4n) {
                                margin-right: 0;
                            }
                        }
                    }
                }
            }
        }
    }
    @media screen and (min-width: 1500px) and (max-width: 1920px) {
        .app-center-box {
            width: 100%;
            /deep/ .app-list {
                .wrap {
                    ul {
                        li {
                            width: 318px;
                        }
                    }
                }
            }
        }
    }
    @media screen and (min-width: 1921px) {
        .app-center-box {
            /*width: auto;*/
            padding-left: 195px;
            padding-right: 195px;
            width: 100%;

            /deep/ .app-list {
                .wrap {
                    ul {
                        li {
                            width: 318px;
                        }
                    }
                }
            }
        }
    }
</style>
