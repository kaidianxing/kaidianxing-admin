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
            <kdx-form-title>
                <span>商城分享设置</span>
                <kdx-hint-tooltip
                    style="margin-left:0px;line-height:1"
                    type="image"
                    :image="require('@/assets/image/example/share_img.png')"
                ></kdx-hint-tooltip>
            </kdx-form-title>
            <Form ref="form" :model="formValidate" :label-width="140" :rules="rules">
                <FormItem label="分享标题：" prop="title_type">
                    <div class="flex-column">
                        <RadioGroup v-model="formValidate.title_type">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>商城名称</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="2">
                                <span>自定义名称</span>
                            </Radio>
                        </RadioGroup>
                        <Input :disabled='noManagePerm'
                            placeholder="请输入自定义名称"
                            class="mall-name"
                            v-model="formValidate.title"
                            v-if="formValidate.title_type==2"
                        ></Input>
                    </div>
                </FormItem>
                <FormItem label="分享图标：" prop="logo_type">
                    <RadioGroup v-model="formValidate.logo_type">
                        <Radio :disabled='noManagePerm' label="1">
                            <span>商城LOGO</span>
                        </Radio>
                        <Radio :disabled='noManagePerm' label="2">
                            <span>自定义图标</span>
                        </Radio>
                    </RadioGroup>

                    <div v-if="formValidate.logo_type==2" class="img-box">
                        <kdx-image-video
                            type="image"
                            @on-change="changeThumb"
                            :current="formValidate.logo"
                        ></kdx-image-video>
                        <kdx-hint-text>建议尺寸800*800像素</kdx-hint-text>
                    </div>
                </FormItem>
                <FormItem label="分享描述：" prop="share_description_type">
                    <RadioGroup v-model="formValidate.share_description_type">
                        <Radio :disabled='noManagePerm' label="1">
                            <span>商城默认描述</span>
                        </Radio>
                        <Radio :disabled='noManagePerm' label="2">
                            <span>自定义描述</span>
                        </Radio>
                    </RadioGroup>
                    <div class="flex custom-input">
                        <Input :disabled='noManagePerm'
                            placeholder="请输入商城描述"
                            type="textarea"
                            class="desc-input"
                            :autosize="{minRows: 2}"
                            v-model="formValidate.share_description"
                            v-if="formValidate.share_description_type==2"
                        ></Input>
                    </div>
                </FormItem>
                <FormItem label="分享链接：" prop="link_type">
                    <div class="flex-column">
                        <RadioGroup v-model="formValidate.link_type">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>默认商城首页</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="2">
                                <span>自定义跳转链接</span>
                            </Radio>
                        </RadioGroup>
                        <div class="flex custom-input">
                            <Input :disabled='noManagePerm'
                                placeholder="请选择链接"
                                class="share-input"
                                v-model="formValidate.link"
                                enter-button="选择链接"
                                readonly
                                search
                                @on-search="search"
                                v-if="formValidate.link_type==2"
                            ></Input>
                        </div>
                    </div>
                </FormItem>
            </Form>
        </div>
        <!--链接选择器-->
        <link-selector
            v-model="show"
            :current="{url:formValidate.link}"
            @on-cancel="handleCancel"
            @on-change="changeLink"
        ></link-selector>
        <template #btn>
            <Button :disabled='noManagePerm' class="primary-long" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
import LinkSelector from '@/components/selector/LinkSelector'
export default {
    name: 'index',
    components: {
        LinkSelector
    },

    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('sysset.mall.share.manage')
        },
    },
    data() {
        const message = {
            title: '请输入自定义名称',
            logo: '请上传自定义图标',
            share_description: '请输入分享描述',
            link: '请选择链接'
        }
        const validator = ({ field }, key, callback) => {
            if (!this.isSubmit) return callback()
            const property = field.replace('_type', '')
            if (
                this.formValidate[field] === '2' &&
                this.formValidate[property].trim() === ''
            ) {
                callback(new Error(message[property]))
            } else {
                callback()
            }
        }
        return {
            formValidate: {
                title_type: '1',
                title: '',
                logo_type: '1',
                logo: '',
                link_type: '1',
                link: '',
                share_description_type: '1',
                share_description: ''
            },
            rules: {
                title_type: [
                    {
                        required: true,
                        validator
                    }
                ],
                logo_type: [
                    {
                        required: true,
                        validator
                    }
                ],
                share_description_type: [
                    {
                        required: true,
                        validator
                    }
                ],
                link_type: [
                    {
                        required: true,
                        validator
                    }
                ]
            },
            show: false,
            isSubmit: false
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        changeThumb(path) {
            this.formValidate.logo = path
        },
        getData() {
            this.$api.settingApi.getShareSetting().then(res => {
                if (res.error === 0) {
                    delete res.error
                    this.formValidate = { ...this.formValidate, ...res }
                }
            })
        },
        handleSave() {
            this.isSubmit = true
            this.$refs.form
                .validate(valid => {
                    if (valid) {
                        let obj = {
                            ...this.formValidate
                        }
                        this.$api.settingApi
                            .editShareSetting({ ...obj })
                            .then(res => {
                                if (res.error == 0) {
                                    this.getData()
                                    this.$Message.success('保存成功')
                                }
                            })
                    }
                })
                .finally(() => {
                    this.isSubmit = false
                })
        },
        search() {
            this.show = true
        },
        handleCancel() {
            this.show = false
        },
        changeLink({ url }) {
            this.formValidate.link = url
        }
    }
}
</script>

<style scoped lang="scss">
.content {
    padding: 40px;
    background: #fff;
    min-height: 100%;
    margin-top: 20px;
    .flex-row {
        display: flex;
        flex-direction: row;
    }
    .mall-name {
        width: 300px;
        margin-top: 10px;
    }
    .custom-input {
        margin-top: 10px;
        line-height: 32px;
    }
    .img-box {
        margin-top: 20px;
    }
    .desc-input {
        width: 500px;
    }
    .share-input {
        width: 400px;
    }
}
</style>
