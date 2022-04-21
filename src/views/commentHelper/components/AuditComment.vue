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
    <kdx-modal-frame :value="value" title="评价审核" @on-cancel="handleCancel" @on-ok="handleOk">
        <div class="content">
            <Form ref="form" :model="model" :label-width="140" @submit.native.prevent>
                <FormItem label="评价设置：">
                    <RadioGroup v-model="model.status">
                        <Radio :label="1" :disabled="noManagePerm">审核通过</Radio>
                        <Radio :label="-1" :disabled="noManagePerm">审核拒绝</Radio>
                        <Radio :label="0" disabled>审核中</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "AuditComment",
        components: {},
        props: {
            value: {
                type: Boolean,
                default: false
            },
            auditData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                model: {
                    status: 0
                }
            }
        },
        watch: {
            auditData: {
                handler(value) {
                    this.model = {...value}
                }
            }
        },
        computed: {
            noManagePerm(){ //无管理权限
                return !this.$getPermMap("order.comment.manage");
            },
        },
        created() {
        },
        mounted() {
        },
        methods: {
            handleCancel() {
                this.$emit('input', false)
            },
            handleOk() {
                this.$emit('handleOk', this.model);
                this.handleCancel();
            }
        },
    }
</script>

<style lang="scss" scoped>
    .content {
        padding: 20px 0 60px;
    }
</style>