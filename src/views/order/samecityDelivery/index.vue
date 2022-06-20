<template>
    <kdx-content-bar :loading="loading">
        <div class="delivery-type-box">
            <delivery-type
                ref="deliveryType"
                type="samecityDelivery"
                @change="handleChange"
            />
        </div>
        <div class="same-city-delivery">
            <Form ref="form" :model="model" :rules="rules" :label-width="120" @on-validate='onValidate'>
                <div class="delivery-type">
                    <kdx-form-title>配送方式</kdx-form-title>
                    <FormItem label="配送方式：" prop="delivery_type" v-error-item.delivery_type>
                        <CheckboxGroup v-model="model.delivery_type">
                            <div class="checkbox-box">
                                <Checkbox label="1">
                                    商家配送
                                </Checkbox>
                                <Checkbox label="2">
                                    达达配送
                                </Checkbox>
                                <kdx-hint-text>
                                    开启后将由达达平台为您配送
                                </kdx-hint-text>
                            </div>
                        </CheckboxGroup>
                        <div
                            class="next-box"
                            v-if="new Set(model.delivery_type).has('2')"
                        >
                            <distribution-item ref="distribution_third"  :info-checked="distribution.infoChecked" :info-list="distribution.infoList" :model="model" @on-tab-change="changeInfoTab"></distribution-item>
                        </div>
                    </FormItem>
                    <FormItem label="送达时间：">
                        <RadioGroup v-model="model.delivery_time">
                            <Radio :label="1">开启</Radio>
                            <Radio :label="0">关闭</Radio>
                        </RadioGroup>
                        <kdx-hint-text>
                            启用后对于同城配送订单，用户在确认订单页面必须选择送达时间，关闭时用户端不显示送达时间选项
                        </kdx-hint-text>
                        <div class="next-box" v-if="model.delivery_time === 1">
                            <FormItem label="时段划分单位："  prop="delivery_time_settings.time_span">
                                <kdx-rr-input class="width-160" v-model="model.delivery_time_settings.time_span" number :fixed="0" :minValue="10" :maxValue="1440" @on-blur="handleBlur">
                                    <span slot="append">分钟</span>
                                </kdx-rr-input>
                                <kdx-hint-text style="margin-left: 120px;">支持设置10-1440分钟</kdx-hint-text>
                            </FormItem>
                            <FormItem label="起止时间："  prop="delivery_time_settings.start">
                                <TimePicker v-model="model.delivery_time_settings.time" class="width-160" format="HH:mm" type="timerange" :editable="false" placement="bottom-end" placeholder="请选择时间" @on-change="changeTime"></TimePicker>
                            </FormItem>
                            <!-- 自动划分-起止时间-时段跨度都存在 -->
                            <FormItem label="" v-if="model.delivery_time_settings.span_detail.length>0">
                                <div class="time-part">
                                    <div class="time-item flex">
                                        <div v-for="(item, index) in model.delivery_time_settings.span_detail" :key="index+Math.random()">{{item}}</div>
                                    </div>
                                </div>
                            </FormItem>
                        </div>
                    </FormItem>
                </div>
                <div class="regional-settings">
                    <kdx-form-title>配送区域设置</kdx-form-title>
                    <FormItem label="店铺地址：" prop="address" v-error-item.address>
                        <Input
                            class="width-430"
                            placeholder="未检测到店铺地址，请尽快设置"
                            disabled
                            v-model="model.address"
                        />
                        <kdx-hint-text>
                            <div class="flex align-center">
                                <div class="text">
                                    配送区域以此地址为起点进行距离计算，
                                </div>
                                <div class="btn-box">
                                    <Button
                                        type="text"
                                        class="marginR-10"
                                        to="/setting/shopSetting/contactUs/index"
                                        v-if="!model.address"
                                    >
                                        立即设置
                                    </Button>
                                    <Button
                                        type="text"
                                        @click="fnModifyShopAddress"
                                        v-else
                                    >
                                        修改
                                    </Button>
                                </div>
                            </div>
                        </kdx-hint-text>
                    </FormItem>
                    <FormItem label="高德Web服务接口Key：" prop="amap_key" v-error-item.amap_key>
                        <Input
                            v-model="model.amap_key"
                            disabled
                            class="width-430"
                            placeholder="请输入"
                            show-word-limit
                            :maxlength="50"
                        />
                        <kdx-hint-text>
                            <div class="flex align-center">
                                <div class="text">
                                    接口用于同城配送中用户定位，
                                </div>
                                <div class="btn-box">
                                    <Button type="text" to="/setting/shopSetting/contactUs/index" target="_blank">{{ `${model.amap_key ? '修改' : '立即设置'}` }}</Button>
                                </div>
                            </div>
                        </kdx-hint-text>
                    </FormItem>
                    <FormItem
                        label="配送区域："
                        prop="delivery_area"
                        v-if="model.address"
                    >
                        <RadioGroup
                            v-model="model.delivery_area"
                            @on-change="deliveryAreaChange"
                        >
                            <Radio :label="0">按不同区域</Radio>
                            <Radio :label="1">按不同距离</Radio>
                            <Radio :label="2">按行政区域</Radio>
                        </RadioGroup>
                        <kdx-hint-text>
                            配送区域内商品会不计算距离，按区域收取固定配送费。<br />订单中商品在优惠前的价格（不包含运费）低于起送金额时，买家无法下单
                        </kdx-hint-text>
                    </FormItem>
                    <FormItem
                        label="划分方式："
                        prop="division_way"
                        v-show="model.address && model.delivery_area !== 2"
                    >
                        <RadioGroup
                            v-model="model.division_way"
                            @on-change="changeDivisionWay"
                        >
                            <Radio :label="0">按半径划分</Radio>
                            <Radio :label="1">自定义</Radio>
                        </RadioGroup>
                        <kdx-hint-text>
                            当配送区域交叉时，以最低费用计算费用。因考虑实际送货路况，<br />配送费按汽车导航距离计算，非地图直线距离。
                        </kdx-hint-text>
                        <div class="next-box flex">
                            <div class="left">
                                <add-region
                                    ref="addRegion"
                                    v-model="regionList"
                                    :delivery_area="model.delivery_area"
                                    :division_way="model.division_way"
                                    @addRegion="addRegion"
                                    @deleteRegion="deleteRegion"
                                    @changeCircleRadius="changeCircleRadius"
                                    @showCircleEditor="showCircleEditor"
                                    @showPolyEditor="showPolyEditor"
                                />
                            </div>
                            <div class="right">
                                <Map
                                    ref="amap"
                                    v-model="regionList"
                                    :aMapKey="amap_key"
                                    :aMapCode="amap_code"
                                    :division_way="model.division_way"
                                    @addCircle="addCircle"
                                    @addPolygon="addPolygon"
                                    @changeRegionSelected="changeRegionSelected"
                                />
                            </div>
                        </div>
                    </FormItem>
                    <FormItem
                        label="可配送区域："
                        prop="dispatch_barrio"
                        v-if="model.address && model.delivery_area === 2"
                    >
                        <Select
                            v-model="model.dispatch_barrio"
                            multiple
                            class="width-300"
                        >
                            <Option
                                v-for="item in areaList"
                                :value="item.value"
                                :key="item.value"
                            >
                                {{ item.label }}
                            </Option>
                        </Select>
                        <kdx-hint-text>
                            若开启第三方配送，清不要选择默认配送地址以外的城市区域
                        </kdx-hint-text>
                    </FormItem>
                    <FormItem
                        label="起送金额："
                        prop="barrio_rule.initial_price"
                        v-error-item.barrio_rule.initial_price
                        v-if="model.address && model.delivery_area === 2"
                    >
                        <kdx-rr-input
                            class="width-300"
                            placeholder="0.00"
                            number
                            :fixed="2"
                            :maxValue="9999999.99"
                            v-model="model.barrio_rule.initial_price"
                        >
                            <span slot="append">元</span>
                        </kdx-rr-input>
                        <kdx-hint-text>
                            订单中商品在优惠券的价格（不包含运费）低于配送价时，买家无法下单
                        </kdx-hint-text>
                    </FormItem>
                    <FormItem
                        label="配送费："
                        prop="barrio_rule.dispatch_price"
                        v-error-item.barrio_rule.dispatch_price
                        v-if="model.address && model.delivery_area === 2"
                    >
                        <kdx-rr-input
                            class="width-300"
                            placeholder="0.00"
                            number
                            :fixed="2"
                            :maxValue="9999999.99"
                            v-model="model.barrio_rule.dispatch_price"
                        >
                            <span slot="append">元</span>
                        </kdx-rr-input>
                    </FormItem>
                    <FormItem
                        label="计费方式："
                        prop="jffs"
                        v-error-item.jffs
                        v-if="model.address && model.delivery_area === 1"
                    >
                        <div class="flex align-center">
                            <span style="width: 110px">配送距离</span>
                            <FormItem
                                label=""
                                style="margin-bottom: 0;margin-right: 10px;"
                                prop="dispatch_rule.initial_distance"
                                v-error-item.dispatch_rule.initial_distance
                                :show-message="false"
                            >
                                <kdx-rr-input
                                    class="width-120"
                                    placeholder="0.00"
                                    number
                                    :fixed="2"
                                    :maxValue="9999999.99"
                                    v-model="
                                        model.dispatch_rule.initial_distance
                                    "
                                >
                                    <span slot="append">km</span>
                                </kdx-rr-input>
                            </FormItem>
                            <span style="width: 95px">内，配送费用</span>
                            <FormItem
                                label=""
                                style="margin-bottom: 0;margin-right: 10px;"
                                prop="dispatch_rule.initial_dispatch_price"
                                v-error-item.dispatch_rule.initial_dispatch_price
                                :show-message="false"
                            >
                                <kdx-rr-input
                                    class="width-120"
                                    placeholder="0.00"
                                    number
                                    :fixed="2"
                                    :maxValue="9999999.99"
                                    v-model="
                                        model.dispatch_rule
                                            .initial_dispatch_price
                                    "
                                >
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                            </FormItem>
                        </div>
                        <div
                            class="flex align-center"
                            style="margin-top: 16px;"
                        >
                            <span style="width: 110px">配送距离每增加</span>
                            <FormItem
                                label=""
                                style="margin-bottom: 0;margin-right: 10px;"
                                prop="dispatch_rule.increase_distance"
                                v-error-item.dispatch_rule.increase_distance
                                :show-message="false"
                            >
                                <kdx-rr-input
                                    class="width-120"
                                    placeholder="0.00"
                                    number
                                    :fixed="2"
                                    :maxValue="9999999.99"
                                    v-model="
                                        model.dispatch_rule.increase_distance
                                    "
                                >
                                    <span slot="append">km</span>
                                </kdx-rr-input>
                            </FormItem>
                            <span style="width: 95px">运费将增加</span>
                            <FormItem
                                label=""
                                style="margin-bottom: 0;margin-right: 10px;"
                                prop="dispatch_rule.increase_distance_price"
                                v-error-item.dispatch_rule.increase_distance_price
                                :show-message="false"
                            >
                                <kdx-rr-input
                                    class="width-120"
                                    placeholder="0.00"
                                    number
                                    :fixed="2"
                                    :maxValue="9999999.99"
                                    v-model="
                                        model.dispatch_rule
                                            .increase_distance_price
                                    "
                                >
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                            </FormItem>
                        </div>
                        <div
                            class="flex align-center"
                            style="margin-top: 16px;"
                        >
                            <span style="width: 110px">超出</span>
                            <FormItem
                                label=""
                                style="margin-bottom: 0;margin-right: 10px;"
                                prop="dispatch_rule.over_distance"
                                v-error-item.dispatch_rule.over_distance
                                :show-message="false"
                            >
                                <kdx-rr-input
                                    class="width-120"
                                    placeholder="0.00"
                                    number
                                    :fixed="2"
                                    :maxValue="9999999.99"
                                    v-model="model.dispatch_rule.over_distance"
                                >
                                    <span slot="append">km</span>
                                </kdx-rr-input>
                            </FormItem>
                            <span style="width:95px">固定运费</span>
                            <FormItem
                                label=""
                                style="margin-bottom: 0;margin-right: 10px;"
                                prop="dispatch_rule.over_distance_fix_price"
                                v-error-item.dispatch_rule.over_distance_fix_price
                                :show-message="false"
                            >
                                <kdx-rr-input
                                    class="width-120"
                                    placeholder="0.00"
                                    number
                                    :fixed="2"
                                    :maxValue="9999999.99"
                                    v-model="
                                        model.dispatch_rule
                                            .over_distance_fix_price
                                    "
                                >
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                            </FormItem>
                        </div>
                    </FormItem>
                    <FormItem
                        label="续重收费："
                        prop="xzsf"
                        v-error-item.xzsf
                        v-if="model.address && model.delivery_area !== 2"
                    >
                        <div class="flex align-center">
                            商品重量
                            <FormItem
                                label=""
                                style="margin-bottom: 0;margin-left: 10px;margin-right: 10px;"
                                prop="dispatch_rule.initial_weight"
                                v-error-item.dispatch_rule.initial_weight
                                :show-message="false"
                            >
                                <kdx-rr-input
                                    class="width-120"
                                    placeholder="0.00"
                                    number
                                    :fixed="2"
                                    :maxValue="9999999.99"
                                    v-model="model.dispatch_rule.initial_weight"
                                >
                                    <span slot="append">kg</span>
                                </kdx-rr-input>
                            </FormItem>
                            内不额外收费，每超出
                            <FormItem
                                label=""
                                style="margin-bottom: 0;margin-left: 10px;margin-right: 10px;"
                                prop="dispatch_rule.increase_weight"
                                v-error-item.dispatch_rule.increase_weight
                                :show-message="false"
                            >
                                <kdx-rr-input
                                    class="width-120"
                                    placeholder="0.00"
                                    number
                                    :fixed="2"
                                    :maxValue="9999999.99"
                                    v-model="
                                        model.dispatch_rule.increase_weight
                                    "
                                >
                                    <span slot="append">kg</span>
                                </kdx-rr-input>
                            </FormItem>
                            费用增加
                            <FormItem
                                label=""
                                style="margin-bottom: 0;margin-left: 10px;"
                                prop="dispatch_rule.increase_weight_price"
                                v-error-item.dispatch_rule.increase_weight_price
                                :show-message="false"
                            >
                                <kdx-rr-input
                                    class="width-120"
                                    placeholder="0.00"
                                    number
                                    :fixed="2"
                                    :maxValue="9999999.99"
                                    v-model="
                                        model.dispatch_rule
                                            .increase_weight_price
                                    "
                                >
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                            </FormItem>
                        </div>
                        <kdx-hint-text>
                            <div class="desc">
                                <div class="flex align-center">
                                    <div class="text">
                                        说明：1. 最终费用 = 收费标准 +
                                        续重收费（数值为0时表示不使用续重收费）
                                    </div>
                                </div>
                                <div class="flex align-center">
                                    <div
                                        class="text"
                                        style="padding-left: 37px"
                                    >
                                        2. 需要对续重收费的商品设置商品重量。
                                    </div>
                                </div>
                            </div>
                        </kdx-hint-text>
                    </FormItem>
                    <FormItem
                        label="超出范围："
                        prop="over_scope"
                        v-if="model.address && model.delivery_area === 0"
                    >
                        <RadioGroup v-model="model.over_scope">
                            <Radio :label="1">使用快递</Radio>
                            <Radio :label="0">不使用快递</Radio>
                        </RadioGroup>
                        <kdx-hint-text>
                            如果开启了同城配送，选择使用快递方式，则超出范围后自动使用快递方式；<br />
                            选择不使用快递方式，则超出同城配送范围后不配送。
                        </kdx-hint-text>
                    </FormItem>
                </div>
            </Form>
        </div>
        <template #btn>
            <Button
                :disabled="noManagePerm"
                class="primary-long"
                @click="handleSave"
            >
                保存
            </Button>
        </template>
        <modify-address-modal
            v-model="showModal"
            :type="modalType"
            :title="modalTitle"
            :okText="modalOkText"
            @handleOk="handleOk"
        />
    </kdx-content-bar>
</template>

<script>
import DeliveryType from '../components/DeliveryType'
import AddRegion from './components/AddRegion'
import Map from './components/Map'
import ModifyAddressModal from './components/ModifyAddressModal'
import DistributionItem from "./components/DistributionItem";
export default {
    components: {
        DeliveryType,
        AddRegion,
        Map,
        ModifyAddressModal,
        DistributionItem
    },
    data() {
        return {
            loading: false,
            showModal: false,
            modalType: 'modify',
            modalTitle: '',
            modalOkText: '',
            amap_key: '', //联系我们中设置
            amap_code: '', //联系我们中设置
            model: {
                delivery_time_settings: {
                    time_span: '',
                    time: [],
                    start: '',
                    end: '',
                    span_detail: []
                },
                amap_key_js: '',
                delivery_type: [], // 配送方式
                third_delivery_type: [], // 第三方配送方式
                merchant: 0, // 商家配送
                third_party: 0, // 第三方配送
                address: '',
                amap_key: '',//联系我们中设置
                // amap_key: 'a69c1da912f858a5bb0d7e7a6e3331d9',
                delivery_area: 0, // 配送区域 0: 按不同区域 1: 按不同距离 2：按行政区域
                division_way: 0, // 划分方式 0: 半径 1: 自定义
                dispatch_area: [], // 配送区域(地图左侧)
                dispatch_barrio: [], // 可配送区域 delivery_area === 2
                barrio_rule: {
                    initial_price: '', // 起送金额 delivery_area === 2
                    dispatch_price: '', // 配送费 delivery_area === 2
                },
                jffs: '1',
                xzsf: '1',
                dispatch_rule: {
                    // 计费方式及续重收费
                    initial_distance: '', // 初始配送距离(km)
                    initial_dispatch_price: '', // 初始配送价格
                    increase_distance: '', // 每增加配送距离(km)
                    increase_distance_price: '', // 每增加距离增加的金额
                    over_distance: '', // 超出距离(km)
                    over_distance_fix_price: '', // 超出距离(km)固定价格
                    initial_weight: '', // 初始配送重量不收费(kg)
                    increase_weight: '', // 每增加配送重量(kg)
                    increase_weight_price: '', // 每增加重量增加的金额
                },
                over_scope: 0, // 运费叠加 0: 不使用快递 1: 使用快递
                delivery_time: 0, // 送达时间 0 ： 关闭，1：开启
            },
            rules: {
                delivery_type: [{ required: true, message: '配送方式必选' }],
                address: [
                    {
                        required: true,
                        message: '店铺地址必填，请先设置店铺地址',
                    },
                ],
                amap_key: [
                    { required: true, message: '高德Web服务接口Key必填' },
                ],
                delivery_area: [{ required: true, message: '配送区域必选' }],
                division_way: [{ required: true, message: '划分方式必选' }],
                dispatch_barrio: [{ required: true, message: '配送区域必选' }],
                'barrio_rule.initial_price': [
                    { required: true, message: '起送金额必填' },
                ],
                'barrio_rule.dispatch_price': [
                    { required: true, message: '配送费必填' },
                ],
                jffs: [{ required: true, message: '' }],
                xzsf: [{ required: true, message: '' }],
                'dispatch_rule.initial_distance': [
                    { required: true, message: '必填' },
                ],
                'dispatch_rule.initial_dispatch_price': [
                    { required: true, message: '必填' },
                ],
                'dispatch_rule.increase_distance': [
                    { required: true, message: '必填' },
                ],
                'dispatch_rule.increase_distance_price': [
                    { required: true, message: '必填' },
                ],
                'dispatch_rule.over_distance': [
                    { required: true, message: '必填' },
                ],
                'dispatch_rule.over_distance_fix_price': [
                    { required: true, message: '必填' },
                ],
                'dispatch_rule.initial_weight': [
                    { required: true, message: '必填' },
                ],
                'dispatch_rule.increase_weight': [
                    { required: true, message: '必填' },
                ],
                'dispatch_rule.increase_weight_price': [
                    { required: true, message: '必填' },
                ],
                over_scope: [{ required: true, message: '超出范围必选' }],
                'delivery_time_settings.time_span': [{ required: true, message: '时段划分单位必填'}],
                'delivery_time_settings.start': [
                    {
                        validator: (rule,value,callback)=>{
                            if(this.model.delivery_time == 1 && !this.model.delivery_time_settings.start) {
                                callback(new Error('起止时间必填'));
                            } else {
                                callback();
                            }
                        }
                    }],
            },
            areaList: [], // 区域列表
            colors: [], // 色盘
            initRegionData: {
                initial_price: '', // 起送金额
                dispatch_price: '', // 配送费
                radius: '2', // 半径
                is_free: '0', // 是否免配送费
                free_price: '', // 免配送费满足金额
                center_lng: '',
                center_lat: '',
                location: [],
            },
            regionList: [],
            distribution: {
                infoChecked: ['1'], // 选中的三方配送方式
                infoList: [
                    {
                        id: '1',
                        key: 'dada',
                        name: '达达配送',
                        image: require('@/assets/image/order/delivery-dada.png')
                    }
                ],
                current: '1',
            }
        }
    },
    computed: {
        noManagePerm() {
            return !this.$getPermMap('order.dispatch.manage')
        },
    },
    created() {
        // 初始化颜色
        this.initColors()
        this.getIntracitySetting()
    },
    methods: {
        // 获取同城配送设置
        getIntracitySetting() {
            this.loading = true
            return new Promise((resolve) => {
                this.$api.orderApi.getIntracitySetting({}).then((res) => {
                    this.loading = false
                    if (res.error === 0) {
                        let {
                            dada = {}, ...data
                        } = res.data;
                        dada = dada ? dada : {};
                        this.model = {
                            ...this.model,
                            ...data,
                            address: `${res.address?.address?.province}${res.address?.address?.city}${res.address?.address?.area}${res.address?.address?.detail}`,
                            lng: res.address?.address?.lng,
                            lat: res.address?.address?.lat,
                            dispatch_rule: data.dispatch_rule || this.model.dispatch_rule,
                            delivery_time_settings: {
                                ...res.data?.delivery_time_settings ,
                                time: [res.data?.delivery_time_settings?.start || '', res.data?.delivery_time_settings?.end || ''],
                                time_span: res.data?.delivery_time_settings?.time_span || '',
                                span_detail: res.data?.delivery_time_settings?.span_detail.length?res.data?.delivery_time_settings?.span_detail.split(','): []
                            },
                        }
                        this.amap_key = res?.address?.amap_key || '';
                        this.amap_code = res?.address?.amap_code || '';
                        setTimeout(()=> {
                            this.$refs.amap.changeKey(this.amap_key, this.amap_code)
                        },0)

                        // 商家配送
                        if (this.model.merchant === 1) {
                            this.model.delivery_type.push('1')
                        }
                        // 三方配送
                        this.distribution.current = '';
                        if (this.model.third_party === 1) {
                            this.$nextTick(() => {
                                this.$refs['distribution_third'].resetModel({dada});
                            })
                            this.model.delivery_type.push('2')
                            if (dada.enable === '1') {
                                // 达达
                                this.distribution.infoChecked.push('1')
                            }
                            this.distribution.current = this.distribution.infoChecked[0] || '1'
                        } else {
                            // 三方配送没配置过 默认展示达达
                            // this.distribution.infoChecked.push('1')
                            this.distribution.current = '1';
                        }
                        // 店铺地址、中心点坐标
                        this.initRegionData.center_lng =
                            res.address?.address?.lng
                        this.initRegionData.center_lat =
                            res.address?.address?.lat
                        // 多边形4个顶点的坐标
                        this.initRegionData.location[0] = {
                            lng:
                                parseFloat(this.initRegionData.center_lng) -
                                0.02,
                            lat:
                                parseFloat(this.initRegionData.center_lat) +
                                0.02,
                        }
                        this.initRegionData.location[1] = {
                            lng:
                                parseFloat(this.initRegionData.center_lng) +
                                0.02,
                            lat:
                                parseFloat(this.initRegionData.center_lat) +
                                0.02,
                        }
                        this.initRegionData.location[2] = {
                            lng:
                                parseFloat(this.initRegionData.center_lng) +
                                0.02,
                            lat:
                                parseFloat(this.initRegionData.center_lat) -
                                0.02,
                        }
                        this.initRegionData.location[3] = {
                            lng:
                                parseFloat(this.initRegionData.center_lng) -
                                0.02,
                            lat:
                                parseFloat(this.initRegionData.center_lat) -
                                0.02,
                        }
                        if (
                            this.model.dispatch_area &&
                            this.model.dispatch_area.length > 0
                        ) {
                            // 取前10个配送区域，防止后台返回超数量
                            this.model.dispatch_area = this.model.dispatch_area.slice(
                                0,
                                10
                            )
                            this.regionList = this.model.dispatch_area.map(
                                (item, index) => {
                                    return {
                                        color: this.colors[index],
                                        active: false,
                                        model: {
                                            ...item,
                                            center_lat: !item.center_lat ? res.address?.address?.lat : item.center_lat,
                                            center_lng: !item.center_lng ? res.address?.address?.lng : item.center_lng
                                        },
                                    }
                                }
                            )
                            // 删除已有颜色
                            this.colors.splice(
                                0,
                                this.model.dispatch_area.length
                            )
                        } else {
                            this.initRegionList()
                        }
                        // this.model.dispatch_rule = {
                        //     ...this.zero2NullStr(this.model.dispatch_rule),
                        // }
                        resolve()
                    }
                })
            })
        },
        // 切换配送区域
        deliveryAreaChange(value) {
            if (value === 2) {
                if (this.model.amap_key) {
                    this.getConfigDistance()
                } else {
                    this.$Message.info(
                        '请先设置高德web服务key,否则获取不到可用行政区域'
                    )
                }
            }
        },
        // 获取店铺所在地行政区域（可配送区域）
        getConfigDistance() {
            this.$api.orderApi
                .getConfigDistance({
                    amap_key: this.model.amap_key,
                })
                .then((res) => {
                    if (res.error === 0) {
                        this.areaList = res.data.map((item) => {
                            return {
                                value: item.adcode,
                                label: item.name,
                            }
                        })
                    }
                })
        },
        // 设置同城配送开启关闭
        handleChange(value) {
            if (!this.model.address) {
                if (value) {
                    this.modalType = 'open'
                    this.modalTitle = '提示'
                    this.modalOkText = '去设置'
                    this.showModal = true
                    this.$nextTick(() => {
                        this.$refs['deliveryType'].modelValue = 0
                    })
                } else {
                    this.$refs['deliveryType'].enableIntracity(value)
                }
            } else {
                this.$refs['deliveryType'].enableIntracity(value)
            }
        },
        // 修改店铺地址
        fnModifyShopAddress() {
            this.modalType = 'modify'
            this.modalTitle = '地址修改提示'
            this.modalOkText = '去修改'
            this.showModal = true
        },
        handleOk() {
            this.showModal = false
            this.$utils.openNewWindowPage(
                '/setting/shopSetting/contactUs/index'
            )
        },
        // 初始化regionList
        initRegionList() {
            this.regionList.push({
                color: this.colors[0],
                active: false,
                model: {
                    ...this.initRegionData,
                },
            })
            // 删除已有颜色
            this.colors.splice(0, 1)
        },
        // 跳转高德开放平台
        fnGoAMap() {
            window.open('https://lbs.amap.com')
        },
        // 切换划分方式
        changeDivisionWay() {
            // 删除之前配置
            this.regionList.forEach(() => {
                if (this.model.division_way === 0) {
                    this.$refs['amap'].removePolygon(0)
                } else if (this.model.division_way === 1) {
                    this.$refs['amap'].removeCircle(0)
                }
            })
            this.regionList = []
            this.initColors()
            // 初始化数据
            this.initRegionList()
            // 画地图
            if (this.model.division_way === 0) {
                this.addCircle()
            } else if (this.model.division_way === 1) {
                this.addPolygon()
            }
        },
        // 添加区域
        addRegion() {
            this.regionList.push({
                color: this.colors[0],
                active: false,
                model: {
                    ...this.initRegionData,
                },
            })
            if (this.model.division_way === 0) {
                // 添加圆形
                this.addCircle(this.regionList[this.regionList.length - 1])
            } else if (this.model.division_way === 1) {
                // 添加多边形
                this.addPolygon(this.regionList[this.regionList.length - 1])
            }

            // 删除已有颜色
            this.colors.splice(0, 1)
        },
        // 删除区域
        deleteRegion(index) {
            // 颜色还原
            this.colors.push(this.regionList[index].color)
            if (this.model.division_way === 0) {
                // 删除圆形
                this.$refs['amap'].removeCircle(index)
            } else if (this.model.division_way === 1) {
                // 删除多边形
                this.$refs['amap'].removePolygon(index)
            }
        },
        // 添加圆形
        addCircle(data) {
            if (data) {
                this.$refs['amap'].addCircle(data)
            } else {
                this.regionList.forEach((item) => {
                    this.$refs['amap'].addCircle(item)
                })
            }
        },
        // 修改圆形区域半径
        changeCircleRadius(data, index) {
            this.$refs['amap'].changeCircleRadius(data, index)
        },
        // 显示圆编辑器
        showCircleEditor(index) {
            this.$refs['amap'].showCircleEditor(index)
        },
        // 修改区域选中
        changeRegionSelected(index) {
            this.$refs['addRegion'].fnSelect(index)
        },
        // 添加多边形
        addPolygon(data) {
            if (data) {
                this.$refs['amap'].addPolygon(data)
            } else {
                this.regionList.forEach((item) => {
                    this.$refs['amap'].addPolygon(item)
                })
            }
        },
        // 显示多边形编辑器
        showPolyEditor(index) {
            this.$refs['amap'].showPolyEditor(index)
        },
        // 初始化颜色
        initColors() {
            this.colors = [
                {
                    borderColor: '#4A67FF',
                    backgroundColor: 'rgba(74, 103, 255, 0.2)',
                },
                {
                    borderColor: '#0400BE',
                    backgroundColor: 'rgba(4, 0, 190, 0.2)',
                },
                {
                    borderColor: '#F66000',
                    backgroundColor: 'rgba(246, 96, 0, 0.2)',
                },
                {
                    borderColor: '#F65290',
                    backgroundColor: 'rgba(246, 82, 144, 0.2)',
                },
                {
                    borderColor: '#8F80FF',
                    backgroundColor: 'rgba(143, 128, 255, 0.2)',
                },
                {
                    borderColor: '#F4C900',
                    backgroundColor: 'rgba(244, 201, 0, 0.2)',
                },
                {
                    borderColor: '#39A7F1',
                    backgroundColor: 'rgba(57, 167, 241, 0.2)',
                },
                {
                    borderColor: '#1BB723',
                    backgroundColor: 'rgba(27, 183, 35, 0.2)',
                },
                {
                    borderColor: '#FF1F2C',
                    backgroundColor: 'rgba(255, 31, 44, 0.2)',
                },
                {
                    borderColor: '#008957',
                    backgroundColor: 'rgba(0, 137, 87, 0.2)',
                },
            ]
        },
        // 保存
        handleSave() {
            this.validate().then(async (valid) => {
                if (valid) {
                    console.log('通过了')
                    // 校验三方配送
                    if (this.model.delivery_type?.includes('2')) {
                       await this.$refs['distribution_third'].validate();
                        console.log('通过了2')
                    }
                    if (this.model.delivery_area !== 2) {
                        this.$refs['addRegion'].validate().then((validArr) => {
                            let flag = validArr.some((item) => {
                                return item === false
                            })
                            if (!flag) {
                                this.setIntracitySetting()
                            }
                        })
                    } else {
                        this.setIntracitySetting()
                    }
                }
            })
        },
        setIntracitySetting() {
            let _param = this.formatParams()
            console.log('__param', _param);
            if(this.model.delivery_time==1 && !this.model.delivery_time_settings.span_detail) {
                this.$Message.error('时段错误');
                return
            }
            this.$api.orderApi.setIntracitySetting(_param).then((res) => {
                if (res.error === 0) {
                    this.$Message.success('保存成功')
                    this.getIntracitySetting()
                }
            })
        },
        // 处理保存参数
        formatParams() {
            let {
                merchant,
                third_party,
                amap_key,
                delivery_area,
                division_way,
                dispatch_area,
                dispatch_barrio,
                barrio_rule,
                dispatch_rule,
                over_scope,
                delivery_time,
                delivery_time_settings
            } = this.model
            let thirdData = {}; // 三方配送数据
            // 商家配送
            if (new Set(this.model.delivery_type).has('1')) {
                merchant = 1
            } else {
                merchant = 0
            }
            // 三方配送
            if (new Set(this.model.delivery_type).has('2')) {
                third_party = 1
                // 获取三方配送参数
                thirdData = this.$refs['distribution_third'].getModel();
            } else {
                third_party = 0
            }
            // 配送区域
            dispatch_area = this.regionList.map((item) => {
                return item.model
            })
            if (delivery_area === 0) {
                // 按不同区域，清空计费方式
                dispatch_rule.initial_distance = '0' // 初始配送距离(km)
                dispatch_rule.initial_dispatch_price = '0' // 初始配送费
                dispatch_rule.increase_distance = '0' // 每增加配送距离
                dispatch_rule.increase_distance_price = '0' // 每增加距离增加的金额
                dispatch_rule.over_distance = '0' // 超出距离(km)
                dispatch_rule.over_distance_fix_price = '0' // 超出距离(km)固定价格
                dispatch_barrio = [] // 可选配送区域
                dispatch_barrio.initial_price = '' // 起送金额 delivery_area === 2
                dispatch_barrio.dispatch_price = '' // 配送费 delivery_area === 2
            }
            if (delivery_area === 1) {
                // 按不同距离
                dispatch_barrio = [] // 可选配送区域
                dispatch_barrio.initial_price = '' // 起送金额 delivery_area === 2
                dispatch_barrio.dispatch_price = '' // 配送费 delivery_area === 2
                over_scope = 0 // 超出范围
            }
            if (delivery_area === 2) {
                // 按行政区域，清空计费方式、续重收费
                dispatch_rule.initial_distance = '0' // 初始配送距离(km)
                dispatch_rule.initial_dispatch_price = '0' // 初始配送费
                dispatch_rule.increase_distance = '0' // 每增加配送距离
                dispatch_rule.increase_distance_price = '0' // 每增加距离增加的金额
                dispatch_rule.over_distance = '0' // 超出距离(km)
                dispatch_rule.over_distance_fix_price = '0' // 超出距离(km)固定价格
                dispatch_rule.initial_weight = '0' // 初始配送重量不收费(kg)
                dispatch_rule.increase_weight = '0' // 每增加配送重量(kg)
                dispatch_rule.increase_weight_price = '0' // 每增加重量增加的金额
                dispatch_area = [] // 配送区域
                over_scope = 0 // 超出范围
            }
            // 处理时间段
            let span_detail = JSON.parse(JSON.stringify(delivery_time_settings.span_detail))
            if(span_detail.length) {
                span_detail =  span_detail.join(',')
            }
            return {
                merchant,
                third_party,
                amap_key,
                delivery_area,
                division_way,
                dispatch_area,
                dispatch_barrio,
                barrio_rule,
                dispatch_rule,
                over_scope,
                delivery_time,
                ...thirdData,
                delivery_time_settings: {
                    ...delivery_time_settings,
                    span_detail
                }
            }
        },
        // 将 0 转成 ''
        zero2NullStr(obj = {}) {
            for (let [key, value] of Object.entries(obj)) {
                if (parseFloat(value) === 0) {
                    obj[key] = ''
                }
            }
            return obj
        },
        // 三方配送切换tab
        changeInfoTab(id) {
            this.distribution.current = id;
        },
        // 三方配送选中
        changeCheckedInfo(infoChecked) {
            this.distribution.infoChecked = infoChecked;
        },
        onValidate(prop, status){
            this.cacheError={
                ...this.cacheError,
                [prop]: status
            }
        },
        validate() {
            return new Promise(resolve => {
                console.log('78787878')
                this.$refs['form'].validate(valid => {
                    resolve(valid);
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
                });
            });
        },
        changeTime(time) {
            this.model.delivery_time_settings.start = time[0];
            this.model.delivery_time_settings.end = time[1];
            if (this.model.delivery_time_settings.time_span && this.model.delivery_time_settings.time.length) {
                this.getTimePart(this.model.delivery_time_settings.time, this.model.delivery_time_settings.time_span)
            }
        },
        handleBlur() {
            if (this.model.delivery_time_settings.time.length&&this.model.delivery_time_settings.time_span) {
                this.getTimePart(this.model.delivery_time_settings.time, this.model.delivery_time_settings.time_span)
            }
        },
        getTimePart(time, time_span) {
            /**
             * 1 先把开始时间 结束时间 转换成分钟
             * 2 计算开始和结束相差的 分钟数
             * 3 获取分钟跨度 向下取整 计算出跨度段 例如 9
             * 4 循环 9 从开始时间 + 跨度分钟
             * 5 转换成时分
             *
             * */
            if (time.length&&time_span) {
                let startTime = time[0].split(':'),
                    endTime = time[1].split(':');
                let startAll = parseInt(startTime[0] * 60) + parseInt(startTime[1]),
                    endAll = parseInt(endTime[0] * 60) + parseInt(endTime[1]);
                let partNum = Math.floor((endAll - startAll)/Number(time_span));
                let arr = [time[0]];
                for (let i = 0; i < partNum; i++) {
                    arr.push(this.timeStamp(startAll += Number(time_span)))
                }
                this.model.delivery_time_settings.span_detail = arr.map((item, index) => item = arr[index-1] + '-' + item);
                this.model.delivery_time_settings.span_detail.shift();
            }
        },
        timeStamp(StatusMinute) {
            let hour = parseInt(StatusMinute / 60 % 24);
            let min = parseInt(StatusMinute % 60);
            StatusMinute = '';
            if (hour >= 10) {
                StatusMinute += hour + ":";
            } else if (hour < 10) {
                StatusMinute += '0' + hour + ":";
            } else {
                StatusMinute += '00:';
            }
            if (min >= 10) {
                StatusMinute += parseFloat(min);
            } else if (min < 10) {
                StatusMinute += '0' + parseFloat(min);
            } else {
                StatusMinute += '00:';
            }
            //三元运算符 传入的分钟数不够一分钟 默认为0分钟，else return 运算后的StatusMinute
            return StatusMinute === '' ? "0": StatusMinute;
        },
    },
    watch: {
        'model.amap_key': {
            handler(value) {
                if (value) {
                    if (this.model.delivery_area === 2) {
                        this.getConfigDistance()
                    }
                }
            },
            immediate: true,
        },
    },
}
</script>

<style scoped lang="scss">
.mb0 {
    margin-bottom: 0;
}
.delivery-type-box {
    padding-top: 20px;
}
.same-city-delivery {
    padding: 40px 40px 0 40px;
    background-color: #ffffff;
    .delivery-type {
        padding-bottom: 30px;
        .checkbox-box {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            line-height: 20px;
            padding-top: 8px;
            /deep/ .ivu-checkbox-wrapper {
                margin-top: 20px;
                font-weight: bold;
                &:first-child {
                    margin-top: 0;
                }
            }
        }
        .next-box {
            background: #f4f6f8;
            border-radius: 2px;
            padding: 30px 20px;
            margin-top: 10px;
            .third-delivery {
                .third-delivery-item {
                    padding-top: 30px;
                    border-top: 1px solid $border-bg-color;
                    /deep/ .ivu-form-item-error-tip {
                        margin-left: 120px;
                    }
                    /deep/ .kdx-hint-text {
                        margin-left: 120px;
                        .godada {
                            color: $brand-color;
                            cursor: pointer;
                            font-weight: bold;
                        }
                    }
                }
                .logo {
                    margin-bottom: 30px;
                    img {
                        background-color: #fff;
                        display: block;
                        width: 160px;
                        height: 80px;
                        border: 1px solid $border-color;
                        border-radius: 2px;
                    }
                }
            }
            .time-part {
                max-height: 360px;
                margin-left: 120px;
                background-color: #fff;
                overflow: auto;
                .time-item {
                    padding: 20px 0 10px 20px;
                    display: flex;
                    flex-wrap: wrap;
                    div {
                        margin-bottom: 10px;
                        min-width: 80px;
                        margin-right: 20px;
                        line-height: 20px;
                    }
                }
            }
            /deep/ .ivu-form-item-error-tip {
                margin-left: 120px;
            }
        }
    }
    .regional-settings {
        padding-bottom: 30px;
        .next-box {
            box-sizing: content-box;
            padding-top: 10px;
            height: 500px;
            .left {
                width: 330px;
            }
            .right {
                padding-left: 10px;
                flex: 1;
            }
        }
    }
}

.express-tip {
    margin-left:0!important;
    color:#ff3c29;
}
::v-deep{
    .ivu-input-word-count{
        background: rgba(255,255,25,0);
    }
}
</style>
