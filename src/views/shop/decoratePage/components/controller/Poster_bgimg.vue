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
    <div class='poster_bgimg' v-if='currentModal.id=="poster_bgimg"&&lazyLoad'>
        <i-form :label-width="100" ref='pictures' :model="currentModal" :rules="validator">
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="海报背景：" style='margin-bottom:10px;'>
                    <MyRadioGroup :items='bgtype' v-model='currentModal.params.bgtype'>
                        <form-item label="背景颜色：" style='margin-top:10px;margin-bottom:10px;' v-if='currentModal.params.bgtype==0'>
                            <MyColorPicker v-model='currentModal.style.bgcolor' default='#f5f5f5'></MyColorPicker>
                        </form-item>
                        <form-item label="背景图片：" style='margin-top:10px;margin-bottom:10px;' v-else>
                            <div style="display:inline-block;">
                                <MyAddImgImg v-model='currentModal.params.imgurl'></MyAddImgImg>
                                <p class='tip'>建议图片尺寸为750x1334，比例为9:16</p>
                            </div>
                        </form-item>
                    </MyRadioGroup>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_bgimg',
        data() {
            return {
                id:'poster_bgimg',
                bgtype: [{
                    label: '颜色',
                    id: 0
                }, {
                    label: '图片',
                    id: 1
                }],
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .poster_bgimg {
        width: 100%;
        height: 100%;
    }
</style>