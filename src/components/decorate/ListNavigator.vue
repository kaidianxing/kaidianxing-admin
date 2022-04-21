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
    <div class='list-navigator'>
        <i class="iconfont icon-move move-icon" v-if="draggabled"></i>
        <Form class="flex-item" :label-width='labelWidth'>
            <div v-if="$slots.top">
                <slot name="top"></slot>
            </div>
            <div class='custom-form-item' :class='[type]' style='position:relative;' v-if='!noicon'>
                <p class="label" :style="{width: labelWidth+'px'}">{{type=='icon'?iconLabel:'图片：'}}</p>
                <AddImgImg :value='value.icon' :type='type' size='mini' @change='changeIcon'></AddImgImg>
                <p class="tip" :style='{
                    left: labelWidth+"px"
                }' v-if='type=="image"'>{{tip}}</p>
            </div>
            <form-item :label="label1" v-if='!onelabel&&!nolabel'>
                <Input class='left-input' :value="value.title" :maxlength="textLength" show-word-limit placeholder="留空则不显示" @on-change='getInput("left",$event)' />
            </form-item>
            <form-item :label="label2" :style='{marginBottom:nolink?"0":"20px"}' v-if='!nolabel'>
                <Input v-if="textRightLen" class='right-input' :value="value.subTitle" show-word-limit placeholder="留空则不显示" @on-change='getInput("right",$event)' />
                <Input else class='right-input' :value="value.subTitle" placeholder="留空则不显示" @on-change='getInput("right",$event)' />
            </form-item>
             <div v-if="$slots.center">
                <slot name="center"></slot>
            </div>
            <form-item :label="linkLabel" :style="{
                'margin-bottom': $slots.bottom?'20px': 0
            }"  class='link' v-if='!nolink'>
                <SelectLink :value='{
                    name: value.linkurl_name,
                    url: value.linkurl,
                    wxappid: value.wxappid
                }'
                :tab-name="newTabName"
                 @change='changeLink'></SelectLink>
            </form-item>
            <div v-if="$slots.bottom">
                <slot name="bottom"></slot>
            </div>
        </Form>
    </div>
</template>

<script>
    import SelectLink from './SelectLink'
    import AddImgImg from './AddImgImg'
    export default {
        components: {
            SelectLink,
            AddImgImg
        },
        props: {
            labelWidth: {
                type: Number,
                default: 70
            },
            tip: {
                type: String,
                default: '建议图片宽度750，高度200~950。'
            },
            noicon:{
                type: Boolean,
                default: false
            },
            nolink: {
                type: Boolean,
                default: false
            },
            onelabel: {
                type: Boolean,
                default: false
            },
            nolabel:{
                type: Boolean,
                default: false
            },
            label1: {
                type: String,
                default: '左侧文字：'
            },
            label2: {
                type: String,
                default: '右侧文字：'
            },
            type: {
                type: String,
                default: 'icon'
            },
            value: {
                type: Object,
                default: () => ({
                    'title': '',
                    'icon': '', //要显示的icon
                    'cacheIcon': '', //不显示暂存的icon
                    'subTitle': '',
                    'linkurl': '',
                    'linkurl_name': ''
                })
            },
            textLength: {
                type: Number,
                default: 4
            },
            textRightLen: {
                type: [Number,String]
            },
            draggabled: {
                type: Boolean,
                default: true
            },
            tabName: {
                type: String,
                default: 'store,goods,liver,coupon,customLink,goodsClassify,wxapplink'
            },
            iconLabel: {
                type: String,
                default: '图标：'
            },
            linkLabel: {
                type: String,
                default: '链接：'
            }
        },
        data() {
            return {
                label: '',
                content: '',
                newTabName: ''
            }
        },
        mounted(){
            let paths = ['/decorate/custom']
            if(paths.includes(this.$route.path) ) {
               this.newTabName = this.tabName.replace(',customLink','')
            }
        },
        methods: {
            changeIcon(val) {
                this.$emit('change-icon', val)
            },
            changeLink(val) {
                this.$emit('change-link', val)
            },
            getInput(type, val) {
                if (this.onelabel) {
                    this.$emit('get-input', val.target.value)
                } else {
                    this.$emit('get-input', type, val.target.value)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .list-navigator {
        position: relative;
        overflow: hidden;
        padding: 10px 0;
        display: flex;
        align-items: center;

        .move-icon {
            margin-right: 10px;
            color: #b8b9bd;
            font-size: 24px;
        }
        .icon-box {
            width: 40px;
            height: 40px;
            border-radius: 2px;
            border: 1px solid #E9EDEF;
            display: inline-block;
        }

        .flex-item {
            flex: 1;
        }

        /deep/ .ivu-form-item {
            margin-bottom: 20px;
            .ivu-form-item-label {
                padding-right: 0;
            }
            input {
                box-sizing: border-box;
            }
        }

        /deep/.select-link .ivu-btn {
            width: 350px!important;
            border: 1px solid #dcdee2;
        }
        .link {
            /deep/ .select-link {
                margin-bottom: 0!important;
            }
        }

        .tip {
            position:absolute;
            bottom:0;
            left:70px;
            transform:translateY(100%);
            color:#939799;
            font-size:12px;
            line-height:24px;
            height:24px;
        }
        .custom-form-item {
            display: flex;
            flex-wrap: nowrap;
            margin-bottom: 10px;
            &.image {
                margin-bottom: 26px;
            }
            .label {
                width: 110px;
                text-align: right;
                padding: 8px 0 7px 0;
                color: #262B30;
                line-height: 20px;
                font-size: 14px;
            }
        }
    }
</style>
