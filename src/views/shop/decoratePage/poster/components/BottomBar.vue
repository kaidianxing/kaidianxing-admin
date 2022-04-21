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
    <div class="nav-bar">
        <div class="left">
            <div class="modal-name" @click="goBack">
                <Icon type="md-arrow-back" />返回
            </div>
            <div class="tabs">
                <div class="tab" v-for="tab in getMenuTab" :class="{on: checkId == tab.id}" :key="tab.id" @click="clickTab(tab.id)">
                    <i class="iconfont tab-icon" :class="tab.icon"></i>
                    <span class="tab-name">{{tab.name}}</span>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="btn-group">
                <div :class="btn.btntype == 'primary'? 'btn-apply':'btn'" v-for="(btn,index) in getBtns" :key="index" @click="clickBtn(btn.id,btn.action)">
                    <i class="iconfont icon-zujian-yemianshezhi apply-icon pageSet-icon" v-if="btn.id=='pageSet'"></i>
                    <div>{{btn.name}}</div>
                    <i v-if="btn.btntype == 'primary'" class="iconfont icon-send apply-icon"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script> 
    import {
        mapState,
    } from 'vuex'
    export default {
        computed: {
            ...mapState('decorate', {
                currentModal: state => state.currentModal,
            }),
            getBtns() {
                return [{
                        id: 'pageSet',
                        name: '海报设置',
                    }, {
                        id: 'asPage',
                        name: '保存',
                    },
                    {
                        id: 'asPage',
                        name: '保存并应用',
                        btntype: 'primary',
                        action: 'publish'
                    }
                ]
            },
            getMenuTab() {
                //自定义页面的类型 
                const pageTypeId = {
                    //自定义页面的类型
                    goodposter: [{
                        id: 'goodposter',
                        name: '商品海报装修',
                        icon: 'icon-haibao-shangpinhaibao-top'
                    }], //首页
                    commissionposter: [{
                        id: 'commissionposter',
                        name: '分销海报装修',
                        icon: 'icon-haibao-fenxiaohaibao-top'
                    }], //商品详情
                    followposter: [{
                        id: 'poster_pushsetting',
                        name: '推送设置',
                        icon: 'icon-haibao-tuisongshezhi-top'
                    }, {
                        id: 'poster_reward',
                        name: '奖励设置',
                        icon: 'icon-haibao-jianglishezhi-top'
                    }, ] //会员中心
                }
                return pageTypeId[this.$route.params.page]
            }
        },
        props: {
            loading: {
                type: Boolean,
                default: false
            }
        },
        watch:{
            currentModal(){
                if(this.currentModal.id!='poster_pushsetting'&&this.checkId=='poster_pushsetting'){
                    this.checkId = this.getMenuTab[0].id
                }else if(this.currentModal.id=='poster_pushsetting'){
                    this.checkId = 'poster_pushsetting'
                }
            },
        },
        data() {
            return {
                checkId: null
            }
        },
        mounted() {
            this.checkId = this.getMenuTab[0].id
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            clickBtn(type, action) {
                if (this.loading) return
                this.$emit('click', type, action)
            },
            clickTab(id) {
                if (id == 'poster_reward' || id == 'poster_pushsetting') {
                    if (this.checkId != id) {
                        this.checkId = id
                        this.$store.commit('decorate/changeFocus', {
                            item: {
                                id,
                                type: id
                            },
                            pageId: this.$route.params.page
                        })
                    }
                } else if (this.checkId !== id) {
                    this.checkId = id
                    setTimeout(() => {
                        this.$emit('clickTab', id)
                    },100)
                    
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .nav-bar {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        height: 56px;
        background-color: #1c2c3c;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px 0 0;
        transition: all 0.2s ease-in-out;
        z-index: 1000;
        min-width: 1300px;
        .left {
            display: flex;
            flex-wrap: nowrap;
            height: 100%;
            &>.modal-name {
                box-sizing: border-box;
                width: 100px;
                height: 100%;
                margin: auto;
                text-align: center;
                line-height: 56px;
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
                color: #ffffff;
                cursor: pointer;
                &:hover {
                    background-color: #182533;
                }
                .ivu-icon {
                    margin-right: 5px;
                }
            }
            .tabs {
                display: flex;
                align-items: center;
                .tab {
                    display: flex;
                    align-items: center;
                    padding: 0 18px;
                    height: 56px;
                    cursor: pointer;
                    &.on {
                        background: #131F2B;
                    }
                    &-icon {
                        margin-right: 4px;
                        font-size: 20px;
                        color: #fff;
                    }
                    &-name {
                        font-size: 14px;
                        color: #fff;
                    }
                    &:hover{
                        background: #182533;
                    }
                }
            }
        }
        .right {
            .btn-group {
                display: flex;
                align-items: center;
                .btn {
                    position: relative;
                    padding: 0 20px;
                    min-width: 80px;
                    height: 56px;
                    font-size: 14px;
                    line-height: 56px;
                    color: #ffffff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    &:hover {
                        background-color: #182533;
                    }
                    &::after {
                        content: '';
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        height: 16px;
                        width: 1px;
                        background-color: #131f2b;
                    }
                    &-apply {
                        padding: 0 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 2px;
                        height: 32px;
                        font-size: 14px;
                        color: #fff;
                        background: $brand-color;
                        cursor: pointer;
                        .apply-icon {
                            order: -1;
                            margin-right: 4px;
                            color: #fff;
                        }
                    }
                    .pageSet-icon {
                        margin-right: 4px;
                        font-size: 20px;
                        color: #fff;
                    }
                }
            }
        }
    }
</style>