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
    <div class="shop-app-page">
        <ul>
            <li v-for="(item, index) in data" :key="index">
                <div class="page-label shouye" v-if="item.type == '1'">
                    <kdx-svg-icon type="icon-shouye1"></kdx-svg-icon>
                    <span>商城菜单</span>
                </div>
                <div class="page-label fenxiao" v-else-if="item.type == '2'">
                    <kdx-svg-icon type="icon-fenxiao"></kdx-svg-icon>
                    <span>分销菜单</span>
                </div>
                <div class="page-label" v-else-if="item.type == '3'">
                    <span>自定义菜单</span>
                </div>
                <div class="page-title">
                    {{item.name}}
                </div>
                <div class="update-time">
                    修改时间：{{item.updated_at === '0000-00-00 00:00:00'? item.created_at : item.updated_at}}
                </div>
                <!--menu图标-->
                <div class="menu-image">
                    <img :src="item.thumbnail" alt="">
                </div>
                <Button class="default-primary" @click="replacePage(item)">
                    替换
                </Button>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "MenuSettingList",
        props: {
            type: {
                type: String,
                default: 'edit'
            },
            data: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            replacePage(row) {
                this.$emit('on-replace', row);
            }
        }
    };
</script>

<style scoped lang="scss">
    .shop-app-page {
        > ul {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: -20px;
            > li {
                margin-right: 20px;
                margin-bottom: 20px;
                border-radius: 2px;
                padding: 20px;
                box-sizing: border-box;
                min-width: 300px;
                box-shadow: $shadow-card;
                > div {
                    margin-bottom: 10px;
                    @include font-12-16;
                    color: $text-second;
                }
                > .page-label {
                    display: inline-block;
                    padding: 3px 4px;
                    border-radius: 2px;
                    > .svg-icon {
                        font-size: 14px;
                        vertical-align: top;
                        margin-right: 3px;
                    }
                }
                > .shouye {
                    color: $brand-color;
                    background-color: $brand-light;
                }
                > .fenxiao {
                    color: $warning-color;
                    background-color: $warning-light;
                }
                > .page-title {
                    @include font-14-20-bold;
                    color: $text-first;
                }
                .ivu-btn {
                    margin-right: 10px;
                }
                .menu-image {
                    width: 300px;
                    border-radius: 2px;
                    border: 1px solid $border-color;
                    margin-bottom: 20px;
                    margin-top: 20px;
                    > img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
</style>
