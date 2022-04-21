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
    <div class="goods-type">
        <kdx-form-title content="商品类型"></kdx-form-title>
        <FormItem label="" prop="type">
            <multi-select v-model="model_type"></multi-select>
        </FormItem>
    </div>
</template>

<script>
import MultiSelect from './MultiSelect'
import { modelMap } from './binders.js'

export default {
    components: {
        MultiSelect,
    },
    computed: {
        /**
         * 双向绑定vuex/goodAddEdit.js/state/model
         * 使用方法this.model_${propsName}
         */
        ...modelMap(),
    },
    methods: {},
}
</script>

<style lang="scss" scoped>
.goods-type {
    /deep/ .ivu-form-item-content {
        margin-left: 0 !important;
    }
}
</style>
