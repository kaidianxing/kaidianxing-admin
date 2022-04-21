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
    <div class="header-comp">
        <ul>
            <li @click="jumpPage('send',noPerm.order)">
                <div class="left">
                    <img src="@/assets/image/home/1.png" alt="" />
                </div>
                <div class="right">
                    <div class="tit">待发货订单</div>
                    <div class="num">
                        <Badge dot :count="0">
                            {{ $utils.formatNumberData(orderInfo.send) }}
                        </Badge>
                    </div>
                </div>
            </li>
            <li @click="jumpPage('refund',noPerm.order)">
                <div class="left">
                    <img src="@/assets/image/home/2.png" alt="" />
                </div>
                <div class="right">
                    <div class="tit">待处理维权</div>
                    <div class="num">
                        <Badge dot :count="0">
                            {{ $utils.formatNumberData(orderInfo.refund) }}
                        </Badge>
                    </div>
                </div>
            </li>
            <li @click="jumpPage('vip',noPerm.member)">
                <div class="left">
                    <img src="@/assets/image/home/3.png" alt="" />
                </div>
                <div class="right">
                    <div class="tit">总会员数</div>
                    <div class="num">
                        {{ $utils.formatNumberData(orderInfo.member) }}
                    </div>
                </div>
            </li>
            <li @click="jumpPage('data_vip',noPerm.data)">
                <div class="left">
                    <img src="@/assets/image/home/4.png" alt="" />
                </div>
                <div class="right">
                    <div class="tit">消费会员数</div>
                    <div class="num">
                        {{ $utils.formatNumberData(orderInfo.consume_member) }}
                    </div>
                </div>
            </li>
            <li @click="jumpPage('inSale',noPerm.goods)">
                <div class="left">
                    <img src="@/assets/image/home/5.png" alt="" />
                </div>
                <div class="right">
                    <div class="tit">商品总数</div>
                    <div class="num">
                        {{ $utils.formatNumberData(orderInfo.goods_count) }}
                    </div>
                </div>
            </li>
            <li @click="jumpPage('order_list_all',noPerm.order)">
                <div class="left">
                    <img src="@/assets/image/home/6.png" alt="" />
                </div>
                <div class="right">
                    <div class="tit">订单数量</div>
                    <div class="num">
                        {{ $utils.formatNumberData(orderInfo.order_count) }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        computed: {
            noPerm() { //管理权限
                return {
                    order: !this.$getPermMap('order.op.view'),
                    member: !this.$getPermMap('member.list.view'),
                    goods: !this.$getPermMap('goods.index.view'),
                    data: !this.$getPermMap('statistics.member.view')
                }
            },
        },
        data() {
            return {
                orderInfo: {}
            }
        },
        created() {
            this.getOrderInfo()
        },
        methods: {
            // 首页订单总览
            getOrderInfo() {
                this.$api.homeApi.getOrderInfo({}).then(res => {
                    if (res.error === 0) {
                        this.orderInfo = {
                            ...res.data
                        }
                    }
                })
            },
            jumpPage(type,noperm) {
                if(noperm){
                    this.$Message.info('暂无查看权限')
                    return
                }
                let url
                if (type === 'send') {
                    // 待发货订单
                    url = '/order/list/send'
                } else if (type === 'refund') {
                    // 维权订单
                    url = '/order/list/refund'
                } else if (type === 'vip') {
                    // 总用户数
                    url = '/member/list'
                } else if (type === 'data_vip') {
                    // 消费会员数
                    url = '/member/vip'
                } else if (type === 'inSale') {
                    // 商品总数
                    url = '/goods/list/inSale'
                } else if (type === 'order_list_all') {
                    // 订单数量
                    url = '/order/list/all'
                }
                this.$utils.openNewWindowPage(url)
            }
        }
    }
</script>

<style scoped lang="scss">
    .header-comp {
        background-color: #fff;
        border-radius: 2px;
        padding-top: 20px;
        padding-bottom: 20px;
        ul {
            display: flex;
            li {
                flex: 1;
                /*padding-left: 60px;*/
                display: flex;
                align-items: center;
                cursor: pointer;
                justify-content: center;
                &:nth-child(1) {
                    /*padding-left: 20px;*/
                }
                &:nth-child(2) {
                    /*padding-left: 20px;*/
                    border-right: 1px solid #e9edef;
                }
                &:hover {
                    .right {
                        .num {
                            color: $data-blue;
                        }
                    }
                }
                .left {}
                .right {
                    padding-left: 14px;
                    .tit {
                        font-size: 14px;
                        line-height: 20px;
                        color: #636669;
                    }
                    .num {
                        margin-top: 10px;
                        font-family: PingFang SC;
                        font-style: normal;
                        font-weight: 500;
                        font-size: 24px;
                        line-height: 29px;
                        color: #262b30;
                        /deep/ .ivu-badge-dot {
                            width: 6px;
                            height: 6px;
                            top: -3px;
                            right: -6px;
                        }
                    }
                }
            }
        }
    }
</style>
