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
        <oper-panel v-if="tabId != 1001"></oper-panel>
        <!-- 手机模拟以及拖拽组件 -->
        <div class="phone-area">
            <div class="scroll-body">
                <diy-phone :bgImg="pageId=='diymenu'?menuBg:''">
                    <!-- 组件容器，包括拖拽排序与删除等功能 -->
                    <template #top>
                        <!-- 置顶元素 -->
                        <drag-item-box class='lazy-load-box' :key="index" :item="item" :class="item?item.id:''" v-for="(item,index) in topItem">
                            <component :is="getComponentName(item)" :component-data="item"></component>
                        </drag-item-box>
                    </template>
                    <drag-item-box class='lazy-load-box' :lazy-update='showElesPort[index+topItem.length]||false' v-for="(item,index) in getSortableList" :key="item._comIndex_||index" :item="item" :class="`${item?item.id:''}`" @beforeChange='beforeChange'>
                        <!-- 可拖拽排序元素，动态组件 -->
                        <keep-alive>
                            <component :id='item._comIndex_||index' :is="getComponentName(item)" :component-data="item" :start-load-img='showElesPort[index+topItem.length]||false' v-show='true||filteComponent[item._comIndex_]!==false'></component>
                        </keep-alive>
                    </drag-item-box>
                    <template v-if="getBottomItem.length" #bottom>
                        <!-- 置底元素 -->
                        <drag-item-box :item="item" v-for="(item,index) in getBottomItem(bottomItem)" :key="item._comIndex_||index" :class="item?item.id:''">
                            <component :is="getComponentName(item)" :component-data="item"></component>
                        </drag-item-box>
                    </template>
                    <template v-if="fixedItem.length" #fixed>
                        <!-- 浮动元素 -->
                        <float-item-box :item="item" v-for="(item,index) in filterAdvs(fixedItem)" :key="item._comIndex_||index" class="fixed-item" :class="item?item.id:''">
                            <component :is="getComponentName(item)" :component-data="item"></component>
                        </float-item-box>
                    </template>
                </diy-phone>
            </div>
            <!-- 缩略图，过滤器等功能组件  -->
            <!-- <OthersPanel></OthersPanel>-->
            <!--快捷设置按钮-->
            <quick-actions v-if="tabId !== 1001 && !onlyOne"></quick-actions>
        </div>
        <!-- 右侧组件参数设置组件 -->
        <component-setter ref='componentSetter'></component-setter>
        <!-- 顶部保存等操作按钮 -->
        <bottom-bar style="z-index:1000;" @click="toSave" @clickTab="clickTab" :loading='loading' :backing="isAutoBack"></bottom-bar>
        <!-- 保存预览 -->
        <Drawer class="modal-drawer" width="500" :closable="false" v-model="previewPage" @on-visible-change="closePreview">
            <Card class="modal-title">
                <p slot="title" class="title">
                    <span>页面预览</span>
                </p>
            <div class="phone-bg">
                <img src="@/assets/image/decorate/phone-bg.png" alt/>
                <div class="iframe">
                    <iframe :src="previewUrl" frameborder="0" width="326" height="714" :key="previewUrl" v-if="previewPage" id="iframe"></iframe>
                </div>
            </div>
            </Card>

        </Drawer>
        <!-- 保存模板弹窗 -->
        <TmpSaveModal ref='tmpSaveModal'></TmpSaveModal>
        <!-- 这里是copyright注入的地方 -->
        <slot></slot>
    </div>
</template>

<script>
    // 全部./components/templates下的模板组件
    import {
        pageComponents as components
    } from '../components/allTemplates.js'
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
        custom: 0, //自定义页面
        'distribution': 20, //分销页面
    }
    //关注点分离
    import * as indexLogic from './components/indexLogic.js'
    import { ViewPort } from '../components/lazyLoad/index.js' 
    export default {
        data() {
            return {
                lazyLoadList:[],
                nextItem: {},
                loading: false,
                key: 0,
                previewPage: false,
                tabId: '',
                currentItem: {},
                spinTitle: '',
                previewId: '',
                isAutoBack: false,
                previewImage: '',
                pageId: '',
                menuBg: require('@/assets/image/shop/menu-skeleton.png'),
                showElesPort:{},
            }
        },
        updated(){
            clearTimeout(this.throttle)
            this.throttle=setTimeout(()=>{
                this.$nextTick(() => {
                    if(this.viewPorter){
                        this.viewPorter.getViewPort().getEleScrollHeight().getViewableEles()
                    }
                })
            },100)
        },
        components: {
            ...components,
            OthersPanel:()=>import('../components/othersFunctions/Panel.vue'),
            QuickActions:()=>import('../components/QuickActions.vue'),
            // 左侧操作栏
            OperPanel: () =>
                import ('../components/OperPanel'),
            // 手机模拟以及拖拽组件
            DiyPhone:()=>import('../components/DiyPhone'),
            // 底部保存等操作按钮
            BottomBar:()=>import('./components/BottomBar'),
            // 右侧组件参数设置组件
            ComponentSetter,
            TmpSaveModal: () =>
                import ('../components/TmpSaveModal'),
            //拖拽排序组件容器
            DragItemBox: () =>
                import ('../components/templatesItemBox/DragItemBox'),
            //固定位置浮动元素容器
            FloatItemBox: () =>
                import ('../components/templatesItemBox/FloatItemBox'),
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
                keyword:state => state.filteComponentKeyword,
                onlyOne: state => state.onlyOneComponent
            }),
            filteComponent(){
                return indexLogic.searchComponent(this.keyword,this.sortAbleList)
            },
            getSortableList() {
                if (this.html2canvasing > 0) {
                    return this.sortAbleList.slice(0, this.html2canvasing)
                }
                return this.sortAbleList
            },
            previewUrl() { //获取iframe预览地址
                return indexLogic.previewUrl(this.$route.params.page, this.previewId)
            }
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
                'addModal',
                'scrollTo'
            ]),
            filterAdvs(list) {
                return list.filter(item => item.id !== 'advs')
            },
            beforeChange(item) {

                this.$refs.componentSetter.getComponentName(item.type); //预切换组件；提升部分性能
            },
            getPoster() {
                //html2canvas截图
                this.clickTmp() //截图前先取消全部聚焦效果，避免截图蓝框
                return new Promise((resolve, reject) => {
                    this.$nextTick(() => {
                        this.createPoster(this.$route.params.page)
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
                indexLogic.clickTmp(this.$route.params.page, item)
            },
            getComponentName(item) {
                let id = item.id || item.typeid
                return 'Tpl' + id ?.replace(/^./, e => e.toUpperCase())
            },
            async toSave(type, action) {
                try {
                    if (this.loading) return
                    if (type == 'pageSet') { //点击页面设置
                        this.clickTmp()
                        return
                    }
                    this.spinTitle = '正在校验数据格式...'
                    this.loading = true
                    await this.checkForm(this.$route) //校验表单
                    this.setHtml2canvasing(); //优化HTMLcanvas的性能
                    this.spinTitle = '正在生成缩略图...'
                    this.$nextTick(() => {
                        if (type == 'asTpl') {
                            //另存为模板
                            setTimeout(() => {
                                this.getPoster()
                                    .then(img => {
                                        this.previewImage = img
                                        this.$refs.tmpSaveModal.toggleModal(img).then(() => {
                                            this.$nextTick(() => {
                                                this.loading = false
                                            })
                                        }).catch(() => {
                                            this.loading = false
                                        }); //
                                    })
                                    .catch((e) => {
                                        console.log(e)
                                        this.$Message.error('生成缩略图失败')
                                        this.loading = false
                                    })
                            }, 100)
                        } else {
                            //保存页面
                            this.getPoster().then(img => {
                                this.spinTitle = '数据正在保存中...'
                                this.previewImage = img
                                setPage.call(this, action, img)
                                    .then(res => {
                                        if (res.error == 0) {
                                            this.previewId = res.id
                                            this.$Message.success('操作成功')
                                            if (type == 'asPage') {
                                                //保存并跳转
                                                setTimeout(() => {
                                                    this.replacePath()
                                                }, 1000)
                                            } else {
                                                //保存并预览
                                                this.loading = false
                                                this.previewPage = true
                                            }
                                        } else {
                                            this.loading = false
                                        }
                                    }).catch(() => {
                                        this.loading = false
                                    })
                            })
                            .catch((e) => {
                                console.log(e)
                                this.loading = false
                                this.$Message.error('生成缩略图失败')
                            })
                        }
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
                let pageId = this.$route.params.page
                this.isAutoBack = true
                if (pageTypeId[pageId] || pageTypeId[pageId]===0) {
                    //四个页面模板
                    this.$router.replace({
                        path: '/shop/list/system'
                    })
                } else if (pageId == 'diymenu') {
                    //自定义菜单
                    this.$router.replace({
                        path: '/shop/custom-menu'
                    })
                } else {
                    this.$router.go(-1)
                }
            },
            clickTab(id) {
                this.tabId = id
                this.clickTmp(this.currentItem)
            },
            getBottomItem(list) {
                return list.filter(item => item.type)
            },
            closePreview(status) {
                if (!status) {
                    this.replacePath()
                }
            },
        },
        beforeRouteLeave (to, from, next) {
            // 开发环境去除提示
            if(process.env.VUE_APP_env !=="development") {
                if(!this.isAutoBack) {
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
            this.viewPorter=new ViewPort(port=>{
                let obj={
                    ...this.showElesPort,
                    ...port
                }
                if(!this.$utils.deepCompare(obj,this.showElesPort)){
                    this.showElesPort=obj;
                }
            })
            // 开发环境去除提示
            if(process.env.VUE_APP_env !=="development") {
                window.onbeforeunload = () => {
                    return "系统可能不会保存您所做的更改";
                }
            }
            let pageId = this.$route.params.page
            this.pageId = pageId
            let options; // 更多配置
            if (pageId === 'custom') {
                let pageItem = this.$route.query.pageItem, pageItemId = this.$route.query?.[`${pageItem}Id`];
                if (pageItem && pageItemId) {
                    options = {
                        pageItem,
                        pageItemId
                    }
                }
            }
            getPage.call(this, {
                pageId, //页面类型index：商城首页，goods-dettail：商品详情,vip-center：会员中心
                type: this.$route.query.type, //操作类型edit：编辑 ；add:添加
                tplId: this.$route.query.id, //模板id
                options
            }) //查询对应页面的数据
        },
        destroyed() {
            window.onbeforeunload = null
            this.loading = false
            this.clear()
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
            height: 100%;
            min-width: 496px;
            flex: 1;
            overflow-y: auto;
            box-sizing: border-box;
            margin-right: -10px;
            margin-left: -10px;
            position: relative;
            &::-webkit-scrollbar {
                width: 0;
            }
        }
        .scroll-body {
            height: fit-content;
            width: 375px;
            flex-shrink: 0;
            margin: 40px auto 20px;
            border-radius: 2px;
            box-shadow: 0px 4px 14px rgba(133, 148, 162, 0.2);
            position: relative;
            z-index: 1;
        } //  @media screen and (max-width: 1550px) {
        //      .scroll-body {
        //         transform: scale(0.85);
        //         transform-origin: top;
        //      }
        //  }
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
    .modal-title {
        transform: translateX(0);
        width: 540px;
        height: 100%;
        /* global/white */
        background: #FFFFFF;
        /* global/border */
        border: 1px solid #E9EDEF;
        box-sizing: border-box;
        border-radius: 2px;
        .modal-icon {
            margin-right: 6px;
            width: 24px;
            height: 24px;
            font-size: 24px;
            line-height: 24px;
            color: $brand-color;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            display: flex;
            align-items: center;
        }
        @media screen and (max-width: 1440px) {
            /deep/ .ivu-card-body {
                margin-left: 11px;
                margin-top: -100px;
                transform: scale(0.7);
            }
        }
        @media screen and (min-width: 1440px) {
            /deep/ .ivu-card-body {
                margin-left: 19px;
                margin-top: -40px;
                transform: scale(0.9);
            }
        }
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
    .modal-drawer {
        /deep/ .ivu-drawer-body {
            padding: 0;
        }
    }
</style>
