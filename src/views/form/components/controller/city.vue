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
    <div class="controller-item">
        <div class="title-icon">
            <span class="iconfont icon-move"></span>
            <span class="title">地区</span>
        </div>
        <div class="input-title">
            <Input v-model="model.params.title" placeholder="请输入">
                <span slot="prepend">标题</span>
            </Input>
        </div>
        <div class="input-middle-box multi-line">
            <div class="input-middle-item flex input-city-explain">
                <div class="input-middle-item">
                    <Input v-model="model.params.explain" placeholder="请输入说明文字">
                        <span slot="prepend">说明</span>
                    </Input>
                </div>
                <div class="input-middle-item">
                    <Input v-model="model.params.tip" placeholder="请输入">
                        <span slot="prepend">提示语</span>
                    </Input>
                </div>
            </div>
            <div class="input-middle-item">
                <div class="label">
                    填写条件：
                </div>
                <div class="content">
                    <RadioGroup v-model="model.params.status">
                        <Radio :label="2">
                            <span>省份</span>
                        </Radio>
                        <Radio :label="0">
                            <span>省市</span>
                        </Radio>
                        <Radio :label="1">
                            <span>省市区</span>
                        </Radio>
                    </RadioGroup>
                </div>
            </div>
            <div class="input-middle-item input-city">
                <div class="middle-item-item">
                    <div class="select-city">
                        <div class="select-prefix">
                            默认值 省
                        </div>
                        <Select v-model="model.params.province" clearable @on-change="changeProvince">
                            <Option v-for="item in provinceList" :value="item.name" :key="item.id">{{ item.name
                                }}
                            </Option>
                        </Select>
                    </div>
                </div>
                <div class="middle-item-item" v-if="model.params.status === 0 || model.params.status === 1">
                    <div class="select-city">
                        <div class="select-prefix">
                            默认值 市
                        </div>
                        <Select v-model="model.params.city" clearable @on-change="changeCity">
                            <Option v-for="item in cityList" :value="item.name" :key="item.id">{{ item.name }}
                            </Option>
                        </Select>
                    </div>
                </div>
                <div class="middle-item-item" v-if="model.params.status === 1">
                    <div class="select-city">
                        <div class="select-prefix">
                            默认值 区
                        </div>
                        <Select v-model="model.params.area" clearable>
                            <Option v-for="item in areaList" :value="item.name" :key="item.id">{{ item.name }}
                            </Option>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
        <div class="is-required">
            <i-switch v-model="model.params.required" size="small"/>
            <span class="switch-text">{{model.params.required? '必填' : '非必填'}}</span>
        </div>
        <div class="delete-btn">
            <Button type="text" @click="handleDelete">删除</Button>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js';

    export default {
        mixins: [mixin],
        data() {
            return {
                provinceList: [],
                cityList: [],
                areaList: []
            };
        },
        async created() {
            await this.$store.dispatch('config/getAddress');
            this.initCity();
        },
        methods: {
            handleDelete() {
                this.$emit('on-delete');
            },
            changeProvince(name) {
                this.model.params.city = '';
                this.areaList = [];
                if (name) {
                    this.cityList = this.getList(this.provinceList, name);
                } else {
                    this.cityList = [];
                }
            },
            changeCity(name) {
                this.model.params.area = '';
                this.areaList = this.getList(this.cityList, name);
            },
            initCity() {
                this.provinceList = this.$store.state.config.address || [];
                if (this.model.params.province) {
                    this.cityList = this.getList(this.provinceList, this.model.params.province);
                    if (this.model.params.city) {
                        this.areaList = this.getList(this.cityList, this.model.params.city);
                    }
                }
            },
            getList(list = [], name) {
                let resList = [];
                for (let item of list) {
                    if (name === item.name) {
                        resList = item.children;
                        break;
                    }
                }
                return resList;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import './common.scss';

    .controller-item {
        .middle-item-item {
            .select-city {
                display: flex;
                align-items: center;

                .select-prefix {
                    background-color: $background-color;
                    flex-shrink: 0;
                    height: 32px;
                    line-height: 32px;
                    padding: 0 8px;
                    color: #515a6e;
                    border-top-left-radius: 2px;
                    border-bottom-left-radius: 2px;
                }
                .ivu-select {
                    flex: 1;
                }
            }
        }
    }
</style>
