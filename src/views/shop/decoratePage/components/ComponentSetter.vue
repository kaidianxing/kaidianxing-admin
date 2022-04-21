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
    <Card class='component-setter' ref='cardBody' v-if='curModalBrief && curModalBrief.groupType'>
        <div slot="title" class="title">
            <i :class='curModalBrief.icon' v-if="curModalBrief.icon" :style='{color:curModalBrief.color}'></i>
            <img class="btn-svg" :src="require(`@/assets/svg/decorateIcon/${curModalBrief.svg}.svg`)" alt v-else />
            <span>{{getName}}</span>
        </div>
        <div class="panel-body" ref='panelBody'>
            <keep-alive>
                <component :visible-area='visibleArea' :is='componentName' :key='componentName'></component>
            </keep-alive>
        </div>
    </Card>
</template>

<script>
    import {
        mapState,
        mapGetters,
        mapMutations
    } from 'vuex'
    import components from './allControllers.js'
    let comps = {}
    Object.keys(components).forEach(item => {
        let key = item.replace('Ctl', '')
        comps[item] = () =>
            import ('./controller/' + key+'.vue')
    })

    export default {
        components: {
            ...comps
        },
        computed: {
            ...mapGetters('decorate', []),
            ...mapState('decorate', ['curModalBrief']),
            getName() {
                return this.curModalBrief.name
            }
        },
        provide() {
            return {
                resizeParent: this.onResize
            }
        },
        data() {
            return {
                componentName: '',
                visibleArea: {
                    top: 0,
                    bottom: 0,
                }
            }
        },
        watch: {
            'curModalBrief.type': {
                immediate: true,
                handler() {
                    if (this.curModalBrief?.type) {
                        this.getComponentName(this.curModalBrief.type)
                    }
                }
            },
            curModalBrief: {
                immediate: true,
                deep: true,
                handler() {
                    this.$nextTick(() => {
                        if (this.$refs.cardBody) {
                            let area = this.$refs.cardBody.$el.lastChild;
                            this.visibleArea = {
                                top: area.scrollTop,
                                bottom: area.clientHeight + area.scrollTop
                            }
                            area.onscroll = () => {
                                this.visibleArea = {
                                    top: area.scrollTop,
                                    bottom: area.clientHeight + area.scrollTop,
                                }
                            }
                        }
                    })
                }
            }
        },
        methods: {
            ...mapMutations('decorate', []),
            getComponentName(type) {
                let name = ''
                if (type) {
                    name = 'Ctl' + type.replace(/^./, e => e.toUpperCase())
                    if (name && name != this.componentName) {
                        this.componentName = name
                    }
                }
            },
            onResize() {
                this.$nextTick(() => {
                    let area = this.$refs.cardBody.$el.lastChild;
                    this.visibleArea = {
                        top: area.scrollTop,
                        bottom: area.clientHeight + area.scrollTop
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .component-setter {
        transform: translateX(0);
        position: absolute;
        width: 540px;
        height: 100%;
        right: 0;
        top: 0;
        /* global/white */
        background: #FFFFFF;
        /* global/border */
        border: 1px solid #E9EDEF;
        box-sizing: border-box;
        border-radius: 2px;
        /deep/ .ivu-card-body {
            padding: 20px;
        }
        .title {
            display: flex;
            align-items: center;
        }
        .panel-body {
            border-bottom: 1px solid #fff;
        }
        .ivu-card-head {
            div {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: bold;
                font-size: 18px;
                height: 20px;
                line-height: 18px;
            }
            i,
            .btn-svg {
                margin-right: 6px;
                width: 24px;
                height: 24px;
                font-size: 24px;
                line-height: 24px;
            }
        }
        /deep/ .ivu-card-body {
            height: calc(100% - 51px);
            overflow-y: auto;
        }
    }
</style>
