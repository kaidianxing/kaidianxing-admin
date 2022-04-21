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
    <kdx-modal-frame
        :value="value"
        title="商品分类选择器"
        width="1000"
        :loading="loading"
        ok-text="保存"
        @on-ok="handleSave"
        @on-cancel="handleCancel"
    >
        <div class="goods-classification-link">
            <div class="header">
                <div class="name-box">分类名称</div>
                <div class="image-box">分类图片</div>
                <div class="action-box">操作</div>
            </div>
            <template v-if="data && data.length > 0">
                <ul class="first-class">
                    <li
                        class="first-class-item class-item"
                        v-for="item in data"
                        :key="item.id"
                    >
                        <!--第一层级-->
                        <div
                            class="first-class-item-content class-item-content"
                        >
                            <div class="name-box tree">
                                <!--第一层级-->
                                <div class="content">
                                    <span class="title">一级</span>
                                    <Input
                                        v-model="item.name"
                                        disabled
                                        class="width-100"
                                    />
                                </div>
                            </div>
                            <!--分类图片-->
                            <div class="image-box">
                                <img
                                    :src="$media(item.thumb)"
                                    @error="replaceImage"
                                    alt=""
                                />
                            </div>
                            <!--操作-->
                            <div class="action-box">
                                <Button
                                    v-show="item.checked"
                                    type="primary"
                                    @click="setChecked(item, false)"
                                >
                                    已选
                                </Button>
                                <Button
                                    v-show="!item.checked"
                                    class="default-primary"
                                    @click="setChecked(item, true)"
                                >
                                    选择
                                </Button>
                            </div>
                        </div>
                        <ul
                            class="second-class"
                            v-if="item.children && item.children.length"
                        >
                            <li
                                class="second-class-item class-item"
                                v-for="item_sec in item.children"
                                :key="item_sec.id"
                            >
                                <div
                                    class="second-class-item-content class-item-content"
                                >
                                    <div class="name-box tree">
                                        <div class="link">
                                            <kdx-svg-icon
                                                class="iconfont"
                                                type="icon-cengji"
                                            ></kdx-svg-icon>
                                        </div>
                                        <div class="content">
                                            <span class="title">二级</span>
                                            <Input
                                                v-model="item_sec.name"
                                                disabled
                                                class="width-100"
                                            />
                                        </div>
                                    </div>
                                    <!--分类图片-->
                                    <div class="image-box">
                                        <img
                                            :src="$media(item_sec.thumb)"
                                            @error="replaceImage"
                                            alt=""
                                        />
                                    </div>
                                    <!--操作-->
                                    <div class="action-box">
                                        <Button
                                            v-show="item_sec.checked"
                                            type="primary"
                                            @click="setChecked(item_sec, false)"
                                        >
                                            已选
                                        </Button>
                                        <Button
                                            v-show="!item_sec.checked"
                                            class="default-primary"
                                            @click="setChecked(item_sec, true)"
                                        >
                                            选择
                                        </Button>
                                    </div>
                                </div>
                                <ul
                                    class="third-class"
                                    v-if="
                                        item_sec.children &&
                                            item_sec.children.length
                                    "
                                >
                                    <li
                                        class="third-class-item class-item"
                                        v-for="item_thi in item_sec.children"
                                        :key="item_thi.id"
                                    >
                                        <div
                                            class="third-class-item-content class-item-content"
                                        >
                                            <div class="name-box tree">
                                                <div class="link">
                                                    <kdx-svg-icon
                                                        class="iconfont"
                                                        type="icon-cengji"
                                                    ></kdx-svg-icon>
                                                </div>
                                                <div class="content">
                                                    <span class="title"
                                                        >三级</span
                                                    >
                                                    <Input
                                                        v-model="item_thi.name"
                                                        disabled
                                                        class="width-100"
                                                    />
                                                </div>
                                            </div>
                                            <!--分类图片-->
                                            <div class="image-box">
                                                <img
                                                    :src="
                                                        $media(item_thi.thumb)
                                                    "
                                                    @error="replaceImage"
                                                    alt=""
                                                />
                                            </div>
                                            <!--操作-->
                                            <div class="action-box">
                                                <Button
                                                    v-show="item_thi.checked"
                                                    type="primary"
                                                    @click="
                                                        setChecked(
                                                            item_thi,
                                                            false
                                                        )
                                                    "
                                                >
                                                    已选
                                                </Button>
                                                <Button
                                                    v-show="!item_thi.checked"
                                                    class="default-primary"
                                                    @click="
                                                        setChecked(
                                                            item_thi,
                                                            true
                                                        )
                                                    "
                                                >
                                                    选择
                                                </Button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </template>
            <div v-else style="text-align: center">
                暂无数据
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: 'goodsClassifySelector',
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        current: {
            type: [Object, String],
            default: () => {},
        },
    },
    data() {
        return {
            data: [],
            selectRow: {},
            loading: false,
        }
    },
    watch: {
        value(val) {
            if (val) {
                this.getList()
            }
        },
    },
    methods: {
        getList() {
            this.loading = true
            this.$api.goodsApi.goodClassifyList().then((res) => {
                this.loading = false
                if (res.error === 0) {
                    this.data = res.list
                    // 默认选中
                    if (this.current?.id) {
                        const id = this.current?.id || this.current
                        this.defaultChecked(id)
                    }
                }
            })
        },
        setChecked(item, isChecked) {
            if (isChecked) {
                this.selectRow = {
                    ...item,
                }
                this.defaultChecked(item.id)
            } else {
                this.selectRow = {
                    ...{},
                }
            }
        },
        defaultChecked(id) {
            this.data.forEach((item) => {
                item.checked = false
                if (item.id === id) {
                    item.checked = true
                }
                if (item.children && item.children.length) {
                    item.children.forEach((item_sec) => {
                        item_sec.checked = false
                        if (item_sec.id === id) {
                            item_sec.checked = true
                        }
                        if (item_sec.children && item_sec.children.length) {
                            item_sec.children.forEach((item_thi) => {
                                item_thi.checked = false
                                if (item_thi.id === id) {
                                    item_thi.checked = true
                                }
                            })
                        }
                    })
                }
            })
            this.data = this.data.slice(0)
        },
        handleSave() {
            this.$emit('on-change', this.selectRow)
            this.handleCancel()
        },
        handleCancel() {
            this.$emit('on-cancel')
        },
    },
}
</script>

<style scoped lang="scss">
.goods-classification-link {
    max-height: calc(100vh - 110px - 160px - 45px - 75px - 45px);
    padding: 20px;
    position: relative;

    .name-box {
        width: 500px;
        box-sizing: border-box;
        padding-left: 10px;
        display: flex;
        /*flex: 1;*/
        .link {
            .iconfont {
                font-size: 20px;
                color: $text-zhushi;
                padding-right: 20px;
                padding-top: 10px;
            }
        }
    }

    .image-box {
        width: 200px;
        box-sizing: border-box;
        padding: 0 10px;
        /*flex: 1;*/
        > img {
            width: 40px;
            height: 40px;
            border-radius: 2px;
            border: 1px solid $border-color;
        }
    }

    .action-box {
        width: 100px;
        box-sizing: border-box;
        padding: 0 10px;
        /*flex: 1;*/
    }

    > .header {
        height: 60px;
        @include font-14-20-bold;
        color: $text-first;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        width: 100%;
    }

    > .first-class {
        .first-class-item {
            margin-bottom: 10px;
            border: 1px solid $border-color;
            border-bottom: none;
            border-radius: 2px;
        }
        .class-item-content {
            border-bottom: 1px solid $border-color;
            display: flex;
            flex-wrap: nowrap;
            @include font-14-20;
            color: $text-first;
            /*height: 72px;*/
            align-items: center;

            > .tree {
                @include font-14-20-bold;
                color: $text-first;

                > .content {
                    > .title {
                        padding: 0 10px;
                    }

                    > .ivu-input-wrapper {
                        margin: 14px 0;
                    }
                }
            }

            /deep/ .ivu-input-wrapper {
                .ivu-input {
                    color: $text-first;
                }
            }
        }

        .first-class-item-content {
            background-color: #f4f6f8;
        }

        .second-class-item-content {
            background-color: #fafdff;
            .name-box {
                padding-left: 62px;
            }
        }

        .third-class-item-content {
            background-color: #fffdf9;
            .name-box {
                padding-left: 168px;
            }
        }
    }
}
</style>
