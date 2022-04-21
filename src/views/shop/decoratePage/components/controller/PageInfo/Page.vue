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
    <div class='pageInfo'>
        <i-form ref="pageInfo" :label-width="110" :model="currentModal" :rules="validator">
            <form-item label="列表标题：" prop="name" required style='border-bottom:1px solid #e9edef;padding-bottom:30px;margin-bottom:20px;'>
                <Input v-model="currentModal.name"></Input>
            </form-item>
            <MyCollapse>
                <p class="form-title" slot="label">内容样式</p>
                <form-item label="页面背景：">
                    <MyColorPicker v-model="currentModal.background_color" default="#f5f5f5"></MyColorPicker>
                </form-item>
                <form-item label="底部菜单：" v-if="pageId=='custom'">
                    <MyRadioGroup :items='showtypes' v-model='currentModal.params.showmenu' ></MyRadioGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse :no-border='pageId!="custom"'>
                <p class="form-title" slot="label">顶部样式</p>
                <form-item label="导航标题：" :prop="pageId === 'goods-detail' ? '' : 'title'">
                    <Input v-model="currentModal.title"></Input>
                    <kdx-hint-text v-if="pageId === 'goods-detail'">如不填写则默认展示商品名称</kdx-hint-text>
                </form-item>
               <form-item label="顶部背景：">
                   <MyColorPicker v-model="currentModal.params.navbgcolor" default="#ffffff"></MyColorPicker>
               </form-item>
               <!-- <form-item label="导航标题颜色：">
                   <MyColorPicker v-model="currentModal.params.titlecolor" default="#212121"></MyColorPicker>
               </form-item> -->
               <form-item label="功能按钮：">
                   <MyRadioGroup :items='funbtncolor' v-model='currentModal.params.funbtncolor' ></MyRadioGroup>
               </form-item>
            </MyCollapse>
            <MyCollapse v-if="pageId=='custom'">
                <p class="form-title" slot="label">分享内容</p>
                <form-item label="分享图片：">
                    <MyAddImgImg :value='currentModal.params.shareimg' @change='changeImg'></MyAddImgImg>
                </form-item>
                <form-item label="页面分享描述：">
                    <Input type="textarea"  v-model="currentModal.params.sharetext" :rows="2"/>
                    <kdx-hint-text>不单独设置页面分享图片、描述时使用商城分享设置的分享描述</kdx-hint-text>
                </form-item>
            </MyCollapse>
            <MyCollapse no-border v-if='pageId=="custom"'>
                <p class="form-title" slot="label">浏览权限</p>
                <form-item label="会员等级：" prop='limitlevel'>
                    <MyRadioGroup class='browse-level' :items='limitlevel' v-model='currentModal.params.limitlevel' >
                        <BrowseLevel v-if='currentModal.params.limitlevel'></BrowseLevel>
                    </MyRadioGroup>
                </form-item>
                 <form-item label="会员标签组：" prop='limitlabel'>
                    <MyRadioGroup class='browse-label' :items='limitlabel' v-model='currentModal.params.limitlabel' >
                        <BrowseLabel v-if='currentModal.params.limitlabel'></BrowseLabel>
                    </MyRadioGroup>
                </form-item>
            </MyCollapse>
        </i-form>

        <menu-selector ref="menu_selector" :current="{id:currentModal.menu_id}" @on-change="changeMenu"></menu-selector>
    </div>
</template>

<script>
    import mixin from '../mixin.js'
    import MenuSelector from '@/components/selector/MenuSelector'
    import BrowseLevel from './VipBrowseLevel.vue'
    import BrowseLabel from './VipBrowseLabel.vue'
    import initPageDecoratePerm from '@/store/decorate/templatePerms'
    import {
        mapMutations,
        mapState
    } from 'vuex'
    export default {
        mixins: [mixin],
        name: 'poster_img',
        components: {
            MenuSelector,
            BrowseLevel,
            BrowseLabel
        },
        computed: {
            ...mapState('decorate', {
                pageList: state => state.pageList,
                pageInfo: state => state.pageInfo,
            }),
            pageId() {
                let pageId = this.$route.params.page
                return pageId
            }
        },
        data() {
            return {
                limitlevel:[{
                    label: '不限制会员等级',
                    id: ''
                },
                {
                    label: '指定会员等级可见',
                    id: '1'
                }],
                limitlabel:[{
                    label: '不限制标签组',
                    id: ''
                },
                {
                    label: '指定标签组可见',
                    id: '1'
                }],
                funbtncolor: [{
                        label: '黑色',
                        id: 'black'
                    },
                    {
                        label: '白色',
                        id: 'white'
                    }
                ],
                navbgtype: [{
                        label: '颜色',
                        id: 'color'
                    },
                    {
                        label: '图片',
                        id: 'img'
                    }
                ],
                isopen: [{
                        label: '默认系统应用中',
                        id: '1'
                    },
                    {
                        label: '单独设置',
                        id: '0'
                    }
                ],
                showtypes: [{id: '0',label:'显示'},{id:'1',label:'不显示'}],
                pageIds: ['index', 'vip-center']
            }
        },
        created(){
            // 初始化装修组件权限
            initPageDecoratePerm(this.pageId)
        },
        methods: {
            ...mapMutations('decorate', [
                'setPageList',
                'refreshCurrentModal',
                'clear',
                'setPageInfo'
            ]),
            selectMenu() {
                this.$refs['menu_selector'].setValue()
            },
            changeBgImg(val) {
                this.currentModal.params.navbgimg = val
            },
            cancel() {},
            changeMenu({
                name,
                id
            }) {
                this.currentModal.menu_name = name
                this.currentModal.menu_id = id
                this.getMenuContent(id)
            },
            menuChange(e) {
                if (e == '1') {
                    this.getMenuContent('', true)
                } else {
                    this.currentModal.menu_id = ''
                    this.currentModal.menu_name = ''
                    this.getMenuContent(this.currentModal.menu_id)
                }
            },
            getMenuContent(id, isSystem) {
                if (id || isSystem) {
                    let params = {}
                    id && (params.id = id);
                    this.$api.decorateApi.getNewMenuContent(params).then(res => {
                        if (res.error == 0) {
                            if (res.content && JSON.parse(res.content).id) {
                                this.setPageInfo({
                                    pageId: this.pageId,
                                    item: {
                                        menu_id: res.id
                                    }
                                })
                                this.pageList.forEach(v => {
                                    if (v.type == 'diymenu') {
                                        Object.assign(v, JSON.parse(res.content))
                                    }
                                })
                            }
                        }
                    })
                } else {
                    this.pageList.forEach(v => {
                        if (v.type == 'diymenu') {
                            v.id = ''
                        }
                    })
                }
            },
            changeImg(e){
                this.currentModal.params.shareimg = e
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../common.scss';
    .footer {
        display: flex;
        justify-content: center;
    }
    /deep/ .browse-level{
        .content{
            padding:0;
            background:#fff;
        }
    }
    /deep/ .browse-label{
        .content{
            padding:0;
            background:#fff;
        }
    }
    .menu-setting {
        /deep/ .ivu-input-group-prepend {
            background-color: #fff;
        }
        /deep/ .ivu-input {
            cursor: pointer;
            border-left: 0;
            &:focus,
            &:hover {
                border: 1px solid #e9edef;
                border-left: 0;
            }
        }
        /deep/ .ivu-input-group-append {
            cursor: pointer;
            padding: 0;
            background-color: #fff;
            color: $brand-color;
        }
    }
</style>
