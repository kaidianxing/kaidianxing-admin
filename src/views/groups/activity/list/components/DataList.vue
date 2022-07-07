<template>
    <kdx-modal-frame
        :value="value"
        title="活动数据"
        :width="1000"
        :loading="loading"
        @on-cancel="handleCancel"
    >
        <div class="content">
            <Table :columns="columns" :data="data">
                <template slot-scope="{ row }" slot="goods">
                    <div class="goods">
                        <img
                            class="goods-thumb"
                            :src="$media(row.thumb)"
                            alt=""
                            @error="replaceImage"
                        />
                        <div>
                            <div class="two-line-hide goods-title">
                                {{ row.title }}
                            </div>
                            <div class="goods-options" v-if="row.option_title">
                                {{ row.option_title }}
                            </div>
                        </div>
                    </div>
                </template>
            </Table>
        </div>
        <template #footer>
            <kdx-page-component
                ref="page"
                :total="total"
                @on-change="handlePageChange"
                limit-default
            ></kdx-page-component>
        </template>
    </kdx-modal-frame>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            total: 0,
            page: {
                pageNumber: 1,
                pageSize: 10,
            },
            columns: [
                {
                    title: "商品",
                    key: "",
                    slot: "goods",
                    width: 295,
                },
                {
                    title: "已售出数量",
                    key: "order_count",
                },
                {
                    title: "成交金额",
                    key: "pay_price",
                },
                {
                    title: "退款金额",
                    key: "refund_price",
                },
                {
                    title: "销售数量",
                    key: "total",
                },
                {
                    title: "参与人数",
                    key: "member_count",
                },
            ],
            data: [],
            loading: false,
            value: false
        };
    },
    methods: {
        setValue() {
          this.value = !this.value;
          if (this.value) {
              this.getList();
          }
        },
        getList() {
            this.loading = true;
            let params = {
                page: this.page.pageNumber,
                pagesize: this.page.pageSize,
                id: this.id,
            };
            this.$api.groupsApi.getGroupsActivityListData(params).then((res) => {
                if (res.error === 0) {
                    this.data = res.list;
                    this.total = res.total;
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        handleCancel() {
            this.setValue();
        },
        handlePageChange(page) {
            this.page = page;
            this.getList();
        },
    },
};
</script>

<style lang="scss" scoped>
.content {
    padding: 0 20px 0;
    max-height: calc(100vh - 110px - 160px - 75px);
    .goods {
        display: flex;
        .goods-thumb {
            display: block;
            margin-right: 10px;
            border: 1px solid #e9edef;
            box-sizing: border-box;
            border-radius: 2px;
            width: 60px;
            height: 60px;
            flex-shrink: 0;
        }

        .goods-title {
            @include font-multiple-omit(2);
            font-size: 14px;
            line-height: 20px;
            color: #262b30;
            height: 40px;
        }

        .goods-options {
            padding: 2px 8px;
            position: relative;
            display: inline-block;
            border-radius: 2px;
            box-sizing: border-box;
            color: #2d8cf0;
            background-color: #f0faff;
            font-size: 12px;
            line-height: 16px;
        }
    }
}
</style>
