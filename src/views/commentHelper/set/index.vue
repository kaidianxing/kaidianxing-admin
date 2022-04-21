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
    <div class="set-index">
        <div class="set-data">
            <div class="content">
                <Form ref="form" :model="model" :rules="rules" :label-width="165">
                    <kdx-form-title>基础设置</kdx-form-title>
                    <kdx-hint-alert class="hint-alert" :showIcon="true">
                        <div class="hint-alert-content">
                            <div class="text">提示：评价助手需要申请接口，配置完成后才可以进行使用。只有通过该页面的专属通道申请的接口才可正常使用。</div>
                            <a class="apply" href="https://www.99api.com/Login?log=5&referee=2903" target="_blank">立即申请</a>
                            <kdx-hint-tooltip type="image" :maxWidth="690" width="650px"
                                          :image="require('@/assets/image/recharge/api_key.png')"></kdx-hint-tooltip>
                        </div>
                    </kdx-hint-alert>
                    <br>
                    <FormItem label="接口apikey：" prop="api_key">
                        <Input v-model="model.api_key" placeholder="接口apikey" class="width-430"/>
                    </FormItem>
                    <FormItem class="r-form-item-checkbox" label="精选评价：">
                        <RadioGroup v-model="model.choice_status">
                            <Radio :label="1" :disabled="noManagePerm">开启</Radio>
                            <Radio :label="0" :disabled="noManagePerm">关闭</Radio>
                        </RadioGroup>
                        <kdx-hint-text>开启后在评价库内可对商品的每条评价进行权重设置，控制评价展示的排序</kdx-hint-text>
                    </FormItem>
                    <FormItem class="r-form-item-checkbox" label="评价奖励：">
                        <RadioGroup v-model="model.comment_reward_status">
                            <Radio :label="1" :disabled="noManagePerm">开启</Radio>
                            <Radio :label="0" :disabled="noManagePerm">关闭</Radio>
                        </RadioGroup>
                        <kdx-hint-text>开启后在每条客户评价的审核页面内可对该评价会员进行奖励发放，只能发放一次，奖励发放后自动到账</kdx-hint-text>
                    </FormItem>


                </Form>
            </div>
        </div>
     <slot></slot>
    </div>
        <template #btn>
            <Button class="primary-long" :loading="submitLoading" :disabled="noManagePerm" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>

</template>

<script>


    export default {
        name: "index",

        props: {},
        data() {
            return {
                submitLoading: false,
                model: {
                    choice_status: 0,
                    comment_reward_status: '',
                    api_key:''
                },
                table: {
                    data: [],
                    total: 0,
                    loading: false
                },
                page: {
                    pageSize: 10,
                    pageNumber: 1,
                },
                rules: {
                    api_key: [
                        {required: true, message: '接口apikey必填'}
                    ]
                }
            }
        },
        computed: {
            noManagePerm() {
                return !this.$getPermMap('commentHelper.setting.manage')
            }
        },
        created() {
            this.getSet();
        },
        methods: {
            getSet() {
                this.$api.commentHelperApi.getSetting({}).then(res => {
                    if (res.error === 0) {
                        console.log(res)
                        this.model = {
                            choice_status: +res.data.choice_status || '',
                            comment_reward_status: +res.data?.comment_reward_status || '',
                            api_key: res.data?.api_key || ''
                        }
                    }
                })
            },
            handleSave() {
                this.$refs['form'].validate((valid => {
                    if (valid) {
                        this.submitLoading = true;
                        this.$api.commentHelperApi.setSetting({...this.model}).then(res => {
                            if (res.error == 0) {
                                this.getSet();
                                this.$Message.success('保存成功')
                            }
                            this.submitLoading = false;
                        })
                    }
                }));
            },
        },
    }
</script>

<style lang="scss" scoped>
    .set-index {
        min-height: 100%;
        padding-top: 20px;
        .residue-package {
            margin-bottom: 34px;
        }
    }
    .hint-alert {
        margin-top: 10px;
        margin-bottom: 10px;

        .hint-alert-content {
            display: flex;
            align-items: center;
        }
    }
    .set-data {
        margin-bottom: 10px;
        .content {
            background-color: #fff;
            padding: 40px 40px 30px;
            margin: 0 auto;
            border-radius: 2px;
        }
        .footer-btn {
            flex: 0;
            border-top: 1px solid $border-color;
            padding: 16px 0 16px 160px; // border-top: 1px solid $border-color;
            box-sizing: border-box;
            bottom: 0;
            /*width: 100%;*/
            border-radius: 2px;
            background-color: #FFFFFF;
            z-index: 10;
            >.ivu-btn {
                margin-right: 20px;
            }
        }
    }
</style>
