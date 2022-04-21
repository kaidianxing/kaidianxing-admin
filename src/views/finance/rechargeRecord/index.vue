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
    <div class="container">
        <kdx-header-bar>
            <Form
                ref="form"
                :model="searchData"
                :label-width="100"
                inline
                @submit.native.prevent
            >
                <FormItem label="关键词：">
                    <Input
                        type="text"
                        placeholder="昵称/姓名/手机号/充值单号"
                        class="width-340"
                        v-model="searchData.keyword"
                        @on-enter="handleSearch"
                    />
                </FormItem>
                <FormItem label="充值状态：">
                    <Select v-model="searchData.status" class="width-160">
                        <Option
                            v-for="(item, index) in type"
                            :key="index"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="会员等级：">
                    <Select v-model="searchData.level_id" class="width-160">
                        <Option
                            v-for="(item, index) in levels"
                            :key="index"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="充值方式：">
                    <Select v-model="searchData.pay_type" class="width-160">
                        <Option
                            v-for="(item, index) in pay_type"
                            :key="index"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="充值时间：">
                    <DatePicker
                        class="width-340"
                        placeholder="请选择充值时间"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm"
                        :confirm="true"
                        v-model="selectDate"
                    ></DatePicker>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                    <Button type="text" @click="handleExport">导出</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="list-wrap" v-loading="loading">
                <Table ref="table" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="money">
                        <div class="money">
                            ￥{{ row.money }}
                        </div>
                    </template>
                    <template slot-scope="{ row }" slot="status_text">
                        <kdx-status-text type="success" v-if="row.status === '10'">
                            {{ row.status_text }}
                        </kdx-status-text>
                        <kdx-status-text type="warning" v-if="row.status === '30'">
                            {{ row.status_text }}
                        </kdx-status-text>
                        <kdx-status-text type="danger" v-if="row.status === '0'">
                            未支付
                        </kdx-status-text>
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <Button
                            :disabled='noManagePerm'
                            type="text"
                            v-if="row.status === '10' && row.pay_type !== '10'"
                            @click="handleRefund(row)"
                        >
                            退款
                        </Button>
                        <div class="text" v-else>-</div>
                    </template>
                </Table>
                <div class="footer-page">
                    <kdx-page-component
                        ref="page"
                        :total="total"
                        @on-change="changePage"
                    ></kdx-page-component>
                </div>
            </div>
        <slot></slot>
    </div>
</template>

<script>
import { formatDate } from '@/assets/helpers/index'
// import { config as settings } from '@/api/config/settings.js'
import {Export} from '@/helpers/export'
export default {
    inject:['returnToTop'],
    components: {},
    props: {},
    data() {
        return {
            total: 0,
            page: 1,
            pagesize: 10,
            list: [],
            selectDate: ['', ''],
            // 搜索信息
            searchData: {
                startTime: '',
                endTime: '',
                level_id: 'all',
                status: 'all',
                pay_type: 'all',
                keyword: '',
                export: '',
            },
            type: [
                {
                    value: 'all',
                    label: '全部',
                },
                {
                    value: '0',
                    label: '未支付',
                },
                {
                    value: '10',
                    label: '成功',
                },
                {
                    value: '30',
                    label: '已退款',
                },
            ], // 充值状态
            pay_type: [], // 付款方式
            levels: [], // 用户等级
            loading: false,
            columns: [
                {
                    title: '会员',
                    key: 'nickname',
                    minWidth: 160,
                    maxWidth: 300,
                    render: (h, params) => {
                        // 用户来源 10: h5;20: 微信公众号;21: 微信小程序;30:头条小程序;31:抖音小程序;5:支付宝小程序;
                        let component
                        if (params.row.source == '20') {
                            // 公众号
                            component = (
                                <span class="iconfont icon-weixin icon"></span>
                            )
                        } else if (params.row.source == '21') {
                            // 微信小程序
                            component = (
                                <span class="iconfont icon-weixinxiaochengxu icon"></span>
                            )
                        }
                        else if (params.row.source == '30') {
                            // 头条小程序 字节跳动小程序
                            component = (
                                <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2"></kdx-svg-icon>
                            );
                        }
                        else if (params.row.source == '32') {
                            // 头条小程序 字节跳动小程序
                            component = (
                                <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban"></kdx-svg-icon>
                            );
                        }
                        else if (params.row.source == '31') {
                            // 抖音小程序 字节跳动小程序
                            component = (
                                <kdx-svg-icon class="iconfont" type="icon-douyin"></kdx-svg-icon>
                            );
                        }
                        // else if (params.row.source == '5') {
                        //     // 支付宝小程序
                        //     component = (
                        //         <span class="iconfont icon-zhifubaoxiaochengxu icon"></span>
                        //     );
                        // }
                        else if (params.row.source == '10') {
                            // h5
                            component = (
                                <span class="iconfont icon-H icon"></span>
                            )
                        }
                        // 百度小程序
                        // <span v-if="list.create_from === '0'" class="iconfont icon-baiduxiaochengxu icon"></span>
                        return (
                            <div class="vip">
                                <div class="vip-image">
                                    <img
                                        src={this.$media(params.row.avatar)}
                                        onError={(e) => {
                                            this.replaceImage(e, 'avatar')
                                        }}
                                    />
                                </div>
                                <div class="vip-content">
                                    <div
                                        class="vip-name"
                                        onClick={() => {
                                            this.jumpVip(params.row.member_id)
                                        }}
                                    >
                                        {params.row.nickname || '-'}
                                    </div>
                                    <div class="vip-platform">{component}</div>
                                </div>
                            </div>
                        )
                    },
                },
                {
                    title: '会员等级',
                    key: 'level_name',
                    minWidth: 120,
                    maxWidth: 200,
                    render: (h, params) => {
                        if (params.row[params.column.key]) {
                            return (
                                <div class="vip-grade">
                                    <div class="icon">
                                        {params.row.is_default == '1' ? (
                                            ''
                                        ) : (
                                            <kdx-svg-icon type="icon-huiyuan-bg"></kdx-svg-icon>
                                        )}
                                    </div>
                                    <div class="text">
                                        {params.row[params.column.key]}
                                    </div>
                                </div>
                            )
                        } else {
                            return <div>普通会员</div>
                        }
                    },
                },
                {
                    title: '充值金额',
                    slot: 'money',
                    minWidth: 120,
                },
                {
                    title: '时间',
                    key: 'created_at',
                    minWidth: 120,
                },
                {
                    title: '充值单号',
                    key: 'log_sn',
                    minWidth: 150,
                    render: (h, params) => {
                        return (
                            <div style="word-break:break-all;">
                                {params.row[params.column.key]}
                            </div>
                        )
                    },
                },
                {
                    title: '充值方式',
                    key: 'pay_type_text',
                    minWidth: 100,
                    render: (h, params) => {
                        //  10: "后台" 20: "微信" 30: "支付宝" 40: "银行卡"
                        let icon
                        if (params.row.pay_type == '10') {
                            icon = (
                                <span class="iconfont icon-zhifu-houtaizhifu icon"></span>
                            )
                        } else if (params.row.pay_type == '20') {
                            icon = (
                                <span class="iconfont icon-wechatpay icon"></span>
                            )
                        } else if (params.row.pay_type == '30') {
                            icon = (
                                <span class="iconfont icon-alipay icon"></span>
                            )
                        } else if (params.row.pay_type == '40') {
                            icon = (
                                <kdx-svg-icon
                                    type="icon-zhifu-yinlian"
                                    class="icon"
                                ></kdx-svg-icon>
                            )
                        }
                        return (
                            <div class="pay-type-text">
                                {icon}
                                <span class="text">
                                    {params.row.pay_type_text}
                                </span>
                            </div>
                        )
                    },
                },
                {
                    title: '状态',
                    slot: 'status_text',
                    minWidth: 100,
                    maxWidth: 150
                },
                {
                    title: '操作',
                    slot: 'action',
                    minWidth: 100,
                    maxWidth: 150
                },
            ],
        }
    },
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('finance.recharge.manage')
        },
    },
    watch: {
        selectDate: {
            handler(value) {
                this.searchData.startTime =
                    value[0] === ''
                        ? ''
                        : formatDate(new Date(value[0]), 'yyyy-MM-dd hh:mm:ss')
                this.searchData.endTime =
                    value[1] === ''
                        ? ''
                        : formatDate(new Date(value[1]), 'yyyy-MM-dd hh:mm:ss')
            },
            deep: true,
            immediate: true,
        },
    },
    created() {
        this.getWithdrawApplyLabel()
        this.getRechargeList()
    },
    methods: {
        // 获取申请提现筛选标签
        getWithdrawApplyLabel() {
            this.$api.financeApi.getWithdrawApplyLabel({}).then((res) => {
                if (res.error == 0) {
                    this.pay_type = Object.entries(res.pay_type).map((item) => {
                        return {
                            value: item[0],
                            label: item[1],
                        }
                    })
                    this.pay_type.unshift({
                        value: 'all',
                        label: '全部',
                    })
                    this.levels = Object.entries(res.levels).map((item) => {
                        return {
                            value: item[0],
                            label: item[1],
                        }
                    })
                    this.levels.unshift({
                        value: 'all',
                        label: '全部',
                    })
                }
            })
        },
        // 充值记录列表
        getRechargeList() {
            this.returnToTop();
            let _params = {
                level_id:
                    this.searchData.level_id === 'all'
                        ? ''
                        : this.searchData.level_id,
                status:
                    this.searchData.status === 'all'
                        ? ''
                        : this.searchData.status,
                pay_type:
                    this.searchData.pay_type === 'all'
                        ? ''
                        : this.searchData.pay_type,
                keyword: this.searchData.keyword,
                export: this.searchData.export,
                page: this.page,
                pagesize: this.pagesize,
            }
            if (this.searchData.startTime) {
                _params['created_at[0]'] = this.searchData.startTime
            }
            if (this.searchData.endTime) {
                _params['created_at[1]'] = this.searchData.endTime
            }
            this.loading = true;
            this.$api.financeApi.getRechargeList(_params).then((res) => {
                if (res.error == 0) {
                    this.loading = false;
                    this.total = res.total
                    this.list = [...res.list]
                }
            })
        },
        // 点击搜索按钮
        handleSearch() {
            this.page = 1
            this.pagesize = 10
            this.$refs['page'].reset()
            this.getRechargeList()
        },
        // 点击重置按钮
        handleReset() {
            this.selectDate = ['', '']
            this.searchData.startTime = ''
            this.searchData.endTime = ''
            this.searchData.level_id = 'all'
            this.searchData.status = 'all'
            this.searchData.pay_type = 'all'
            this.searchData.keyword = ''
            this.searchData.export = ''
            this.page = 1
            this.pagesize = 10
            this.$refs['page'].reset()
            this.getRechargeList()
        },
        // 点击导出按钮
        handleExport() {
            // const base_url = settings.base_url
            let level_id =
                this.searchData.level_id === 'all'
                    ? ''
                    : this.searchData.level_id
            let status =
                this.searchData.status === 'all' ? '' : this.searchData.status
            let pay_type =
                this.searchData.pay_type === 'all'
                    ? ''
                    : this.searchData.pay_type
            let keyword = this.searchData.keyword
            // let page = this.page
            // let pagesize = this.pagesize
            let params = {
                level_id,
                status,
                pay_type,
                keyword,
                export: 1
            }
            // let downloadurl = `${base_url}/manage/finance/log/recharge?level_id=${level_id}&status=${status}&pay_type=${pay_type}&keyword=${keyword}&page=${page}&pagesize=${pagesize}&export=1`
            if (this.searchData.startTime) {
                // downloadurl = `${downloadurl}&created_at[0]=${this.searchData.startTime}`
                params.created_at[0] = this.searchData.startTime;
            }
            if (this.searchData.endTime) {
                // downloadurl = `${downloadurl}&created_at[1]=${this.searchData.endTime}`
                params.created_at[1] = this.searchData.startTime;
            }
            Export('manage/finance/log/recharge', params);
            // window.location.href = downloadurl
        },
        // 切换页码
        changePage(page) {
            this.page = page.pageNumber
            this.pagesize = page.pageSize
            this.getRechargeList()
        },
        // 充值退款
        handleRefund(data) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认退款?',
                onOk: () => {
                    this.rechargeRefund(data)
                },
                onCancel: () => {},
            })
        },
        // 充值退款
        rechargeRefund(data) {
            this.$api.financeApi
                .rechargeRefund({
                    order_id: data.order_id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        this.$Message.success('退款成功')
                        this.getRechargeList()
                    }
                })
        },
        // 跳转会员详情
        jumpVip(id) {
            this.$utils.openNewWindowPage('/member/detail', { id: id })
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #f4f6f8;
    margin: 20px auto;
}

.list-wrap {
    padding: 0 20px;
    background: #fff;
    position: relative;
    .money {
        @include font-14-20-bold;
    }
    /deep/ .ivu-table {
        // 会员
        .vip {
            display: flex;
            flex-wrap: nowrap;

            > .vip-image {
                display: flex;
                align-items: center;
                > img {
                    border: 1px solid $border-color;
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                }
            }

            > .vip-content {
                padding-left: 10px;

                > .vip-name {
                    width: 100%;
                    padding-bottom: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: $brand-color;
                    cursor: pointer;
                }

                > .vip-platform {
                    > .icon {
                        font-size: 18px;
                        margin-right: 10px;
                        vertical-align: middle;
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
        // 会员等级
        .vip-grade {
            display: flex;
            flex-wrap: nowrap;
            .icon {
                flex-shrink: 0;
                .svg-icon {
                    font-size: 20px;
                    padding-right: 4px;
                    vertical-align: bottom;
                }
            }
            .text {
                width: 0;
                flex: 1;
            }
        }
        // 充值方式
        .pay-type-text {
            .icon {
                font-size: 20px;
                padding-right: 2px;
                vertical-align: middle;
            }
            .text {

            }
            .icon-wechatpay {
                color: #00ac1c;
            }
            .icon-alipay {
                color: #00a0ee;
            }
            .icon-zhifu-houtaizhifu {
                color: $warning-color;
            }
        }
        // 会员等级
        .vip-grade {
            .text {
                padding-left: 4px;
                vertical-align: text-bottom;
            }
        }
    }
}

.ivu-form .ivu-form-item {
    margin-bottom: 0;
    &:nth-child(4) {
        margin-right: 20px;
    }
}

.footer-page {
    background: #fff;
}
</style>
