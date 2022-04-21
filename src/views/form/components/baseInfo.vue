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
    <div class="custom-base-info">
        <FormItem label="表单名称：" prop="title">
            <Input :value="model.title" maxlength="20" show-word-limit placeholder="请输入表单名称" class="width-250" @on-change="changeTitle"/>
        </FormItem>
    </div>
</template>

<script>
    import {
        mapState
    } from 'vuex';

    export default {
        props: {
            id: {
                type: [String, Number]
            }
        },
        computed: {
            ...mapState('form', {
                model: state => state.model
            })
        },
        methods: {
            changeTitle(e) {
                this.$store.commit('form/setTitle', e.target.value);
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
