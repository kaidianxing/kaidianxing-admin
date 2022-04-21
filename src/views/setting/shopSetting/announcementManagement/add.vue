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
        <div class="content">
            <div class="title">
                <kdx-form-title>{{ formTitle }}</kdx-form-title>
            </div>
            <Form
                ref="form"
                :model="formData"
                :label-width="120"
                :rules="rules"
            >
                <FormItem label="公告排序" prop="sort_by">
                    <kdx-rr-input
                        placeholder="请输入"
                        class="width-340"
                        number
                        :fixed="0"
                        :maxValue="9999"
                        v-model="formData.sort_by"
                    />
                </FormItem>
                <FormItem label="公告标题" prop="title">
                    <Input
                        placeholder="请输入"
                        class="width-340"
                        v-model="formData.title"
                    />
                </FormItem>
                <FormItem label="公告状态" prop="status">
                    <RadioGroup v-model="formData.status">
                        <Radio label="1">
                            <span>显示</span>
                        </Radio>
                        <Radio label="0">
                            <span>隐藏</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="展示方式" prop="show_type">
                    <RadioGroup v-model="formData.show_type">
                        <Radio label="0">
                            <span>显示内容</span>
                        </Radio>
                        <Radio label="1">
                            <span>链接跳转</span>
                        </Radio>
                    </RadioGroup>
                    <div class="type-box" v-if="formData.show_type === '0'">
                        <FormItem label="" prop="detail">
                            <editor
                                v-model="formData.detail"
                                @input="contentInput"
                                :height="400"
                            ></editor>
                        </FormItem>
                    </div>
                    <div class="type-box" v-if="formData.show_type === '1'">
                        <FormItem label="" prop="link">
                            <i-input
                                placeholder="请填写以https://开头的有效链接"
                                class="width-430"
                                v-model="formData.link"
                            >
                                <Button slot="append" @click="show = true">
                                    选择链接
                                </Button>
                            </i-input>
                        </FormItem>
                    </div>
                </FormItem>
            </Form>
            <!--链接选择器-->
            <link-selector
                v-model="show"
                :current="formData.link"
                @on-cancel="handleCancel"
                @on-change="changeLink"
            />
        </div>
        <template #btn>
            <Button class="primary-long" :loading="submitLoading" @click="handleSave">
                保存
            </Button>
        </template>
        <slot></slot>
    </kdx-content-bar>
</template>

<script>
import Editor from '@/components/Editor'
import LinkSelector from '@/components/selector/LinkSelector'

export default {
    components: {
        Editor,
        LinkSelector,
    },
    data() {
        return {
            id: '', // 角色id
            formTitle: '',
            formData: {
                sort_by: '',
                title: '',
                status: '1',
                show_type: '0',
                detail: '',
                link: '',
            },
            rules: {
                sort_by: [{ required: true, message: '请填写公告排序' }],
                title: [{ required: true, message: '请填写公告标题' }],
                status: [{ required: true, message: '' }],
                show_type: [{ required: true, message: '' }],
                detail: [{ required: true, message: '请填写公告内容' }],
                link: [{ required: true, message: '请填写公告链接' }],
            },
            submitLoading: false,
            show: false,
        }
    },
    created() {
        if (this.$route.query.id) {
            // 编辑公告
            this.id = this.$route.query.id
            this.formTitle = '编辑公告'
            this.getNoticeDetail()
        } else {
            // 添加公告
            this.formTitle = '添加公告'
        }
    },
    methods: {
        // 获取公告详情
        getNoticeDetail() {
            this.$api.settingApi
                .getNoticeDetail({
                    id: this.id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        this.formData = {
                            ...this.formData,
                            sort_by: res.data.sort_by,
                            title: res.data.title,
                            status: res.data.status + '',
                            show_type: res.data.show_type + '',
                            detail: res.data.detail,
                            link: res.data.link,
                        }
                    }
                })
        },
        handleSave() {
            this.$refs['form'].validate().then((valid) => {
                if (valid) {
                    this.submitLoading = true
                    if (this.id) {
                        this.editSysNotice()
                    } else {
                        this.addNotice()
                    }
                }
            })
        },
        // 编辑公告
        editSysNotice() {
            let obj = {
                ...this.formData,
                detail:
                    this.formData.show_type === '0' ? this.formData.detail : '',
                link: this.formData.show_type === '1' ? this.formData.link : '',
                id: this.id,
            }
            this.$api.settingApi.editSysNotice({ ...obj }).then((res) => {
                this.submitLoading = false
                if (res.error == 0) {
                    this.$Message.success('保存成功')
                    this.$router.go(-1)
                }
            })
        },
        // 新增公告
        addNotice() {
            let obj = {
                ...this.formData,
                detail:
                    this.formData.show_type === '0' ? this.formData.detail : '',
                link: this.formData.show_type === '1' ? this.formData.link : '',
            }
            this.$api.settingApi.addNotice({ ...obj }).then((res) => {
                this.submitLoading = false
                if (res.error == 0) {
                    this.$Message.success('保存成功')
                    this.$router.go(-1)
                }
            })
        },
        // 关闭链接选择器
        handleCancel() {
            this.show = false
        },
        // 选择链接
        changeLink(val) {
            this.formData.link = val.url
            this.show = false
        },
        contentInput() {
            // if (this.formData.detail.trim() === '') {
            //     this.formData.detail = '公告内容'
            // }
        },
    },
}
</script>

<style scoped lang="scss">
.content {
    padding: 40px;
    background: #fff;
    min-height: 100%;
    margin: 20px auto 0;
    .type-box {
        padding-top: 10px;
    }
}
</style>
