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
    <div class="shop-custom-menu">
        <search-header @on-change="handleSearch" @choose-temp="chooseTemp"></search-header>
        <div class="menu-list">
            <menu-list ref="table_list" :types="typeList" :total="total" :data="table.data" :loading="table.loading"
                       @on-page-change="changePage" @on-refresh="resetTable"></menu-list>
        </div>
        <select-menu-temp ref="selectMenuTemp" :types="typeList" @choose-type="chooseType"></select-menu-temp>
        <slot></slot>
    </div>
</template>

<script>
    import SearchHeader from "./components/SearchHeader";
    import MenuList from "./components/MenuList";
    import SelectMenuTemp from './components/SelectMenuTemp'

    export default {
        name: "index",
        inject:['returnToTop'],
        components: {
            SearchHeader,
            SelectMenuTemp,
            MenuList
        },
        data() {
            return {
                data: [],
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
                total: 10,
                table: {
                    data: [],
                    loading: false
                },
                search: {},
                typeList: []
            };
        },
        methods: {
            chooseTemp(){
                this.$refs.selectMenuTemp.setValue()
            },
            chooseType(type){
                this.$router.push({
                path: '/decorate/diymenu',
                query: {
                    type
                }
            })
            },
            handleSearch(search) {
                this.search = search;
                this.resetTable();
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            resetTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.$refs['table_list'].reset();
                this.getList();
            },
            getList() {
                this.returnToTop();
                this.table.loading = true;
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                }, this.search);
                this.$api.shopApi.getNewMenuList(params)
                    .then(res => {
                        this.table.loading = false;
                        if (res.error === 0) {
                            this.table.data = res.list || [];
                            this.total = res.total;
                            this.typeList = res.type_list.filter(v=>v.type!='20')
                        }
                    });
            }
        },
        // eslint-disable-next-line no-dupe-keys
        mounted() {
            this.getList();
        }
    };
</script>

<style scoped lang="scss">
    .shop-custom-menu {
        background-color: $background-color;
        margin: 20px auto;
        .menu-list {
            background-color: #ffffff;
            .hint-alert-component {
                padding-top: 20px;
                Button {
                    @include font-12-16;
                }
            }
        }
    }
</style>
