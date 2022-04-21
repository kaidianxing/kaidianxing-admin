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
    <div class='show-icon2'> 
          <div class='custom-form-item icon-selector' style='margin:0 0 20px ;'>
                <p class="label" style='width:80px;padding-right:10px;'>角标图片：</p>
                 <MyAddImgImg size='mini' :value='componentData.params.goodsiconsrc' @change='changeImg'></MyAddImgImg>
        </div>
        <form-item label="角标位置：" :label-width='80' style='margin-bottom:30px;'>
            <MyRadioGroup :items='goodsIconPos' v-model='componentData.params.iconposition'>
            </MyRadioGroup>
        </form-item>
        <form-item label="上下间距：" :label-width='80'>
            <MyDraggableProgress :min='0' :max='60' unit='px' v-model='componentData.style.iconpaddingtop'></MyDraggableProgress>
        </form-item>
        <form-item label="左右间距：" :label-width='80'>
            <MyDraggableProgress :min='0' :max='60' unit='px' v-model='componentData.style.iconpaddingleft'></MyDraggableProgress>
        </form-item>
        <form-item label="角标缩放：" style='margin-bottom:0' :label-width='80'>
            <MyDraggableProgress :min='0' :max='100' unit='%' v-model='componentData.style.iconzoom'></MyDraggableProgress>
        </form-item>
    </div>
</template>

<script>
    import mixin from '../mixin.js'
    export default {
        props: {
            currentInfo:{
                type: Object,
                default: ()=> {}
            }
        },
        mixins: [mixin],
        data() {
            return {
                goodsIconPos: [{
                    label: '左上',
                    id: 'left top'
                }, {
                    label: '右上',
                    id: 'right top'
                }, {
                    label: '左下',
                    id: 'left bottom'
                }, {
                    label: '右下',
                    id: 'right bottom'
                }],
                componentData: {}
            }
        },
        created(){
            this.componentData = this.currentInfo || this.currentModal
        },
        methods: {
            changeImg(val) {
                this.componentData.params.goodsiconsrc = val;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../common.scss';
    .show-icon2{
        /deep/ .ivu-radio-group-item{
            margin-right: 16px;
        }
    }
</style>