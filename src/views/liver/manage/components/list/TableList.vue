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
        class="liver-table-list"
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
                    title: 'ID',
                    key: 'id',
                    minWidth: 60,
                    width: 60
                },
                {
                    title: '直播间信息',
                    key: 'shop',
                    minWidth: 280,
                    render: (h, params) => {
                        return (
                            <div class="content-box">
                                {/* image */}
                                <div class="image">
                                    <img src={this.$utils.getWechatImg(params.row.share_img)} alt="" onError={e => { this.replaceImage(e) }} />
                                </div>
                                {/*商品标题 */}
                                <div class="two-line-hide content-text">{params.row.title}</div>
                            </div>
                        );
                    }
                },
                {
                    title: '主播昵称',
                    key: 'anchor_name',
                    minWidth: 140,
                    render: (h, params) => {
                        return <div class="content">
                            <div class="two-line-hide content-text">{params.row.anchor_name}</div>
                        </div>
                    },
                },
                {
                    title: '直播状态',
                    key: 'status',
                    minWidth: 100,
                    render: (h, params) => {
                        let statusInfo = {
                            '101': { text: '直播中', status: 'pending' },
                            '102': { text: '未开始', status: 'wait' },
                            '103': { text: '已结束', status: 'complete' },
                            '104': { text: '禁播', status: 'complete' },
                            '105': { text: '暂停', status: 'complete' },
                            '106': { text: '异常', status: 'lose' },
                            '107': { text: '已过期', status: 'lose' },
                        }

                        return (
                            <div class={'liver-status ' + statusInfo[params.row.status]?.status || 'wait'}>{statusInfo[params.row.status]?.text}</div>
                        )
                    },
                },
                {
                    title: '开播时间',
                    key: 'start_time',
                    minWidth: 110,
                },
                {
                    title: '结束时间',
                    key: 'end_time',
                    minWidth: 110,
                },
                {
                    title: '商品数量',
                    minWidth: 84,
                    render: (h, params) => {
                        return <div>{params.row.goods_count}</div>
                    },
                },
                {
                    title: '状态',
                    minWidth: 60,
                    render: (h, params) => {
                        return <div class={'status-text', params.row.is_hide == '1' ? 'on' : 'off'}> {params.row.is_hide == '1' ? '隐藏' : '显示'}</div>
                    },
                },
                {
                    title: '操作',
                    key: 'action',
                    minWidth: 190,
                    render: (h, params) => {
                        let showTemp, startTemp, operateTemp;

                        if (params.row.is_hide === '1') {
                            showTemp = <Button type='text' disabled={this.noManagePerm} onClick={() => { this.handleHide(params.row.id, '0'); }}>显示</Button>
                        } else {
                            showTemp = <Button type='text' disabled={this.noManagePerm} onClick={() => { this.handleHide(params.row.id, '1'); }}>隐藏</Button>
                        }

                        if (params.row.status == '102' && params.row.broadcast_type == '0') {
                            startTemp = <Button type='text' disabled={this.noManagePerm} onClick={() => { this.handleEdit(params.row, '0'); }}>开播码</Button>
                        }

                        if (params.row.status == '102'  && params.row.broadcast_type == '1') {
                            startTemp = <Button type='text' disabled={this.noManagePerm} onClick={() => { this.handleRecommand(params.row); }}>推流地址</Button>
                        }

                        if (params.row.status == '101' || params.row.status == '102') {
                            operateTemp = <Button type='text' disabled={this.noManagePerm} onClick={() => { this.handleOperate(params.row.id); }}>运营</Button>
                        }


                        return (
                            <div class="action">
                                <div>
                                    <Button type='text' disabled={this.noManagePerm} onClick={() => { this.handleDetail(params.row.id) }}>详情</Button>
                                    {showTemp}
                                    <Button type='text' disabled={this.noManagePerm} onClick={() => { this.handleEdit(params.row, '1'); }}>分享</Button></div>
                                <div>
                                    {operateTemp}
                                    {startTemp}
                                </div>
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
        noManagePerm() { //管理权限
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
        // 编辑
        handleEdit({ id, title, broadcast_room_id }, type) {
            this.$emit('on-codeImg', {
                room_id: id,
                broadcast_room_id,
                title,
                type
            })

        },
        handleRecommand() {
            this.$Modal.info({
                title: '操作',
                render: () => {
                    return (<div>
                        <span>小程序暂未开放小程序推流地址，如需获取推流地址</span>
                        <br />
                        请<span class="link-url" onClick={()=>this.goWechat()}>点击获取</span>。
                                </div>)
                }
            });
        },
        handleHide(room_id, is_hide) {
            let text = is_hide == '1' ? '隐藏' : '显示'
            this.$Modal.confirm({
                title: '提示',
                content: `确定要${text}直播间？`,
                onOk: () => {
                    this.$api.liverApi.hideLiver({
                        room_id, is_hide
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
        handleDetail(id) {
            this.$router.push({
                path: '/liver/action/detail',
                query: { id }
            })
        },
        handleOperate(id) {
            this.$router.push({
                path: '/liver/action/operate',
                query: { id }
            })
        },
        goWechat() {
            window.open('https://mp.weixin.qq.com/')
        }
    }
};
</script>

<style lang="scss" scoped>
.liver-table-list {
    position: relative;
    padding: 0 20px;
    background-color: #fff;
    border-radius: 2px;
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

        td {
            .content-box {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                .image {
                    width: 100px;
                    height: 80px;
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
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
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
                    background: #fff1f2;
                    color: #ff1f2c;
                }

                &.complete {
                    background: #fff9e6;
                    color: #ff9900;
                }

                &.lose {
                    background: #f4f6f8;
                    color: #939799;
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
.link-url {
    color: $brand-color;
    font-weight: bold;
    cursor: pointer;
}
</style>
