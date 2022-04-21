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
    <div class="market-other-setting">
        <kdx-content-bar :loading="loading">
            <div class="label-content">
                <kdx-form-title>优惠券统一说明</kdx-form-title>
                <Form ref="form" :model="model" :label-width="130">
                    <FormItem label="优惠券使用说明：">
                        <!--富文本编辑器-->
                        <editor v-model="model.use_content" :height="667"></editor>
                        <kdx-hint-text>统一说明会放到购物券单独说明的前面</kdx-hint-text>
                    </FormItem>
<!--                    <FormItem label="购物券推送模板：" prop="template" class="r-form-item-checkbox">-->
<!--                        <RadioGroup v-model="model.template">-->
<!--                            <Radio label="0">模板1</Radio>-->
<!--                            <Radio label="1">模板2(默认)</Radio>-->
<!--                        </RadioGroup>-->
<!--                    </FormItem>-->
<!--                    <FormItem label="优惠券发放通知：" prop="template_id">-->
<!--                        <template #label>-->
<!--                            <p>优惠券发放通知：</p>-->
<!--                            <p>(业务处理通知）&ensp;</p>-->
<!--                        </template>-->
<!--                        <Input type="textarea" v-model="model.template_id" placeholder="排序" class="width-160"/>-->
<!--                        <kdx-hint-text>公众平台模板消息编号: OPENTM415477060（同分销业务处理通知一个模板id）</kdx-hint-text>-->
<!--                        <kdx-hint-text>优惠券的发放或领取通知会优先使用客服消息发送图文消息，如果接收消息会员在48小时没有互动，则使用模板消息，其他消息默认优先客服消息</kdx-hint-text>-->
<!--                    </FormItem>-->
                </Form>
            </div>
            <template #btn>
                <Button class="primary-long" :disabled='noManagePerm' @click="handleSave">保存</Button>
            </template>
        </kdx-content-bar>
    </div>
</template>

<script>
    import Editor from "@/components/Editor";
    export default {
        name: "index",
        components: {
            Editor
        },
        data() {
            return {
                model: {
                    use_content: '',
                    // template: '1',
                    // template_id: ''
                },
                loading: false
            };
        },
        computed: {
            noManagePerm() { //管理权限
                return !this.$getPermMap('sale.coupon-set.manage')
            },
        },
        methods: {
            getData() {
                this.loading = true;
                this.resetModel();
                this.$api.marketApi.getOtherSetting()
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.model = res;
                            delete this.model.error;
                        }
                    });
            },
            handleSave() {
                this.loading = true;
                this.$api.marketApi.saveOtherSetting(this.model)
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.$Message.success('其他设置保存成功');
                            this.getData();
                        }
                    });
            },
            resetModel() {
                this.model = {
                    use_content: '',
                    // template: '',
                    // template_id: ''
                };
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped lang="scss">
    .market-other-setting {
        background-color: $background-color;
        height: 100%;
        .label-content {
            padding: 40px;
            background:#fff;
            margin:20px auto 0;
        }
    }
</style>
