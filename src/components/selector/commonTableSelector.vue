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
    <kdx-modal-frame
        v-model="value"
        :title="title"
        :width="850"
        @on-ok="handleOk"
        @on-cancel="handleCancel"
    >
        <div class="vip-label-selector">
            <div class="vip-label-selector-content" ref="scrollBox">
                <div class="search" v-if="selfShowSearch">
                    <Input
                        v-model="search[searchWord]"
                        search
                        enter-button="搜索"
                        placeholder="请输入"
                        @on-search="handleSearch"
                        class="width-250"
                    />
                    <div v-if="needSelect">
                        <span class="label">优惠券类型：</span>
                        <Select
                            v-model="search.coupon_sale_type"
                            @on-change="handleSearch"
                            class="width-160"
                        >
                            <Option value="">全部</Option>
                            <Option value="1">满减券</Option>
                            <Option value="2">折扣券</Option>
                        </Select>
                    </div>
                </div>
                <Table
                    ref="table"
                    :columns="selfColumns"
                    :data="selfData"
                    v-loading="selfLoading"
                ></Table>
            </div>
            <div class="footer-page" v-show="selfTotal > 10">
                <kdx-page-component
                    ref="page"
                    :total="selfTotal"
                    @on-change="handlePageChange"
                ></kdx-page-component>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: "VipGradeSelector",
    props: {
        current: {
            type: [String, Object],
            default: () => {},
        },
        currentList: {
            type: Array,
            default: () => [],
        },
        // 是否多选
        multiple: {
            type: Boolean,
            default: false,
        },
        //显示搜索框
        showSearch: {
            type: Boolean,
            default: false,
        },
        //标题
        title: {
            type: String,
            default: "",
        },
        //表格列
        columns: {
            type: Array,
            default: () => [],
        },
        //表格数据
        data: {
            type: Array,
            default: () => [],
        },
        //总条数
        total: {
            type: Number,
            default: 0,
        },
        //加载状态
        loading: {
            type: Boolean,
            default: false,
        },
        //显示下拉列表
        needSelect: {
            type: Boolean,
            default: false,
        },
        //选择上限
        selectLimit: {
            type: Number,
            default: 0,
        },
        //默认搜索的字段
        searchWord: {
            type: String,
            default: "keyword",
        },
    },
    data() {
        return {
            value: false,
            search: {
                [this.searchWord]: "",
                coupon_sale_type: "",
            },
            commonColumns: [
                {
                    title: "操作",
                    key: "action",
                    width: 80,
                    render: (h, params) => {
                        return (
                            <div class="action">
                                <Button
                                    class="default-primary"
                                    style={{
                                        display: params.row.checked
                                            ? "none"
                                            : "block",
                                    }}
                                    onClick={() => {
                                        this.setChecked(params.index, true);
                                    }}
                                >
                                    选择
                                </Button>
                                <Button
                                    type="primary"
                                    style={{
                                        display: params.row.checked
                                            ? "block"
                                            : "none",
                                    }}
                                    onClick={() => {
                                        this.setChecked(params.index, false);
                                    }}
                                >
                                    已选
                                </Button>
                            </div>
                        );
                    },
                },
            ],
            selfData: [],
            page: {
                pageSize: 10,
                pageNumber: 1,
            },
            selectRow: {},
            selectRows: [],
            selfShowSearch: true,
            selfTitle: "",
            selfTotal: null,
            selfLoading: false,
        };
    },
    computed: {
        selfColumns() {
            return this.columns.concat(this.commonColumns);
        },
    },
    methods: {
        // 进行弹窗打开和关闭
        setValue() {
            this.value = !this.value;
            if (this.value) {
                if (this.multiple) {
                    this.selectRows = [...this.currentList] || [];
                } else {
                    this.selectRow = { ...this.current };
                }
                // 进行数据加载以及选中初始化
                this.resetSearch();
                this.resetPage();
                this.getList();
            }
        },
        handleSearch() {
            this.resetPage();
            this.getList();
        },
        resetSearch() {
            this.search = {
                keyword: "",
            };
        },
        resetPage() {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
            };
            this.$refs["page"]?.reset();
        },
        // 选择、取消选择
        setChecked(index, isChecked) {
            if (this.multiple) {
                // 多选
                if (isChecked) {
                    if (this.selectLimit && this.selectRows.length >= this.selectLimit) {
                        this.$Message.error("单次最多选择10张");
                        return;
                    }else {
                        this.selectRows.push(this.selfData[index]);
                    }
                } else {
                    this.selectRows = this.selectRows.filter(
                        item => item.id !== this.selfData[index].id
                    );
                }

                if (
                    this.selfData[index].selectChild === void 0 ||
                    typeof this.selfData[index].selectChildIndex == "number"
                ) {
                    this.$set(this.selfData[index], "checked", isChecked);
                }

                if (
                    this.selfData[index].selectChild !== void 0 &&
                    this.selfData[index].selectChildIndex === ""
                ) {
                    this.$emit("selectChildren", this.selfData[index], index);
                    return
                }

            } else {
                this.selfData.forEach((item, i) => {
                    this.$set(this.selfData[i], "checked", false);
                });
                this.$set(this.selfData[index], "checked", isChecked);
                if (isChecked) {
                    this.selectRow = this.selfData[index];
                } else {
                    this.selectRow = {};
                }
            }
        },
        // 进行默认选中
        defaultChecked() {
            if (this.multiple) {
                console.log(this.selectRows);
                this.selfData.forEach((item, index) => {
                    for (let current of this.selectRows) {
                        if (current.id === item.id) {
                            this.$set(this.selfData[index], "checked", true);
                            this.$set(
                                this.selfData[index],
                                "selectChild",
                                current.selectChild
                            );
                            this.$set(
                                this.selfData[index],
                                "selectChildIndex",
                                current.selectChildIndex
                            );
                            this.$set(
                                this.selfData[index],
                                "selectChildren",
                                current.selectChildren
                            );
                            break;
                        }
                    }
                });
            } else {
                this.selfData.forEach((item, index) => {
                    if (this.selectRow && item.id === this.selectRow.id) {
                        this.$set(this.selfData[index], "checked", true);
                    } else {
                        this.$set(this.selfData[index], "checked", false);
                    }
                });
            }
        },
        // 页码改变
        handlePageChange(page) {
            this.page = page;
            try {
                this.$refs.scrollBox.scrollTop = 0;
            } catch (e) {
                console.log(e);
            }
            this.getList();
        },
        handleOk() {
            if (this.multiple) {
                this.$emit("on-change", this.selectRows);
            } else {
                this.$emit("on-change", this.selectRow);
            }
            this.value = false;
            // this.setValue();
        },
        handleCancel() {
            this.setValue();
        },
        getList() {
            this.selfLoading = true;
            let params = Object.assign(
                {
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                },
                this.search
            );
            this.$emit("getList", params);
            // this.$api.memberApi.getGroupList(params).then(res => {
            //   if (res.error === 0) {
            //     this.data = res.list;
            //     this.total = res.total;
            //     this.defaultChecked();
            //     this.loading = false;
            //   }
            // });
        },
    },
    watch: {
        showSearch(val) {
            this.selfShowSearch = val;
        },
        data(val) {
            this.selfData = val;
            this.defaultChecked();
        },
        total(val) {
            this.selfTotal = val;
        },
        loading(val) {
            this.selfLoading = val;
        },
    },
};
</script>
<style scoped lang="scss">
.label {
    display: inline-block;
    width: 100px;
    padding-top: 6px;
    text-align: right;
    color: $text-first;
    @include font-14-20;
}
.vip-label-selector {
    > .vip-label-selector-content {
        max-height: calc(100vh - 110px - 160px - 75px);
        padding: 20px;
        overflow-y: auto;
        > .search {
            display: flex;
            padding-bottom: 20px;
        }
    }
    .footer-page {
        background-color: #ffffff;
        padding: 10px 0;
        display: flex;
        justify-content: center;
        border-top: 1px solid $border-color;
    }
}
@media only (max-width: 1550px) {
    .vip-label-selector {
        > .vip-label-selector-content {
            max-height: calc(100vh - 110px - 80px - 75px);
        }
    }
}
</style>
