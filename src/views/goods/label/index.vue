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
    <div class="good-label">
        <kdx-header-bar type="little">
            <template #header>
                <Button type="primary" :disabled='noManagePerm' @click='toAdd'>+添加标签组</Button>
            </template>
            <Form ref="form" :model="search" :label-width="100" inline @submit.native.prevent>
                <FormItem label="标签组名称：">
                    <Input type="text" v-model="search.name" placeholder="标签组名称" class="width-160" @on-enter="handleSearch"/>
                </FormItem>
                <FormItem label="标签组状态：">
                    <Select :value="search.status" class="width-160" @on-change="setStatus">
                        <Option v-for="item in optionData.status" :key="item.value" :value="item.value">{{item.name}}
                        </Option>
                    </Select>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="table-list" v-loading="table.loading">
            <table-list ref="table_list" :data="getTableData" :total="table.total" @on-refresh="getList"
                        @on-page-change="changePage"></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import TableList from "./components/TableList";

    export default {
        name: "index",
        inject:['returnToTop'],
        components: {
            TableList
        },
        computed: {
            noManagePerm() { //管理权限
                return !this.$getPermMap('goods.label_group.manage')
            },
            getTableData(){
                return this.table.data.map(item=>{
                    item._disabled=this.noManagePerm
                    return item
                })
            }
        },
        data() {
            return {
                search: {
                    name: '',
                    status: 'all'
                },
                table: {
                    data: [],
                    loading: false,
                    total: 0
                },
                optionData: {
                    status: [
                        {
                            value: 'all',
                            name: '全部'
                        },
                        {
                            value: '1',
                            name: '启用'
                        },
                        {
                            value: '0',
                            name: '禁用'
                        }
                    ]
                },
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
            };
        },
        methods: {
            setStatus(val) {
                this.search.status=val;  
            },
            handleSearch() {
              this.refreshTable();
            },
            // 重置
            handleReset() {
                this.search = {
                    status: 'all',
                    title: '',
                };
                this.refreshTable();
            },
            toAdd(){
                this.$router.push({
                    path:"/goods/label/add"
                })
            },
            refreshTable(page) {
                if (!page) {
                    this.page = {
                        pageSize: 10,
                        pageNumber: 1
                    };
                }
                this.$refs['table_list'].reset(page);
                this.getList();
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            getList() {
                this.$history.setData({
                    search:this.search, 
                    page:this.page
                })
                this.returnToTop();
                // 重置表格下方
                this.$refs['table_list'].initFooterData();
                this.table.loading = true;
                let search = Object.assign({}, this.search);
                search.status = search.status === 'all'? '' : search.status;
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                    pager:1
                }, search);
                this.$api.goodsApi.goodLabelGroupList(params)
                    .then(res => {
                        this.table.loading = false;
                        if (res.error === 0) {
                            this.table.data = res.list;
                            this.table.total = res.total;
                        }
                    }).catch();
            }
        },
        mounted() {            
            this.$history.setRoute(this.$route).getData(history=>{
                let  {search,page} = history
                this.search = this.$utils.deepCopy(search)||this.search
                this.page = page;
                this.$nextTick(()=>{
                    this.refreshTable(this.page);
                })

            })
        }
    };
</script>

<style scoped lang="scss">
    .good-label {
        background-color: $background-color;
        margin:20px auto;
        .add-label {
            padding: 20px 0 20px 40px;
            border-bottom: 1px solid $border-color;
            background-color: #ffffff;
        }
        .table-list {
            background-color: #ffffff;
            padding: 0 20px;
            border-radius: 2px;
            position: relative;
        }
    }
</style>
