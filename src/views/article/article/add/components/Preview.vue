/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="left">
        <div class="preview-title">文章预览</div>
        <div class="preview-box">
            <div class="preview-top">
                <div>文章详情</div>
                <img src="@/assets/image/article/preview_top.png" alt="">
            </div>
            <div v-if="model.top_thumb_type == 0 && model.top_thumb">
                <img class="top-thumb" :src="$utils.media(model.top_thumb)" alt="">
            </div>
            <div class="swiper-wrap" v-if="model.top_thumb_type == 1 && model.top_thumb_all.length">
                <MySwiper 
                    ref="swiper" 
                    :list='getImgs'
                    :imgStyle="imgStyle"
                    :setting='setting'>
                </MySwiper>
            </div>
            <div class="preview-content">
                <div class="article-title">
                    <span class="topping">置顶</span>
                    {{ model.title || "此处是文章标题" }}
                </div>
                <div class="article-info">
                    <span class="author">{{model.author}}</span>
                </div>
                <div class="article-content" v-html="model.content_origin"></div>
                <div class="article-bottom">
                    <span class="date">{{model.date || '2020-07-12 12:00:00'}}</span>
                    <div v-if="model.read_number_status == 1" class="article-read">阅读数：9999+</div>
                </div>
            </div>
            <div class="btn-bottom">
                <div class="layer-group">
                    <div v-if="customer != 0" class="btn">
                        <i class="icon iconfont-m- icon-m-zujian-kefu"></i>
                    </div>
                    <div v-if="model.goods_ids.length" class="btn btn-b">
                        <span class="badge">{{model.goods_ids.length}}</span>
                        <i class="icon iconfont-m- icon-m-gouwudai"></i>
                    </div>
                    <div v-if="model.enclosure_status == 1 && model.enclosure_name" class="btn">
                        <i class="icon iconfont-m- icon-m-xiazai"></i>
                    </div>
                </div>
                <div class="navbar">
                    <div class="line"></div>
                    <div class="navbar-btn">
                        <div class="navbar-l no-submit">
                            <span class="navbar-item">
                                <i class="icon iconfont-m- icon-m-shoucang"></i>
                                9999+
                            </span>
                            <span class="navbar-item" v-if="model.thumps_up_status == 1">
                                <i class="icon iconfont-m- icon-m-dianzan1"></i>
                                9999+
                            </span>
                            <span class="navbar-item">
                                <i class="icon iconfont-m- icon-m-fenxiang"></i>
                                9999+
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MySwiper from '@/views/shop/decoratePage/components/templates-shim/Swiper.vue'
export default {
    props: ['p_model'],
    components: {
        MySwiper 
    },
    data() {
        return {
            model: {
                title: "",
                author: "",
                date: "",
                content_origin: "",
                goods_ids: [],
                read_number_status: "",
                thumps_up_status: "",
            },
            swiper: {
                current: 0,
                spaceBetween: 13,
                slidesPerView: "auto",
                centeredSlides: true,
            },
            setting: {
                autoplaySpeed: 5000,
                autoplay: true,
                loop: true
            },
            imgStyle:{
                width: "100%",
                height:'160px',
            },
            customer: "0"
        }
    },
    mounted() {
        this.getSettings()
    },
    computed: {
        readNumber() {
            return this.model.read_number > 9999 ? "9999+" : this.model.read_number
        },
        address() {
            let res = "";
            this.model.selectedAddress.forEach(item => {
                res += item
            });
            res += this.model.detail;
            return res
        },
        getImgs(){
            let res = this.model.top_thumb_all.map(v=>this.$utils.media(v))
            console.log(this.model.top_thumb_all, res)
            return res
        },
    },
    watch: {
        p_model: {
            handler(value) {
                this.model = {
                    ...this.model,
                    ...value,
                }
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        getSettings() {
            this.$api.articleApi.getArticleSettings().then((res) => {
                if (res.error === 0) {
                    this.customer = this.model.customer_channel;
                }
            })
        },
    }
}
</script>

<style lang="scss">
@import "/static/dist/shop/tinymce/tinymce.css";
.article-coupon, .article-goods {
    width: auto;
}
</style>
<style scoped lang="scss">
.left {
    width: 380px;
    height: calc(100vh - 110px - 20px);
    padding-bottom: 20px;
    box-sizing: border-box;
    overflow-y: hidden;
    background-color: #fff;
    flex-shrink: 0;
    margin-right: 20px;
    margin-top: 20px;
    overflow: auto;
    .preview-title {
        padding: 40px 0;
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
        
    }
    .preview-box {
        position: relative;
        transform: scale(0.8);
        transform-origin: top;
        width: 375px;
        min-height: 667px;
        margin: 0 auto;
        box-shadow: 0px 4px 8px rgba(133, 148, 162, 0.3);
        border-radius: 6px;
        overflow-x: hidden;
        .preview-top {
            position: relative;
            height: 64px;
            padding-top: 22px;
            font-size: 16px;
            line-height: 40px;
            text-align: center;
            img {
                position: absolute;
                top: 0;
                left: 0;
                z-index: -1;
            }
        }
        .top-thumb {
            display: block;
            width: 100%;
        }
        .preview-content {
            min-height: 603px;
            padding: 16px;
            padding-bottom: 104px;
            &.activity {
                padding-bottom: 74px;
            }
            .article-title {
                font-weight: bold;
                line-height: 24px;
                margin-bottom: 12px;
            }
            .topping {
                display: inline-block;
                line-height: 14px;
                padding: 1px 4px;
                font-weight: normal;
                color: #fff;
                background: #ff3c29;
                border-radius: 2px;
                font-size: 10px;
                vertical-align: text-bottom;
            }
            .article-info {
                display: flex;
                justify-content: space-between;
                line-height: 17px;
                font-size: 12px;
                color: #969696;
                margin-bottom: 24px;
            }
            .article-activity {
                display: flex;
                font-size: px2rpx(12);
                color: #565656;
                margin-bottom: px2rpx(8);
                .address {
                    width: calc(100% - 65px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .iconfont-m- {
                    font-size: px2rpx(14);
                    width: px2rpx(18);
                    height: px2rpx(18);
                    border-radius: 50%;
                    text-align: center;
                    line-height: px2rpx(18);
                    background: #FFF3F5;
                    color: #FF3C29;
                    margin-left: px2rpx(8);
                }
            }
            .article-content {
                font-weight: normal;
                margin-bottom: 16px;
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
                /deep/ table {
                    width: 100%!important;
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
            .article-bottom {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                line-height: 16px;
                color: #969696;
            }
            .article-bottom-btn {
                line-height: px2rpx(36);
                margin-top: 24px;
                text-align: center;
                color: #FF3C29;
                border: 1px solid #FF3C29;
                border-radius: 30px;
            }
        }
        .btn-group {
            position: absolute;
            bottom: 24px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            padding: 0 12px;
            .btn {
                height: 56px;
                background: rgba($color: #fff, $alpha: 0.8);
                filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.15));
                border-radius: 6px;
                &.btn-l {
                    width: fit-content;
                    padding: 12px;
                    display: flex;
                    span {
                        display: inline-block;
                        width: 32px;
                        height: 32px;
                        position: relative;
                        border-radius: 50%;
                        background: #fff;
                        color: #fff;
                        text-align: center;
                        line-height: 32px;
                        margin-right: px2rpx(8);
                        &:last-child {
                            margin-right: 0;
                        }
                        .icon {
                            color: #FF3C29;
                            font-size: 32px;
                        }
                        .badge {
                            position: absolute;
                            top: -9px;
                            right: -9px;
                            width: 28px;
                            height: 28px;
                            background: #FF3C29;
                            border-radius: 50%;
                            border: 2px solid #fff;
                            color: #fff;
                            font-size: 18px;    
                            text-align: center;
                            line-height: 26px;
                            transform: scale(.5);
                        }
                    }
                }
                &.btn-r {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 12px 8px;
                    color: #969696;
                    font-size: 10px;
                    line-height: 14px;
                    span {
                        display: flex;
                        flex-direction: column;
                        margin-right: 14px;
                        text-align: center;
                        &:last-child {
                            margin-right: 0;
                        }
                    }
                    .icon {
                        font-size: 24px;
                        line-height: 24px;
                        color: #FF3C29;
                    }
                }
            }
        }
        .btn-bottom {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            .layer-group {
                position: absolute;
                bottom: px2rpx(68);
                right: px2rpx(14);
                .btn {
                    width: px2rpx(40);
                    height: px2rpx(40);
                    text-align: center;
                    line-height: px2rpx(40);
                    box-shadow: 0px 0px 10px rgba(97, 97, 97, 0.2);
                    border-radius: 50%;
                    background: #fff;
                    margin-bottom: px2rpx(8);
                    .icon {
                        color: #FF3C29;
                        font-size: px2rpx(26);
                    }
                    &.btn-b {
                        .badge {
                            position: absolute;
                            top: -4px;
                            right: -2px;
                            width: 28px;
                            height: 28px;
                            background: #FF3C29;
                            border-radius: 50%;
                            border: 2px solid #fff;
                            color: #fff;
                            font-size: 18px;    
                            text-align: center;
                            line-height: 25px;
                            transform: scale(.5);
                        }
                    }
                }
            }
            .navbar {
                position: absolute;
                bottom: 0;
                width: 100%;
                background: #fff;
                .line {
                    position: absolute;
                    bottom: 52px;
                    height: 1px;
                    background: #E6E7EB;
                    width: 100%;
                }
                .navbar-btn {
                    display: flex;
                    height: 52px;
                    padding: px2rpx(3) px2rpx(8);
                    .navbar-l {
                        display: flex;
                        justify-content: center;
                        text-align: center;
                        &.no-submit {
                            flex: 1;
                            justify-content: space-around;
                        }
                        .navbar-item {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            height: px2rpx(46);
                            width: px2rpx(46);
                            font-size: px2rpx(10);
                            line-height: px2rpx(14);
                            color: #565656;
                        }
                        .iconfont-m- {
                            font-size: px2rpx(22);
                            height: px2rpx(22);
                            line-height: px2rpx(22);
                        }
                    }
                    .navbar-r {
                        flex: 1;
                        margin: px2rpx(4) 0 px2rpx(4) px2rpx(6);
                        background: #FF3C29;
                        color: #fff;
                        text-align: center;
                        line-height: px2rpx(38);
                        font-size: px2rpx(14);
                        font-weight: bold;
                        border-radius: px2rpx(19);
                    }
                }
            }
        }
    }
}
.swiper-wrap {
    margin: px2rpx(8) px2rpx(12);
    border-radius: px2rpx(10);
    overflow: hidden;
}
</style>
