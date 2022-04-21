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
    <kdx-content-bar>
        <div class="market-full-send-add">
            <kdx-form-title>{{type}}</kdx-form-title>
            <Form ref="form" :model="model" :rules="rules" :label-width="120">
                <FormItem label="满足价格：" prop="enough_price">
                    <kdx-rr-input type="text" v-model="model.enough_price" number :fixed="2" :disabled="disabled" placeholder="请输入"
                              class="width-160"/>
                </FormItem>
                <FormItem label="优惠券选择：" prop="coupon_id">
                    <Button class="default-primary" :disabled="disabled" @click="addCoupon">+添加</Button>
                    <div class="form-item-bg-box" v-if="model.coupon_id">
                        <!--优惠券列表-->
                        <div class="coupons-list">
                            <coupons-list :data="coupon.list" :disabled="disabled" @on-delete="deleteCoupons"></coupons-list>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="发送数量：" prop="send_total">
                    <kdx-rr-input v-model="model.send_total" number :max-value="50" :min-value="0" :fixed="0" :disabled="disabled" placeholder="请输入" class="width-160">
                        <span slot="append">张</span>
                    </kdx-rr-input>
                    <kdx-hint-text>每人每次发送数量，最大不可超过50张</kdx-hint-text>
                </FormItem>
                <FormItem label="库存预警：" prop="stock">
                    <Input v-model="model.stock" placeholder="请输入" class="width-160">
                        <span slot="append">张</span>
                    </Input>
                    <kdx-hint-text>当剩余数量小于发送数量时，发送任务停止</kdx-hint-text>
                </FormItem>
                <FormItem label="限时设置：">
                    <div class="date-range">
                        <DatePicker v-model="model.start_time" type="datetime" placeholder="开始时间" :clearable="false"
                                    class="width-250"></DatePicker>
                        <span class="middle">~</span>
                        <DatePicker v-model="model.end_time" type="datetime" placeholder="结束时间" :clearable="false"
                                    class="width-250"></DatePicker>
                    </div>
                </FormItem>
                <FormItem label="发送节点：" prop="send_point" class="r-form-item-checkbox">
                    <RadioGroup v-model="model.send_point">
                        <Radio label="0" :disabled="disabled">订单完成后发送</Radio>
                        <Radio label="1" :disabled="disabled">订单付款后发送</Radio>
                    </RadioGroup>
                    <kdx-hint-alert style="margin-top: 10px">订单完成后包括子订单内所有收货后才会发送优惠券</kdx-hint-alert>
                </FormItem>
                <FormItem label="状态：" prop="status" class="r-form-item-checkbox">
                    <RadioGroup v-model="model.status">
                        <Radio label="1">开启</Radio>
                        <Radio label="0">关闭</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button type="primary" @click="handleSave">保存</Button>
            <Button @click="handleCancel">取消</Button>
        </template>
        <!--优惠券选择器-->
        <coupon-selector v-model="coupon.value" :current="coupon.data"
                         @on-change="changeCouponList" @on-cancel="cancelCoupon"></coupon-selector>
    </kdx-content-bar>
</template>

<script>
    import CouponsList from "@/views/market/components/CouponsList";
    import {formatDate} from "@/assets/helpers";
    import CouponSelector from "@/components/selector/CouponSelector";

    export default {
        name: "index",
        components: {CouponsList, CouponSelector},
        data() {
            return {
                model: {
                    enough_price: '',
                    coupon_id: '',
                    send_total: '',
                    stock: '',
                    start_time: new Date(),
                    end_time: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
                    send_point: '0',
                    status: '0'
                },
                rules: {
                    enough_price: [
                        {required: true, message: '满足价格必填', trigger: 'blur'}
                    ],
                    coupon_id: [
                        {required: true, message: '优惠券必选', trigger: 'change'}
                    ],
                    send_total: [
                        {required: true, message: '发送数量必填'}
                    ],
                    stock: [
                        {required: true, message: '库存预警必填'}
                    ],
                    send_point: [
                        {required: true, message: '发送节点必填'}
                    ],
                    status: [
                        {required: true, message: '状态必填'}
                    ]
                },
                coupon: {
                    list: [],
                    value: false,
                    data: {}
                },
                id: '',
                type: '添加满额送券',
                disabled: false
            };
        },
        watch: {
            '$route.path': {
                handler() {
                    this.id = this.$route.query.id;
                    this.type = this.id ? '修改满额送券' : '添加满额送券';
                    this.disabled = !!this.id;
                },
                immediate: true
            }
        },
        methods: {
            handleSave() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.model.start_time && !this.model.end_time || !this.model.start_time && this.model.end_time) {
                            this.$Message.error('请填写正确的开始与结束时间');
                            return;
                        }
                        let params = Object.assign({}, this.model);
                        params.start_time = formatDate(params.start_time, 'yyyy-MM-dd hh:mm:ss');
                        params.end_time = formatDate(params.end_time, 'yyyy-MM-dd hh:mm:ss');
                        if (this.id) {
                            Object.assign(params, {id: this.id});
                            this.$api.marketApi.editFullSend(params)
                                .then(res => {
                                    if (res.error === 0) {
                                        this.$Message.success('满额送券修改成功');
                                        this.$router.go(-1);
                                    }
                                });
                        } else {
                            this.$api.marketApi.addFullSend(params)
                                .then(res => {
                                    if (res.error === 0) {
                                        this.$Message.success('满额送券新增成功');
                                        this.$router.go(-1);
                                    }
                                });
                        }
                    }
                });
            },
            getCouponData() {
                this.resetModel();
                if (this.id) {
                    this.$api.marketApi.getFullSend({id: this.id})
                        .then(res => {
                            if (res.error === 0) {
                                this.model = Object.assign(this.model, res.data);
                                this.coupon.data = res.coupon;
                                this.coupon.list = [res.coupon];
                            }
                        });
                }
            },
            // 添加优惠券
            addCoupon() {
                this.coupon.value = true;
            },
            // 删除优惠券列表
            deleteCoupons(index) {
                this.coupon.list.splice(index, 1);
                this.coupon.data = {};
                this.model.coupon_id = '';
            },
            changeCouponList(row) {
                this.model.coupon_id = row.id;
                this.coupon.data = row;
                this.coupon.list = [row];
                this.cancelCoupon();
            },
            cancelCoupon() {
                this.coupon.value = false;
            },
            resetModel() {
                this.model = {
                    enough_price: '',
                    coupon_id: '',
                    send_total: '',
                    stock: '',
                    start_time: new Date(),
                    end_time: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
                    send_point: '0',
                    status: '0'
                };
            },
            handleCancel() {
                this.$router.go(-1);
            }
        },
        mounted() {
            this.getCouponData();
        }
    };
</script>

<style scoped lang="scss">
    .market-full-send-add {
        padding: 40px 40px 30px 40px;
        background-color: #FFFFFF;
        margin-top: 20px;
        height: 100%;

        .form-item-bg-box {
            padding: 30px 20px;
            margin-top: 10px;
            background-color: $background-color;

            .coupons-list {
                width: 610px;
            }
        }

        .date-range {
            .middle {
                padding: 0 10px;
            }
        }
    }
</style>
