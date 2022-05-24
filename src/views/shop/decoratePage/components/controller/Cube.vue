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
    <div
        class='cube'
        v-if='currentModal.id=="cube"&&lazyLoad'
    >
        <i-form
            :label-width="98"
            ref='line'
            :model="currentModal"
            :rules="validator"
        >
            <MyCollapse no-border>
                <p
                    class="form-title"
                    slot='label'
                >
                    内容样式
                </p>
                <form-item
                    ref="cube_style"
                    label="魔方布局："
                    :prop="currentModal.params.cubestyle=='custom'?'':'data'"
                >
                    <MyButtonGroup
                        :items='cubeStyle'
                        v-model='currentModal.params.cubestyle'
                        @change="changeStyle"
                    >
                        <cube-normal
                            v-if="getCubeTemp=='normal'"
                            v-model="activeIndex"
                        ></cube-normal>
                        <cube-rect
                            v-else-if="getCubeTemp=='rect'"
                            v-model="activeIndex"
                        ></cube-rect>
                        <div
                            class="choose-img"
                            :key="activeIndex"
                            v-if="activeIndex>-1 && currentModal.params.cubestyle!=='custom'"
                        >
                            <MyAddImg
                                class="cube-add-img"
                                :item="{
                                    link: currentModal.data[activeIndex].linkurl,
                                    link_name: currentModal.data[activeIndex].linkurl_name,
                                    url: currentModal.data[activeIndex].imgurl,
                                    video_id: currentModal.data[activeIndex].video_id,
                                    keyLink: currentModal.data[activeIndex].keyLink,
                            }"
                                @change-img="changeImg"
                                @change-link="changeLink"
                                @getImgInfo="getImgInfo"
                                :tip="getTip"
                            ></MyAddImg>
                        </div>

                    </MyButtonGroup>
                </form-item>
                <form-item
                    label="魔方密度："
                    v-if="currentModal.params.cubestyle=='custom'"
                    prop="data"
                >
                    <MyRadioGroup
                        :items='cubeOpts'
                        v-model='currentModal.params.cubenum'
                        @change="changeOpt"
                    >
                        <kdx-hint-alert :show-icon="false">移动鼠标选定布局区域大小</kdx-hint-alert>
                        <cube-custom
                            ref="cube_custom"
                            v-model="activeIndex"
                        ></cube-custom>
                    </MyRadioGroup>
                    <div
                        class="choose-img"
                        :key="activeIndex"
                        v-if="activeIndex>-1 && currentModal.params.cubestyle=='custom'"
                    >
                        <MyAddImg
                            class="cube-add-img"
                            :item="{
                                link: currentModal.data[activeIndex].linkurl,
                                link_name: currentModal.data[activeIndex].linkurl_name,
                                url: currentModal.data[activeIndex].imgurl,
                                wxappid: currentModal.data[activeIndex].wxappid,
                                video_id: currentModal.data[activeIndex].video_id,
                                keyLink: currentModal.data[activeIndex].keyLink,
                            }"
                            @change-img="changeImg"
                            @change-link="changeLink"
                            @getImgInfo="getImgInfo"
                            tip=" "
                        ></MyAddImg>
                    </div>
                </form-item>
                <form-item label="内部间距：">
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.margininside'
                    ></MyDraggableProgress>
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

const cube_num = {
    'cell_two': 2,
    'cell_three': 3,
    'top1_bottom2': 3,
    'left1_right3': 4,
    'left1_right2': 3
}

const box_style = {
    'cell_two': 'normal',
    'cell_three': 'normal',
    'top1_bottom2': 'rect',
    'left1_right3': 'rect',
    'left1_right2': 'rect',
    'custom': 'custom'
}

import CubeNormal from './Cube/CubeNormal'
import CubeRect from './Cube/CubeRect'
import CubeCustom from './Cube/CubeCustom'
import MyAddImg from '@/components/decorate/AddImg'
import mixin from './mixin.js'
export default {
    mixins: [mixin],
    name: 'cube',
    components: {
        CubeNormal,
        CubeRect,
        CubeCustom,
        MyAddImg
    },
    data() {
        return {
            cubeStyle: [{
                label: '一行两个',
                id: 'cell_two',
                icon: 'iconfont icon-zujian-mofang-yihangliangge'
            }, {
                label: '一行三个',
                id: 'cell_three',
                icon: 'iconfont icon-zujian-mofang-yihangsange'
            },
            {
                label: '左一右二',
                id: 'left1_right2',
                icon: 'iconfont icon-zujian-mofang-zuoyiyouer'
            }, {
                label: '上一下二',
                id: 'top1_bottom2',
                icon: 'iconfont icon-zujian-mofang-shangyixiaer'
            }, {
                label: '左一右三',
                id: 'left1_right3',
                icon: 'iconfont icon-zujian-mofang-zuoyiyousan'
            }, {
                label: '自定义',
                id: 'custom',
                icon: 'iconfont icon-zujian-mofang-zidingyi'
            }],
            cubeOpts: [{
                label: '4x4',
                id: 4
            }, {
                label: '5x5',
                id: 5
            }, {
                label: '6x6',
                id: 6
            }, {
                label: '7x7',
                id: 7
            }],
            activeIndex: 0,

        }
    },
    computed: {
        getCubeTemp() {
            return box_style[this.currentModal.params.cubestyle]
        },
        getTip() {
            return this.getCubeTemp == 'normal' ? `建议图片宽度${750 / cube_num[this.currentModal.params.cubestyle]}px` : ' '
        }
    },
    created() {
        if (this.currentModal.params.cubestyle == 'custom') {
            this.activeIndex = -1
        }
    },
    methods: {
        changeStyle(e) {
            this.$refs.cube_style.validateState = ''
            this.activeIndex = -1
            if (e !== 'custom') {
                let num = cube_num[e] - this.currentModal.data.length;

                if (num > 0) {
                    for (let i = 0; i < num; i++) {
                        this.currentModal.data.push({
                            linkurl: '',
                            linkurl_name: '',
                            imgurl: '',
                            left: '',
                            top: '',
                            width: '',
                            height: '',
                            wxappid: ''
                        })
                    }

                } else {
                    this.currentModal.data.splice(cube_num[e])
                }
                this.activeIndex = 0

            } else {
                this.currentModal.data.splice(0)
            }

            //  重置链接

            this.currentModal.data.forEach(v => {
                v.linkurl = ''
                v.linkurl_name = '',
                v.wxappid = '',
                v.video_id = '',
                v.keyLink = ''
            })
        },
        changeImg(e) {
            if (!e && this.activeIndex == 0) {
                this.currentModal.params.imgwidth = '';
                this.currentModal.params.imgheight = '';
            }
            this.currentModal.data[this.activeIndex].imgurl = e
        },
        changeLink(e) {
            this.currentModal.data[this.activeIndex].wxappid = e.wxappid
            this.currentModal.data[this.activeIndex].linkurl_name = e.name
            this.currentModal.data[this.activeIndex].linkurl = e.url
            this.currentModal.data[this.activeIndex].video_id = e.video_id
            this.currentModal.data[this.activeIndex].keyLink = e.keyLink
        },
        getImgInfo({ naturalHeight, naturalWidth }) {
            /*
           * 只取了第一个图片大小为基准
           * 优点 商家端点击图片切换不会抖动 不需要反复计算
           * 缺点 在第一张图尺寸固定的情况下 如果第二张图是小图会被拉伸 如果第二张图是大图会被压缩
           * 一般情况下商家会上传同等尺寸的 图片 不会出现拉伸/压缩情况
           * 如果优化也没有意义 图片大小不一致的情况下 兼容小图还是兼容大图？
           */
            if (this.activeIndex == 0) {
                this.currentModal.params.imgwidth = naturalWidth;
                this.currentModal.params.imgheight = naturalHeight;
            }
        },
        changeOpt() {
            this.activeIndex = -1
            this.$refs.cube_custom.resetCube()
        },
    }
}
</script>

<style lang="scss" scoped>
@import "./common.scss";

.cube {
    .container {
        padding: 10px;
    }

    .cube-add-img {
        /deep/ .body {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .input {
                width: 100%;
            }
        }
    }

    /deep/ .content {
        padding: 0;
        background: #fff;
    }

    .second_box {
        flex: 1;
        display: flex;
        overflow: hidden;
    }

    .normal_box {
        display: flex;
    }

    .choose-img {
        margin-top: 20px;
        padding: 10px;
        background: #f4f6f8;
    }
}
</style>
