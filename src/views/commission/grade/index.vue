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
    <div class="good-group">
        <kdx-header-bar type="little">
            <template #header>
                    <Button :disabled='noManagePerm' type="primary" to="/commission/grade/add">+添加等级</Button>
            </template>
        </kdx-header-bar>
        <div class="table-list">
            <table-list :data="table.data" :loading="table.loading" @on-refresh="getList"></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import TableList from "./components/TableList";
    export default {
        name: "index",
        components: {
            TableList
        },
        computed:{
            noManagePerm() { //管理权限
                return !this.$getPermMap('commission.level.manage')
            },
        },
        data() {
            return {
                search: {
                    name: ''
                },
                table: {
                    data: [],
                    loading: false
                },
            };
        },
        methods: {
            handleSearch() {
                this.getList()
            },
            handleReset() {
                this.search.name = '';
                this.getList();
            },
            getList() {
                this.table.loading = true;
                let params = Object.assign({
                    page: 1,
                    pager: 0
                }, this.search);
                this.$api.commissionApi.getAgentGradeList(params)
                    .then(res => {
                        this.table.loading = false;
                        if (res.error === 0) {
                            this.table.data = res.list;
                        }
                    }).catch();
            }
        },
        mounted() {
            this.getList();
        }
    };
</script>

<style scoped lang="scss">
    .good-group {
        background-color: $background-color;
        margin: 20px auto;
        .table-list {
            background-color: #ffffff;
            padding: 20px;
        }
    }
</style>
