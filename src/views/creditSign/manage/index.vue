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
    <div class="spell-group-list">
        <search-header ref="search_header" @on-search="handleSearch"></search-header>
        <div class="table-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data">
                <template #date="{row}">
                    <div class="time">起：{{ getTime(row.start_time) }}</div>
                    <div class="time">止：{{ getTime(row.end_time) }}</div>
                </template>
                <template #status="{row}">
                    <kdx-status-text type="success" v-if="row.status == 1">进行中</kdx-status-text>
                    <kdx-status-text type="danger" v-if="row.status == -1">已停止</kdx-status-text>
                    <kdx-status-text type="danger" v-if="row.status == -2">手动停止</kdx-status-text>
                    <kdx-status-text type="danger" v-if="row.status == -3">已失效</kdx-status-text>
                    <kdx-status-text type="warning" v-if="row.status == 0">未开始</kdx-status-text>
                </template>
                <template #rewards="{row}">
                    <!--                    <div v-if="row.coupon_num">积分：{{row.coupon_num}}个</div>-->
                    <!--                    <div v-if="row.point_sum">优惠券：{{row.point_sum}}张</div>-->
                    <!--                    <div v-else>-</div>-->
                    <div v-if="row.status != '0'">积分：{{row.credit_num > 0 ? `${row.credit_num}个` : '-'}}</div>
                    <div v-if="row.status != '0'">优惠券：{{row.coupon_num > 0 ? `${row.coupon_num}张` : '-'}}</div>
                    <div v-else>-</div>
                    <div></div>
                </template>
                <!--                <template #action="{row}">-->
                <!--                    <div class="btn-box">-->
                <!--                        <Button type="text" :disabled="noManagePerm" @click="handleView(row.id, 'copy')">复制</Button>-->
                <!--                        <Button type="text" :disabled="row.status != '1'||noManagePerm" @click="handleStop(row.id)">停止</Button>-->
                <!--                        <Button type="text" :disabled="row.status != '1' && row.status != '0' ||noManagePerm" @click="handleEdit(row.id, 'edit')">编辑</Button>-->
                <!--                        <Button type="text" @click="handleView(row.id, 'view')">查看</Button>-->
                <!--                        <Button type="text" :disabled="noManagePerm" @click="handleDelete(row)">删除</Button>-->
                <!--                    </div>-->
                <!--                </template>-->
            </Table>
            <div class="footer-page" v-show="data.length > 0">
                <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
            </div>
        </div>
    </div>
</template>

<script>
import SearchHeader from './components/SearchHeader'
// import TableList from "./components/TableList";

export default {
    name: "index",
    components: {
        SearchHeader,
        // TableList
    },
    data() {
        return {
            loading: false,
            data: [],
            total: 0,
            columns: [
                {
                    title: "活动名称",
                    key: "activity_name",
                    minWidth: 160
                },
                {
                    title: "活动时间",
                    slot: "date",
                    minWidth: 200
                },
                {
                    title: "停止时间",
                    key: 'stop_time',
                    minWidth: 170,
                    render: (h, params) => {
                        return <div>{this.getStopTime(params.row)}</div>;
                    },
                },
                {
                    title: "累计签到人数",
                    key: 'sign_person_count',
                    minWidth: 120,
                    render: (h, params) => {
                        return <div>{this.signTotalNum(params.row.sign_person_count)}</div>;
                    },
                },
                {
                    title: "总签到次数",
                    key: 'sign_count',
                    minWidth: 100,
                    render: (h, params) => {
                        return <div>{this.signTotalNum(params.row.sign_count)}</div>;
                    },
                },
                {
                    title: "奖励领取情况",
                    slot: 'rewards',
                    minWidth: 140
                    // render: (h, params) => {
                    //     return <div>{this.getRewards(params.row)}</div>;
                    // },
                },
                {
                    title: "活动状态",
                    slot: "status",
                    minWidth: 90,
                },
                {
                    title: "操作",
                    key: 'action',
                    minWidth: 140,
                    render: (h, params) => {
                        return (
                            <div class="action">
                                <Button type="text" onClick={() => {
                                    this.handleView(params.row.id, 'view')
                                }}>查看</Button>
                                <Button type="text"
                                        disabled={params.row.status != '1' && params.row.status != '0' || this.noManagePerm}
                                        onClick={() => {
                                            this.handleEdit(params.row.id, 'edit')
                                        }}>编辑</Button>
                                <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                    this.handleView(params.row.id, 'copy')
                                }}>复制</Button>
                                <Button type="text" disabled={params.row.status != '1' || this.noManagePerm}
                                        onClick={() => {
                                            this.handleStop(params.row.id)
                                        }}>停止</Button>
                                <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                    this.handleDelete(params.row)
                                }}>删除</Button>
                            </div>
                        )
                    }
                },
            ],
            page: {
                pageSize: 10,
                pageNumber: 1
            },
            search: {},
        }
    },
    computed: {
        noManagePerm(){//管理权
            return !this.$getPermMap('creditSign.list.manage')
        },
    },
    created() {
        this.getList();
    },
    methods: {

        // 获取活动列表
        getList() {
            this.loading = true;
            let params = {
                ...this.search,
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
            };
            this.$api.creditSignApi.creditSignList(params).then((res) => {
                this.loading = false;
                if (res.error === 0) {
                    this.data = res.list;
                    this.total = res.total;
                }
            });
        },
        // 搜索
        handleSearch(value) {
            this.search = {...this.search, ...value};
            this.refreshTable();
        },
        // 切换页码
        changePage(page) {
            this.page = page;
            this.getList();
        },
        // 查看
        handleView(id, type) {
            this.$router.push({
                path: "/creditSign/manage/add",
                query: {
                    id,
                    type
                },
            });
        },
        // 编辑
        handleEdit(id, type){
            this.$router.push(
                {
                    path: '/creditSign/manage/add',
                    query: { id:id, type:type}
                }
            )
            // this.$api.performanceAwardApi.stopActivity({id}).then((res) => {
            //     if (res.error === 0) {
            //         this.refreshTable();
            //         this.$Message.success("操作成功");
            //         console.log(type)
            //     }
            // });
        },
        // 停止
        handleStop(id) {
            this.$Modal.confirm({
                title: "提示",
                content: "确认要停该活动吗？停止后不可重新开启",
                onOk: () => {
                    this.stopActivity(id);
                },
                onCancel: () => {
                },
            });
        },
        // 停止活动
        stopActivity(id) {
            this.$api.creditSignApi.stopActivity({id}).then((res) => {
                if (res.error === 0) {
                    this.refreshTable();
                    this.$Message.success("操作成功");
                }
            });
        },
        // 停止
        // handleInvalid(id) {
        //     this.$Modal.confirm({
        //         title: "提示",
        //         content: "确定要将该活动变更为失效？活动将停止并失效，活动期间内已经达成的奖励不支持发放",
        //         onOk: () => {
        //             this.InvalidActivity(id);
        //         },
        //         onCancel: () => {
        //         },
        //     });
        // },
        // // 停止活动
        // InvalidActivity(id) {
        //     this.$api.performanceAwardApi.invalidActivity({id}).then((res) => {
        //         if (res.error === 0) {
        //             this.refreshTable();
        //             this.$Message.success("操作成功");
        //         }
        //     });
        // },
        //
        // 删除
        handleDelete(row) {
            this.$Modal.confirm({
                title: "确认删除",
                content: '确定要删除该活动？',
                onOk: () => {
                    this.deleteActivity(row.id);
                },
                onCancel: () => {
                },
            });
        },
        // 删除活动
        deleteActivity(id) {
            this.$api.creditSignApi.deleteActivity({id}).then((res) => {
                if (res.error === 0) {
                    this.refreshTable();
                    this.$Message.success("删除成功");
                }
            });
        },
        // 数据
        handleActivityData(title) {
            this.$router.push({
                path: "/performanceAward/award/index",
                query: {
                    title
                },
            });
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
            };
            this.$refs["page"].reset();
            this.getList();
        },
        getTime(time) {
            if (time === '0000-00-00 00:00:00') {
                return '-';
            } else {
                return time;
            }
        },
        getStopTime(row) {
            if (row.status == 0 || row.status == 1) {
                return '-';
            } else {
                if (row.stop_time === '0000-00-00 00:00:00') {
                    return '-';
                } else {
                    return row.stop_time;
                }
            }
        },
        signTotalNum(row) {
            if (!row) {
                return '-';
            } else {
                return row
            }
        },
        // getRewards(row) {
        // console.log(row)
        // if (!row.coupon_num && !row.point_sum) {
        //     return '-';
        // } else {
        //     return `<div v-if="row.coupon_num != ''">积分：{{row.point_sum}}</div><div v-if="row.coupon_num != ''">优惠券：{{row.coupon_num}}</div>`
        // }
        // }
    },
}
</script>

<style lang="scss" scoped>
.spell-group-list {
    background-color: $background-color;
    margin: 20px auto;

    .table-list {
        background-color: #ffffff;
        padding: 0 20px;
        border-radius: 2px;
        position: relative;

        .time {
            display: flex;
        }

        .content-box {
            display: flex;
            align-items: center;

            .content-text {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
                height: 60px;

                .mark {
                    @include font-12-16;
                    color: #ed4014;
                    background-color: #ffefe6;
                    border-radius: 2px;
                    margin-right: 4px;
                    width: 18px;
                    height: 18px;
                    display: inline-block;
                    text-align: center;
                    line-height: 18px;

                    &:nth-last-child(2) {
                        margin-right: 6px;
                    }

                    &.real {
                        background-color: #f0faff;
                        color: #2d8cf0;
                    }

                    &.virtual {
                        background-color: #e6fff9;
                        color: #00c5c5;
                    }
                }

                .text {
                    @include font-14-20;
                }
            }

            .image {
                width: 60px;
                height: 60px;
                margin-right: 10px;
                flex-shrink: 0;
                border: 1px solid $border-color;
                border-radius: 2px;
                overflow: hidden;

                > img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        /deep/.ivu-table {
            td{
                .action {
                    margin-right: -8px;
                    .ivu-btn-text {
                        margin-right: 8px;
                    }
                }
            }
        }
    }
}
</style>