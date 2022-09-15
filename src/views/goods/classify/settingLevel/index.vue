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
        <div class="setting-category">
            <Form
                ref="form"
                :model="model"
                :label-width="120"
                :rules="rules"
            >
                <kdx-form-title>分类层级</kdx-form-title>
                <FormItem
                    label="分类级别："
                    prop="level"
                    class="r-form-item-checkbox"
                >
                    <RadioGroup
                        v-model="model.level"
                        class="model-category"
                    >
                        <Radio label="0">
                            <span class="cate-level">一级分类</span>
                        </Radio>
                        <Radio label="1">
                            <span class="cate-level">二级分类</span>
                        </Radio>
                        <Radio label="2">
                            <span class="cate-level">三级分类</span>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text content="切换分类级别需要重新设置商品的分类从属关系，以免导致用户搜索不到相关产品"></kdx-hint-text>
                </FormItem>
                <FormItem label="选择模板：">
                    <div class="choose-temp">
                        <div
                            class="temp-list"
                            :class="{
                                'active': model.template_type == temp.id
                            }"
                            v-for="(temp, index) in tempList"
                            :key="index"
                            @click="chooseTemp(temp.id)"
                        >
                            <div class="temp-img-box">
                                <i class="iconfont icon-yes1 check-icon"></i>
                                <img
                                    class="temp-img"
                                    :src="temp.imgurl"
                                />
                            </div>
                            <div class="temp-title">{{temp.name}}</div>
                        </div>
                    </div>
                </FormItem>
                <FormItem
                    label="显示形式："
                    prop="modal"
                    v-if="model.template_type == '0'"
                >
                    <RadioGroup
                        v-model="model.style"
                        class="r-form-item-checkbox"
                    >
                        <Radio label="0">圆形
                            <kdx-hint-tooltip
                                style="margin-left:-6px;"
                                type="image"
                                :image="require('@/assets/image/example/classify_circle.png')"
                            ></kdx-hint-tooltip>
                        </Radio>
                        <Radio label="1">方形
                            <kdx-hint-tooltip
                                style="margin-left:-6px;"
                                type="image"
                                :image="require('@/assets/image/example/classify_rect.png')"
                            ></kdx-hint-tooltip>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="导航标题：" prop="title">
                    <Input type="text" v-model="model.title" placeholder="商品分类" class="width-160" />
                    <kdx-hint-tooltip type="image" :image="require('@/assets/image/example/classify_example.png')"></kdx-hint-tooltip>
                </FormItem>
            </Form>
            <Spin
                fix
                v-show="loading"
            ></Spin>
        </div>
        <template #btn>
            <Button
                class="primary-long"
                @click="handleSave"
            >保存</Button>
            <Button
                class="default-long"
                @click="nextStep"
            >返回</Button>
        </template>
    </kdx-content-bar>
</template>

<script>

export default {
    name: "index",
    data() {
        return {
            model: {
                level: '0',
                style: '0',
                template_type: '0',
                title: '商品分类',
            },
            rules: {
                title: [{
                    required: true,
                    message: '导航标题必填'
                }],
            },
            link: {
                value: false
            },
            loading: false
        };
    },
    computed: {
        tempList() {
            let tmpId = [{
                id: '0',
                name: '默认模板'
            },{
                id: '1',
                name: '高级模板'
            }]
            let arr = tmpId.map(v => {
                return {
                    id: v.id,
                    imgurl: require(`@/assets/image/classification/cate${v.id}_level${this.model.level}.png`),
                    name: v.name
                }
            })
            return arr
        }
    },
    methods: {
        handleCancel() {
            this.link.value = false;
        },
        nextStep() {
            this.$router.go(-1);
        },
        getData() {
            this.$api.goodsApi.getSettingClassifyLevel()
                .then(res => {
                    if (res.error === 0) {
                        let keys = ['level', 'style','template_type']
                        keys.forEach(key=>{
                            res.data[key] = '' + res.data[key]
                        })
                       
                        this.model = { ...this.model, ...res.data }
                    }
                });
        },
        handleSave() {
            this.loading = true;
            this.model.adv_url = this.model.adv_url.length === 0 ? '' : this.model.adv_url;
            this.$api.goodsApi.settingClassifyLevel({
                data: this.model
            })
                .then(res => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.$Message.success('分类层级设置成功');
                        this.$router.push({
                            path: '/goods/classify'
                        });
                    }
                });
        },
        chooseTemp(id) {
            this.model.template_type = id
        }
    },
    mounted() {
        this.getData();
    }
};
</script>

<style scoped lang="scss">
.setting-category {
    background-color: #ffffff;
    margin-top: 20px;
    min-height: 100%;
    .ivu-form {
        padding: 40px;
    }

    .choose-temp {
        display: flex;
    }

    .cate-level {
        font-weight: bold;
    }

    .temp-list {
        margin-right: 20px;
        cursor: pointer;

        &:hover {
            .temp-img-box {
                border: 1px solid $brand-color;
            }
        }

        &.active {
            .temp-img-box {
                border: 1px solid $brand-color;
                .check-icon {
                    display: block;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    z-index: 101;
                    font-size: 24px;
                    width: 24px;
                    height: 24px;
                    text-align: center;
                    line-height: 24px;
                    color: $brand-color;
                }
            }

            .temp-title {
                font-weight: 600;
                color: $brand-color;
            }
        }
        .temp-img-box {
            position: relative;
            margin-bottom: 12px;
            border: 1px solid #e9edef;
            border-radius: 2px;
            width: 200px;
            height: 355px;
            overflow: hidden;

            .check-icon {
                display: none;
            }

            .temp-img {
                display: block;
                width: 200px;
                height: 355px;
            }
        }

        .temp-title {
            font-size: 14px;
            text-align: center;
            line-height: 20px;
            color: #262b30;
        }
    }

    .image {
        width: 100px;
        height: 160px;
        border: 1px solid $border-color;
        border-radius: 2px;
        margin-top: 10px;
        /*margin-right: 40px;*/
        > img {
            width: 100%;
            height: 100%;
        }
    }
    .image-active {
        border-color: $brand-color;
        box-shadow: 0 0 15px rgba(0, 78, 121, 0.11);
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
</style>
