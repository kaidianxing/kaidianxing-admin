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
    <div class="base-detail">
        <div class="box">
            <div class="editor">
                <p class="title">
                    商品详情编辑
                </p>
                <editor v-model="model_content" :height="688"></editor>
            </div>
            <div class="preview">
                <p class="title">
                    商品详情预览
                     <kdx-hint-tooltip type="image" :image="require('@/assets/image/example/shop_detail.png')"></kdx-hint-tooltip>
                </p>
                <div class="page">
                    <div class="img-header">
                        <img
                            src="@/assets/image/shop-detail/top-detail.png"
                            alt=""
                        />
                    </div>
                    <div class="content">
                        <div v-html="model_content"></div>
                    </div>
                    <div class="img-footer">
                        <img
                            src="@/assets/image/shop-detail/foot_tab.png"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Editor from '@/components/Editor'
import { modelMap } from '../base/components/binders'

export default {
    name: 'index',
    components: {
        Editor
    },
    computed: {
        ...modelMap()
    },
}
</script>

<style scoped lang="scss">
.base-detail {
    > .box {
        display: flex;
        flex-wrap: nowrap;
        overflow: hidden;
        padding-bottom: 35px;
        padding-left: 40px;
        height: 100%;
        .title {
            @include font-16-22-bold;
            color: $text-first;
            padding-bottom: 20px;
            text-align: center;
        }
        .editor {
            width: 100%;
        }
        .preview {
            min-width: 515px;
            max-width: 695px;
            flex: 1;
            .page {
                width: 375px;
                border: 1px solid $border-color;
                border-radius: 2px;
                margin: 0 auto;
                overflow: hidden;
                transform: scale(0.8);
                transform-origin: 0 0;
                .content {
                    overflow-y: auto;
                    overflow-x: hidden;
                    height: 534px;
                    word-break: break-all;
                    /deep/ img {
                        max-width: 100% !important;
                    }
                    /deep/ ul {
                        display: block;
                        list-style-type: disc;
                        margin-block-start: 1em;
                        margin-block-end: 1em;
                        margin-inline-start: 0px;
                        margin-inline-end: 0px;
                        padding-inline-start: 40px;
                        li {
                            display: list-item;
                            text-align: -webkit-match-parent;
                            list-style-type: disc;
                        }
                    }
                    /deep/ ol {
                        display: block;
                        list-style-type: disc;
                        margin-block-start: 1em;
                        margin-block-end: 1em;
                        margin-inline-start: 0px;
                        margin-inline-end: 0px;
                        padding-inline-start: 40px;
                        li {
                            display: list-item;
                            text-align: -webkit-match-parent;
                            list-style-type: decimal;
                        }
                    }
                }
                .img-header,
                .img-footer {
                    width: 373px;
                    border-radius: 2px 2px 0 0;
                    > img {
                        width: 100%;
                        border-radius: 2px 2px 0 0;
                        display: block;
                    }
                }
                .img-footer {
                    border-radius: 0 0 2px 2px;
                    > img {
                        width: 100%;
                        border-radius: 0 0 2px 2px;
                    }
                }
            }
        }
    }
}

.ivu-tooltip-popper.ivu-tooltip-light[x-placement] {
    padding: 0;
    .ivu-tooltip-content {
        .ivu-tooltip-inner {
            padding: 6px;
        }

        .ivu-tooltip-arrow {
            display: none;
        }
    }
}
</style>
