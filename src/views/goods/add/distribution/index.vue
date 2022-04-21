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
    <div class="good-add-distribution">
        <Form ref="form" :rules="rules" :label-width="120">
            <div class="box">
                <kdx-form-title>
                    基本信息
                </kdx-form-title>
                <FormItem
                    label="参与分销："
                    prop="join_distibution"
                    class="r-form-item-checkbox"
                >
                    <RadioGroup v-model="model.is_commission">
                        <Radio label="0">不参与</Radio>
                        <Radio label="1">参与</Radio>
                    </RadioGroup>
                    <div v-if="model.is_commission === '0'">
                        <kdx-hint-text
                            content="如果不参与分销，则不产生分销佣金"
                        ></kdx-hint-text>
                    </div>
                </FormItem>
            </div>
        </Form>
    </div>
</template>

<script>
import { stateMap, modelMap } from '../base/components/binders'
import { mapState } from 'vuex'
export default {
    name: 'index',
    computed: {
        ...mapState('goodAddEdit', {
            model: (state) => state.model,
        }),
        ...stateMap(['rules']),
        ...modelMap(),
    },
    data() {
        return {}
    },
    mounted() {
    },
}
</script>

<style scoped lang="scss">
.good-add-distribution {
    .ivu-form {
        padding: 0 40px;
    }
    .tips {
        font-size: 12px;
        line-height: 16px;
        color: #939799;
        span {
            color: $brand-color;
            cursor: pointer;
        }
    }
}
</style>
