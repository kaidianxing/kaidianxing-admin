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
        <kdx-header-bar type="little">
            <template #header>
                <Button
                    :disabled='noManagePerm'
                    type="primary"
                    to="/setting/shopSetting/announcementManagement/add"
                >
                    +添加公告
                </Button>
            </template>
            <Form ref="form" :label-width="100" inline @submit.native.prevent>
                <FormItem label="关键词：">
                    <Input
                        type="text"
                        v-model="searchData.keyword"
                        placeholder="请输入关键词"
                        class="width-340"
                        @on-enter="handleSearch"
                    />
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
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="list-wrap" v-loading="loading">
            <Table
                ref="table"
                :columns="columns"
                :data="list"
                @on-selection-change="selectionChange"
            >
                <template slot-scope="{ row }" slot="link">
                    <div class="link">
                        {{ row.link || '-' }}
                    </div>
                </template>
                <template slot-scope="{ row }" slot="status">
                    <kdx-status-text type="success" v-if="row.status === '1'">
                        显示
                    </kdx-status-text>
                    <kdx-status-text type="disabled" v-if="row.status === '0'">
                        隐藏
                    </kdx-status-text>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button
                        :disabled="noManagePerm"
                        type="text"
                        @click="
                            fnOperate({
                                operate: 'changeStatus',
                                type: 'single',
                                id: row.id,
                                status: row.status === '0' ? '1' : '0',
                            })
                        "
                    >
                        {{ row.status === '0' ? '显示' : '隐藏' }}
                    </Button>
                    <Button 
                        :disabled="noManagePerm"
                        type="text"
                        class="mL-10"
                        @click="
                            fnOperate({
                                operate: 'edit',
                                id: row.id,
                            })
                        "
                    >
                        编辑
                    </Button>
                    <Button
                        :disabled="noManagePerm"
                        class="mL-10"
                        type="text"
                        @click="
                            fnOperate({
                                operate: 'delete',
                                type: 'single',
                                id: row.id,
                            })
                        "
                    >
                        删除
                    </Button>
                </template>
            </Table>
            <div class="footer-action" v-show="list.length > 0">
                <Checkbox
                    :disabled='noManagePerm'
                    v-model="isSelectAll"
                    @on-change="checkboxChange"
                ></Checkbox>
                <Button
                    :disabled="selectDisabled||noManagePerm"
                    @click="
                        fnOperate({
                            operate: 'changeStatus',
                            type: 'multiple',
                            status: '1',
                        })
                    "
                >
                    显示
                </Button>
                <Button
                    :disabled="selectDisabled||noManagePerm"
                    @click="
                        fnOperate({
                            operate: 'changeStatus',
                            type: 'multiple',
                            status: '0',
                        })
                    "
                >
                    隐藏
                </Button>
                <Button 
                    :disabled="selectDisabled||noManagePerm"
                    @click="
                        fnOperate({
                            operate: 'delete',
                            type: 'multiple',
                        })
                    "
                >
                    删除
                </Button>
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
export default {
    inject:['returnToTop'],
    data() {
        return {
            page: 1,
            pagesize: 10,
            loading: false,
            statusList: [
                {
                    value: 'all',
                    label: '全部',
                },
                {
                    value: '1',
                    label: '显示',
                },
                {
                    value: '0',
                    label: '隐藏',
                },
            ],
            searchData: {
                keyword: '',
                status: 'all',
            },
            columns: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center',
                },
                {
                    title: '排序',
                    key: 'sort_by',
                    width: 80,
                },
                {
                    title: '标题',
                    key: 'title',
                    minWidth: 300,
                },
                {
                    title: '链接',
                    slot: 'link',
                },
                {
                    title: '状态',
                    slot: 'status',
                },
                {
                    title: '操作',
                    slot: 'action',
                },
            ],
            selectRows: [], // 选中项
            list: [],
            total: 0,
        }
    },
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('sysset.mall.notice.manage')
        },
        isSelectAll() {
            return this.selectRows.length === this.list.length
        },
        // 下方按钮是否可操作
        selectDisabled() {
            return this.selectRows.length === 0
        },
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.returnToTop();
            this.loading = true
            this.$api.settingApi
                .getNoticeList({
                    page: this.page,
                    pagesize: this.pagesize,
                    keyword: this.searchData.keyword,
                    status:
                        this.searchData.status === 'all'
                            ? ''
                            : this.searchData.status,
                })
                .then((res) => {
                    if (res.error === 0) {
                        this.list = res.list
                        this.total = res.total
                        this.loading = false
                    }
                })
        },
        // 点击搜索按钮
        handleSearch() {
            this.selectRows = []
            this.page = 1
            this.pagesize = 10
            this.$refs['page']?.reset()
            this.getList()
        },
        // 点击重置按钮
        handleReset() {
            this.selectRows = []
            this.searchData.status = 'all'
            this.searchData.keyword = ''
            this.page = 1
            this.pagesize = 10
            this.$refs['page']?.reset()
            this.getList()
        },
        // 选中项发生变化
        selectionChange(selection) {
            this.selectRows = selection
        },
        // 表格下方全选按钮
        checkboxChange(status) {
            this.list.forEach((item, index) => {
                this.$set(this.list[index], '_checked', status)
            })
            if (status) {
                this.selectRows = this.list
            } else {
                this.selectRows = []
            }
        },
        fnOperate(data) {
            if (data.operate === 'delete') {
                // 删除
                let ids = ''
                if (data.type === 'single') {
                    ids = data.id
                } else if (data.type === 'multiple') {
                    ids = this.selectRows
                        .map((item) => {
                            return item.id
                        })
                        .join(',')
                }
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定删除吗?',
                    onOk: () => {
                        this.deleteNotice(ids)
                    },
                    onCancel: () => {},
                })
            } else if (data.operate === 'edit') {
                // 编辑
                this.$router.push({
                    path: '/setting/shopSetting/announcementManagement/add',
                    query: {
                        id: data.id,
                    },
                })
            } else if (data.operate === 'changeStatus') {
                // 修改显示/隐藏
                let status = data.status
                let ids = ''
                if (data.type === 'single') {
                    ids = data.id
                } else if (data.type === 'multiple') {
                    ids = this.selectRows
                        .map((item) => {
                            return item.id
                        })
                        .join(',')
                }
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定修改状态吗?',
                    onOk: () => {
                        this.changeNoticeStatus(ids, status)
                    },
                    onCancel: () => {},
                })
            }
        },
        // 切换页码
        changePage(page) {
            this.page = page.pageNumber
            this.pagesize = page.pageSize
            this.getWithdrawList()
        },
        // 修改/批量修改公告状态
        changeNoticeStatus(ids, status) {
            this.$api.settingApi
                .changeNoticeStatus({
                    id: ids,
                    status,
                })
                .then((res) => {
                    if (res.error === 0) {
                        this.$Message.success('操作成功')
                        this.selectRows = []
                        this.getList()
                    }
                })
        },
        // 删除/批量删除
        deleteNotice(ids) {
            this.$api.settingApi
                .deleteNotice({
                    id: ids,
                })
                .then((res) => {
                    if (res.error === 0) {
                        this.$Message.success('操作成功')
                        this.selectRows = []
                        this.getList()
                    }
                })
        },
    },
}
</script>

<style scoped lang="scss">
.container {
    background-color: $background-color;
    margin: 20px auto;
    .list-wrap {
        background-color: #fff;
        padding: 0 20px;
        position: relative;
        // .link {
        //     cursor: pointer;
        //     color: $brand-color;
        // }
        .mL-10 {
            margin-left: 10px;
        }
    }
}
</style>
