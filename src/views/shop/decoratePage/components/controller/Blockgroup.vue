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
    <div class='blockgroup' v-if='currentModal.id=="blockgroup"&&lazyLoad'>
        <i-form :label-width="100" ref='blockgroup' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <form-item label="排列方式：">
                    <MyRadioGroup :items='sorttype' v-model='currentModal.params.sorttype' @change='changeType'></MyRadioGroup>
                </form-item>
                <form-item label="每行数量：">
                    <MyRadioGroup :items='colCount' v-model='currentModal.params.rownum'></MyRadioGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="背景颜色：">
                    <MyColorPicker v-model='currentModal.style.background'></MyColorPicker>
                </form-item>
                <form-item label="数量颜色：">
                    <MyColorPicker v-model='currentModal.style.tipcolor'></MyColorPicker>
                </form-item>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <form-item :label-width="0">
                    <MyDragSortableItems :list='currentModal.data' @end='dragEnd' @delItem='delItem'>
                        <template v-slot='{item}'> 
                            <MyTopMenuItem label1='文字：' placeholder="请输入文字" label2='跳转链接：' :item='item' @change-link='changeLink(item,$event)' @on-change='getInput(item,$event)'>
                                <template #prepend>
                                    <div class='custom-form-item icon-selector' style='margin:0 0 10px ;'>
                                        <p class="label" style='width:120px'>图标：</p>
                                        <MyAddImgImg v-model='item.iconclass' type='icon'></MyAddImgImg>
                                    </div>
                                    <div class='custom-form-item icon-selector' style='margin:0 0 10px ;'>
                                        <p class="label" style='width:120px'>图标颜色：</p>
                                        <MyColorPicker v-model='item.iconcolor'></MyColorPicker>
                                    </div>
                                </template>
                                <template #insert>
                                    <div class='custom-form-item icon-selector' style='margin:0 0 10px ;'>
                                        <p class="label" style='width:110px'>文字颜色：</p>
                                        <MyColorPicker v-model='item.textcolor'></MyColorPicker>
                                    </div>
                                </template>
                            </MyTopMenuItem>
                        </template>
                    </MyDragSortableItems>
                <i-button style='width:100%;' :style="{color:$css['--theme-color']}" @click='addItem'>+添加</i-button>
            </form-item>
            </MyCollapse>
           
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'blockgroup',
        data() {
            return {
                id:'blockgroup',
                sorttype: [{
                    label: '竖排',
                    id: 'col'
                }, {
                    label: '横排',
                    id: 'row'
                }],
            }
        },
        computed: {
            colCount() {
                if (this.currentModal.params.sorttype == 'col') {
                    return [{
                        label: '2个',
                        id: 2
                    }, {
                        label: '3个',
                        id: 3
                    }]
                } else {
                    return [{
                        label: '2个',
                        id: 2
                    }]
                }
            }
        },
        methods: {
            changeType() {
                if (this.currentModal.params.sorttype == 'row') {
                    this.currentModal.params.rownum = 2
                }
            },
            delItem(item) {
                for (let k in this.currentModal.data) {
                    if (this.currentModal.data[k] === item) {
                        this.currentModal.data.splice(k, 1);
                        break;
                    }
                }
                this.refreshCurrentModal();
            },
            addItem() {
                this.currentModal.data.push({
                    iconclass: 'iconfont-m- icon-m-yongjin',
                    iconcolor: '#FFDD44',
                    text: '分销佣金',
                    textcolor: '#212121',
                    linkurl: '',
                    linkurl_name: '',
                    tipnum: '0.00',
                    tiptext: '元'
                });
                this.refreshCurrentModal();
                this.$nextTick(() => {
                    this.$parent.$el.lastChild.scrollTop =this.$parent.$el.lastChild.scrollHeight 
                })
            },
            dragEnd(list) {
                this.currentModal.data = list;
                this.refreshCurrentModal();
            },
            changeLink(item, val) {
                item.linkurl = val.url;
                item.linkurl_name = val.name
            },
            getInput(item, val) {
                item.text = val;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    /deep/ .select-link {
        width: 100%;
    }
    .icon-selector {
        /deep/ .label {
            padding-right: 10px;
        }
    }
</style>