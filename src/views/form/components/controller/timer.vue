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
            <span class="title">时间</span>
        </div>
        <div class="input-title">
            <Input v-model="model.params.title" placeholder="请输入">
                <span slot="prepend">标题</span>
            </Input>
        </div>
        <div class="input-middle-box flex-column input-middle-datepicker">
            <div class="input-middle-item">
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
            <div class="input-middle-item date-pick">
                <div class="middle-item-item flex">
                    <div class="label">
                        默认：
                    </div>
                    <div class="content">
                        <RadioGroup v-model="model.params.status">
                            <Radio :label="2">
                                <span>不默认</span>
                            </Radio>
                            <Radio :label="0">
                                <span>填表当天</span>
                            </Radio>
                            <Radio :label="1">
                                <span>指定时间</span>
                            </Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div class="middle-item-item" v-if="model.params.status">
                    <TimePicker :value="model.params.value" type="time" placeholder="请选择指定日期" @on-change="changeTimer"></TimePicker>
                </div>
            </div>
        </div>
        <div class="is-required">
            <i-switch v-model="model.params.required" size="small" />
            <span class="switch-text">{{model.params.required? '必填' : '非必填'}}</span>
        </div>
        <div class="delete-btn">
            <Button type="text" @click="handleDelete">删除</Button>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        methods: {
            handleDelete() {
                this.$emit('on-delete')
            },
            changeTimer(time) {
              this.model.params.value = time;
            }
        }

    }
</script>

<style lang="scss" scoped>
    @import './common.scss';

</style>
