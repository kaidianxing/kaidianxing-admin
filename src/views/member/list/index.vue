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
    <div class="vip-list">
        <search-header
                ref="search"
                :group_id="search.group_id"
                :level_id="search.level_id"
                :groups="groups"
                :levels="levels"
                @on-search="handleSearch"
                @on-export="handleExport"
                @refreshTable="refreshTable"></search-header>
        <div class="table-list" v-loading="loading">
        <table-list ref="tabList"
                    :list="data"
                    :total="page.total"
                    :groupList="groups"
                    :levelList="levels"
                    @getList="getList"
                    @on-page-change="changePage">
        </table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import SearchHeader from "./components/SearchHeader";
    import TableList from "./components/TableList";
    import {formatDate} from '@/assets/helpers';
    // import qs from 'qs'
    import { memberApi } from '@/api/member'
    import { Export } from '@/helpers/export';

    export default {
        name: "index",
        inject:['returnToTop'],
        components: {
            SearchHeader,
            TableList
        },
        props: {},
        data() {
            return {
                data: [],
                groups: [],
                levels: [],
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
                search: {
                    registerTime: [],
                    group_id: '',
                    level_id: '',
                    keyword: '',
                    source: 'all',
                    is_black: '',
                },
                loading: false
            }
        },
        computed: {},
        created() {
        },
        mounted() {
            this.$history.setRoute(this.$route).getData(history=>{
                this.search=history.search||{
                    registerTime: [],
                    group_id: '',
                    level_id: '',
                    keyword: '',
                    source: 'all',
                    is_black: '',
                }
                this.page = this.$utils.deepCopy(history.page)||{
                    pageSize: 10,
                    pageNumber: 1
                }

                            
                if (this.$route.query.group_id) {
                    this.search.group_id = this.$route.query.group_id
                }
                if (this.$route.query.level_id) {
                    this.search.level_id = this.$route.query.level_id
                }
                this.$nextTick(() => {
                    this.$refs.search.handleReset(this.search,this.page);
                })
            })
            
        },
        methods: {
            getList() {
                this.returnToTop();
                this.loading = true;
                let obj = {
                    ...this.search,
                    source: this.search.source == 'all'?'':this.search.source,
                    level_id: this.search.level_id == 'all'?'':this.search.level_id,
                    group_id: this.search.group_id == 'all'?'':this.search.group_id,
                    is_black: this.search.is_black == 'all'?'':this.search.is_black,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                };
          
                
                if (this.search.registerTime.length == 2 && this.search.registerTime[0] && this.search.registerTime[1]) {
                    obj.start_time = formatDate(this.search.registerTime[0], 'yyyy-MM-dd hh:mm:ss');
                    obj.end_time = formatDate(this.search.registerTime[1], 'yyyy-MM-dd hh:mm:ss');
                    
                }      
                this.$history.setData({
                    search:{
                        ...this.search, 
                        registerTime:[obj.start_time, obj.end_time ].filter(item => item)
                    },
                    page:this.page
                });
                delete obj.registerTime;      
                this.$api.memberApi.memberList(obj).then(res => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.data = res.list;
                        this.groups = res.groups; // 标签组列表
                        this.levels = res.levels; // 会员组列表
                        this.page.total = res.total;
                    }
                })
            },
            refreshTable(value,page) {
                if (value) {
                    this.search = value
                }
                if(page) {
                    this.$refs.tabList.reset(page)
                }
                this.page = {
                    pageSize: 10,
                    pageNumber: 1,
                    ...page
                };
                this.getList();
            },
            handleSearch(value,page) {
                console.log(value,':::::::::::',page)
                this.search = value;
                this.refreshTable();
            },
            handleExport() {
                let params = {
                    export: 1,
                    ...this.search,
                    source: this.search.source == 'all'?'':this.search.source,
                    level_id: this.search.level_id == 'all'?'':this.search.level_id,
                    group_id: this.search.group_id == 'all'?'':this.search.group_id,
                    is_black: this.search.is_black == 'all'?'':this.search.is_black,
                    start_time: formatDate(this.search.registerTime[0], 'yyyy-MM-dd hh:mm:ss'),
                    end_time: formatDate(this.search.registerTime[1], 'yyyy-MM-dd hh:mm:ss'),
                };
                // let data = qs.stringify(params);
                // window.open(
                //     `${window.config.base_url}${memberApi.memberList.api}&${data}`
                // )

                Export(memberApi.memberList.api, params);
            },
            changePage(page) {
                this.page = page;
                this.getList();
            }
        }
    };
</script>

<style scoped lang="scss">
    .vip-list {
        margin: 20px auto;
        background-color: $background-color;
        .table-list {
            background-color: #ffffff;
            padding: 0 20px;
            margin-top: 10px;
            border-radius: 2px;
            position: relative;
        }
    }
</style>
