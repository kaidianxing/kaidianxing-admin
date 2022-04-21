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
    <div class="shop-page-template-list" v-loading="loading">
        <ul>
            <!--新增模板-->
            <li @click="addModule">
                <div class="page-add-icon">
                    <img src="@/assets/image/shop/add-page.png" alt="">
                </div>
                <div class="footer">
                    <div class="title">
                        <span class="page-title">空白页</span>
                    </div>
                    <Button class="primary-border">立即创建</Button>
                </div>
            </li>
            <li v-for="item in data" :key="item.id" @click="handleUsing(item)">
                <div class="page-image">
                    <img :src="$media(item.thumb)" alt="" @error="replaceImage($event, 'template')">
                </div>
                <div class="footer">
                    <div class="title">
                        <span class="default">默认</span>
                        <span class="page-title">{{item.name}}</span>
                    </div>
                    <template v-if="type === 'custom'">
                        <Button class="primary-border" v-if="item.is_used == '1'">应用中</Button>
                        <Button class="primary-border" v-else>立即使用</Button>
                    </template>
                    <template v-else>
                        <Button class="primary-border">立即使用</Button>
                    </template>
                </div>
            </li>
            <!--更多-->
            <li class="more" v-if="isShowMore">
                <div class="text">
                    <p>更多模板</p>
                    <p>敬请期待</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "PageTemplateList",
        props: {
            data: {
                type: Array,
                default: () => []
            },
            type: {
                type: String,
                required: true
            },
            loading: {
                type: Boolean,
                default: false
            },
            pageNow: {
                type: Number,
                default: 1
            },
            pageCount: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {};
        },
        computed: {
            isShowMore() {
                if (this.type !== 'custom' && (this.pageNow === this.pageCount || this.pageCount === 0)) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        methods: {
            addModule() {
                let path = '';
                if (this.type === 'index') {
                    path = '/decorate/index'
                } else if (this.type === 'detail') {
                    path = '/decorate/goods-detail';
                } else if (this.type === 'vip') {
                    path = '/decorate/vip-center';
                } else if (this.type === 'commission') {
                    path = '/decorate/commission';
                } 
                this.$router.push({
                    path: path
                });
            },
            handleUsing(row) {
                this.$emit('on-using', row);
            }
        }
    };
</script>

<style scoped lang="scss">
    .shop-page-template-list {
        /*padding: 20px;*/
        background-color: #ffffff;
        position: relative;

        > ul {
            display: flex;
            flex-wrap: wrap;

            > li {
                margin-right: 30px;
                border-radius: 2px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                margin-bottom: 30px;
                box-shadow: $shadow-card;
                cursor: pointer;

                > .page-image {
                    border-radius: 6px 6px 0 0;
                    width: 225px;
                    height: 326px;
                    overflow: hidden;
                    box-sizing: border-box;
                   // border: 1px solid $border-color;
                    background-color: $brand-hover;

                    > img {
                        width: 225px;
                        height: 100%;
                        box-sizing: border-box;
                        border-radius: 6px 6px 0 0;
                    }
                }

                > .page-add-icon {
                    @extend .page-image;
                    text-align: center;
                    cursor: pointer;
                    position: relative;
                    > img {
                        position:absolute;
                        top:0;
                        left:0;
                        right:0;
                        bottom:0;
                        margin:auto;
                        width: 80px;
                        height: 80px;
                    }
                }

                > .footer {
                    padding: 10px 0;
                    text-align: center;

                    .title {
                        margin-bottom: 10px;
                        line-height: 20px;

                        > .default {
                            color: $brand-color;
                            background-color: $brand-light;
                            padding: 2px 8px;
                            border-radius: 2px;
                            margin-right: 8px;
                            font-size: 12px;
                        }

                        > .page-title {
                            @include font-14-20-bold;
                            color: $text-first;
                        }
                    }

                    .ivu-btn {
                        @include font-12-16;
                    }
                }
                &:hover {
                    border: 1px solid $brand-color;
                    >.footer {
                        .ivu-btn {
                            background-color: $brand-color;
                            color: #FFFFFF;
                            border-radius: 2px;
                        }
                    }
                }
            }

            > .more {
                width: 225px;
                height: 404px;
                box-sizing: border-box;
                background-color: $background-color;
                border: 1px dotted $border-color;
                box-shadow: none;
                border: none;
                cursor: inherit;
                &:hover {
                    border: none;
                }

                > .text {
                    position: relative;
                    top: 50%;
                    bottom: 50%;
                    transform: translateY(-20px);

                    > p {
                        @include font-14-20;
                        color: $text-third;
                        text-align: center;
                    }
                }
            }
        }
    }
</style>
