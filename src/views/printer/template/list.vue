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
    <div class="printer-template-list">
        <kdx-header-bar type="little">
            <template #header>
                <Button type="primary" @click="handleAdd">+添加模板</Button>
            </template>
            <Form ref="form" :model="searchData" :label-width="100" inline @submit.native.prevent>
                <FormItem label="模板名称：">
                    <Input class="width-340" type="text" v-model="searchData.keywords" placeholder="请输入" @on-enter="handleSearch"/>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="table-list">
            <Table ref="table" :columns="columns" :data="list"></Table>
            <div class="footer-page">
                <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
            </div>
        </div>
        <kdx-modal-frame title="小票预览" v-model='preview' :styles="{width:'700px'}" :mask-closable="false" :footerHide="true">
            <div class="preview-printer-modal">
                <printer-preview type="preview" :templateList="templateList" :footer="footer"></printer-preview>
            </div>
        </kdx-modal-frame>
    </div>
</template>

<script>
    import printerPreview  from './components/PrinterPreview'
    export default {
        name: "list",
        components: {
            printerPreview
        },
        props: {},
        data() {
            return {
                preview: false,
                total: 0,
                list: [],
                searchData: {
                    keywords: ''
                },
                page: {
                    pageSize: 10,
                    pageNumber: 1 // 页码
                },
                footer: '',
                templateList: [],
                columns: [
                    {
                        title: '模板名称',
                        key: 'name',
                    },
                    {
                        title: '模板类型',
                        key: 'type_text',
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            return (
                                <div>{params.row.status == 1 ? (
                                    <span class="success-color">已使用</span>
                                ) : (
                                    <span class="danger-color">未使用</span>
                                )}</div>
                            );
                        }
                    },
                    {
                        title: '应用的打印机',
                        key: 'printer_id',
                        render: (h, params) => {
                            let doms = [];
                            if (params.row.printer_id) {
                                params.row.printer_id.forEach((item, index) => {
                                    doms.push(
                                        <div class="label"><span>{item.name}</span><span class="line">{index == params.row.printer_id.length -1 ?'':'|'}</span></div>
                                    )
                                })
                            }
                            return (
                                <div class="signature flex">{doms.length>0?doms:'-'}</div>
                            );
                        }
                    },
                    {
                        title: '添加时间',
                        key: 'created_at',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return (
                                <div>
                                    <Button type="text" onClick={() => {this.handlePreview(params.row.content, params.row.footer)}}>预览</Button>
                                    <Button class="marginL-10 marginR-10" type="text" onClick={() => {this.handleEdit(params.row.id)}}>编辑</Button>
                                    <Button type="text" onClick={() => {this.handleDelete(params.row.id, params.row.status)}}>删除</Button>
                                </div>
                            )
                        }
                    },
                ],
            }
        },
        computed: {},
        created() {
        },
        mounted() {
            this.getList()
        },
        methods: {
            getList() {
                this.loading = true;
                let obj = {
                    keyword: this.searchData.keywords,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                };
                this.$api.printerApi.getPrinterTemList(obj).then(res => {
                    this.loading = false;
                    if (res.error == 0) {
                        this.list = res.data.list;
                        this.total = res.data.total
                    }
                })
            },
            handleAdd() {
                this.$router.push({
                    path: '/printer/template/add'
                });
            },
            handleSearch() {
                this.list = [];
                this.page = 1;
                this.getList();
            },
            handleReset() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1,
                };
                this.searchData = {
                    keywords: ''
                };
                this.$refs['page'].reset();
                this.getList()
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            handlePreview(data, footer) {
                this.preview = true;
                this.templateList = JSON.parse(data)
                this.footer = footer
            },
            handleEdit(id) {
                this.$router.push({
                    path: '/printer/template/edit',
                    query: {id}
                });
            },
            handleDelete(id) {
                this.$api.printerApi.deletePrinterTem({id: id, is_check: 1}).then(res => {
                    if (res.error == 0) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: res?.message || '确认删除该模板吗',
                            onOk: () => {
                                this.$api.printerApi.deletePrinterTem({id: id, is_check: 0}).then(res => {
                                    if (res.error == 0) {
                                        this.$Message.success('删除成功');
                                        this.getList()
                                    }
                                })
                            },
                            onCancel: () => {

                            }
                        });
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .printer-template-list {
        margin-top: 20px;
        .table-list {
            background-color: #ffffff;
            padding: 0 20px;
            border-radius: 2px;
            position: relative;
        }
        /deep/ .signature {
            align-items: center;
            flex-wrap: wrap;
            /*max-height: 44px;*/
            overflow: hidden;
            span {
                margin: 0 5px;
                /*vertical-align: text-bottom;*/
            }
            .line {
                color: $text-third;
            }
        }
    }
    .preview-printer-modal {
        padding: 40px;
        height: 600px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        .printer-preview {
            width: 375px;
            padding: 0;
            margin: 0;
            height: fit-content;
            overflow-y: initial;
            .printer-template-content {
                margin: 0;
            }
        }
    }
</style>
