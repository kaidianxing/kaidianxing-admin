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
    <kdx-content-bar v-loading="loading">
        <kdx-hint-alert>
            <div>积分商品添加方式为调取商城商品/付费优惠券并设置积分价、库存，对原商品/优惠券的设置、售卖、活动等不产生影响，积分商品与商城商品/优惠券不共用详情页链接</div>
            <div>请注意如果原商品的规格信息产生变更，对应积分商品将自动下架，必须重新编辑积分商品的积分价方可上架</div>
        </kdx-hint-alert>
        <div class="container">
            <!-- 商品类型 -->
            <select-type v-model="good_type" :is-disabled="is_disabled"></select-type>
            <!-- 交易设置 -->
            <deal-set ref="dealInfo" :type="good_type" :dealSetData.sync="dealSetData" :is-disabled="is_disabled"></deal-set>
            <!-- 其他设置项 -->
            <other-set ref="otherSet" :otherSetData.sync="otherSetData"></other-set>
        </div>
        <template #btn>
            <Button class="primary-long" :loading="submitLoading" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
    import SelectType from "./components/SelectType";
    import DealSet from "./components/DealSet";
    import OtherSet from "./components/OtherSet";
    export default {
        name: "index",
        components: {
            SelectType,
            DealSet,
            OtherSet
        },
        props: {},
        data() {
            return {
                loading: false,
                submitLoading: false,
                id: '', // 编辑
                type: '', // 查看编辑
                good_type: '0', // 选择商品类型 0 商品 1 优惠券
                dealSetData: {
                    goods: [], // 商品信息
                    goods_list: [], // 选择的商品列表
                    dispatch_type: '0', // 配送方式 0 系统 1 包邮
                },
                otherSetData: {
                    member_level_limit_type: '0', // 会员等级限制 0不限制 1允许 2拒绝
                    member_level_id: '', // 限制id 逗号分隔
                    member_group_limit_type: '0', // 会员标签限制 0不限制 1允许 2拒绝
                    member_group_id: '', // 限制id 逗号分隔
                    goods_limit_type: '0', // 商品限购 0不限制 1每人 2每人n天
                    goods_limit_num: '', // 数量
                    goods_limit_day: '', // 天数
                    status: '1', // 状态 0下架 1上架
                }
            }
        },
        computed: {
            is_disabled() {
                return this.type === 'edit'
            }
        },
        created() {
            let { id, type } = this.$route.query;
            this.id = id;
            this.type = type;
            if (this.id) {
                this.getData()
            }
        },
        mounted() {
        },
        methods: {
            getData() {
                this.$api.creditShopApi.getCreditShopData({id:this.id}).then(res => {
                    if (res.error === 0 ) {
                        if (res.data.status === '-1') {
                            if (+res.data.goods.has_option) {
                                delete res.data.goods.rules
                            } else {
                                res.data.goods.credit_shop_stock = '';
                                res.data.goods.credit_shop_price = '';
                                res.data.goods.credit_shop_credit = '';
                            }
                        }
                        let {type, goods, dispatch_type, ...otherData} = res.data
                        this.good_type = type;
                        this.dealSetData = {
                            goods: [goods],
                            goods_list: [goods],
                            dispatch_type
                        };
                        this.otherSetData = {
                            ...otherData,
                            status: res.data.status === '-1'?'0': res.data.status,
                            goods_limit_num: res.data.goods_limit_type == 1?res.data.goods_limit_num: '',
                            goods_limit_num1: res.data.goods_limit_type == 2?res.data.goods_limit_num: '',
                            goods_limit_day: res.data.goods_limit_type == 2?res.data.goods_limit_day: ''
                        }
                    }
                })
            },
            async handleSave() {
                this.submitLoading = true;
                try {
                    await this.$refs.dealInfo.validateForm();
                    await this.$refs.otherSet.validateForm();
                    this.formatParams()
                } catch (e) {
                    this.submitLoading = false;
                }
            },
            formatParams() {
                let params = {
                    type: this.good_type,
                    ...this.dealSetData,
                    ...this.otherSetData,
                    goods: JSON.stringify(this.dealSetData.goods)
                };
                if (params.goods_limit_type == 2) {
                    params.goods_limit_num = this.otherSetData.goods_limit_num1;
                }
                delete params.goods_limit_num1;
                delete params.goods_list;
                this.submit(params)
            },
            submit(params) {
                this.$api.creditShopApi[this.id?'editCreditShop':'addCreditShop'](params).then((res) => {
                    this.submitLoading = false;
                    if (res.error == 0) {
                        this.$Message.success('保存成功');
                        this.$router.replace({
                            path: '/creditShop/goods/list'
                        })
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .container {
        margin-top: 10px;
        background: #ffffff;
        padding: 40px;
    }
</style>