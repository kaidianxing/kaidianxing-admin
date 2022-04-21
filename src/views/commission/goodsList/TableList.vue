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
    <div class="good-list-table-list" v-loading="loading">
        <Table ref="table" :columns="columns" :data="getTableData" @on-selection-change="selectChange" @on-sort-change="changeSort"></Table>
        <div class="footer-action" v-show="data.length > 0">
            <Checkbox v-model="isSelectAll" :disabled="noManagePerm" @on-change="checkboxChange"></Checkbox>
            <Button :disabled="selectDisabled||noManagePerm" @click="handleEdit(selectRows)">不参与分销</Button>
        </div>
        <div class="footer-page" v-show="total > 10">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
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
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '商品',
                        key: 'shop',
                        minWidth: 260,
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
                                      <img src={this.$media(params.row.thumb)} alt="" onError={e => {this.replaceImage(e)}} />
                                    </div>
                                    {/*商品标题 */}
                                    <div class="content">
                                        <div class="content-text"
                                             style={{display: this.shopName.id === params.row.id ? 'none' : '-webkit-box'}}>
                                            {/*1多规格0单规格*/}
                                            <span class="mark" style={{display: params.row.has_option === '1' ? 'inline-block' : 'none'}}>多</span>
                                            <span class={getType.goodsName}>
                                                { getType.goodsText}
                                            </span>
                                            <span class="text">{params.row.title}</span>
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
                        minWidth: 100,
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
                        title: '佣金',
                        key: 'commission',
                        minWidth: 150,
                        render: (h, params) => {
                            if (params.row.commission) {
                                return (
                                    <div class="inventory">
                                        <kdx-status-text type='warning'>{params.row.commission}</kdx-status-text>
                                    </div>
                                );
                            } else {
                                return (
                                    <div>-</div>
                                )
                            }
                        }
                    },
                    {
                        title: '库存',
                        key: 'stock',
                        minWidth: 90,
                        maxWidth: 200,
                        sortable: 'custom',
                        render: (h, params) => {
                            let stock = params.row.type == '3' ? '-' : this.formatData(params.row.stock)
                            return (
                                <div class="inventory">
                                    <span>{stock}</span>
                                </div>
                            );
                        }
                    },
                    {
                        title: '销量',
                        key: 'real_sales',
                        minWidth: 90,
                        maxWidth: 200,
                        sortable: 'custom',
                        render: (h, params) => {
                            return <div>{params.row.real_sales}</div>;
                        }
                    },
                    {
                        title: '商品状态',
                        key: 'status',
                        minWidth: 100,
                        maxWidth: 200,
                        render: (h, params) => {
                            const status={
                                0:{text:'',type:''},
                                1:{text:'上架',type:'success'},
                                2:{text:'售磬',type:'danger'},
                                3:{text:'下架',type:'warning'},
                                4:{text:'回收站',type:'disabled'}
                            }
                            return <p style='word-break:normal'>
                                <kdx-status-text type={status[params.row.status].type}>{status[params.row.status].text}</kdx-status-text>
                            </p>;
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        minWidth: 120,
                        maxWidth: 220,
                        render: (h, params) => {
                            return (
                                <div class="action">
                                    <Button type='text' disabled={this.noManagePerm} onClick={() => {this.handleEdit(params.row.id);}}>不参与分销</Button>
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
                return !this.$getPermMap('commission.goods.manage')
            },
            getTableData(){
                return this.data.map(item=>{
                    item._disabled=this.noManagePerm;
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
            handleEdit(ids) {
                 this.$Modal.confirm({
                    title: '提示',
                    content:'确定不参与分销？',
                    onOk: () => {
                        this.$api.commissionApi.setGoodCommissionStatus({
                            id: ids instanceof Array ? ids.map(item=>item.id):ids
                        }).then(res=>{
                            if(res.error == 0){
                                this.handleRefresh()
                            }
                        })
                    },
                    onCancel: () => {}
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
            formatData(data) {
                if (parseInt(data) < 9999) {
                    return data;
                } else {
                    return `9999+`;
                }
            },
            // 初始化下方的checkbox
            initFooterData() {
                this.isSelectAll = false;
                this.selectRows = [];
            },
            // 排序
            changeSort({key, order}) {
              if (order === 'normal') {
                this.$emit('on-sort', {});
              } else {
                this.$emit('on-sort', {sort: key, by: order});
              }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .good-list-table-list {
        position: relative;
        /deep/ .ivu-table {
            td {
                .content-box {
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    .image {
                        width: 80px;
                        height: 80px;
                        margin-right: 10px;
                        border: 1px solid $border-color;
                        overflow: hidden;
                        border-radius: 2px;
                        box-sizing: border-box;
                        flex-shrink: 0;
                        &>img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .content {
                        width: 100%;
                        .content-text {
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 3;
                            overflow: hidden;
                            height: 60px;
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
                                    background-color: #F0FAFF;
                                    color: $brand-color;
                                }
                                &.virtual {
                                    background-color: #E6FFF9;
                                    color: #00C5C5;
                                }
                                &.secret {
                                    background-color: #FFCDD0;
                                    color: #FF000F;
                                }
                            }
                            .text {
                                @include font-14-20;
                            }
                        }
                        .label {
                           // margin-bottom: -10px;
                            >span {
                                border-radius: 2px;
                                background-color: $background-color;
                                @include font-12-16;
                                margin-right: 10px;
                                color: $text-second;
                                display: inline-block;
                                height: 20px;
                                line-height: 20px;
                                padding: 0 8px;
                            }
                        }
                    }
                } // 价格
                .price {
                    color: $text-first;
                    @include font-14-20-bold;
                    .icon {
                        display: none;
                        cursor: pointer;
                        font-size: 24px;
                        vertical-align: middle;
                        font-weight: normal;
                    }
                    &:hover {
                        >.icon {
                            display: inline-block;
                        }
                    }
                } // 库存
                .inventory {
                    .icon {
                        display: none;
                        cursor: pointer;
                        font-size: 24px;
                        vertical-align: middle;
                    }
                    &:hover {
                        >.icon {
                            display: inline-block;
                        }
                    }
                }
                .market-tag {
                    .status-text {
                        padding-right: 8px;
                        cursor: pointer;
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
        .footer-page {
            border-top: 1px solid $border-color;
        }
    } // 预览
    .table-list-poptip {
        text-align: center;
        >img {
            width: 150px;
            height: 150px;
        }
        .text {
            @include font-12-16;
            color: $text-second;
            padding-top: 10px;
        }
        .ivu-btn-text {
            @include font-12-16;
        }
    }
</style>
