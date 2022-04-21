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
            @on-search="handleSearch"
        ></search-header>
        <div class="table-list" v-loading="loading">
            <Table
                ref="table"
                :columns="columns"
                :data="data"
                @on-selection-change="handleSelectionChange"
            >
                <template slot-scope="{ row }" slot="name">
                    <div class="flex align-center">
                        <div class="text">{{ row.name }}</div>
                        <kdx-tag-label type="info" v-if="row.is_default === '1'">
                            默认
                        </kdx-tag-label>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="type">
                    <kdx-tag-label :type="row.type === '0' ? 'warning' : 'info'">
                        {{ row.type === '0' ? '快递鸟' : '菜鸟' }}
                    </kdx-tag-label>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <div class="btn-box">
                        <Button
                            type="text"
                            :disabled="noManagePerm"
                            @click="handleDefault(row)"
                            v-if="row.is_default === '0'"
                        >
                            设置默认
                        </Button>
                        <Button
                            type="text"
                            :disabled="noManagePerm"
                            @click="handleDefault(row)"
                            v-if="row.is_default === '1'"
                        >
                            取消默认
                        </Button>
                        <Button
                            type="text"
                            :disabled="noManagePerm"
                            @click="handleEdit(row.id)"
                        >
                            编辑
                        </Button>
                        <Button
                            type="text"
                            :disabled="noManagePerm"
                            @click="handleDelete(row)"
                        >
                            删除
                        </Button>
                    </div>
                </template>
            </Table>
            <div class="footer-action" v-if="data.length > 0">
                <Checkbox
                    :value="isSelectAll"
                    @on-change="handleCheckboxChange"
                ></Checkbox>
                <Button
                    :disabled="selectDisabled || noManagePerm"
                    @click="handleBatchDelete"
                >
                    批量删除
                </Button>
            </div>
            <div class="footer-page" v-show="data.length > 0">
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
import SearchHeader from './components/SearchHeader'
let deleteDefault = false
export default {
    components: {
        SearchHeader,
    },
    data() {
        return {
            loading: false,
            page: {
                pageSize: 10,
                pageNumber: 1,
            },
            search: {
                name: '',
                express_company: '',
                type: '',
            },
            columns: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center',
                },
                {
                    title: '模板名称',
                    slot: 'name',
                },
                {
                    title: '模板类型',
                    slot: 'type',
                },
                {
                    title: '快递公司',
                    key: 'express_company_text',
                },
                {
                    title: '操作',
                    slot: 'action',
                },
            ],
            data: [],
            selectRows: [], // 选中项
            total: 0,
        }
    },
    computed: {
        isSelectAll() {
            return this.selectRows.length === this.data.length
        },
        // 下方按钮是否可操作
        selectDisabled() {
            return this.selectRows.length === 0
        },
        noManagePerm() {
            // 管理权限
            return !this.$getPermMap('expressHelper.express_template.manage')
        },
    },
    created() {
        this.getExpressTempList()
    },
    methods: {
        // 获取模板列表
        getExpressTempList() {
            this.loading = true
            let params = {
                ...this.search,
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
            }
            this.$api.eOrderApi.getExpressTempList(params).then((res) => {
                this.loading = false
                if (res.error === 0) {
                    this.data = res.list
                    this.total = res.total
                }
            })
        },
        // 搜索
        handleSearch(value) {
            this.search = { ...this.search, ...value }
            this.refreshTable()
        },
        // 切换页码
        changePage(page) {
            this.page = page
            this.getExpressTempList()
        },
        // 切换默认
        handleDefault(data) {
            this.$api.eOrderApi
                .switchExpressTempDefault({
                    id: data.id,
                    is_default: data.is_default === '0' ? '1' : '0',
                })
                .then((res) => {
                    if (res.error === 0) {
                        this.refreshTable()
                        this.$Message.success('电子面单默认模板变更成功')
                    }
                })
        },
        // 编辑
        handleEdit(id) {
            this.$router.push({
                path:
                    '/eOrder/templateManagement/eOrder/edit',
                query: {
                    id,
                },
            })
        },
        // 删除
        handleDelete(data) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认彻底删除电子面单模板？',
                onOk: () => {
                    deleteDefault = false
                    if (data) {
                        // 单项删除
                        if (data.is_default === '1') {
                            // 删除默认模板
                            deleteDefault = true
                        }
                        this.deleteExpressTemp(data.id)
                    } else {
                        // 批量删除
                        let _ids = this.selectRows.map((item) => {
                            if (item.is_default === '1') {
                                // 删除默认模板
                                deleteDefault = true
                            }
                            return item.id
                        })
                        this.deleteExpressTemp(_ids)
                    }
                },
                onCancel: () => {},
            })
        },
        // 批量删除
        handleBatchDelete() {
            this.handleDelete()
        },
        // 删除模板
        deleteExpressTemp(id) {
            this.$api.eOrderApi
                .deleteExpressTemp({
                    id,
                })
                .then((res) => {
                    if (res.error === 0) {
                        this.refreshTable()
                        this.$Message.success('删除成功')
                        if (deleteDefault) {
                            setTimeout(() => {
                                // 给出提示
                                this.$Message.success(
                                    '电子面单默认模板变更成功'
                                )
                            }, 2000)
                        }
                    }
                })
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
            }
            this.$refs['page'].reset()
            this.getExpressTempList()
        },
        // 选中项发生变化
        handleSelectionChange(selection) {
            this.selectRows = selection
        },
        // 表格下方全选按钮
        handleCheckboxChange(status) {
            this.$refs['table'].selectAll(status)
        },
    },
}
</script>

<style scoped lang="scss">
.activity-wrap {
    background-color: $background-color;
    margin: 20px auto;
    .table-list {
        background-color: #ffffff;
        padding: 0 20px;
        border-radius: 2px;
        position: relative;
        /deep/ .tag-label {
            margin-left: 5px;
            span.text {
                white-space: nowrap;
                font-size: 12px;
                line-height: 16px;
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
