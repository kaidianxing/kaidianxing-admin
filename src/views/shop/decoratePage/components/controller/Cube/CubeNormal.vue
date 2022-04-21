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
    <div class="normal_box">
        <cube-text
            :width="750 / currentModal.data.length"
            :height="750 / currentModal.data.length"
            :class="[currentModal.params.cubestyle]"
            :is-active="value === index"
            v-for="(item,index) in currentModal.data"
            :key="index"
            @click.native="chooseCube(index)"
            :imgurl="currentModal.data[index].imgurl"
            :style="{
                height: getHeight
            }"
            showWord
        ></cube-text>
    </div>
</template>

<script>
import mixin from '../mixin'
import CubeText from './CubeText'
export default {
    mixins: [mixin],
    props: {
        value: [String, Number]
    },
    components: {
        CubeText
    },
    computed: {
        getHeight() {
            let baseNum = 400 / (this.currentModal.params.cubestyle == 'cell_two' ? 2 : 3);
            if (this.currentModal.params.imgheight) {
                return this.currentModal.params.imgheight * baseNum / this.currentModal.params.imgwidth + 'px'
            } else {
                return baseNum + 'px'
            }
        }
    },
    methods: {
        chooseCube(index) {
            this.$emit('input', index)
        }
    }
}
</script>