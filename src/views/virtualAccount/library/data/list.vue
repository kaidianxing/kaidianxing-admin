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
    <div class="virtual-account-list">
        <kdx-header-bar>
            <Form ref="form" :model="search" :label-width="100" inline @submit.native.prevent>
                <FormItem label="字段(Key)：">
                    <Input type="text" v-model="search.keyword" placeholder="请输入" class="width-340" @on-enter="handleSearch"/>
                </FormItem>
                <FormItem label="导入时间：">
                    <DatePicker v-model="time" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="活动时间" @on-change="changeDate" class="width-340"></DatePicker>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                    <Button type="text" @click="handleExport">导出</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="tab-content">
            <Tabs v-model="checkType" :animated="false" @on-click="changeType">
                <TabPane label="未出售" name="notSale">
                    <data-table ref="table_list" type="notSale" :tableHeader="tableHeader" :list="data" :current='page.pageNumber'
                                :pageSize='page.pageSize' :total="total" :virtual_account_id="virtual_account_id"
                                @on-page-change="changePage"
                                @on-refresh="refreshTable" @getList="getList"></data-table>
                </TabPane>
                <TabPane label="已出售" name="sale">
                    <data-table ref="table_list" type="sale" :tableHeader="tableHeader" :list="data" :current='page.pageNumber'
                                :pageSize='page.pageSize' :total="total"
                                @on-page-change="changePage"
                                @on-refresh="refreshTable" @getList="getList"></data-table>
                </TabPane>
            </Tabs>
        </div>
        <slot></slot>
    </div>
</template>

<script>

    import DataTable from "../components/DataTable";
    import { Export } from '@/helpers/export';

    export default {
        name: "list",
        components: {
            DataTable
        },
        props: {},
        data() {
            return {
                loading: false,
                total: 1,
                page: {
                    pageSize: 10,
                    pageNumber: 1,
                },

                status: '0',
                checkType: 'notSale',
                virtual_account_id: '', // id
                time: [],
                search: {
                    keyword: '',
                    start_time: '',
                    end_time: '',
                },

                tableHeader: [], // 表头

                data: [],
                columns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '权重值',
                        key: 'sort',
                    },
                    /*{
                        title: '总库存',
                        key: 'total_count',
                    },
                    {
                        title: '剩余库存',
                        key: 'remaining_count',
                    },*/
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            return (
                                <div class={params.row.status === '0'?'danger-color':'success-color'}>{params.row.status === '0'?'未出售':'已出售'}</div>
                            )
                        }
                    },
                    {
                        title: '导入时间',
                        key: 'created_at',
                    },
                    {
                        title: '订单编号',
                        key: 'order_no',
                    },
                    {
                        title: '下单时间',
                        key: 'order_created_at',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        slot: 'action'
                    }
                ]
            }
        },
        computed: {},
        created() {
            if (this.$route.query?.id) {
                this.virtual_account_id = this.$route.query?.id;
                this.getKey();
                this.getList()
            }
        },
        mounted() {},
        methods: {
            getKey() {
                // 获取表头
                this.$api.virtualAccountApi.getVirKey({virtual_account_id:this.virtual_account_id}).then((res) => {
                    if (res.error === 0) {
                        this.tableHeader = res.data.config.map(item=>item.key);
                    }
                })
            },
            changeType(type) {
                if(type === 'sale'){this.status = '1'}
                if(type === 'notSale'){this.status = '0'}
                this.getList()
            },
            getList() {
                this.loading = true;
                let params = {
                    ...this.search,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                    virtual_account_id: this.virtual_account_id,
                    status: this.status
                };
                this.$api.virtualAccountApi.getVirKeyData(params).then((res) => {
                    this.loading = false;
                    if (res.error === 0) {
                        res.list = res.list.map(item => {
                            let {data, ...other} = item;
                            return {
                                ...other,
                                ...JSON.parse(data)
                            }
                        });
                        this.data = res.list;
                        this.total = res.total
                    }
                })
            },
            changeDate(date) {
                this.search.start_time = date[0];
                this.search.end_time = date[1]
            },
            handleSearch() {
                this.refreshTable()
            },
            handleReset() {
                this.search = {
                    keyword: '',
                    start_time: '',
                    end_time: '',
                };
                this.time = [];
                this.refreshTable()
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1,
                };
                this.$refs['table_list'].reset(this.page);
                this.getList()
            },
            handleExport() {
                let params = Object.assign({export: '1', virtual_account_id: this.virtual_account_id}, this.search);
                Export('manage/virtualAccount/virtual-account-data/index', params);
            },
            handleEdit(id) {
                this.$router.push({
                    path: '/virtualAccount/library/edit',
                    query: {id}
                })
            },
            handleDelete(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否删除该卡密库',
                    onOk: () => {
                        this.$api.virtualAccountApi.virtualAccountDelete({id}).then((res) => {
                            if (res.error === 0) {
                                this.$Message.success('删除成功');
                                this.getList()
                            }
                        })
                    }
                })
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            // 选中项发生变化
            selectChange(selection) {
                console.log(selection,'>>>');
            },
            // 表格下方全选按钮
            checkboxChange(status) {
                console.log(status);
            },


        },
    }
</script>

<style lang="scss" scoped>
    .virtual-account-list {
        margin: 20px auto;
        background-color: $background-color;
        .table-list {
            background-color: #ffffff;
            padding: 0 20px;
            margin-top: 10px;
            border-radius: 2px;
            position: relative;
        }
        .tab-content {
            background-color: #ffffff;
            border-radius: 2px;

            /deep/ .ivu-tabs {
                overflow: visible;

                .ivu-tabs-bar {
                    margin-bottom: 0;
                }

                .ivu-tabs-nav-scroll {
                    padding: 0 20px;

                    .ivu-tabs-tab {
                        width: 72px;
                        text-align: center;
                    }

                    .ivu-tabs-ink-bar {
                        height: 2px;
                        box-sizing: content-box;
                    }
                }
            }
        }
    }
</style>