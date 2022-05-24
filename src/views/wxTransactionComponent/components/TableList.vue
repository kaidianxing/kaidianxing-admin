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
    <div class="table-list">
        <Table ref="tab" :columns="columns" :data="data" v-loading="loading">
            <template #goods="{row}">
                <div class="goods">
                    <div class="image">
                        <img :src="$utils.media(row.thumb)" alt="" @error="replaceImage">
                    </div>
                    <div class="content">
                        <span class="mark more" v-if="1 === +row.has_option">多</span>
                        <span class="mark" :class="goodsType(row.type).goodsName">{{ goodsType(row.type).goodsText }}</span>
                        {{ row.title }}
                    </div>
                </div>
            </template>
            <template #price="{row}">
                <div class="price">
                    {{ 0 === +row.has_option ? `￥${row.price}` : `￥${row.min_price} ~ ￥${row.max_price}` }}
                </div>
            </template>
            <template #status="{row}">
                <kdx-tag-label :type="option.status[row.goods_status].type">{{ option.status[row.goods_status].title }}</kdx-tag-label>
            </template>
            <template #audit_status="{row}">
                <kdx-status-text :type="option.auditStatus[row.wx_status].type">{{
                        option.auditStatus[row.wx_status].title
                    }}
                </kdx-status-text>
            </template>
            <template #action="{row}">
                <div class="action">
                    <Button type="text" data-type="submit" v-if="20 !== +row.wx_status" :disabled="noManagePerm " @click="submitAudit(row)">提交审核
                    </Button>
<!--                    <Button type="text" data-type="recall" v-else @click="recallAudit(row)">撤回审核</Button>-->
                    <template v-if="row.wx_status == '30'">
                        <Button type="text" data-type="sold" v-if="2 === +row.wx_remote_status" :disabled="noManagePerm" @click="handleSold(row, 1)">视频号中下架</Button>
                        <Button type="text" data-type="sold" v-else-if="1 === +row.wx_remote_status" :disabled="noManagePerm " @click="handleSold(row, 2)">视频号中上架</Button>
                        <Button type="text" data-type="update" :disabled="noManagePerm" @click="handleUpdate(row)">免审核更新</Button>
                    </template>
                    <Button type="text" data-type="delete" :disabled="noManagePerm" @click="handleDelete(row)">删除</Button>
                    <Button type="text" :disabled="noManagePerm" @click="handleDetail(row)">查看</Button>
                </div>
            </template>
        </Table>
        <div class="footer-page" v-show="total > 10">
            <kdx-page-component :current='current' :pageSize='pageSize' ref="page" :total="total"
                            @on-change="changePage"></kdx-page-component>
        </div>
        <edit-information ref="edit_information" :model_type="info.modelType" :price="info.price"
                          :stock="info.stock" :id="info.goodsId" is-external
                          @on-refresh="updateInfo"
        ></edit-information>
        <multi-specification ref="mult_spec" is-external :model_type="info.modelType" :id="info.goodsId" @on-refresh="updateInfo"></multi-specification>
    </div>
</template>

<script>
import EditInformation from "@/views/goods/list/components/EditInformation";
import MultiSpecification from "@/views/goods/list/components/MultiSpecification";

export default {
    name: "TableList",
    components: {
        EditInformation,
        MultiSpecification
    },
    props: {
        data: {
            type: Array,
            default: () => []
        },
        // 每页多少条
        pageSize: {
            type: Number,
            default: 10
        },
        // 当前页码
        current: {
            type: Number,
            default: 1
        },
        total: {
            type: Number,
            default: 0
        },
        loading: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            columns: [
                {
                    title: 'ID',
                    width: 60,
                    key: 'id'
                },
                {
                    title: '商品',
                    slot: 'goods',
                    minWidth: 100
                },
                {
                    title: '分类',
                    key: 'category_name'
                },
                {
                    title: '价格',
                    slot: 'price'
                },
                {
                    title: '库存',
                    key: 'stock'
                },
                {
                    title: '商品状态',
                    slot: 'status'
                },
                {
                    title: '提交时间',
                    key: 'create_time'
                },
                {
                    title: '审核状态',
                    slot: 'audit_status'
                },
                {
                    title: '操作',
                    slot: 'action'
                }
            ],
            option: {
                status: {
                    1: {
                        title: '出售中',
                        type: 'success'
                    },
                    // 0: {
                    //     title: '已下架',
                    //     type: 'danger'
                    // },
                    2: {
                        title: '已售罄',
                        type: 'danger'
                    },
                    3: {
                        title: '仓库中',
                        type: 'warning'
                    },
                    4: {
                        title: '回收站',
                        type: 'disabled'
                    }
                },
                auditStatus: {
                    '20': {
                        title: '审核中',
                        type: 'warning'
                    },
                    '30': {
                        title: '审核成功',
                        type: 'success'
                    },
                    '10': {
                        title: '审核撤销',
                        type: 'info'
                    },
                    '40': {
                        title: '审核失败',
                        type: 'danger'
                    }
                }
            },
            info: {
                modelType: '',
                price: '',
                stock: '',
                id: '',
                spec: 'single'
            }
        };
    },
    computed: {
        noManagePerm(){//无管理权限
            return !this.$getPermMap('wxTransactionComponent.index.manage')
        },
    },
    methods: {
        changePage(page) {
            this.$emit('on-page-change', page);
        },
        // 重置页码
        reset(page) {
            this.$refs['page']?.reset(page);
        },
        submitAudit(row) {
            this.$api.wxTransactionComponentApi.submitAudit({
                id: row.id,
                category_id: row.category_id,
                category_name: row.category_name
            }).then(res => {
                if (res.error === 0) {
                    this.$Message.success('提交审核成功');
                    this.$emit('on-refresh');
                }
            });
        },
        recallAudit(row) {
            this.$api.wxTransactionComponentApi.recallAudit({id: row.id}).then(res => {
                if (res.error === 0) {
                    this.$Message.success('撤销审核成功');
                    this.$emit('on-refresh');
                }
            });
        },
        handleSold(row, status) {
            this.$api.wxTransactionComponentApi.updateStatus({id: row.id, status}).then(res => {
                if (res.error === 0) {
                    let message = {
                        1: '商品下架成功',
                        2: '商品上架成功'
                    }
                    this.$Message.success(message[status]);
                    this.$emit('on-refresh');
                }
            });
        },
        handleUpdate(row) {
            this.info = {
                modelType: row.type,
                price: row.price,
                stock: row.stock,
                id: row.id,
                goodsId: row.goods_id,
                spec: 'single'
            };
            this.$nextTick(() => {
                if (0 === +row?.has_option) {
                    this.$refs['edit_information'].setValue();
                } else {
                    this.info.spec = 'multiple';
                    this.$refs['mult_spec'].setValue();
                }
            });
        },
        // 免审核更新
        updateInfo() {
            this.$api.wxTransactionComponentApi.updateExemption({id: this.info.id}).then(res => {
                if (res.error === 0) {
                    this.$Message.success('免审核更新成功');
                    this.info.spec === 'single' ? this.$refs['edit_information'].setValue() : this.$refs['mult_spec'].setValue();
                    this.$emit('on-refresh');
                }
            });
        },
        handleDelete(row) {
            this.$api.wxTransactionComponentApi.deleteGoods({id: row.id}).then(res => {
                if (res.error === 0) {
                    this.$Message.success('商品删除成功');
                    this.$emit('on-refresh');
                }
            });
        },
        handleDetail(row) {
            console.log('on-detata')
            this.$emit('on-detail', row.id)
        },
        // 商品类型
        goodsType(type) {
            let getType = {
                goodsName : '',
                goodsText: ''
            };
            switch (type) {
                case '0':
                    getType = {
                        goodsName : 'real',
                        goodsText : '实'
                    }
                    break;

                case '1':
                    getType = {
                        goodsName : 'virtual',
                        goodsText : '虚'
                    }
                    break;

                case '2':
                    getType = {
                        goodsName: 'secret',
                        goodsText: '密'
                    }
                    break;

                case '3':
                    getType = {
                        goodsName: 'appoint',
                        goodsText: '预'
                    }
                    break;
                case '5':
                    getType = {
                        goodsName: 'verifyCount',
                        goodsText: '次'
                    }
                    break;
                default:
                    getType = {
                        goodsName: '',
                        goodsText: ''
                    }
                    break;
            }
            return getType
        },
    }
};
</script>

<style scoped lang="scss">
.table-list {
    padding: 0 20px;
    background-color: #ffffff;
    border-radius: 2px;

    .goods {
        display: flex;
        align-items: center;

        .image {
            width: 60px;
            height: 60px;
            border: 1px solid #E9EDEF;
            box-sizing: border-box;
            border-radius: 2px;
            overflow: hidden;
            flex-shrink: 0;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .content {
            padding-left: 10px;
            @include font-14-20;
            color: $text-first;
            @include font-multiple-omit(2);

            .mark {
                padding: 1px 3px;
                @include font-12-16;
                border-radius: 2px;
                margin-right: 5px;
            }

            .real {
                background-color: $brand-light;
                color: $brand-color;
            }

            .more {
                background-color: $warning-light;
                color: $warning-color;
            }

            .virtual {
                color: #00C5C5;
                background-color: #E6FFF9;
            }
            .verifyCount {
                background-color: #FEE3FF;
                color: #FA00FF;
            }

            .card {
                color: $danger-color;
                background-color: $danger-light;
            }
        }

        .price {
            font-weight: bold;
        }
    }
}
.action {
    .ivu-btn {
        margin-right: 10px;
    }
}

.footer-page {
    border-top: 1px solid $border-color;
}
</style>
