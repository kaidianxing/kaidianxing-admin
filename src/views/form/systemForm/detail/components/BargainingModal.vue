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
        v-model="value"
        title="价格面议表单"
        :width="700"
        ok-text="确定"
        @on-ok="handleSave"
        @on-cancel="handleCancel"
    >
        <Form :label-width="120">
            <div class="form-info-content">
                <template  v-for="(item, index) in bargainingData">
                    <div class="form-info-item" :key="index" v-if="item.type !== 'pictures'">
                        <FormItem :label="`${item.params.title}：`" class="r-form-item-text">
                            <div v-if="item.type === 'checkboxes'">
                                {{item.params.value.join(',')}}
                            </div>
                            <div v-else-if="item.type === 'city'">
                                {{item.params.province || ''}}{{item.params.city || ''}}{{item.params.area || ''}}
                            </div>
                            <div v-else-if="item.type === 'daterange' || item.type === 'timerange'">
                                {{item.params.start.value}} ~ {{item.params.end.value}}
                            </div>
                            <div v-else>
                                {{item.params.value}}
                            </div>
                        </FormItem>
                    </div>
                </template>
                <template v-if="imageList.length">
                    <div class="form-info-item" v-for="(image, index) in imageList" :key="`m${index}`">
                        <FormItem :label="`${image.params.title}：`" class="r-form-item-text">
                            <div class="info-image">
                                <template v-if="image.params.value.length">
                                    <div class="image-box">
                                        <div
                                            v-for="(item, index) in image.params.value"
                                            :key="index"
                                            class="image"
                                        >
                                            <img
                                                :src="$media(item)"
                                                alt=""
                                                @error="replaceImage"
                                            />
                                            <div
                                                class="shade"
                                                @click="previewImg(true, index)"
                                            >
                                                <div class="shade-content">
                                                    <p>
                                                        <Icon type="ios-search" />
                                                    </p>
                                                    <p>查看</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </FormItem>
                    </div>
                </template>
            </div>
        </Form>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: "bargainingModal",
    props: {
        // 表单信息
        bargainingData: {
            type: Array,
            default: () => []
        },
        // 显示与否
        value: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            imageList: [],
            previewImages: [],
        }
    },
    watch: {
        bargainingData: {
            handler() {
                this.imageList = this.bargainingData.filter(item => item.type === 'pictures');
                this.previewImages = [];
                if (this.imageList.length) {
                    this.imageList.forEach(item => {
                        this.previewImages = this.previewImages.concat(item.params.value)
                    })
                }
            },
            immediate: true
        }
    },
    methods: {
        handleSave() {
          this.$emit('on-cancel')
        },
        handleCancel() {
            this.$emit('on-cancel')
        },
    }
}
</script>

<style scoped lang="scss">
.form-info-content {
    display: flex;
    flex-wrap: wrap;
    padding: 30px 0;
    .form-info-item {
        width: 100%;
        flex-shrink: 0;
        box-sizing: border-box;
        color: $text-first;
        /deep/.ivu-form-item-label {
            word-break: break-all;
        }
        .info-image {
            .image-box {
                display: flex;
                flex-wrap: wrap;
                .image {
                    width: 60px;
                    height: 60px;
                    border: 1px solid $border-color;
                    border-radius: 2px;
                    overflow: hidden;
                    box-sizing: border-box;
                    overflow: hidden;
                    margin-right: 20px;
                    position: relative;
                    &:hover {
                        .shade {
                            display: flex;
                        }
                    }
                    > img {
                        width: 100%;
                        height: 100%;
                    }
                    // 遮罩
                    .shade {
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        background-color: $shade-color;
                        border-radius: 2px;
                        color: #ffffff;
                        @include font-12-16;
                        display: none;
                        cursor: pointer;
                        align-items: center;
                        justify-content: center;
                        > .shade-content {
                            > p {
                                text-align: center;
                            }
                            .ivu-icon {
                                font-size: 20px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>