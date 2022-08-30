/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="list">
        <kdx-header-bar>
            <template #header>
                <Button type="primary" :disabled="noManagePerm" @click="addCreditGoods">
                    +批量添加积分商品
                </Button>
            </template>
            <!-- 筛选条件 -->
            <Form ref="form" :model="model" :label-width="100" @submit.native.prevent inline>
                <FormItem label="商品名称：">
                    <i-input class="width-340" type="text" placeholder="请输入关键词" v-model="model.keyword" @on-enter="handleSearch"/>
                </FormItem>
                <FormItem label="创建时间：">
                    <DatePicker class="width-340" type="datetimerange" placeholder="请选择创建时间" format="yyyy-MM-dd HH:mm" v-model="model.date"  @on-change="changeDate"></DatePicker>
                </FormItem>
                <!-- 操作按钮 -->
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                    <Button type="text" @click="handleExport">导出</Button>
                    <Button type="text" @click="viewHistory">查看订购记录</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="table-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data">
                <!-- 商品信息 -->
                <template slot-scope="{ row }" slot="goods">
                    <div class="goods">
                        <div class="image">
                            <div v-if="row.thumb == null">
                                <img v-if="row.coupon_sale_type == 1" :src="require('@/assets/image/coupons/full-reduction.png')" alt @error="replaceImage">
                                <img v-if="row.coupon_sale_type == 2" :src="require('@/assets/image/coupons/discount.png')" alt @error="replaceImage">
                            </div>
                            <div v-else>
                                <img :src="$utils.media(row.thumb)" alt="">
                            </div> 
                        </div>
                        <!-- 商品类型 -->
                        <div class="content">
                            <span class="mark more" v-if="1 === +row.has_option">多</span>
                            <span class="mark real" v-if="0 === +row.goods_type && row.coupon_sale_type === null">实</span>
                            <span class="mark virtual" v-else-if="1 === +row.goods_type">虚</span>
                            <span class="mark coupon" v-else-if="row.coupon_sale_type !== null">券</span>
                            <span class="mark card" v-else>密</span>
                            <!-- 标题 -->
                            <span v-if="row.title === null">{{ row.coupon_name }}</span>
                            <span v-else>{{ row.title }}</span>
                        </div>
                    </div>
                </template>
                <!-- 积分价 -->
                <template slot-scope="{ row }" slot="credit_price">
                    <div class="credit_price">
                        <div v-if="row.has_option == '0'">
                            <span class="credit-unit">{{ row.credit_shop_credit }}</span>积分+<span class="price-unit">{{ row.credit_shop_price }}</span>元
                        </div>
                        <div v-else>
                            <div>
                                <span class="credit-unit">{{ row.rules.min.credit_shop_credit }}</span>积分
                                <span v-if="row.rules.min.credit_shop_price !== 0">
                                    +<span class="price-unit">{{ row.rules.min.credit_shop_price }}</span>元
                                </span>
                            </div>
                            <div>
                                ~
                                <span class="credit-unit">{{ row.rules.max.credit_shop_credit }}</span>积分
                                <span v-if="row.rules.max.credit_shop_price !== 0">
                                    +<span class="price-unit">{{ row.rules.max.credit_shop_price }}</span>元
                                </span>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- 销售额 -->
                <template slot-scope="{ row }" slot="pay">
                    <div class="pay">
                        <div>积分：<span class="pay-color">{{ row.pay_credit }}</span></div>
                        <div>金额：<span class="pay-color">{{ row.pay_price }}</span></div>
                    </div>
                </template>
                <!-- 商品状态 -->
                <template slot-scope="{ row }" slot="status">
                    <kdx-status-text type="success" v-if="row.status === '1'">
                        已上架
                    </kdx-status-text>
                    <kdx-status-text type="danger" v-else>
                        已下架
                    </kdx-status-text>
                </template>
                <!-- 操作 -->
                <template slot-scope="{ row }" slot="action">
                    <div class="btn-box">
                        <Button type="text" v-if="row.status === '0'" :disabled="noManagePerm" @click="changeStatus(row.id, row.status)">
                            上架
                        </Button>
                        <Button type="text" v-if="row.status === '1'" :disabled="noManagePerm" @click="changeStatus(row.id, row.status)">
                            下架
                        </Button>
                        <Button type="text" :disabled="noManagePerm" @click="handleEdit(row.id)">
                            编辑
                        </Button>
                        <GoodsTooltip :url="$utils.getPreviewUrl('creditShop', row.id)" text="复制链接" :id="row.id">
                            <Button type="text" :disabled="noManagePerm">推广</Button>
                        </GoodsTooltip>
                        <Button type="text" :disabled="noManagePerm" @click="handleDelete(row.id)">
                            删除
                        </Button>
                    </div>
                </template>
            </Table>
            <div class="footer-page" v-show="data.length > 0">
                <kdx-page-component ref="page" :total="total" :pageSize="pageSize" :current="current" @on-change="changePage"></kdx-page-component>

            </div>
        </div>
    </div>      

</template>

<script>
import GoodsTooltip from "@/views/goods/list/components/GoodsTooltip.vue";
import { Export } from '@/helpers/export';

export default {
    name: "list",
    components: {
        GoodsTooltip
    },
    data() {
        return {
            loading: false,
            data: [],
            total: 0,
            pageSize: 10,
            current: 1,
            model: {
                keyword: '',       // 商品名称
                date: []        // 创建时间
            },
            columns: [
                {
                    title: '商品',
                    slot: 'goods',
                    minWidth: 300
                },
                {
                    title: '积分价',
                    slot: 'credit_price',
                    minWidth: 170
                },
                {
                    title: '库存',
                    key: 'credit_shop_stock',
                    minWidth: 70
                },
                {
                    title: '销售数量',
                    key: 'sale',
                    minWidth: 90
                },
                {
                    title: '销售额',
                    slot: 'pay',
                    minWidth: 130
                },
                {
                    title: '创建时间',
                    key: 'created_at',
                    minWidth: 120
                },
                {
                    title: '状态',
                    slot: 'status',
                    width: 100
                },
                {
                    title: '操作',
                    slot: 'action',
                    minWidth: 130
                },
            ]
        }
    },
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('creditShop.list.manage')
        },
    },
    mounted() {
        this.getData()
    },
    methods: {
        // 添加商品
        addCreditGoods() {
            this.$router.push({
                path: '/creditShop/goods/index'
            })
        },
        // 创建时间
        changeDate(date) {
            if (!date[0]) return;
            this.model.date = date;
        },
        // 搜索
        handleSearch() {
            this.getData();
        },
        // 重置
        handleReset() {
            this.model.keyword = '';
            this.model.date = [];
            this.getData();
        },
        // 导出
        handleExport() {
            let params = {
                export: '1',
                start_time: this.model.date[0],
                end_time: this.model.date[1],
                keyword: this.model.keyword
            }
            Export('manage/creditShop/list/index', params);
        },
        // 查看订购记录
        viewHistory() {
            this.$utils.openNewWindowPage('/order/list/all', {activity_type: '5'})
        },
        // 上下架
        changeStatus(id, status) {
            let content;
            if(status === '1') {
                content = '确认下架此商品？';
                status = '0';
            } else {
                content = '确认上架此商品？';
                status = '1';
            }
            this.$Modal.confirm({
                title: '提示',
                content,
                onOk: () => {
                    this.$api.creditShopApi.changeStatus({id, status}).then(res => {
                        if(res.error === 0) {
                            this.getData();
                        }
                    })
                },
                onCancel: () => {}
            })
        },
        // 编辑
        handleEdit(id) {
            this.$router.push({
                path: '/creditShop/goods/index',
                query: {
                    id,
                    type: 'edit',
                }
            })
        },
        // 删除
        handleDelete(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认删除此商品？',
                onOk: () => {
                    this.$api.creditShopApi.deleteGood({id}).then(res => {
                        if(res.error === 0) {
                            this.getData();
                        }
                    })
                },
                onCancel: () => {}
            });
        },
        // 变更页码
        changePage(params) {
            this.pageSize = params.pageSize;
            this.current = params.pageNumber;
            this.getData();
        },
        // 获取列表数据
        getData() {
            this.loading = true;
            let params = {
                pagesize: this.pageSize,
                page: this.current,
                keyword: this.model.keyword,
                start_time: this.model.date[0],
                end_time: this.model.date[1]
            }
            this.$api.creditShopApi.getList(params).then(res => {
                this.loading = false;
                this.data = res.list;
                this.total = res.total;
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.list {
    margin-top: 10px;
}
.table-list {
    background-color: #ffffff;
    padding: 0 20px;
    margin-top: 10px;
    border-radius: 2px;
    position: relative;
    .goods {
        display: flex;
        align-items: center;

        .image {
            width: 60px;
            height: 60px;
            border: 1px solid #e9edef;
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
                color: #00c5c5;
                background-color: #e6fff9;
            }

            .card {
                color: $danger-color;
                background-color: $danger-light;
            }
            
            .coupon {
                background-color: $warning-light;
                color: $warning-color;
            }
        }
    }
    .credit_price {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        .credit-unit {
            color: $warning-color;
        }
        .price-unit {
            color: $danger-color;
        }
    }
    .pay {
        .pay-color {
            color: $warning-color;
        }
    }
}
.btn-box /deep/ .ivu-btn span {
    display: inline-block;
    margin-right: 8px;
}
</style>