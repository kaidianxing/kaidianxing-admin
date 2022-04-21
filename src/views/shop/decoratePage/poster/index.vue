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
    <div class="decorate-index" v-loading="{
            loading,
            title:spinTitle
        }">
        <!-- 左侧操作栏 -->
        <oper-panel v-if='!(currentModal.asPageInfo&&!currentModal.notemplate)'></oper-panel>
        <!-- 手机模拟以及拖拽组件 -->
        <div class="phone-area">
            <div class="scroll-body">
                <!-- 设置类组件，没有自己的模板 -->
                <diy-phone v-if='currentModal.asPageInfo&&!currentModal.notemplate' :key="1">
                    <template slot='fixed'>
                        <DragableResizeItemBox class="fixed-item" :item='currentModal'>
                            <component :is="getComponentName(currentModal)"  :component-data="currentModal"></component>
                        </DragableResizeItemBox>
                    </template>
                </diy-phone>
                <diy-phone :key='2' v-else>
                    <template slot='fixed'>
                        <DragableResizeItemBox class="fixed-item" :class='{currentModal:currentModal===item&&item.id!=="poster_bgimg"}' v-for="(item,index) in pageList" :key='item._comIndex_' :item='item' :index='index' :style='{zIndex:item.style.zIndex===undefined?(index+1):item.style.zIndex}'>
                            <component :is="getComponentName(item)" :component-data="item"></component>
                        </DragableResizeItemBox>
                    </template>
                </diy-phone>
               
            </div>
        </div>
        <!-- 右侧组件参数设置组件 -->
        <component-setter v-if="changeComponent"></component-setter>
        <!-- 顶部保存等操作按钮 -->
        <bottom-bar style="z-index:1000;" :backing="isAutoBack" @click="toSave" @clickTab="clickTab"></bottom-bar>
        <!-- 这里是copyright注入的地方 -->
        <slot></slot>
    </div>
</template>

<script>
    // 全部../components/templates下的模板组件
    import {
        posterComponents as components
    } from '../components/allTemplates.js'
    import PageInfo from '../components/controller/PageInfo'
    // 左侧操作栏
    import OperPanel from '../components/OperPanel'
    // 手机模拟以及拖拽组件
    import DiyPhone from '../components/DiyPhone'
    // 底部保存等操作按钮
    import BottomBar from './components/BottomBar'
    // 右侧组件参数设置组件
    import ComponentSetter from '../components/ComponentSetter'
    import {
        mapState,
        mapGetters,
        mapMutations,
        mapActions
    } from 'vuex'
    import {
        getPage,
        setPage
    } from './components/apis'
    const pageTypeId = {
        //自定义页面的类型
        index: 10, //首页
        'goods-detail': 11, //商品详情
        'vip-center': 12, //会员中心
        'distribution': 20, //分销页面
    }
    //关注点分离
    import * as indexLogic from './components/indexLogic.js'
    export default {
        data() {
            return {
                changeComponent: true,
                loading: false,
                key: 0,
                previewPage: false,
                tabId: '',
                advsItem: {},
                currentItem: {},
                spinTitle: '',
                isAutoBack: false,
                pageId:'',
                tplId:'',
                actType:''
            }
        },
        components: {
            ...components,
            OperPanel,
            DiyPhone,
            BottomBar,
            ComponentSetter,
            PageInfo,
            TmpSaveModal: () =>
                import ('../components/TmpSaveModal'),
            //拖拽排序组件容器
            DragItemBox: () =>
                import ('../components/templatesItemBox/DragItemBox'),
            //固定位置浮动元素容器
            FloatItemBox: () =>
                import ('../components/templatesItemBox/FloatItemBox'),
            //拖拽定位以及resize元素容器
            DragableResizeItemBox: () =>
                import ('../components/templatesItemBox/DragableResizeItemBox.vue'),
        },
        watch: {
            '$route': {
                deep: true,
                handler() {
                    if (this.$route.path.indexOf('/decorate/') == 0) {
                        window.location.reload()
                    }
                }
            },
        },
        computed: {
            ...mapGetters('decorate', ['getModal', 'getAllModalName']),
            ...mapState('decorate', {
                pageInfo: state => state.pageInfo,
                pageList: state => state.pageList,
                currentModal: state => state.currentModal,
                sortAbleList: state => state.sortAbleList,
                topItem: state => state.topItem,
                bottomItem: state => state.bottomItem,
                fixedItem: state => state.fixedItem,
                html2canvasing: state => state.html2canvasing,
                asPageInfo: state => state.asPageInfo,
            }),
            getSortableList() {
                if (this.html2canvasing > 0) {
                    return this.sortAbleList.slice(0, this.html2canvasing)
                }
                return this.sortAbleList
            },
        },
        updated() {
            this.changeComponent = true
        },
        methods: {
            ...mapMutations('decorate', [
                'changeFocus',
                'clear',
                'setPageList',
                'setPageInfo',
                'refreshCurrentModal',
                'refreshPageInfo',
                'setHtml2canvasing'
            ]),
            ...mapActions('decorate', [
                'createPoster',
                'checkForm',
            ]),
            filterAdvs(list) {
                return list.filter(item => item.id !== 'advs')
            },
            beforeChange() {
                this.changeComponent = false
            },
            getPoster() {
                //html2canvas截图
                this.clickTmp() //截图前先取消全部聚焦效果，避免截图蓝框
                return new Promise((resolve, reject) => {
                    this.$nextTick(() => {
                        this.createPoster(this.pageId)
                            .then(res => {
                                resolve(res)
                            })
                            .catch(error => {
                                reject(error)
                            })
                    })
                })
            },
            //截图前，组件失去焦点，避免截图截取蓝色边框
            clickTmp(item) {
                indexLogic.clickTmp(this.pageId, item)
            },
            getComponentName(item) {
                return 'Tpl' + item.id ?.replace(/^./, e => e.toUpperCase())
            },
            async toSave(type, action) {
                try {
                    if (type == 'pageSet') {
                        this.clickTmp()
                        return
                    }
                    this.spinTitle = '正在校验数据格式...'
                    this.loading = true
                    await this.checkForm(this.$route) //校验表单
                    this.$nextTick(() => {
                        //保存页面
                        this.loading = true
                        this.spinTitle = '正在生成预览图...'
                        this.getPoster().then(img => {
                                this.spinTitle = '数据正在保存中...'
                                setPage.call(this, action, img)
                                    .then(res => {
                                        if (res.error == 0) {
                                            let message = type === 'publish' ? '发布成功' : '保存成功'
                                            this.$Message.success(message)
                                            if (type == 'asPage') {
                                                //保存并跳转
                                                setTimeout(() => {
                                                    this.replacePath()
                                                }, 1000)
                                            } else {
                                                //保存并预览
                                                this.previewPage = true
                                            }
                                        }
                                    }).finally(() => {
                                        console.log(' finally close')
                                        this.loading = false
                                    })
                            })
                            .catch((error) => {
                                console.log(error,'error')
                                this.loading = false
                                this.$Message.error('生成缩略图失败')
                            })
                    })
                } catch (err) {
                    console.log(err, 'err')
                    this.loading = false
                    if (err.message) {
                        this.$Message.error(err.message)
                    }
                }
            },
            replacePath() {
                //请求成功后重定向
                window.onbeforeunload = null
                this.isAutoBack = true
                if (pageTypeId[this.pageId]) {
                    //四个页面模板
                    this.$router.replace({
                        path: '/shop/list/system'
                    })
                } else if (this.pageId == 'diymenu') {
                    //自定义菜单
                    this.$router.replace({
                        path: '/shop/custom-menu'
                    })
                } else {
                    this.$router.go(-1)
                }
            },
            clickTab() {
                this.clickTmp()
            },
        },
        beforeRouteLeave(to, from, next) {
            if (process.env.VUE_APP_env !=="developement") {
                if (!this.isAutoBack) {
                    this.$Modal.confirm({
                        title: '确定离开',
                        content: "系统可能不会保存您所做的更改",
                        onOk: () => {
                            next()
                        },
                        // 增加返回取消操作
                        onCancel:()=> {
                            this.isAutoBack = false
                            next(false)
                        }
                    })
                } else {
                    next()
                }
            } else {
                next()
            }
        },
        mounted() {
            if (process.env.VUE_APP_env !== 'developement') {
                window.onbeforeunload = () => {
                    return "系统可能不会保存您所做的更改";
                }
            }
            this.pageId=this.$route.params.page
            this.tplId=this.$route.query.id
            this.actType=this.$route.query.type
            getPage.call(this, {
                pageId:this.pageId, //页面类型index：商城首页，goods-dettail：商品详情,vip-center：会员中心
                type: this.actType, //操作类型edit：编辑 ；add:添加
                tplId: this.tplId, //模板id
            }) //查询对应页面的数据
        },
        beforeDestroy() {
            this.loading = false
            this.clear()
        },
        destroyed() {
            window.onbeforeunload = null
            //防止页面后退  使用在vue时 挂载到mounted中
        }
    }
</script>

<style lang="scss" scoped>
    .decorate-index {
        width: 100%;
        min-width: 1300px;
        box-sizing: border-box;
        padding-left: 306px;
        padding-right: 540px;
        display: flex;
        position: relative;
        background: #f4f6f8;
        justify-content: center;
        overflow: auto;
        height: 100%;
        .phone-area {
            position: relative;
            z-index: 100;
            height: 100%;
            min-width: 496px;
            flex: 1;
            overflow: visible;
            box-sizing: border-box;
            margin-right: -10px;
            margin-left: -10px;
            &::-webkit-scrollbar {
                width: 0;
            }
        }
        /deep/ .phone-main {
            z-index: 10000;
        }
        .scroll-body {
            height: fit-content;
            width: 375px;
            flex-shrink: 0;
            margin: 40px auto 20px;
            border-radius: 2px;
            box-shadow: 0px 4px 14px rgba(133, 148, 162, 0.2);
        }
        /deep/ .ivu-card:hover {
            box-shadow: none;
        }
    }
    .diy-toolbar {
        width: 132px;
        height: 48px;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 6px;
        position: absolute;
        left: 0;
        top: -59px;
        padding: 0 10px;
    }
    .diy-toolbar .item {
        width: 56px;
        height: 100%;
        text-align: center;
        color: #fff;
        font-size: 12px;
        float: left;
        cursor: pointer;
    }
    .diy-toolbar .item p {
        width: 100%;
    }
    .diy-toolbar .item p.icow {
        margin-top: 7px;
        margin-bottom: 6px;
    }
    .diy-toolbar .item p.txt {
        line-height: 1;
    }
    .slide-fade-enter-active {
        transition: all 0.3s ease;
    }
    .slide-fade-leave-active {
        transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
    }
    .slide-fade-enter,
    .slide-fade-leave-to {
        transform: translateX(540px);
        opacity: 0;
    }
    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    .demo-spin-col {
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
    .ivu-spin {
        position: fixed;
        background-color: #fff;
        color: $brand-color;
        z-index: 9999;
    }
    /deep/ .ivu-modal-wrap,
    /deep/ .ivu-modal-mask {
        z-index: 10001 !important;
    }
    .phone-bg {
        width: 375px;
        position: relative;
        margin: 20px 50px;
        img {
            display: block;
            width: 100%;
        }
        .iframe {
            width: 325px;
            height: 749px;
            position: absolute;
            padding-top: 35px;
            left: 0;
            right: 0;
            margin: auto;
            top: 10px;
            bottom: 10px;
            border-radius: 45px 45px 32px 32px;
            overflow: hidden;
        }
    }
    .currentModal{
        z-index: 9999!important;
    }
</style>
