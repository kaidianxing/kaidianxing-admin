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
    <div class="oper-panel" style="overflow:auto;" v-if="!onlyOne">
        <Input class="oper-panel-search" prefix="md-search" v-model="search" placeholder="搜索组件名称 模糊搜索" />
        <Collapse v-model="openIndex" simple>
            <Panel :name="key" v-for="(val,key) in pageItems" :key="key" v-show="showComponents[key]" hide-arrow>
                <i class="ivu-icon icon-full-right iconfont"></i> {{val[0].groupName}}
                <div class="buttonGroup" slot="content">
                    <Button class="oper-btn" type="primary" v-for="(item,index) in val" :key="index" @click="clickBtn(item,key)" v-show="showComponents[key]&&showComponents[key][index]&&item.show!==false">
                        <i
                            :class="item.icon"
                            class="btn-icon"
                            :style="{color:item.color}"
                            v-if="!item.svg"
                        ></i>
                        <img
                            class="btn-svg"
                            :src="require(`@/assets/svg/decorateIcon/${item.svg}.svg`)"
                            alt
                            v-else
                        />
                        {{item.name}}
                    </Button>
                </div>
            </Panel>
        </Collapse>
        <p class="no-result" v-show="!noResult">
            <i class="icon-fenxiao-leijiyongjin- iconfont"></i>
            <span>暂无结果</span>
        </p>
    </div>
</template>

<script>
    import {
        mapState,
        mapGetters,
        mapActions,
        mapMutations
    } from 'vuex'
    import {
        getModal,
        groupInfo
    } from '@/store/decorate/index.js'
    import {scrollTo} from '@/store/decorate/utils.js'
    export default {
        computed: {
            ...mapGetters('decorate', [
                'getModal',
                'getAllModalName',
                'getPageItems'
            ]),
            ...mapState('decorate', {
                pageList: state => state.pageList,
                topItem: state => state.topItem,
                currentModal: state => state.currentModal,
                onlyOne: state => state.onlyOneComponent
            }),
            pageItems() {
                let items = this.getPageItems(this.$route.params.page)
                let groups = Object.keys(items).sort((a, b) => {
                    return groupInfo(a).yIndex - groupInfo(b).yIndex
                })
                let newItem = {}
                groups.forEach(item => {
                    newItem[groupInfo(item).yIndex] = items[item]
                })
                return newItem
            }
        },
        watch: {
            search: {
                immediate: true,
                handler() {
                    if (this.search.trim()) {
                        let res = this.pageItems
                        let tmp = {}
                        for (let k in res) {
                            res[k].forEach((item, index) => {
                                if (
                                    item.type.indexOf(this.search) > -1 ||
                                    item.name.indexOf(this.search) > -1
                                ) {
                                    if (tmp[k]) {
                                        tmp[k][index] = item
                                    } else {
                                        tmp[k] = {
                                            [index]: item
                                        }
                                    }
                                }
                            })
                        }
                        this.showComponents = tmp
                    } else {
                        this.showComponents = this.pageItems
                    }
                    this.noResult = Object.keys(this.showComponents).length
                }
            },
            pageItems: {
                immediate: true,
                handler() {
                    let res = this.pageItems
                    this.showComponents = this.pageItems
                    if (this.onlyOne == true) {
                        this.clickBtn(res[5][0], 'global')
                    }
                }
            }
        },
        data() {
            return {
                noResult: false, //无搜索结果
                search: '',
                showComponents: {},
                openIndex: ['1', '2', '3', '4', '5', '6']
            }
        },
        methods: {
            hasItem(arr, obj, key) {
                let index = -1;
                arr.forEach((v, i) => {
                    if (v[key] == obj[key]) {
                        index = i
                    }
                })
                return index
            },
            clickBtn(item, key) {
                //添加元素
                let modal = getModal(item.type) //添加模板
                if (modal.istop && this.topItem.length) { //已经有了置顶元素,置顶元素只能有一个，除了跟followbar一起可以有两个
                    let index = this.hasItem(this.topItem, modal, 'id'); //查找相同id
                    let errorMessage = '';
                    if (index > -1) { //（两个置顶元素相同）
                        errorMessage = '此元素最多允许添加1个';
                    } else if (modal.id != 'followbar' && ((this.topItem.length == 1 && this.topItem[0].id != 'followbar') || this.topItem.length > 1)) { //两个置顶元素不同,只能与followbar共存
                        index = 0
                        errorMessage = '已有顶部固定元素，请删除后添加';
                    }
                    if (errorMessage) {
                        this.$Message['error']({
                            background: true,
                            content: errorMessage
                        })
                        this.changeFocus({
                            item: this.topItem[index],
                            pageId: this.$route.params.page
                        })
                        return
                    }
                }
                item.groupType = key
                if (modal.max) { //查看最大允许添加数量
                    let hasnum = 0
                    let currentItem
                    this.pageList.forEach(item => {
                        if (item.id == modal.id) {
                            hasnum = hasnum + 1
                            currentItem = item
                        }
                    })
                    if (hasnum >= modal.max) {
                        this.$Message['error']({
                            background: true,
                            content: `此元素最多允许添加${modal.max}个`
                        })
                        this.changeFocus({
                            item: currentItem,
                            pageId: this.$route.params.page
                        })
                        return
                    }
                }
                this.addModal({
                    list: item,
                    pageId: this.$route.params.page
                }).then(items => {
                    let res = items[0]
                    if (res) {
                        scrollTo(res)
                    }
                })
            },
            ...mapActions('decorate', ['addModal']),
            ...mapMutations('decorate', ['changeFocus'])
        }
    }
</script>

<style lang="scss" scoped>
    .oper-panel {
        position: absolute;
        width: 306px;
        height: 100%;
        left: 0;
        top: 0;
        bottom: 22px;
        z-index: 0;
        /* global/white */
        background: #ffffff;
        /deep/ .oper-panel-search {
            border: none;
            width: 100%;
            height: 46px;
            border-bottom: 1px solid #e9edef;
            padding-left: 20px;
            .ivu-input-prefix {
                padding-left: 20px;
            }
            .ivu-input,
            .ivu-icon {
                border: none !important;
                box-shadow: none;
                height: 100%;
                color: #000;
            }
            .ivu-icon-ios-loading {
                display: none !important;
            }
            .ivu-icon {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        }
        /deep/ .ivu-collapse-header,
        .ivu-collapse-item,
        .ivu-collapse-item,
        .ivu-collapse-simple {
            border: none;
            font-weight: bold;
            color: #262b30;
            .ivu-icon {
                font-size: 12px;
                margin-right: 4px;
                vertical-align: 0;
                color: #939799;
            }
        }
        /deep/ .ivu-collapse-content {
            padding: 0 0 0 15px;
            .buttonGroup {
                display: flex;
                flex-wrap: wrap;
                .ivu-btn {
                    margin: 5px;
                    width: 82px;
                    height: 82px;
                    box-sizing: border-box;
                    padding: 0;
                    /* global/bg */
                    background: #f4f6f8;
                    border-radius: 2px;
                    border: none;
                    span {
                        font-family: PingFang SC;
                        font-style: normal;
                        font-weight: bold;
                        font-size: 14px;
                        line-height: 20px;
                        color: #636669;
                        display: flex;
                        flex-direction: column;
                        i {
                            font-size: 24px;
                            margin-bottom: 10px;
                        }
                    }
                    &:hover {
                        border: 1px solid $brand-color;
                        background: #f0faff;
                        span {
                            color: $brand-color;
                        }
                    }
                }
                .btn-svg,
                .btn-icon {
                    width: 24px;
                    height: 24px;
                    font-size: 24px;
                    text-align: center;
                    line-height: 24px;
                    margin: 11px auto;
                }
            }
        }
        .no-result {
            display: flex;
            flex-direction: column;
            i,
            span {
                margin: 0 auto;
            }
            i {
                font-size: 28px;
                width: 28px;
                height: 28px;
                text-align: center;
                line-height: 28px;
                margin-bottom: 10px;
                margin-top: 60px;
            }
            span {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
                line-height: 20px;
                color: #636669;
            }
        }
    }
</style>