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
    <kdx-content-bar>
        <div class="commission-message">
            <Tabs v-model="tabPoint" :animated="false" @on-click="changeTab">
                <TabPane label="买家通知" name="buyer">
                    <notice-list v-if="tabPoint == 'buyer'" :is_title="false" :type="type" @toDetail="toDetail"></notice-list>
                </TabPane>
                <TabPane label="卖家通知" name="seller">
                    <notice-list v-if="tabPoint == 'seller'" :is_title="false" :type="type" @toDetail="toDetail"></notice-list>
                </TabPane>
            </Tabs>
        </div>
    </kdx-content-bar>
</template>

<script>
    import noticeList from '@/components/notice/noticeList'

    export default {
        name: "list",
        components: {
            noticeList
        },
        props: {},
        data() {
            return {
                type: {
                    plugin_name: 'commission',
                    group_name: 'buyer_notice',
                    group_item_name: 'buyer_notice'
                },
                tabPoint: 'buyer',
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            toDetail(obj) {
                if (this.tabPoint == 'seller') {
                    obj.is_showNoticeMember = true
                }
                this.$router.push({
                    path: '/commission/message/index',
                    query: obj,
                })
            },
            changeTab(name) {
                if (name == 'seller') {
                    this.type = {
                        plugin_name: 'commission',
                        group_name: 'seller_notice',
                        group_item_name: 'seller_notice'
                    };
                } else {
                    this.type = {
                        plugin_name: 'commission',
                        group_name: 'buyer_notice',
                        group_item_name: 'buyer_notice'
                    };
                }
                this.tabPoint = name;
            },
        },
    }
</script>

<style lang="scss">
    .commission-message {
        /*padding: 0 40px 40px;*/
        min-height: 100%;
        background-color: #FFFFFF;
        .ivu-tabs-nav {
            margin-left: 29px;
            .ivu-tabs-tab {
                padding: 12px 13px;
                margin-right: 20px;
                @include font-16-22-bold;
            }
        }
        .ivu-tabs {
            .ivu-tabs-content {
                padding: 0 40px;
            }
        }
    }
</style>
