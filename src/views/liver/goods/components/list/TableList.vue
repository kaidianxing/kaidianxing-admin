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
    <div
        class="good-list-table-list"
        v-loading="loading"
    >
        <Table
            ref="table"
            :columns="columns"
            :data="getTableData"
            @on-selection-change="selectChange"
            @on-sort-change="changeSort"
        ></Table>
        <div class="footer-page">
            <kdx-page-component
                ref="page"
                :total="total"
                @on-change="changePage"
            ></kdx-page-component>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
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
        }
    },
    data() {
        return {
            columns: [
                {
                    title: '商品信息',
                    key: 'shop',
                    minWidth: 300,
                    render: (h, params) => {
                        let label = params.row.label || [];
                        const labelComponent = label.map(item => h('span', {}, item.name));
                        let getType;
                        switch (params.row.type) {
                            case '0':
                                getType = {
                                    goodsName : 'mark real',
                                    goodsText : '实'
                                }
                                break;

                            case '1':
                                getType = {
                                    goodsName : 'mark virtual',
                                    goodsText : '虚'
                                }
                                break;

                            case '2':
                                getType = {
                                    goodsName: 'mark secret',
                                    goodsText: '密'
                                }
                                break;
                        }
                        return (
                            <div class="content-box">
                                {/* image */}
                                <div class="image">
                                    <img src={this.$media(params.row.thumb)} alt="" onError={e => { this.replaceImage(e) }} />
                                </div>
                                {/*商品标题 */}
                                <div class="content">
                                    <div class="content-text two-line-hide">
                                        {/*1多规格0单规格*/}
                                        <span class="mark" style={{ display: params.row.has_option === '1' ? 'inline-block' : 'none' }}>多</span>
                                        <span class={getType.goodsName}>
                                            { getType.goodsText}
                                        </span>
                                        <span class="text">{params.row.title}</span>
                                        <kdx-copy-text text={params.row.title}>
                                            <span class="copy-title">
                                                复制
                                            </span>
                                        </kdx-copy-text>
                                    </div>
                                    <p class="label">{labelComponent}</p>
                                </div>
                            </div>
                        );
                    }
                },
                {
                    title: '价格',
                    key: 'price',
                    minWidth: 110,
                    sortable: 'custom',
                    render: (h, params) => {
                        return (
                            <div class="price">
                                <span>￥{params.row.price}</span>
                            </div>
                        );
                    }
                },
                {
                    title: '库存',
                    key: 'stock',
                    minWidth: 80,
                    sortable: 'custom',
                    render: (h, params) => {
                        return (
                            <div class="inventory">
                                <span>{this.formatData(params.row.stock)}</span>
                            </div>
                        );
                    }
                },
                {
                    title: '销量',
                    minWidth: 80,
                    sortable: 'custom',
                    render: (h, params) => {
                        return <div>{this.formatData(params.row.real_sales)}</div>;
                    }
                },
                {
                    title: '页面路径',
                    key: 'linkurl',
                    minWidth: 180,
                    render: (h, params) => {
                        return <div>
                            <span>{`kdxGoods/detail/index?goods_id=${params.row.goods_id}`} </span>
                            <kdx-copy-text text={`kdxGoods/detail/index?goods_id=${params.row.goods_id}`}>
                                <span class="copy-title">复制</span>
                            </kdx-copy-text>
                        </div>
                    },
                },
                {
                    title: '商品状态',
                    key: 'status',
                    minWidth: 80,
                    render: (h, params) => {
                        const status = {
                            0: { text: '', type: '' },
                            1: { text: '出售中', type: 'success' },
                        }

                        return <p style='word-break:normal'>
                            <kdx-status-text type={status[params.row.status].type}>{status[params.row.status].text}</kdx-status-text>
                        </p>;
                    }
                },
                {
                    title: '审核状态',
                    minWidth: 80,
                    render: (h, params) => {
                        const status = {
                            0: { text: '未审核', type: 'disabled' },
                            1: { text: '审核中', type: 'success' },
                            2: { text: '审核通过', type: 'danger' },
                            3: { text: '审核驳回', type: 'warning' },
                        }
                        return (
                            <div class="action">
                                <kdx-status-text
                                    type={status[params.row.bro_goods_status]?.type || 'disabled'}>
                                    {status[params.row.bro_goods_status]?.text || '未入库'}
                                </kdx-status-text>
                            </div>
                        );
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    minWidth: 80,
                    render: (h, params) => {
                        let btnTemp;
                        if (!params.row.bro_goods_status) {
                            btnTemp = <Button type='text' disabled={this.noManagePerm} onClick={() => { this.submitApply(params.row.goods_id); }}>提交审核</Button>
                        }
                        else if (params.row.bro_goods_status == '1' || params.row.bro_goods_status == '0') {
                            btnTemp = <Button type='text' disabled={this.noManagePerm} onClick={() => { this.handleReset(params.row); }}>撤回审核</Button>
                        } else if (params.row.bro_goods_status == '2') {
                            btnTemp = <Button type='text' disabled={this.noManagePerm} onClick={() => { this.handleDelete(params.row.broadcast_goods_id) }}>删除商品</Button>
                        } else if (params.row.bro_goods_status == '3') {
                            btnTemp = <Button type='text' disabled={this.noManagePerm} onClick={() => { this.handleRepeat(params.row.broadcast_goods_id); }}>重新提交</Button>
                        }
                        return (
                            <div class="action">
                                {btnTemp}
                            </div>
                        );
                    }
                }
            ],
            selectRows: [], // 选中项
            isSelectAll: false,
            // 商品名称
            shopName: {
                id: -1,
                name: ''
            }
        };
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap('broadcast.manage')
        },
        getTableData() {
            return this.data.map(item => {
                item._disabled = this.noManagePerm;
                return item;
            })
        },
        // 下方按钮是否可操作
        selectDisabled() {
            return this.selectRows.length === 0;
        }
    },
    methods: {
        // 选中项发生变化
        selectChange(selection) {
            this.selectRows = selection;
            this.isSelectAll = this.selectRows.length === this.data.length;
        },
        // 表格下方全选按钮
        checkboxChange(status) {
            this.data.forEach((item, index) => {
                this.$set(this.data[index], '_checked', status);
            });
            if (status) {
                this.selectRows = this.data;
            } else {
                this.selectRows = [];
            }
        },
        submitApply(goods_id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定提交审核吗？',
                onOk: () => {
                    this.$api.liverApi.addAduit({
                        goods_id
                    }).then(res => {
                        if (res.error == 0) {
                            this.$Message.success('操作成功')
                            this.handleRefresh()
                        }
                    })
                },
                onCancel: () => { }
            });

        },
        // 编辑
        handleReset({ broadcast_goods_id, audit_id }) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要撤销审核？',
                onOk: () => {
                    this.$api.liverApi.resetAduit({ broadcast_goods_id, audit_id }).then(res => {
                        if (res.error == 0) {
                            this.$Message.success('操作成功')
                            this.handleRefresh()
                        }
                    })
                },
                onCancel: () => { }
            });

        },
        handleRepeat(broadcast_goods_id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要重新审核？',
                onOk: () => {
                    this.$api.liverApi.repeatAudit({ broadcast_goods_id }).then(res => {
                        if (res.error == 0) {
                            this.$Message.success('操作成功')
                            this.handleRefresh()
                        }
                    })
                },
                onCancel: () => { }
            });

        },
        handleDelete(broadcast_goods_id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定删除该商品？',
                onOk: () => {
                    this.$api.liverApi.deleteLiverGoods({ broadcast_goods_id }).then(res => {
                        if (res.error == 0) {
                            this.$Message.success('操作成功')
                            this.handleRefresh()
                        }
                    })
                },
                onCancel: () => { }
            });

        },
        handleRefresh() {
            // 页面刷新
            this.$emit('on-refresh');
            this.initFooterData();
            this.reset();
        },
        // 重置页码
        reset() {
            this.$refs['page'].reset();
        },
        changePage(page) {
            this.$emit('on-page-change', page);
            this.initFooterData();
        },
        // 初始化下方的checkbox
        initFooterData() {
            this.isSelectAll = false;
            this.selectRows = [];
        },
        // 排序
        changeSort({ key, order }) {
            if (order === 'normal') {
                this.$emit('on-sort', {});
            } else {
                this.$emit('on-sort', { sort: key, by: order });
            }
        },
        formatData(data) {
            if (parseInt(data) < 9999) {
                return data;
            } else {
                return `9999+`;
            }
        },
    }
};
</script>

<style lang="scss" scoped>
.good-list-table-list {
    position: relative;
    background-color: #fff;
    padding: 0 20px;
    /deep/ .ivu-table {
        min-width: 1200px;

        .ivu-table-header {
            .ivu-table-cell {
                padding: 22px 0 22px 20px !important;
            }
        }
        .ivu-table-cell {
            padding: 16px 0 16px 20px !important;
        }

        .ivu-table-row:hover {
            .copy-title {
                display: block;
            }
        }

        .copy-title {
            display: none;
            margin-left: 10px;
            cursor: pointer;
            color: $brand-color;
        }

        td {
            .content-box {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                .image {
                    width: 78px;
                    height: 78px;
                    margin-right: 10px;
                    border: 1px solid $border-color;
                    overflow: hidden;
                    border-radius: 2px;
                    box-sizing: border-box;
                    flex-shrink: 0;
                    & > img {
                        width: 100%;
                        height: 100%;
                    }
                }

                .content {
                    width: 100%;
                    .content-text {
                        height: 60px;
                        .text {
                            @include font-14-20;
                        }

                        .mark {
                            @include font-12-16;
                            color: #ed4014;
                            background-color: #ffefe6;
                            border-radius: 2px;
                            margin-right: 4px;
                            width: 18px;
                            height: 18px;
                            display: inline-block;
                            text-align: center;
                            line-height: 18px;
                            &:nth-last-child(2) {
                                margin-right: 6px;
                            }
                            &.real {
                                background-color: #f0faff;
                                color: $brand-color;
                            }
                            &.virtual {
                                background-color: #e6fff9;
                                color: #00c5c5;
                            }
                            &.secret {
                                background-color: #FFCDD0;
                                color: #FF000F;
                            }
                        }
                    }
                }
            }

            .liver-status {
                display: inline-block;
                border-radius: 2px;
                padding: 0 8px;
                height: 24px;
                font-size: 14px;
                text-align: center;
                line-height: 24px;

                &.pending {
                    background: #edfff3;
                    color: #19be6b;
                }

                &.wait {
                    background: #f4f6f8;
                    color: #939799;
                }

                &.complete {
                    background: #fff9e6;
                    color: #ff9900;
                }
            }

            .status-text {
                font-size: 14px;
                line-height: 20px;

                &.on {
                    color: #262b30;
                }

                &.off {
                    color: #939799;
                }
            }

            .action {
                margin-right: -8px;
                .ivu-btn-text {
                    margin-right: 8px;
                }
            }
        }
    }
   
}
</style>
