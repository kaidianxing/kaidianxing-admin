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
        title="修改上级分销商?"
        :width="700"
        @on-ok="handleOk"
        @on-cancel="handleCancel"
    >
        <div class="level-selector">
            <div class="level-selector-content" ref='scrollBox'>
                <div class="search">
                    <Input
                            v-model="search.keyword"
                            search
                            enter-button="搜索"
                            placeholder="请输入"
                            @on-search="handleSearch"
                            class="width-250"
                    />
                </div>
                <Table
                        ref="table"
                        :columns="columns"
                        :data="data"
                        v-loading="loading"
                ></Table>
            </div>
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
        basicInfo: {
            type: Object,
            default: () => ({}),
        },
        info: {
            type: Object,
            default: () => ({}),
        },
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
        // 是否手动关闭弹窗
        close: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            value: false,
            search: {
                keyword: '',
            },
            columns: [
                {
                    title: '分销商',
                    key: 'nickname',
                    minWidth: 200,
                    render: (h, params) => {
                        // 用户来源 10: h5;20: 微信公众号;21: 微信小程序;30:头条小程序;31:抖音小程序;5:支付宝小程序;
                        let component;
                        if (params.row.source == '20') {
                            // 公众号
                            component = (
                                <span class="iconfont icon-weixin icon"></span>
                            );
                        } else if (params.row.source == '21') {
                            // 微信小程序
                            component = (
                                <span class="iconfont icon-weixinxiaochengxu icon"></span>
                            );
                        }
                        else if (params.row.client_type == '30') {
                            // 头条小程序 字节跳动小程序
                            component = (
                                <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2"></kdx-svg-icon>
                            );
                        }
                        else if (params.row.client_type == '32') {
                            // 头条小程序 字节跳动小程序
                            component = (
                                <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban"></kdx-svg-icon>
                            );
                        }
                        else if (params.row.client_type == '31') {
                            // 抖音小程序 字节跳动小程序
                            component = (
                                <kdx-svg-icon class="iconfont" type="icon-douyin"></kdx-svg-icon>
                            );
                        } 
                        // else if (params.row.source == '5') {
                        //     // 支付宝小程序
                        //     component = (
                        //         <span class="iconfont icon-zhifubaoxiaochengxu icon"></span>
                        //     );
                        // }
                        else if (params.row.source == '10') {
                            // h5
                            component = (
                                <span class="iconfont icon-H icon"></span>
                            );
                        }
                        else if (params.row.source == '70') {
                            // pc
                            component = (
                                <span style="color:#12aa9c;font-size:14px" class="iconfont icon-PCduan icon"></span>
                            );
                        }
                        return (
                            <div class="vip-info">
                                <div class="user-image">
                                    <img src={this.$media(params.row.avatar)} alt="" onError={e => {
                                        this.replaceImage(e, 'avatar');
                                    }}/>
                                </div>
                                <div class="vip-content">
                                    <p class="vip-name">
                                        {params.row.nickname}
                                    </p>
                                    <div class="vip-platform">
                                        {component}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                },
                {
                    title: '分销商等级',
                    key: 'commission_level_name',
                    minWidth: 100,
                    render: (h, params) => {
                        if (params.row[params.column.key]) {
                            return (
                                <div class="vip-grade">
                                    <div class="icon">
                                        <kdx-svg-icon type="icon-fenxiaoshang-bg"></kdx-svg-icon>
                                    </div>
                                    <div class="text">{params.row[params.column.key]}</div>
                                </div>
                            )
                        } else {
                            return (
                                <div>-</div>
                            )
                        }
                    }
                },
                {
                    title: '手机号',
                    key: 'mobile',
                    minWidth: 100,
                    render: (h, params) => {
                        if (params.row[params.column.key]) {
                            return (
                                <div>{params.row[params.column.key]}</div>
                            )
                        } else {
                            return (
                                <div>-</div>
                            )
                        }
                    }
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

    methods: {
        // 进行弹窗打开和关闭
        setValue(value) {
            this.value = value || !this.value
            if (this.value) {
                // 进行数据加载以及选中初始化
                this.resetSearch()
                this.resetPage()
                this.getList()
            }
        },
        handleSearch() {
            this.resetPage()
            this.getList()
        },
        resetSearch() {
            this.search = {
                keyword: '',
            }
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
                // 单选不能取消选中
                if (!isChecked) {
                    return
                }
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
                this.selectRows = this.currentList
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
            try {
                this.$refs.scrollBox.scrollTop=0
            }catch (e) {
                console.log(e)
            }
        },
        handleOk() {
            if (this.multiple) {
                this.$emit('on-change', this.selectRows)
                this.$emit('change', this.selectRows)
            } else {
                this.$emit('on-change', this.selectRow)
                this.$emit('change', this.selectRow)
            }
            if (!this.close) {
                this.setValue()
            }
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
                    keyword: this.search.keyword,
                },
                this.search
            )
            this.$api.commissionApi.distributorList(params).then((res) => {
                if (res.error === 0) {
                    if (!this.search.keyword && this.info.agent_info.status == 1) {
                        res.list.unshift({
                            member_id: '0',
                            nickname: '总店',
                        })
                    }
                    res.list = res.list.filter((item) => {
                        return item.member_id !== this.basicInfo.member.id
                    })
                    this.data = res.list.map((item) => {
                        item.id = item.member_id
                        return item
                    })
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
    >.level-selector-content {
        max-height: calc(100vh - 110px - 160px - 75px);
        padding: 20px;
        overflow-y: auto;
        > .search {
            display: flex;
            padding-bottom: 20px;
        }
        /deep/ .ivu-table {
            .ivu-table-cell {
                padding: 10px 15px;
            }
            td {
                // 会员
                .vip-info {
                    display: flex;
                    flex-wrap: nowrap;
                    > .user-image {
                        width: 46px;
                        height: 46px;
                        > img {
                            width: 100%;
                            height: 100%;
                            border-radius: 100%;
                        }
                    }
                    > .vip-content {
                        padding-left: 10px;
                        > .vip-name {
                            width: 100%;
                            padding-bottom: 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        > .vip-platform {
                            > .platform-icon {
                                font-size: 16px;
                                border-radius: 100%;
                            }
                            .icon-weixin {
                                color: $success-color;
                            }
                            .icon-weixinxiaochengxu {
                                color: #677DE0;
                            }
                            .icon-toutiaoxiaochengxu {
                                color: #239BFF;
                            }

                            .icon-zhifubaoxiaochengxu {
                                color: #2094E7;
                            }

                            .icon-baiduxiaochengxu {
                                color: #306CFF;
                            }

                            .icon-H {
                                color: #FF6004;
                            }
                        }
                    }
                }
                // 分销商等级
                .vip-grade {
                    display: flex;
                    flex-wrap: nowrap;
                    .icon {
                        flex-shrink: 0;
                        .svg-icon {
                            font-size: 20px;
                            padding-right: 4px;
                            vertical-align: bottom;
                        }
                    }
                    .text {
                        width: 0;
                        flex: 1;
                    }
                }
            }
        }
    }
    .footer-page {
        padding: 10px 0;
        display: flex;
        justify-content: center;
        border-top: 1px solid $border-color;
    }
}
</style>
