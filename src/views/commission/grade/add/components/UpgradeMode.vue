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
    <div class="upgrade-mode">
        <Form ref="form" :model="model" :rules="rules"
              :label-width="120" @on-validate='onValidate'>
            <kdx-form-title>升级方式</kdx-form-title>
            <FormItem label="升级方式：" prop="upgrade_type">
                <RadioGroup v-model="model.upgrade_type">
                    <Radio :disabled='noManagePerm' :label="0">满足选中的任意条件</Radio>
                    <Radio :disabled='noManagePerm' :label="1">满足选中的全部条件</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="选择升级条件：" prop="label_type" v-error-item.label_type>
                <div class="check-label-box">
                    <check-label v-for="(item, index) in option" :key="item.key" :checked="item.checked"
                                 @on-change="setLabelStatus(index, $event)">{{item.name}}
                    </check-label>
                </div>
            </FormItem>
            <div class="form-item-box" v-if="isExpend">
                <template v-for="(item,index) in option">
                    <FormItem :key="item.key" :label="item.name" :prop="item.key"
                              v-if="item.checked && item.key !== 'goods_ids'" v-error-item="item.key">
                        <div class="goods-add-btn">
                            <kdx-rr-input :number="['price','num'].includes(item.format)" :fixed="getFixed(item)" :maxValue="getMaxValue(item)" :disabled='noManagePerm' v-model="model[item.key]" class="width-250">
                                <span slot="append">{{item.unit}}</span>
                            </kdx-rr-input>
                            <Icon type="ios-close-circle" class="icon-close" @click="setLabelStatus(index, false)"/>
                        </div>
                    </FormItem>
                </template>
                <FormItem label="购买指定商品：" prop="goods_ids" v-if="option[10].checked" v-error-item.goods_ids>
                    <div class="goods-add-btn">
                        <Button :disabled='noManagePerm' type="primary" @click="addGoods">+添加指定商品</Button>
                        <Icon type="ios-close-circle" class="icon-close" @click="setLabelStatus(10, false)"/>
                    </div>
                    <div class="goods-box" v-if="selector.list.length > 0">
                        <shop-name-page-list ref="shop_name_list" :list="selector.list"
                                             @on-delete="deleteGoods"></shop-name-page-list>
                    </div>
                </FormItem>
            </div>
        </Form>
        <!--商品选择器-->
        <goods-selector v-model="selector.value" multiple :current-list="selector.list" @on-change="changeGoods"
                        @on-cancel="handleCancel"></goods-selector>
    </div>
</template>

<script>
    import CheckLabel from "@/components/little/CheckLabel";
    import GoodsSelector from "@/components/selector/GoodsSelector";
    import ShopNamePageList from "@/components/ShopNamePageList";

    export default {
        name: "UpgradeMode",
        components: {
            CheckLabel,
            GoodsSelector,
            ShopNamePageList
        },
        data() {
            return {
                model: {
                    upgrade_type: 0,
                    label_type: [],
                    order_money: '',
                    order_count: '',
                    order_money_1: '',
                    order_count_1: '',
                    self_order_money: '',
                    self_order_count: '',
                    child_count: '',
                    child_agent_count: '',
                    child_count_1: '',
                    child_agent_count_1: '',
                    goods_ids: '',
                    withdraw_money: ''
                },
                rules: {
                    label_type: [
                        {required: true, type: 'array', message: '选择升级条件必填'}
                    ],
                    goods_ids: [
                        {required: true, message: '指定商品必填'}
                    ],
                    order_money: [
                        {required: true, message: '分销订单总额必填'},
                    ],
                    order_count: [
                        {required: true, message: '分销订单总数必填'}
                    ],
                    order_money_1: [
                        {required: true, message: '一级分销订单总额必填'}
                    ],
                    order_count_1: [
                        {required: true, message: '一级分销订单总数必填'}
                    ],
                    self_order_money: [
                        {required: true, message: '自购订单总额必填'}
                    ],
                    self_order_count: [
                        {required: true, message: '自购订单总数必填'}
                    ],
                    child_count: [
                        {required: true, message: '下线总人数必填'}
                    ],
                    child_agent_count: [
                        {required: true, message: '下线分销商人数必填'}
                    ],
                    child_count_1: [
                        {required: true, message: '一级下线人数必填'}
                    ],
                    child_agent_count_1: [
                        {required: true, message: '一级下线分销商必填'}
                    ],
                    withdraw_money: [
                        {required: true, message: '已提现佣金金额必填'}
                    ]
                },
                checked: [],
                option: [
                    {
                        name: '分销订单总额',
                        key: 'order_money',
                        unit: '元',
                        checked: false,
                        format: 'price'
                    },
                    {
                        name: '分销订单总数',
                        key: 'order_count',
                        unit: '单',
                        checked: false,
                        format: 'num'
                    },
                    {
                        name: '一级分销订单总额',
                        key: 'order_money_1',
                        unit: '元',
                        checked: false,
                        format: 'price'
                    },
                    {
                        name: '一级分销订单总数',
                        key: 'order_count_1',
                        unit: '单',
                        checked: false,
                        format: 'num'
                    },
                    {
                        name: '自购分销订单总额',
                        key: 'self_order_money',
                        unit: '元',
                        checked: false,
                        format: 'price'
                    },
                    {
                        name: '自购分销订单总数',
                        key: 'self_order_count',
                        unit: '单',
                        checked: false,
                        format: 'num'
                    },
                    {
                        name: '下线总人数',
                        key: 'child_count',
                        unit: '人',
                        checked: false,
                        format: 'num'
                    },
                    {
                        name: '下线分销商人数',
                        key: 'child_agent_count',
                        unit: '人',
                        checked: false,
                        format: 'num'
                    },
                    {
                        name: '一级下线人数',
                        key: 'child_count_1',
                        unit: '人',
                        checked: false,
                        format: 'num'
                    },
                    {
                        name: '一级下线分销商',
                        key: 'child_agent_count_1',
                        unit: '人',
                        checked: false,
                        format: 'num'
                    },
                    {
                        name: '购买指定商品',
                        key: 'goods_ids',
                        checked: false,
                    },
                    {
                        name: '已提现佣金金额',
                        key: 'withdraw_money',
                        unit: '元',
                        checked: false,
                        format: 'price'
                    },
                ],
                selector: {
                    value: false,
                    list: []
                }
            };
        },
        computed: {
            noManagePerm() { //管理权限
                return !this.$getPermMap('commission.level.manage')
            },
            isExpend() {
                let flag = false;
                this.option.forEach(item => {
                    if (item.checked) {
                        flag = true;
                    }
                });
                return flag;
            }
        },
        methods: {
            setLabelStatus(index, isChecked) {
                this.$set(this.option[index], 'checked', isChecked);
                this.model[this.option[index].key] = '';
                if (index === 10) {
                    this.selector.list = [];
                }
                this.model.label_type = [];
                this.option.forEach(item => {
                    if (item.checked) {
                        this.model.label_type.push(item.key);
                    }
                })
            },
            resetModel(model) {
                Object.keys(this.model).forEach(key => {
                    if (key !== 'upgrade_type' && model[key] && parseFloat(model[key]) == 0) {
                        this.model[key] = '';
                    } else {
                        this.model[key] = model[key];
                    }
                });
                this.initOption();
                if (model.goods_ids && model.goods_ids!=='0') {
                    this.getGoodsList();
                }
            },
            initOption() {
                this.model.label_type = [];
              this.option.forEach(item => {
                  if (this.model[item.key]) {
                      item.checked = true;
                      this.model.label_type.push(item.key);
                  } else {
                      item.checked = false;
                  }
              })
            },
            addGoods() {
                this.selector.value = true;
            },
            changeGoods(list) {
                this.selector.list = list || [];
                this.model.goods_ids = list.map(item => item.id).join(',');
                this.$nextTick(() => {
                    this.$refs['shop_name_list']?.reset();
                });
            },
            deleteGoods(index) {
                this.selector.list.splice(index, 1);
                this.model.goods_ids = this.selector.list.map(item => item.id).join(',');
                this.$nextTick(() => {
                    this.$refs['shop_name_list']?.reset();
                });
            },
            getModel() {
                let model = Object.assign({}, this.model);
                // 将没有选中的数据清空
                this.option.forEach(item => {
                    // 过滤goodsids
                    if (!item.checked) {
                        if(item.key!=='goods_ids'){
                            model[item.key] = '0';
                        } else {
                            model[item.key] = '';
                        }
                    }
                });
                delete model.label_type;
                return model;
            },
            getGoodsList() {
                this.$api.goodsApi.goodsList({ids: this.model.goods_ids.split(','), pager: 0})
                    .then(res => {
                        if (res.error === 0) {
                            this.selector.list = res.list || [];
                            this.$nextTick(() => {
                                this.$refs['shop_name_list']?.reset();
                            });
                        }
                    })
            },
            onValidate(prop, status){
                this.cacheError={
                    ...this.cacheError,
                    [prop]: status
                }
            },
            validate() {
                return new Promise(resolve => {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            let checked = false;
                            for (let item of this.option) {
                                if (item.checked) {
                                    checked = true;
                                    break;
                                }
                            }
                            if (!checked) {
                                this.$Message.error('请选择升级条件');
                            } else {
                                resolve();
                            }
                        }else {
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
                        }
                    });
                });
            },
            handleCancel() {
                this.selector.value = false;
            },
            getFixed(item){
                switch (item.format) {
                    case 'price':
                        return 2
                     case 'num':
                        return 0
                    default:
                        return
                }
            },
            getMaxValue(item){
                switch (item.format) {
                    case 'price':
                        return 9999999.99
                     case 'num':
                        return 999999999
                    default:
                        return
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .upgrade-mode {
        .form-item-box {
            background-color: $background-color;
            padding: 30px 20px;
            margin-left: 120px;
            /deep/ .ivu-form-item {
                .ivu-form-item-label {
                    width: 140px !important;
                }
                .ivu-form-item-error-tip {
                    left: 20px;
                }
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
        .check-label-box {
            max-width: 925px;
            padding-top: 10px;
            padding-bottom: 0;
            /deep/ .check-label {
                .label-item {
                    width: 144px;
                }
            }
        }
        .goods-add-btn {
            display: flex;
            align-items: center;
            .icon-close {
                margin-left: 10px;
                font-size: 18px;
                color: $text-zhushi;
                cursor: pointer;
            }
            .ivu-btn {
                background-color: #ffffff;
                color: $brand-color;
            }
        }
        .goods-box {
            padding-top: 10px;
            margin-left: 20px;
            width: 570px;
        }
    }
</style>
