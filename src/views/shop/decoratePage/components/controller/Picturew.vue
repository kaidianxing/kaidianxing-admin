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
    <div class='picturew' v-if='currentModal.id=="picturew"&&lazyLoad'>
        <i-form :label-width="100" ref='picturew' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    轮播点设置
                </p>
                <div>
                    <form-item label="上下间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.paddingtop'></MyDraggableProgress>
                    </form-item>
                    <form-item label="左右间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.paddingleft'></MyDraggableProgress>
                    </form-item>
                    <form-item label="背景颜色：">
                        <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                    </form-item>
                    <form-item label="布局方式：">
                        <MyRadioGroup :items='row' v-model='currentModal.params.row'></MyRadioGroup>
                        <p class="tip" v-if='currentModal.params.row!=1'>图片大小不限制，但请确保所有图片的尺寸/比例相同。</p>
                        <p class="tip" v-else>橱窗样式布局请参考<a>首页魔方</a>，单组最多显示四个，超出隐藏</p>
                    </form-item>
                    <div v-if='currentModal.params.row!=1'>
                        <form-item label="显示类型：">
                            <MyRadioGroup :items='showtype' v-model='currentModal.params.showtype'></MyRadioGroup>
                        </form-item>
                        <form-item label="每页数量：">
                            <MyDraggableProgress :min='2' :max='12' unit='个' v-model='currentModal.style.paddingleft'></MyDraggableProgress>
                        </form-item>
                        <form-item label="显示分页：">
                            <MyRadioGroup :items='show' v-model='currentModal.style.showdot'></MyRadioGroup>
                        </form-item>
                        <form-item label="分页按钮：">
                            <MyRadioGroup :items='show' v-model='currentModal.style.showbtn'></MyRadioGroup>
                        </form-item>
                    </div>
                </div>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <form-item :label-width="0">
                    <MyAddImg style='margin-bottom:10px;' link="linkurl" :items='getImgs' @change='changeLink' @select-link='selectLink' @del='delItem'></MyAddImg>
                    <i-button style='width:100%;' class='brand-color' @click='addItem'>+添加</i-button>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'picturew',
        data() {
            return {
                id:'picturew',
                row: [{
                    label: '堆积两列',
                    id: '2'
                }, {
                    label: '橱窗样式',
                    id: '1'
                }, {
                    label: '堆积三列',
                    id: '3'
                }, {
                    label: '堆积四列',
                    id: '4'
                }],
                showtype: [{
                    label: '普通模式',
                    id: '0'
                }, {
                    label: '多页滑动模式',
                    id: '1'
                }],
                show: [{
                    label: '隐藏',
                    id: '0'
                }, {
                    label: '显示',
                    id: '1'
                }]
            }
        },
        computed: {
            getImgs() {
                return this.currentModal.data.map(item => {
                    return {
                        url: item.imgurl,
                        link: item.linkurl,
                        name: item.linkurl_name
                    }
                })
            }
        },
        methods: {
            delItem(index) {
                this.currentModal.data.splice(index, 1)
                this.refreshCurrentModal();
            },
            addItem() {
                this.currentModal.data.push({
                    imgurl: '',
                    linkurl: '',
                })
                this.$nextTick(() => {
                    this.$parent.$el.lastChild.scrollTop =this.$parent.$el.lastChild.scrollHeight 
                })
            },
            changeLink(index, val) {
                this.currentModal.data[index].linkurl = val.url
                this.currentModal.data[index].linkurl_name =  val.name
            },
            selectLink(index) {
                console.log('selectLink', index)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    /deep/ .body {
        width: 100%;
        .select-link {
            width: 100%;
            .input.ivu-input-wrapper {
                width: 100%;
            }
        }
    }
</style>