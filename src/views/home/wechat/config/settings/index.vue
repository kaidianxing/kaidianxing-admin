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
        <div class="wechat-config-settings">
            <div class="create-header">
                <Steps :current="step">
                    <Step title="设置公众号信息"></Step>
                    <Step title="公众号设置引导"></Step>
                </Steps>
            </div>
            <div class="line"></div>
            <div class="create-content">
                <base-info ref="base_info" v-show="step === 0" @on-change="changeInfo"></base-info>
                <setting-guide v-if="step === 1" :info="baseInfo"></setting-guide>
            </div>
        </div>
        <template #btn>
            <Button class="default-long" @click="handleBack">返回</Button>
            <Button class="default-long" @click="handlePrev" v-show="step === 1">上一步</Button>
            <Button class="primary-long" @click="handleNext" v-show="step === 0">下一步</Button>
            <Button class="primary-long" @click="handleSave" v-show="step === 1">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
import BaseInfo from "./components/BaseInfo";
import SettingGuide from "./components/SettingGuide";
export default {
    name: "index",
    components: {
        BaseInfo,
        SettingGuide
    },
    data() {
        return {
            step: 0,
            baseInfo: null,
        };
    },
    methods: {
        async handleNext() {
            await this.$refs['base_info'].validate();
            this.$refs['base_info'].save();
        },
        changeInfo(info) {
            this.baseInfo = info;
            this.step = 1;
        },
        handlePrev() {
            this.step = 0;
        },
        handleBack() {
            this.$router.go(-1);
        },
        handleSave() {
            this.handleBack();
        }
    }
};
</script>

<style scoped lang="scss">
.wechat-config-settings {
    background-color: #ffffff;
    min-height: 100%;
    .create-header {
        padding: 25px;
        .ivu-steps {
            width: 600px;
            margin: 0 auto;
        }
    }
    .line {
        height: 10px;
        background-color: $background-color;
    }
    .create-content {
        padding: 40px;
    }
}
</style>
