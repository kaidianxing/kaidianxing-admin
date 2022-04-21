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
    <div class="fixedsearch" :class="[{noLeft:componentData.params.leftnav==0 || componentData.params.showstyle>0,noRight:componentData.params.rightnav==0},componentData.params.searchstyle]" :style="{background:getBg}" v-if='componentData&&componentData.id=="fixedsearch"'>
        <i class="pre-icon" :class="[componentData.params.leftnavicon]" v-if="componentData.params.leftnav==1" :style="{color:componentData.style.leftnavcolor}" @click="clickLeftIcon"></i>
        <img mode="aspectFit" lazy-load :src="componentData.params?$utils.media(componentData.params.imgurl_left):''" alt='' class="icon-img" :style='{width:imgWidth}' v-else-if="componentData.params&&componentData.params.leftnav==2&&componentData.params.imgurl_left" @click="clickLeftIcon" />
        <div class='input-box' :style='{background:componentData.style.searchbackground,textAlign:componentData.params.textalign,borderRadius: `${px2rpx(componentData.style.borderradius)}`}' @click='clickInput'>
            <span class='placeholder' :style="{color:componentData.style.searchtextcolor}">
                                <i class="search-icon iconfont-m- icon-m-shangpinxiangqing-search" :style="{color:componentData.style.searchiconcolor}"></i>{{componentData.params.placeholder}}</span>
        </div>
        <i class="aft-icon" :class="[componentData.params.rightnavicon]" v-if="componentData.params.rightnav==1" :style="{color:componentData.style.rightnavcolor}" @click="clickRightIcon"></i>
        <img mode="widthFix" lazy-load :src="$utils.media(componentData.params.imgurl_right)" alt='' class="icon-img" v-else-if="componentData.params.rightnav==2&&componentData.params.imgurl_right" @click="clickRightIcon" />
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'fixedsearch',
        data() {
            return {
                inputVal: '',
                imgWidth: 60
            }
        },
        computed: {
            isReadOnly() {
                return this.componentData.params.rightnavclick == '0'
            },
            getBg(){
                if( this.componentData.params.bgstyle =='color'){
                    return this.componentData.style.background
                } else {
                    return ''
                }
            }
        },
        watch: {
            'componentData.params.leftwidth': {
                immediate: true,
                handler() {
                    if (this.$utils.getImgSize && this.componentData.params&&this.componentData.params.imgurl_left) {
                        let that = this;
                        that.imgWidth = this.px2rpx(this.componentData.params.leftwidth || 60)
                    } else {
                        this.imgWidth = 'auto'
                    }
                }
            }
        },
        mounted() {
            this.fixOldStyle()
        },
        methods: {
            clickLeftIcon() {
                this.$emit('custom-event', {
                    target: 'fixedsearch/clickLeftIcon',
                    data: this.componentData
                })
            },
            clickInput() {
                this.$emit('custom-event', {
                    target: 'fixedsearch/clickInput',
                    data: this.componentData
                })
            },
            clickRightIcon() {
                this.$emit('custom-event', {
                    target: 'fixedsearch/clickRightIcon',
                    data: this.componentData
                })
            },
            fixOldStyle(){ // 修补新版本字段结构变动会导致的样式问题
                let {searchstyle,bgstyle} = this.componentData.params;

                if(bgstyle == null){
                    this.componentData.params.bgstyle = 'color'
                }
                let borderradius = this.componentData.style.borderradius;
                if(borderradius == null){
                    let radius = 0;
                    if(searchstyle == 'round'){
                        radius = 34
                    } else {
                        radius = 10
                    }
                    this.componentData.style.borderradius = radius
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .fixedsearch {
        width: 100%;
        height: px2rpx(46);
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;
        box-sizing: border-box;
        padding: 0 rpx(8);
        &.noLeft {
            padding-left: rpx(20);
        }
        &.noRight {
            padding-right: rpx(20);
        }
        &.hasLftRgt {
            padding: 0 px2rpx(12);
        }
       
        .input-box {
            position: relative;
            width: 0;
            flex: 1;
            height: px2rpx(30);
            line-height: px2rpx(30);
            box-sizing: border-box;
            margin: auto rpx(4);
            border: none;
            overflow: hidden;
            text-align: left;
          
            .placeholder {
                padding: 0 px2rpx(12);
                font-size: px2rpx(12);
            }
        }
        .search-icon {
            width: px2rpx(15);
            height: px2rpx(15);
            font-size: px2rpx(16);
            overflow: hidden;
            color: #b4b4b4;
            line-height: px2rpx(16);
            text-align: center;
            vertical-align: px2rpx(-1);
        }
        .input {
            width: 100%;
            flex: 1;
            height: px2rpx(30);
            border: none;
            box-sizing: border-box;
            padding: 0 px2rpx(12);
            font-size: px2rpx(12);
            background: rgba(0, 0, 0, 0);
        }
        .pre-icon,
        .aft-icon {
            color: #fff;
            width: rpx(56);
            height: rpx(56);
            flex-shrink: 0;
            text-align: center;
            display: flex;
            justify-content: center;
            flex-direction: column;
            margin: auto rpx(2);
            overflow: hidden;
            font-size: px2rpx(24);
        }
        .icon-img {
            flex-shrink: 0;
            max-width: px2rpx(60);
            min-width: 30px;
            margin: auto rpx(8);
        }
        .position {
            display: flex;
            align-items: center;
            max-width: px2rpx(96);
            &.marginR_12 {
                margin-right: px2rpx(12);
            }
            i {
                font-size: px2rpx(12);
                line-height: px2rpx(16);
                &.iconfont-def {
                    color: #fff;
                }
            }
            .locationtext {
                font-size: px2rpx(12);
                line-height: px2rpx(16);
                margin-left: px2rpx(2);
                &.overflow-h {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }
        }
    }
</style>