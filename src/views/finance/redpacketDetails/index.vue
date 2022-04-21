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
                            placeholder="昵称/姓名/手机号"
                            class="width-340"
                            v-model="searchData.keywords"
                            @on-enter="handleSearch"
                    />
                </FormItem>
                <FormItem label="领取状态：">
                    <Select v-model="searchData.status" class="width-160">
                        <Option
                                v-for="(item, index) in receive"
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
                <FormItem label="发放时间：">
                    <DatePicker
                            class="width-340"
                            placeholder="请选择发放时间"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm"
                            :confirm="true"
                            @on-change="change_created_at"
                            v-model="created_at"
                    ></DatePicker>
                </FormItem>
                <FormItem label="领取时间：">
                    <DatePicker
                            class="width-340"
                            placeholder="请选择领取时间"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm"
                            :confirm="true"
                            @on-change="change_updated_at"
                            v-model="updated_at"
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
            <Table
                    ref="table"
                    :columns="columns"
                    :data="list"
            >
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
                                        v-if="row.member_source === '10'"
                                ></span>
                                <span
                                        class="iconfont icon-weixin"
                                        v-else-if="row.member_source === '20'"
                                ></span>
                                <span
                                        class="iconfont icon-weixinxiaochengxu"
                                        v-else-if="row.member_source === '21'"
                                ></span>
                                <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2" v-else-if="row.member_source === '30'"></kdx-svg-icon>
                                <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban" v-else-if="row.member_source === '32'"></kdx-svg-icon>
                                <kdx-svg-icon class="iconfont" type="icon-douyin" v-else-if="row.member_source === '31'"></kdx-svg-icon>
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
                created_at: ['', ''], //发放时间
                updated_at: ['', ''], //触发时间
                // 搜索信息
                searchData: {
                    create_startTime: '',
                    create_endTime: '',
                    update_startTime: '',
                    update_endTime: '',
                    level_id: 'all', // 会员等级
                    keywords: '',
                    export: '',
                    status: 'all', //领取状态
                },
                levels: [], // 用户等级
                loading: false,
                receive: [
                    {
                        label: '全部',
                        value: 'all'
                    },
                    {
                        label: '待领取',
                        value: '0'
                    },
                    {
                        label: '已领取',
                        value: '1'
                    },
                    {
                        label: '已失效',
                        value: '2'
                    }
                ], //领取状态
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
                                            {params.row.is_default == '1' ? (
                                                ''
                                            ) : (
                                                <kdx-svg-icon
                                                    type="icon-huiyuan-bg"
                                                    className="icon"
                                                ></kdx-svg-icon>
                                            )}
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
                        title: '红包金额',
                        key: 'money',
                        minWidth: 120,
                        render: (h, params) => {
                            if (parseFloat(params.row.money) > 0) {
                                return (
                                    <div>￥{params.row.money}</div>
                                )
                            }
                        },
                    },
                    {
                        title: '发放时间',
                        key: 'created_at',
                        minWidth: 100,
                        maxWidth: 180
                    },
                    {
                        title: '领取方式',
                        key: 'scene_text',
                        minWidth: 120,
                    },
                    {
                        title: '领取状态',
                        key: 'status_text',
                        minWidth: 120,
                    },
                    {
                        title: '领取时间',
                        key: 'updated_at',
                        minWidth: 100,
                        maxWidth: 180,
                        render: (h, params) => {
                            // 已领取
                            if(params.row.status === '1') {
                                return (
                                    <div>{ params.row.updated_at }</div>
                                )
                            }else if(params.row.status === '0'){
                                // 未领取
                                return (
                                    <div>-</div>
                                )
                            }else {
                                // 已失效
                                return (
                                    <div>{ params.row.updated_at }</div>
                                )
                            }
                        },
                    },
                ],
            }
        },
        watch: {
        },
        created() {
            let member_id = this.$route.query.member_id || ''
            this.getReditRecordLabel()
            this.getRedpacketList(member_id)
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
            // 红包列表
            getRedpacketList(member_id = '') {
                this.returnToTop();
                let _params = {
                    level_id:
                        this.searchData.level_id === 'all'
                            ? ''
                            : this.searchData.level_id,
                    keywords: this.searchData.keywords,
                    status: this.searchData.status,
                    export: this.searchData.export,
                    page: this.page,
                    pagesize: this.pagesize,
                    member_id,
                }
                if(this.searchData.status == 'all') {
                    delete _params.status
                }
                if (this.searchData.create_startTime) {
                    _params['created_at[0]'] = this.searchData.create_startTime
                }
                if (this.searchData.create_endTime) {
                    _params['created_at[1]'] = this.searchData.create_endTime
                }
                if (this.searchData.update_startTime) {
                    _params['updated_at[0]'] = this.searchData.update_startTime
                }
                if (this.searchData.update_endTime) {
                    _params['updated_at[1]'] = this.searchData.update_endTime
                }
                this.loading = true
                this.$api.financeApi.getRedpacketList(_params).then((res) => {
                    this.loading = false
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
                this.getRedpacketList()
            },
            // 点击重置按钮
            handleReset() {
                this.created_at = ['', '']
                this.updated_at = ['', '']
                this.searchData.create_startTime = ''
                this.searchData.create_endTime = ''
                this.searchData.update_startTime = ''
                this.searchData.update_endTime = ''
                this.searchData.level_id = 'all'
                this.searchData.status = 'all'
                this.searchData.keywords = ''
                this.searchData.export = ''
                this.page = 1
                this.pagesize = 10
                this.$refs['page'].reset()
                this.getRedpacketList()
            },
            // 点击导出按钮
            handleExport() {
                // TODO wyn alone_beta
                let level_id =
                    this.searchData.level_id === 'all'
                        ? ''
                        : this.searchData.level_id
                let keywords = this.searchData.keywords
                let page = this.page
                let pagesize = this.pagesize
                let params = {
                    level_id,
                    keywords,
                    export: 1,
                    page,
                    pagesize,
                }
                this.searchData.status == 'all' ? '' :  params.status = this.searchData.status
                if (this.searchData.create_startTime) {
                    params.crete_time[0] = this.searchData.create_startTime;
                }
                if (this.searchData.create_endTime) {
                    params.crete_time[1] = this.searchData.create_endTime;
                }
                if (this.searchData.update_startTime) {
                    params.updated_at[0] = this.searchData.update_startTime;
                }
                if (this.searchData.update_endTime) {
                    params.updated_at[1] = this.searchData.update_endTime;
                }

                Export('manage/finance/red-package/list', params);
            },
            // 切换页码
            changePage(page) {
                this.page = page.pageNumber
                this.pagesize = page.pageSize
                this.getRedpacketList()
            },
            // 跳转会员详情
            jumpVip(id) {
                this.$utils.openNewWindowPage('/member/detail', { id: id })
            },
            change_created_at(e){
                if(e[0]){
                    this.searchData.create_startTime =  formatDate(new Date(e[0]), 'yyyy-MM-dd hh:mm:ss');
                    this.searchData.create_endTime = formatDate(new Date(e[1]), 'yyyy-MM-dd hh:mm:ss');
                    this.created_at = e;
                }
            },
            change_updated_at(e){
                if(e[0]){
                    this.searchData.update_startTime = formatDate(new Date(e[0]), 'yyyy-MM-dd hh:mm:ss');
                    this.searchData.update_endTime = formatDate(new Date(e[1]), 'yyyy-MM-dd hh:mm:ss');
                    this.updated_at = e;
                }
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
        background: #fff;
        padding: 0 20px;
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
            // 余额变化
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
