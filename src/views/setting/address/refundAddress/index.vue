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
        <div class="refund-address">
            <kdx-form-title>{{ type }}</kdx-form-title>
            <Form ref="form" :label-width="120" :model="refundData" :rules="rule">
                <FormItem label="退货地址名称：" prop="title">
                    <Input class="width-250" v-model="refundData.title"></Input>
                </FormItem>
                <FormItem label="联系人：" prop="name">
                    <Input class="width-250" v-model="refundData.name"></Input>
                </FormItem>
                <FormItem label="手机号：" prop="mobile">
                    <kdx-rr-input class="width-250" v-model="refundData.mobile" number :fixed="0"></kdx-rr-input>
                </FormItem>
                <FormItem label="电话：">
                    <Input class="width-250" v-model="refundData.tel"></Input>
                </FormItem>
                <FormItem label="邮编：">
                    <Input class="width-250" v-model="refundData.zip_code"></Input>
                </FormItem>
                <FormItem label="所属地区：" required :error="error">
                    <Cascader :data="addressData" v-model="chooseArea" class="width-430"
                              @on-change="changeArea"></Cascader>
                </FormItem>
                <FormItem label="详细地址：" prop="address">
                    <Input v-model="refundData.address" class="width-430" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="是否默认：" class="r-form-item-checkbox">
                    <RadioGroup v-model="refundData.is_default">
                        <Radio :label="1">
                            <span>是</span>
                        </Radio>
                        <Radio :label="0">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :loading="submitLoading" @click="handleSave">保存</Button>
            <Button class="default-long" @click="handleCancel">取消</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
    export default {
        props: {},
        data() {
            return {
                type: '添加退货地址',
                id: '',
                submitLoading: false,
                refundData: {
                    is_default: 0,
                    title: '',
                    name: '',
                    mobile: '',
                    tel: '',
                    zip_code: '',
                    address: '',
                },
                chooseArea: [],
                error: '',
                rule: {
                    title: [
                        {required: true, message: '请填写退货地址名称'}
                    ],
                    name: [{required: true, message: '请填写联系人'}],
                    mobile: [
                        {required: true, message: '请填写手机号'},
                        {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码'},
                    ],
                    address: [
                        {required: true, message: '请填写详细地址'}
                    ]
                }
            }
        },
        computed: {
            addressData() {
                return this.$store.state.config.address;
            }
        },
        created() {
            this.$store.dispatch('config/getAddress')
        },
        mounted() {
            if (this.$route.params.type == 'edit') {
                this.type = '编辑退货地址';
                this.id = this.$route.query.id;
                this.getDetail()
            }
        },
        methods: {
            getDetail() {
                this.$api.settingApi.detailRefundAddress({id: this.id}).then(res => {
                    if (res.error == 0) {
                        this.refundData = res.data;
                        this.chooseArea = [res.data.province, res.data.city, res.data.area];
                    }
                })
            },
            changeArea(val) {
                console.log('area', val);
                if (val.length) {
                    this.error = '';
                }
            },
            // 表单验证
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            resolve(valid)
                        } else {
                            reject();
                            if (this.chooseArea.length <= 0) {
                                this.error = '请添加所属地区';
                            }
                        }
                    })
                })
            },
            handleSave() {
                this.submitLoading = true;
                this.customForm()
            },
            async customForm() {
                try {
                    await this.validateForm();
                    this.submit()
                } catch (e) {
                    this.submitLoading = false
                }
            },
            submit() {
                if (this.chooseArea.length <= 0) {
                    this.error = '请添加所属地区';
                    this.submitLoading = false;
                    return
                }
                let obj = {
                    ...this.refundData,
                    province: this.chooseArea[0] || '',
                    city: this.chooseArea[1] || '',
                    area: this.chooseArea[2] || ''
                };
                if (this.id) {
                    obj.id = this.id
                }
                this.$api.settingApi[this.id ? 'editRefundAddress' : 'addRefundAddress']({...obj}).then(res => {
                    if (res.error == 0) {
                        this.$Message.success('保存成功');
                        setTimeout(() => {
                            this.$router.push({
                                path: '/setting/address/refundAddress/list'
                            })
                        }, 1500)
                    }
                    this.submitLoading = false
                })
            },
            handleCancel() {
                this.$router.push({
                    path: '/setting/address/refundAddress/list'
                })
            }
        }
    }
</script>

<style lang="scss">
    .refund-address {
        padding: 40px;
        background-color: #FFFFFF;
        min-height: 100%;
        margin-top: 20px;
        border-radius: 2px;
    }
</style>
