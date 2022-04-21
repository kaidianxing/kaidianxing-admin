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
    <div class="notice-buyer-list-box">
        <div class="line"></div>
        <div class="notice-buyer-list-index">
            <notice-list :type="type" @toDetail="toDetail"></notice-list>
        </div>
    </div>

</template>

<script>
    import noticeList from '@/components/notice/noticeList';

    export default {
        name: "index",
        components: {
            noticeList
        },
        props: {},
        data() {
            return {
                type: {}
            };
        },
        computed: {},
        watch: {
            '$route.params': {
                handler(newValue) {
                    this.type = {
                        group_name: 'buyer_notice',
                        group_item_name: newValue.type
                    };
                },
                immediate: true
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            toDetail(obj) {
                this.$router.push({
                    path: `/notice/buyer/${this.type.group_item_name}/index`,
                    query: {
                        type_code: obj.type_code,
                        items: obj.items
                    },
                });
            }
        },
    };
</script>

<style lang="scss">
    .notice-buyer-list-box {
        margin-top: 20px;
        background-color: #ffffff;

        .notice-buyer-list-index {
            padding: 40px;
            /*margin-top: 20px;*/
            min-height: 100%;
            background-color: #FFFFFF;
        }

        .line {
            height: 10px;
            background-color: $background-color;
        }

        .app-overdue-hint {
            margin-bottom: 0;
        }
    }
</style>
