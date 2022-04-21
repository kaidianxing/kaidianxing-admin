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
    <div class="preview-index">
        <div class="preview-title">秒杀抢购预览</div>
        <div class="preview-box">
            <div class="img">
                <img :src="require('@/assets/image/top_bg.png')" alt="">
            </div>
            <div class="img">
                <img :src="require('@/assets/image/good_top_bg.png')" alt="">
            </div>
            <div class="goods-img">
                <img :src="$utils.media(seckillData.goods_list.thumb)"  @error="replaceImage" alt="">
            </div>
            <!-- 秒杀价格显示 -->
            <div class="detail-seckill-activity">
               <div class="activity-price" :style="`background-image: url('${$utils.staticImg('seckill/bg.png')}')`">
               <div class="left">
                   <div class="scekill">
                       <span class="seckill-label">秒杀价</span>
                       <span class="seckill-unit">¥</span>
                       <span class="seckill-num">{{Number(seckillData.goods_list.activity_price) || 20}}</span>
                   </div>
                   <div class="seckill-stock">秒杀库存: {{seckillData.goods_list.activity_stock}}件</div>
               </div>
               <div class="right">
                   <div><i class="iconfont-m- icon-m-miaoshabiaoti scekill-icon"></i></div>
                   <div class="seckill-surplus">活动剩余时间</div>
                   <div class="seckill-count">
                        <span class="text">2天</span>
                        <span class="time">23</span>
                        <span class="colon">:</span>
                        <span class="time">23</span>
                        <span class="colon">:</span>
                        <span class="time">23</span>
                        </div>
               </div>
               </div>
            </div>
            <!-- 商品信息显示 -->
            <div class="detail_info">
                <div class="container">
                    <div class="title-floor floor flex">
                        <p class="title">{{seckillData.goods_list.title}}</p>
                        <div class="share-commission" v-if="show_commission==1">
                            <div class="commission">
                                <p class="money">
                                    <span class="money-unit">￥</span>
                                    <span class="num">5</span>
                                </p>
                                <p class="word">预计佣金</p>
                            </div>
                        </div>
                    </div>
                    <div class="desc-floor floor" v-if="seckillData.goods_list.sub_name">{{seckillData.goods_list.sub_name}}</div>
                </div>
            </div>
            
            <!-- 底部按钮 -->
            <div class='detail_navbar van-hairline--top'>
                <button class='shop nav-icon'>
                    <i class="myicon iconfont-m- icon-m-iconfontshop" style='color:#969696'></i>
                    <span style='color:#969696'>店铺</span>
                </button>
                <button class='like nav-icon'>
                    <i class="myicon iconfont-m- icon-m-xingxingkongxin" style='color:#969696'></i>
                    <span style='color:#969696'>收藏</span>
                </button>
               <div class="left-btn">
                   <div class="left-btn-desc">¥{{seckillData.goods_list.min_price||999}}</div>
                   <div class="left-btn-label">原价购买</div>
               </div>
               <div class="right-btn">
                   <span class="iconfont-m- icon-m-shandian right-btn-icon"></span>
                   <span class="right-btn-text">马上抢</span>
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
                default: () => {}
            },
            show_commission: {
                type: String
            }
        },
        data() {
            return {
                seckillData: {}
            }
        },
        watch: {
            activityData: {
                handler(newValue) {
                    if (newValue?.goods_list?.length) {
                        let data = {...newValue?.goods_list[0]};
                        if (data.has_option == 1) {
                            let result = data?.rules?.filter(item => item.is_join == 1)[0]
                            let activity_stock = result?.activity_stock;

                            let allJoin = data?.rules?.filter(item => item.is_join == 1)
                            if(allJoin && allJoin.length) {
                                activity_stock = 0
                                allJoin.forEach(item=>{
                                    activity_stock+=parseInt(item.activity_stock)
                               })
                            }

                            data = {
                                ...data,
                                activity_price: result?.activity_price || 10,
                                activity_stock: activity_stock || 100
                            }
                        }
                        this.seckillData = {
                            ...newValue,
                            goods_list: data
                        }
                    } else {
                        this.seckillData = {
                            ...newValue,
                            goods_list: {
                                thumb: this.$utils.staticImg('decorate/default_goods3.jpg'),
                                price: '334.00',
                                title: '衬衫男女长袖夏季日系ins风文艺薄款亚麻港风男士女士小清新棉麻条纹白衬女士',
                                has_option: 0,
                                activity_price: 10,
                                activity_stock: 100,
                                stock: 100,
                                sales: 45,
                                min_price: '334.00',
                                sub_name: '条纹棉麻衬衫，慵随性饭，自然、舒适、透气、吸湿散湿快，可单穿当外套搭配T恤都很好看，整个风格'
                            }
                        };
                    }

                    console.log()
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
    }
</script>

<style lang="scss" scoped>
    .preview-index {
        width: 380px;
        height: calc(100vh - 110px - 20px);
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
            .detail-seckill-activity {

                .activity-price {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 px2rpx(27) 0 px2rpx(12);
                    height: px2rpx(72);
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    color: #fff;
                    .left {
                        .seckill {
                            margin-bottom: px2rpx(3);
                            color: #fff;

                           &-label {
                                font-size: px2rpx(12);
                                line-height: px2rpx(17);
                           }

                            &-unit{
                                margin-left: px2rpx(10);
                                font-size: px2rpx(16);
                                line-height: px2rpx(20);
                            }

                            &-num {
                                font-size: px2rpx(24);
                                font-weight: bold;
                                line-height: px2rpx(30);
                            }
                          
                        }

                        .seckill-stock {
                            font-size: px2rpx(12);
                            line-height: px2rpx(17);
                            color: #FFFFFF;
                            opacity: 0.8;
                        }
                       
                        
                    }
                    .right {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;

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
                            color: #fff;

                            .time {
                                width: px2rpx(16);
                                height: px2rpx(16);
                                line-height: px2rpx(16);
                                text-align: center;
                                background-color: #212121;
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
                            line-height: px2rpx(10);
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
                            line-height: px2rpx(10);
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
                display: flex;
                flex-wrap: nowrap;
                box-sizing: border-box;
                background-color: #fff;
                padding: px2rpx(4) px2rpx(6) px2rpx(4) 0;

                .nav-icon {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: px2rpx(54);
                    flex-shrink: 0;
                    position: relative;
                    align-items: center;
                    overflow: visible;
                    background-color: #fff;
                    border: none;
                    &::after {
                        border: 0;
                    }
                    .myicon {
                        font-size: px2rpx(24);
                        margin: 0 auto;
                        text-align: center;
                        height: px2rpx(24);
                        width: px2rpx(24);
                        line-height: px2rpx(24);
                        font-style: normal;
                        font-weight: lighter;
                    }
                    .badge {
                        box-sizing: border-box;
                        font-size: px2rpx(8);
                        position: absolute;
                        height: px2rpx(12);
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        text-align: center;
                        min-width: px2rpx(12);
                        border-radius: px2rpx(11);
                        font-weight: bold;
                        color: #fff;
                        transform: translate(-50%,0);
                        left: 65%;
                        top: px2rpx(-3);
                        padding: 0;
                        font-style: normal;
                        padding: 0 px2rpx(3);
                    }
                    span {
                        font-size: px2rpx(10);
                        line-height: px2rpx(10);
                        margin: 0 auto px2rpx(3);
                        text-align: center;
                    }
                }

                .left-btn {
                    margin-left: px2rpx(4);
                    width: px2rpx(128);
                    height: px2rpx(40);
                    box-sizing: border-box;
                    text-align: center;
                    border-radius: px2rpx(24) 0 0 px2rpx(24);
                    border: px2rpx(1) solid #212121;
                    background: #212121;
                    &-label {
                        margin-bottom: px2rpx(3);
                        font-size: px2rpx(12);
                        line-height: px2rpx(17);
                        color: #fff;
                    }

                    &-desc {
                        font-size: px2rpx(10);
                        line-height: px2rpx(20);
                        color: #fff;
                    }
                }

                .right-btn {
                    text-align: center;
                    line-height: px2rpx(40);
                    flex: 1;
                    color: #ffffff;
                    background:  linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);
                    border-radius: 0 px2rpx(24) px2rpx(24) 0;
                    &.disabled {
                        background: #CCCCCC;
                    }

                    &-icon {
                        height: px2rpx(20);
                        width: px2rpx(20);
                        font-size: px2rpx(20);
                    }

                    &-text {
                        font-weight: 600;
                        font-size: px2rpx(18);
                        line-height: px2rpx(25);
                    }
                }
                
            }
        }
    }
</style>