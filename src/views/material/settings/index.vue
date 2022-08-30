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
    <kdx-content-bar :loading="loading">
        <br/>
        <kdx-hint-alert>
            <div>朋友圈推广入口，仅支持在小程序端一键保存图文，需要您到微信小程序后台配置下载域名，方法如下：</div>
            <div>1.咨询您的商城服务商，到管理端后台获取【系统设置】-【远程存储】下的访问url</div>
            <div>2.若您的存储方式“本地存储”，则使用您业务端后台主域名进行操作</div>
            <div>3.进入微信第三方平台，修改您的平台信息，在【开发资料】中找到【小程序服务器域名】项，将该url填入并保存</div>
            <div>4.然后进入微信小程序的后台，进入【开发】-【开发设置】-【配置服务器信息】</div>
            <div>5.找到【downloadFile合法域名】项，将该url填入并保存</div>
            <div>6.至此，您的朋友圈素材才可支持图片下载</div>
        </kdx-hint-alert>
        <div class="settings">
            <kdx-form-title>基础设置</kdx-form-title>
            <Form ref="form" :model="model" :label-width="120" :rules="rule"  @submit.native.prevent>
                <FormItem label="一键发圈：" class="r-form-item-checkbox" prop="status">
                    <RadioGroup v-model="model.status">
                        <Radio label="1">开启</Radio>
                        <Radio label="0">关闭</Radio>
                    </RadioGroup>
                    <kdx-hint-text>
                        全场商品的朋友圈素材将自动读取系统默认文案和商品主图、轮播图，可在【素材管理】中为特定商品定制推广文案和图片
                    </kdx-hint-text>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :disabled="noManagePerm" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            model: {
                status: "1",
            },
            rule: {
                status: [{ required: true, message: "请选择是否开启朋友圈推广" }],
            },
        };
    },
    created() {
        this.getData();
    },
    computed: {
        noManagePerm() {
            return !this.$getPermMap('material.setting.manage')
        },
    },
    methods: {
        getData() {
            this.loading = true;
            this.$api.materialApi.getMaterialSetting().then((res) => {
                if (res.error === 0) {
                    this.model = {
                        ...res.data
                    }
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        handleSave() {
            this.loading = true;
            this.$refs['form'].validate(valid => {
                if (valid) {
                    let params = {
                        ...this.model
                    };
                    this.$api.materialApi.setMaterialSetting(params).then(res => {
                        if (res.error === 0) {
                            this.$Message.success('操作成功');
                        }
                    });
                }
            }).finally(() => {
                this.loading = false;
            });
        },
    },
};
</script>
<style lang='scss' scoped>
.settings {
    margin-top: 10px;
    padding: 40px;
    background: #fff;
    height: calc(100% - 214px);
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
</style>
