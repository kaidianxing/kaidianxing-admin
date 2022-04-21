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
    <div class='topmenu' v-if='currentModal.id=="topmenu"&&lazyLoad'>
        <i-form ref="topmenu" :label-width="110" :model="currentModal" :rules="validator">
             <MyCollapse>
                <p
                    class="form-title"
                    slot='label'
                >
                    顶部菜单设置
                </p>
                <div class="tab-title">
                    <form-item
                        label=""
                        :label-width='0'
                    >
                        <MyDragSortableCell
                            :list='currentModal.data'
                            :noDragList="[0]"
                            :noDelList="[0]"
                            :delabled="false"
                            :current="currentModal.params.current"
                            @end='dragEnd'
                            @delItem="delItem"
                            @on-current="changeCurrent"
                        >
                            <template v-slot='{item,index}'>
                                <div class='menu-selector'>
                                    <div class="menu-label">
                                        <span class="tab-title-label label">菜单标题：</span>
                                         <Input
                                            placeholder="请输入标题"
                                            show-word-limit
                                            :maxlength="10"
                                            v-model='item.title'
                                            style="width: 100%"
                                        />
                                    </div>
                                    <div class="menu-url">
                                        <span class="tab-url-label label">选择页面：</span>
                                        <MySelectLink :value='{
                                                name: item.linkurl_name,
                                                url: item.linkurl
                                            }'
                                            :enabled="index != 0"
                                            style="width:336px;"
                                            @change='changeLink(item,$event)'
                                            >
                                        </MySelectLink>
                                    </div>
                                </div>
                                
                            </template>
                        </MyDragSortableCell>
                        <i-button
                            class="add-btn"
                            @click='addItem'
                            v-if="currentModal.data && currentModal.data.length<20   "
                        >+添加选项（{{currentModal.data && currentModal.data.length}}/20）</i-button>
                    </form-item>
                </div>
            </MyCollapse>
   
            <MyCollapse no-border>
                <p
                    class="form-title"
                    slot='label'
                >
                    顶部菜单样式
                </p>

                <div>
                    <form-item label="背景颜色：">
                        <MyColorPicker
                            v-model='currentModal.style.background'
                            default='#ffffff'
                        ></MyColorPicker>
                    </form-item>
                    <form-item label="激活背景：">
                        <MyColorPicker
                            v-model='currentModal.style.activebgcolor'
                            default='#ffffff'
                        ></MyColorPicker>
                    </form-item>
                    <form-item label="文字颜色：">
                        <MyColorPicker
                            v-model='currentModal.style.textcolor'
                            default='#212121'
                        ></MyColorPicker>
                    </form-item>
                    <form-item label="激活文字：">
                        <MyColorPicker
                            v-model='currentModal.style.activecolor'
                            default='#ff3c29'
                        ></MyColorPicker>
                    </form-item>
                </div>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        provide: ()=>{
            return {
                chooseTab: ''
            }
        },
        name: 'topmenu',
        data() {
            return {
                id:'topmenu',
                radiusStyle: [{
                        id: '0',
                        label: '直角'
                    }, {
                        id: '1',
                        label: '圆角'
                    }],
            }
        },
        computed: {
            getCurrent(){
                if(!this.currentModal?.data || !this.currentModal.data[this.currentModal.params.current]) {
                    return {
                        title: '选项',
                        linkurl: '',
                        linkurl_name: ''
                    }
                }
               return this.currentModal.data[this.currentModal.params.current]
            },
        },
        methods: {
            changeCurrent(index) {
                this.currentModal.params.current = index  
            },
            changeLink(item, val) {
                item.linkurl = val.url;
                item.linkurl_name = val.name;
            },
            dragEnd(e) {
                this.currentModal.data = e;
                this.refreshCurrentModal();
            },
            delItem(item) {
                for (let i = 0; i < this.currentModal.data.length; i++) {
                if (item === this.currentModal.data[i]) {
                    let current = this.currentModal.params.current
                     if((current> 0 && current< this.currentModal.data.length -1 && i<= current)) {
                      this.changeCurrent(current -1 )
                     } else if(current == this.currentModal.data.length -1) {
                         this.changeCurrent(current - 1)
                     }

                    this.currentModal.data.splice(i, 1);
                    break;
                }
            }
            this.refreshCurrentModal();
            },
            addItem() {
                this.currentModal.data.push({
                    title: '选项'+ (this.currentModal.data.length + 1),
                    linkurl: '',
                    linkurl_name: ''
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';

    .add-btn {
        width:100%;
        color:$brand-color;
        margin-top: -1px;
        position: relative;
        height: 52px;
        &:hover {
            z-index: 100;
        }
    }
    .drag-sortable-items{
        position: relative;
    }
    .menu-selector{
        .menu-label,.menu-url{
            display: flex;
            .label{
                flex-shrink: 0;
                padding-right: 5px;
            }
        }
        .menu-label{
            margin: 20px 0 10px;
        }
        .menu-url{
            margin-bottom: 10px;
        }
    }
</style>