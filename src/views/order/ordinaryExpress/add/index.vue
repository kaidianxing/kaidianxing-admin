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
        <div class="order-ordinary-express-add">
            <Form ref="form" :model="model" :rules="rules" :label-width="120">
                <div class="order-ordinary-express-add-content">
                    <kdx-form-title>{{title}}</kdx-form-title>
                    <FormItem label="排序：" prop="sort">
                        <Input v-model="model.sort" maxlength="4" class="width-160" placeholder="请输入"/>
                        <kdx-hint-text>最多4位数字，数字越大，排名越靠前，默认排序为创建时间</kdx-hint-text>
                    </FormItem>
                    <FormItem label="名称：" prop="dispatch_name">
                        <Input v-model="model.dispatch_name" :rows="1" autosize maxlength="20"
                               show-word-limit
                               class="width-430" placeholder="请输入"/>
                    </FormItem>
                    <FormItem label="快递公司：">
                        <select-express :value.sync="model.express" :option-data="optionData.express"
                                        class="width-430"></select-express>
                        <kdx-hint-text>您如果选择了常用快递，则客户可以在订单中查询快递信息，如果缺少您想要的快递，您可以联系我们！</kdx-hint-text>
                    </FormItem>
                    <FormItem label="计费方式：">
                        <RadioGroup v-model="model.calculate_type" @on-change="changeRecharge">
                            <Radio :label="1">
                                <span>按件计费</span>
                            </Radio>
                            <Radio :label="0">
                                <span>按重量计费</span>
                            </Radio>
                        </RadioGroup>
                        <kdx-hint-alert v-show="model.calculate_type === '1'">
                            根据件数来计算运费，当物品不足《首件数量》时，按照《首件费用》计算，超过部分按照《续件重量》和《续件费用》乘积来计算
                        </kdx-hint-alert>
                        <kdx-hint-alert v-show="model.calculate_type === '0'">
                            根据重量来计算运费，当物品不足《首重重量》时，按照《首重费用》计算，超过部分按照《续重重量》和《续重费用》乘积来计算
                        </kdx-hint-alert>
                        <div class="form-item-bg-box">
                            <charge-mode-list ref="charge_mode" :type="model.calculate_type"
                                              :limit-arr="region.limitArr"
                                              @on-edit="showRegionModal('recharge-edit', $event)"></charge-mode-list>
                            <div class="area-big-btn">
                                <Button type="text" @click="showRegionModal('recharge-add')">+添加配送区域</Button>
                            </div>
                        </div>
                    </FormItem>
                </div>
                <div class="order-ordinary-express-add-content">
                    <kdx-form-title>特殊区域设置</kdx-form-title>
                    <FormItem label="类型：">
                        <RadioGroup v-model="model.dispatch_area_type" @on-change="changeSpecial">
                            <Radio :label="0">
                                <span>不配送区域</span>
                            </Radio>
                            <Radio :label="1">
                                <span>只配送区域</span>
                            </Radio>
                        </RadioGroup>
                        <div class="form-item-bg-box">
                            <div class="area" v-if="special_region.text">
                                <div class="area-content">
                                    {{special_region.text}}
                                </div>
                                <div class="area-btn">
                                    <Button type="text" @click="showRegionModal('special', special_region)">
                                        编辑
                                    </Button>
                                    <Button type="text" @click="deleteSpecialRegion">删除</Button>
                                </div>
                            </div>
                            <div class="area-big-btn" v-else>
                                <Button type="text" @click="showRegionModal('special')"
                                        v-show="model.dispatch_area_type == '0'">+添加不配送区域
                                </Button>
                                <Button type="text" @click="showRegionModal('special')"
                                        v-show="model.dispatch_area_type == '1'">+添加只配送区域
                                </Button>
                            </div>
                        </div>
                    </FormItem>
                </div>
                <div class="order-ordinary-express-add-content">
                    <kdx-form-title>使用状态</kdx-form-title>
                    <FormItem label="设为默认：">
                        <RadioGroup v-model="model.is_default">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </RadioGroup>
                    </FormItem>
                    <!--当设为默认时必启用-->
                    <FormItem label="是否启用：">
                        <RadioGroup v-model="model.state">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </RadioGroup>
                    </FormItem>
                </div>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">保存</Button>
            <Button class="default-long" @click="getBack">返回列表</Button>
        </template>
        <selector-region :visible="region.modal" :list="region.data" :limit-list="region.limitArr"
                         @on-ok="regionSelectOk"
                         @on-cancel="regionSelectCancel"></selector-region>
    </kdx-content-bar>
</template>

<script>
    import SelectExpress from "../../components/SelectExpress";
    import ChargeModeList from './components/chargeModeList';
    import SelectorRegion from '@/components/selector/Region';

    export default {
        name: "index",
        components: {
            SelectExpress,
            ChargeModeList,
            SelectorRegion
        },
        data() {
            return {
                model: {
                    sort: '',
                    dispatch_name: '',
                    express: '',
                    calculate_type: 1,
                    dispatch_area_type: 0,
                    is_default: 0,
                    state: 1,
                },
                rules: {
                    sort: [
                        {
                            pattern: /^(0|[1-9][0-9]*)$/,
                            message: '排序为数字类型，最长为4位数'
                        }
                    ],
                    dispatch_name: [
                        {required: true, message: '配送方式名称必填'}
                    ]
                },
                title: '',
                optionData: {
                    express: []
                },
                region: {
                    data: {},
                    modal: false,
                    type: '',
                    limitArr: []
                },
                deliveryArea: {},
                deliveryNoArea: {},
                special_region: {},
                numArea: {},
                weightArea: {},
                regionIndex: -1 // 索引
            };
        },
        methods: {
            // 区域选择完成
            regionSelectOk(data) {
                if (this.region.type === 'special') {
                    this.special_region = data;
                    if (this.model.dispatch_area_type == '0') {
                        this.deliveryNoArea = data;
                    } else if (this.model.dispatch_area_type == '1') {
                        this.deliveryArea = data;
                    }
                    this.model.dispatch_limit_area = data;
                } else if (this.region.type === 'recharge-edit') {
                    this.$refs['charge_mode'].initData({data, type: '2'});
                } else if (this.region.type === 'recharge-add') {
                    this.$refs['charge_mode'].initData({data, type: '1'});
                }
                this.regionSelectCancel();
            },
            regionSelectCancel() {
                this.region.modal = false;
            },
            // 新增region
            showRegionModal(type, data = {}) {
                this.region.type = type;
                this.region.data = data || {};
                if (type === 'special') {
                    this.region.limitArr = [];
                } else {
                    this.region.limitArr = this.$refs['charge_mode'].getAreaCode();
                }
                this.region.modal = true;
            },
            deleteSpecialRegion() {
                this.special_region = {};
            },
            // 计费方式切换
            changeRecharge() {
                if (this.model.calculate_type == '1') {
                    this.weightArea = JSON.parse(JSON.stringify(this.$refs['charge_mode'].table.data)) || {};
                    this.$nextTick(() => {
                        this.$refs['charge_mode'].initData({type: '0', data: this.numArea});
                    });
                } else if (this.model.calculate_type == '0') {
                    this.numArea = JSON.parse(JSON.stringify(this.$refs['charge_mode'].table.data)) || {};
                    this.$nextTick(() => {
                        this.$refs['charge_mode'].initData({type: '0', data: this.weightArea});
                    });
                }
            },
            // 特殊区域信息类型切换
            changeSpecial() {
                if (this.model.dispatch_area_type == '0') {
                    this.deliveryArea = JSON.parse(JSON.stringify(this.special_region));
                    this.special_region = JSON.parse(JSON.stringify(this.deliveryNoArea)) || {};
                } else if (this.model.dispatch_area_type == '1') {
                    this.deliveryNoArea = JSON.parse(JSON.stringify(this.special_region));
                    this.special_region = JSON.parse(JSON.stringify(this.deliveryArea)) || {};
                }
            },
            init() {
                this.id = this.$route.query.id || 0;
                let type = this.$route.params.id;
                if (type === 'edit') {
                    this.getData();
                    this.title = '修改配送方式';
                } else if (type === 'add') {
                    this.title = '新增配送方式';
                }
                this.getExpressList();
            },
            // 获取数据
            getData() {
                this.resetModel();
                this.$api.orderApi.getExpressStyle({id: this.id})
                    .then(res => {
                        let {error, dispatch_area, ...model} = res;
                        if (error === 0) {
                            this.model = model;
                            let tableList = [model.default];
                            if (dispatch_area) {
                                dispatch_area = JSON.parse(dispatch_area);
                                dispatch_area.forEach(item => {
                                    let data = {
                                        ...item,
                                        region_area: {
                                            text: item.city,
                                            areas: item.citys_code
                                        }
                                    };
                                    delete data.city;
                                    delete data.citys_code;
                                    tableList.push(data);
                                });
                            } else {
                                dispatch_area = '';
                            }
                            this.special_region.text = model.dispatch_limit_area || '';
                            this.special_region.areas = model.dispatch_limit_area_code && JSON.parse(model.dispatch_limit_area_code);
                            delete this.model.default;
                            this.$nextTick(() => {
                                this.$refs['charge_mode'].initData({type: '0', data: tableList});
                            });
                        }
                    });
            },
            // 获取快递公司列表
            getExpressList() {
                this.$api.settingApi.getExpressList()
                    .then(res => {
                        if (res.error === 0) {
                            this.optionData.express = res.list;
                        }
                    });
            },
            getBack() {
                this.$router.go(-1);
            },
            handleSave() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (!this.$refs['charge_mode'].validate()) {
                            let params = Object.assign({}, this.model);
                            params.dispatch_limit_area = this.special_region.text || '';
                            params.dispatch_limit_area_code = this.special_region.areas ? JSON.stringify(this.special_region.areas) : '';
                            let list = this.$refs['charge_mode'].getModel();
                            Object.assign(params, list);
                            if (this.$route.params.id === 'edit') {
                                this.editExpressStyle(params);
                            } else if (this.$route.params.id === 'add') {
                                this.addExpressStyle(params);
                            }
                        }
                    }
                });
            },
            addExpressStyle(params) {
                this.$api.orderApi.addExpressStyle(params)
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('配送方式新增成功');
                            this.$router.go(-1);
                        }
                    });
            },
            editExpressStyle(params) {
                this.$api.orderApi.editExpressStyle(params)
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('配送方式修改成功');
                            this.$router.go(-1);
                        }
                    });
            },
            resetModel() {
                this.model = {
                    sort: '',
                    dispatch_name: '',
                    express: '',
                    calculate_type: 1,
                    dispatch_area_type: 0,
                    is_default: 0,
                    state: 1,
                };
            }
        },
        mounted() {
            this.init();
        }
    };
</script>

<style scoped lang="scss">
    .order-ordinary-express-add {
        padding: 40px 40px 0 40px;
        background-color: #FFFFFF;
        margin-top: 20px;
        .order-ordinary-express-add-content {
            padding-bottom: 30px;
            .form-item-bg-box {
                background-color: $background-color;
                padding: 30px 20px;
                margin-top: 10px;
                > .area {
                    padding: 20px;
                    background-color: #ffffff;
                    > .area-content {
                        @include font-12-24;
                        padding-bottom: 10px;
                    }
                    > .area-btn {
                        .ivu-btn {
                            padding-left: 5px;
                            @include font-12-16;
                            &:first-child {
                                padding-right: 5px;
                                padding-left: 0;
                                border-right: 1px solid $brand-color;
                            }
                        }
                    }
                }
                > .area-big-btn {
                    width: 100%;
                    padding: 20px 0;
                    background-color: #ffffff;
                    text-align: center;
                    .ivu-btn {
                        @include font-12-16;
                    }
                }
            }
        }
    }
</style>
