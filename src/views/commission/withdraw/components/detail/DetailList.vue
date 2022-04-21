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
    <div class="order-table-list" ref="order_table">
        <div class="table-header">
            <table :style="{width: `${tableWidth}px`}">
                <colgroup align="left">
                    <col v-for="(column, index) in columns" :key="index" :width="column.width" />
                </colgroup>
                <tr>
                    <th v-for="column in columns" :key="column.key">
                        <div class="table-cell">{{column.title}}</div>
                    </th>
                </tr>
            </table>
        </div>
        <template v-if="data.length > 0">
            <div v-for="list in data" :key="list.id" class="table-content">
                <!--订单信息-->
                <div class="table-order">
                    <table :style="{width: `${tableWidth}px`}">
                        <colgroup align="left">
                            <col
                                v-for="(column, index) in columns"
                                :key="index"
                                :width="column.width"
                            />
                        </colgroup>
                        <!--合并单元格-->
                        <template>
                            <tr>
                                <!--会员信息-->
                                <td>
                                    <div class="shop">
                                        <div class="shop-image">
                                            <img
                                                :src="$media(list.thumb)"
                                                alt
                                                @error="replaceImage"
                                            />
                                        </div>
                                        <div class="shop-info">
                                            <p class="title">
<!--                                                <span-->
<!--                                                    class="iconfont icon"-->
<!--                                                    :class="list.client_type|getSourceIcon"-->
<!--                                                ></span>-->
                                                <span class="order-no">{{list.order_id}}</span>
                                                <kdx-copy-text :text="list.order_id">
                                                    <Button type="text">复制</Button>
                                                </kdx-copy-text>
                                            </p>
                                            <div class="shop-option">{{list.title}}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="bold">¥{{list.price}}</td>
                                <td>{{list.created_at}}</td>
                                <td v-if="status != 0">
                                    <div class="flex align-center">
                                        <span class="iconfont status-icon" :class="getStatus.icon"></span>
                                        <span :class="getStatus.class">{{getStatus.text}}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="pay-list">
                                        <span class="pay-label">下单人：</span>
                                        <span class="pay-user"  @click="jumpVip(list.member_id)">{{list.nickname || '-'}}</span>
                                    </div>
                                    <div class="pay-list">
                                        <span class="pay-label">{{list.level|getLevelText}}</span>
                                        <span class="pay-price">￥{{list.real_commission}}</span>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
            </div>
        </template>
        <div v-else style="text-align: center;margin: 20px 0">暂无数据</div>
    </div>
</template>

<script>
export default {
    name: 'OrderList',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        status: {
            type: [String, Number],
            default: 0
        }
    },
    data() {
        return {
            columns: [
                {
                    title: '订单编号/商品',
                    key: 'shop',
                    width: 350
                },
                {
                    title: '订单金额',
                    key: 'price',
                    width: 100
                },
                {
                    title: '下单时间',
                    key: 'paytime',
                    width: 200
                },
                {
                    title: '审核状态',
                    key: 'payment',
                    width: 90
                },
                {
                    title: '佣金/下单人',
                    key: 'buyer',
                    width: 240
                }
            ],
            cloneColumns: [],
            totalWidth: 0,
            tableWidth: 0,
            showModal: true
        }
    },
    watch: {
        status: {
            handler() {
                if (this.status == 0) {
                    if (this.columns.length == 5) {
                        this.columns.splice(3, 1)
                    }
                } else {
                    if (this.columns.length == 4) {
                        this.columns.splice(3, 0, {
                            title: '审核状态',
                            key: 'payment',
                            width: 90
                        })
                    }
                }
                this.getCloneColumns()
                this.getTotalWidth()
                this.handleResize()
            },
            immediate: true
        }
    },
    computed: {
        getStatus() {
            if (this.status == 30 || this.status == 31) {
                return {
                    icon: 'icon-del',
                    text: '未通过',
                    class: 'del-text'
                }
            } else {
                return {
                    icon: 'icon-yes',
                    text: '已审核'
                }
            }
        }
    },

    methods: {
        // 动态改变表格的width
        handleResize() {
            if(!this.$refs['order_table'])return
            this.tableWidth = (this.$refs['order_table']?.offsetWidth) - 40
            let columnLength = this.columns.length
            let columnWidth = parseInt(
                (this.tableWidth - this.totalWidth) / columnLength
            )
            this.columns.forEach((item, index) => {
                let width = (this.cloneColumns[index].width || 0) + columnWidth
                this.$set(this.columns[index], 'width', width)
            })
        },
        // 深拷贝columns
        getCloneColumns() {
            this.cloneColumns = JSON.parse(JSON.stringify(this.columns))
        },
        // 获取columns的默认总宽度
        getTotalWidth() {
            this.totalWidth = 0
            this.cloneColumns.forEach(item => {
                this.totalWidth += item.width || 0
            })
        },
        // 跳转会员详情
        jumpVip(id) {
            this.$utils.openNewWindowPage('/member/detail', {id: id});
        },
        // 切换分页
    },

    mounted() {
        // 监听窗口的变化
        window.addEventListener('resize', this.handleResize)
    },
    beforeDestroy() {
        window.removeEventListener('resize')
    },
    filters: {
        getSourceIcon(source) {
            switch (source) {
                // 百度小程序
                // case '0':
                //     return 'icon-baiduxiaochengxu'
                //     break;
                // 支付宝小程序
                // case '3':
                //     return 'icon-zhifubaoxiaochengxu'
                // H5
                case '10':
                    return 'icon-H'
                // 微信公众号
                case '20':
                    return 'icon-weixin'
                //微信小程序
                case '21':
                    return 'icon-weixinxiaochengxu'
                default:
                    break
            }
        },
        getLevelText(level) {
            let textObj = {
                '1': '一级佣金：',
                '2': '二级佣金：',
            }
            return textObj[level]
        }
    }
}
</script>

<style scoped lang="scss">
.order-table-list {
    padding: 0 20px;
    background-color: #ffffff;
    position: relative;
    // 表头
    .table-header {
        height: 64px;
        box-sizing: border-box;
        border-bottom: 1px solid $border-color;

        > table {
            /*width: 100%;*/
            > tr {
                /*width: 100%;*/
                > th {
                    .table-cell {
                        @include font-14-20-bold;
                        color: $text-first;
                        padding: 20px 15px;
                        box-sizing: border-box;
                        text-align: left;
                    }
                }
            }
        }
    }

    // 表格内容
    .table-content {
        border-bottom: 1px solid $border-color;
        border-radius: 2px;
        margin-bottom: 20px;

        // 订单信息
        .table-order {
            > table {
                /*width: 100%;*/
                > tr {
                    /*width: 100%;*/
                    > td {
                        @include font-14-20;
                        color: $text-first;
                        padding: 16px 15px 16px 15px;

                        &.bold {
                            font-weight: bold;
                        }
                        // 商品信息
                        .shop {
                            display: flex;
                            flex-wrap: nowrap;

                            .shop-image {
                                overflow: hidden;
                                margin-right: 10px;
                                box-sizing: border-box;
                                border: 1px solid #e9edef;
                                width: 48px;
                                height: 48px;
                                flex-shrink: 0;

                                > img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }

                            .icon-money-pay {
                                color: #ff9900;
                            }

                            .icon-wechatpay {
                                color: #00ac1c;
                            }
                            .icon-alipay {
                                color: #00a0ee;
                            }
                            .icon-weixin {
                                color: $success-color;
                            }
                            .icon-weixinxiaochengxu {
                                color: #677de0;
                            }
                            .icon-toutiaoxiaochengxu {
                                color: #239bff;
                            }

                            .icon-zhifubaoxiaochengxu {
                                color: #2094e7;
                            }

                            .icon-baiduxiaochengxu {
                                color: #306cff;
                            }

                            .icon-H {
                                color: #ff6004;
                            }

                            .shop-info {
                                .title {
                                    @include font-14-20;
                                    color: #939799;
                                    cursor: pointer;

                                    .order-no {
                                        margin-right: 4px;
                                    }

                                    .shop-option {
                                        @include font-14-20;
                                        color: #262b30;
                                    }
                                }
                            }
                        }

                        .pay-list {
                            margin-bottom: 9px;
                            .pay-user {
                                color: $brand-color;
                                cursor: pointer;
                            }

                            .pay-price {
                                color: #ff9900;
                            }
                        }

                        .status-icon {
                            font-size: 20px;
                            &.icon-yes {
                                color: #19be6b;
                            }

                            &.icon-del {
                                color: #b8b9bd;
                            }
                        }

                        .del-text {
                            color: #939799;
                        }
                    }
                }
            }
        }
    }

    // 分页
    .table-footer {
        border-top: 1px solid $border-color;
        padding: 20px 0;
        display: flex;
        justify-content: center;
    }
}
</style>
