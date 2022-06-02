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
    <kdx-content-bar :loading="loading">
        <div class="contact-us">
            <Form ref="form" :model="model" :rules="rules" :label-width="120">
                <kdx-form-title>联系我们</kdx-form-title>

                <FormItem
                    label="高德Web端(JS API)Key："
                    prop="amap_key"
                >
                    <Input
                        v-model="model.amap_key"
                        class="width-430"
                        placeholder="请输入"
                        :disabled="noManagePerm"
                    />
                    <kdx-hint-text>
                        <div class="flex align-center">
                            <div class="text">
                                注册高德地图帐号并访问高德开放平台申请高德Web端(JS
                                API)key，
                            </div>
                            <div class="btn-box">
                                <Button type="text" @click="fnGoAMap">
                                    立即申请
                                </Button>
                            </div>
                            <kdx-hint-tooltip
                                type="image"
                                :image="
                                    require('@/assets/image/order/amap_web_jsapi.png')
                                "
                                :maxWidth="730"
                                width="690px"
                            ></kdx-hint-tooltip>
                        </div>
                    </kdx-hint-text>
                </FormItem>
                <FormItem
                    label="高德Web端(JS API)安全密钥："
                    prop="amap_code"
                >
                    <Input
                        v-model="model.amap_code"
                        class="width-430"
                        placeholder="请输入"
                        :disabled="noManagePerm"
                        @on-blur="configBlur"
                    />
                </FormItem>
                <FormItem label="高德Web服务接口Key：" prop="web_key" v-error-item.web_key >
                    <Input
                            v-model="model.web_key"
                            class="width-430"
                            placeholder="请输入"
                            show-word-limit
                            :maxlength="50"
                    />
                    <kdx-hint-text>
                        <div class="flex align-center">
                            <div class="text">
                                注册高德地图帐号并访问高德开放平台申请Web服务接口key，此web服务接口key ，
                            </div>
                            <div class="btn-box">
                                <Button type="text" @click="fnGoAMap">
                                    立即申请
                                </Button>
                            </div>
                            <kdx-hint-tooltip
                                    type="image"
                                    :image="
                                        require('@/assets/image/order/amap_web_service.png')
                                    "
                                    :maxWidth="730"
                                    width="690px"
                            ></kdx-hint-tooltip>
                        </div>
                    </kdx-hint-text>
                </FormItem>

                <FormItem label="联系人：" prop="contact">
                    <Input
                        v-model="model.contact"
                        class="width-330"
                        placeholder="请输入"
                        :disabled="noManagePerm"
                    />
                </FormItem>
                <FormItem label="联系电话1：" prop="tel1">
                    <Input
                        v-model="model.tel1"
                        class="width-330"
                        placeholder="请输入"
                        :disabled="noManagePerm"
                    />
                </FormItem>
                <FormItem label="联系电话2：" prop="tel2">
                    <Input
                        v-model="model.tel2"
                        class="width-330"
                        placeholder="请输入"
                        :disabled="noManagePerm"
                    />
                </FormItem>
                <FormItem
                    label="所属区域："
                    prop="selectedAddress"
                >
                    <Cascader
                        class="width-330"
                        :data="addressData"
                        v-model="model.selectedAddress"
                        :disabled="noManagePerm"
                    ></Cascader>
                </FormItem>
                <FormItem
                    label="详细地址："
                    prop="detail"
                >
                    <i-input
                        v-model="model.detail"
                        class="width-500"
                        placeholder="请输入"
                        :disabled="noManagePerm"
                    >
                        <span class="search" slot="append" @click="searchMap">
                            搜索地图
                        </span>
                    </i-input>
                </FormItem>
                <FormItem label="地图定位：">
                    <div class="map-box">
                        <Map
                            ref="amap"
                            :aMapKey="model.amap_key"
                            :location="location"
                            :addMapClickEvent="true"
                            @aMapInitFinished="aMapInitFinished"
                            @getAddress="getAddress"
                        />
                    </div>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button
                class="primary-long"
                :disabled="noManagePerm"
                @click="handleSave"
                >保存</Button
            >
        </template>
        <modify-address-modal
            v-model="showModal"
            okText="确定"
            @handleOk="handleOk"
        />
    </kdx-content-bar>
</template>

<script>
import Map from '@/components/Map'
import ModifyAddressModal from '@/components/ModifyAddressModal'
export default {
    components: {
        Map,
        ModifyAddressModal,
    },
    data() {
        return {
            loading: false,
            showModal: false,
            cacheModel: {
                address: {
                    lng: '',
                    lat: '',
                },
            },
            model: {
                // amap_key: '2eb151002cc53dfbd3c4c7a6a0a7fd99',
                amap_key: '',
                amap_code: '',
                web_key: '',
                contact: '',
                tel1: '',
                tel2: '',
                selectedAddress: [],
                detail: '',
                lng: '',
                lat: '',
            },
            location: '', // 位置
            rules: {
                amap_key: [
                    { required: true, message: '高德Web端(JS API)Key必填' },
                ],
                web_key: [
                    { required: true, message: '高德Web服务接口Key必填' },
                ],
                contact: [{ required: true, message: '联系人必填' }],
                tel1: [{ required: true, message: '联系方式1必填' }],
                selectedAddress: [{ required: true, message: '所属区域必选' }],
                detail: [{ required: true, message: '详细地址必填' }],
            },
        }
    },
    computed: {
        addressData() {
            return this.$store.state.config?.address || []
        },
        noManagePerm() {
            //管理权限
            return !this.$getPermMap('sysset.mall.contact.manage')
        },
    },
    created() {
        this.$store.dispatch('config/getAddress')
        this.getContactDetail()
    },
    methods: {
        // 跳转高德开放平台
        fnGoAMap() {
            window.open('https://lbs.amap.com')
        },
        // 高德初始化完成
        aMapInitFinished() {
            // 添加标记
            if (this.model.lng && this.model.lat) {
                // 存在地址信息，初始化
                let formattedAddress = `${this.model.selectedAddress.join('')}${
                    this.model.detail
                }`
                this.$refs['amap'].addMarker(
                    this.model.lng,
                    this.model.lat,
                    formattedAddress
                )
                this.$refs['amap'].setCenter(this.model.lng, this.model.lat)
            }
        },
        // 获取详情
        getContactDetail() {
            this.loading = true
            this.$api.orderApi.getContactDetail({}).then((res) => {
                this.loading = false
                if (res.error === 0) {
                    if (res.data?.address?.lng) {
                        res.data.address.lng = parseFloat(res.data.address.lng)
                    }
                    if (res.data?.address?.lat) {
                        res.data.address.lat = parseFloat(res.data.address.lat)
                    }
                    this.cacheModel = {
                        ...res.data,
                    }
                    this.model = {
                        ...this.model,
                        ...res.data,
                        ...res.data?.address,
                    }
                    if (
                        this.model.province &&
                        this.model.city &&
                        this.model.area
                    ) {
                        let arr = [
                            this.model.province,
                            this.model.city,
                            this.model.area,
                        ]
                        this.model.selectedAddress = [...arr]
                    } else {
                        this.model.selectedAddress = []
                    }
                    this.configBlur()
                }
            })
        },
        // 搜索地图
        searchMap() {
            setTimeout(()=> {
                this.location = `${this.model.selectedAddress.join('')}${
                    this.model.detail
                }`
                if(this.location) {
                    this.$nextTick(()=> {
                        this.$refs.amap.geocoder('getLocation')
                    })
                }
            },800)
        },
        // key或者安全密钥失焦
        configBlur() {
            this.$refs.amap.changeKey(this.model.amap_key.trim(), this.model.amap_code.trim())
        },
        // 获取地址信息
        getAddress(data) {
            if (data.selectedAddress) {
                this.model.selectedAddress = [...data.selectedAddress]
            }
            if (data.address) {
                this.model.detail = data.address
            }
            this.model.lng = data.lng
            this.model.lat = data.lat
            // 校验地址是否发生变化
            if (
                (this.model.lng !== this.cacheModel?.address?.lng &&
                    this.cacheModel?.address?.lng) ||
                (this.model.lat !== this.cacheModel?.address?.lat &&
                    this.cacheModel?.address?.lat)
            ) {
                this.$Message.warning('店铺地址发生变化，注意及时保存哦')
            }
        },
        // 保存
        handleSave() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                        // 不是平台端  走之前的逻辑
                        if (this.model.lng && this.model.lat) {
                            // 校验地址是否发生变化
                            if (
                                (this.model.lng !== this.cacheModel?.address?.lng ) ||
                                (this.model.lat !== this.cacheModel?.address?.lat)
                            ) {
                                // this.showModal = true
                                this.handleOk()
                                return
                            }
                            let _param = this.formatParam()
                            this.saveContact(_param)
                        } else {
                            this.$Message.error(
                                '获取定位失败，请点击搜索地图重新定位'
                            )
                        }
                    // } else {
                    //     // 平台端
                    //     let _param = this.formatParam1()
                    //     this.saveContact(_param)
                    // }
                }
            })
        },
        formatParam() {
            let pItem, cItem, aItem;
            let [pName, cName, aName] = this.model.selectedAddress
            for (pItem of this.addressData) {
                if (pItem.name === pName) {
                    break;
                }
            }

            for (cItem of pItem.children) {
                if (cItem.name === cName) {
                    break;
                }
            }

            for (aItem of cItem.children) {
                if (aItem.name === aName) {
                    break;
                }
            }

            let addressInfo = {
                province: pItem?.label,
                province_code: pItem?.id,
                city: cItem?.label,
                city_code: cItem?.id,
                area: aItem?.label,
                area_code: aItem?.id
            }

            this.model = {
                ...this.model,
                ...addressInfo
            }
            let {
                amap_key,
                amap_code,
                web_key,
                contact,
                tel1,
                tel2,
                province,
                province_code,
                city,
                city_code,
                area,
                area_code,
                detail,
                lng,
                lat,
            } = this.model
            let _param = {
                amap_key: amap_key.trim(),
                amap_code,
                web_key: web_key.trim(),
                contact,
                tel1,
                tel2,
                province,
                province_code,
                city,
                city_code,
                area,
                area_code,
                detail,
                lng,
                lat,
            }
            return _param
        },
        formatParam1() {
            let { contact, tel1, tel2 } = this.model
            let _param = { contact, tel1, tel2 }
            return _param
        },
        // 保存联系信息
        saveContact(data) {
            this.$api.orderApi.saveContact(data).then((res) => {
                if (res.error === 0) {
                    this.$Message.success('保存成功')
                    // 替换缓存地址信息
                    this.cacheModel.address.lng = this.model.lng
                    this.cacheModel.address.lat = this.model.lat
                }
            })
        },
        handleOk() {
            let _param = this.formatParam()
            this.saveContact(_param)
        },
    },
}
</script>

<style scoped lang="scss">
.contact-us {
    padding: 40px 40px 30px 40px;
    background-color: #ffffff;
    margin-top: 20px;
    /deep/ .ivu-input-group-append {
        background-color: transparent;
    }
    .search {
        cursor: pointer;
        color: $brand-color;
    }
}
</style>
