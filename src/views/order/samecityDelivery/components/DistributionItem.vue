/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="distribution-item">
        <!--达达-->
        <Form ref="item_dada" :model="model.dada" :rules="rules.dada" :label-width="130">
            <kdx-hint-alert type="error" style="margin: 0 20px 10px 20px">达达配送需要商品重量，请确保商品已设置重量，否则商家无法发货</kdx-hint-alert>
            <FormItem label="app_key：" prop="app_key">
                <Input class="width-470" placeholder="请输入" show-word-limit :maxlength="50"
                       v-model="model.dada.app_key"/>
                <kdx-hint-text>
                    请前往达达开放平台进行获取该参数，
                    <Button type="text" @click="jumpDada">立即前往</Button>
                </kdx-hint-text>
            </FormItem>
            <FormItem label="app_secret：" prop="app_secret" v-error-item.app_secret>
                <Input class="width-470" placeholder="请输入" show-word-limit :maxlength="50"
                       v-model="model.dada.app_secret"/>
            </FormItem>
            <FormItem label="商户编号(source_id)：" prop="source_id" v-error-item.source_id>
                <Input class="width-470" placeholder="请输入" show-word-limit :maxlength="50"
                       v-model="model.dada.source_id"/>
                <kdx-hint-text>
                    请填写正确有效的商户编号信息，填写错误则不可用
                </kdx-hint-text>
            </FormItem>
            <FormItem label="门店编号：" prop="shop_no" v-error-item.shop_no>
                <Input class="width-470" placeholder="请输入" show-word-limit :maxlength="50"
                       v-model="model.dada.shop_no"/>
            </FormItem>
            <FormItem label="城市选择：" prop="city_code" v-if="canPostDadaCityList" v-error-item.city_code>
                <Select v-model="model.dada.city_code" class="width-470" filterable>
                    <Option v-for="(item, index) in dadaCityList" :value="item.value" :key="index">
                        {{ item.label }}
                    </Option>
                </Select>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    const modelData = {
        dada: { // 达达
            enable: '',
            app_key: '',
            app_secret: '',
            source_id: '',
            shop_no: '',
            city_code: '',
        },
    };
    export default {
        name: "DistributionItem",
        props: {
            infoChecked: {
                type: Array,
                default: () => []
            },
            infoList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                model: modelData,
                dadaCityList: [],
                rules: {
                    dada: {
                        'app_key': [{required: true, message: '必填'}],
                        'app_secret': [{required: true, message: '必填'}],
                        'source_id': [{required: true, message: '必填'}],
                        'shop_no': [{required: true, message: '必填'}],
                        'city_code': [{required: true, message: '必选'}],
                    }
                },
            };
        },
        computed: {
            // 判断是否可以请求达达城市列表接口
            canPostDadaCityList() {
                console.log('model-city-list', this.model.dada);
                return (
                    this.model.dada?.enable === '1' &&
                    !!this.model.dada.app_key &&
                    !!this.model.dada.app_secret &&
                    !!this.model.dada.source_id &&
                    !!this.model.dada.shop_no
                );
            },
            noManagePerm() {
                return !this.$getPermMap('order.dispatch.manage');
            },
        },
        watch: {
            canPostDadaCityList: {
                handler(value) {
                    if (value) {
                        this.getDadaCity();
                    }
                },
                immediate: true,
            },
            infoChecked: {
                handler(value) {
                    if (value.includes('1')) {
                        this.model.dada.enable = '1';
                    } else {
                        this.model.dada.enable = '0';
                    }
                    console.log('info-checked', value);
                },
                immediate: true,
                deep: true,
            },
        },
        created() {
            this.resetModel();
        },
        methods: {
            // 获取达达城市列表
            getDadaCity() {
                this.$api.orderApi
                    .getDadaCity({
                        app_key: this.model.dada.app_key,
                        app_secret: this.model.dada.app_secret,
                        source_id: this.model.dada.source_id,
                        shop_no: this.model.dada.shop_no,
                    })
                    .then((res) => {
                        if (res.error === 0) {
                            this.dadaCityList = res.data.map((item) => {
                                return {
                                    value: item.cityCode,
                                    label: item.cityName,
                                };
                            });
                        } else {
                            this.dadaCityList = [];
                        }
                    });
            },
            // 跳转达达开放平台
            jumpDada() {
                window.open('http://newopen.imdada.cn');
            },
            onValidate(prop, status){
                this.cacheError={
                    ...this.cacheError,
                    [prop]: status
                }
            },
            validate() {
                return new Promise(async resolve => {
                    let validRes = true;
                    for (let item of this.infoList) {
                        if (this.infoChecked.includes(item.id)) {
                            console.log('++++++++++++', `item_${item.key}`, this.infoChecked);
                            let valid = await this.$refs[`item_${item.key}`].validate();
                            if (!valid) {
                                for(let k in this.cacheError){
                                    if(!this.cacheError[k]){
                                        this.$focusError(k);
                                        break;
                                    }
                                }
                                validRes = valid;
                                this.$emit('on-tab-change', item.id);
                                this.$Message.error(`请完善${item.name}必填信息！`);
                                break;
                            }
                        }
                    }
                    validRes && resolve();
                });
            },
            resetModel(model = {}) {
                const {
                    dada = {}
                } = model;
                Object.assign(this.model.dada, dada);
                // this.model = Object.assign(modelData, model);
            },
            // 处理数据
            getModel() {
                if (this.infoChecked.includes('1')) {
                    this.model.dada.enable = 1;
                } else {
                    this.model.dada.enable = 0;
                }
                console.log('model', JSON.stringify(this.model))
                return this.model;
            }
        }
    };
</script>

<style scoped lang="scss">
    .distribution-item {
        background-color: #FFFFFF;
        padding: 30px 0;
        border-radius: 0 2px 2px 2px;

        /deep/ .ivu-form {
            margin-bottom: -30px;

            .ivu-form-item-error-tip,
            .hint-text {
                padding-left: 130px;

                .ivu-btn-text {
                    font-weight: bold;
                }
            }
        }
        .width-470 {
            width: 470px!important;
        }
    }
</style>
