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
    <div class="setting-payment-mould">
        <kdx-header-bar  type="little">
            <template #header>
                <Button type="primary" :disabled="noManagePerm" @click='toAddModal' >+添加模板</Button>
            </template>
            <Form ref="form" :model="search" :label-width="120" inline @submit.native.prevent>
                <FormItem label="模板名称：">
                    <Input
                        type="text"
                        v-model="search.keyword"
                        placeholder="请输入模板名称"
                        class="width-340"
                        @on-enter="handleSearch"
                    />
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="refund-address-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="getTableData" @on-selection-change="selectChange"></Table>
            <div class="footer-action" v-if="data.length > 0">
                <Checkbox v-model="isSelectAll" :disabled='noManagePerm' @on-change="checkboxChange"></Checkbox>
                <Button :disabled="selectDisabled||noManagePerm" @click="bulkDelete">删除</Button>
            </div>
            <div class="footer-page">
                <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    inject:['returnToTop'],
    components: {},
    props: {},
    data() {
        return {
            total: 0,
            isSelectAll: false,
            selectRows: [], // 选中项
            search: {
                keyword: ''
            },
            data: [],
            loading: false,
            columns: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: '模板名称',
                    key: 'title'
                },
                {
                    title: '支付类型',
                    key: ' pay_type',
                    render: (h, params) => {
                        return (
                            <span>{this.formartType(params.row.pay_type)}</span>
                        )
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 100,
                    render: (h, params) => {
                        return (
                            <div>
                                <span class={"rr-brand-color pointer " + (this.noManagePerm?"noManagePerm":"") }
                                    onClick={() => {
                                        this.noManagePerm||this.handleEdit(params.row.id)
                                    }}
                                >
                                    编辑
                                </span>
                                <span class={"rr-brand-color marginL-10 pointer " + (this.noManagePerm?"noManagePerm":"") }
                                style={{marginLeft:'10px'}}
                                    onClick={() => {
                                        this.handleDelete(params.row.id)
                                    }}
                                >
                                    删除
                                </span>
                            </div>
                        )
                    }
                }
            ]
        }
    },
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('sysset.pay_template_set.manage')
        },
        getTableData(){
            return this.data.map(item=>{
                item._disabled=this.noManagePerm;
                return item;
            })
        },
        // 下方按钮是否可操作
        selectDisabled() {
            return this.selectRows.length === 0
        }
    },
    created() {},
    mounted() {
        this.getList()
    },
    methods: {
        toAddModal(){
            this.$router.push({
                path: '/setting/paymentSettings/mould/addMoulde'
            })
        },
        getList() {
            this.returnToTop();
            this.loading = true;
            this.$api.settingApi
                .getPayMouldList({ keyword: this.search.keyword })
                .then(res => {
                    this.loading = false;
                    if (res.error == 0) {
                        this.total = res.total
                        this.data = res.list
                    }
                })
        },
        // 选中项发生变化
        selectChange(selection) {
            this.selectRows = selection
            this.isSelectAll = this.selectRows.length === this.data.length
        },
        // 表格下方全选按钮
        checkboxChange(status) {
            this.$refs['table'].selectAll(status)
        },
        handleEdit(id) {
            this.$router.push({
                path: '/setting/paymentSettings/mould/editMoulde',
                query: {
                    id: id
                }
            })
        },
        handleDelete(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认删除支付模板',
                onOk: () => {
                    this.$api.settingApi
                        .deletePayMould({ id: id })
                        .then(res => {
                            if (res.error == 0) {
                                this.getList()
                                this.$Message.success('删除成功')
                            }
                        })
                },
                onCancel: () => {}
            })
        },
        // 批量删除
        bulkDelete() {
            this.$Modal.confirm({
                title: '提示',
                content: '确认批量删除',
                onOk: () => {
                    let ids = this.selectRows.map(item => item.id)
                    this.$api.settingApi
                        .bulkDeleteMould({ id: ids })
                        .then(res => {
                            if (res.error == 0) {
                                this.getList()
                                this.$Message.success('删除成功')
                            }
                        })
                },
                onCancel: () => {}
            })
        },
        // 重置页码
        reset() {
            this.$refs['page']?.reset()
        },
        changePage(page) {
            this.$emit('on-page-change', page)
        },
        handleSearch() {
            this.getList()
        },
        formartType(type) {
            let typeArr = [
                { value: '10', label: '微信支付' },
                { value: '11', label: '微信支付子商户' },
                { value: '12', label: '借用支付' },
                { value: '13', label: '借用微信支付子商户' },
                { value: '20', label: '支付宝' },
                { value: '30', label: '威富通(兼容全付通)' }
            ]

            return typeArr.filter(v => v.value === type)[0].label
        }
    }
}
</script>

<style lang="scss">
.setting-payment-mould {
    background-color: $background-color;
    margin: 20px auto;
    .refund-address-list {
        padding: 0 20px;
        background-color: #ffffff;
    }
    .footer-page {
        border-top: 1px solid $border-color;
    }
}
</style>
