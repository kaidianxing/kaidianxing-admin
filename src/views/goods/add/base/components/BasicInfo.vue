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
    <div class="level">
        <kdx-form-title content="基本信息"></kdx-form-title>
        <!-- <FormItem label="商品类型：" prop="type">
            <multi-select v-model="model_type"></multi-select>
        </FormItem> -->
        <FormItem label="商品标题：" prop="title" v-error-item.title>
            <Input
                v-model="model_title"
                type="textarea"
                :rows="1"
                autosize
                maxlength="70"
                show-word-limit
                class="width-430 limit-input"
                placeholder="请输入商品标题"
            />
        </FormItem>
        <FormItem label="商品副标题：" prop="sub_name">
            <Input
                v-model="model_sub_name"
                type="textarea"
                :rows="1"
                autosize
                maxlength="80"
                show-word-limit
                class="width-430 limit-input"
                placeholder="请输入商品副标题"
            />
        </FormItem>
        <FormItem label="商品简称：">
            <Input
                    v-model="model_short_name"
                    type="text"
                    maxlength="16"
                    show-word-limit
                    class="width-430 limit-input"
                    placeholder="请输入商品简称"
            />
        </FormItem>
        <FormItem label="商品主图：" prop="thumb" v-error-item.thumb>
            <kdx-image-video type="image" :current="model_thumb" @on-change="changeThumb"></kdx-image-video>
            <div>
                <kdx-hint-text>
                    <span>用于商城列表、双列三列商品组、分享头图。建议尺寸：800*800像素。</span>
                    <kdx-hint-tooltip type="image" :image="require('@/assets/image/example/shop_main.png')"></kdx-hint-tooltip>
                </kdx-hint-text>
                <kdx-hint-text style="padding-top:6px;">
                    <span>单列商品组建议尺寸：800*367像素，如选择此尺寸建议取消勾选显示为商品轮播图。</span>
                    <kdx-hint-tooltip type="image" :image="require('@/assets/image/example/shop_main_single.png')"></kdx-hint-tooltip>
                </kdx-hint-text>
            </div>

            <Checkbox
                v-model="isThumbAddSlide"
                @on-change="thumbAddSlideChange"
                style="margin-top: 10px"
            >显示为商品轮播图</Checkbox>
            <!--添加视频-->
            <Button v-if="!isShowVideo" type="text" @click="addVideo" style="display: block">+添加视频</Button>
        </FormItem>
        <FormItem v-if="isShowVideo" label="主图视频：" prop="video">
            <kdx-image-video
                type="video"
                :video="model_video"
                :current="model_video_thumb"
                @on-video-change="changeVideo"
                @on-change="changeVideoImage"
               style="padding-bottom: 10px"
            ></kdx-image-video>
<!--            <div class="flex">-->
            <kdx-hint-text class="marginT-10">添加主图视频可提升成交转化，有利于获取更多新流量；建议视频突出商品核心卖点，时长 9-30 秒，宽高比 16:9
                <kdx-hint-tooltip
                        type="image"
                        :image="require('@/assets/image/example/shop_video.png')"
                ></kdx-hint-tooltip>
            </kdx-hint-text>
<!--            </div>-->
        </FormItem>
        <FormItem label="商品轮播图：" prop="thumb_all">
            <kdx-image-video
                class="swiper-img"
                type="image"
                :limit="10"
                :multiple="true"
                :current-list="model_thumb_all"
                is-drag
                @on-change="thumbAllChange"
            ></kdx-image-video>
            <div class="flex">
                <kdx-hint-text content="建议尺寸: 800*800像素, 轮播图可以拖拽图片调整顺序,最多上传10张"></kdx-hint-text>
                <kdx-hint-tooltip
                    type="image"
                    :image="require('@/assets/image/example/shop_swiper.png')"
                ></kdx-hint-tooltip>
            </div>
        </FormItem>
        <FormItem label="商品分类：" prop="category_id">
            <tree-select
                v-model="model_category_id"
                :transfer="true"
                :show-checkbox="true"
                :data="shopLevel"
                :multiple="true"
                :isHandlePath="true"
                @on-change="handleShopLevelChange"
                @change-data="changeData"
                class="width-430"
            ></tree-select>
            <kdx-hint-text :errContent="emsg" v-if="showErrContent"></kdx-hint-text>
        </FormItem>
        <FormItem class="r-form-item-checkbox" label="营销标签：">
            <div>
                <Checkbox v-model="model_is_recommand" true-value="1" false-value="0">推荐</Checkbox>
                <Checkbox v-model="model_is_new" true-value="1" false-value="0">新品</Checkbox>
                <Checkbox v-model="model_is_hot" true-value="1" false-value="0">热卖</Checkbox>
            </div>
            <div class="flex">
                <kdx-hint-text content="给商品添加专属营销标签">
                    <kdx-hint-tooltip
                            type="image"
                            :image="require('@/assets/image/example/shop_market.png')"
                    ></kdx-hint-tooltip>
                </kdx-hint-text>
            </div>
        </FormItem>
        <FormItem label="商品标签：" prop="label_id">
            <Button class="default-primary" @click="editShopLabel">编辑</Button>
            <kdx-hint-tooltip
                    type="image"
                    :image="require('@/assets/image/example/shop_tag.png')"
            ></kdx-hint-tooltip>
            <div
                    v-if="shopLabel.data.length > 0"
                    class="label-list"
                    style="margin-top: 10px;line-height: 0;margin-bottom: -10px"
            >
                <kdx-tag-label
                        v-for="(item, index) in shopLabel.data"
                        :key="index"
                        type="warning"
                        :closable="true"
                        border
                        style="margin: 0 10px 10px 0;"
                        @on-close="closeShopLabel(index)"
                >{{item.name || ''}}</kdx-tag-label>
            </div>
        </FormItem>
        <!--收起更多基本信息设置-->
        <collapse-panel name="展开更多基本信息设置" expand-name="收起更多基本信息设置" style="padding-top: 0">
            <template>
                <FormItem label="商品排序：" prop="sort_by">
                    <Input
                        v-model.number="model_sort_by"
                        maxlength="4"
                        class="width-160"
                        placeholder="请输入"
                    />
                    <kdx-hint-text content="最多4位数字, 数字越大, 排名越靠前, 默认排序为创建时间"></kdx-hint-text>
                </FormItem>
                <FormItem prop="ext_field.show_sales" class="r-form-item-checkbox" label="显示销量：">
                    <RadioGroup v-model="model_ext_field.show_sales">
                        <Radio label="1">
                            <span>是</span>
                        </Radio>
                        <Radio label="0">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
                    <div class="flex">
                        <kdx-hint-text content="显示销量=实际销量+虚拟销量">
                            <kdx-hint-tooltip
                                    type="image"
                                    :image="require('@/assets/image/example/shop_sale.png')"
                            ></kdx-hint-tooltip>
                        </kdx-hint-text>
                    </div>
                </FormItem>
                <FormItem label="虚拟销量：" prop="sales">
                    <kdx-rr-input
                        number
                        :fixed="0"
                        :max-value="999999999"
                        v-model="model_sales"
                        class="width-160"
                        placeholder="请输入"
                    />
                </FormItem>
                <FormItem label="商品备注：">
                    <Input v-model="model_ext_field.note" type="textarea" class="width-430 limit-input" placeholder="请输入"/>
                    <kdx-hint-text content="超链接需要以http/https开头，多个需要换行。"></kdx-hint-text>
                </FormItem>
            </template>
        </collapse-panel>
    </div>
</template>

<script>
import CollapsePanel from '@/components/little/CollapsePanel'
// import MultiSelect from './MultiSelect'
import TreeSelect from '@/components/tree-select/index'
import { modelMap, stateMap } from './binders.js'
import {mapState} from "vuex";

export default {
    components: {
        CollapsePanel,
        // MultiSelect,
        TreeSelect,
    },

    computed: {
        // 是否是编辑页面
        isEdit(){
            return !!this.$route.query.operate
        },
        // 提示
        emsg(){
            return `商品分类数据发生变化，请重新设置商品分类`
        },
        /**
         * 双向绑定vuex/goodAddEdit.js/state/model
         * 使用方法this.model_${propsName}
         */
        ...mapState("goodAddEdit", {
            is_activity_goods: state => state?.model?.is_activity_goods == 1?true:false,
            goodsDecorate: state => state?.goodDecrate,
        }),
        ...modelMap(),
        ...stateMap([
            'isShowVideo',
            'isThumbAddSlide',
            'rules',
            'shopLabel',
            'shopLevel',
        ]),
        showErrContent() {
            let flag = false
            let traverse = (params) => {
                params.forEach(item => {
                    if (new Set(this.model_category_id).has(item.value)) {
                        if (item.children && item.children.length) {
                            let _cache = item.children.map(v => v.value)
                            // 判断this.model_category_id是否包含_cache里的所有数据
                            let _cache1 = _cache.filter(v => this.model_category_id.indexOf(v) >= 0)
                            if (_cache.length === _cache1.length) {
                                traverse(item.children)
                            } else {
                                flag = true
                            }
                        }
                    } else {
                        if (item.children && item.children.length) {
                            traverse(item.children)
                        }
                    }
                })
            }
            traverse(this.shopLevel)
            return flag
        },

    },
    methods: {
        changeData(list) {
            this.$store.commit('goodAddEdit/setShopLevel', list)
        },

        // 关闭商品标签
        closeShopLabel(index) {
            this.shopLabel.data.splice(index, 1)
            this.model_label_id = this.shopLabel.data.map(item => item.id);
            this.shopLabel = {
                ...this.shopLabel
            }
        },
        // 编辑商品标签
        editShopLabel() {
            this.shopLabel.value = true
            this.shopLabel = {
                ...this.shopLabel
            }
        },
        // 商品分类
        handleShopLevelChange(list) {
            this.model_category_ids = list.join(',')
        },

        // 轮播图
        thumbAllChange(pathList) {
            this.model_thumb_all = pathList
        },
        // 商品主图是否显示轮播图
        thumbAddSlideChange() {
            if (this.isThumbAddSlide) {
                if (this.model_thumb_all.length > 0) {
                    let index = this.model_thumb_all.indexOf(this.model_thumb)
                    if (index === -1) {
                        this.model_thumb_all.unshift(this.model_thumb)
                    }
                } else {
                    this.model_thumb_all = [this.model_thumb]
                }
            } else {
                if (this.model_thumb_all.length > 0) {
                    let index = this.model_thumb_all.indexOf(this.model_thumb)
                    if (index !== -1) {
                        this.model_thumb_all.splice(index, 1)
                    }
                } else {
                    this.model_thumb_all = []
                }
            }
        },
        // 视频
        changeVideo(param) {
            this.model_video = param.path
            this.$store.commit('goodAddEdit/setVideoParams',param)
        },
        // 视频封面
        changeVideoImage(path) {
            this.model_video_thumb = path
        },
        addVideo() {
            this.isShowVideo = true
        },
        // 商品主图
        changeThumb(path) {
            // 是否添加主图
            if (this.isThumbAddSlide) {
                if (this.model_thumb_all.length > 0) {
                    let index = this.model_thumb_all.indexOf(this.model_thumb)
                    if (index > -1) {
                        if (this.model_thumb_all[index] !== path) {
                            this.model_thumb_all.splice(index, 1)
                            if (path) {
                                this.model_thumb_all.splice(index, 0, path)
                            }
                        }
                    } else {
                        this.model_thumb_all.unshift(path)
                    }
                } else {
                    this.model_thumb_all = [path]
                }
            }
            this.model_thumb = path
        },
    }
}
</script>

<style lang="scss" scoped>
.ivu-tooltip-popper.ivu-tooltip-light[x-placement] {
    padding: 0;
    .ivu-tooltip-content {
        .ivu-tooltip-inner {
            padding: 6px;
        }

        .ivu-tooltip-arrow {
            display: none;
        }
    }
}

.swiper-img {
    /deep/ul.image {
        margin-bottom: -10px;
        li.img-li {
            margin-bottom: 10px;
        }
    }

    /deep/.slide-image .slide-image-add {
        margin-bottom: 0!important;
    }
}
.width-250 {
    width: 250px;
}
.show-img.marginL-120 {
    /deep/ .add {
        background: #fff;
    }
}
.r-form-item-checkbox .nest-box {
    /deep/ .ivu-form-item-error-tip {
        margin-left: 120px;
    }
}
.r-form-item-checkbox .nest-box {
    .telephoneLimit /deep/ +.ivu-form-item-error-tip {
        margin-left: 0px;
    }
}
.labelLink {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    box-sizing: border-box;
    color: $text-first;
    padding: 8px 0 7px 0;
    line-height: 20px;
    padding-right: 10px !important;
    width: 120px;
}
</style>
