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
    <kdx-content-bar :loading="loading">
        <div class="accessory-setting">
            <kdx-form-title>附件设置</kdx-form-title>
            <Form ref="form" :model="model" :rules="rules" :label-width="120">
                <FormItem
                    label="图片类型："
                    prop="imageType"
                    class="r-form-item-checkbox"
                >
                    <CheckboxGroup v-model="model.imageType">
                        <Checkbox
                            v-for="item in optionType.image"
                            :key="item"
                            :label="item"
                        >{{ item }}</Checkbox
                        >
                    </CheckboxGroup>
                    <kdx-hint-text
                    >仅支持{{ optionType.image.join('、') }}</kdx-hint-text>
                </FormItem>
                <FormItem label="图片大小限制：" prop="imageSize">
                    <Input v-model="model.imageSize" class="width-160">
                        <span slot="append">KB</span>
                    </Input>
                    <kdx-hint-text>默认为 10240KB</kdx-hint-text>
                </FormItem>
                <FormItem
                    label="图片压缩："
                    prop="imageCompress"
                    class="r-form-item-checkbox"
                >
                    <RadioGroup v-model="model.imageCompress">
                        <Radio :label="1">开启</Radio>
                        <Radio :label="0">关闭</Radio>
                    </RadioGroup>
                    <template v-if="model.imageCompress === 1">
                        <Input
                            v-model="model.imageCompressWidth"
                            class="width-160"
                        >
                            <span slot="append">PX</span>
                        </Input>
                    </template>
                    <kdx-hint-text>手机端图片是否开启压缩</kdx-hint-text>
                </FormItem>
                <FormItem
                    label="音频类型："
                    prop="audioType"
                    class="r-form-item-checkbox"
                >
                    <CheckboxGroup v-model="model.audioType">
                        <Checkbox
                            v-for="item in optionType.audio"
                            :key="item"
                            :label="item"
                        >{{ item }}</Checkbox
                        >
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="音频大小限制：" prop="audioSize">
                    <Input v-model="model.audioSize" class="width-160">
                        <span slot="append">KB</span>
                    </Input>
                    <kdx-hint-text>默认为 20480KB</kdx-hint-text>
                </FormItem>
                <FormItem
                    label="视频类型："
                    prop="videoType"
                    class="r-form-item-checkbox"
                >
                    <CheckboxGroup v-model="model.videoType">
                        <Checkbox
                            v-for="item in optionType.video"
                            :key="item"
                            :label="item"
                        >{{ item }}</Checkbox
                        >
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="视频大小限制：" prop="videoSize">
                    <Input v-model="model.videoSize" class="width-160">
                        <span slot="append">KB</span>
                    </Input>
                    <kdx-hint-text>默认为 10240KB</kdx-hint-text>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">提交</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
// import { getAccessorySetting, setAccessorySetting } from '@/api/systemSetting'
export default {
    data() {
        return {
            model: {
                imageType: [],
                imageSize: '',
                imageCompress: 1,
                imageCompressWidth: '',
                videoType: [],
                videoSize: '',
                audioType: [],
                audioSize: '',
            },
            rules: {
                imageType: [
                    { required: true, type: 'array', message: '图片类型必填' },
                ],
                audioType: [
                    { required: true, type: 'array', message: '音频类型必填' },
                ],
                videoType: [
                    { required: true, type: 'array', message: '视频类型必填' },
                ],
            },
            optionType: {
                usable_type: [],
                image: [],
                video: [],
            },
            loading: false,
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            this.$api.systemApi.getAccessorySetting().then((res) => {
                let { error, settings, usable_type } = res
                if (error === 0) {
                    this.optionType = usable_type
                    let { image, video, audio } = settings
                    this.model = {
                        imageType: image?.extensions || [],
                        imageSize: image?.max_size,
                        imageCompress: image?.compress,
                        imageCompressWidth: image?.compress_width,
                        videoType: video.extensions,
                        videoSize: video.max_size,
                        audioType: audio.extensions,
                        audioSize: audio.max_size,
                    }
                }
            })
        },
        handleSave() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let image = {
                            max_size: this.model.imageSize,
                            extensions: this.model.imageType,
                            compress: this.model.imageCompress,
                            compress_width: this.model.imageCompressWidth,
                        },
                        video = {
                            max_size: this.model.videoSize,
                            extensions: this.model.videoType,
                        },
                        audio = {
                            max_size: this.model.audioSize,
                            extensions: this.model.audioType,
                        }
                    let params = { image, video, audio }
                    this.$api.systemApi.setAccessorySetting(params).then((res) => {
                        if (res.error === 0) {
                            this.$Message.success('附件设置保存成功')
                            this.getData()
                        }
                    })
                }
            })
        },
        resetModel() {
            this.model = {}
        },
    },
}
</script>

<style scoped lang="scss">
.accessory-setting {
    min-height: 100%;
    margin-top: 20px;
    background: #FFFFFF;
    padding: 40px;
    /deep/ .ivu-form {
        .ivu-form-item-label {
            padding-right: 10px !important;
        }
    }
}
</style>
