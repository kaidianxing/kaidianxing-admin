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
    <kdx-content-bar>
        <div class="good-classification-add">
        <Form ref="form" :model="model" :label-width="120">
            <kdx-form-title>广告设置</kdx-form-title>
            <FormItem label="分类广告：" prop="advimg">
                <kdx-image-video type="ad" :current="model.advimg" @on-change="changeAdvertising"></kdx-image-video>
                <div class="flex" style="margin-top: 10px">
                    <kdx-hint-text content="推荐分类的广告图，建议尺寸750*250像素，或者比例为3:1的图片。"></kdx-hint-text>
                    <kdx-hint-tooltip
                        type="image"
                        :image="require('@/assets/image/example/classify_ad.png')"
                    ></kdx-hint-tooltip>
                </div>
            </FormItem>
            <FormItem label="广告链接：" prop="advurl">
                <Button
                    v-show="!model.advurl"
                    class="default-primary"
                    @click="openAdvertisingSelector"
                >+添加</Button>
                <Button
                    v-show="model.advurl"
                    class="default-primary"
                    @click="openAdvertisingSelector"
                >编辑</Button>
                <div class="ad-link-content">
                    <p>{{model.advurl}}</p>
                    <Button v-show="model.advurl" type="text" @click="deleteAdLink">删除</Button>
                </div>
            </FormItem>
        </Form>
            <Spin fix v-show="loading"></Spin>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">保存</Button>
            <Button class="default-long" to="/goods/classify">返回</Button>
        </template>
        <!--链接选择器-->
        <link-selector
                v-model="advertising.value"
                :current="model.advurl"
                @on-cancel="handleCancel"
                @on-change="advertisingChange"
        ></link-selector>
    </kdx-content-bar>
</template>

<script>
import LinkSelector from '@/components/selector/LinkSelector'
export default {
    name: 'index',
    components: { LinkSelector },
    data() {
        return {
            model: {
                advurl: '',
                advimg: ''
            },
            advertising: {
                value: false
            },
            id: 0,
            loading: false
        }
    },
    methods: {
        // 分类广告
        changeAdvertising(image) {
            this.model.advimg = image
        },
        // 保存
        handleSave() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.editGoodClassify()
                }
            })
        },
        // 修改
        editGoodClassify() {
            this.loading = true
            let params = Object.assign({ id: this.id }, this.model)
            this.$api.goodsApi
                .editGoodClassify(params)
                .then(res => {
                    this.loading = false
                    if (res.error === 0) {
                        this.$Message.success('广告设置成功')
                        this.$router.push({ path: '/goods/classify' })
                    }
                })
                .catch()
        },
        advertisingChange(link) {
            this.model.advurl = link.url
            this.handleCancel()
        },
        openAdvertisingSelector() {
            this.advertising.value = true
        },
        // 删除广告链接
        deleteAdLink() {
            this.model.advurl = ''
        },
        handleCancel() {
            this.advertising.value = false
        },
        getData() {
            this.$api.goodsApi
                .getGoodClassify({ id: this.id })
                .then(res => {
                    this.model.advurl = res.data.advurl || ''
                    this.model.advimg = res.data.advimg || ''
                })
                .catch()
        },
        resetModel() {
            this.model = {
                advurl: '',
                advimg: ''
            }
        }
    },
    mounted() {
        this.resetModel()
        this.id = this.$route.query?.id || 0
        if (this.id) {
            this.getData()
        }
    }
}
</script>

<style scoped lang="scss">
.good-classification-add {
    background-color: #fff;
    margin-top: 20px;
    height: 100%;
    // background-color: $background-color;
    .ivu-form {
        padding: 40px;
        .ivu-btn-text {
            @include font-12-16;
            padding-right: 10px;
        }
    }
    .ad-link-content {
        display: flex;
        flex-wrap: nowrap;
        > p {
            max-width: 500px;
            word-break: normal;
            margin-right: 10px;
            margin-top: 10px;
            @include font-14-20;
            color: $text-first;
        }
        > button {
            padding-top: 10px;
        }
    }
}
.iphone-preview {
    > .image {
        width: 150px;
        height: 150px;
        > img {
            width: 100%;
            height: 100%;
        }
    }
    > .text {
        padding-top: 10px;
        @include font-12-16;
        color: $text-second;
        text-align: center;
    }
}

/deep/ .show-img ul .ad {
    width: 210px;
    height: 70px;

    img {
        height: 70px;
    }
}
</style>
