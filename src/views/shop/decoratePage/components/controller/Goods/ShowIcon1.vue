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
    <div class='show-icon1'>
        <form-item label="角标样式：" style='margin-bottom:40px;' :label-width='80'>
            <MyButtonGroup :items='markStyle' v-model='componentData.style.iconstyle'></MyButtonGroup>
        </form-item>
        <form-item class='badge-content' label="角标文字：" style='margin-bottom:0px;' :label-width='80'>
            <MyRadioGroup class='markType' :items='handlerMarkType' v-model='componentData.style.goodsicon'>
                <i-input v-model="componentData.params.customicontext" maxlength="5" show-word-limit v-if='componentData.style.goodsicon=="customtext"'></i-input>
            </MyRadioGroup>
        </form-item>
    </div>
</template>

<script>
    import mixin from '../mixin.js'
    export default {
        props: {
            currentInfo: {
                type: Object,
                default: ()=>{}
            },
            type: {
                type: String,
                default: ''
            }
        },
        mixins: [mixin],
        data() {
            return {
                componentData: {},
                markStyle: [{
                    label: '样式1',
                    img: this.$utils.staticImg('goods/3.png'),
                    id: 'circle'
                }, {
                    label: '样式2',
                    img: this.$utils.staticImg('goods/7.png'),
                    id: 'rectangle'
                }, {
                    label: '样式3',
                    img: this.$utils.staticImg('goods/1.png'),
                    id: 'triangle'
                }, {
                    label: '样式4',
                    img: this.$utils.staticImg('goods/5.png'),
                    id: 'echelon'
                }, {
                    label: '样式5',
                    img: this.$utils.staticImg('goods/4.png'),
                    id: 'square'
                }, ],
                markType: [{
                    label: '推荐',
                    icon: 'ivu-icon ivu-icon-ios-contract',
                    id: 'recommand'
                }, {
                    label: '热销',
                    icon: 'ivu-icon ivu-icon-ios-contract',
                    id: 'hotsale'
                }, {
                    label: '上新',
                    icon: 'ivu-icon ivu-icon-ios-contract',
                    id: 'isnew'
                }, {
                    label: '包邮',
                    icon: 'ivu-icon ivu-icon-ios-contract',
                    id: 'sendfree'
                }, {
                    label: '自定义',
                    icon: 'ivu-icon ivu-icon-ios-contract',
                    id: 'customtext'
                }],
            }
        },
        computed: {
            handlerMarkType() {
                let result = this.markType;
                return result
            }
        },
        created(){
            this.componentData = this.currentInfo || this.currentModal
        }
    }
</script>

<style lang="scss" scoped>
    @import '../common.scss';
    .show-icon1 {
        /deep/ .badge-content .ivu-radio-group-item {
            margin-right: 16px;
        }
        .markType {
            /deep/ .content {
                padding: 0;
            }
        }
    }
</style>