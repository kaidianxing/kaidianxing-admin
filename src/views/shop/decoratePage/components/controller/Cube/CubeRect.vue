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
    <div
        class="rect_box"
        :class="[currentModal.params.cubestyle]"
    >
        <cube-text
            @click.native="chooseCube(0)"
            :width="currentModal.params.cubestyle=='top1_bottom2'?750:375"
            :height="currentModal.params.cubestyle=='top1_bottom2'?375:750"
            :imgurl="currentModal.data[0].imgurl"
            :is-active="value === 0"
        ></cube-text>

        <div class="second_box">

            <cube-text
                @click.native="chooseCube(1)"
                :imgurl="currentModal.data[1].imgurl"
                :is-active="value === 1"
            ></cube-text>

            <cube-text
                @click.native="chooseCube(2)"
                :imgurl="currentModal.data[2].imgurl"
                :is-active="value === 2"
                v-if="currentModal.params.cubestyle!='left1_right3'"
            ></cube-text>

            <div
                class="third-box"
                v-else
            >
                <cube-text
                    width="188"
                    @click.native="chooseCube(2)"
                    :imgurl="currentModal.data[2].imgurl"
                    :is-active="value === 2"
                ></cube-text>

                <cube-text
                    width="188"
                    @click.native="chooseCube(3)"
                    :imgurl="currentModal.data[3].imgurl"
                    :is-active="value === 3"
                ></cube-text>
            </div>
        </div>
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
    methods: {
        chooseCube(index) {
            this.$emit('input', index)
        }
    }
}
</script>

<style lang="scss" scoped>
.rect_box {
    display: flex;
    height: 400px;
    width: 400px;

    .second_box {
        flex: 1;
        display: flex;
        overflow: hidden;
    }

    &.top1_bottom2 {
        flex-direction: column;
    }

    &.left1_right2,
    &.left1_right3 {
        .second_box {
            flex-direction: column;
        }
    }

    .third-box {
        display: flex;
        flex: 1;
        overflow: hidden;
    }
}
</style>