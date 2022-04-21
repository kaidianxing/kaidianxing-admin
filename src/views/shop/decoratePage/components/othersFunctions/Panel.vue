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
    <div class='others-fun-panel' :style='getPos' @mousedown="mousedown" @mousemove='mousemove' @mouseup='mouseup' @click.stop>
        <ButtonGroup vertical>
            <Button icon="logo-facebook" :class='{activeBtn:activeIdx==0}' @click='changeName("Thumbnail",0)'></Button>
            <Button icon="logo-twitter" :class='{activeBtn:activeIdx==1}' @click='changeName("ComponentsFilter",1)'></Button>
            <Button icon="logo-googleplus" :class='{activeBtn:activeIdx==2}' @click='changeName("",2)'></Button>
            <Button icon="logo-tumblr" :class='{activeBtn:activeIdx==3}' @click='changeName("",3)'></Button>
        </ButtonGroup>
        <component :is='componentName' v-if='componentName'></component>
    </div>
</template>

<script>
    export default {
        components: {
            Thumbnail: () =>
                import ('./Thumbnail'),
            ComponentsFilter: () => import('./ComponentsFilter')
        },
        data() {
            return {
                nl: 310,
                nt: 100,
                componentName: '',
                activeIdx: -1,
            }
        },
        computed: {
            getPos() {
                return {
                    top: this.nt + "px",
                    left: this.nl + "px",
                }
            }
        },
        mounted() {
            this.lastnl = this.nl;
            this.lastnt = this.nt;
            this.$nextTick(() => {
                document.getElementsByClassName('decorate_page')[0].onclick = () => {
                    this.isDown = false;
                    this.lastnl = this.nl;
                    this.lastnt = this.nt;
                }
            })
        },
        methods: {
            changeName(name, idx) {
                this.componentName = name == this.componentName ? '' : name;
                this.activeIdx = this.activeIdx == idx ? -1 : idx;
            },
            mousedown(e) {
                //获取x坐标和y坐标
                this.x = e.clientX;
                this.y = e.clientY;
                //开关打开
                this.isDown = true;
            },
            mousemove(e) {
                if (!this.isDown) {
                    return;
                }
                //获取x和y
                var nx = e.clientX;
                var ny = e.clientY;
                //计算移动后的左偏移量和顶部的偏移量
                this.nl = nx - this.x + this.lastnl;
                this.nt = ny - this.y + this.lastnt;
            },
            mouseup() {
                this.lastnl = this.nl;
                this.lastnt = this.nt;
                //开关关闭
                this.isDown = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .others-fun-panel {
        position: fixed;
        background: #fff;
        width: 30px;
        height: 100px;
        z-index: 99999;
        top: 0;
        left: 0;
    }
    .activeBtn{
        z-index: 2;
        color: $brand-color;
        border-color: $brand-color;
    }
</style>