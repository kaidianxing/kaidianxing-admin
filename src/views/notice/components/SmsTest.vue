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
    <div class="sms-test">
        <kdx-form-title>短信测试</kdx-form-title>
        <Form ref="form" :label-width="120" :model="smsTest" :rules="rules">
            <FormItem label="手机号：" prop="mobile">
                <Input class="width-340" v-model="smsTest.mobile" placeholder="请输入手机号码"></Input>
            </FormItem>
            <FormItem label="测试数据：">
                <div v-if="tableData.length<1">{{errors}}</div>
                <div v-for="(item,index) in tableData" :key="index" class="flex var-box">
                    <Input class="width-300" v-model="item.data_temp" :readonly="true">
                        <span slot="prepend">短信模板变量</span>
                    </Input>
                    <Input class="width-300" v-model="item.data_temp_test">
                        <span slot="prepend">短信模板变量值</span>
                    </Input>
                </div>
                <Button type="text" @click="send">发送测试</Button>
                <!--<div class="flex">
                    <div>
                        <Input class="width-340" v-model="smsTest.mobile" placeholder="请输入测试数据"></Input>
                        <kdx-hint-text>测试数据 最少四位</kdx-hint-text>
                    </div>
                    <div style="margin-left: 10px">
                        <Button type="text">发送测试</Button>
                    </div>
                </div>
                <div class="flex">
                    <div>
                        <Input class="width-340" v-model="smsTest.mobile" placeholder="请输入测试数据"></Input>
                        <kdx-hint-text>测试数据 最少四位</kdx-hint-text>
                    </div>
                    <div style="margin-left: 10px">
                        <Button type="text">发送测试</Button>
                    </div>
                </div>-->
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        name: "SmsTest",
        components: {},
        props: {
            tableData: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                errors: '未找到任何变量',
                smsTest: {
                    mobile: '',
                    test_data: ''
                },
                rules: {
                    mobile: [
                        {pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入11位手机号'}
                    ]
                }
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            validateTestForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            let obj = {
                                mobile: this.smsTest.mobile,
                                data: {}
                            };
                            for (let i = 0; i < this.tableData.length; i++) {
                                obj.data[this.tableData[i].data_temp] = this.tableData[i].data_temp_test
                            }
                            resolve(obj);
                        } else {
                            reject();
                        }
                    });
                });
            },
            send() {
                this.$emit('send')
            }
        },
    }
</script>

<style lang="scss">

</style>