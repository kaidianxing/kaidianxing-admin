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
        <div class="channel-register">
            <kdx-hint-alert style="margin-bottom: 20px"
                >由于微信接口延迟，菜单修改后最长可能需要30分钟才会更新。如需即时查看，可先取消关注，再重新关注。</kdx-hint-alert
            >
            <kdx-form-title>基本信息</kdx-form-title>
            <Form
                :label-width="95"
                :model="publicName"
                :rules="rules"
                ref="pform"
            >
                <FormItem label="菜单名称：" prop="name">
                    <Input
                        v-model="publicName.name"
                        class="width-340"
                        maxlength="12"
                        placeholder="请输入菜单名称"
                    />
                </FormItem>
            </Form>
            <div class="mwrap">
                <mobile-dev />
                <form-mu :parentRf="rf" />
            </div>
        </div>
    </kdx-content-bar>
</template>
<script>
import MobileDev from "../components/mobileDev";
import FormMu from "../components/form";
import DataSourceOption from "../components/data";

export default {
    created() {
        DataSourceOption.regComponent(this);
        DataSourceOption.publicName.name = "";
        if (!this.$route.query.id) {
            DataSourceOption.resetData();
        }
    },
    mounted() {
        this.rf = this.$refs["pform"];
    },
    data() {
        return {
            rf: null,
            publicName: DataSourceOption.publicName,
            rules: {
                name: [
                    { required: true, message: "请输入菜单名称" },
                    // {
                    //   validator: (filed, value, callback) => {

                    //     if (
                    //       value.length > 12 ||
                    //       value.match(/[A-z0-9]/g)?.length > 8 ||
                    //       value.match(/[\u4e00-\u9fa5]/g)?.length > 4
                    //     ) {
                    //       callback(new Error("字数不超过4个汉字或8个字母"));
                    //     } else {
                    //       callback();
                    //     }
                    //   },
                    //   message: "字数不超过4个汉字或8个字母",
                    //   trigger: "blur",
                    // },
                ],
            },
        };
    },
    components: {
        MobileDev,
        FormMu,
    },
};
</script>
<style scoped lang="scss">
.channel-register {
    padding: 40px 40px 0 40px;
    background: #fff;
    min-height: 100%;
    margin: 20px auto 0;
    .mwrap {
        display: flex;
    }
}
</style>
