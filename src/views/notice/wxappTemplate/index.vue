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
        <div class="weixin-template-add">
            <Form ref="form" :label-width="120">
                <FormItem label="模板ID：">
                    <span>{{templateData.template_id}}</span>
                </FormItem>
                <FormItem label="模板名称：">
                    <span>{{templateData.title}}</span>
                </FormItem>
                <FormItem label="所属行业：">
                    <span>{{templateData.deputy_industry}}</span>
                </FormItem>
                <FormItem label="模板格式：">
                    <div class="template-content">{{templateData.content}}</div>
                </FormItem>
                <FormItem label="模板示例：">
                    <div class="template-content">{{templateData.example}}</div>
                </FormItem>
            </Form>
        </div>
        <!--<template #btn>
            <Button @click="handleCancel">返回列表</Button>
        </template>-->
    </kdx-content-bar>
</template>

<script>
    export default {
        components: {},
        props: {},
        data() {
            return {
                id: '',
                templateData: {}
            }
        },
        computed: {},
        created() {
        },
        mounted() {
            this.id = this.$route.query.id;
            this.getData()
        },
        methods: {
            getData() {
                this.$api.noticeApi.getWexinTemplateDetail({template_id: this.id}).then(res => {
                    this.templateData = res
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .weixin-template-add {
        padding: 40px;
        background-color: #FFFFFF;
        /*margin-top: 20px;*/
        min-height: 100%;
    }
    .template-content {
        white-space: pre-wrap;
    }
</style>
