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
    <div class="goods-detail-info">
        <div class="form-content">
            <ul>
                <template v-for="(item, index) in formContent">
                    <li :key="index" v-if="item.id !== 'pictures'">
                        <div class="label">
                            {{item.params.title}}：
                        </div>
                        <div class="content">
                            {{getData(item)}}
                        </div>
                    </li>
                </template>

                <!--图片-->
                <template v-if="imageList.length > 0">
                    <li v-for="(item, index) in imageList" :key="index">
                        <div class="label">
                            {{item.params.title}}：
                        </div>
                        <div class="content image" v-if="item.params.value.length">
                            <div class="image-item" v-for="(image, childIndex) in item.params.value" :key="childIndex">
                                <img :src="$media(image)" alt="" @error="previewImg">
                                <div class="shade" @click="previewImg(true, childIndex, item.params.value)">
                                    <div class="shade-content">
                                        <p>
                                            <Icon type="ios-search"></Icon>
                                        </p>
                                        <p>
                                            查看
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
        <preview-img :imgList="previewImages || []" :currentIndex="current" v-show="imgModal"
                     @on-close="previewImg(false)" @on-change="changePreview"/>
    </div>
</template>

<script>
    import PreviewImg from '@/components/PreviewImg';
    export default {
        name: "kdxGoodsDetailInfo",
        components: {
            PreviewImg
        },
        props: {
            formContent: {
                type: Array,
                default: () => []
            },
            imageList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                previewImages: [],
                imgModal: false,
                current: 0
            };
        },
        methods: {
            getData(item) {
                if (item.id === 'checkboxes') {
                    return `${item.params?.value.join(',') || '-'}`
                } else if (item.id === 'city') {
                    if (item.params.status == 2) {
                        return `${item.params.province || '-'}`;
                    } else if (item.params.status == 0) {
                        if (item.params.province && item.params.city) {
                            return `${item.params.province}${item.params.city}`;
                        } else {
                            return '-'
                        }
                    } else if (item.params.status == 1) {
                        if (item.params.province && item.params.city && item.params.area) {
                            return `${item.params.province}${item.params.city}${item.params.area}`;
                        } else {
                            return '-'
                        }
                    }
                } else if (item.id === 'daterange' || item.id === 'timerange') {
                    if (item.params.start.value && item.params.end.value) {
                        return `${item.params.start.value} ~ ${item.params.end.value}`;
                    } else if (item.params.start.value || item.params.end.value) {
                        return `${item.params.start.value || item.params.end.value}`;
                    } else {
                        return '-'
                    }
                } else {
                    return `${item.params.value || '-'}`
                }
            },
            previewImg(status, index, data) {
                this.previewImages = data;
                if (index || index == 0) {
                    this.current = index
                }
                this.imgModal = status
            },
            changePreview(current) {
                this.current = current;
            }
        }
    };
</script>

<style scoped lang="scss">
    .goods-detail-info {
        .form-content {
            > ul {
                max-width: 1150px;
                li {
                    padding-bottom: 20px;
                    display: flex;
                    font-size: 12px;
                    &:last-child {
                        padding-bottom: 0;
                    }
                    .label {
                        width: 120px;
                        text-align: right;
                    }
                    .content {
                        padding-left: 10px;
                        &.image {
                            display: flex;
                            flex-wrap: wrap;
                            margin-right: -6px;
                            margin-bottom: -6px;
                            .image-item {
                                position: relative;
                                width: 80px;
                                height: 80px;
                                margin-right: 6px;
                                margin-bottom: 6px;
                                border: 1px solid $border-color;
                                border-radius: 2px;
                                >img {
                                    width: 100%;
                                    height: 100%;
                                }
                                &:hover {
                                    .shade {
                                        display: flex;
                                    }
                                }
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
        }
    }
</style>
