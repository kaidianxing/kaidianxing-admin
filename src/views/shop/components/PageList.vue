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
    <div class="shop-page-list">
        <Table :columns="columns" :data="data" v-loading="loading"></Table>
        <div class="footer-page">
            <kdx-page-component ref="page" :total="total" @on-change="handlePageChange"></kdx-page-component>
        </div>
    </div>
</template>

<script>

export default {
    name: 'PageList',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        total: {
            type: Number,
            default: 0
        },
        loading: {
            type: Boolean,
            default: false
        },
        goodsId: {
            type: String,
            default: '0'
        }
    },
    data() {
        return {
            columns: [
                {
                    title: '页面名称',
                    key: 'name',
                    render: (h, params) => {
                        return (
                            <div class="page-title">
                                <span class="title">
                                    {params.row[params.column.key]}
                                </span>
                                <span
                                    class="default"
                                    style={{
                                        display:
                                            params.row.is_default === '1'
                                                ? 'inline-block'
                                                : 'none'
                                    }}
                                >
                                    默认
                                </span>
                            </div>
                        )
                    }
                },
                {
                    title: '页面类型',
                    key: 'type',
                    render: (h, params) => {
                        let iconTemp
                        if (params.row.type == '10') {
                            iconTemp = (
                                <span class="iconfont icon-shouye1"></span>
                            )
                        } else if (params.row.type == '11') {
                            iconTemp = (
                                <span class="iconfont icon-xiangqing"></span>
                            )
                        } else if (params.row.type == '12') {
                            iconTemp = (
                                <span class="iconfont icon-huiyuanzhongxin1"></span>
                            )
                        }

                        if (params.row.type_text) {
                            return (
                                <div class="page-type">
                                    {iconTemp}
                                    <span class="page-name">
                                        {params.row.type_text}
                                    </span>
                                </div>
                            )
                        } else {
                            return <div>-</div>
                        }
                    }
                },
                {
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        let {status, type,status_text} = params.row
                        if (status === '1') {
                            return <kdx-tag-label type="success">应用中</kdx-tag-label>
                        } else {
                            if(type == 0){
                                return <div class="custom-tag">-</div>
                            }
                            return <kdx-tag-label type="disabled">{status_text}</kdx-tag-label>
                        }
                    }
                },
                // {
                //     title: '关键字',
                //     key: 'keywords'
                // },
                {
                    title: '修改时间',
                    key: 'updated_at',
                    render: (h, params) => {
                        if (params.row.updated_at === '0000-00-00 00:00:00') {
                            return <div>{params.row.created_at}</div>
                        } else {
                            return <div>{params.row.updated_at}</div>
                        }
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        let url
                        if (params.row.type == '10') {
                            url = (
                                <kdx-hint-tooltip
                                    type="qrCode"
                                    url={
                                          this.getPreviewUrl(params.row,'page-index','')
                                    }
                                    text="复制页面链接"
                                >
                                    <Button type="text">预览</Button>
                                </kdx-hint-tooltip>
                            )
                        } else if (params.row.type == '11') {
                            url = (
                                <kdx-hint-tooltip
                                    type="qrCode"
                                    url={
                                        this.getPreviewUrl(params.row,'page-detail',this.goodsId)
                                    }
                                    text="复制页面链接"
                                >
                                    <Button type="text">预览</Button>
                                </kdx-hint-tooltip>
                            )
                        } else if (params.row.type == '12') {
                            url = (
                                <kdx-hint-tooltip
                                    type="qrCode"
                                    url={
                                        this.getPreviewUrl(params.row,'page-vip',params.row.id)
                                    }
                                    text="复制页面链接"
                                >
                                    <Button type="text">预览</Button>
                                </kdx-hint-tooltip>
                            )
                        } else if (params.row.type == '20') {
                            url = (
                                <kdx-hint-tooltip
                                    type="qrCode"
                                    url={
                                        this.getPreviewUrl(params.row,'page-commission',params.row.id)
                                    }
                                    text="复制页面链接"
                                >
                                    <Button type="text">预览</Button>
                                </kdx-hint-tooltip>
                            )
                        } else 
                        if (params.row.type == '0') {
                            url = (
                                <kdx-hint-tooltip
                                    type="qrCode"
                                    url = {
                                        this.getPreviewUrl(params.row,'page-custom',params.row.id)
                                    }
                                    text="复制页面链接"
                                >
                                    <Button type="text">预览</Button>
                                </kdx-hint-tooltip>
                            )

                         
                        }

                        let delTemp =
                            params.row.status == '0' ? (
                                <Button
                                    type="text"
                                    onClick={() => {
                                        this.handleDelete(params.row)
                                    }}
                                    disabled={this.noManagePerm}
                                    style={{
                                        display:
                                            params.row.is_used === '1'
                                                ? 'none'
                                                : 'inline-block'
                                    }}
                                >
                                    删除
                                </Button>
                            ) : null
                        return (
                            <div class="action">
                                <Button
                                    type="text"
                                    onClick={() => {
                                        this.editPage(params.row)
                                    }}
                                    disabled={this.noManagePerm}
                                >
                                    编辑
                                </Button>
                                {url}
                                {delTemp}
                            </div>
                        )
                    }
                }
            ]
        }
    },
    computed: {
        noManagePerm() { //管理权限
            return !this.$getPermMap('diypage.page.list.manage')
        },
    },
    methods: {
        handlePageChange(page) {
            this.$emit('on-page-change', page)
        },
        editPage(row) {
            this.$emit('on-edit', row)
        },
        handleDelete(row) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认彻底删除此页面？',
                onOk: () => {
                    this.$api.shopApi
                        .deletePage({ id: row.id, type: row.type })
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('该页面删除成功')
                                this.handleRefresh()
                            }
                        })
                },
                onCancel: () => {}
            })
        },
        handleRefresh() {
            // 页面刷新
            this.$emit('on-refresh')
            this.reset()
        },
        // 重置页码
        reset() {
            this.$refs['page'].reset()
        },
        getPreviewUrl({ id,status},path,pageId) {
            let {addQueryParams, getPreviewUrl} = this.$utils
            let url= getPreviewUrl(path, pageId)

            if(status=='0') {
                url = addQueryParams(url, {previewId: id})
            }
            return url
        }
    }
}
</script>

<style scoped lang="scss">
.shop-page-list {
    background-color: #ffffff;
    padding: 0 20px;
    /deep/ .ivu-table {
        td {
            @include font-14-20;
            word-break: normal;
            // 页面标题
            .page-title {
                > .default {
                    color: $brand-color;
                    background-color: $brand-light;
                    @include font-12-16;
                    padding: 2px 8px;
                    margin-left: 4px;
                }
            }
            // 页面类型
            .page-type {
                .iconfont {
                    border-radius: 100%;
                    color: #ffffff;
                    padding: 4px;
                }
                .iconfont.icon-shouye1 {
                    background-color: $brand-color;
                }
                .iconfont.icon-xiangqing {
                    background-color: $warning-color;
                }
                .iconfont.icon-huiyuanzhongxin1 {
                    background-color: $danger-color;
                }
                .page-name {
                    padding: 0 5px;
                    vertical-align: top;
                }
            }
            // 状态
            .page-status {
                .use {
                    color: $success-color;
                }
            }

           
            .action {
                margin-right: -8px;
                .ivu-btn-text {
                    margin-right: 8px;
                }
            }
            .custom-tag {
                padding: 2px 8px;
            }
        }
        
    }
     
    .footer-page {
        padding: 20px 0;
        display: flex;
        justify-content: center;
    }
}
</style>
