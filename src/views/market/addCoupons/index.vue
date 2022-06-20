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
    <kdx-content-bar :loading="loading">
        <div class="market-add-coupons">
            <Form ref="form" :model="model" :rules="rules" :label-width="140" @on-validate='onValidate'>
                <!--基本信息-->
                <basic-info></basic-info>
                <!--领取规则-->
                <get-rules></get-rules>
                <!--使用限制-->
                <use-limit :id="id"></use-limit>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">保存</Button>
            <Button class="default-long" to="/market/coupons/all-list"
                >取消</Button
            >
            <Button
                v-show="id"
                class="default-error-long"
                @click="deleteCoupons"
                >删除优惠券</Button
            >
        </template>
        <!--删除优惠券-->
        <delete-coupons-modal
                ref="delete_coupon_modal"
                @on-change="changeDeleteCoupon"
        ></delete-coupons-modal>
        <!--保存优惠券提示-->
        <save-modal
                ref="save_modal"
                :content="save.content"
                @on-change="changeSave"
        ></save-modal>
    </kdx-content-bar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DeleteCouponsModal from './components/DeleteCouponsModal'
import SaveModal from './components/SaveModal'
import { dealClassifyList } from '@/assets/helpers'
import BasicInfo from './components/BasicInfo'
import GetRules from './components/GetRules'
import UseLimit from './components/UseLimit'

export default {
    name: 'add',
    components: {
        DeleteCouponsModal,
        SaveModal,
        BasicInfo,
        GetRules,
        UseLimit,
    },
    data() {
        return {
            value: 'base',
            id: 0,
            loading: false,
            save: {
                content: ''
            },
            rules: {
                coupon_name: [
                    { required: true, message: '优惠券名称必填' },
                    {
                        pattern: /^\S.*\S$/,
                        message: '优惠券前后不能有空格'
                    }
                ],
                stock_type: [{ required: true, message: '发放总量必填' }],
                time_limit: [{ required: true, message: '使用时间限制必填' }],
                get_max_type: [{ required: true, message: '每人领取张数必填' }],
                pick_type: [{ required: true, message: '领取方式必填' }],
                get_max: [{ required: true, message: '每人限领必填' }],
                stock: [{ required: true, message: '限制张数必填' }],
                enough: [
                    { required: true, message: '必填' },
                    // {
                    //     pattern: /^(0|[1-9][0-9]{0,6})+(.[0-9]{1,2})?$/,
                    //     message: '支持7位整数或两位小数'
                    // }
                ],
                discount_price: [
                    {validator:(rule, value, callback)=> {
                       if(value == '') {
                           callback(new Error('优惠额度必填'))
                       } else {
                           callback()
                       }
                    }}
                ],
                start_time: [
                    {required: true, message: '开始时间必选'}
                ],
                end_time: [
                    {required: true, message: '结束时间必选'},
                    {validator: (rule, value) => this.model.start_time && new Date(value) > new Date(this.model.start_time), message: '结束时间要大于开始时间'}
                ],
                limit_day: [
                    {required: true, message: '天数必填'}
                ],
                member_level: [
                    {required: !this.isShowCommissionLevel, message: '领取人限制必填'}
                ],
                balance: [
                    {required: true, message: '花费金额必填'},
                    // {
                    //     pattern: /^(0|[1-9][0-9]{0,6})+(.[0-9]{1,2})?$/,
                    //     message: '支持7位整数或两位小数'
                    // },
                    // {validator: (rule, value) => this.model.start_time && new Date(value) >= new Date(this.model.start_time), message: '结束时间要大于开始时间'}
                    {
                        validator: (rule, value) => !(this.model.credit == '0' && value == '0'),
                        message: '金额和积分不能同时为0'
                    }
                ],
                credit: [
                    {required: true, message: '消耗积分必填'},
                    // {
                    //     pattern: /^(0|[1-9][0-9]{0,6})?$/,
                    //     message: '支持7位整数',
                    //     trigger: 'blur'
                    // },
                    {
                        validator: (rule, value) => !(parseFloat(this.model.balance) == '0' && value == '0'),
                        message: '金额和积分不能同时为0',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    computed: {
        ...mapState('couponAdd', {
            model: state => state.model
        }),
        isShowCommissionLevel() {
            console.log('is-show-commission-level', parseInt(this.$store.state?.config?.commission?.setting?.commission_level || '-1') > 0)
            return parseInt(this.$store.state?.config?.commission?.setting?.commission_level || '-1') > 0;
        }
    },
    watch: {
        '$route.path': {
            handler() {
                this.id = this.$route.query.id || 0
                let disabled = false
                if (this.id) {
                    disabled = true
                }
                this.$store.commit('couponAdd/setDisabled', disabled)
            },
            immediate: true
        }
    },
    methods: {
        ...mapActions('couponAdd', ['getAgentGradeAllList']),
        onValidate(prop, status){
            this.cacheError={
                ...this.cacheError,
                [prop]: status
            }
        },
        validate() {
            return new Promise(resolve => {
                this.$refs['form'].validate(valid => {
                    resolve(valid);
                    this.$nextTick(() => {
                        if(!valid){
                            for(let k in this.cacheError){
                                if(!this.cacheError[k]){
                                    this.$focusError(k);
                                    break;
                                }
                            }
                        }
                    })
                });
            });
        },
        // 保存
        handleSave() {
            this.validate().then(valid => {
                if (valid) {
                    let model = this.$store.state.couponAdd.model;
                    // 分销开启
                    if (model.limit_member === '1' && model.pick_type !== '2') {
                        if (parseInt(this.$store.state?.config?.commission?.setting?.commission_level || '-1') > 0) {
                            if (!model?.member_level?.length && !model?.commission_level?.length) {
                                this.$Message.error('领取人和分销商等级必选一个');
                                return;
                            }
                        } else {
                            if (!model?.member_level?.length) {
                                this.$Message.error('领取人限制必选');
                                return;
                            }
                        }
                    }
                    if (model.goods_limit === '1' || model.goods_limit === '2') {
                        if (!model.goods_ids) {
                            this.$Message.error('商品使用限制中商品必选');
                            return;
                        }
                    } else if (model.goods_limit === '3') {
                        if (!model.goods_ids?.length) {
                            this.$Message.error('商品分类必选');
                            return;
                        }
                    }
                    if (model.default_description === '2' && !model.description) {
                        this.$Message.error('使用说明中说明文字必填');
                        return;
                    }
                    if (this.id) {
                        this.editCoupon()
                    } else {
                        // 满减券
                        if (model.coupon_sale_type === '1') {
                            this.save.content = `满${model.enough}减${model.discount_price}`
                        } else if (model.coupon_sale_type === '2') {
                            // 折扣券
                            this.save.content = `满${model.enough}享${model.discount_price}折`
                        }
                        this.$refs['save_modal'].setValue()
                    }
                }
            })
        },
        changeSave() {
            this.addCoupon()
        },
        getCouponData() {
            if (this.id) {
                this.loading = true
                let params = { id: this.id }
                this.$api.marketApi.getCoupon(params).then(res => {
                    this.loading = false
                    if (res.error === 0) {
                        let goods_ids = '';
                        if (res.goods_list?.length) {
                            goods_ids = res.goods_list.map(item => item.id).join(',');
                        }
                        if (res.item.goods_limit === '3') {
                            goods_ids = res.cate_list.map(item => item.id);
                        }
                        this.$store.commit('couponAdd/setModel', {
                            ...res.item,
                            ...res.rules,
                            goods_ids
                        })
                        this.$store.commit(
                            'couponAdd/initGoodsList',
                            res.goods_list
                        )
                    }
                })
            } else {
                this.$store.commit('couponAdd/resetModel')
            }
        },
        addCoupon() {
            let params = {
                ...this.$store.state.couponAdd.model
            }
            if (params.pick_type === '2') {
                // 活动领取的券 重置领取人限制、每人领取张数
                let resetParams = {
                    is_free: '1',
                    balance: '',
                    credit: '',
                    limit_member: '0',
                    member_level: [],
                    commission_level: [],
                    get_max_type: '1',
                    get_max: '',
                }
                params = {
                    ...params,
                    ...resetParams,
                }
            }
            if (params.goods_ids && typeof params.goods_ids !== 'string') {
                params.goods_ids = params.goods_ids.join(',');
            }
            params.member_level = params.member_level.join(',')
            params.commission_level = params.commission_level.join(',')
            params.start_time = params.start_time ? this.$utils.formatDate(new Date(params.start_time), 'yyyy-MM-dd hh:mm:ss') : '';
            params.end_time = params.end_time ? this.$utils.formatDate(new Date(params.end_time), 'yyyy-MM-dd hh:mm:ss') : ''
            this.loading = true
            this.$api.marketApi
                .addCoupon(formatParamsNull(params))
                .then(res => {
                    this.loading = false
                    if (res.error === 0) {
                        this.$Message.success('优惠券新增成功')
                        this.$router.push({
                            path: '/market/coupons/all-list'
                        })
                    }
                })
        },
        editCoupon() {
            let params = Object.assign(
                { id: this.id },
                this.$store.state.couponAdd.model
            )
            params.member_level = params.member_level.join(',')
            params.commission_level = params.commission_level.join(',')
            if (params.time_limit === '0') {
                params.start_time = params.start_time ? this.$utils.formatDate(new Date(params.start_time), 'yyyy-MM-dd hh:mm:ss') : '';
                params.end_time = params.end_time ? this.$utils.formatDate(new Date(params.end_time), 'yyyy-MM-dd hh:mm:ss') : ''
            }
            if (params.goods_ids && typeof params.goods_ids !== 'string') {
                params.goods_ids = params.goods_ids.join(',');
            }
            this.loading = true
            this.$api.marketApi
                .editCoupon(formatParamsNull(params))
                .then(res => {
                    this.loading = false
                    if (res.error === 0) {
                        this.$Message.success('优惠券修改成功')
                        this.$router.push({
                            path: '/market/coupons/all-list'
                        })
                    }
                })
        },
        deleteCoupons() {
            this.$refs['delete_coupon_modal'].setValue()
        },
        changeDeleteCoupon(type) {
            this.loading = true
            let params = {
                id: this.id,
                type
            }
            this.$api.marketApi.deleteCoupon(params).then(res => {
                this.loading = false
                if (res.error === 0) {
                    this.$Message.success('优惠券删除成功')
                    this.$router.push({
                        path: '/market/coupons/all-list'
                    })
                }
            })
        },
        // 获取商品分类
        getShopClassify() {
            this.$api.goodsApi.goodClassifyList().then(res => {
                if (res.error === 0) {
                    // 待处理
                    let list = dealClassifyList(res.list)
                    this.$store.commit('couponAdd/setShopLevel', list)
                }
            })
        },
        // 获取会员等级
        getVipLevel() {
            this.$api.memberApi.getLevelList({is_all: 1}).then(res => {
                if (res.error === 0) {
                    this.$store.commit(
                        'couponAdd/setVipLevel',
                        res.list || []
                    )
                }
            })
        }
    },
    mounted() {
        // 初始化model
        this.$store.commit('couponAdd/resetModel')
        this.getCouponData()
        this.getShopClassify()
        this.getVipLevel()
        this.getAgentGradeAllList()
        this.$refs['form'].resetFields()
    }
}
// 去除参数中空字符串
export const formatParamsNull = data => {
    let obj = {}
    for (let item in data) {
        if (data[item]) {
            obj[item] = data[item]
        }
    }
    return obj
}
</script>

<style scoped lang="scss">
    .market-add-coupons {
        background-color: #ffffff;
        min-height: 100%;
        margin-top: 20px;
        padding: 40px 40px 0 40px;
        /deep/ .level {
            padding-bottom: 30px;

            .ivu-form-item-content {
                .input-disabled .ivu-input-word-count {
                    background-color: #f3f3f3;
                }
            }

            .form-item-bg-box {
                padding: 30px 20px;
                margin-top: 10px;
                background-color: $background-color;

                .ivu-form-item {
                    margin-bottom: 0;
                }
                .date-range {
                    .ivu-form-item-error-tip {
                        margin-left: 120px;
                    }
                }

                // 时间限制
                .time-limit {
                    display: flex;
                    align-items: center;
                    .postfix {
                        padding-left: 10px;
                        padding-right: 6px;
                    }

                    .middle {
                        padding: 0 10px;
                    }
                }

                // 商品使用限制
                .shop-list-box {
                    .shop-list {
                        width: 800px;
                        margin-top: 10px;

                        .more-btn {
                            padding: 16px 10px;
                        }
                    }
                }

                // 领取方式---领取中心
                .coupons-get-center {
                    .get-free {
                        padding-bottom: 30px;
                    }

                    .get-pay {
                        display: flex;
                        align-items: center;

                        .ivu-radio-wrapper {
                            transform: translateY(0);
                        }

                        .ivu-checkbox-wrapper {
                            margin-left: 20px;
                        }

                        .left-text {
                            padding-right: 10px;
                        }

                        .middle-text {
                            padding: 0 10px;
                        }
                        .ivu-form-item-content {
                            .ivu-input-hide-icon {
                                .ivu-input-icon-validate {
                                    display: none;
                                }
                            }
                            .ivu-form-item-error-tip {
                                top: 48px;
                            }
                        }
                    }
                }
            }

            .form-item-bg-box-label {
                padding: 30px 0;
                margin-top: 10px;
                background-color: $background-color;

                .ivu-form-item {
                    margin-bottom: 30px;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .ivu-form-item-error-tip {
                        padding-left: 140px;
                    }
                }
                &.get-rules-checkbox {
                    .ivu-form-item-content {
                        margin-left: 140px !important;
                        .ivu-checkbox-group {
                            margin-bottom: -10px;
                            .ivu-checkbox-group-item {
                                margin-bottom: 10px;
                            }
                        }
                    }
                }
            }

            .form-coupons-type {
                .ivu-radio-group {
                    transform: translateY(-3px);

                    .ivu-radio-wrapper {
                        // 优惠券类型
                        .coupons-discount,
                        .coupons-full {
                            position: relative;
                            display: inline-block;
                            @include font-14-20;
                            color: #ffffff;
                            padding: 5px 14px 5px 16px;
                            border-radius: 2px;
                            background-color: $warning-color;
                            margin-left: 6px;

                            > img {
                                position: absolute;
                                top: 0;
                                bottom: 0;
                                right: -2px;
                            }
                        }

                        .coupons-discount {
                            background-color: $brand-color;
                        }
                    }
                }

                .form-item-bg-box {
                    .coupons-type {
                        display: flex;
                        flex-wrap: nowrap;
                        align-items: center;

                        > .label {
                            padding-right: 10px;
                        }

                        > .sub {
                            padding: 0 10px;
                        }
                    }
                }
            }
        }
    }
</style>
