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
    <div class="table-list" v-loading="loading">
        <Table ref="table" :columns="handleColumn" :data="list"  @on-selection-change="selectChange">
            <template slot-scope="{ row }" slot="action">
                <div>
                    <Button class="marginR-10" type="text" :disabled="noDataManagePerm" @click="handleEdit(row)">编辑</Button>
                    <Button type="text" :disabled="noDataManagePerm" @click="handleDelete('0', row.id)">删除</Button>
                </div>
            </template>
        </Table>
        <div class="footer-action" v-if="list.length > 0 && type === 'notSale'">
            <Checkbox v-model="isSelectAll" @on-change="checkboxChange"></Checkbox>
            <Button :disabled="selectDisabled || noDataManagePerm" @click="handleDelete('1')">删除</Button>
            <Button :disabled="selectDisabled || noDataManagePerm" @click="updateSort">修改权重值</Button>
        </div>
        <div class="footer-page">
            <kdx-page-component ref="page" :current='current' :pageSize='pageSize' :total="total" @on-change="changePage"></kdx-page-component>
        </div>

        <!-- 修改卡密弹窗 -->
        <UpdateKeyData v-model="updateKeyDataModel" :editData="editData" @getList="getList"></UpdateKeyData>
        <!-- 修改权重值 -->
        <UpdateSort v-model="updateSortModel" @changeSort="bathChangeSort"></UpdateSort>

    </div>
</template>

<script>
    import UpdateKeyData from "./UpdateKeyData";
    import UpdateSort from "./UpdateSort";
    export default {
        name: "DataTable",
        components: {
            UpdateKeyData,
            UpdateSort
        },
        props: {
            type: {
                type: String,
                default: 'notSale'
            },
            virtual_account_id: {
                type: String,
                default: ''
            },
            tableHeader: {
                type: Array,
                default: () => []
            },
            list: {
                type: Array,
                default: () => []
            },
            // 每页多少条
            pageSize: {
                type: Number,
                default: 10
            },
            // 当前页码
            current:{
                type: Number,
                default: 1
            },
            total: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                loading: false,
                isSelectAll: false,
                selectRows: [], // 选中项
                sortID: '', // 修改项
                updateKeyDataModel: false,
                updateSortModel: false,
                editData: {},

                columns: [
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            return (
                                <div class={params.row.status === '1'?'success-color':'danger-color'}>{params.row.status === '0'?'未出售': params.row.status === '1'?'已出售':'待支付'}</div>
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
                        render: (h, params) => {
                            return (
                                <div class="rr-brand-color pointer" onClick={() => {this.checkDetail(params.row.order_id, params.row.order_status)}}>{params.row.order_no}</div>
                            )
                        }
                    },
                    {
                        title: '下单时间',
                        key: 'order_created_at',
                    }
                ]
            }
        },
        computed: {
            noDataManagePerm(){//无管理权限
                return !this.$getPermMap('virtualAccountData.index.manage')
            },
            // 下方按钮是否可操作
            selectDisabled() {
                return this.selectRows.length === 0;
            },
            handleColumn() {
                let result = this.tableHeader.map(item=> {
                    return {
                        title: '',
                        key: 'value',
                        slot: 'key',
                        renderHeader: ()=>{
                            return (
                                <div>{item}</div>
                            )
                        },
                        render: (h, params) => {
                            return (
                                <div>{params.row[`value${this.type==='sale'? params.column._index+1: params.column._index-1}`] || '-'}</div>
                            )
                        }
                    }
                });
                let columns = [...this.columns];
                if (this.type === 'sale') {
                    // 已出售
                    columns.splice(0, 0, ...result);
                } else if (this.type === 'notSale') {
                    // 未出售
                    let sort = [
                        {
                            type: 'selection',
                            width: 40,
                            align: 'center'
                        },
                        {
                            title: '权重值',
                            key: 'sort',
                            render: (h, params) => {
                                return (
                                    <div>
                                        <div class="sort flex" style={{display: this.sortID !== params.row.id ? 'block' : 'none'}}>
                                            <span>{params.row.sort}</span>
                                            <span class="iconfont icon-shangpinliebiao-bianji icon" onClick={() => {this.changeSort(params.row.id)}}></span>
                                        </div>
                                        <kdx-rr-input ref="update_sort" id={`update_sort${params.row.id}`} class="width-70"
                                                  style={{display: this.sortID === params.row.id ? 'block' : 'none'}} type="text"
                                                  v-model={this.list[params.index].sort} number fixed={0} autofocus={true}
                                                  placeholder="请输入"
                                                  onOn-blur={(e) => {this.endUpdateSort(e,params.row)}}>
                                        </kdx-rr-input>
                                    </div>
                                )
                            }
                        },
                    ];
                    let action = {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        slot: 'action'
                    };
                    columns.splice(0,0, ...sort)
                    columns.splice(2, 0, ...result);
                    columns.push(action)
                }
                return columns
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            getList() {
                this.$emit('getList')
            },
            changeSort(id) {
                this.sortID = id;
                this.$nextTick(() => {
                    document.getElementById(`update_sort${id}`).getElementsByTagName('input')[0].focus()
                })
            },
            endUpdateSort(e, data) {
                this.sortID = -1;
                this.updateData({id: data.id, sort: data.sort}, '修改成功')
            },
            updateData(params, tip) {
                this.$api.virtualAccountApi.changeVirtualSort(params).then(res => {
                    if (res.error === 0) {
                        this.$Message.success(tip);
                        this.selectRows = [];
                        this.isSelectAll = false;
                        this.getList()
                    }
                });
            },
            bathChangeSort(sort) {
                let params = {
                    id: this.selectRows.map(item => item.id),
                    sort
                };
                this.updateData(params, '修改成功')
            },
            updateSort() {
                // 修改权重值
                if (this.selectRows.length) {
                    this.updateSortModel = true
                }
            },
            handleEdit(row) {
                let obj = {};
                for (let key in row) {
                    if (key.indexOf('value') !== -1) {
                        obj[key] = row[key]
                    }
                }
                this.editData = {
                    id: row.id,
                    virtual_account_id: this.virtual_account_id,
                    tableHeader: this.tableHeader,
                    obj
                };
                this.updateKeyDataModel = true
            },
            handleDelete(is_batch, id) {
                // 批量删除
                if (is_batch === '1') {
                    id = this.selectRows.map(item => item.id)
                }
                this.$Modal.confirm({
                    title: '提示',
                    content: '您确认删除卡密数据',
                    onOk: () => {
                        this.updateData({id, is_delete: 1}, '删除成功')
                    }
                });
            },

            changePage(page) {
                this.$emit('on-page-change', page);
            },
            handleRefresh() {
                // 页面刷新
                this.$emit('on-refresh');
                this.reset();
            },
            // 重置页码
            reset(page) {
                this.$refs['page'].reset(page);
            },
            // 选中项发生变化
            selectChange(selection) {
                this.selectRows = selection;
                this.isSelectAll = this.selectRows.length === this.list.length;
            },
            // 表格下方全选按钮
            checkboxChange(status) {
                this.$refs['table'].selectAll(status);
                this.list.forEach((item, index) => {
                    this.$set(this.list[index], '_checked', status);
                });
                if (status) {
                    this.selectRows = this.data;
                } else {
                    this.selectRows = [];
                }
            },
            // 查看详情
            checkDetail(id, status) {
                let path = ''
                if (status == '10' || status == '11') {
                    path = '/order/detail/send'
                } else if (status == '0') {
                    path = '/order/detail/payment'
                } else if (status == '20') {
                    path = '/order/detail/receive'
                } else if (status == '30') {
                    path = '/order/detail/achieve'
                } else if (status == '-1') {
                    path = '/order/detail/close'
                }
                this.$utils.openNewWindowPage(path, { id })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .table-list {
        /deep/ .sort {
            cursor: pointer;
            .icon {
                display: none;
                cursor: pointer;
                font-size: 24px;
                vertical-align: middle;
            }
            &:hover {
                >.icon {
                    display: inline-block;
                }
            }
        }
    }
</style>