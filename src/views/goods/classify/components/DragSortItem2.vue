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
    <!--第一层级-->
    <div class="tree-table">
        <!--第二层级-->
        <div class="content content-bg-two" :key="value.id" >
            <div class="icon">
                <Icon type="md-menu" />
            </div>
            <div class="tree">
                <!--第二层级-->
                <div class="content two">
                    <kdx-svg-icon type="icon-cengji" class="level-icon"></kdx-svg-icon>
                    <div class="icon-box">
                        <div v-if="level === '2' && value.children && value.children.length > 0">
                            <span :class="{'iconfont icon-full-down':value.expand, 'iconfont icon-full-right': !value.expand}" @click="handlers('setExpand')"></span>
                        </div>
                    </div>
                    <span class="title">二级</span>
                    <Input v-model="value.name" maxlength="10" :disabled='noManagePerm' show-word-limit class="width-200" placeholder="请输入分类名称" />
                    <Button v-if="level === '2'" type="text" :disabled='noManagePerm' @click="handlers('addThreeChild')">+添加三级分类</Button>
                </div>
            </div>
            <!--分类图片-->
            <div class="image">
                <div v-show="value.thumb" class="image-content">
                    <img :src="$media(value.thumb)" alt="" @error="replaceImage">
                    <Icon type="ios-close-circle" class="close" @click="handlers('deleteImage')" v-if='!noManagePerm' />
                    <div class="single-replace" @click="handlers('addImage')" v-if='!noManagePerm'>
                        替换
                    </div>
                </div>
                <div class="add-image" v-show="!value.thumb" @click="handlers('addImage')">
                    <kdx-svg-icon type="icon-tianjia" class="icon"></kdx-svg-icon>
                </div>
            </div>

            <!--添加时间-->
            <div class="add-time">
                {{value.created_at}}
            </div>
            <!--状态-->
            <div class="status">
                <span :class="value.status==1?'show':'hide'">{{value.status==1?'显示中':'已隐藏'}}</span>
            </div>
            <!--操作-->
            <div class="action">
                <template v-if="value.id">
                    <Button v-if="value.id.indexOf('cus_') == -1" type="text" :disabled='noManagePerm' @click="handlers('setIsShow')">{{value.status==1?'隐藏':'显示'}}</Button>
<!--                    <kdx-hint-tooltip type="qrCode" :url="value.image" text="复制商品分类链接">-->
<!--                        <Button type="text">预览</Button>-->
<!--                    </kdx-hint-tooltip>-->
                </template>
                <Button type="text" :disabled='noManagePerm' @click="handlers('handleDelete')">删除</Button>
            </div>
        </div>
        <!--第三层级-->
        <div v-if="value.children && value.children.length > 0&&value.expand">
            <slot :data='value.children'></slot>
        </div>
    </div>
</template>

<script>
    import {
        mapState,
    } from 'vuex'
    export default {
        computed: {
            noManagePerm() { //管理权限
                return !this.$getPermMap('goods.category.manage')
            },
            ...mapState('createGoodClassification', {
                level: state => state.level,
            }),
        },
        props: {
            value: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            handlers(event) {
                this.$emit('handler', {
                    event,
                    params: this.value
                })
            }
        }
    };
</script>

<style scoped lang="scss">
    .tree-table {
        border-radius: 2px;
        .content {
            border-bottom: 1px solid $border-color;
            display: flex;
            flex-wrap: nowrap;
            @include font-14-20;
            color: $text-first;
            /*height: 72px;*/
            align-items: center;
            .icon-box {
                width: 20px;
                height: 20px;
                display: inline-block;
                cursor: pointer;
                .iconfont {
                    font-size: 18px;
                    color: $text-zhushi;
                    &:hover{
                        color: $brand-color;
                    }
                }
            }
            .icon {
                padding: 0 20px;
                cursor: move;
            } // 层级前面的图标
            .level-icon {
                color: $text-zhushi;
                padding-right: 15px;
            }
            >.tree {
                padding: 0 10px;
                @include font-14-20-bold;
                color: $text-first;
                min-width: 450px;
                flex: 1;
                >.content {
                    >.title {
                        padding: 0 10px;
                    }
                    >button {
                        margin-left: 20px;
                    }
                    >.ivu-input-wrapper {
                        margin: 20px 0;
                    }
                    >i {
                        cursor: pointer;
                    }
                    .icon {
                        color: $text-zhushi;
                    }
                }
                >.two {
                    padding-left: 60px;
                    border-bottom: none;
                    .title {
                        color: $text-second;
                    }
                }
                >.three {
                    padding-left: 160px;
                    .title {
                        color: $text-third;
                    }
                }
            }
            >.image {
                max-width: 100px;
                min-width: 80px;
                padding: 0 10px;
                flex: 1;
                >.image-content {
                    width: 40px;
                    height: 40px;
                    position: relative;
                    &:hover {
                        >.close {
                            display: block;
                            color: $text-zhushi;
                        }
                        >.shade {
                            display: block;
                        }
                        >.single-replace {
                            display: block;
                        }
                    }
                    >img {
                        width: 40px;
                        height: 40px;
                        box-sizing: border-box;
                        border-radius: 2px;
                        border: 1px solid $border-color;
                    }
                    >.close {
                        position: absolute;
                        top: -10px;
                        right: -10px;
                        font-size: 20px;
                        cursor: pointer;
                        color: $text-zhushi;
                        display: none;
                        &:hover {
                            color: $text-second;
                        }
                    }
                    >.single-replace {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        height: 20px;
                        cursor: pointer;
                        background-color: rgba(0, 0, 0, 0.7);
                        text-align: center;
                        line-height: 20px;
                        color: #ffffff;
                        font-size: 12px;
                        display: none;
                    }
                }
                >.add-image {
                    width: 40px;
                    height: 40px;
                    box-sizing: border-box;
                    border: 1px solid $border-color;
                    border-radius: 2px;
                    position: relative;
                    .icon {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: -20px;
                        right: 0;
                        color: $brand-color;
                        font-size: 40px;
                        cursor: pointer;
                    }
                }
            }
            >.id {
                max-width: 60px;
                min-width: 40px;
                padding: 0 10px;
                flex: 1;
                word-break: normal;
            }
            >.add-time {
                max-width: 150px;
                min-width: 120px;
                padding: 0 10px;
                flex: 1;
                word-break: normal;
            }
            >.status {
                width: 80px;
                padding: 0 10px;
                /*flex: 1;*/
                >.show {
                    color: #19BE6B;
                }
                >.hide {
                    color: #939799;
                }
            }
            >.action {
                min-width: 120px;
                max-width: 200px;
                padding: 0 10px;
                flex: 1;
                .ivu-btn-text {
                    margin-right: 10px;
                }
            }
        }
        .content-bg-one {
            background-color: #F4F6F8;
        }
        .content-bg-two {
            background-color: #FAFDFF;
        }
        .content-bg-three {
            background-color: #FFFDF9;
        }
    }
</style>
