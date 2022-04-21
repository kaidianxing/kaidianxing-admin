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
    <div>
        <kdx-content-bar>
            <div class="container">
                <div class="title">
                    <kdx-form-title :hasMargin="false">下载对账单</kdx-form-title>
                </div>
                <div class="tips">
                    <kdx-hint-alert :showIcon="false">
                        <p>
                            每日9:00前完成数据更新，当前数据更新至 2020-01-13
                        </p>
                        <p>
                            微信在次日9点启动生成前一天的对账单，建议商户10点后再获取；
                        </p>
                        <p>
                            对账单中涉及金额的字段单位为“元”。
                        </p>
                        <p>
                            下载账单接口为单日期接口，请尽量保持账单时间段不要过长。
                        </p>
                    </kdx-hint-alert>
                </div>
                <Form ref="form" :model="formData" :label-width="120">
                    <FormItem label="账单类型：">
                        <RadioGroup v-model="formData.type">
                            <Radio label="1">
                                <span>所有账单</span>
                            </Radio>
                            <Radio label="2">
                                <span>支付账单</span>
                            </Radio>
                            <Radio label="3">
                                <span>退款账单</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="账单时间：">
                        <DatePicker
                            v-model="selectDate"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm"
                            placeholder="请选择"
                            class="width-340"
                            :confirm="true"
                        ></DatePicker>
                    </FormItem>
                </Form>
            </div>
            <template #btn>
                <Button
                    type="primary"
                    :loading="submitLoading"
                    @click="handleExport"
                >
                    导出
                </Button>
            </template>
        </kdx-content-bar>
    </div>
</template>

<script>
import { formatDate } from '@/assets/helpers/index'
// import { config as settings } from '@/api/config/settings.js'
export default {
    components: {},
    props: {},
    data() {
        return {
            selectDate: ['', ''],
            formData: {
                startTime: '',
                endTime: '',
                type: ''
            },
            submitLoading: false
        }
    },
    watch: {
        selectDate: {
            handler(value) {
                this.formData.startTime =
                    value[0] === ''
                        ? ''
                        : formatDate(new Date(value[0]), 'yyyy-MM-dd hh:mm:ss')
                this.formData.endTime =
                    value[1] === ''
                        ? ''
                        : formatDate(new Date(value[1]), 'yyyy-MM-dd hh:mm:ss')
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        // this.getRoleList()
    },
    methods: {
        // 点击导出按钮
        handleExport() {
            // const base_url = settings.base_url
            // let type = this.formData.type
            // let downloadurl = `${base_url}/finance/credit-record/integral&type=${type}&export=1`
            // if (this.formData.startTime) {
            //     downloadurl = `${downloadurl}&created_at[0]=${this.formData.startTime}`
            // }
            // if (this.formData.endTime) {
            //     downloadurl = `${downloadurl}&created_at[1]=${this.formData.endTime}`
            // }
            // window.location.href = downloadurl
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    padding-top: 40px;
    padding-left: 40px;
    padding-right: 40px;
    .tips {
        margin-top: 10px;
        margin-bottom: 30px;
    }
}
</style>
