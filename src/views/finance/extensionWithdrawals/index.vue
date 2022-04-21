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
                        v-model="searchData.keywords"
                        placeholder="昵称/姓名/手机号"
                        class="width-340"
                        @on-enter="handleSearch"
                    />
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
                <FormItem label="提现方式：">
                    <Select v-model="searchData.type" class="width-160">
                        <Option
                            v-for="(item, index) in pay_type"
                            :key="index"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="提现状态：">
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
                <FormItem label="申请时间：">
                    <DatePicker
                        v-model="selectDate"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm"
                        placeholder="请选择"
                        class="width-340"
                        :confirm="true"
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
            <div class="custom-table">
                <div class="theader">
                    <ul>
                        <li>会员</li>
                        <li>会员等级</li>
                        <li>申请金额</li>
                        <li style="display:none">手续费</li>
                        <li style="display:none">实际到账金额</li>
                        <li>提现方式</li>
                        <li>提现状态</li>
                        <li>申请时间</li>
                        <li>操作</li>
                    </ul>
                </div>
                <div class="tbody" v-if="list.length">
                    <div
                        class="tr"
                        v-for="(item, index) in list"
                        :key="index"
                    >
                        <div class="code">
                            <div class="text">提现编号：</div>
                            {{ item.apply_no }}
                            <div
                                class="copy"
                                v-clipboard:copy="item.apply_no"
                                v-clipboard:success="onCopySuccess"
                                v-clipboard:error="onCopyError"
                            >
                                复制
                            </div>
                        </div>
                        <ul>
                            <li>
                                <div class="box">
                                    <div class="avatar">
                                        <img
                                            :src="item.avatar"
                                            alt=""
                                            @error="replaceImage($event, 'avatar')"
                                        />
                                    </div>
                                    <div class="right">
                                        <div
                                            class="name"
                                            @click="jumpVip(item.member_id)"
                                        >
                                            {{ item.nickname }}
                                        </div>
                                        <div class="icon">
                                            <span
                                                class="iconfont icon-H"
                                                v-if="item.client_type === '10'"
                                            ></span>
                                            <span
                                                class="iconfont icon-weixin"
                                                v-else-if="item.client_type === '20'"
                                            ></span>
                                            <span
                                                class="iconfont icon-weixinxiaochengxu"
                                                v-else-if="item.client_type === '21'"
                                            ></span>
                                            <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2" v-else-if="item.client_type === '30'"></kdx-svg-icon>
                                            <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban" v-else-if="item.client_type === '32'"></kdx-svg-icon>
                                            <kdx-svg-icon class="iconfont" type="icon-douyin" v-else-if="item.client_type === '31'"></kdx-svg-icon>
                                            <!-- <span
                                                class="iconfont icon-zhifubaoxiaochengxu"
                                                v-if="item.source === '5'"
                                            ></span> -->
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="box">
                                    <div class="left">
                                        <kdx-svg-icon type="icon-huiyuan-bg" v-if="item.is_default != '1'" />
                                    </div>
                                    <div class="right">
                                        {{ item.level_name }}
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="box">￥{{ item.apply_commission }}</div>
                            </li>
                            <li style="display:none">
                                <div class="box">
                                    ￥{{ item.deduct_money }}
                                </div>
                            </li>
                            <li style="display:none">
                                <div class="box">
                                    ￥{{ item.real_money }}
                                </div>
                            </li>
                            <li>
                                <div class="box">
                                    <div class="box-item channel">
                                        <div class="left">渠道：</div>
                                        <div class="right">
                                            <span
                                                class="iconfont icon-money-pay"
                                                v-if="item.type === '1'"
                                            ></span>
                                            <span
                                                class="iconfont icon-wechatpay"
                                                v-if="
                                                    item.type === '20'
                                                "
                                            ></span>
                                            <span
                                                class="iconfont icon-alipay"
                                                v-if="
                                                    item.type === '30'
                                                "
                                            ></span>
                                            <kdx-svg-icon
                                                type="icon-zhifu-yinlian"
                                                v-if="item.type === '4'"
                                            />
                                            {{ item.type_text }} 
                                        </div>
                                    </div>
                                    <div
                                        class="box-item name"
                                        v-if="
                                            item.apply_commission &&
                                                item.type !== '20'
                                        "
                                    >
                                        <div class="left">姓名：</div>
                                        <div class="right">
                                            {{ item.realname }}
                                        </div>
                                    </div>
                                    <div
                                        class="box-item account"
                                        v-if="
                                            item.apply_commission &&
                                                item.type !== '20'
                                        "
                                    >
                                        <div class="left">账号：</div>
                                        <div class="right">
                                            {{ item.alipay }}
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div
                                    class="box"
                                    :class="{
                                        applying: item.status === '0',
                                        paid: item.status === '10',
                                        payment: item.status === '11',
                                        refuse: item.status === '40',
                                    }"
                                >
                                    {{
                                        item.status === '0'
                                            ? '待审核'
                                            : item.status_text
                                    }}
                                </div>
                            </li>
                            <li>
                                <div class="box">
                                    {{ item.created_at }}
                                </div>
                            </li>
                            <li>
                                <div class="box" v-if="item.status !== '10' && item.status !== '11' && item.status !== '40' && item.status !== '20'">
                                    <Button
                                        :disabled='noManagePerm'
                                        type="text"
                                        @click="handleWithdraw(item)"
                                    >
                                        {{ item.type === '20' ? '微信打款' : '支付宝打款'}}
                                    </Button>
                                    <Button
                                        :disabled='noManagePerm'
                                        class="mL-10"
                                        type="text"
                                        @click="handleStatus(item, '11')"
                                    >
                                        手动打款
                                    </Button>
                                    <Button
                                        :disabled='noManagePerm'
                                        class="mL-10"
                                        type="text"
                                        @click="handleStatus(item, '40')"
                                    >
                                        拒绝
                                    </Button>
                                </div>
                                <div class="box" v-else>-</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="nodata" v-else>暂无数据</div>
            </div>
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
import { config as settings } from '@/api/config/settings.js'
// import { getUserInfo } from '@/helpers/getUserInfo';
import { Export } from '@/helpers/export'

export default {
    inject:['returnToTop'],
    components: {},
    props: {},
    data() {
        return {
            withdraw_fee: '', // 提现手续费
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
                type: 'all',
                keywords: '',
                export: '',
            },
            type: [
                {
                    value: 'all',
                    label: '全部',
                },
                {
                    value: '0',
                    label: '待审核',
                },
                {
                    value: '10',
                    label: '提现成功',
                },
                {
                    value: '11',
                    label: '手动打款',
                },
                {
                    value: '20',
                    label: '已拒绝',
                },
            ], // 提现状态
            pay_type: [], // 提现方式
            levels: [], // 用户等级
            loading: false
        }
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
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('merchant_finance.commission.manage')
        },
    },
    created() {
        this.getIntegralSetting()
        this.getWithdrawApplyLabel()
        this.getWithdrawList()
    },
    methods: {
        // 获取积分余额设置（提现手续费）
        getIntegralSetting() {
            this.$api.settingApi.getBalanceSetting({}).then((res) => {
                if (res.error === 0) {
                    this.withdraw_fee = res.withdraw_fee
                }
            })
        },
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
        // 提现记录列表
        getWithdrawList() {
            this.returnToTop();
            this.loading = true;
            let _params = {
                level_id:
                    this.searchData.level_id === 'all'
                        ? ''
                        : this.searchData.level_id,
                status:
                    this.searchData.status === 'all'
                        ? ''
                        : this.searchData.status,
                type:
                    this.searchData.type === 'all'
                        ? ''
                        : this.searchData.type,
                keywords: this.searchData.keywords,
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
            this.$api.financeApi.getCommissionList(_params).then((res) => {
                this.loading = false;
                if (res.error == 0) {
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
            this.getWithdrawList()
        },
        // 点击重置按钮
        handleReset() {
            this.selectDate = ['', '']
            this.searchData.startTime = ''
            this.searchData.endTime = ''
            this.searchData.level_id = 'all'
            this.searchData.status = 'all'
            this.searchData.type = 'all'
            this.searchData.keywords = ''
            this.searchData.export = ''
            this.page = 1
            this.pagesize = 10
            this.$refs['page'].reset()
            this.getWithdrawList()
        },
        // 点击导出按钮
        handleExport() {
            const base_url = settings.base_url
            let level_id =
                this.searchData.level_id === 'all'
                    ? ''
                    : this.searchData.level_id
            let status =
                this.searchData.status === 'all' ? '' : this.searchData.status
            let type =
                this.searchData.type === 'all'
                    ? ''
                    : this.searchData.type
            let keywords = this.searchData.keywords
            let page = this.page
            let pagesize = this.pagesize
            let downloadurl = `${base_url}manage/apps/merchant/platform/merchant/commission/withdraw/export&level_id=${level_id}&status=${status}&type=${type}&keywords=${keywords}&page=${page}&pagesize=${pagesize}&export=1`
            if (this.searchData.startTime) {
                downloadurl = `${downloadurl}&created_at[0]=${this.searchData.startTime}`
            }
            if (this.searchData.endTime) {
                downloadurl = `${downloadurl}&created_at[1]=${this.searchData.endTime}`
            }

            // let oc = getUserInfo();
            // for(let i in oc){
            //     downloadurl+=`&${i}=${oc[i]}`;
            // }
     
            Export(downloadurl);
        //    window.location.href = downloadurl
        },
        // 切换页码
        changePage(page) {
            this.page = page.pageNumber
            this.pagesize = page.pageSize
            this.getWithdrawList()
        },
        // 复制成功
        onCopySuccess() {
            this.$Message.success('内容已复制到剪切板！')
        },
        // 复制失败
        onCopyError() {
            this.$Message.error('抱歉，复制失败！')
        },
        // 支付宝打款
        handleWithdraw(data) {
            let content
            if (data.type === '20') {
                content = '确认微信打款?'
            } else {
                content = '确认支付宝打款?'
            }
            this.$Modal.confirm({
                title: '提示',
                content,
                onOk: () => {
                    this.withdrawApply(data)
                },
                onCancel: () => {},
            })
        },
        // 支付宝打款
        withdrawApply(data) {
            this.$api.financeApi
                .autoWithdrawApply({
                    id: data.id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        let content
                        if (data.type === '20') {
                            content = '微信打款成功'
                        } else {
                            content = '支付宝打款成功'
                        }
                        this.$Message.success(content)
                        this.getWithdrawList()
                    }
                })
        },
        // 手动打款、拒绝
        handleStatus(data, status) {
            let _content
            if (status === '11') {
                _content = '确认手动打款?'
            } else {
                _content = '确认拒绝?'
            }
            this.$Modal.confirm({
                title: '提示',
                content: _content,
                onOk: () => {
                    this.updateStatus(data, status)
                },
                onCancel: () => {},
            })
        },
        // 手动打款、拒绝
        updateStatus(data, status) {
            let name = 11 === +status ? 'doWithdrawApply' : 'doReject';

            this.$api.financeApi[name]({
                    status: status,
                    id: data.id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        this.$Message.success('操作成功')
                        this.getWithdrawList()
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
}
.ivu-form .ivu-form-item {
    margin-bottom: 0;
    &:nth-child(1) {
        margin-bottom: 20px;
    }
}
.custom-table {
    font-size: 14px;
    line-height: 20px;
    ul {
        display: flex;
        li {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding-left: 20px;
            flex-shrink: 0;
            &:nth-child(1) {
                width: 160px;
            }
            &:nth-child(2) {
                flex: 1;
            }
            &:nth-child(3) {
                flex: 1;
            }
            &:nth-child(4) {
                flex: 1;
            }
            &:nth-child(5) {
                flex: 1;
            }
            &:nth-child(6) {
                width: 200px;
            }
            &:nth-child(7) {
                flex: 1;
            }
            &:nth-child(8) {
                flex: 1;
            }
            &:nth-child(9) {
                width: 240px;
            }
        }
    }
    .theader {
        ul {
            height: 64px;
            li {
                height: 64px;
                font-weight: bold;
                font-size: 14px;
                line-height: 20px;
                color: #262b30;
            }
        }
    }
    .tbody {
        .tr {
            border: 1px solid #e9edef;
            border-radius: 2px;
            margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
            .code {
                padding-left: 20px;
                display: flex;
                align-items: center;
                height: 50px;
                background-color: #f4f6f8;
                color: #939799;
                .text {
                    font-weight: bold;
                }
                .copy {
                    color: $brand-color;
                    margin-left: 10px;
                    cursor: pointer;
                }
            }
            ul {
                padding-top: 20px;
                padding-bottom: 20px;
                li:nth-child(1) {
                    .box {
                        display: flex;
                        align-items: center;
                        .avatar {
                            img {
                                width: 46px;
                                height: 46px;
                                border-radius: 50%;
                            }
                        }
                        .right {
                            padding-left: 10px;
                            .name {
                                color: $brand-color;
                                cursor: pointer;
                            }
                            .icon {
                                margin-top: 4px;
                                .iconfont {
                                    font-size: 20px;
                                    &.icon-H {
                                        color: #ff6004;
                                    }
                                    &.icon-weixin {
                                        color: #1bb723;
                                    }
                                    &.icon-weixinxiaochengxu {
                                        color: #677de0;
                                    }
                                    &.icon-zhifubaoxiaochengxu {
                                        color: #2094e7;
                                    }
                                    &.icon-douyin {
                                        color: #1f0a1c;
                                    }
                                }
                            }
                        }
                    }
                }
                li:nth-child(2) {
                    .box {
                        display: flex;
                        align-items: center;
                        .left {
                            .svg-icon {
                                font-size: 20px;
                            }
                        }
                        .right {
                            padding-left: 4px;
                        }
                    }
                }
                li:nth-child(5) {
                    .box {
                        font-weight: bold;
                    }
                }
                li:nth-child(6) {
                    .box {
                        .box-item {
                            display: flex;
                            align-items: center;
                            margin-top: 10px;
                            &:first-child {
                                margin-top: 0;
                            }
                            .left {
                                width: 42px;
                            }
                            .right {
                                display: flex;
                                align-items: center;
                            }
                            &.channel {
                                display: flex;
                                align-items: center;
                                .iconfont {
                                    font-size: 20px;
                                    &.icon-money-pay {
                                        color: #ff9900;
                                    }
                                    &.icon-wechatpay {
                                        color: #00ac1c;
                                    }
                                    &.icon-alipay {
                                        color: #00a0ee;
                                    }
                                }
                            }
                        }
                    }
                }
                li:nth-child(7) {
                    .box {
                        &.applying {
                            color: #ff9900;
                        }
                        &.paid {
                            color: #19be6b;
                        }
                        &.payment {
                            color: $brand-color;
                        }
                        &.refuse {
                            color: #ff1f2c;
                        }
                    }
                }
                li:nth-child(9) {
                    .box {
                        .mL-10 {
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
    }
    .nodata {
        text-align: center;
        color: #262b30;
        font-size: 14px;
        height: 48px;
        line-height: 48px;
        border-top: 1px solid #e8eaec;
        border-bottom: 1px solid #e8eaec;
    }
}
.footer-page {
    border-top: none;
}
</style>
