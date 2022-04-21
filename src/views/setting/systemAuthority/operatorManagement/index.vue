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
            <template #header>
                <Button
                    type="primary"
                    to="/setting/systemAuthority/operatorManagement/add"
                    :disabled="noManagePerm"
                >
                    +添加操作员
                </Button>
            </template>
            <Form
                ref="form"
                :model="searchData"
                :label-width="100"
                inline
                @submit.native.prevent
            >
                <FormItem label="关键字：">
                    <Input
                        type="text"
                        v-model="searchData.keyword"
                        placeholder="请输入"
                        class="width-340"
                        @on-enter="handleSearch"
                    />
                </FormItem>
                <FormItem label="角色：">
                    <Select v-model="searchData.role_id" class="width-160">
                        <Option
                            v-for="(item, index) in roleList"
                            :key="index"
                            :value="item.id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="状态：">
                    <Select v-model="searchData.status" class="width-160">
                        <Option
                            v-for="(item, index) in statusList"
                            :key="index"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">
                        搜索
                    </Button>
                    <Button type="text" @click="handleReset">
                        重置
                    </Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="refund-address-list" v-loading="loading">
            <Table
                ref="table"
                :columns="columns"
                :data="getTableData"
                v-loading="loading"
                @on-selection-change="selectChange"
            >
                <template slot-scope="{ row }" slot="status">
                    <kdx-status-text
                        :type="row.status === '1' ? 'success' : 'danger'"
                    >
                        {{ row.status === '1' ? '已启用' : '已禁用' }}
                    </kdx-status-text>
                </template>
            </Table>
            <div class="footer-action" v-if="list.length > 0">
                <Checkbox
                    :value="isSelectAll"
                    :disabled='noManagePerm'
                    @on-change="checkboxChange"
                ></Checkbox>
                <Button :disabled="selectDisabled" @click="batchEnable">
                    启用
                </Button>
                <Button :disabled="selectDisabled" @click="batchDisable">
                    禁用
                </Button>
                <Button :disabled="selectDisabled" @click="batchDelete">
                    删除
                </Button>
            </div>
            <div class="footer-page" v-show="total > 10">
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
export default {
    inject: ['returnToTop'],
    components: {},
    props: {},
    data() {
        return {
            total: 0,
            page: 1,
            pagesize: 10,
            list: [],
            selectRows: [], // 选中项
            // 搜索信息
            searchData: {
                keyword: '',
                status: 'all',
                role_id: 'all',
            },
            loading: false,
            statusList: [
                {
                    label: '全部',
                    value: 'all',
                },
                {
                    label: '已启用',
                    value: '1',
                },
                {
                    label: '已禁用',
                    value: '0',
                },
            ],
            roleList: [],
            columns: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center',
                },
                {
                    title: '登录ID',
                    key: 'manage_id',
                },
                {
                    title: '操作员',
                    key: 'name',
                },
                {
                    title: '手机号码',
                    key: 'contact',
                },
                {
                    title: '角色名称',
                    key: 'role_name',
                },
                {
                    title: '状态',
                    slot: 'status',
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        return (
                            <div>
                                <Button
                                    class="marginL-10"
                                    type="text"
                                    onClick={() => {
                                        this.handleEdit(params.row.manage_id)
                                    }}
                                    disabled={this.noManagePerm}
                                >
                                    编辑
                                </Button>
                                <Button
                                    class="marginL-10"
                                    type="text"
                                    disabled={this.noManagePerm}
                                    onClick={() => {
                                        this.handleStatus(params.row)
                                    }}
                                >
                                    {params.row.status === '1'
                                        ? '禁用'
                                        : '启用'}
                                </Button>
                                <Button
                                    class="marginL-10"
                                    type="text"
                                    disabled={this.noManagePerm}
                                    onClick={() => {
                                        this.handleDelete(params.row.manage_id)
                                    }}
                                >
                                    删除
                                </Button>
                            </div>
                        )
                    },
                },
            ],
        }
    },
    computed: {
        isSelectAll() {
            return this.selectRows.length === this.list.length
        },
        // 下方按钮是否可操作
        selectDisabled() {
            return this.selectRows.length === 0 || this.noManagePerm;
        },
        noManagePerm() { //管理权限
            return !this.$getPermMap('user.index.manage')
        },
        getTableData(){
            return this.list.map(item=>{
                item._disabled=this.noManagePerm;
                return item;
            })
        },
    },
    created() {
        this.getOperatorList()
        this.getAllRole()
    },
    methods: {
        // 获取操作员列表
        getOperatorList() {
            this.returnToTop()
            this.loading = true
            this.$api.settingApi
                .getOperatorList({
                    keyword: this.searchData.keyword,
                    status:
                        this.searchData.status !== 'all' &&
                        this.searchData.status !== ''
                            ? this.searchData.status * 1
                            : '',
                    role_id:
                        this.searchData.role_id === 'all'
                            ? ''
                            : this.searchData.role_id,
                    page: this.page,
                    pagesize: this.pagesize,
                })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.total = res.total
                        res.list.forEach((item) => {
                            item['contact'] = item.contact || '-'
                            item['role_name'] = item.roleName?.name || '-'
                        })
                        this.list = [...res.list]
                        this.selectRows = [] // 清空选中列表
                    }
                })
        },
        // 获取所有的角色信息
        getAllRole() {
            this.$api.settingApi.getRoleAllList().then((res) => {
                let { error, data = [] } = res
                if (error === 0) {
                    data.unshift({ id: 'all', name: '全部' })
                    this.roleList = data
                }
            })
        },
        // 编辑操作员
        handleEdit(id) {
            this.$router.push({
                path: '/setting/systemAuthority/operatorManagement/add',
                query: {
                    id: id,
                },
            })
        },
        // 单项处理操作员状态 （启用、禁用）
        handleStatus(data) {
            if (data.status === '1') {
                // 禁用
                this.forbiddenOperator(data.manage_id)
            } else {
                // 启用
                this.activeOperator(data.manage_id)
            }
        },
        // 批量启用
        batchEnable() {
            let ids = this.selectRows.map((item) => item.manage_id)
            ids = ids.join(',')
            this.activeOperator(ids)
        },
        // 批量禁用
        batchDisable() {
            let ids = this.selectRows.map((item) => item.manage_id)
            ids = ids.join(',')
            this.forbiddenOperator(ids)
        },
        // 启用角色
        activeOperator(id = '') {
            let _params = {}
            if (id.split(',').length === 1) {
                // 单项
                _params = {
                    id: id,
                }
            } else {
                // 批量
                _params = {
                    id: 0,
                    ids: id,
                }
            }
            this.$api.settingApi.activeOperator(_params).then((res) => {
                if (res.error == 0) {
                    this.getOperatorList()
                    this.$Message.success('启用成功')
                }
            })
        },
        // 禁用角色
        forbiddenOperator(id = '') {
            let _params = {}
            if (id.split(',').length === 1) {
                // 单项
                _params = {
                    id: id,
                }
            } else {
                // 批量
                _params = {
                    id: 0,
                    ids: id,
                }
            }
            this.$api.settingApi.forbiddenOperator(_params).then((res) => {
                if (res.error == 0) {
                    this.getOperatorList()
                    this.$Message.success('禁用成功')
                }
            })
        },
        // 单项删除角色
        handleDelete(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认删除该操作员',
                onOk: () => {
                    this.deleteOperator(id)
                },
                onCancel: () => {},
            })
        },
        // 批量删除角色
        batchDelete() {
            let ids = this.selectRows.map((item) => item.manage_id)
            ids = ids.join(',')
            this.deleteOperator(ids)
        },
        // 删除角色
        deleteOperator(id = '') {
            let _params = {}
            if (id.split(',').length === 1) {
                // 单项
                _params = {
                    id: id,
                }
            } else {
                // 批量
                _params = {
                    id: 0,
                    ids: id,
                }
            }
            this.$api.settingApi.deleteOperator(_params).then((res) => {
                if (res.error == 0) {
                    this.getOperatorList()
                    this.$Message.success('删除成功')
                }
            })
        },
        // 点击搜索按钮
        handleSearch() {
            this.page = 1
            this.pagesize = 10
            this.$refs['page']?.reset()
            this.getOperatorList()
        },
        // 点击重置按钮
        handleReset() {
            this.searchData.keyword = ''
            this.searchData.role_id = 'all'
            this.searchData.status = 'all'
            this.page = 1
            this.pagesize = 10
            this.$refs['page']?.reset()
            this.getOperatorList()
        },
        // 切换页码
        changePage(page) {
            this.page = page.pageNumber
            this.pagesize = page.pageSize
            this.getOperatorList()
        },
        // 选中项发生变化
        selectChange(selection) {
            this.selectRows = selection
        },
        // 表格下方全选按钮
        checkboxChange(status) {
            this.$refs['table'].selectAll(status)
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #f4f6f8;
    margin: 20px auto;
}

.refund-address-list {
    padding: 0 20px;
    background-color: #ffffff;
    border-radius: 2px;
    position: relative;
}

.footer-page {
    border-top: 1px solid $border-color;
}
</style>
