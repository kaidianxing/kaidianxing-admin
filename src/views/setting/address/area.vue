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
        <div class="address-area">
            <!-- 不配送区域设置 -->
            <dispatch :deny_area="addressData.deny_area" :delivery_area="addressData.delivery_area" v-model="addressData.delivery_type" @regionSelectOk="regionSelectOk"></dispatch>
            <!-- 微信共享收货地址 -->
            <div class="wechat-share-address">
                <kdx-form-title>获取微信共享收货地址</kdx-form-title>
                <Form ref="form" :label-width="120">
                    <FormItem label="是否开启：" class="r-form-item-checkbox">
                        <RadioGroup v-model="addressData.wechat_address">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>开启</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="0">
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                        <kdx-hint-text>是否在用户添加收货地址时获取用户的微信收货地址</kdx-hint-text>
                    </FormItem>
                </Form>
            </div>
            <!-- 地址库设置 -->
            <!--<div class="address-library">
                <kdx-form-title>地址库设置</kdx-form-title>
                <Form ref="form" :label-width="150">
                    <FormItem label="地址库选择：" class="r-form-item-checkbox">
                        <RadioGroup v-model="addressData.address_type">
                            <Radio label="1">
                                <span>旧版</span>
                            </Radio>
                            <Radio label="2">
                                <span>新版（数据更新并含街道信息）</span>
                            </Radio>
                        </RadioGroup>
                        <kdx-hint-text>新版与旧版数据不兼容，开启后，用户地址库将被清空，并且不能在切换回旧版，请谨慎选择！</kdx-hint-text>
                    </FormItem>
                    <FormItem label="收货地址开启街道：" class="r-form-item-checkbox">
                        <RadioGroup v-model="addressData.street_state">
                            <Radio label="1">
                                <span>是</span>
                            </Radio>
                            <Radio label="0">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </div>-->
        </div>
        <template #btn>
            <Button class="primary-long" :disabled='noManagePerm' @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>

    import Dispatch from './components/Dispatch'

    export default {
        components: {
            Dispatch
        },
        props: {},
        data() {
            return {
                addressData: {
                    deny_area: {},
                    wechat_address: '0',
                    address_type: 2,
                    street_state: 1,
                    delivery_type: '0',
                    delivery_area: {}
                },
                noDispatch: {}
            }
        }, 
        computed: {
            noManagePerm(){//管理权限
                return !this.$getPermMap('sysset.address_set.manage')
            },
        },
        created() {
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                this.$api.settingApi.getAddressInfo({}).then(res => {
                    if (res.error == 0) {
                        this.addressData = res;
                        this.addressData.deny_area = res.deny_area ? JSON.parse(res.deny_area) : '';
                        this.addressData.delivery_area = res.delivery_area ? JSON.parse(res.delivery_area) : '';
                        this.addressData.delivery_type = res.delivery_type || '0'
                    }
                })
            },
            regionSelectOk(data) {
                if(this.addressData.delivery_type == '1'){
                    this.addressData.delivery_area = data || {}
                } else {
                    this.addressData.deny_area = data || {}
                }
            },
            handleSave() {
                let obj = {
                    ...this.addressData,
                    deny_area: JSON.stringify(this.addressData.deny_area),
                    delivery_area: JSON.stringify(this.addressData.delivery_area)
                };
                this.$api.settingApi.setAddressInfo(obj).then(res => {
                    if (res.error == 0) {
                        this.getData();
                        this.$Message.success('保存成功')
                    }
                })
            }
        },
    }
</script>

<style lang="scss">
    .address-area {
        height: 100%;
        //background-color: $background-color;
        background-color: #ffffff;
        padding: 40px;
        margin: 20px auto 0;
        border-radius: 2px;
    }
</style>
