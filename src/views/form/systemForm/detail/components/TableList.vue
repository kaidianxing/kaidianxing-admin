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
    <div class="system-form-detail">
        <Table ref="table" :columns="columns" :data="data"  @on-selection-change="selectChange"></Table>
        <div class="footer-action" v-show="data.length > 0">
            <Checkbox v-model="isSelectAll" :disabled='noManagePerm' @on-change="checkboxChange"></Checkbox>
            <Button :disabled="selectDisabled" @click="handleBatch">批量删除</Button>
        </div>
        <div class="footer-page" v-show="total > 10">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
        <preview-img :imgList="previewImages || []" :currentIndex="current" v-show="imgModal"
                     @on-close="previewImg(false)"/>
        <bargaining-modal v-if="type!='order' && bargainingData" :value="value" :bargainingData="bargainingData" @on-cancel="modalCancel"></bargaining-modal>
    </div>
</template>

<script>
    import PreviewImg from '@/components/PreviewImg';
    import BargainingModal from "./BargainingModal";
    export default {
        name: "EvaluateList",
        components: {
            PreviewImg,
            BargainingModal,
        },
        props: {
            data: {
                type: Array,
                default: () => []
            },
            total: {
                type: Number,
                default: 0
            },
            type: {
                type: String
            }
        },
        data() {
            return {
                orderColumns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center',
                    },
                    {
                        title: '表单数据ID',
                        key: 'id',
                        width: 120
                    },
                    {
                        title: '表单名称',
                        key: 'name',
                    },
                    {
                        title: '表单类型',
                        key: 'type',
                        render: (h, params) => {
                            if (params.row[params.column.key] == 1) {
                                return (
                                    <kdx-tag-label type="info">下单信息</kdx-tag-label>
                                )
                            }
                        }
                    },
                    {
                        title: '订单编号',
                        key: 'order_no',
                    },
                    {
                        title: '提交会员',
                        key: 'nickname',
                        render: (h, params) => {
                            return (
                                <div class="vip-name line-hide" onClick={() => {this.routerVipPath(params.row)}}>
                                    {params.row[params.column.key] || '-'}
                                </div>
                            );
                        }
                    },
                    {
                        title: '会员ID',
                        key: 'member_id',
                        minWidth: 60,
                        maxWidth: 100,
                    }, {
                        title: '提交时间',
                        key: 'created_at',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        minWidth: 100,
                        maxWidth: 120,
                        render: (h, params) => {
                            // 需要添加订单状态进入相应的订单详情页
                            return (<div class='action-btn'>
                                <Button type='text' class="del-btn" onClick={()=> {this.handleDel(params.row)}}>删除</Button>
                                <Button type="text" onClick={()=>{this.routerOrder(params.row)}}>查看详情</Button>
                            </div>)
                        }
                    }
                ],
                otherColumns: [
                     {
                        type: 'selection',
                        width: 40,
                        align: 'center',
                    },
                    {
                        title: '表单数据ID',
                        key: 'id',
                        width: 120
                    },
                    {
                        title: '表单名称',
                        key: 'name',
                    },
                    {
                        title: '表单类型',
                        key: 'type',
                        render: (h, params) => {
                            if (params.row[params.column.key] == 1) {
                                return (
                                    <kdx-tag-label type="info">下单信息</kdx-tag-label>
                                )
                            }
                        }
                    },
                    {
                        title: '提交会员',
                        key: 'nickname',
                        render: (h, params) => {
                            return (
                                <div class="vip-name line-hide" onClick={() => {this.routerVipPath(params.row)}}>
                                    {params.row[params.column.key] || '-'}
                                </div>
                            );
                        }
                    },
                    {
                        title: '会员ID',
                        key: 'member_id',
                        minWidth: 60,
                        maxWidth: 100,
                    }, {
                        title: '提交时间',
                        key: 'created_at',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        minWidth: 100,
                        maxWidth: 120,
                        render: (h, params) => {
                            let btnTemp = <Button type="text" onClick={()=>{this.routerVipPath(params.row)}}>查看详情</Button>
                            if(params.row.type == 2) {
                                btnTemp =  <Button type="text" onClick={()=>{this.routerCommissionPath(params.row)}}>查看详情</Button>
                            }
                                return (<div class='action-btn'>
                                    <Button type='text'  class="del-btn" onClick={()=> {this.handleDel(params.row)}}>删除</Button>
                                   {btnTemp}
                                </div>)

                        }
                    }
                ],
                goodsColumns: [
                     {
                        type: 'selection',
                        width: 40,
                        align: 'center',
                    },
                    {
                        title: '表单数据ID',
                        key: 'id',
                        width: 120
                    },
                    {
                        title: '表单名称',
                        key: 'name',
                    },
                    {
                        title: '表单类型',
                        key: 'type',
                        render: (h, params) => {
                            if (params.row[params.column.key] == 1) {
                                return (
                                    <kdx-tag-label type="info">下单信息</kdx-tag-label>
                                )
                            }
                        }
                    },
                    {
                        title: '应用商品',
                        key: 'location',
                        render: (h, params) => {
                            return (
                                <div class="shop">
                                    <div class="shop-image">
                                        <img src={this.$media(params.row.thumb)} alt="" onError={e => {
                                            this.replaceImage(e);
                                        }}/>
                                    </div>
                                    <div class="shop-information">
                                        <p class=" title two-line-hide">
                                            {params.row.title}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    },
                    {
                        title: '提交会员',
                        key: 'nickname',
                        render: (h, params) => {
                            return (
                                <div class="vip-name line-hide" onClick={() => {this.routerVipPath(params.row)}}>
                                    {params.row[params.column.key] || '-'}
                                </div>
                            );
                        }
                    },
                    {
                        title: '会员ID',
                        key: 'member_id',
                        minWidth: 60,
                        maxWidth: 100,
                    }, {
                        title: '提交时间',
                        key: 'created_at',
                    },
                    {
                        title: '订单编号',
                        key: 'order_no',
                        render: (h, params) => {
                            return (<div class="action">
                                {params.row[params.column.key] || '-'}
                            </div>)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        minWidth: 100,
                        maxWidth: 120,
                        render: (h, params) => {
                            // 需要添加订单状态进入相应的订单详情页
                            return (<div class='action-btn'>
                                <Button type='text' class="del-btn" onClick={()=> {this.handleDel(params.row)}}>删除</Button>
                                <Button type="text" onClick={()=>{this.routerOrder(params.row)}}>查看详情</Button>
                            </div>)
                        }
                    }
                ],
                columns: [],
                selectRows: [],
                isSelectAll: false,
                previewImages: [],
                imgModal: false,
                current: 0,
                value: true, //价格面议弹窗
                bargainingData: '', // 议价表单信息
            };
        },
        computed:{
            noManagePerm(){//无管理权限
                return !this.$getPermMap('form.manage')
            },
            // 下方按钮是否可操作
            selectDisabled() {
                return this.selectRows.length === 0;
            }
        },
        mounted() {
            const typeOption = {
                order: 'orderColumns',
                vip: 'otherColumns',
                commission: 'otherColumns',
                goods: 'goodsColumns',
            }
            this.columns = this[typeOption[this.type]];
        },
        methods: {
            // 重置页码
            reset() {
                this.$refs['page'].reset();
                this.selectRows = [];
                this.isSelectAll = false;
            },
            changePage(page) {
                this.$emit('on-page-change', page);
            },
            routerVipPath(row) {
                this.$utils.openNewWindowPage('/member/detail', {id: row.member_id, form_id: row.id});
            },
            routerCommissionPath(row) {
                let id = row.member_id,
                    type = 'commission';
                this.$utils.openNewWindowPage('/member/detail', {id, type});
            },
            routerOrder(row) {
                let {status, id} = row;
                let path = "";
                if(row.source==2) {
                    this.value = true;
                    this.bargainingData = JSON.parse(row.content)
                    return
                }
                if (status == "10" || status == "11") {
                    path = "/order/detail/send";
                } else if (status == "0") {
                    path = "/order/detail/payment";
                } else if (status == "20") {
                    path = "/order/detail/receive";
                } else if (status == "30") {
                    path = "/order/detail/achieve";
                } else if (status == "-1") {
                    path = "/order/detail/close";
                }
                console.log('order+++', id, status, path, row)
                if (row.type == 4) {
                    this.$utils.openNewWindowPage(path, {id: row.order_id, goods_id: row.goods_id});
                } else {
                    this.$utils.openNewWindowPage(path, {id: row.order_id});
                }
            },
            previewImg(status, index, data = []) {
                this.previewImages = data || [];
                if (index) {
                    this.current = index
                }
                this.imgModal = status
            },
            // 选中项发生变化
            selectChange(selection) {
                this.selectRows = selection;
                this.isSelectAll = this.selectRows.length === this.data.length;
            },
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
            // 批量删除
            handleBatch() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '删除后所选数据不可恢复,确认删除？',
                    onOk: () => {
                        let ids = this.selectRows.map(v=> v.id)
                        this.submitDel({ids})
                    }
                });
            },
            // 单个删除
            handleDel(row){
                this.$Modal.confirm({
                    title: '提示',
                    content: '删除后所选数据不可恢复,确认删除？',
                    onOk: () => {
                       this.submitDel({id:row.id})
                    }
                });
            },
            submitDel(params){
                let newParams = {
                    form_id: this.$route.query.id,
                    ...params
                }
                this.$api.formApi.removeFormData(newParams).then(res=> {
                    if(res.error == 0){
                        this.selectRows = []
                        this.isSelectAll = false
                        this.$Message.success('操作成功');
                        this.$emit('on-refresh')
                     }
                })
            },
            modalCancel() {
                this.value = false
            }
        }
    };
</script>

<style scoped lang="scss">
    .system-form-detail {
        /deep/ .ivu-table {
            .ivu-table-body {
                margin-bottom: -1px;
            }
            td {
                // 提交会员
                .vip-name {
                    color: $brand-color;
                    cursor: pointer;
                }

                // 商品信息
                 .shop {
                    display: flex;
                    flex-wrap: nowrap;
                     align-items: center;

                    > .shop-image {
                        width: 60px;
                        height: 60px;
                        margin-right: 10px;
                        box-sizing: border-box;
                        border: 1px solid $border-color;
                        border-radius: 2px;
                        overflow: hidden;
                        flex-shrink: 0;

                        > img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    > .shop-information {
                        flex: 1;
                        width: 0;
                        height: 100%;
                        > .title {
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                            height: 40px;
                            word-break: break-all;
                        }

                        > .shop-label {
                            color: #197BE1;
                            @include font-12-16;

                            > span {
                                background-color: $brand-light;
                                border-radius: 2px;
                                padding: 2px 8px;
                            }
                        }
                    }
                }

                .action-btn {
                    display:flex;

                    .del-btn {
                        margin-right: 10px;
                    }
                }
            }
        }
        .footer-page {
            border-top: 1px solid $border-color;
        }
    }
</style>
