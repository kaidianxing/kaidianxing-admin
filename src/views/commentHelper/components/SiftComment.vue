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
    <kdx-modal-frame :value="value" title="精选评价设置" @on-cancel="handleCancel" @on-ok="handleOk">
        <div class="content">
            <kdx-hint-alert class="alert">您将为本条评价设置为精选评价，设置权重后用户端优先展示精选评价内容</kdx-hint-alert>
            <Form ref="form" :model="model" :label-width="140" @submit.native.prevent>
                <FormItem label="评价设置：">
                    <RadioGroup v-model="model.is_choice">
                        <Radio :label="1" :disabled="noManagePerm">精选评价</Radio>
                        <Radio :label="0" :disabled="noManagePerm">普通评价</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="权重值：" v-if="model.is_choice==1">
                    <kdx-rr-input v-model="model.sort_by" placeholder="请输入" number :fixed="0" :minValue="1" :maxValue="9999" class="width-250" :disabled="noManagePerm"></kdx-rr-input>
                    <kdx-hint-text>最高9999, 数字越大, 排名越靠前</kdx-hint-text>
                </FormItem>
            </Form>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "SiftComment",
        components: {},
        props: {
            value: {
                type: Boolean,
                default: false
            },
            siftData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                model: {
                    sort_by: '',
                    is_choice: 0,
                    id: ''
                },
                setData: {
                    choice_status: 1, // 精选
                    comment_reward_status: 1, // 奖励
                }, // 设置权限
            }
        },
        watch: {
            siftData: {
                handler(value) {
                    this.model = {...value}
                }
            }
        },
        computed: {
            noManagePerm(){ //无管理权限
                return !this.$getPermMap('commentHelper.index.manage') || this.setData.choice_status == 0
            },
        },
        created() {
            this.getSet()
        },
        mounted() {
        },
        methods: {
            getSet() {
                this.$api.commentHelperApi.getSetting({}).then(res => {
                    if (res.error === 0) {
                        this.setData = {
                            choice_status: +res.data.choice_status,
                            comment_reward_status: +res.data?.comment_reward_status
                        }
                    }
                })
            },
            handleCancel() {
                this.$emit('input', false)
            },
            handleOk() {
                let params = {
                    ...this.model
                };
                if (params.is_choice === 0) {
                    delete params.sort_by
                }
                this.$emit('handleOk', params);
                this.handleCancel();
            }
        },
    }
</script>

<style lang="scss" scoped>
    .content {
        padding-top: 10px;
        height: 300px;
        .alert {
            margin: 0 20px 30px;
        }
    }
</style>