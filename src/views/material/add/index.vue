/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="flex activity-add-wrap">
        <preview :model="model"></preview>
        <div class="right">
            <kdx-content-bar class="content-bar-right">
                <kdx-hint-alert style="margin-bottom: 10px">
                    <div class="flex">
                        <div style="white-space: nowrap">提示：</div>
                        <div>
                            <p>朋友圈推广小程序/公众号/H5渠道系统自动生成生成小程序短链（Short Link），微信环境内无需问询可直接唤起小程序。</p>
                            <p>需要微信小程序拥有以下一级类目：电商平台、商家自营、跨境电商，不符和条件时会自动转为URL Link（另一种小程序链接形式，打开时会跳转中间页）</p>
                            <p>由于带参数的小程序链接（Short Link）永久链接上限是 10 万条，目前默认生成临时链接，生成数量不受限制，但是临时链接生成后有效时长为 30 天，失效后需要重新生成再使用，在新的场景使用时建议重新生成后使用。</p>
                        </div>
                    </div>
                </kdx-hint-alert>
                <div class="content">
                    <Form class="form" ref="form" :model="model" :label-width="120" :rules="rule">
                        <kdx-form-title class="price-settings">推广设置</kdx-form-title>
                        <FormItem label="选择商品：" prop="goods" ref="goods_id">
                            <div class="next-box">
                                <Button class="default-primary" @click="addShop">{{ model.goods_id ? '重新选择商品' : `+添加商品` }}</Button>
                                <div class="shop-list-box" v-if="model.goods_id">
                                    <shop-name-page-list ref="shop_name_list" :list="[{...model.goods}]" @on-delete="handleDelete"></shop-name-page-list>
                                </div>
                            </div>
                        </FormItem>
                        <FormItem label="推广文案：" class="r-form-item-checkbox" prop="description_type">
                            <RadioGroup v-model="model.description_type">
                                <Radio label="0">系统默认</Radio>
                                <Radio label="1">自定义</Radio>
                            </RadioGroup>
                            <kdx-hint-text class="hint-margin">
                                系统默认文案为左侧预览图中显示，商品标题、商品价格读取商品设置不可修改，系统自动生成小程序短链
                            </kdx-hint-text>
                            <div v-if="model.description_type !== '0'" class="next-box">
                                <FormItem class="margin-l" label="推广文案：" prop="description">
                                    <Input class="width-520 limit-input" v-model="model.description" type="textarea" :rows="4" maxlength="1000" show-word-limit placeholder="请输入推广文案"></Input>
                                    <kdx-hint-text style="margin-left: 120px" class="hint-margin">您可以自定义个性化文案，不再读取商品标题信息，支持emoj表情包</kdx-hint-text>
                                </FormItem>
                            </div>
                        </FormItem>
                        <FormItem label="上传素材：" class="r-form-item-checkbox" prop="material_type">
                            <RadioGroup v-model="model.material_type">
                                <Radio label="0">图片</Radio>
                                <Radio label="1">视频</Radio>
                            </RadioGroup>
                            <div class="next-box">
                                <template v-if="model.material_type == 0">
                                    <kdx-image-video
                                        class="swiper-img"
                                        type="image"
                                        :limit="9"
                                        :multiple="true"
                                        :current-list="model.thumb_all"
                                        is-drag
                                        @on-change="thumbAllChange"
                                    ></kdx-image-video>
                                    <div class="flex">
                                        <kdx-hint-text content="建议尺寸：750*750像素，可以拖拽图片调整顺序，最多上传9张"></kdx-hint-text>
                                    </div>
                                </template>
                                <template v-else>
                                    <kdx-image-video
                                        type="video"
                                        :video="model.video"
                                        :current="model.video_thumb"
                                        @on-video-change="changeVideo"
                                        @on-change="changeVideoImage"
                                        style="padding-bottom: 10px"
                                    ></kdx-image-video>
                                    <div class="flex">
                                        <kdx-hint-text content="仅小程序渠道支持一键保存视频，建议视频突出商品核心卖点，时长9～30秒，宽高比16:9"></kdx-hint-text>
                                    </div>
                                </template>
                            </div>
                        </FormItem>
                    </Form>
                </div>
                <template #btn>
                    <Button class="primary-long" type="primary" :loading="loading" :disabled="noManagePerm" @click="handleSave">保存</Button>
                    <Button class="default-long" to="/material/list">取消</Button>
                </template>
            </kdx-content-bar>
            <!--商品选择器-->
            <goods-selector
                v-model="selector.modal"
                :current="model.goods"
                :show_material="1"
                :multiple="false"
                @on-change="selectorChange"
                @on-cancel="selectorCancel"
            ></goods-selector>
        </div>
    </div>
</template>

<script>
import preview from "./components/Preview";
import GoodsSelector from '@/components/selector/GoodsSelector'
import shopNamePageList from "@/components/ShopNamePageList";
export default {
    components: {
        preview,
        shopNamePageList,
        GoodsSelector,
    },
    data() {
        return {
            id: '',
            type: '', // 类型  add/edit,
            model: {
                goods_id: "",
                goods: {},
                description_type: "0",
                description: "",
                material_type: "0",
                thumb_all: [],
                video: "",
                video_thumb: ""
            },
            rule: {
                goods: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (!this.model.goods_id) {
                                callback(new Error('至少选择一个商品'));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                description_type: [{ required: true, message: '请选择推广文案' }],
                description: [{ required: true, message: '请输入推广文案' }],
                material_type: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if ((this.model.material_type == 0 && this.model.thumb_all.length === 0) || (this.model.material_type == 1 && !this.model.video)) {
                                callback(new Error('请选择素材'));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
            },
            loading: false,
            selector: {
                modal: false,
            },
        }
    },
    mounted() {
        this.type = this.$route?.meta?.type;
        this.id = this.$route?.query?.id || "";
        if(this.type === "edit" && this.id) {
            this.getDetail();
        }
    },
    computed: {
        noManagePerm() {
            return !this.$getPermMap('material.index.manage')
        }
    },
    methods: {
        getDetail() {
            this.$api.materialApi.getMaterialInfo({
                id: this.id
            }).then((res) => {
                if(res.error === 0) {
                    let { goods_id, description_type, description, material_type, thumb_all, video, video_thumb } = res.data
                    thumb_all = JSON.parse(thumb_all);
                    let goods = {
                        id: res.data.goods_id,
                        category: res.data.goods_category,
                        has_option: res.data.goods_has_option,
                        thumb: res.data.goods_thumb,
                        title: res.data.goods_title,
                        type: res.data.goods_type,
                    }
                    this.model = { goods_id, description_type, description, material_type, thumb_all, video, video_thumb, goods };
                }
            })
        },
        // 添加商品
        addShop() {
            this.selector.modal = true
        },
        // 商品删除
        handleDelete() {
            this.model.goods = {};
            this.model.goods_id = "";
        },
        // 商品选择器
        selectorChange(row) {
            this.model.goods = {...row};
            this.model.goods_id = row.id;
            this.$refs[`goods_id`].validateState = '';
            this.$nextTick(() => {
                this.$refs['shop_name_list']?.reset();
            });
            this.selectorCancel()
        },
        selectorCancel() {
            this.selector.modal = false
        },
        // 轮播图
        thumbAllChange(pathList) {
            this.model.thumb_all = pathList
        },
        // 视频
        changeVideo(param) {
            this.model.video = param.path
        },
        // 视频封面
        changeVideoImage(path) {
            this.model.video_thumb = path
        },
        // 保存
        async handleSave() {
            this.$refs['form'].validate().then((valid) => {
                if (valid) {
                    this.loading = true;
                    let params = {
                        ...this.model
                    }
                    params['thumb_all'] = JSON.stringify(params['thumb_all'])
                    params['goods'] = JSON.stringify(params['goods'])
                    let api = "addMaterial"
                    if (this.type === "edit") {
                        // 编辑
                        api = "editMaterial";
                        params["id"] = this.id
                    }
                    this.$api.materialApi[api](params).then((res) => {
                        if(res.error === 0) {
                            this.$Message.success('保存成功');
                            this.$router.replace({
                                path: '/material/list',
                            })
                        }
                    }).finally(() => {
                        this.loading = false;
                    })
                }
            })
        },
    },
}
</script>

<style scoped lang="scss">
.form {
    min-width: fit-content;
    width: 100%;
}
.activity-add-wrap {
    .right {
        flex: 1;
        height: calc(100vh - 110px);
        overflow-y: auto;
        padding-top: 20px;
        .content-bar-right {
            /deep/ .app-overdue {
                margin-top: 0;
            }
        }
    }
}
.content {
    padding: 40px;
    background: #fff;
    min-height: 100%;
    min-width: fit-content;
    width: 100%;
    .price-settings {
        margin-bottom: 10px;
    }
}
.width-520 {
    width: 520px!important;
}
.margin-l /deep/.ivu-form-item-error-tip {
    margin-left: 120px;
}
.shop-list-box {
    margin-top: 10px;
}
.next-box {
    margin-top: 10px;
    background-color: #f4f6f8;
    padding: 30px 20px;
    border-radius: 2px;
    font-size: 14px;
    line-height: 20px;
    color: #262b30;
    /deep/ .ivu-form-item:last-child {
        margin-bottom: 0;
    }
    .label-list {
        padding-top: 10px;
        margin-bottom: -10px;
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
/deep/.add, /deep/.slide-image-add {
    background: #fff;
}
</style>
