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
    <div class="order-table-list" ref="order_table" v-loading="loading">
        <div class="table-header">
            <table :style="{width: `${tableWidth}px`}">
                <colgroup align="left">
                    <col
                        v-for="(column, index) in columns"
                        :key="index + column.width"
                        :width="column.width"
                    />
                </colgroup>
                <tr>
                    <th v-for="(column, index) in columns" :key="index">
                        <div class="flex align-center table-cell">
                            <span>{{column.title}}</span>
                            <span v-if="column.sortable" class="ivu-table-sort">
                                <i
                                    class="ivu-icon ivu-icon-md-arrow-dropup"
                                    @click="sort(column.key,'asc')"
                                ></i>
                                <i
                                    class="ivu-icon ivu-icon-md-arrow-dropdown"
                                    @click="sort(column.key,'desc')"
                                ></i>
                            </span>
                        </div>
                    </th>
                </tr>
            </table>
        </div>
        <div class="table-content-box" v-if="data.length > 0">
            <div v-for="list in data" :key="list.id" class="table-content">
                <!--下单时间等等-->
                <div class="table-content-time">
                    <div class="left">
                        <span class="text">提现编号：{{list.apply_no}}</span>
                        <kdx-copy-text :text="list.apply_no">
                            <Button type="text" size="small">复制</Button>
                        </kdx-copy-text>
                    </div>
                </div>

                <!--订单信息-->
                <div class="table-order">
                    <table>
                        <colgroup align="left">
                            <col
                                v-for="(column, index) in columns"
                                :key="index + column.width"
                                :width="column.width"
                            />
                        </colgroup>
                        <!--合并单元格-->
                        <template>
                            <tr>
                                <!--会员信息-->
                                <td>
                                    <div class="member">
                                        <div class="member-image">
                                            <img
                                                :src="$utils.media(list.avatar)"
                                                alt
                                                @error="replaceImg"
                                            />
                                        </div>
                                        <div class="member-info">
                                            <p class="title">{{list.nickname || list.mobile}}</p>
                                            <div>
                                                <span
                                                    class="iconfont icon"
                                                    :class="list.client_type|getSourceIcon"
                                                    v-if="new Set(['10', '20', '21']).has(list.client_type)"
                                                ></span>
                                                <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2" v-else-if="list.client_type === '30'"></kdx-svg-icon>
                                                <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban" v-else-if="list.client_type === '32'"></kdx-svg-icon>
                                                <kdx-svg-icon class="iconfont" type="icon-douyin" v-else-if="list.client_type === '31'"></kdx-svg-icon>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex">
                                        <img
                                            class="level-img"
                                            src="@/assets/image/commission/level-icon.png"
                                        />
                                        <span class="level-name">{{list.agent_level_name}}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex align-center pay-info">
                                        <span
                                            class="iconfont pay-icon"
                                            :class="getPayType(list.type).icon"
                                        ></span>
                                        <span
                                            class="pay-text"
                                            :class="getPayType(list.type).class"
                                        >{{getPayType(list.type).text}}</span>
                                    </div>
                                </td>
                                <td>¥{{list.apply_commission}}</td>
                                <td>¥{{list.charge_deduction}}</td>
                                <td class="actual">¥{{list.final_commission}}</td>
                                <td>{{list.status == '0'?list.apply_time:list.check_time}}</td>
                                <td>
                                    <div>
                                        <Button type="text" class="action-btn" @click="skipInfo(list.id)">查看</Button>
                                        <Button type="text" :disabled="noManagePerm"
                                            @click="agreeHandler(list.id)"
                                            v-if="list.status=='0'"
                                        >同意</Button>
                                        <Button type="text" :disabled="noManagePerm"
                                            style="margin-left:10px"
                                            @click="refuseHandler(list.id)"
                                            v-if="list.status=='0'"
                                        >拒绝</Button>
                                        <Button type="text" :disabled="noManagePerm"
                                            style="margin-left:10px"
                                            @click="payHandler(list.id)"
                                            v-if="list.status=='10'"
                                        >打款</Button>
                                        <Button type="text" :disabled="noManagePerm"
                                            style="margin-left:10px"
                                            v-if="list.status=='10'"
                                            @click="manaualHandler(list.id)"
                                        >手动处理</Button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
            </div>
        </div>
        <div v-else style="text-align: center">暂无数据</div>
        <div class="table-footer" v-show="total > 10">
            <kdx-page-component ref="page" :total="total" @on-change="handlePageChange"></kdx-page-component>
        </div>
        <Modal v-model="show" title="操作" content="是否同意该条提现申请?"></Modal>
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
        total: {
            type: Number,
            default: 0
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        noManagePerm() { //管理权限
            return !this.$getPermMap('commission.apply.manage')
        },
    },
    data() {
        return {
            show: false,
            columns: [
                {
                    title: '会员',
                    key: 'shop',
                    width: 254
                },
                {
                    title: '分销商等级',
                    key: 'price',
                    width: 186
                },
                {
                    title: '提现方式',
                    key: 'payment',
                    width: 163
                },
                {
                    title: '申请佣金',
                    key: 'apply_commission',
                    width: 151,
                    sortable: 'custom',
                },
                {
                    title: '手续费',
                    key: 'charge_deduction',
                    width: 156,
                    sortable: 'custom',
                },
                {
                    title: '实际提现佣金',
                    key: 'final_commission',
                    width: 210,
                    sortable: 'custom',
                },
                {
                    title: '申请时间',
                    key: 'status',
                    width: 220
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 178
                }
            ],
            cloneColumns: [],
            totalWidth: 0,
            tableWidth: 0,
            showModal: true
        }
    },
    watch: {
        $route: {
            handler(route) {
                let { status } = route.params
                this.$set(
                    this.columns[6],
                    'title',
                    status == 'waiting' ? '申请时间' : '审核时间'
                )
            },
            immediate: true
        }
    },
    methods: {
        sort(sort, by) {
            this.$emit('on-search', { sort, by })
        },
        //
        skipInfo(id) {
            this.$router.push({
                path: '/commission/withdraw/detail',
                query: {
                    id
                }
            })
        },
        // 同意提现申请
        agreeHandler(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认通过此用户的提现申请?',
                cancelText: '取消',
                onOk: () => {
                    this.$api.commissionApi
                        .applyCheckedAgree({ id })
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('操作成功')
                                this.$emit('on-refresh', {}, 'head')
                            }
                        })
                }
            })
        },
        // 拒绝提现申请
        refuseHandler(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认拒绝此用户的提现申请?',
                cancelText: '取消',
                onOk: () => {
                    this.$api.commissionApi
                        .applyCheckedRefuse({ id })
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('操作成功')
                                this.$emit('on-refresh', {}, 'head')
                            }
                        })
                }
            })
        },
        // 打款
        payHandler(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认打款给此用户吗?',
                cancelText: '取消',
                onOk: () => {
                    this.$api.commissionApi.applyRemit({ id }).then(res => {
                        if (res.error === 0) {
                            this.$Message.success('操作成功')
                            this.$emit('on-refresh', {}, 'head')
                        }
                    })
                }
            })
        },
        // 手动打款
        manaualHandler(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认手动打款给此用户吗?',
                cancelText: '取消',
                onOk: () => {
                    this.$api.commissionApi.manaualRemit({ id }).then(res => {
                        if (res.error === 0) {
                            this.$Message.success('操作成功')
                            this.$emit('on-refresh', {}, 'head')
                        }
                    })
                }
            })
        },
        // 动态改变表格的width
        handleResize() {
            this.tableWidth = this.$refs['order_table']?.offsetWidth - 40
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
        // 切换分页
        handlePageChange(page) {
            this.$emit('on-page-change', page)
        },
        getPayType(type) {
            let typeList = [
                {
                    id: '10',
                    text: '余额',
                    icon: 'icon-money-pay',
                    class: 'money-text'
                },

                {
                    id: '20',
                    text: '微信',
                    icon: 'icon-wechatpay',
                    class: 'wepay-text'
                },
                {
                    id: '30',
                    text: '支付宝',
                    icon: 'icon-alipay',
                    class: 'alipay-text'
                }
            ]
            return typeList.filter(list => list.id == type)[0] || {}
        },
        replaceImg(e) {
            e.target.src = this.$utils.staticImg('decorate/avatar.png')
        }
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
            let text = {
                '1': '一级分销商：',
                '2': '二级分销商：',
            }
            return text[level]
        }
    },

    mounted() {
        this.getCloneColumns()
        this.getTotalWidth()
        this.handleResize()
        // 监听窗口的变化
        window.addEventListener('resize', this.handleResize)
    }
}
</script>

<style scoped lang="scss">
.order-table-list {
    padding: 0 20px 20px 20px;
    background-color: #ffffff;
    position: relative;
    min-height: 100%;
    // 表头
    .table-header {
        height: 64px;
        box-sizing: border-box;
        border-bottom: 1px solid $border-color;
        margin-bottom: 20px;

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
    .table-content-box {
        .table-content {
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    .table-content {
        border: 1px solid $border-color;
        border-radius: 2px;
        margin-bottom: 20px;

        // 下单时间
        .table-content-time {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            padding: 0 20px;
            align-items: center;
            @include font-14-20;
            background-color: $background-color;
            height: 50px;
            border-right: 1px solid $border-color;

            .left {
                .text {
                    padding-right: 20px;
                    color: $text-third;
                }
            }
        }

        // 订单信息
        .table-order {
            > table {
                /*width: 100%;*/
                > tr {
                    /*width: 100%;*/
                    > td {
                        @include font-14-20;
                        color: $text-first;
                        padding: 20px 15px 20px 20px;
                        .iconfont {
                            font-size: 20px;
                        }
                        // 商品信息
                        .member {
                            display: flex;
                            flex-wrap: nowrap;

                            .member-image {
                                width: 46px;
                                height: 46px;
                                margin-right: 10px;
                                box-sizing: border-box;
                                border: 1px solid #e9edef;
                                overflow: hidden;
                                border-radius: 50%;
                                flex-shrink: 0;

                                > img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }

                            .member-info {
                                .title {
                                    font-size: 14px;
                                    line-height: 20px;
                                    color: $brand-color;
                                    cursor: pointer;
                                }
                            }
                        }

                        .level-img {
                            margin-right: 4px;
                            width: 20px;
                            height: 20px;
                        }

                        &.actual {
                            font-weight: bold;
                        }

                        .action-btn {
                            margin-right: 10px;
                            color: $brand-color;
                            cursor: pointer;
                        }

                        .pay-info {
                            margin-top: 7px;
                            .pay-icon {
                                font-size: 20px;
                            }

                            .pay-text {
                                @include font-14-20;
                                padding-left: 2px;
                            }
                        }
                        .money-text {
                            color: #ff9900;
                        }
                        .wepay-text {
                            color: #19be6b;
                        }
                        .alipay-text {
                            color: $brand-color;
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
                    }
                }
            }
        }
    }

    // 分页
    .table-footer {
       // border-top: 1px solid $border-color;
      //  padding: 20px 0;
        padding-top: 20px;
        display: flex;
        justify-content: center;
    }
}
</style>
