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
    <div class="market-other-tool">
        <kdx-content-bar>
            <div class="label-content">
                <kdx-form-title>其他工具</kdx-form-title>
                <Form ref="form" :model="model" :label-width="140">
                    <FormItem label="关注回复：" class="r-form-item-checkbox">
                        <RadioGroup v-model="model.attention">
                            <Radio label="1">开启</Radio>
                            <Radio label="0">不开启</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="虚拟会员数：" prop="startUsing">
                        <Input v-model="model.vip_number" placeholder="请输入" class="width-160">
                        <span slot="append">人</span>
                        </Input>
                        <kdx-hint-text>会员数=虚拟会员数+真实关注数！</kdx-hint-text>
                    </FormItem>
                    <FormItem label="虚拟分销商数：" prop="startUsing">
                        <Input v-model="model.vip_number" placeholder="请输入" class="width-160">
                        <span slot="append">人</span>
                        </Input>
                        <kdx-hint-text>分销商数=虚拟分销商数+真实分销商数！</kdx-hint-text>
                    </FormItem>
                    <FormItem label="首次关注回复内容：" prop="title">
                        <Input v-model="model.first_content" type="textarea" rows="2" autosize class="width-430" placeholder="请输入" />
                    </FormItem>
                    <FormItem label="重新关注回复内容：" prop="title">
                        <Input v-model="model.next_content" type="textarea" rows="2" autosize class="width-430" placeholder="请输入" />
                    </FormItem>
                    <FormItem label="优惠券发放通知：" prop="name">
                        <Input type="text" v-model="model.inform" placeholder="排序" class="width-160" />
                        <kdx-hint-text>优惠券的发放或领取通知会优先使用客服消息发送图文消息，如果接收消息<br/>会员在48小时没有互动，则使用模板消息，其他消息默认优先客服消息</kdx-hint-text>
                    </FormItem>
                </Form>
            </div>
            <template #btn>
                    <Button class="primary-long" @click="handleSave">保存</Button>
                    <Button class="primary-long" @click="handleCancel">取消</Button>
            </template>
        </kdx-content-bar>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                model: {
                    attention: '',
                    vip_number: '',
                    first_content: '',
                    next_content: '',
                    inform: ''
                }
            };
        }
    };
</script>

<style scoped lang="scss">
    .market-other-tool {
        background-color: $background-color;
        height: 100%;
        .label-content {
            padding: 40px;
            background: #fff;
            margin: 20px auto 0;
            height: 100%;
        }
    }
</style>
