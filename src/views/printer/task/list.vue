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
    <div class="printer-task-list">
        <kdx-header-bar type="little">
            <template #header>
                <Button type="primary" @click="handleAdd">+添加打印任务</Button>
            </template>
            <Form ref="form" :model="searchData" :label-width="100" inline @submit.native.prevent>
                <FormItem label="关键词：">
                    <Input class="width-340" type="text" v-model="searchData.keywords" placeholder="任务名称/打印模板" @on-enter="handleSearch"/>
                </FormItem>
                <FormItem label="打印场景：">
                    <Select v-model="searchData.scene" placeholder="请选择" class="width-160">
                        <Option v-for="item in sceneList" :key="item.value" :value="item.value">{{item.name}}</Option>
                    </Select>
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
    </div>
</template>

<script>
    export default {
        name: "list",
        components: {},
        props: {},
        data() {
            return {
                total: 0,
                list: [],
                searchData: {
                    keywords: '',
                    scene: 'all'
                },
                sceneList: [],
                page: {
                    pageSize: 10,
                    pageNumber: 1 // 页码
                },
                columns: [
                    {
                        title: '任务名称',
                        key: 'task_name',
                    },
                    {
                        title: '打印机',
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
                        title: '打印模板',
                        key: 'template_name',
                    },
                    {
                        title: '打印场景',
                        key: 'scene',
                        render: (h, params) => {
                            let doms = [];
                            if (params.row.scene) {
                                params.row.scene.forEach((item, index) => {
                                    doms.push(
                                        <div class="label"><span>{item}</span><span class="line">{index == params.row.scene.length -1 ?'':'|'}</span></div>
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
                                    <Button type="text" onClick={() => {this.handleEdit(params.row.id)}}>编辑</Button>
                                    <Button class="marginL-10" type="text" onClick={() => {this.handleDelete(params.row.id)}}>删除</Button>
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
            this.getPrinterScene();
            this.getList()
        },
        methods: {
            getPrinterScene() {
                this.$api.printerApi.getPrinterScene().then(res => {
                    if (res.error == 0) {
                        this.sceneList = [
                            {
                                name: '全部',
                                value: 'all'
                            },
                            ...res.data
                        ]
                    }
                })
            },
            getList() {
                this.loading = true;
                let obj = {
                    keyword: this.searchData.keywords,
                    scene: this.searchData.scene === 'all'?'':this.searchData.scene,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                };
                this.$api.printerApi.getPrinterTaskList(obj).then(res => {
                    this.loading = false;
                    if (res.error == 0) {
                        this.list = res.data.list;
                        this.total = res.data.total
                    }
                })
            },
            handleAdd() {
                this.$router.push({
                    path: '/printer/task/add'
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
                    keywords: '',
                    scene: 'all'
                };
                this.$refs['page'].reset();
                this.getList()
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            handleEdit(id) {
                this.$router.push({
                    path: '/printer/task/edit',
                    query: {id}
                });
            },
            handleDelete(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除该任务吗',
                    onOk: () => {
                        this.$api.printerApi.deletePrinterTaskList({id: id}).then(res => {
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
        },
    }
</script>

<style lang="scss" scoped>
    .printer-task-list {
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
</style>
