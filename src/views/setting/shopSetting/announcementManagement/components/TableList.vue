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
    <div class="good-list-table-list">
        <Table ref="table" v-loading="loading" :columns="columns" :data="data" @on-selection-change="selectChange" @on-sort-change="changeSort"></Table>
        <div class="footer-action" v-show="data.length > 0">
            <Checkbox v-model="isSelectAll" @on-change="checkboxChange"></Checkbox>
            <Button :disabled="selectDisabled" @click="handlers({type: 'multiple',...getStatusBtnHandlers.data})">{{getStatusBtnHandlers.btn}}</Button>
            <Button :disabled="selectDisabled" @click="handlers({type: 'multiple',content:'确认删除？',api:'deleteGood'})">删除</Button>
            <Button :disabled="selectDisabled" @click="handleBatch">批量分类</Button>
        </div>
        <div class="footer-page">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
        <!--单规格---价格、库存-->
        <edit-information ref="edit_information" :price="information.price" :stock="information.stock" :id="information.id" @on-refresh="handleRefresh"></edit-information>
        <!--批量分类-->
        <batch-classify ref="batch_classify" :current-list="selectRows" @on-refresh="handleRefresh"></batch-classify>
        <!--多规格-->
        <multi-specification ref="multi_specification" :id="multiple.id" @on-refresh="handleRefresh"></multi-specification>
    </div>
</template>

<script>
    import EditInformation from "./EditInformation";
    import BatchClassify from "./BatchClassify";
    import MultiSpecification from "./MultiSpecification";
    export default {
        name: "TableList",
        components: {
            EditInformation,
            BatchClassify,
            MultiSpecification
        },
        props: {
            status: {
                type: [String, Number],
                default: 1
            },
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
                updateShopNameIndex: -1,
                columns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '排序',
                        key: 'sort_by',
                        width: 80
                    },
                    {
                        title: '商品',
                        key: 'shop',
                        minWidth: 300,
                        render: (h, params) => {
                            let label = params.row.category || [];
                            const labelComponent = label.map(item => h('span', {}, item.name));
                            return (
                                <div class="content-box">
                                    {/* image */}
                                    <div class="image">
                                      <img src={this.$media(params.row.thumb)} alt="" onError={e => {this.replaceImage(e)}} />
                                    </div>
                                    {/*商品标题 */}
                                    <div class="content">
                                        <div class="content-text"
                                             style={{display: this.shopName.id === params.row.id ? 'none' : '-webkit-box'}}
                                             onClick={e => {
                                                 this.startUpdateShopName(params.row.id);
                                                 e.stopPropagation();
                                             }}>
                                            {/*1多规格0单规格*/}
                                            <span class="mark"
                                                  style={{display: params.row.has_option === '1' ? 'inline-block' : 'none'}}>多</span>
                                            <span class="text">{params.row.title}</span>
                                        </div>
                                        {/* 商品名称修改*/}
                                        <Input ref="update_name" id={`update_name${params.row.id}`}
                                            style={{display: this.shopName.id === params.row.id ? 'block' : 'none'}}
                                            value={params.row.title} type='textarea' autofocus={true}
                                            onOn-change={e => {
                                                this.changeShopName(e.target.value);
                                            }}
                                            onOn-focus={()=>{
                                                this.changeShopName(params.row.title);
                                            }}
                                            onOn-blur={() => {
                                                this.endUpdateShopName(params.row);
                                            }}></Input>
                                        {/*商品标签 */}
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
                        render: (h, params) => {
                            return (
                                <div class="price">
                                    <span>￥{params.row[params.column.key]}</span>
                                    <span class="iconfont icon-shangpinliebiao-bianji icon" onClick={() => {
                                      this.updateInformation(params.row);
                                    }}></span>
                                </div>
                            );
                        }
                    },
                    {
                        title: '库存',
                        key: 'stock',
                        minWidth: 90,
                        render: (h, params) => {
                            return (
                                <div class="inventory">
                                    <span>{this.formatData(params.row[params.column.key])}</span>
                                    <span class="iconfont icon-shangpinliebiao-bianji icon" onClick={() => {
                                    this.updateInformation(params.row);
                                   }}></span>
                                </div>
                            );
                        }
                    },
                    {
                        title: '实际销量',
                        key: 'real_sales',
                        sortable: 'custom',
                        minWidth: 90,
                        render: (h, params) => {
                            return <div>{params.row.real_sales}</div>;
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'created_at',
                        sortable: 'custom',
                        minWidth: 120,
                        render: (h, params) => {
                            return <p style='word-break:normal'>{params.row.created_at}</p>;
                        }
                    },
                    {
                        title: '营销标签',
                        key: 'marketTag',
                        minWidth: 100,
                        render: (h, params) => {
                            return <div class='market-tag'>
                                <kdx-status-text type={params.row.is_new === '1' ? 'danger' : 'default'}
                                             onClick={() => {
                                                 this.editMarketLabel('is_new', params.row);
                                             }}
                                >新品
                                </kdx-status-text>
                                <kdx-status-text type={params.row.is_hot === '1' ? 'danger' : 'default'}
                                             onClick={() => {
                                                 this.editMarketLabel('is_hot', params.row);
                                             }}
                                >热卖
                                </kdx-status-text>
                                <kdx-status-text type={params.row.is_recommand === '1' ? 'danger' : 'default'}
                                             onClick={() => {
                                                 this.editMarketLabel('is_recommand', params.row);
                                             }}
                                >推荐
                                </kdx-status-text>
                            </div>;
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        minWidth: 150,
                        render: (h, params) => {
                            let data={id: params.row.id, type: 'single',...this.getStatusBtnHandlers.data}
                            let component;
                            if (this.status != '4') {
                                component = (
                                    <kdx-hint-tooltip type="qrCode" url={this.$utils.getPreviewUrl('goods', params.row.id)} text="复制商品链接">
                                        <Button type="text">预览</Button>
                                    </kdx-hint-tooltip>
                                )
                            }
                            return (
                                <div class="action">
                                    <Button type='text' onClick={() => {this.handlers(data);}}>{this.getStatusBtnHandlers.btn}</Button>
                                    <Button type='text' onClick={() => {this.handleEdit(params.row);}}>编辑</Button>
                                    {component}
                                    <Button type='text' onClick={() => {
                                        this.handlers({
                                            type: 'single',
                                            id: params.row.id,
                                            content:'确认删除此商品？',
                                            api:this.status==4?'foreverDel':'deleteGood'
                                        });
                                    }}>删除</Button>
                                </div>
                            );
                        }
                    }
                ],
                selectRows: [], // 选中项
                isSelectAll: false,
                information: {
                    price: '',
                    stock: '',
                    id: ''
                },
                // 多规格
                multiple: {
                    id: ''
                },
                // 商品名称
                shopName: {
                    id: -1,
                    name: ''
                }
            };
        },
        computed: {
            getStatusBtnHandlers(){
                let btn='';
                let data={}
                if(this.status == 1||this.status == 2){
                    btn = '下架'
                    data={
                        content:'确认下架?',
                        api:'batchSoldOut'
                    }
                }else if(this.status == 3){
                    btn = '上架'
                    data={
                        content:'确认上架?',
                        api:'launch'
                    }
                }else if(this.status == 4){
                    btn = '恢复'
                    data={
                        content:'确认恢复?',
                        api:'recover'
                    }
                }
                return {
                    btn,data
                }
            },
            // 下方按钮是否可操作
            selectDisabled() {
                return this.selectRows.length === 0;
            }
        },
        methods: {
            // 批量分类
            handleBatch() {
                this.$refs['batch_classify'].setValue();
            },
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
            // 商品标题修改
            startUpdateShopName(id) {
                this.shopName.id = id;
                this.$nextTick(() => {
                    document.getElementById(`update_name${id}`).getElementsByTagName('textarea')[0].focus();
                })
            },
            changeShopName(val) {
                this.shopName.name = val;
            },
            // 修改商品标题
            endUpdateShopName(row) {
                this.shopName.id = -1;
                this.$api.goodsApi.editGoodAttribute({
                        id: row.id,
                        field: 'title',
                        value: this.shopName.name
                    })
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('商品名称修改成功');
                            this.$emit('on-refresh');
                            this.initFooterData();
                        }
                    });
            },
            // 修改价格、库存
            updateInformation(row) {
                // 单规格
                if (row.has_option === '0') {
                    this.information.price = row.price;
                    this.information.stock = row.stock;
                    this.information.id = row.id;
                    this.$nextTick(() => {
                        this.$refs['edit_information'].setValue();
                    });
                } else if (row.has_option === '1') {
                    // 多规格
                    this.multiple.id = row.id;
                    this.$nextTick(() => {
                        this.$refs['multi_specification'].setValue();
                    });
                }
            },
            // 营销标签点击事件
            editMarketLabel(field, row) {
                let value = row[field] === '0' ? '1' : '0';
                this.$api.goodsApi.editGoodAttribute({
                        id: row.id,
                        field,
                        value
                    })
                    .then(res => {
                        if (res.error === 0) {
                            this.$emit('on-refresh');
                            this.initFooterData();
                        }
                    });
            },
            handlers({
                type,
                id,
                content,
                api
            }) {
                let ids = []
                if (type === 'single') {
                    ids = [id];
                } else if (type === 'multiple') {
                    ids = this.selectRows.map(item => item.id);
                }
                this.$Modal.confirm({
                    title: '提示',
                    content,
                    onOk: () => {
                        this.$api.goodsApi[api]({
                                id: ids
                            })
                            .then(res => {
                                if (res.error === 0) {
                                    this.handleRefresh();
                                }
                            });
                    },
                    onCancel: () => {}
                });
            },
            // 编辑
            handleEdit(row) {
                this.$router.push({
                    path: '/goods/add',
                    query: {
                        id: row.id
                    }
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
                        width: 0;
                        flex: 1;
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
                                margin-right: 10px;
                                width: 18px;
                                height: 18px;
                                text-align: center;
                                line-height: 18px;
                            }
                            .text {
                                @include font-14-20;
                            }
                        }
                        .label {
                           // margin-bottom: -10px;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
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
