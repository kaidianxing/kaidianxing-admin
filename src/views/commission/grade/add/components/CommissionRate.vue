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
    <div class="commission-rate">
        <Form ref="form" :model="model" :rules="rules"
              :label-width="120" @on-validate='onValidate'>
            <kdx-form-title>分销商等级佣金比例</kdx-form-title>
            <FormItem label="等级权重：" prop="level" v-if="!isDefault" v-error-item.level>
               <div style="width: 400px">
                   <check-label v-for="(item, index) in option" :key="item.id" :checked="model.level == item.id"
                                :disabled="level.includes(item.id)" show-icon @on-change="setLabelChecked(index, $event)">
                       {{item.name}}
                   </check-label>
               </div>
            </FormItem>
            <FormItem label="等级名称：" prop="name" v-error-item.name>
                <Input :disabled='noManagePerm' v-model="model.name" :rows="1" autosize maxlength="10" show-word-limit
                       class="width-250 limit-input" placeholder="请输入等级名称"/>
            </FormItem>
            <FormItem label="一级佣金比例：" :prop="setting.commission_level >=1?'commission_1' : ''" v-error-item.commission_1>
                <kdx-rr-input number :fixed="1" :maxValue="99.9" :disabled='noManagePerm || setting.commission_level ==0' v-model="model.commission_1" class="width-250">
                    <span slot="append">%</span>
                </kdx-rr-input>
            </FormItem>
            <FormItem label="二级佣金比例：" :prop="setting.commission_level >=2?'commission_2' : ''" v-error-item.commission_2>
                <kdx-rr-input number :fixed="1" :maxValue="99.9" :disabled='noManagePerm || setting.commission_level <2' v-model="model.commission_2" class="width-250">
                    <span slot="append">%</span>
                </kdx-rr-input>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import CheckLabel from "@/components/little/CheckLabel";

    export default {
        name: "CommissionRate",
        components: {CheckLabel},
        computed: {
            noManagePerm() { //管理权限
                return !this.$getPermMap('commission.level.manage')
            },
        },
        props: {
            level: {
                type: Array,
                required: true,
                default: () => []
            },
            setting: {
                type: Object,
                default: () => {
                }
            },
            isDefault: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                model: {
                    level: '',
                    name: '',
                    commission_1: '',
                    commission_2: '',
                },
                rules: {
                    level: [
                        {required: true, message: '等级权重必填'}
                    ],
                    name: [
                        {required: true, message: '等级名称必填'}
                    ],
                    commission_1: [
                        {required: true, message: '一级佣金比例必填'},
                        {
                            pattern: /^(0|[1-9][0-9]{0,1})(\.[0-9]{1,2})?$/,
                            message: '支持0.01到99.9'
                        }
                    ],
                    commission_2: [
                        {required: true, message: '二级佣金比例必填'},
                        {
                            pattern: /^(0|[1-9][0-9]{0,1})(\.[0-9]{1,2})?$/,
                            message: '支持0.01到99.9'
                        }
                    ],
                },
                option: [
                    {
                        id: 1,
                        name: '一级',
                        checked: false,
                        disabled: false
                    },
                    {
                        id: 2,
                        name: '二级',
                        checked: false,
                        disabled: false
                    },
                    {
                        id: 3,
                        name: '三级',
                        checked: false,
                        disabled: false
                    },
                    {
                        id: 4,
                        name: '四级',
                        checked: false,
                        disabled: false
                    },
                    {
                        id: 5,
                        name: '五级',
                        checked: false,
                        disabled: false
                    },
                    {
                        id: 6,
                        name: '六级',
                        checked: false,
                        disabled: false
                    },
                    {
                        id: 7,
                        name: '七级',
                        checked: false,
                        disabled: false
                    },
                    {
                        id: 8,
                        name: '八级',
                        checked: false,
                        disabled: false
                    },
                    {
                        id: 9,
                        name: '九级',
                        checked: false,
                        disabled: false
                    },
                    {
                        id: 10,
                        name: '十级',
                        checked: false,
                        disabled: false
                    }
                ]
            };
        },
        methods: {
            setLabelChecked(index, isChecked) {
                if (isChecked) {
                    this.model.level = this.option[index].id;
                }
            },
            resetModel(model) {
                Object.keys(this.model).forEach(key => {
                    this.model[key] = model[key];
                });
            },
            getModel() {
                let model = {...this.model};
                model.commission_1 = model.commission_1 ? model.commission_1 : '0';
                model.commission_2 = model.commission_2 ? model.commission_2 : '0';
                return model;
            },
            onValidate(prop, status){
                this.cacheError={
                    ...this.cacheError,
                    [prop]: status
                }
            },
            validate() {
                return new Promise(resolve => {
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
        }
    };
</script>

<style scoped lang="scss">
    .commission-rate {
        padding-bottom: 30px;
        /deep/ .check-label {
            .label-item {
                width: 60px;
            }
        }
    }
</style>
