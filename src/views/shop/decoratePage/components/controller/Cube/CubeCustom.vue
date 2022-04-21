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
    <div class="custom_box">
        <ul
            class="cube-items"
            v-for="(item,index) in currentModal.params.cubenum"
            :key="index"
        >
            <li
                class="cube-item"
                v-for="(cItem, cIndex) in currentModal.params.cubenum"
                :key="cIndex"
                :class="{
                    'selecting': selecting.includes(item+','+cItem)
                }"
                @click="startMove(item,cItem)"
                @mousemove="move(item,cItem)"
            >
                <i
                    class="iconfont icon-tianjiatupian"
                    v-if="!selecting.includes(item+','+cItem)"
                ></i>
            </li>
        </ul>
        <div
            class="cue-check-item"
            :class="value == index?'active':''"
            v-for="(item,index) in currentModal.data"
            :key="index + '_'"
            :style="getStyle(item)"
        >
            <div class="item-box">
                <cube-text
                    :width="getWidth(item)"
                    :height="getHeight(item)"
                    @click.native="chooseCube(index)"
                    :imgurl="currentModal.data[index].imgurl"
                    :is-active="value === index"
                ></cube-text>
            </div>
            <img
                class="delitem"
                :src="isHover?delIcon1:delIcon2"
                @click="delHandler(index)"
                @mouseenter="hoverHander(true)"
                @mouseleave="hoverHander(false)"
                v-if="value === index"
                data-html2canvas-ignore
            />
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
    created() {
        this.currentModal.data.map(v => {
            this.dealPoint(v.startP, v.endP).forEach(v => this.selectObj[v] = true)
        })
    },
    data() {
        return {
            moveing: false,
            startP: '',
            lastP: '',
            selecting: [],
            selectObj: {},
            delIcon1: require('@/assets/svg/del-hover.svg'),
            delIcon2: require('@/assets/svg/del-normal.svg'),
            isHover: false
        }
    },
    methods: {
        move(i, c) {
            if (!this.moveing) return

            let lastP = `${i},${c}`

            if (this.startP && (this.lastP !== lastP)) {
                this.lastP = lastP;
                this.selecting = this.dealPoint(this.startP, this.lastP)
            }

        },
        startMove(i, c) {
            let point = `${i},${c}`
            // 开启移动
            if (!this.startP) {
                this.startP = point
                this.moveing = true
                this.selecting.push(this.startP)

            }
            // 结束移动
            else if (this.startP) {
                let selected = this.dealPoint(this.startP, point)
                selected.forEach(v => this.selectObj[v] = true)
                this.currentModal.data.push({
                    linkurl: '',
                    linkurl_name: '',
                    imgurl: '',
                    startP: selected[0],
                    endP: selected[selected.length - 1]
                })
                this.moveing = false

                this.resetPoint()
                this.chooseCube(this.currentModal.data.length - 1)
            }

        },
        dealPoint(x, y, parse = false) {
            if (!x || !y) return
            //  取出起点与结束点坐标
            let [startX, startY] = x.split(',');
            let [endX, endY] = y.split(',');

            // 取出最小坐标(sx,sy)最大坐标(ex,ey)
            let sx, sy, ex, ey;
            sx = Math.min(startX, endX)
            ex = Math.max(startX, endX)
            sy = Math.min(startY, endY)
            ey = Math.max(startY, endY)

            let arr = [], staus = false;

            for (let sx1 = sx; sx1 <= ex; sx1++) {
                for (let sy1 = sy; sy1 <= ey; sy1++) {
                    let point = `${sx1},${sy1}`

                    // parse等于true过滤不判断已选中的,用做删除用
                    if (this.selectObj[point] && !parse) {
                        staus = true
                    }

                    arr.push(point)
                }
            }

            // 存在选中坐标点返回上一次选中
            return staus ? this.selecting : arr;

        },
        // 重置魔方
        resetCube() {
            this.resetPoint()
            this.selectObj = {}
            this.currentModal.data.splice(0)
        },
        // 重置点位
        resetPoint() {
            this.startP = ''
            this.lastP = ''
            this.selecting = []
        },
        // 计算比例
        getStyle({ startP, endP }) {
            if (!startP || !endP) return;
            let [sx, sy] = startP.split(',')
            let [ex, ey] = endP.split(',')

            let baseRatio = 100 / this.currentModal.params.cubenum
            let style = {
                left: baseRatio * (sx - 1) + '%',
                top: baseRatio * (sy - 1) + '%',
                width: baseRatio * (ex - sx + 1) + '%',
                height: baseRatio * (ey - sy + 1) + '%'
            }

            if (style.left != '0%') {
                style.left = `calc(${baseRatio * (sx - 1)}% - 1px)`
                style.width = `calc(${baseRatio * (ex - sx + 1)}% + 1px)`
            }

            if (style.top != '0%') {
                style.top = `calc(${baseRatio * (sy - 1)}% - 1px)`
                style.height = `calc(${baseRatio * (ey - sy + 1)}% + 1px)`
            }

            return style

        },
        hoverHander(status) {
            this.isHover = status
        },
        chooseCube(index) {
            this.$emit('input', index)
        },
        delHandler(index) {
            let { startP, endP } = this.currentModal.data[index]
            this.dealPoint(startP, endP, true).forEach(v => this.selectObj[v] = false)
            this.currentModal.data.splice(index, 1)
            this.$emit('input', -1)
        },
        getWidth({ startP, endP }) {
            let [sx] = startP.split(',')
            let [ex] = endP.split(',')

            return Math.ceil(750 / this.currentModal.params.cubenum * (ex - sx + 1))
        },
        getHeight({startP, endP}){
            let sy = startP.split(',')[1]
            let ey = endP.split(',')[1]

            return Math.ceil(750 / this.currentModal.params.cubenum * (ey - sy + 1))
        }
    }
}
</script>


<style lang="scss" scoped>
.custom_box {
    margin-top: 10px;
    position: relative;
    width: 400px;
    height: 400px;
    display: flex;

    .cube-items {
        display: inline-block;
        display: flex;
        flex-direction: column;
        flex: 1;

        &:last-of-type {
            .cube-item {
                border-right: 1px solid #e5e5e5;
            }
        }
    }

    .cube-item {
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #e5e5e5;
        border-top: 1px solid #e5e5e5;
        flex: 1;
        box-sizing: border-box;
        background: #f4f6f8;

        &:last-child {
            border-bottom: 1px solid #e5e5e5;
        }

        .icon-tianjiatupian {
            font-size: 12px;
            color: #939799;
        }
    }

    .cube-item.selecting {
        background: #e8f7fd;
        border-color: #e5e5e5;
    }

    .cue-check-item {
        position: absolute;
        background: rgba(45, 140, 240, 0.2);
        border: 1px solid #e5e5e5;
        box-sizing: border-box;

        &.active {
            /deep/ .cube-text {
                border: 1px solid $brand-color;
            }
        }
        .delitem {
            position: absolute;
            top: -12px;
            right: -12px;
            font-size: 20px;
            height: 20px;
            line-height: 20px;
            width: 20px;
            color: #636669;
            cursor: pointer;
            z-index: 9999;
        }
    }

    .item-box {
        height: 100%;
        width: 100%;
        background-color: #fff;

        display: flex;

        /deep/ .cube-text {
            border: 0;
        }
    }
}
</style>