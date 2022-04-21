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
    <div class="chart-panel">
        <Row>
            <i-col span="3" :class="{ checked: type === 'order_pay_price' }">
                <div class="inner" @click="handleClick('order_pay_price')">
                    <div class="tit">成交总额(元)</div>
                    <div class="number">{{ $utils.formatNumberData(data.order_pay_price) }}</div>
                    <div class="box"></div>
                </div>
            </i-col>
            <i-col span="3" :class="{ checked: type === 'order_pay' }">
                <div class="inner" @click="handleClick('order_pay')">
                    <div class="tit">订单数(件)</div>
                    <div class="number">{{ $utils.formatNumberData(data.order_pay) }}</div>
                    <div class="box"></div>
                </div>
            </i-col>
            <i-col span="3" :class="{ checked: type === 'unit_price' }">
                <div class="inner" @click="handleClick('unit_price')">
                    <div class="tit">笔单价(元)</div>
                    <div class="number">{{ $utils.formatNumberData(data.unit_price) }}</div>
                    <div class="box"></div>
                </div>
            </i-col>
            <i-col span="3" :class="{ checked: type === 'order_pay_member' }">
                <div class="inner" @click="handleClick('order_pay_member')">
                    <div class="tit">支付人数(人)</div>
                    <div class="number">{{ $utils.formatNumberData(data.order_pay_member) }}</div>
                    <div class="box"></div>
                </div>
            </i-col>
            <i-col span="3" :class="{ checked: type === 'guest_unit_price' }">
                <div class="inner" @click="handleClick('guest_unit_price')">
                    <div class="tit">客单价(元)</div>
                    <div class="number">{{ $utils.formatNumberData(data.guest_unit_price) }}</div>
                    <div class="box"></div>
                </div>
            </i-col>
            <i-col span="3" :class="{ checked: type === 'pv' }">
                <div class="inner" @click="handleClick('pv')">
                    <div class="tit">浏览量(PV)</div>
                    <div class="number">{{ $utils.formatNumberData(data.pv) }}</div>
                    <div class="box"></div>
                </div>
            </i-col>
            <i-col span="3" :class="{ checked: type === 'uv' }">
                <div class="inner" @click="handleClick('uv')">
                    <div class="tit">独立访客(UV)</div>
                    <div class="number">{{ $utils.formatNumberData(data.uv) }}</div>
                    <div class="box"></div>
                </div>
            </i-col>
            <i-col span="3" :class="{ checked: type === 'new_member' }">
                <div class="inner" @click="handleClick('new_member')">
                    <div class="tit">新增会员(人)</div>
                    <div class="number">{{ $utils.formatNumberData(data.new_member) }}</div>
                    <div class="box"></div>
                </div>
            </i-col>
        </Row>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => {}
        },
        type: {
            type: String,
            default: 'order_pay_price'
        }
    },
    data() {
        return {}
    },
    methods: {
        handleClick(type) {
            this.$emit('on-change', type)
        }
    }
}
</script>

<style scoped lang="scss">
.chart-panel {
    margin-bottom: 20px;
    .ivu-row {
        .ivu-col {
            .inner {
                padding: 20px;
                cursor: pointer;
                position: relative;
            }
            border: 1px solid #e9edef;
            border-left: 1px solid transparent;
            &:last-child {
                border-right: 1px solid transparent;
            }
            &:hover {
                border-color: $data-blue;
                .number {
                    color: #4a67ff;
                }
            }
            &.checked {
                border: 1px solid $data-blue;
                .number {
                    color: #4a67ff;
                }
                .box {
                    display: inline-block;
                    background:#fbfcff;
                }
            }
            .tit {
                font-size: 14px;
                line-height: 16px;
                color: #636669;
            }
            .number {
                font-family: PingFang SC;
                font-weight: 500;
                font-size: 24px;
                line-height: 29px;
                color: #262b30;
                margin-top: 10px;
            }
            .box {
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%) rotate(-45deg);
                width: 15px;
                height: 15px;
                border-style: solid;
                border-width: 0 0 1px 1px;
                border-color: $data-blue;
                border-radius: 0 0 0 2px;
                background: #ffffff;
                display: none;
            }
            .data-card-panel {
                padding: 0 10px;
                /deep/ .card-panel-box {
                    position: relative;
                    cursor: pointer;
                    &:hover {
                        border-color: $data-blue;
                    }
                    .box {
                        position: absolute;
                        bottom: -8px;
                        right: 50%;
                        left: 50%;
                        width: 15px;
                        height: 15px;
                        transform: rotate(-45deg);
                        border-style: solid;
                        border-width: 0 0 1px 1px;
                        border-color: $data-blue;
                        border-radius: 0 0 0 2px;
                        background: #ffffff;
                        display: none;
                    }
                }
            }
        }
    }
}
</style>
