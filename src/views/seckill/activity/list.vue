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
    <div class="activity-wrap">
        <search-header
            ref="search_header"
            :activity_status="activity_status"
            @on-search="handleSearch"
        ></search-header>
        <div class="table-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data">
                <template slot-scope="{ row }" slot="date">
                    <div class="time">起：{{ getTime(row.start_time) }}</div>
                    <div class="time">止：{{ getTime(row.end_time) }}</div>
                </template>
                <template slot-scope="{ row }" slot="status">
                    <kdx-status-text type="success" v-if="row.status === '1'"
                        >进行中</kdx-status-text>
                    <kdx-status-text type="danger" v-if="row.status === '-1'"
                        >已停止</kdx-status-text>
                    <kdx-status-text type="danger" v-if="row.status === '-2'">手动停止</kdx-status-text>
                    <kdx-status-text type="warning" v-if="row.status === '0'">未开始</kdx-status-text>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <div class="btn-box">
                        <Button
                            type="text"
                            :disabled="
                                    row.status == -1 ||
                                    row.status == -2 || 
                                    row.status == 0 ||
                                    noManagePerm
                            "
                            @click="handleStop(row.id)"
                            >停止</Button
                        >
                        <Button type="text" @click="handleView(row.id)"
                            >查看</Button
                        >
                        <Button type="text" v-if="row.status=='1'||row.status=='0' || noManagePerm" @click="handleEdit(row.id)">编辑</Button>
                        <Button
                            type="text"
                            v-if="row.status !== '0'"
                            @click="handleActivityData(row.id)"
                            >数据</Button
                        >
                        <Button
                            type="text"
                            :disabled="row.status == 1 || noManagePerm"
                            @click="handleDelete(row.id)"
                            >删除</Button
                        >
                    </div>
                </template>
            </Table>
            <div class="footer-page" v-show="data.length > 0">
                <kdx-page-component
                    ref="page"
                    :total="total"
                    @on-change="changePage"
                ></kdx-page-component>
            </div>
        </div>
        <table-list
            :id="currentId"
            :value="showModal"
            @on-close="closeModal"
        ></table-list>
        <slot></slot>
    </div>
</template>

<script>
import SearchHeader from "./components/list/SearchHeader.vue";
import TableList from "./components/list/DataList.vue";
export default {
    name: "list",
    components: {
        SearchHeader,
        TableList,
    },
    props: {},
    data() {
        return {
            loading: false,
            showModal: false,
            page: {
                pageSize: 10,
                pageNumber: 1,
            },
            activity_status: 1,
            search: {
                keyword: "",
                status: "",
                start_time: "",
                end_time: "",
                goods_title: ''
            },
            data: [
               
            ],
            total: 0,
            columns: [
                {
                    title: "活动名称",
                    key: "title",
                },
                {
                    title: "活动时间",
                    slot: "date",
                },
                {
                    title: "停止时间",
                    key: 'stop_time',
                    render:(h,params)=> {
                        return <div>{this.getTime(params.row.stop_time)}</div>
                    },
                },
                {
                    title: "活动状态",
                    slot: "status",
                    width: 160,
                },
                {
                    title: "操作",
                    slot: "action",
                },
            ],
            currentId: "",
        };
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("seckill.manage");
        },
    },
    created() {
        this.getList();
    },
    mounted() {},
    methods: {
        getSeckillStatus() {
          this.$api.seckillApi.getSeckillStatus({}).then((res)=>{
              if (res.error ===0) {
                  this.activity_status = +res?.data.activity_status || 0
              }
          })
        },
        changeSwitch(data) {
            this.$api.seckillApi.changeSeckillStatus({activity_status: data}).then((res) => {
                if (res.error === 0) {
                    this.$Message.success('修改成功')
                    this.getList()
                    this.getSeckillStatus()
                }
            })
        },
        handleChange(data) {
            if(!data) {
                this.$Modal.confirm({
                    title: "提示",
                    content: "关闭后，活动将停止",
                    onOk: () => {
                        this.changeSwitch(data)
                    },
                    onCancel: () => {
                        this.activity_status = data===0?1:0
                    },
                });
            } else {
                this.changeSwitch(data)
            }
        },
        // 获取活动列表
        getList() {
            this.loading = true;
            let params = {
                ...this.search,
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
            };
            this.$api.seckillApi.getSeckillActivities(params).then((res) => {
                this.loading = false;
                if (res.error === 0) {
                    this.data = res.list;
                    this.total = res.total
                }
            })
        },
        // 搜索
        handleSearch(value) {
            this.search = { ...this.search, ...value };
            this.refreshTable();
        },
        // 切换页码
        changePage(page) {
            this.page = page;
            this.getList();
        },
        // 查看
        handleView(id) {
            this.$router.push({
                path: "/seckill/activity/index",
                query: {
                    id,
                    type: "view",
                },
            });
        },
        // 编辑
        handleEdit(id) {
            this.$router.push({
                path: "/seckill/activity/index",
                query: {
                    id,
                    type: "edit",
                },
            });
        },
        // 停止
        handleStop(id) {
            this.$Modal.confirm({
                title: "提示",
                content: "活动停止后将无法恢复，确认停止？",
                onOk: () => {
                    this.stopSeckillActivity(id);
                },
                onCancel: () => {},
            });
        },
        // 停止活动
        stopSeckillActivity(id) {
            this.$api.seckillApi.stopSeckillActivity({ id }).then((res) => {
                if (res.error === 0) {
                    this.refreshTable();
                    this.$Message.success("操作成功");
                }
            });
        },
        // 删除
        handleDelete(id) {
            this.$Modal.confirm({
                title: "提示",
                content: "确定要删除该活动？",
                onOk: () => {
                    this.delSeckillActivity(id);
                },
                onCancel: () => {},
            });
        },
        // 删除活动
        delSeckillActivity(id) {
            this.$api.seckillApi.delSeckillActivity({ id }).then((res) => {
                if (res.error === 0) {
                    this.refreshTable();
                    this.$Message.success("删除成功");
                }
            });
        },
        // 数据
        handleActivityData(id) {
            this.currentId = id;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
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
                return '-'
            } else {
                return time
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.activity-wrap {
    background-color: $background-color;
    margin: 20px auto 0;

    .comp-delivery-type {
        background-color: #fff;
        border-radius: 2px;
        padding: 20px;
        margin-bottom: 10px;
        .name {
            font-weight: bold;
            color: #262b30;
            font-size: 18px;
            line-height: 25px;
        }
        .tips {
            font-size: 12px;
            line-height: 16px;
            color: #939799;
            margin-top: 8px;
            span {
                color: $brand-color;
                font-weight: bold;
                cursor: pointer;
            }
        }
        .right {
            display: flex;
            align-items: center;
            .text {
                margin-left: 6px;
                font-weight: bold;
                font-size: 14px;
                line-height: 20px;
                color: #939799;
                &.active {
                    color: $brand-color;
                }
            }
        }
    }

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
    }
    .btn-box {
        button {
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>
