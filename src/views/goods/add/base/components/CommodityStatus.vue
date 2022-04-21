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
        <kdx-form-title content="商品状态"></kdx-form-title>
        <FormItem label="上架设置：" prop="status" class="r-form-item-checkbox">
            <RadioGroup v-model="model_status" @on-change="changeStatus">
                <Radio label="1" >
                    <span>上架</span>
                </Radio>
                <Radio label="0" >
                    <span>保存至仓库</span>
                </Radio>
                <Radio label="2" >
                    <span>自动上架</span>
                </Radio>
            </RadioGroup>
            <div class="nest-box" v-if="model_status === '2'">
                <FormItem
                    label="选择时间："
                    style="margin-bottom: 0"
                    prop="putaway_time"
                >
                    <DatePicker
                        class="width-430"
                        placeholder="选择时间"
                        type="datetime"
                        :options="dateOptions"
                        v-model="model_putaway_time"
                    ></DatePicker>
                </FormItem>
            </div>
        </FormItem>
        <FormItem label="退换货：" class="r-form-item-checkbox" v-if="model_type !== '2'">
            <Checkbox
                v-model="model_ext_field.refund"
                true-value="1"
                false-value="0"
            >
                退款
            </Checkbox>
            <Checkbox
                v-model="model_ext_field.return"
                true-value="1"
                false-value="0"
                v-if="model_type === '0'"
            >
                退货退款
            </Checkbox>
            <Checkbox
                v-model="model_ext_field.exchange"
                true-value="1"
                false-value="0"
                v-if="model_type === '0'"
            >
                换货
            </Checkbox>
            <kdx-hint-text>
                勾选后支持整单售后, 多个商品同时满足相同条件可发起售后,
                如需单件商品支持售后时, 需要开启
                <Button
                    type="text"
                    to="/setting/safeguard/index"
                    target="_blank"
                >
                    【支持单品售后】
                </Button>
            </kdx-hint-text>
        </FormItem>
        <FormItem
            label="货到付款："
            prop="ext_field.is_delivery_pay"
            class="r-form-item-checkbox"
            v-if="model_type === '0'"
        >
            <RadioGroup v-model="model_ext_field.is_delivery_pay">
                <Radio label="1">
                    <span>是</span>
                </Radio>
                <Radio label="0">
                    <span>否</span>
                </Radio>
            </RadioGroup>
        </FormItem>
    </div>
</template>

<script>
import { modelMap } from './binders.js'
export default {
    props: {
        form_status: {
            type: [String, Number],
            default: -1
        }
    },
    data() {
        return {
            dateOptions: {
                disabledDate(date) {
                    return date.valueOf() < Date.now()
                },
            },
        }
    },
    computed: {
        ...modelMap(),
    },

    methods: {
        changeAutoStatus(val) {
            if (val) {
                this.model_status = ''
            }
        },
        changeStatus(val) {
            if (val) {
                this.model_ext_field.auto_putaway = '0'
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.nest-box /deep/ .ivu-form-item-error-tip {
    margin-left: 120px;
}
</style>
