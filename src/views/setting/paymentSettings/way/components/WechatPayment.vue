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
            <div class="content">
                <div class="wechat">
                    <kdx-form-title>
                        微信支付
                    </kdx-form-title>
                    <Form ref="form1" :model="formData.part1" :label-width="140">
                        <FormItem label="微信支付">
                            <RadioGroup>
                                <Radio :disabled='noManagePerm' label="1"></Radio>
                                <Radio :disabled='noManagePerm' label="0"></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="选择支付"></FormItem>

                    </Form>
                </div>
            </div>
        </kdx-content-bar>
    </div>
</template>

<script>
    export default {
        name: "WechatPayment",
        computed: {
            noManagePerm(){//管理权限
                return !this.$getPermMap('sysset.pay-type_set.manage')
            },
        },
    }
</script>

<style scoped>

</style>