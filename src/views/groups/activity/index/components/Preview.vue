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
    <div class="preview-index">
        <div class="preview-title">拼团预览</div>
        <div class="preview-box">
            <div class="img">
                <img :src="require('@/assets/image/top_bg.png')" alt="">
            </div>
            <div class="img">
                <img :src="require('@/assets/image/good_top_bg.png')" alt="">
            </div>
            <div class="goods-img">
                <img :src="$utils.media(data.goods_info.thumb)" @error="replaceImage" alt="">
            </div>
            <!-- 拼团价格显示 -->
            <div class="detail-activity">
                <div class="activity-detail-content">
                    <div class="left">
                        <div class="price">
                            <span class="unit">￥</span>
                            <span class="price-num">{{ Number(data.goods_info.activity_price) || 20 }}</span>
                        </div>
                        <div class="group-price">
                            <div class="group-num">
                                <template v-if="data.group_type == 0">
                                    {{data.group_num}}人拼团价
                                </template>
                               <template v-else>
                                   人多更优惠
                               </template>
                            </div>
                            <div class="del-price">
                                ￥{{data.goods_info.original_price || 100}}
                            </div>
                        </div>
                        <span class="iconfont icon-pintuan2-1"></span>
                    </div>
                    <div class="right">
                        <div class="seckill-surplus">活动剩余时间</div>
                        <div class="seckill-count">
                            <span class="text orange">2天</span>
                            <span class="time">23</span>
                            <span class="colon orange">:</span>
                            <span class="time">23</span>
                            <span class="colon orange">:</span>
                            <span class="time">23</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 商品信息显示 -->
            <div class="detail_info">
                <div class="container">
                    <div class="title-floor floor flex">
                        <p class="title">{{ data.goods_info.title }}</p>
                        <div class="share-commission" v-if="data.is_commission == '1'">
                            <div class="commission">
                                <p class="word">预计返利</p>
                                <p class="money">
                                    <span class="money-unit">￥</span>
                                    <span class="num">5</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="desc-floor floor" v-if="data.goods_info.sub_title">
                        {{ data.goods_info.sub_title }}
                    </div>
                </div>
            </div>

            <!-- 底部按钮 -->
            <div class='detail_navbar van-hairline--top'>
                <div class="btn-shop">
                    <span class="iconfont-m- icon-m-iconfontshop"></span>
                    <span class="text">店铺</span>
                </div>
                <div class="btn-shop">
                    <span class="iconfont-m- icon-m-xingxingkongxin"></span>
                    <span class="text">收藏</span>
                </div>
                <div class="navbar-btn">
                    <div class="left-btn" v-if="data.rules.single_buy == 1">
                        <div class="left-btn-desc">¥{{ data.goods_info.price || 999 }}</div>
                        <div class="left-btn-label">单独购买</div>
                    </div>
                    <div class="right-btn">
                        <div class="left-btn-desc">¥{{ data.goods_info.activity_price || 999 }}</div>
                        <span class="right-btn-text">我要开团</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Preview",
    components: {},
    props: {
        activityData: {
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            data: {}
        };
    },
    watch: {
        activityData: {
            handler(newValue) {
                if (newValue?.goods_info?.length) {
                    let data = {...newValue?.goods_info[0]};
                    if (data.has_option == 1) {
                        let result = data?.rules?.filter(item => item.is_join == 1)[0];
                        let activity_stock = result?.activity_stock;
                        let activity_price = result?.activity_price;
                        if (newValue.inner_type == 1) {
                            activity_price = result?.ladder_price?.[newValue.group_num_list.length]
                        }
                        // else {
                        //     activity_price = result?.[`activity_price${newValue.group_num_list.length}`]
                        // }

                        let allJoin = data?.rules?.filter(item => item.is_join == 1);
                        if (allJoin && allJoin.length) {
                            activity_stock = 0;
                            allJoin.forEach(item => {
                                activity_stock += parseInt(item.activity_stock);
                            });
                        }

                        data = {
                            ...data,
                            activity_price: activity_price || 10,
                            activity_stock: activity_stock || 100
                        };
                    }
                    if (newValue.inner_type == 1) {
                        if (data.has_option == 1) {
                            data.activity_price = data.rules?.[0]?.ladder_price[newValue.group_num_list.length] || '2000';
                            data.original_price = data.min_price;
                            data.price = data.min_price;
                        } else {
                            data.activity_price = data[`activity_price${newValue.group_num_list.length}`];
                        }
                    }
                    let single_buy = newValue?.rules?.single_buy || 1;
                    this.data = {
                        ...newValue,
                        single_buy,
                        goods_info: data
                    };
                } else {
                    this.data = {
                        ...newValue,
                        goods_info: {
                            thumb: this.$utils.staticImg('decorate/default_goods3.jpg'),
                            price: '334.00',
                            title: '衬衫男女长袖夏季日系ins风文艺薄款亚麻港风男士女士小清新棉麻条纹白衬女士',
                            has_option: 0,
                            activity_price: 10,
                            activity_stock: 100,
                            stock: 100,
                            sales: 45,
                            group_num: 2,
                            min_price: '334.00',
                            single_buy: 1,
                            sub_title: '条纹棉麻衬衫，慵随性饭，自然、舒适、透气、吸湿散湿快，可单穿当外套搭配T恤都很好看，整个风格'
                        }
                    }
                }
            },
            deep: true,
            immediate: true
        }
    },
    computed: {},
    created() {
    },
    mounted() {
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
.preview-index {
    width: 385px;
    height: calc(100vh - 130px);
    padding-bottom: 20px;
    box-sizing: border-box;
    overflow-y: scroll;
    background-color: #fff;
    flex-shrink: 0;
    margin-right: 20px;
    margin-top: 20px;

    .preview-title {
        padding: 40px 0;
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
    }

    .preview-box {
        position: relative;
        width: 375px;
        /*height: 667px;*/
        margin: 0 auto;
        box-shadow: 0 4px 8px rgba(133, 148, 162, 0.3);
        border-radius: 6px;
        transform: scale(0.8);
        transform-origin: top;

        .goods-img {
            width: px2rpx(375);
            height: px2rpx(375);

            img {
                width: px2rpx(375);
                height: px2rpx(375);
            }
        }

        .detail-activity {
            background-color: #ffffff;
            padding: 0 12px;
            margin-bottom: px2rpx(-14);
            .activity-detail-content {
                background-color: #ffffff;
                box-shadow: 0 4px 8px -2px rgba(255, 116, 20, 0.2);
                border-radius: 6px;
                display: flex;
                align-items: center;
                overflow: hidden;
                position: relative;
                top: px2rpx(-14);
                .left {
                    position: relative;
                    display: flex;
                    flex: 1;
                    align-items: center;
                    padding: 12px;
                    background: linear-gradient(114.57deg, #FF8A00 19.05%, #FF4C14 87.67%);
                    .price {
                        color: #ffffff;
                        .unit {
                            font-weight: 600;
                            font-size: 16px;
                            line-height: 22px;
                        }
                        .price-num {
                            font-weight: 600;
                            font-size: 28px;
                            line-height: 39px;
                        }
                    }
                    .group-price {
                        padding-left: 8px;
                        .group-num {
                            font-weight: bold;
                            font-size: 9px;
                            line-height: 12px;
                            color: $warning-color;
                            background-color: #ffffff;
                            border-radius: 2px;
                            padding: px2rpx(1) px2rpx(2);
                        }
                        .del-price {
                            font-size: 12px;
                            line-height: 17px;
                            /* identical to box height */
                            color: #ffffff;
                            text-decoration-line: line-through;
                        }
                    }
                    .iconfont {
                        position: absolute;
                        right: 0;
                        bottom: px2rpx(-30);
                        font-size: px2rpx(60);
                        color: #ffffff;
                        opacity: 0.2;
                    }
                }
                .right {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    //justify-content: center;
                    width: 108px;
                    padding: px2rpx(12) 0;
                    flex-shrink: 0;
                    color: #FF6F29;

                    .scekill-icon {
                        margin-bottom: px2rpx(4);
                        font-size: px2rpx(16);
                    }

                    .seckill-surplus {
                        margin-bottom: px2rpx(6);
                        font-size: px2rpx(10);
                        line-height: px2rpx(14);
                    }

                    .seckill-count {
                        display: flex;
                        align-items: center;
                        height: px2rpx(16);
                        color: #ffffff;
                        .orange {
                            color: #FF6F29;
                        }

                        .time {
                            width: px2rpx(16);
                            height: px2rpx(16);
                            line-height: px2rpx(16);
                            text-align: center;
                            background-color: #ff6f29;
                            color: #ffffff;
                            font-size: px2rpx(12);
                            border-radius: px2rpx(2);
                        }

                        .text {
                            margin-right: px2rpx(6);
                            font-size: px2rpx(10);
                        }

                        .colon {
                            margin: 0 px2rpx(2);
                        }
                    }
                }
            }
            .container {
                padding: px2rpx(17) px2rpx(12) px2rpx(8);
                margin-bottom: px2rpx(-16);
                width: 100%;
                box-sizing: border-box;
            }

            .title-floor {
                .title {
                    color: $uni-text-color;
                    width: 0;
                    flex: 1;
                    font-family: PingFang SC;
                    font-style: normal;
                    font-weight: bold;
                    font-size: px2rpx(14);
                    line-height: px2rpx(20);
                    color: #212121;
                }

                margin-bottom: px2rpx(8);
            }

            .share-commission {
                display: flex;
                flex-wrap: nowrap;

                .commission {
                    min-width: px2rpx(62);
                    height: px2rpx(33);
                    background: linear-gradient(149.91deg, $uni-color-primary 0%, #ff6f29 94.38%);
                    border-radius: px2rpx(6);
                    display: flex;
                    flex-direction: column;
                    color: #fff;
                    justify-content: space-around;
                    /*margin-right: px2rpx(12);*/
                    padding: px2rpx(2) px2rpx(8);

                    .money {
                        font-size: px2rpx(10);
                        text-align: center;

                        &-unit {
                            font-size: px2rpx(10);
                        }

                        .num {
                            font-size: px2rpx(14);
                            line-height: px2rpx(14);
                            font-weight: 500;
                        }
                    }

                    .word {
                        font-size: px2rpx(10);
                        line-height: px2rpx(14);
                        text-align: center;
                    }
                }
            }
        }

        .detail_info {
            width: 100%;

            .container {
                padding: px2rpx(8) px2rpx(12);
                width: 100%;
                box-sizing: border-box;
            }

            .floor {
                width: 100%;
                box-sizing: border-box;
                display: flex;
                flex-wrap: nowrap;

                &-text {
                    margin-left: px2rpx(4);
                }
            }

            .title-floor {
                .title {
                    color: $uni-text-color;
                    width: 0;
                    flex: 1;
                    font-family: PingFang SC;
                    font-style: normal;
                    font-weight: bold;
                    font-size: px2rpx(14);
                    line-height: px2rpx(20);
                    color: #212121;
                }

                margin-bottom: px2rpx(8);
            }

            .share-commission {
                display: flex;
                flex-wrap: nowrap;

                .commission {
                    min-width: px2rpx(62);
                    height: px2rpx(33);
                    background: linear-gradient(
                                    149.91deg,
                                    $uni-color-primary 0%,
                                    #ff6f29 94.38%
                    );
                    border-radius: px2rpx(6);
                    display: flex;
                    flex-direction: column;
                    color: #fff;
                    justify-content: space-around;
                    /*margin-right: px2rpx(12);*/
                    padding: px2rpx(2) px2rpx(8);

                    .money {
                        font-size: px2rpx(10);
                        text-align: center;

                        &-unit {
                            font-size: px2rpx(10);
                        }

                        .num {
                            font-size: px2rpx(14);
                            line-height: px2rpx(14);
                            font-weight: 500;
                        }
                    }

                    .word {
                        font-size: px2rpx(10);
                        line-height: px2rpx(14);
                        text-align: center;
                    }
                }
            }

            .desc-floor {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                /* 文字信息/56 */
                color: #969696;
                margin-bottom: px2rpx(8);
            }

            .express-floor {
                justify-content: space-between;

                p {
                    line-height: px2rpx(17);
                    font-size: px2rpx(12);
                    color: $uni-text-color-grey;
                }

                color: $uni-text-color-grey;

                .iconfont-m- {
                    vertical-align: px2rpx(-2);
                }
            }
        }

        .detail-info-seckill {
            margin-top: px2rpx(8);

            .full-box {
                height: px2rpx(40);
                padding: px2rpx(0) px2rpx(12);
                align-items: center;
                justify-content: space-between;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                font-size: px2rpx(12);
                color: #212121;

                .full-text {
                    font-weight: 600;
                    font-size: px2rpx(18);
                    font-family: YouSheBiaoTiHei;
                    color: #ff3c29;
                }
            }

            .deposit-box {
                position: relative;

                .deposit-box-img {
                    position: absolute;
                    top: px2rpx(0);
                    right: px2rpx(0);
                    width: px2rpx(112);
                    height: px2rpx(112);
                    z-index: 0;
                }
            }
        }

        .detail_navbar {
            width: 100%;
            height: px2rpx(48);
            padding: px2rpx(4);
            display: flex;
            flex-wrap: nowrap;
            box-sizing: border-box;
            background-color: #fff;
            .btn-shop {
                width: px2rpx(54);
                margin: 0 auto;
                padding: 5px 0;
                >span {
                    display: block;
                    text-align: center;
                }
                .iconfont {
                    font-size: px2rpx(24);
                }
                .text {
                    font-size: px2rpx(10);
                    line-height: px2rpx(14);
                    color: #969696;
                }
            }
            .navbar-btn {
                flex: 1;
                border-radius: px2rpx(20);
                overflow: hidden;
                //margin-right: px2rpx(10);
                display: flex;
                border-top: px2rpx(1) solid $border-color;
                .left-btn,
                .right-btn {
                    text-align: center;
                    color: #ffffff;
                    flex: 1;
                    line-height: px2rpx(17);
                    font-size: px2rpx(14);
                    .left-btn-desc {
                        //font-size: px2rpx(10);
                        line-height: px2rpx(20);
                    }
                }
                .left-btn {
                    background: #F9AB10;
                }
                .right-btn {
                    background: linear-gradient(114.57deg, #FF8A00 19.05%, #FF4C14 87.67%);
                }
            }
        }
    }
}
</style>
