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
    <div class="level">
        <kdx-form-title content="交易设置"></kdx-form-title>
        <FormItem label="规格设置：" prop="has_option" class="r-form-item-checkbox">
            <RadioGroup class="flex" v-model="model_has_option" @on-change="changeHasOption">
                <Radio label="0" :disabled="actionType === 'update'">
                    <span>单规格</span>
                </Radio>
                <Radio label="1" :disabled="actionType === 'update'">
                    <span>多规格</span>
                </Radio>
                <div class="flex">
                    <kdx-hint-text style="padding-top:0" content="如有颜色、尺码等多种规格，请添加商品规格">
                        <kdx-hint-tooltip
                                type="image"
                                :image="require('@/assets/image/example/shop_specs.png')"
                        ></kdx-hint-tooltip>
                    </kdx-hint-text>
                </div>
            </RadioGroup>

            <!--单规格和多规格切换-->
            <div class="nest-box" style="padding: 0">
                <!--单规格-->
                <div class="single-one" style="padding-top:30px;" v-if="model_has_option === '0'">
                    <FormItem label="售卖价：" prop="price">
                        <kdx-rr-input v-model="model_price" placeholder="请输入" :disabled="is_activity_goods" number :fixed="2" :min-value="0" :max-value="9999999.99" class="width-172"><span slot="append">元</span></kdx-rr-input>
                    </FormItem>
                    <FormItem label="划线价：" prop="original_price">
                        <kdx-rr-input v-model="model_original_price" placeholder="请输入" number :fixed="2" :min-value="0" :max-value="9999999.99" class="width-172"><span slot="append">元</span></kdx-rr-input>
                    </FormItem>
                    <FormItem prop="cost_price">
                        <template #label>
                            <div>
                                <span>成本价</span>
                                <kdx-hint-tooltip>尽量填写完整, 有助于商品销售的数据分析</kdx-hint-tooltip>
                                <span>：</span>
                            </div>
                        </template>
                        <kdx-rr-input v-model="model_cost_price" placeholder="请输入" number :fixed="2" :min-value="0" :max-value="9999999.99" class="width-172"><span slot="append">元</span></kdx-rr-input>
                    </FormItem>
                </div>
                <div style="padding-bottom:30px;" v-if="model_has_option === '0'">
                    <FormItem label="库存：" prop="stock" style="margin-bottom: 0;display: flex" v-if="model_type != '2'">
                        <kdx-rr-input v-model="model_stock" placeholder="请输入库存" :disabled="is_activity_goods" number :fixed="0" :max-value="999999999" class="width-172"></kdx-rr-input>
                    </FormItem>
                    <FormItem label="卡密库：" prop="virtual_account_id" style="margin-bottom: 0;display: flex" v-error-item.virtual_account_id v-else>
                        <Select style="width:520px" v-model="model_virtual_account_id">
                            <Option :value="item.id" :label="item.name" v-for="item in virtualList" :key="item.id" >
                                <span>{{item.name}}</span>
                                <span style="float:right;color:#ccc">库存：{{item.total_count}}</span>
                            </Option>
                        </Select>
                    </FormItem>
                </div>
                <!--多规格-->
                <div class="single-more" v-else-if="model_has_option === '1'">
                    <multi-option :model_type="model_type" :actionType="actionType"></multi-option>
                </div>
            </div>
        </FormItem>
        <FormItem label="库存设置：" prop="reduction_type" class="r-form-item-checkbox" v-if="model_type != '2'">
            <RadioGroup v-model="model_reduction_type" style="margin-bottom: -10px">
                <div class="inventory-settings">
                    <Radio label="0" :disabled="isSeckill">
                        <span>下单减库存</span>
                        <remind-label title="推荐"></remind-label>
                    </Radio>
                    <Button
                            v-show="!isMoreInventorySetting"
                            type="text"
                            @click="getMoreInventorySetting"
                            style="display: block;font-size: 12px;height: inherit;padding-top: 10px"
                    >更多选项
                        <span class="iconfont icon-line-right"></span>
                    </Button>
                    <kdx-hint-text
                            v-show="isMoreInventorySetting"
                            errContent="恶意占用库存风险"
                    >买家提交订单, 扣减库存数量, 可能会存在
                    </kdx-hint-text>
                </div>
                <div class="inventory-settings" v-show="isMoreInventorySetting">
                    <Radio label="1"  :disabled="isSeckill">
                        <span>付款减库存</span>
                    </Radio>
                    <kdx-hint-text errContent="超卖风险">买家支付成功, 扣减库存数量, 可能会存在</kdx-hint-text>
                </div>
                <div class="inventory-settings" v-show="isMoreInventorySetting">
                    <Radio label="2"  :disabled="isSeckill">
                        <span>永不减库存</span>
                    </Radio>
                    <kdx-hint-text>
                        无论在下单还是在支付成功,
                        该商品永远不会扣减库存数量
                    </kdx-hint-text>
                </div>
            </RadioGroup>
        </FormItem>
        <!--更多交易设置-->
        <collapse-panel name="展开更多交易设置" expand-name="收起更多交易设置">
            <template>
                <template v-if="model_has_option === '0'">
                    <FormItem label="商品编码：" prop="goods_sku" v-if="model_type!=2">
                        <Input v-model="model_goods_sku" class="width-430" placeholder="请输入商品编码"/>
                    </FormItem>
                    <FormItem label="商品条码：" prop="bar_code" v-if="model_type!=2">
                        <Input v-model="model_bar_code" class="width-430" placeholder="请输入商品条码"/>
                    </FormItem>
                    <FormItem label="商品重量：" prop="weight" v-if="model_type === '0'">
                        <kdx-rr-input v-model="model_weight" class="width-430" number :fixed="2" :min-value="0" :max-value="999999999.99" :maxlength="12" placeholder="请输入">
                            <span slot="append">克</span>
                        </kdx-rr-input>
                    </FormItem>
                    <!--                    <FormItem label="商品体积：" prop="bar_code">-->
                    <!--                        <Input-->
                    <!--                                v-model="model_price"-->
                    <!--                                class="width-172"-->
                    <!--                                placeholder="请输入"-->
                    <!--                        >-->
                    <!--                            <span slot="append">m³</span>-->
                    <!--                        </Input>-->
                    <!--                    </FormItem>-->
                </template>
                <FormItem prop="ext_field.show_stock" label="显示库存：" class="r-form-item-checkbox">
                    <RadioGroup v-model="model_ext_field.show_stock">
                        <Radio label="1">
                            <span>是</span>
                        </Radio>
                        <Radio label="0">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text content="商品详情页中是否显示库存字段">
                        <kdx-hint-tooltip
                                type="image"
                                :image="require('@/assets/image/example/shop_stock.png')"
                        ></kdx-hint-tooltip>
                    </kdx-hint-text>
                </FormItem>
                <FormItem label="支持发票：" prop="ext_field.invoice" class="r-form-item-checkbox">
                    <RadioGroup v-model="model_ext_field.invoice" @on-change="invoiceChange">
                        <Radio label="1">
                            <span>是</span>
                        </Radio>
                        <Radio label="0">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
            </template>
        </collapse-panel>    </div>
</template>

<script>
    import MultiOption from './MultiOption';
    import CollapsePanel from '@/components/little/CollapsePanel';
    import {modelMap, stateMap} from './binders.js';
    import RemindLabel from '@/components/little/RemindLabel';
    import {mapState} from "vuex";

    export default {
        components: {
            MultiOption,
            CollapsePanel,
            RemindLabel
        },
        computed: {
            ...modelMap(),
            ...stateMap([
                'rules',
                'isThumbAddSlide',
                'isShowVideo',
                'shopLabel',
                'isMoreInventorySetting',
                'actionType'
            ]),
            ...mapState("goodAddEdit", {
                is_activity_goods: state => state?.model?.is_activity_goods == 1?true:false,
                virtualList: state => state?.virtualData,
            }),
            isSeckill(){
                return this.$store.state.goodAddEdit.model?.is_seckill==1
            },
        },
        methods: {
            // 更多库存设置
            getMoreInventorySetting() {
                this.isMoreInventorySetting = true;
            },
            // 是否支持发票
            invoiceChange(value) {
                if (this.$store.state.config.business.invoice == '0') {
                    // 支持发票时提示
                    if (value === '1') {
                        this.$Modal.confirm({
                            title: '您还未开启支持发票类型',
                            content:
                                '购买商品支持开发票时，需要在设置 [交易设置-发票设置] 中选择支持发票类型',
                            okText: '去设置',
                            onOk: () => {
                                // 跳转到发票管理页面
                                let routeData = this.$router.resolve({
                                    path: '/setting/business/index'
                                });
                                window.open(routeData.href, '_blank');
                            },
                            onCancel: () => {
                                this.model_ext_field.invoice = '0';
                            }
                        });
                    }
                }
            },
            changeHasOption(val) {
                if (val === '1') {
                    // this.model_price = '0';
                    // this.model_stock = '0';
                }
            },
        }
    };
</script>

<style lang="scss" scoped>
    .tip-item {
        display: inline-block;
        margin-left: -10px;

        /deep/ .hint-text {
            padding-top: 0;
        }
    }
    .goods-form-input {

        /deep/.ivu-input-wrapper {
            &:hover {
                .ivu-input {
                    border-color: $border-color;
                }
            }
            .ivu-input {
                &:disabled {
                    background-color: #FFFFFF;
                }
            }
             .ivu-input-group-prepend,
             .ivu-input-group-append {
                background-color: #FFFFFF;
            }
        }
    }
    .nest-box-form {
        /deep/ .ivu-form-item-error-tip {
            padding-left: 120px;
        }
    }
</style>
