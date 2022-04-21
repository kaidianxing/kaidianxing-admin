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
                        placeholder="会员信息/操作员信息"
                        class="width-340"
                        v-model="searchData.keyword"
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
                <FormItem label="操作时间：">
                    <DatePicker
                        class="width-340"
                        placeholder="请选择操作时间"
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
                    <template slot-scope="{ row }" slot="nickname">
                        <div class="nickname">
                            <div class="avatar">
                                <img
                                    :src="row.avatar"
                                    alt=""
                                    @error="replaceImage($event, 'avatar')"
                                />
                            </div>
                            <div class="right">
                                <div
                                    class="name"
                                    @click="jumpVip(row.member_id)"
                                >
                                    {{ row.nickname }}
                                </div>
                                <div class="icon">
                                    <span
                                        class="iconfont icon-H"
                                        v-if="row.source === '10'"
                                    ></span>
                                    <span
                                        class="iconfont icon-weixin"
                                        v-else-if="row.source === '20'"
                                    ></span>
                                    <span
                                        class="iconfont icon-weixinxiaochengxu"
                                        v-else-if="row.source === '21'"
                                    ></span>
                                    <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2" v-else-if="row.source === '30'"></kdx-svg-icon>
                                    <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban" v-else-if="row.source === '32'"></kdx-svg-icon>
                                    <kdx-svg-icon class="iconfont" type="icon-douyin" v-else-if="row.source === '31'"></kdx-svg-icon>
                                    <!-- <span
                                        class="iconfont icon-zhifubaoxiaochengxu"
                                        v-if="row.source === '5'"
                                    ></span> -->
                                </div>
                            </div>
                        </div>
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
import { Export } from '@/helpers/export'
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
                keyword: '',
                export: '',
            },
            levels: [], // 用户等级
            loading: false,
            member_id: '', //缓存路由的会员id
            columns: [
                {
                    title: '会员',
                    slot: 'nickname',
                    minWidth: 160,
                    maxWidth: 300,
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
                                      {params.row.is_default == '1'? '':<kdx-svg-icon type="icon-huiyuan-bg" class="icon"></kdx-svg-icon>}
                                  </div>
                                    <span class="text">
                                        {params.row[params.column.key]}
                                    </span>
                                </div>
                            )
                        } else {
                            return <div>普通会员</div>
                        }
                    },
                },
                {
                    title: '积分变化',
                    key: 'num',
                    minWidth: 120,
                    render: (h, params) => {
                        if (parseFloat(params.row.num) > 0) {
                            return (
                                <kdx-status-text type="success" class="num-change">
                                    +{parseFloat(params.row.num)}
                                </kdx-status-text>
                            )
                        } else if (parseFloat(params.row.num) < 0) {
                            return (
                                <kdx-status-text type="danger" class="num-change">
                                    {parseFloat(params.row.num)}
                                </kdx-status-text>
                            )
                        } else {
                            return <div>{parseFloat(params.row.num)}</div>
                        }
                    },
                },
                {
                    title: '当前积分',
                    key: 'present_credit',
                    minWidth: 120,
                },
                // {
                //     title: '备注',
                //     key: 'remark',
                //     minWidth: 120,
                // },
                {
                    title: '发放方式',
                    key: 'remark',
                    minWidth: 120,
                },
                {
                    title: '操作人',
                    key: 'operator_text',
                    minWidth: 120,
                },
                {
                    title: '操作时间',
                    key: 'created_at',
                    minWidth: 100,
                    maxWidth: 180
                },
            ],
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
    created() {
        this.member_id = this.$route.query.member_id
        this.getReditRecordLabel()
        this.getIntegralList()
    },
    methods: {
        // 获取筛选标签
        getReditRecordLabel() {
            this.$api.financeApi.getReditRecordLabel({}).then((res) => {
                if (res.error == 0) {
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
        // 积分列表
        getIntegralList() {
            this.returnToTop();
            let _params = {
                level_id:
                    this.searchData.level_id === 'all'
                        ? ''
                        : this.searchData.level_id,
                keyword: this.searchData.keyword,
                export: this.searchData.export,
                page: this.page,
                pagesize: this.pagesize,
                member_id: this.member_id,
            }
            if (this.searchData.startTime) {
                _params['created_at[0]'] = this.searchData.startTime
            }
            if (this.searchData.endTime) {
                _params['created_at[1]'] = this.searchData.endTime
            }
            this.loading = true;
            this.$api.financeApi.getIntegralList(_params).then((res) => {
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
            this.$refs['page']?.reset()
            this.getIntegralList()
        },
        // 点击重置按钮
        handleReset() {
            this.selectDate = ['', '']
            this.searchData.startTime = ''
            this.searchData.endTime = ''
            this.searchData.level_id = 'all'
            this.searchData.keyword = ''
            this.searchData.export = ''
            this.page = 1
            this.pagesize = 10
            this.$refs['page']?.reset()
            this.getIntegralList()
        },
        // 点击导出按钮
        handleExport() {
            let level_id =
                this.searchData.level_id === 'all'
                    ? ''
                    : this.searchData.level_id
            let keyword = this.searchData.keyword
            // let page = this.page
            // let pagesize = this.pagesize
            let params = {
                level_id,
                keyword,
                export: 1
            }
            // let downloadurl = `manage/finance/credit-record/integral&level_id=${level_id}&keyword=${keyword}&page=${page}&pagesize=${pagesize}&export=1`
            if (this.searchData.startTime) {
                // downloadurl = `${downloadurl}&created_at[0]=${this.searchData.startTime}`
                params.created_at[0] = this.searchData.startTime;
            }
            if (this.searchData.endTime) {
                // downloadurl = `${downloadurl}&created_at[1]=${this.searchData.endTime}`
                params.created_at[1] = this.searchData.endTime;
            }
            // window.location.href = downloadurl
            Export('manage/finance/credit-record/integral', params);
        },
        // 切换页码
        changePage(page) {
            this.page = page.pageNumber
            this.pagesize = page.pageSize
            this.getIntegralList()
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
    .nickname {
        display: flex;
        align-items: center;
        .avatar {
            padding-right: 10px;
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
    /deep/ .ivu-table {
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
        // 积分变化
        .num-change {
            .status-text-size-default {
                font-weight: bold;
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
</style>
