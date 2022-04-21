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
    <div class="app">
        <div class="header" >
            <div class="flex">
                <Form ref="form" :model="model" :label-width="100" inline @submit.native.prevent>
                    <FormItem label="应用名称：">
                        <Input
                            type="text"
                            v-model="model.keywords"
                            placeholder="应用名称"
                            class="width-340"
                            @on-enter="handleSearch"
                        />
                    </FormItem>
                </Form>
                <div class="btn">
                    <Button class="mL-20" v-perm.disable="'goods'" type="primary" @click="handleSearch"
                    >搜索</Button
                    >
                    <Button class="mL-20" type="text" @click="handleReset"
                    >重置</Button
                    >
                </div>
            </div>
        </div>
        <div class="app-content">
            <ul class="app-content-tab">
                <li
                    :class="{ active: tab === item.value }"
                    v-for="item in categoryList"
                    :key="item.value"
                    @click="tabClick(item.value)"
                >
                    {{ item.title }}
                    <div class="active-line"></div>
                </li>
            </ul>
            <div class="table-list">
                <table-list
                    ref="table_list"
                    :data="table.data"
                    :total="table.total"
                    :loading="table.loading"
                    :category="tab"
                    @on-page-change="changePage"
                    @on-sort="handleSort"
                    @on-install="handleInstall"
                />
            </div>
        </div>
        <common-modal
            v-model="modalShowFlag"
            :loading="modalLoading"
            :appData="appData"
            @on-success="refreshData"
        />
        <slot></slot>
    </div>
</template>

<script>
import TableList from './components/TableList'
import CommonModal from './components/CommonModal'
export default {
    components: {
        TableList,
        CommonModal,
    },
    data() {
        return {
            search: {},
            model: {
                keywords: '',
                status: 'all',
            },
            statusList: [
                {
                    id: 'all',
                    name: '全部'
                },
                {
                    id: '0',
                    name: '未上架'
                },
                {
                    id: '1',
                    name: '已上架'
                }
            ],
            tab: 'all',
            categoryList: [],
            table: {
                data: [],
                total: 0,
                loading: false,
            },
            sort: {},
            page: {
                pageSize: 10,
                pageNumber: 1,
            },
            modalShowFlag: false,
            modalLoading: false,
            appData: {},
            step: '0', // 0未开始 1请求应用安装 2请求应用安装 3下载文件 4执行安装 5安装完成 6出错
            errMsg: '',
        }
    },
    created() {
        this.isJumpIn(),
        this.getList()
    },
    methods: {
        // 重置
        handleReset() {
            this.model = {
                keywords: '',
                status: 'all',
            }
        },
        tabClick(name) {
            this.tab = name
            this.refreshTable()
        },
        // 获取列表
        getList() {
            this.table.loading = true
            let params = Object.assign(
                {
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                    category: '-100'
                },
                this.search,
                this.sort
            )
            this.$api.systemApi.getAppsList(params).then((res) => {
                this.table.loading = false
                if (res.error === 0) {
                    this.table.data = res.list
                    this.table.total = res.total
                }
            })
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
            }
            this.getList()
        },
        // 搜索
        handleSearch() {
            this.search = this.model
            this.refreshTable()
        },
        changePage(page) {
            this.page = page
            this.getList()
        },
        handleSort(sort) {
            this.sort = sort
            this.refreshTable()
        },
        // 应用安装
        handleInstall(data) {
            this.appData = {
                ...data,
            }
            // 初始化安装
            this.modalShowFlag = true
        },
        // 检测应用安装
        checkAppInstall() {
            this.modalLoading = true
            let { identity, app_id } = this.appData
            this.step = '1'
            this.$api.systemApi.checkAppInstall({ identity, app_id }).then((res) => {
                if (res.error === 0) {
                    this.requestAppInstall()
                } else {
                    this.step = '6'
                    this.errMsg = res.message
                    this.modalLoading = false
                }
            })
        },
        // 请求应用安装
        requestAppInstall() {
            this.step = '2'
            this.$api.systemApi.requestAppInstall().then((res) => {
                if (res.error === 0) {
                    this.getRequestStatus()
                } else {
                    this.step = '6'
                    this.errMsg = res.message
                    this.modalLoading = false
                }
            })
        },
        // 获取请求安装状态
        getRequestStatus() {
            this.$api.systemApi.getRequestStatus().then((res) => {
                if (res.error === 0) {
                    if (!res.packaged) {
                        setTimeout(() => {
                            this.getRequestStatus()
                        }, 2000)
                    } else {
                        this.downloadFile()
                    }
                } else {
                    this.step = '6'
                    this.errMsg = res.message
                    this.modalLoading = false
                }
            })
        },
        // 下载文件
        downloadFile() {
            this.step = '3'
            let page = 1
            const request = (page) => {
                this.$api.systemApi.downloadFile()({
                    page,
                }).then((res) => {
                    if (res.error === 0) {
                        if (!res.is_end) {
                            page++
                            request(page)
                        } else {
                            // this.execute()
                        }
                    } else {
                        this.step = '6'
                        this.errMsg = res.message
                        this.modalLoading = false
                    }
                })
            }
            request(page)
        },
        // 执行安装
        execute() {
            this.step = '4'
            this.$api.systemApi.execute().then((res) => {
                if (res.error === 0) {
                    this.step = '5'
                    this.modalLoading = false
                } else {
                    this.step = '6'
                    this.errMsg = res.message
                    this.modalLoading = false
                }
            })
        },
        refreshData(){
            this.refreshTable()
        },
        isJumpIn(){
          if(this.$route.query.appName){
            this.search.keywords = this.$route.query.appName
          }      
        }
    },
}
</script>

<style lang="scss" scoped>

.app {
    margin: 20px auto;
    .header {
        padding-top: 30px;
        padding-bottom: 30px;
        margin-bottom: 10px;
        background-color: #fff;
    }
    .app-content {
        background-color: #ffffff;
        .app-content-tab {
            border-bottom: 1px solid $border-color;
            display: flex;
            align-items: center;
            > li {
                margin-left: 40px;
                font-size: 18px;
                line-height: 24px;
                font-weight: 600;
                padding: 12px 0;
                cursor: pointer;
                position: relative;
                .active-line {
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background-color: $brand-color;
                    display: none;
                }
                &.active {
                    color: $brand-color;
                    .active-line {
                        display: inline-block;
                    }
                }
            }
        }
        .table-list {
            padding: 20px 20px 20px 20px;
        }
    }
}
</style>
