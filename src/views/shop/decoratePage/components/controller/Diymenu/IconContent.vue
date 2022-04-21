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
    <div class='icon-content'>
        <!-- 图片模式 -->
        <form-item  v-if='currentModal.icon_type=="1"'>
            <MyDragSortableItems :delabled="currentModal.items.length>2" :list='currentModal.items' @end='dragEnd' @delItem='delItem(currentModal.items,$event)'>
                <template v-slot='{item}'> 
                    <div>
                        <div class='custom-form-item icon-selector' style='margin:10px 0 10px ;'>
                            <p class="label" style='width:90px;padding-right:10px;'>按钮图片：</p>
                            <div class="check">
                                <MyAddImgImg v-model='item.icon_url' size='mini' type='image' @change='changeIcon(item,1,$event)'></MyAddImgImg>
                                <span class="check-text">未选中</span>
                                </div>
                            <div class="check">
                                <MyAddImgImg v-model='item.icon_url_1_on' size='mini' type='image' @change='changeIcon1(item,"1_on",$event)'></MyAddImgImg>
                                <span class="check-text">选中</span>
                            </div>
                        </div>
                        <div class='custom-form-item icon-selector' style='margin:0 0 0 ;'>
                            <p class="label" style='width:90px;padding-right:10px;'>点击链接：</p>
                            <MySelectLink :value='{
                                 url: item.target_url,
                                name: item.target_url_name,
                                wxappid: item.wxappid
                            }' style='flex:1;margin-right:10px;' @change='changeLink(item,$event)' type='icon'></MySelectLink>
                        </div>
                    </div>
                </template>
            </MyDragSortableItems>
            <i-button class='brand-color' style='width:100%;background:rgba(0,0,0,0)' @click='addItem' v-if='currentModal.items.length<5'>+添加({{currentModal.items.length}}/5)</i-button>
        </form-item>
        <!-- 图标+文字 -->
        <form-item  v-else>
            <MyDragSortableItems :delabled="currentModal.items.length>2" :list='currentModal.items' @end='dragEnd' @delItem='delItem(currentModal.items,$event)'>
                <template v-slot='{item}'>
                    <div class='menu'>
                        <div class='custom-form-item icon-selector' style='margin:10px 0 10px ;'>
                            <p class="label" style='width:90px;padding-right:10px;'>图标：</p>
                            <MyAddImgImg v-model='item.icon_url' size='mini' type='icon' @change='changeIcon(item,0,$event)'></MyAddImgImg>
                        </div>
                        <div class='custom-form-item icon-selector' style='margin:0 0 7px ;'>
                            <p class="label" style='width:90px;padding-right:10px;'>按钮文字：</p>
                            <Input v-model='item.text' style='width:258px;'></Input>
                        </div>
                        <div class='custom-form-item icon-selector' style='margin:0 0 0 ;'>
                            <p class="label" style='width:90px;padding-right:10px;'>点击链接：</p>
                            <MySelectLink :value='{
                                url: item.target_url,
                                name: item.target_url_name,
                                wxappid: item.wxappid
                            }' style='flex:1;margin-right:10px;' @change='changeLink(item,$event)' type='icon'></MySelectLink>
                        </div>
                    </div>
                    <div class='hint'>
                        <kdx-hint-alert type='info' :showIcon='false' v-if='item.child&&item.child.length'>添加二级菜单后一级菜单链接将失效</kdx-hint-alert>
                    </div>
                    <div class='sub-menu' v-if='item.child&&item.child.length'>
                        <MyDragSortableItems :list='item.child' @end='dragChildEnd(item,$event)' @delItem='delItem(item.child,$event)'>
                            <template v-slot='{item}'>
                                <div class='sub-menu-tpl' style='background:#fff;'>
                                    <i class="iconfont icon-move shrink_icon"></i>
                                    <div class='custom-form-item icon-selector' style='margin:10px 0 10px ;'>
                                        <p class="label" style='width:130px;padding-right:10px;'>按钮文字：</p>
                                        <Input v-model='item.text' style='width:196px;'></Input>
                                    </div>
                                    <div class='custom-form-item icon-selector' style='margin:0 0 0 ;'>
                                        <p class="label" style='width:130px;padding-right:10px;'>点击链接：</p>
                                        <MySelectLink :value='{
                                             url: item.target_url,
                                             name: item.target_url_name,
                                            wxappid: item.wxappid
                                        }' style='flex:1;margin-right:10px;' tabName="store,customLink" @change='changeLink(item,$event)' type='icon'></MySelectLink>
                                    </div>
                                </div>
                            </template>
                        </MyDragSortableItems>
                    </div> 
                    <i-button style='width:100%;background:#fff;color:#262B30' @click='addChildItem(item)'>+添加二级菜单</i-button>
                </template>
            </MyDragSortableItems>
            <i-button class='brand-color' style='width:100%;background:rgba(0,0,0,0)' @click='addItem' v-if='currentModal.items.length<5'>+添加一级菜单</i-button>
        </form-item>
    </div>
</template>

<script>
    import mixin from '../mixin.js'
    export default {
        mixins: [mixin],
        methods: {
            changeIcon(item, type, val) {
                item['icon_url_' + type] = val
            },
            changeLink(item, val) {
                item.target_url = val.url;
                item.target_url_name = val.name
                item.wxappid = val.wxappid
                if (val.url == '/kdxCart/index') {
                    item.badge = 4
                } else {
                    item.badge = ''
                }
                this.refreshCurrentModal();
            },
            dragEnd(list) {
                this.currentModal.items = list;
                this.refreshCurrentModal();
            },
            delItem(list, item) {
                for (let k in list) {
                    if (list[k] === item) {
                        list.splice(k, 1);
                        break;
                    }
                }
                this.refreshCurrentModal();
            },
            dragChildEnd(item, list) {
                item.child = list;
            },
            addChildItem(item) {
                item.child.push({
                    icon_url: null,
                    level: "2",
                    pid: "1",
                    target_url: "",
                    text: " 二级菜单"
                })
            },
            addItem() {
                this.currentModal.items.push({
                    icon_url: '',
                    target_url: '',
                    iconclass: 'iconfont-m- icon-m-iconfontshop',
                    text: '商城首页',
                    active: true,
                    showsubmenu: false,
                    badge: 0,
                    child: []
                })
                
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../common.scss';
    .menu {
        padding-bottom: 10px;
        margin-bottom: 20px;
        border-bottom: 1px solid #E9EDEF;
    }
    .hint {
        margin-bottom: 10px;
    }
    .sub-menu {
        /deep/ .drag-sort-item {
            background: #fff;
        }
        .sub-menu-tpl {
            position: relative;
            display: flex;
            flex-direction: column;
            .icon-move {
                position: absolute;
                font-size: 24px;
                width: 24px;
                height: 24px;
                line-height: 24px;
                top: 0;
                bottom: 0;
                left: 7px;
                color: #B8B9BD;
                margin: auto;
            }
        }
    }
    .icon-content {
        /deep/   .ivu-form-item-content {
            margin-left: 0!important;
        }
    }

    .check {
        margin-right: 20px;
        text-align: center;

        &-text {
            margin-bottom: 6px;
        }
    }
    
</style>