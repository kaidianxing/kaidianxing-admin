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
    <div>
        <kdx-modal-frame
                :width="460"
                value
                title="热区编辑器"
                @on-cancel="cancelHandler"
        >
            <div class="main" ref="main">
                <div class="main-content">
                    <div class="main-box">
                        <div class="container" :style="{ height: height + 'px', }"
                                v-loading="{
                                title: '图片加载中...',
                                loading: loadImg,
                            }"
                        >
                            <img :src="imgSrc" @load="loadImage(false)" @error="loadImage(false)" class="container-img"/>
                            <dragable-box
                                    v-for="(list, index) in lists"
                                    :point="list"
                                    :height="height"
                                    :width="width"
                                    :key="index"
                                    :active="activeIndex == index"
                                    @on-del="delHandler(index)"
                                    @on-drag="dragHandler($event, index)"
                                    @on-resize="resizeHandler($event, index)"
                                    @on-activated="activeHandler(index)"
                                    :class="list.error ? 'error' : ''"
                            >
                                <div class="hot_item" v-if="list.linkurl_name">
                                    <div class="hot_item_box two-line-hide">
                                        {{ list.linkurl_name }}
                                    </div>
                                </div>
                            </dragable-box>
                        </div>
                    </div>
                </div>
            </div>
            <template v-slot:footer>
                <div>
                    <Button class="primary-long" @click="saveHot">保存</Button>
                </div>
            </template>
        </kdx-modal-frame>
        <div v-if="show">
            <union-selector
                    v-model="show"
                    :current="getLinkInfo()"
                    @on-cancel="handleCancel"
                    @on-change="changeLink"
            ></union-selector>
        </div>
    </div>
</template>

<script>
    import DragableBox from "@/components/decorate/components/DragableBox";
    import UnionSelector from "@/components/selector/LinkUnionSelector";
    export default {
        props: {
            items: {
                type: Array,
                default: () => [],
            },
            imgurl: {
                type: String,
                default: "",
            },
        },
        components: {
            DragableBox,
            UnionSelector,
        },
        data() {
            return {
                lists: [],
                height: 261,
                width: 420,
                activeIndex: -1,
                show: false,
                chooseIndex: 0,
                imgSrc: "",
                loadImg: false,
            };
        },
        created() {
            this.getImg(this.width);
            this.loadImage(true);
        },
        methods: {
            loadImage(status) {
                this.loadImg = status;
            },
            getLinkInfo() {
                if (this.lists[this.chooseIndex]) {
                    return {
                        name: this.lists[this.chooseIndex].linkurl_name,
                        url: this.lists[this.chooseIndex].linkurl,
                        wxappid: this.lists[this.chooseIndex].wxappid,
                    };
                } else {
                    return {
                        name: "",
                        url: "",
                    };
                }
            },
            // 读取图片信息
            getImg(w) {
                this.imgSrc = this.imgurl
                    ? this.$utils.media(this.imgurl)
                    : this.$utils.staticImg("decorate/goods_col2.png");
                this.$utils.getImgSize(this.imgSrc).then((res) => {
                    this.ratio = res.width / w;
                    this.height = res.height / this.ratio;
                    this.lists = this.parsePoint(this.items, true);

                    if (this.lists.length == 0) {
                        this.addHot();
                    }
                });
            },
            dragHandler(point, index) {
                this.$set(this.lists, index, { ...this.lists[index], ...point });
            },
            resizeHandler(point, index) {
                this.$set(this.lists, index, { ...this.lists[index], ...point });
            },
            delHandler(index) {
                this.lists.splice(index, 1);
            },
            linkHandler(index) {
                this.chooseIndex = index;
                this.$nextTick(() => {
                    this.show = true;
                });
            },
            saveHot() {
                let lists = this.parsePoint(this.lists, false);
                this.$emit("on-save", lists);
            },
            // 解析位置
            parsePoint(lists, status) {
                if (status) {
                    return lists.map((item) => {
                        let { x, y, w, h, linkurl, linkurl_name, wxappid } = item;
                        return {
                            x: (x * this.width) / 100,
                            w: (w * this.width) / 100,
                            h: (h * this.height) / 100,
                            y: (y * this.height) / 100,
                            linkurl,
                            linkurl_name,
                            error: false,
                            wxappid,
                        };
                    });
                } else {
                    return lists.map((item) => {
                        let { x, y, w, h, linkurl, linkurl_name, wxappid } = item;
                        return {
                            x: (x / this.width) * 100,
                            w: (w / this.width) * 100,
                            h: (h / this.height) * 100,
                            y: (y / this.height) * 100,
                            linkurl,
                            linkurl_name,
                            wxappid,
                        };
                    });
                }
            },
            activeHandler(index) {
                this.lists[index].error = false;
                this.activeIndex = index;
            },
            handleCancel() {
                this.show = false;
            },
            cancelHandler() {
                this.$emit("on-cancel");
            },
            changeLink(e) {
                this.lists[this.chooseIndex].linkurl_name = e.name;
                this.lists[this.chooseIndex].linkurl = e.url;
                this.lists[this.chooseIndex].wxappid = e.wxappid;
                this.show = false;
            },
        },
    };
</script>

<style lang="scss" scoped>
    .main {
        max-height: calc(100vh - 110px - 160px);
        overflow-y: auto;
        position: relative;

        &-content {
            padding: 20px 20px 0 20px;
        }

        .step {
            margin-bottom: 20px;
            padding: 2.5px;
            display: flex;

            &-item {
                display: flex;
                align-items: center;

                &-circle {
                    margin-right: 4px;
                    border: 1px solid #e9edef;
                    border-radius: 50%;
                    height: 25px;
                    width: 25px;
                    font-size: 14px;
                    text-align: center;
                    line-height: 25px;
                    color: #b8b9bd;
                    background: #ffffff;
                }

                &-text {
                    font-size: 12px;
                    line-height: 16px;
                    color: #636669;
                }

                .arrow-right {
                    margin: 0 16px 0 18px;
                }
            }
        }
        &-box {
            .container {
                position: relative;
                width: 420px;
                height: 261px;
                user-select: none;

                &-img {
                    position: absolute;
                    width: 100%;
                    left: 0;
                    top: 0;
                }

                .btn_link {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 50px;
                    height: 18px;
                    font-size: 12px;
                    line-height: 18px;
                    color: #ffffff;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 9999;
                    cursor: pointer;
                    display: none;

                    &:hover {
                        display: block;
                    }

                    &.active {
                        display: block;
                    }
                }

                .hot_item {
                    padding: 5px;
                    text-align: center;

                    &_box {
                        max-width: 210px;
                        padding: 0 2px;
                        font-size: 14px;
                        font-weight: bold;
                        text-align: center;
                        line-height: 16px;
                        color: #ffffff;
                    }
                }
            }
        }
    }

    @media only (max-width: 1550px) {
        .main {
            max-height: calc(100vh - 110px - 80px);
        }
    }

    /deep/ .default-long {
        margin-right: 20px;
        border: 1px solid $brand-color;
        color: $brand-color;
    }

    /deep/ .dragable-item {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .error {
        background: rgba(#ff1f2c, 0.5);
        border: 1px solid #ff1f2c;
    }
</style>
