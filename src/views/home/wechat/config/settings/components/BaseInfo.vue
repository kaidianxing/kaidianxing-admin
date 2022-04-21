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
    <div class="settings-base-info">
        <kdx-form-title>
            设置公众号信息
        </kdx-form-title>
        <Form ref="form" :model="model" :rules="rules" :label-width="120">
            <FormItem label="公众号名称：" prop="name">
                <Input v-model="model.name" placeholder="请输入公众号名称" class="width-250"/>
            </FormItem>
            <FormItem label="公众号类型：" prop="type">
                <Select v-model="model.type" class="width-250">
                    <Option v-for="item in typeList" :key="item.key" :value="item.key">{{ item.value }}</Option>
                </Select>
                <kdx-hint-text>注意:即使公众平台显示为“未认证”, 但只要【公众号设置】/【账号详情】下【认证情况】显示资质审核通过,
                    即可认定为认证号
                </kdx-hint-text>
            </FormItem>
            <FormItem label="AppID：" prop="app_id">
                <Input v-model="model.app_id" :disabled="type === 'edit'" placeholder="请输入微信公众平台的AppID" class="width-250"/>
            </FormItem>
            <FormItem label="AppSecret：" prop="secret">
                <Input v-model="model.secret" placeholder="请输入微信公众平台的AppSecret" class="width-250"/>
            </FormItem>
            <FormItem label="LOGO：" prop="logo">
                <kdx-image-video :current="model.logo" @on-change="changeImage($event, 'logo')"></kdx-image-video>
                <kdx-hint-text>建议尺寸：200X200px</kdx-hint-text>
            </FormItem>
            <FormItem label="二维码：" prop="qr_code">
                <kdx-image-video :current="model.qr_code" @on-change="changeImage($event, 'qr_code')"></kdx-image-video>
                <kdx-hint-text>建议尺寸：200X200px</kdx-hint-text>
            </FormItem>
            <FormItem label="上传验证文件：" prop="file">
                <input ref="file_input" type="file" style="display: none" @change="changeFile">
                <Input :value="model.fileName" disabled class="width-250">
                    <span slot="append" @click="selectFile">选择文件</span>
                </Input>
                <kdx-hint-text>设置JS接口安全域名，需要上传的文件。</kdx-hint-text>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import {uploadFile} from "@/api/config/fileRequest";
import {homeApi} from "@/api/home";

const paramskey = ['name', 'type', 'app_id', 'secret', 'logo', 'qr_code', 'file'];

export default {
    name: "BaseInfo",
    data() {
        return {
            model: {
                name: '',
                type: '',
                app_id: '',
                secret: '',
                logo: '',
                qr_code: '',
                file: '',
                fileName: ''
            },
            rules: {
                name: [
                    {required: true, message: '公众号名称必填'}
                ],
                type: [
                    {required: true, message: '公众号类型必填'}
                ],
                app_id: [
                    {required: true, message: 'AppID必填'}
                ],
                secret: [
                    {required: true, message: 'AppSecret必填'}
                ],
                logo: [
                    {required: true, message: 'logo必填'}
                ],
                qr_code: [
                    {required: true, message: '二维码必填'}
                ],
                // file: [
                //     {required: true, message: '校验文件必填'}
                // ]
            },
            typeList: [
                {
                    key: 10,
                    name: '未认证订阅号'
                }
            ],
            type: 'create'
        };
    },
    created() {
        this.type = this.$route.query.type || 'create';
        this.getWechatType();
        this.type === 'edit' && this.getData();
    },
    methods: {
        selectFile() {
            this.$refs['file_input'].click();
        },
        changeFile(e) {
            this.model.file = e.target.files[0];
            this.model.fileName = this.model.file.name
            this.$refs['file_input'].value = '';
        },
        validate() {
            return new Promise(resolve => {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        resolve();
                    }
                });
            });
        },
        changeImage(img, key) {
            this.model[key] = img;
        },
        getParams() {
            let params = new FormData();
            paramskey.forEach(key => {
                if (key === 'file' && !this.model.file) return;
                params.append(key, this.model[key]);
            });
            if (this.type === 'edit') {
                params.append('edit', 'edit');
            }
            return params;
        },
        save() {
            uploadFile(homeApi.setWechatConfig.api, this.getParams()).then(res => {
                if (res.error === 0) {
                    this.$Message.success('保存成功');
                    this.$emit('on-change', this.model)
                } else {
                    this.$Message.error(res.message);
                }
            });
        },
        getWechatType() {
            this.$api.homeApi.getWechatType().then(res => {
                if (res.error === 0) {
                    this.typeList = res.data || [];
                }
            });
        },
        getData() {
            this.$api.homeApi.getWechatConfig().then(res => {
                if (res.error === 0) {
                    let {type} = res.data;
                    this.model = {...res.data, type: +type, fileName: ''};
                }
            })
        }
    }
};
</script>

<style scoped>

</style>
