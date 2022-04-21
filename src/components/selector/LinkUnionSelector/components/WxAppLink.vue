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
    <div class="app-content">
        <kdx-hint-alert
            >提示：此功能仅支持小程序之间的跳转，不支持从其他渠道跳转小程序。</kdx-hint-alert>
        <Form :label-width="120" :rules="rules" :model="model" class="app-form">
            <form-item label="小程序APP ID：" prop="wxappid">
                <div class="flex input-box">
                    <Input
                        style="width:370px;"
                        v-model="model.name"
                        type="text"
                        @on-focus="focusHandler"
                        @on-change="inputHandler"
                         @on-blur="blurHandler"
                    />
                    <div class="choose-btn" @click="openChoose">选择</div>
                    <div
                        v-if="showChoose"
                        class="ivu-select-dropdown ivu-select-dropdown-transfer"
                        x-placement="bottom-start"
                    >
                        <ul
                            class="ivu-select-not-found"
                            v-if="applist.list == 0"
                        >
                            <li>无匹配数据</li>
                        </ul>
                        <ul class="ivu-select-dropdown-list" v-else>
                            <!---->
                            <li
                                v-for="(app, index) in applist"
                                @click="changeHandler(app)"
                                :key="index"
                                class="ivu-select-item"
                            >
                                {{ app.name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <kdx-hint-text>
                    <span
                        >跳转其他小程序功能，需先配置可跳转的小程序名单。
                        可在“</span
                    ><Button type="text" to="/channel/config/wx" target="_blank"
                        >渠道——小程序——编辑</Button
                    ><span>”中配置。</span>
                </kdx-hint-text>
            </form-item>
            <form-item label="小程序路径：">
                <Input
                    type="text"
                    class="width-430"
                    v-model="model.url"
                    @on-blur="blurHandler"
                />
            </form-item>
        </Form>
    </div>
</template>
<script>
export default {
    props: {
        current: {
            type: Object,
            default: () => {},
        },
    },
    mounted() {
        this.getAppList();
    },
    data() {
        return {
            rules: {
                wxappid: [{ required: true, message: "请选择APP ID" }],
            },
            model: {
                wxappid: "",
                name: "",
                url: "",
            },
            applist: [],
            showChoose: false
        };
    },
    methods: {
        getAppList() {
            this.$api.shopApi.getAppToList().then((res) => {
                if (res) {
                    this.applist = res.list;
                }
            });
        },
        focusHandler(){
            this.showChoose = false
        },
        openChoose(){
            this.showChoose = !this.showChoose
        },
        changeHandler({ name, appid }) {
            this.model.name = name;
            this.model.wxappid = appid;
            this.showChoose = false
            this.blurHandler()
        },
        inputHandler(e){
            this.model.name = e.target.value;
            this.model.wxappid = e.target.value;
        },
        blurHandler() {
            let { url, name, wxappid } = this.model;
            this.$emit("on-change", {
                url: "wxapp:" + url,
                name,
                wxappid,
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.app-content {
    padding: 10px 20px 0;

    .app-form {
        margin-top: 40px;

        .input-box {
            position: relative;

            .ivu-select-dropdown {
                z-index: 1265;
                min-width: 430px;
                position: absolute;
                will-change: top, left;
                transform-origin: center top;
                top: 38px;
                left: 0;
            }
        }

        .choose-btn {
            user-select: none;
            border: 1px solid #e9edef;
            border-left: 0;
            box-sizing: border-box;
            border-radius: 0px 2px 2px 0px;
            width: 58px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            color: #2d8cf0;
            cursor: pointer;
        }
    }
}
</style>
