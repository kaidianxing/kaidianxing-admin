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
        <div class="theme-setting">
            <kdx-form-title>主题色设置</kdx-form-title>
            <Form :label-width="120">
                <FormItem label="主题色选择：">
                    <div class="theme">
                        <div
                            class="theme-item"
                            v-for="theme in themes"
                            :key="theme.id"
                            :class="{
                                active: theme.id == theme_color,
                            }"
                            @click="handleChoose(theme.id)"
                        >
                            <div class="theme-color">
                                <span
                                    class="circle"
                                    :style="{ background: theme.primary }"
                                ></span>
                                <span
                                    class="circle subcolor"
                                    :style="{ background: theme.subcolor }"
                                ></span>
                            </div>
                            <div class="theme-text">{{ theme.name }}</div>
                            <i
                                class="iconfont icon-yes1 theme-choose"
                                v-if="theme.id == theme_color"
                            ></i>
                        </div>
                    </div>

                </FormItem>
                <FormItem label="主题色色值：">
                    <div class="circle-box">
                        <kdx-copy-text :text="getChooseTheme.primary">
                            <div class="flex theme-color-tip">
                                <span
                                    class="circle"
                                    :style="{
                            background: getChooseTheme.primary
                        }"
                                ></span>
                                <span class="text">{{getChooseTheme.primary}}</span>
                            </div>
                        </kdx-copy-text>
                        <kdx-copy-text :text="getChooseTheme.subcolor">
                            <div class="flex theme-color-tip">
                                <span
                                    class="circle ml-20"
                                    :style="{
                            background: getChooseTheme.subcolor
                        }"
                                ></span>
                                <span class="text">{{getChooseTheme.subcolor}}</span>
                            </div>
                        </kdx-copy-text>
                    </div>
                </FormItem>
                <FormItem label="主题色示例：">
                    <div class="preview">
                        <div
                            class="preview-img"
                            v-for="(img, index) in getPreviewImgs"
                            :key="index"
                        >
                            <img
                                :src="img"
                                alt=""
                                srcset=""
                            />
                        </div>
                    </div>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button
                class="primary-long"
                :loading="loading"
                :disabled="noManagePerm"
                @click="handleConfirm"
            >保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            themes: [
                {
                    id: "default",
                    name: "经典红",
                    primary: "#FF3C29",
                    subcolor: "#212121",
                },
                {
                    id: "yellow",
                    name: "活力橙",
                    primary: "#F9D72A",
                    subcolor: "#FFF9DA",
                },
                {
                    id: "pink",
                    name: "樱花粉",
                    primary: "#FB496F",
                    subcolor: "#FEE2E4",
                },
                {
                    id: "green",
                    name: "玛瑙绿",
                    primary: "#19B038",
                    subcolor: "#DCF1E1",
                },
                {
                    id: "purple",
                    name: "魅力紫",
                    primary: "#8150F2",
                    subcolor: "#ECE3FC",
                },
                {
                    id: "blue",
                    name: "宝石蓝",
                    primary: "#277CF4",
                    subcolor: "#D2E6F9",
                },
                {
                    id: "black",
                    name: "曜石黑",
                    primary: "#2A2A2E",
                    subcolor: "#E8E9EF",
                },
            ],
            theme_color: "default",
        };
    },
    computed: {
        getPreviewImgs() {
            let theme = this.theme_color;
            let imgNames = ["list", "option", "order"];

            return imgNames.map((img) =>
                require(`@/assets/image/theme/${theme}/${theme}_${img}.png`)
            );
        },
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("diypage.theme_color.manage");
        },
        getChooseTheme() {
            return this.themes.filter(item => item.id == this.theme_color)[0] || {}
        }
    },
    created() {
        this.getInfo()
    },
    methods: {
        handleChoose(id) {
            this.theme_color = id;
        },
        getInfo() {
            this.loading = true
            this.$api.shopApi.getTheme().then(res => {
                if (res.error == 0) {
                    this.theme_color = res.theme_color || 'default'
                }
            }).finally(() => {
                this.loading = false
            })
        },
        handleConfirm() {
            this.$Modal.confirm({
                title: '提示',
                content: '您将更换商城内全部页面的主题色,个性化装修页面的各组件颜色请自行调整,确定保存？',
                onOk: () => {
                    this.handleSave()
                },
                onCancel: () => { }
            })
        },
        handleSave() {
            this.loading = true
            this.$api.shopApi.setTheme({ theme_color: this.theme_color }).then(res => {
                if (res.error == 0) {
                    this.getInfo()
                    this.$Message.success('操作成功')
                }
            }).finally(() => {
                this.loading = false
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.theme-setting {
    margin-top: 20px;
    padding: 30px 40px;
    background-color: #ffffff;
    min-height: 100%;

    .theme {
        display: flex;

        &-color {
            height: 24px;
        }

        &-item {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
            border: 1px solid #e9edef;
            border-radius: 2px;
            padding: 10px 0;
            width: 70px;
            height: 70px;
            cursor: pointer;

            &.active {
                border: 1px solid #2d8cf0;
            }
        }

        &-text {
            margin-top: 10px;
            font-size: 12px;
            line-height: 16px;
        }

        .circle {
            position: relative;
            z-index: 1;
            display: inline-block;
            border-radius: 20px;
            width: 24px;
            height: 24px;
        }

        .subcolor {
            position: relative;
            z-index: 0;
            margin-left: -6px;
        }

        .theme-choose {
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
    .circle-box {
        display: flex;
        align-items: center;
        margin-top: 8px;

        .theme-color-tip {
            cursor: pointer;
        }

        .circle {
            display: inline-block;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            background: #8150f2;
        }

        .ml-20 {
            margin-left: 20px;
        }

        .text {
            margin-left: 4px;
            font-size: 14px;
            line-height: 20px;
            color: #000000;
        }
    }

    .preview {
        margin-top: 40px;
        display: flex;
        align-items: center;

        .preview-img {
            margin-right: 60px;
            width: 250px;
            height: 440px;
            img {
                display: block;
                height: 100%;
                width: 100%;
            }
        }
    }
}
</style>
