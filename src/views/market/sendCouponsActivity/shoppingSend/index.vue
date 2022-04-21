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
    <div class="market-send-coupons-activity-shopping-send">
        <div class="add-activity">
            <Button type="primary" to="/market/coupons/send/shop/add">+添加购物送券</Button>
        </div>
        <div class="full-send-list" v-loading="table.loading">
            <shopping-send-list :data="table.data" :total="table.total" :loading="table.loading"
                                @on-page-change="changePage" @on-refresh="refreshTable" @on-sort="handleSort"></shopping-send-list>
        </div>
    </div>
</template>

<script>
    import ShoppingSendList from "./components/ShoppingSendList";

    export default {
        name: "index",
        components: {ShoppingSendList},
        data() {
            return {
                table: {
                    data: [],
                    total: 0,
                    loading: false
                },
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
              sort: {}
            };
        },
        methods: {
            // list
            getList() {
                this.table.loading = true;
                let params = {
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                  ...this.sort
                };
                this.$api.marketApi.getShopSendList(params)
                    .then(res => {
                        this.table.loading = false;
                        if (res.error === 0) {
                            this.table.data = res.list;
                            this.table.total = res.total;
                        }
                    });
            },
          handleSort(sort) {
            this.sort = sort;
            this.refreshTable();
          },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.getList();
            },
            changePage(page) {
                this.page = page;
                this.getList();
            }
        },
        mounted() {
            this.refreshTable();
        }
    };
</script>

<style scoped lang="scss">
    .market-send-coupons-activity-shopping-send {
        padding: 0 20px;

        .add-activity {
            padding: 0 30px 30px 10px;
            border-bottom: 1px solid $border-color;
        }
        .full-send-list {
            position: relative;
        }
    }
</style>
