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
        <p v-if='!data.length' style='text-align: center'>还没有启用的超级海报哦！</p>
        <ul v-else>
            <li v-for="(item, index) in data" :key="index">
                <div class="page-image">
                    <img :src="$utils.media(item.thumb)" alt="">
                </div>
                <div class="page-content">
                    <div class="page-label index" v-if="item.type == '10'">
                        <i class='icon-shangpinleixing-shitishangpin-line1 iconfont' :style="{color:$css['--theme-color']}"></i>
                        <span>商品海报</span>
                    </div>
                    <div class="page-label detail" v-else-if="item.type == '20'">
                        <i class='icon-fenxiao31 iconfont' style='color:#ff9900'></i>
                        <span>分销海报</span>
                    </div>
                    <div class="page-title">
                        {{item.name}}
                    </div>
                    <div class="page-keyword">
<!--                        关键字：{{item.keywords||'暂无'}}-->
                    </div>
                    <div class="update-time">
                        修改时间：{{item.updated_at === '0000-00-00 00:00:00'? item.created_at : item.updated_at}}
                    </div>
                    <div class="bottom-btn">
                        <Button v-if="buttonType" class="default-primary" :disabled="noManagePerm" @click='clickButton(item)'>
                            {{buttonType.name}}
                        </Button>
                        <Button class="default-primary" @click='getPreviewUrl(item)'>
                            <span>查看</span>
                        </Button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "AppPage",
        props: {
            type: {
                type: String,
                default: 'edit'
            },
            data: {
                type: Array,
                default: () => []
            },
            goodsId: {
                type: String,
                default: '0'
            }
        },
        data() {
            return {
            }
        },
        computed: {
            buttonType() {
                if (this.type == 'edit') {
                    return {
                        name: '编辑'
                    };
                } else if (this.type == 'replace') {
                    return {
                        name: '替换'
                    };
                }
                return null;
            },
            noManagePerm(){//无管理权限
                return !this.$getPermMap('poster.manage')
            },
        },
        methods: {
            clickButton(item) {
                if (this.type === 'edit') {
                    this.$emit('on-edit', item);
                } else if (this.type === 'replace') {
                    this.$emit('on-replace', item);
                }
            },
            getPreviewUrl(item) {
                this.$emit('on-preview',{
                    previewUrl:this.$utils.media(item.thumb)
                })
            }
        }
    };
</script>

<style  lang="scss">

.preview-poster-modal{
    
    .ivu-modal{
        width:700px;
        position: relative;
    }
    .poster-phone{
        width:300px;
        display:block;
        margin:40px auto 60px;
    }
    .poster-img{
        position:absolute;
        top: 170px;
        left: 0;
        right: 0;
        margin: auto;
        width: 259px;
        height: 458px;
    }
    .ivu-modal-body{
        overflow: hidden;
    }
    .ivu-modal-footer{
        display:none;
    }
}
</style>
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
                box-shadow: $shadow-card;
                display: flex;
                flex-wrap: nowrap;
                padding: 10px 0 10px 10px;
                > .page-image {
                    width: 112px;
                    height: 160px;
                    overflow: hidden;
                    > img {
                        width: 112px;
                        height: 100%;
                        border-radius: 2px;
                    }
                }
                > .page-content {
                    position: relative;
                    padding: 0 20px;
                    width: 230px;
                    font-weight: 400;
                    > div {
                        margin-bottom: 10px;
                        @include font-12-16;
                        color: $text-second;
                    }
                    > .page-label {
                        display: inline-block;
                        padding: 3px 4px;
                        border-radius: 2px;
                        margin-top: 10px;
                        > .iconfont {
                            display: inline-block;
                            font-size: 14px;
                            vertical-align: top;
                            margin-right: 3px;
                        }
                    }
                    > .page-label.index {
                        color: $brand-color;
                        background-color: $brand-light;
                    }
                    > .page-label.detail {
                        color: $warning-color;
                        background-color: $warning-light;
                    }
                    > .page-label.vip {
                        color: $success-color;
                        background-color: $success-light;
                    }
                    > .page-title {
                        width: 100%;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                        @include font-14-20-bold;
                        color: $text-first;
                    }
                    .bottom-btn {
                        position: absolute;
                        left: 20px;
                        bottom: 7px;
                        margin-bottom: 0;
                        .ivu-btn {
                            margin-right: 10px;
                            .iconfont {
                                padding-left: 4px;
                                font-size: 16px;
                                line-height: 16px;
                            }
                        }
                    }
                }
            }
        } 
    }
</style>

