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
            <span class="title">多选</span>
        </div>
        <div class="input-title">
            <Input v-model="model.params.title" placeholder="请输入">
                <span slot="prepend">标题</span>
            </Input>
        </div>
        <div class="input-middle-box multi-line">
            <div class="input-middle-item">
                <Input v-model="model.params.explain" placeholder="请输入说明文字">
                    <span slot="prepend">说明</span>
                </Input>
            </div>
            <div class="input-middle-item" v-for="(item, index) in model.data" :key="index">
                <Input v-model="item.name" placeholder="请输入">
                    <span slot="prepend">选项{{index + 1}}</span>
                </Input>
                <Button class="marginL-10" type="text" :disabled="disabled" @click="deleteItem(index)">删除</Button>
            </div>
            <div class="input-middle-item">
                <Button type="text" @click="addData">+添加选项</Button>
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
        computed: {
            disabled() {
                return this.model?.data?.length === 1;
            }
        },
        methods: {
            addData() {
                this.model.data.push({
                    name: `选项${this.model.data.length + 1}`
                })
            },
            handleDelete() {
                this.$emit('on-delete')
            },
            deleteItem(index) {
                this.model.data.splice(index, 1);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';

</style>
