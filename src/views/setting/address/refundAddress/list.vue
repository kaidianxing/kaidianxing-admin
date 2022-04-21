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
    <div class='refund-address-list-box'>
        <kdx-header-bar type="little">
            <template #header>
                <Button type="primary" :disabled="noManagePerm" to="/setting/address/refundAddress/add">+添加退货地址</Button>
            </template>
            <Form ref="form" :model="search" :label-width="120" inline @submit.native.prevent>
                <FormItem label="名称：">
                    <Input type="text" v-model="search.keyword" placeholder="请输入名称" class="width-340"
                           @on-enter="handleSearch"/>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="refund-address-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data" @on-selection-change="selectChange"></Table>
            <div class="footer-action" v-show="data.length">
                <Checkbox v-model="isSelectAll" :disabled='noManagePerm' @on-change="checkboxChange"></Checkbox>
                <Button :disabled="selectDisabled||noManagePerm" @click="bulkDelete">删除</Button>
            </div>
            <div class="footer-page">
                <kdx-page-component ref="page" :total="page.total" @on-change="changePage"></kdx-page-component>
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
                page: {
                    pageSize: 10,
                    pageNumber: 1
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
                        title: '名称',
                        key: 'title',
                        render: (h, params) => {
                            let defaultComponent;
                            if (params.row.is_default == '1') {
                                defaultComponent = (
                                    <kdx-tag-label type="info" class="marginL-10" size="small">默认</kdx-tag-label>
                                )
                            }
                            return (
                                <div class="refund-address-title">
                                    <span class="title">{params.row.title}</span>
                                    {defaultComponent}
                                </div>
                            )
                        }
                    },
                    {
                        title: '联系人',
                        key: 'name'
                    },
                    {
                        title: '手机',
                        key: 'mobile'
                    },
                    {
                        title: '地址',
                        key: 'address'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            let defaultComponent;
                            if (params.row.is_default == 1) {
                                defaultComponent = (
                                    <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                        this.changeDefault(params.row.id, params.row.is_default);
                                    }}>取消默认</Button>
                                )
                            } else {
                                defaultComponent = (
                                    <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                        this.changeDefault(params.row.id, params.row.is_default);
                                    }}>设置默认</Button>
                                )
                            }
                            return (
                                <div>
                                    {defaultComponent}
                                    <Button type="text" disabled={this.noManagePerm} class="marginL-10" onClick={() => {
                                        this.handleEdit(params.row.id);
                                    }}>编辑</Button>
                                    <Button type="text" disabled={this.noManagePerm} class="marginL-10" onClick={() => {
                                        this.handleDelete(params.row.id);
                                    }}>删除</Button>
                                </div>
                            );
                        }
                    }
                ]
            };
        },
        computed: {
            noManagePerm(){//管理权限
                return !this.$getPermMap('sysset.refund_address.manage')
            },
            // 下方按钮是否可操作
            selectDisabled() {
                return this.selectRows.length === 0;
            }
        },
        created() {
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList() {
                this.returnToTop();
                this.loading = true;
                let obj = {
                    ...this.search,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                };
                this.$api.settingApi.getRefundAddressList(obj).then(res => {
                    this.loading = false;
                    if (res.error == 0) {
                        this.page.total = res.total;
                        this.data = res.list;
                    }
                });
            },
            // 选中项发生变化
            selectChange(selection) {
                this.selectRows = selection;
                this.isSelectAll = this.selectRows.length === this.data.length;
            },
            // 表格下方全选按钮
            checkboxChange(status) {
                this.$refs['table'].selectAll(status);
            },
            handleEdit(id) {
                this.$router.push({
                    path: '/setting/address/refundAddress/edit',
                    query: {
                        id: id
                    }
                });
            },
            handleDelete(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除退货地址',
                    onOk: () => {
                        this.$api.settingApi.deleteRefundAddress({id: id}).then(res => {
                            if (res.error == 0) {
                                this.getList();
                                this.$Message.success('删除成功');
                            }
                        });
                    },
                    onCancel: () => {
                    }
                });
            },
            // 批量删除
            bulkDelete() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除？',
                    onOk: () => {
                        let ids = this.selectRows.map(item => item.id);
                        this.$api.settingApi.deleteRefundAddress({id: ids}).then(res => {
                            if (res.error == 0) {
                                this.getList();
                                this.$Message.success('删除成功');
                            }
                        });
                    },
                    onCancel: () => {
                    }
                });
            },
            // 重置页码
            reset() {
                this.$refs['page'].reset();
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            handleSearch() {
                this.getList();
            },
            changeDefault(id, is_default) {
                let obj = {
                    id: id,
                    is_default: is_default == 1 ? 0 : 1
                };
                this.$api.settingApi.changeRefundDefault(obj).then(res => {
                    if (res.error == 0) {
                        this.getList();
                        this.$Message.success('默认状态修改成功');
                    }
                });
            }
        },
    };
</script>

<style scoped lang="scss">
    .refund-address-list-box {
        margin: 20px auto;
        .refund-address-list {
            padding: 0 20px;
            background-color: #FFFFFF;
            position: relative;
            /deep/ .ivu-table {
                .refund-address-title {
                    .title {

                    }
                }
            }
            .footer-page {
                border-top: 1px solid $border-color;
            }
        }
    }
</style>
