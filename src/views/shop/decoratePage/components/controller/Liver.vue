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
    <div class='liver'>
        <i-form
            :label-width="100"
            ref='liver'
            :model="currentModal"
            :rules="validator"
        >
            <MyCollapse>
                <p
                    class="form-title"
                    slot='label'
                >
                    组件样式
                </p>
                <form-item
                    label="直播样式："
                    style="margin-bottom: 50px;"
                >
                    <MyButtonGroup
                        :items='liverStyle'
                        v-model='currentModal.params.liverstyle'
                        @change="changeStyle"
                    ></MyButtonGroup>
                </form-item>
                <form-item label="背景颜色：" v-if="showBgColor">
                    <MyColorPicker
                        v-model='currentModal.style.background'
                        default='#FFFFFF'
                    ></MyColorPicker>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <p
                    class="form-title"
                    slot='label'
                >
                    添加直播间
                </p>
                <form-item label="选择直播间：" :style="{
                    marginBottom: currentModal.params.addtype == '1'?'10px':'30px'
                }">
                    <MyRadioGroup
                        :items='addType'
                        v-model='currentModal.params.addtype'
                        @change="liverChange"
                        class="liver-select"
                    >

                    </MyRadioGroup>
                   
                    <kdx-hint-alert
                        style="margin-bottom:0px;"
                        v-if="currentModal.params.addtype == '0'"
                        class="liver-tip"
                        :show-icon="false"
                    >根据直播间状态自动显示直播间列表 优先级：直播中 (暂停中)>未开始</kdx-hint-alert>
                </form-item>
                <form-item label="显示数量：" v-if="currentModal.params.addtype == '0'">
                     <MyDraggableProgress
                        :min='1'
                        :max='keysLimit[currentModal.params.liverstyle]'
                        unit='个'
                        v-model='currentModal.params.livernum'
                        @change="changeLiverNum"
                    ></MyDraggableProgress>
                    <kdx-hint-text>最多可显示20个直播间</kdx-hint-text>
                </form-item>
                 <SelectLiver
                        style="margin-bottom:30px;"
                        v-if="currentModal.params.addtype == '1'"
                        @on-dragdrop="handleDrag"
                        @on-change="dataChange"
                        @on-single="singleChange"
                    ></SelectLiver>
            </MyCollapse>

            <MyCollapse noBorder>
                <p
                    class="form-title"
                    slot='label'
                >
                    内容样式
                </p>
                <form-item
                    label="标题："
                    v-if="['title_pic'].includes(currentModal.params.liverstyle)"
                >
                    <MyRadioGroup
                        :items='showStaus'
                        v-model='currentModal.params.showtitle'
                    >
                        <form-item
                            :label-width="80"
                            label="标题："
                            class="liver-input"
                            v-if="currentModal.params.showtitle == 0"
                        >
                            <Input
                                v-model="currentModal.params.firsttitle"
                                placeholder="显示文字"
                                maxlength="10"
                                show-word-limit
                            ></Input>
                        </form-item>
                        <form-item
                            :label-width="80"
                            style="margin-bottom: 10px;"
                            label="文字颜色："
                            v-if="currentModal.params.showtitle == 0"
                        >
                            <MyColorPicker
                                v-model='currentModal.style.firstcolor'
                                default='#ff3c29'
                            ></MyColorPicker>
                        </form-item>
                    </MyRadioGroup>
                </form-item>
                <form-item
                    label="副标题："
                    v-if="['title_pic'].includes(currentModal.params.liverstyle)"
                >
                    <MyRadioGroup
                        :items='showStaus'
                        v-model='currentModal.params.showsubtitle'
                    >
                        <form-item
                            :label-width="80"
                            label="标题："
                            class="liver-input"
                            v-if="currentModal.params.showsubtitle == 0"
                        >
                            <Input
                                v-model="currentModal.params.subtitle"
                                placeholder="显示文字"
                                maxlength="20"
                                show-word-limit
                            ></Input>
                        </form-item>
                        <form-item
                            :label-width="80"
                            style="margin-bottom: 10px;"
                            label="文字颜色："
                            v-if="currentModal.params.showsubtitle == 0"
                        >
                            <MyColorPicker
                                v-model='currentModal.style.secondcolor'
                                default='#969696'
                            ></MyColorPicker>
                        </form-item>
                    </MyRadioGroup>
                </form-item>

                <!-- 轮播 -->
                <form-item
                    label="卡片颜色："
                    v-if="currentModal.params.liverstyle =='swiper'"
                >
                    <MyColorPicker
                        v-model='currentModal.style.cardcolor'
                        default='# '
                    ></MyColorPicker>
                </form-item>
                <!-- 轮播 -->
                <form-item
                    label="直播间标题："
                    v-if="currentModal.params.liverstyle =='swiper'"
                >
                    <MyRadioGroup
                        :items='showStaus'
                        v-model='currentModal.params.showlivertitle'
                    >
                        <MyColorPicker
                            v-model='currentModal.style.livertitlecolor'
                            :default='getDefaultLiver'
                        ></MyColorPicker>
                    </MyRadioGroup>
                </form-item>

                <form-item
                    label="直播间标题："
                    v-if="['big_pic', 'cell_two','cell_two_long', 'title_pic'].includes(currentModal.params.liverstyle)"
                >
                    <MyColorPicker
                        v-model='currentModal.style.livertitlecolor'
                        default='#FFFFFF'
                    ></MyColorPicker>
                </form-item>
                <form-item
                    label="标题颜色："
                    v-if="['list'].includes(currentModal.params.liverstyle)"
                >
                    <MyColorPicker
                        v-model='currentModal.style.titlecolor'
                        default='#FFFFFF'
                    ></MyColorPicker>
                </form-item>
                <form-item label="直播商品：">
                    <MyRadioGroup
                        :items='showStaus'
                        v-model='currentModal.params.showgoods'
                    ></MyRadioGroup>
                </form-item>
                <form-item label="直播状态：">
                    <MyRadioGroup
                        :items='showStaus'
                        v-model='currentModal.params.showstatus'
                    ></MyRadioGroup>
                </form-item>
                <form-item label="主播昵称：">
                    <MyRadioGroup
                        :items='showStaus'
                        v-model='currentModal.params.shownickname'
                    >
                        <MyColorPicker
                            v-if="currentModal.params.shownickname=='0'"
                            v-model='currentModal.style.nicknamecolor'
                            :default='getDefaultNick'
                        ></MyColorPicker>
                    </MyRadioGroup>
                </form-item>
                <form-item label="上间距：">
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.margintop'
                    ></MyDraggableProgress>
                </form-item>
                <form-item label="下间距：">
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.marginbottom'
                    ></MyDraggableProgress>
                </form-item>
                <form-item label="左右间距：">
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.marginleft'
                    ></MyDraggableProgress>
                </form-item>
                 <form-item label="上边角：">
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.topradius'
                    ></MyDraggableProgress>
                </form-item>
                <form-item label="下边角：">
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.bottomradius'
                    ></MyDraggableProgress>
                </form-item>
            </MyCollapse>
        </i-form>

    </div>
</template>

<script>
import SelectLiver from './Liver/SelectLiver'
import mixin from './mixin.js'

const keysLimit = {
    big_pic: 20,
    cell_two: 20,
    cell_two_long: 20,
    list: 20,
    title_pic: 3
}

export default {
    mixins: [mixin],
    name: 'liver',
    components: {
        SelectLiver
    },
    data() {
        return {
            liverStyle: [
                //     {
                //     label: '轮播',
                //     id: 'swiper',
                //     icon: 'iconfont icon-zujian-xiaochengxuzhibo-lunbo'
                // }, 
                {
                    label: '大图',
                    id: 'big_pic',
                    icon: 'iconfont icon-zujian-xiaochengxuzhibo-datu'
                }, {
                    label: '两列',
                    id: 'cell_two',
                    icon: 'iconfont icon-zujian-xiaochengxuzhibo-lianglie'
                }, {
                    label: '两列长图',
                    id: 'cell_two_long',
                    icon: 'iconfont icon-zujian-xiaochengxuzhibo-liangliechangtu'
                }, {
                    label: '标题+图',
                    id: 'title_pic',
                    icon: 'iconfont icon-zujian-xiaochengxuzhibo-biaoti21'
                }, {
                    label: '列表',
                    id: 'list',
                    icon: 'iconfont icon-zujian-xiaochengxuzhibo-liebiao'
                }],
            addType: [{
                label: '自动添加',
                id: '0'
            }, {
                label: '手动添加',
                id: '1'
            }],
            showStaus: [{
                id: '0',
                label: '显示'
            }, {
                id: '1',
                label: '不显示'
            }],
            radiusStyle: [{
                id: '0',
                label: '直角'
            }, {
                id: '1',
                label: '圆角'
            }],
            defaultData: [],
            keysLimit,
            timer:null
        }
    },
    computed: {
        getDefaultLiver() {
            const styles = ['big_pic', 'cell_two_long', 'title_pic'];
            if (styles.includes(this.currentModal.params.liverstyle)) {
                return '#FFFFFF'
            } else {
                return '#212121'
            }
        },
        getDefaultNick() {
            if (this.currentModal.params.liverstyle.indexOf('list') > -1) {
                return '#969696'
            } else {
                return '#FFFFFF'
            }
        },
        showBgColor(){
             const styles = ['big_pic', 'cell_two_long'];
            if (styles.includes(this.currentModal.params.liverstyle)) {
                return ''
            } else {
                return true
            }
        }
    },
    methods: {
        handleDrag({
            nIndex, oIndex
        }) {
            let item = { ...this.currentModal.data[nIndex] }
            Object.assign(this.currentModal.data[nIndex], this.currentModal.data[oIndex])
            Object.assign(this.currentModal.data[oIndex], item)
        },
        dataChange(val) {
            if (this.currentModal.params.addtype == 1) {
                this.defaultData = val
            }

            this.currentModal.data = val.slice(0,keysLimit[this.currentModal.params.liverstyle])
            this.refreshCurrentModal()
        },
        singleChange({ val, index }) {
            Object.assign(this.currentModal.data[index], val)
            this.refreshCurrentModal()
        },
        changeStyle(key) {
            // 重置样式
            this.currentModal.style.livertitlecolor = this.getDefaultLiver;
            this.currentModal.style.nicknamecolor = this.getDefaultNick;
            this.currentModal.params.livernum = keysLimit[key]

            this.currentModal.data.splice(keysLimit[key])
            this.liverChange()
            this.refreshCurrentModal()
        },
        liverChange() {
            if (this.currentModal.params.addtype == 0) {
                let pagesize = this.currentModal.params.livernum;
                this.$api.liverApi.decorateLiver({ pagesize, page: 1 }).then(res => {
                    if (res.error == 0) {
                        this.currentModal.data = res.list
                        this.refreshCurrentModal()
                    }
                })
            } else {
                if (this.defaultData.length) {
                    this.currentModal.data = this.defaultData
                } else {
                    this.currentModal.data = []

                }
            }
        },
        changeLiverNum(){
            clearTimeout(this.timer)

            this.timer = setTimeout(() => {
                this.liverChange()
            }, 200);
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.currentModal?.data?.length && this.currentModal.params.addtype == 1) {
                this.defaultData = this.currentModal?.data
            }

            if (!this.currentModal.style.livertitlecolor) {
                this.currentModal.style.livertitlecolor = this.getDefaultLiver;
            }

            if (!this.currentModal.style.nicknamecolor) {
                this.currentModal.style.nicknamecolor = this.getDefaultNick;
            }

        })
    }
}
</script>

<style lang="scss" scoped>
@import "./common.scss";

.liver-tip {
    margin-top: 10px;
    /deep/ .ivu-alert-message {
        color: $brand-color;
    }
}

.liver-input {
    margin-bottom: 20px;
    /deep/ .ivu-form-item-content {
        margin-left: 80px !important;
    }

    /deep/ .ivu-form-item-label {
        padding-right: 0;
    }
}

.liver-select {
    /deep/ .content {
        padding: 0;
    }
}
</style>