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
        <div class="other-settings">
            <Form class='container' :label-width='120'>
                <kdx-form-title content="协议信息">
                    <kdx-hint-tooltip type="image" :image="require('@/assets/image/example/fx_protocol.png')"></kdx-hint-tooltip>
                </kdx-form-title>
                <FormItem label="协议标题：" prop="category_id">
                    <Input style='width:340px' :disabled='noManagePerm' v-model='settings.agreement_title' maxlength="5" show-word-limit></Input>
                </FormItem>
                <FormItem label="协议内容：" prop="category_id">
                    <editor :height="667" v-model='settings.agreement_content'></editor>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :disabled='noManagePerm' @click="save">保存</Button>
            <!-- <Button class="default-long" @click="cancel">取消</Button> -->
        </template>
    </kdx-content-bar>
</template>

<script>
    import Editor from "@/components/Editor";
    import {
        mapState,
        mapActions
    } from 'vuex'
    export default {
        components: {
            Editor
        },
        data() {
            return {
                value: 'style',
                levels: [{
                    label: '一级：',
                    prop: 'level_name_1'
                }, {
                    label: '二级：',
                    prop: 'level_name_2'
                }, {
                    label: '三级：',
                    prop: 'level_name_3'
                }, ]
            }
        },
        computed: {
            ...mapState('commission/otherSettings', {
                settings: state => state.settings,
            }),
            noManagePerm() { //管理权限
                return !this.$getPermMap('commission.settings.other.manage')
            },
        },
        methods: {
            ...mapActions('commission/otherSettings', ['getSettings', 'editSettings']),
            save() {
                this.editSettings().then(res => {
                    if (res.error == 0) {
                        this.$Message.success('修改成功');
                    }
                })
            },
            cancel() {
                this.$router.go(-1)
            }
        },
        beforeMount() {
            this.getSettings();
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/components/common.scss';
    .other-settings {
        min-height: 100%;
        background-color: #ffffff;
    }
    .container {
        width: 100%;
        padding: 10px 40px;
        height: 100%;
    }
</style>
