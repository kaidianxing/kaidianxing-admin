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
        title="分销商等级"
        :width="700"
        @on-ok="handleOk"
        @on-cancel="handleCancel"
    >
        <div class="level-selector">
            <!-- <div class="search">
                <Input
                    v-model="search.content"
                    search
                    enter-button="搜索"
                    placeholder="请输入"
                    @on-search="handleSearch"
                    class="width-250"
                />
            </div> -->
            <Table
                ref="table"
                :columns="columns"
                :data="data"
                v-loading="loading"
            ></Table>
            <div class="footer-page" v-show="total > 10">
                <kdx-page-component
                    ref="page"
                    :total="total"
                    @on-change="handlePageChange"
                ></kdx-page-component>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
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
        // 分销商返回不启用
        status: {
            type: Number
        },
    },
    data() {
        return {
            value: false,
            search: {
                content: '',
            },
            columns: [
                {
                    title: '等级权重',
                    key: 'level',
                    render: (h, params) => {
                        if (params.row.is_default == '1') {
                            return (
                                <div>默认</div>
                            );
                        } else {
                            let data = ['一','二','三','四','五','六','七','八','九','十',];
                            return (
                                <div>{data[parseInt(params.row.level)-1]}级</div>
                            );
                        }
                    }
                },
                {
                    title: '分销商等级',
                    key: 'name',
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 80,
                    render: (h, params) => {
                        return (
                            <div class="action">
                                <Button
                                    class="default-primary"
                                    style={{
                                        display: params.row.checked
                                            ? 'none'
                                            : 'block',
                                    }}
                                    onClick={() => {
                                        this.setChecked(params.index, true)
                                    }}
                                >
                                    选择
                                </Button>
                                <Button
                                    type="primary"
                                    style={{
                                        display: params.row.checked
                                            ? 'block'
                                            : 'none',
                                    }}
                                    onClick={() => {
                                        this.setChecked(params.index, false)
                                    }}
                                >
                                    已选
                                </Button>
                            </div>
                        )
                    },
                },
            ],
            data: [],
            total: 0,
            page: {
                pageSize: 20,
                pageNumber: 1,
            },
            selectRow: {},
            selectRows: [],
            loading: false,
        }
    },
    computed: {
        levelList() {
            return this.data.map((item) => {
                return item.name.indexOf(this.search.content) > -1
            })
        },
    },
    methods: {
        // 进行弹窗打开和关闭
        setValue() {
            console.log(this.status,'this.status>>>>>');
            this.value = !this.value
            if (this.value) {
                this.resetSearch()
                // 进行数据加载以及选中初始化
                this.resetPage()
                this.getList()
            }
        },
        handleSearch() {
            this.search = { ...this.search }
            this.resetPage()
            this.getList()
        },
        resetSearch() {
            this.search.content = ''
            this.search.status = ''
        },
        resetPage() {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
            }
            this.$refs['page']?.reset()
        },
        // 选择、取消选择
        setChecked(index, isChecked) {
            if (this.multiple) {
                this.$set(this.data[index], 'checked', isChecked)
                // 多选
                if (this.selectRows.length === 0) {
                    this.selectRows.push(this.data[index])
                } else {
                    if (isChecked) {
                        this.selectRows.push(this.data[index])
                    } else {
                      this.selectRows =this.selectRows.filter(item=> item.id!==this.data[index].id)
                    }
                }
            } else {
                this.data.forEach((item, i) => {
                    this.$set(this.data[i], 'checked', false)
                })
                this.$set(this.data[index], 'checked', isChecked)
                if (isChecked) {
                    this.selectRow = this.data[index]
                } else {
                    this.selectRow = {}
                }
                this.$emit('on-change', this.selectRow)
            }
        },
        // 进行默认选中
        defaultChecked() {
            if (this.multiple) {
                this.selectRows = JSON.parse(JSON.stringify(this.currentList))
                this.data.forEach((item, index) => {
                    for (let current of this.currentList) {
                        if (current.id === item.id) {
                            this.$set(this.data[index], 'checked', true)
                            break
                        }
                    }
                })
            } else {
                this.selectRow = this.current
                this.data.forEach((item, index) => {
                    if (this.current && item.id === this.current.id) {
                        this.$set(this.data[index], 'checked', true)
                    } else {
                        this.$set(this.data[index], 'checked', false)
                    }
                })
            }
        },
        // 页码改变
        handlePageChange(page) {
            this.page = page
            this.getList()
        },
        handleOk() {
            if (this.multiple) {
                this.$emit('on-change', this.selectRows)
                this.$emit('change', this.selectRows)
            } else {
                this.$emit('on-change', this.selectRow)
                this.$emit('change', this.selectRow)
            }
            this.setValue()
        },
        handleCancel() {
            this.setValue()
        },
        getList() {
            this.loading = true
            let params = Object.assign(
                {
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                },
                this.search
            )
            if(this.status) {
                params.status = this.status
            } else {
                delete params.status
            }
            this.$api.commissionApi.levelList(params).then((res) => {
                if (res.error === 0) {
                    this.data = res.list
                    this.total = res.total
                    this.defaultChecked()
                    this.loading = false
                }
            })
        },
    },
}
</script>

<style scoped lang="scss">
.level-selector {
    padding: 20px;
    > .search {
        display: flex;
        padding-bottom: 20px;
    }
    /deep/ .ivu-table {
        .ivu-table-cell {
            padding: 10px 15px;
        }
    }
    .footer-page {
        padding-top: 20px;
        padding-bottom: 0;
        display: flex;
        justify-content: center;
    }
}
</style>
