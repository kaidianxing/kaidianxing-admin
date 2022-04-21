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
    <div class="drag-item-container" @dragstart.stop  @drag.stop  @dragend.stop>
        <i class="iconfont icon-move move-icon"></i>
        <div class="item-box">
            <slot name='prepend'></slot>
            <div class='item'>
                <p class="label" :style='{width:labelWidth+"px"}'>{{label1}}
                </p>
                <div class="content">
                    <Input :maxlength="maxlength" v-model='item[text]' show-word-limit :placeholder="placeholder" style="width: 100%" @on-change='getInput' />
                </div>
            </div>
            <slot name='insert'></slot>
            <div class='item' style='margin-bottom:0;'>
                <p class="label" :style='{width:labelWidth+"px"}'>{{label2}}</p>
                <div class="content">
                    <SelectLink :value='{
                        url: item.linkurl,
                        name: item.linkurl_name,
                        wxappid: item.wxappid
                    }' :tab-name="tabName" @change='changeLink'></SelectLink>
                </div>
            </div>
            <slot name='append'></slot>
        </div>
    </div>
</template>

<script>
    import SelectLink from './SelectLink'
    export default {
        components: {
            SelectLink
        },
        props: {
            nodel:{
                type:Boolean,
                default:false
            },
            text: {
                type: String,
                default: 'text'
            },
            labelWidth:{
                type: [String,Number],
                default: 70
            },
            linkurl: {
                type: String,
                default: 'linkurl'
            },
            label1: {
                type: String,
                default: '文字：'
            },
            label2: {
                type: String,
                default: '链接：'
            },
            item: {
                type: Object,
                default: () => ({})
            },
            maxlength: {
                type: [String, Number],
                default: 5
            },
            placeholder: {
                type: String,
                default: '请输入按钮文字'
            }
        },
        data() {
            return {
                tabName: 'store,goods,liver,coupon,customLink,goodsClassify,wxapplink'
            }
        },
        created(){
            let paths = ['/decorate/custom']
            if(paths.includes(this.$route.path) ) {
               this.tabName = this.tabName.replace(',customLink','')
            }
        },
        methods: {
            getInput(val) {
                this.$emit('on-change', val.target.value)
            },
            changeLink(val) {
                this.$emit('change-link', val)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .drag-item-container {
        position: relative;
        padding: 10px 10px 0;
        display: flex;
        align-items: center;

        .item-box {
            margin-left: 10px;
            flex: 1;
        }

        .move-icon {
            color: #b8b9bd;
            font-size: 24px;
        }
        /deep/ .close.ivu-icon {
            position: absolute;
            font-size: 18px;
            top: -6px;
            right: -9px;
            color: rgba(0, 0, 0, .3);
        }
        .item {
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
            position: relative;
            margin-bottom: 10px;
            .label {
                color: #262B30;
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
                line-height: 34px;
                margin-right: 10px;
                width: 110px;
                text-align: right;
            }
            .content {
                width: 0;
                flex: 1;
            }
        }
    }
</style>
