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
        <div class="vip-grade-add">
            <div class="grade-content">
                <kdx-form-title>{{type}}</kdx-form-title>
                <Form ref="form" :model="model" :rules="rules" :label-width="120">
                    <!--<FormItem label="等级：" required :error="error_text">
                        <Input type="text" v-model="model.level" placeholder="请输入" class="width-160" @on-blur="handleTest"/>
                        <kdx-hint-text>数字越大，等级越高，等级不可重复</kdx-hint-text>
                    </FormItem>-->
                    <FormItem label="等级权重：" prop="level" v-if="!is_default">
                        <kdx-rr-input number :fixed="0" :minValue="1" :maxValue="100" type="text" v-model="model.level" placeholder="请输入" class="width-160"
                               @on-blur="handleTest"/>
                        <kdx-hint-text>数字越大，等级权重越高，等级权重不可重复</kdx-hint-text>
                    </FormItem>
                    <FormItem label="等级名称：" prop="level_name">
                        <Input type="text" v-model="model.level_name" placeholder="请输入" class="width-340" maxlength="6"
                               show-word-limit/>
                    </FormItem>
                    <FormItem label="升级条件：" ref="updateForm" prop="update_condition" class="r-form-item-checkbox" v-if="!is_default">
                        <RadioGroup v-model="model.update_condition" @on-change="changeType">
                            <Radio label="2">
                                <span>订单金额</span>
                            </Radio>
                            <Radio label="1">
                                <span>订单数量</span>
                            </Radio>
                            <Radio label="3">
                                <span>购买指定商品</span>
                            </Radio>
                            <!--                            <Radio label="4">-->
                            <!--                                <span>设为默认等级</span>-->
                            <!--                            </Radio>-->
                            <Radio label="0">
                                <span>不自动升级</span>
                            </Radio>
                        </RadioGroup>
                        <!--订单金额-->
                        <div class="bg-color" v-if="model.update_condition == 2">
                            <FormItem label="完成订单金额：" ref="orderMoney" prop="order_money" v-if="model.update_condition == 2"
                                      :label-width="160">
                                <kdx-rr-input v-model="model.order_money" number :fixed="2" :maxValue="9999999.99" class="width-160">
                                    <span slot="prepend">满</span>
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                                <kdx-hint-text style="margin-left: 160px;">满足升级条件后可升级为此会员等级</kdx-hint-text>
                            </FormItem>
                        </div>
                        <!--订单数量-->
                        <div class="bg-color" v-if="model.update_condition == '1'">
                            <FormItem label="完成订单数量：" ref="orderMoney" prop="order_count" v-if="model.update_condition == '1'"
                                      :label-width="160">
                                <kdx-rr-input v-model="model.order_count" number :fixed="0" :maxValue="999999999" class="width-160">
                                    <span slot="prepend">满</span>
                                    <span slot="append">单</span>
                                </kdx-rr-input>
                                <kdx-hint-text style="margin-left: 160px;">满足升级条件后可升级为此会员等级</kdx-hint-text>
                            </FormItem>
                        </div>
                        <!--购买指定商品-->
                        <div class="bg-color goods" v-if="model.update_condition == '3'">
                            <FormItem prop="goods_ids" ref="orderMoney" :label-width="0" style="margin-bottom: 0">
                                <Button class="default-primary" @click="addShop">+添加指定商品</Button>
                                <div class="goods-box">
                                    <shop-name-page-list v-if="selector.data && selector.data.length > 0" ref="shop_name_list" :list="selector.data" @on-delete="deleteGoods"></shop-name-page-list>
                                </div>
                            </FormItem>
                        </div>
                    </FormItem>
                    <FormItem label="折扣权益：" >
                        <RadioGroup v-model="model.is_discount">
                            <Radio label="0">
                                <span>不设置折扣</span>
                            </Radio>
                            <Radio label="1">
                                <span>自定义</span>
                            </Radio>
                        </RadioGroup>
                        <div class="bg-color" v-if="model.is_discount == '1'">
                            <FormItem label="当前等级可享受：" ref="orderMoney" v-if="model.is_discount == '1'" prop="discount"
                                      :label-width="160">
                                <kdx-rr-input v-model="model.discount" :fixed="1" number :minValue="0.1" :maxValue="9.9"
                                          class="width-250" placeholder="请输入0.1-9.9之间的数字">
                                    <span slot="append">折</span>
                                </kdx-rr-input>
                            </FormItem>
                        </div>
                    </FormItem>
                    <FormItem label="状态：" prop="status" class="r-form-item-checkbox" v-if="!is_default">
                        <RadioGroup v-model="model.state">
                            <Radio label="1">启用</Radio>
                            <Radio label="0">禁用</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </div>
        </div>

        <template #btn>
            <Button type="primary" class="primary-long" :loading="submitLoading" @click="handleSave">保存</Button>
            <Button @click="goBack">返回列表</Button>
        </template>

        <!--商品选择器-->
        <goods-selector v-model="selector.value" :multiple="true" :current-list="selector.data"
                        @on-change="selectorChange" @on-cancel="selectorCancel"></goods-selector>
    </kdx-content-bar>
</template>

<script>
    import ShopNamePageList from "@/components/ShopNamePageList";
    import GoodsSelector from "@/components/selector/GoodsSelector";
    export default {
        name: "index",
        components: {
            ShopNamePageList,
            GoodsSelector,
        },
        data() {
            return {
                type: '添加会员等级',
                id: '', // 等级id
                submitLoading: false,
                error_text: '', // 等级错误提示
                zancun: '',
                is_default: false, // 是否是默认等级
                model: {
                    level: '',
                    level_name: '',
                    update_condition: '2', // 升级条件
                    order_money: '', // 订单金额 （升级条件为2时）
                    order_count: '', // 订单数量
                    goods_ids: '', // 商品id
                    is_discount: '0',
                    discount: '', // 折扣
                    state: '0' // 状态
                },
                rules: {
                    level: [
                        {required: true, message: '请输入等级'},
                        {pattern: /^([1]?\d{1,2})$/, message: '请输入1-100的数字'},
                    ],
                    level_name: [
                        {required: true, message: '请输入等级名称'}
                    ],
                    update_condition: [
                        {required: true, message: '请选择升级条件'}
                    ],
                    order_money: [
                        {required: true, message: '请填写订单金额'},
                        {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '请输入正确的数值'},
                    ],
                    order_count: [
                        {required: true, message: '请填写订单数量'},
                        {pattern: /^[1-9]\d*$/, message: '请输入正确的数值'},
                    ],
                    discount: [
                        {required: true, message: '请填写等级折扣权益'},
                    ],
                    goods_ids: [
                        {required: true, message: '请添加商品'}
                    ]
                },
                selector: {
                    value: false,
                    data: []
                },
                columns: [
                    {
                        title: '商品',
                        key: 'title',
                        render: (h, params) => {
                            return (
                                <div class="flex align-center">
                                    <div class="goods-image">
                                        <img src={this.$media(params.row.thumb)} onError={e => {
                                            this.replaceImage(e);
                                        }} alt=""/>
                                    </div>
                                    <div class="goods-title two-line-hide">{params.row.title}</div>
                                </div>
                            );
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        render: (h, params) => {
                            return (
                                <Button type="text" onClick={() => {
                                    this.deleteShop(params.index);
                                }}>删除</Button>
                            );
                        }
                    }
                ]
            };
        },
        computed: {},
        created() {
        },
        mounted() {
            this.is_default = false;
            if (this.$route.params.type == 'edit') {
                this.type = '编辑会员等级';
                this.id = this.$route.query.id;
                this.getDetail();
            }
        },
        methods: {
            getDetail() {
                this.$api.memberApi.getLevel({id: this.id}).then(res => {
                    if (res.error == 0) {
                        this.model = res;
                        this.selector.data = res.goods_info;
                        if (this.model.is_default && this.model.is_default == '1') {
                            this.is_default = true;
                        }
                    }
                });
            },
            changeType(e) {
                if (this.$refs.orderMoney) {
                    this.$refs.orderMoney.validateState = '';
                }
                if (e != 0 && e != 4) {
                    this.zancun = e;
                } else if (e == 0) {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '您设置的等级不会自动升级到该等级下，请谨慎设置',
                        onOk: () => {
                            this.model.update_condition = '0';
                        },
                        onCancel: () => {
                            this.model.update_condition = this.zancun;
                        }
                    });
                } else if (e == 4) {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '您如果设置改等级为当前系统默认等级，则商城原有默认等级、和用户的等级将会被替换，请慎重操作！',
                        onOk: () => {
                            this.model.update_condition = '4';
                        },
                        onCancel: () => {
                            this.model.update_condition = this.zancun;
                        }
                    });
                }
            },

            handleSave() {
                this.submitLoading = true;
                this.customForm();
            },
            async customForm() {
                try {
                    await this.validateForm();
                    this.submit();
                } catch (e) {
                    this.submitLoading = false;
                }
            },
            // 表单验证
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            resolve(valid);
                        } else {
                            reject();
                        }
                    });
                });
            },
            submit() {
                let obj = {
                    level: this.model.level,
                    level_name: this.model.level_name,
                    update_condition: this.model.update_condition, // 升级条件
                    is_discount: this.model.is_discount,
                    discount: this.model.discount, // 折扣
                    state: this.model.state // 状态
                };
                if (this.model.update_condition == 3) {
                    obj.goods_ids = this.selector.data.map(item => item.id);
                } else if (this.model.update_condition == 1) {
                    obj.order_count = this.model.order_count;
                } else if (this.model.update_condition == 2) {
                    obj.order_money = this.model.order_money;
                }
                if (this.id) {
                    obj.id = this.id;
                }
                this.$api.memberApi[this.id ? 'editLevel' : 'addLevel'](obj).then(res => {
                    if (res.error == 0) {
                        this.$Message.success('保存成功');
                        setTimeout(() => {
                            this.$router.go(-1);
                        }, 2000);
                    }
                    this.submitLoading = false;
                });
            },
            addShop() {
                this.selector.value = true;
            },
            // 删除组内商品
            deleteGoods(index) {
                this.selector.data.splice(index, 1);
                this.model.goods_ids = this.selector.data.map(item => item.id)
            },
            selectorChange(list) {
                this.selector.data = list;
                this.model.goods_ids = this.selector.data.map(item => item.id)
            },
            selectorCancel() {
                this.selector.value = false;
            },
            // 检测等级
            handleTest(e) {
                if (this.$route.params.type == 'edit' && this.model.level == e.target.value) {
                    this.error_text = '';
                    return;
                }
                this.$api.memberApi.testLevelId({level: e.target.value}).then(res => {
                    if (res.error == 0) {
                        this.error_text = '';
                    } else {
                        this.model.level = '';
                        this.error_text = '该等级已存在';
                    }
                });
            },
            goBack() {
                this.$router.push({
                    path: '/member/grade/list'
                })
            }
        }
    };
</script>

<style lang="scss">
    .vip-grade-add {
        background-color: #fff;
        min-height: 100%;
        .grade-content {
            padding: 40px;
            height: 100%;
            background: #fff;
            margin-top: 20px;
        }

        .bg-color {
            margin-top: 10px;
            padding: 30px 0 10px;
            background-color: #F4F6F8;
            /deep/ .ivu-form-item {
                .ivu-form-item-content {
                    .ivu-form-item-error-tip {
                        margin-left: 160px;
                    }
                }
            }
            &.goods {
                /deep/ .ivu-form-item {
                    .ivu-form-item-content {
                        .ivu-form-item-error-tip {
                            margin-left: 0px;
                        }
                    }
                }
            }
        }

        .bg-color.goods {
            padding: 30px 0 30px 20px;
            .goods-box {
                padding: 0 20px;
                background-color: #ffffff;
                width: 610px;
                .goods-image {
                    width: 60px;
                    height: 60px;
                    margin-right: 10px;
                    object-fit: cover;
                    border: 1px solid $border-color;
                    border-radius: 2px;
                    box-sizing: border-box;
                    overflow: hidden;
                    flex-shrink: 0;
                    > img {
                        width: 100%;
                        height: 100%;
                    }
                }
                /deep/ .ivu-table-body {
                    margin-bottom: -1px;
                }
            }

            button {
                margin-bottom: 12px;
            }
        }
    }
</style>
