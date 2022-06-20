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
    <div class="level" v-if="model_type === '0' ||  model_type === '1'">
        <kdx-form-title content="物流设置"></kdx-form-title>
        <FormItem
            label="自动发货内容："
            class="r-form-item-checkbox"
            v-if="model_type === '1'"
        >
            <RadioGroup v-model="model_auto_deliver">
                <Radio label="1">
                    <span>支持</span>
                </Radio>
                <Radio label="0">
                    <span>不支持</span>
                </Radio>
            </RadioGroup>
            <kdx-hint-text v-if="model_auto_deliver == '1'">用户下单付款成功后订单自动完成</kdx-hint-text>
            <kdx-hint-text v-if="model_auto_deliver == '0'">用户下单付款成功后商城自动发货，订单为待收货状态</kdx-hint-text>
            <div
                class="nest-box"
                v-if="model_auto_deliver === '1'"
            >
                <FormItem
                    label="自动发货内容："
                    style="margin-bottom: 0"
                    prop="auto_deliver_content"
                >
                    <Input
                        v-model="model_auto_deliver_content"
                        type="textarea"
                        :autosize="{ minRows: 2 }"
                        class="width-430"
                        placeholder="请输入"
                    />
                </FormItem>
            </div>
        </FormItem>

        <!--  -->
        <FormItem
            label="物流支持："
            prop="logistics_support"
            v-error-item.logistics_support
            class="r-form-item-checkbox"
            v-if="model_type === '0'"
        >
            <CheckboxGroup
                v-model="model_logistics_support"
            >
                <div class="logistics-box">
                    <Checkbox
                        label="1"
                        :disabled="dispatchEnable.express === 0"
                    >
                        快递发货
                        <span v-if="dispatchEnable.express === 0">
                            (当前不可用，请到
                            <span
                                style="color: #2D8CF0;cursor: pointer;"
                                @click="fnJumpOrdinaryExpress"
                            >
                                【配送方式】
                            </span>
                            管理中开启)
                        </span>
                    </Checkbox>
                </div>
                <div class="logistics-box">
                    <Checkbox
                        label="2"
                        :disabled="dispatchEnable.intracity === 0"
                    >
                        同城配送
                        <span v-if="dispatchEnable.intracity === 0">
                            (当前不可用，请到
                            <span
                                style="color: #2D8CF0;cursor: pointer;"
                                @click="fnJumpSamecityDelivery"
                            >
                                【配送方式】
                            </span>
                            管理中开启)
                        </span>
                    </Checkbox>
                </div>
            </CheckboxGroup>
        </FormItem>

        <FormItem
            label="运费设置："
            prop="dispatch_type"
            class="r-form-item-checkbox"
            v-if="model_type === '0' && expressSelected('1')"
        >
            <RadioGroup v-model="model_dispatch_type" @on-change="changeDispatchCount">
                <Radio label="0">
                    <span>包邮</span>
                </Radio>
                <Radio label="1">
                    <span>选择模板</span>
                </Radio>
                <Radio label="2">
                    <span>统一运费</span>
                </Radio>
            </RadioGroup>
            <!--选择模板-->
            <div
                class="nest-box freight-setting"
                v-if="model_dispatch_type === '1'"
            >
                <FormItem :label-width="0" prop="dispatch_id" :key="model_dispatch_id">
                    <Select
                        v-model="model_dispatch_id"
                        class="width-430"
                    >
                        <Option
                            v-for="item in dispatchList"
                            :value="item.id"
                            :key="item.id"
                        >{{ item.dispatch_name }}
                        </Option>
                    </Select>
                    <Button
                        type="text"
                        @click="refreshDispatchTemplate"
                    >
                        刷新
                    </Button>
                    <Button
                        type="text"
                        @click="addDispatchTemplate"
                    >
                        添加模板
                    </Button>
                    <kdx-hint-text content="运费模板支持按地区设置运费,按购买件数计算运费, 按重量计算运费等, 运费模板需要添加后刷新才能生效"></kdx-hint-text>
                </FormItem>
            </div>
            <!--统一运费-->
            <div
                class="nest-box freight-setting"
                v-if="model_dispatch_type === '2'"
            >
                <FormItem
                    prop="dispatch_price"
                    class="unify-freight"
                >
                    <kdx-rr-input
                        v-model="model_dispatch_price"
                        class="width-340"
                        number
                        :fixed="2"
                        :min-value="0"
                        :max-value="9999999.99"
                        :maxlength="10"
                        placeholder="请输入"
                    >
                        <span slot="append">元</span>
                    </kdx-rr-input>
                </FormItem>
            </div>
        </FormItem>
    </div>
</template>

<script>
import {modelMap, stateMap} from './binders.js'

export default {
    data() {
        return {}
    },
    computed: {
        ...modelMap(),
        ...stateMap(['dispatchList']),
        dispatchEnable() {
            return this.$store.getters['goodAddEdit/dispatchEnable']
        },
        isAddOperate() {
            return typeof this.$route.query.operate == 'undefined'
        },
    },
    watch: {},
    methods: {
        // 物流支持是否选中 0 普通快递
        expressSelected(code) {
            return new Set(this.$store.state.goodAddEdit.model.logistics_support).has(code)
        },
        refreshDispatchTemplate() {
            this.$store.dispatch('goodAddEdit/getDispatchTemplateList')
        },
        addDispatchTemplate() {
            this.$utils.openNewWindowPage('/order/ordinary-express/add')
        },
        // 跳转普通快递
        fnJumpOrdinaryExpress() {
            this.$utils.openNewWindowPage('/order/ordinary-express');
        },
        // 跳转同城配送
        fnJumpSamecityDelivery() {
            if(this.$ismultiMerchant) {
                this.$utils.openNewWindowPage('/order/delivery-setting');
            }else {
                this.$utils.openNewWindowPage('/order/same-city-delivery');
            }
        },
        choosePlace() {
            this.$refs.selector.setValue()
        },
        // 包邮和统一运费需要默认传个0
        changeDispatchCount(e) {
            this.model_dispatch_id = e == '1' ? '' : '0'
        },


    },
}
</script>

<style lang="scss" scoped>
.logistics-box {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }

    /deep/ .ivu-checkbox-disabled + span {
        color: #939799;
    }
}

.nest-box {

    &-table {
        margin-top: 10px;
        width: 810px;
        padding: 0 20px;
        background: #fff;
        border-radius: 2px;
    }

    /deep/ .ivu-form-item-error {
        .ivu-select-selection {
            border-color: $border-color;
            border-radius: 2px;
        }

        .ivu-select-arrow {
            color: #808695;
        }
    }
}

.create-point {
    color: #2d8cf0;
    cursor: pointer;
}
</style>
