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
        <kdx-header-bar>
            <template #header>
                <Button type="primary" :disabled='noManagePerm' @click='toAdd'>添加商品组块</Button>
            </template>
            <br>
            <Form ref="form" :model="search" :label-width="130" inline @submit.native.prevent>
                <FormItem label="商品组块名称：">
                    <Input type="text" v-model="search.name" placeholder="商品组块名称" class="width-160"
                           @on-enter="handleSearch"/>
                </FormItem>
                <FormItem label="商品类型：">
                    <Select
                        v-model="search.goods_type"
                        class="width-160"
                    >
                        <Option
                            v-for="item in category"
                            :key="item.key"
                            :value="item.key"
                        >
                            {{ item.val }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="创建时间：" style="margin-bottom: 0;">

                        <div class="flex">
                            <FormItem label="" prop="start_time">
                                <DatePicker
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="请选择开始时间"
                                    class="width-170"
                                    v-model="search.start_time"
                                ></DatePicker>
                            </FormItem>
                            <span
                                style="padding-left: 10px;padding-right: 10px;"
                            >
                                    ~
                                </span>
                            <FormItem label="" prop="end_time">
                                <DatePicker
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="请选择结束时间"
                                    class="width-170"

                                    v-model="search.end_time"
                                ></DatePicker>
                            </FormItem>
                        </div>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="table-list" v-loading="table.loading">
            <table-list :category="category" ref="table_list" :data="getTableData" :total="table.total" @on-refresh="getList"
                        @on-page-change="changePage"></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import TableList from "./components/TableList";
import {formatDate ,dealClassifyList} from '@/assets/helpers';
export default {
    name: "list",
    components: {
        TableList
    },
    computed: {
        noManagePerm() { //管理权限
            return !this.$getPermMap('pc.goods-group.manage')
        },
        getTableData() {
            return this.table.data.map(item => {
                item._disabled = this.noManagePerm
                return item
            })
        }
    },
    data() {
        return {
            search: {
                name: '',
                goods_type:'',
                start_time: '',
                end_time: '',
            },
            category: [],//商品类型
            table: {
                data: [],
                loading: false,
                total: 0
            },
            page: {
                pageSize: 10,
                pageNumber: 1
            },
        };
    },
    created() {
        // 获取商品分类
        this.getCategory()
    },
    methods: {
        // 商品分类
        getCategory() {
            this.$api.homeApi.goodsGroupTypes().then((res) => {
                if (res.error === 0) {
                    this.category = dealClassifyList(res.data)
                }
            })
        },

        handleSearch() {
            this.refreshTable();
        },
        // 重置
        handleReset() {
            this.search = {
                name: '',
                goods_type:'',
                start_time: '',
                end_time: ''
            };
            this.refreshTable();
        },
        toAdd() {
            this.$router.push({
                path: "/home/pc/goods/add"
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
                search: this.search,
                page: this.page
            })

            // 重置表格下方
            this.$refs['table_list'].initFooterData();
            this.table.loading = true;
            let search = Object.assign({}, this.search);
            search.start_time =  formatDate( search.start_time,'yyyy-MM-dd hh:mm:ss')
            search.end_time =  formatDate( search.end_time,'yyyy-MM-dd hh:mm:ss')
            let params = Object.assign({
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                pager: 1
            }, search);
            this.$api.homeApi.goodsGroupList(params)
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
        this.$history.setRoute(this.$route).getData(history => {
            let {search, page} = history
            this.search = this.$utils.deepCopy(search) || this.search
            this.page = page;
            this.$nextTick(() => {
                this.refreshTable(this.page);
            })

        })
    }
};
</script>

<style scoped lang="scss">
.good-label {
    background-color: $background-color;
    margin: 20px auto;
    /deep/.search{
        padding-top: 0!important;
    }
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
