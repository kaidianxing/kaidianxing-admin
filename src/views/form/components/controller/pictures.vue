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
            <span class="title">图片</span>
        </div>
        <div class="input-title">
            <Input v-model="model.params.title" placeholder="请输入">
                <span slot="prepend">标题</span>
            </Input>
        </div>
        <div class="input-middle-box">
            <div class="input-middle-item">
                <Input v-model="model.params.explain" placeholder="请输入说明文字">
                    <span slot="prepend">说明</span>
                </Input>
            </div>
            <div class="input-middle-item">
                <kdx-rr-input v-model="model.params.maxNumber" number :fixed="0" :min-value="1" :max-value="10" placeholder="默认最多可上传10张">
                    <span slot="prepend">最大上传数量</span>
                    <span slot="append">张</span>
                </kdx-rr-input>
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
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        methods: {
            handleDelete() {
                this.$emit('on-delete')
            }
        }

    }
</script>

<style lang="scss" scoped>
    @import './common.scss';

</style>
