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
        <div class="add-module">
            <div class="content">
                <kdx-form-title>添加模板</kdx-form-title>
                <Form ref="form" :model="model" :label-width="205" :rules="rules">
                    <FormItem label="支付名称：" prop="title" class="ivu-form-item-required">
                        <Input placeholder="方便选择与记忆的支付名称" v-model="model.title"></Input>
                    </FormItem>
                    <FormItem label="支付方式：">
                        <RadioGroup v-model="model.type">
                            <Radio :label="1">
                                <span>微信支付</span>
                            </Radio>
                            <Radio :label="2">
                                <span>支付宝支付</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="支付类型：" prop="pay_type" class="ivu-form-item-required">
                        <Select v-model="model.pay_type">
                            <Option
                                v-for="item in getPayTypes"
                                :value="parseInt(item.value)"
                                :key="item.value"
                            >{{item.label}}</Option>
                        </Select>
                    </FormItem>
                    <template v-if="model.type==1">
                         <FormItem
                            label="商户名称："
                            prop="merchant_name"
                            class="ivu-form-item-required"
                        >
                            <Input v-model="model.merchant_name"></Input>
                        </FormItem>
                        <!-- 微信支付子商户 -->
                        <template v-if="model.pay_type == 11">
                            <FormItem
                                label="服务商公众号 (AppId)："
                                prop="appid"
                                class="ivu-form-item-required"
                            >
                                <Input v-model="model.appid"></Input>
                            </FormItem>
                            <FormItem
                                label="服务商支付商户号 (Mch_Id)："
                                prop="mch_id"
                                class="ivu-form-item-required"
                            >
                                <Input v-model="model.mch_id"></Input>
                            </FormItem>
                        </template>
                        <FormItem
                            label="公众号/小程序 (AppID)："
                            prop="sub_appid"
                            class="ivu-form-item-required"
                        >
                            <Input v-model="model.sub_appid"></Input>
                            <hint-text v-if="model.pay_type==11">子商户绑定的AppID</hint-text>
                        </FormItem>
                        <FormItem
                            label="支付商户号 (Mch_Id)："
                            prop="sub_mch_id"
                            class="ivu-form-item-required"
                        >
                            <Input v-model="model.sub_mch_id"></Input>
                            <hint-text v-if="model.pay_type==11">子商户的sub_mch_id</hint-text>
                        </FormItem>
                        <FormItem
                            label="支付密钥 (APIKEY)："
                            prop="api_key"
                            class="ivu-form-item-required"
                        >
                            <Input v-model="model.api_key"></Input>
                            <hint-text v-if="model.pay_type==11">服务商支付密钥</hint-text>
                        </FormItem>
                        <FormItem label="CERT文件证书：" class="ivu-form-item-required">
                            <upload-file
                                :desc="`${model.pay_type==11? '服务商支付证书：下载证书cert.zip中的 apiclient_cert.pem文件': '下载证书cert.zip中的 apiclient_cert.pem文件'}`"
                                accept=".pem"
                                @change="certUpload"
                                :status="!!model.wechat_cert"
                            ></upload-file>
                        </FormItem>
                        <FormItem label="KEY密钥文件：" class="ivu-form-item-required">
                            <upload-file
                                :desc="`${model.pay_type==11? '服务商支付证书：下载证书cert.zip中的 apiclient_key.pem文件': '下载证书cert.zip中的 apiclient_key.pem文件'}`"
                                accept=".pem"
                                @change="keyUpload"
                                :status="!!model.wechat_key"
                            ></upload-file>
                        </FormItem>
                        <FormItem label="ROOT文件：">
                            <upload-file
                                action
                                desc="下载证书cert.zip中的 rootca.pem文件"
                                accept=".pem"
                                @change="rootUpload"
                                :status="!!model.wechat_root_cert"
                            ></upload-file>
                        </FormItem>
                    </template>
                    <div v-if="model.type==2">
                        <FormItem label="APPID：" prop="appid" class="ivu-form-item-required">
                            <Input v-model="model.appid"></Input>
                            <kdx-hint-text>开放平台应用id</kdx-hint-text>
                        </FormItem>
                        <FormItem
                            label="验签方式(SIGN_TYPE)："
                            prop="sign_type"
                            class="ivu-form-item-required"
                        >
                            <RadioGroup v-model="model.sign_type">
                                <Radio :label="1">
                                    <span>RSA</span>
                                </Radio>
                                <Radio :label="2">
                                    <span>RSA2</span>
                                </Radio>
                            </RadioGroup>
                            <kdx-hint-text>
                                请选择正确的验证签名方式，否则支付宝支付不起作用（
                                <span style="color:red">建议使用RSA2</span>）
                            </kdx-hint-text>
                        </FormItem>
                        <FormItem
                            label="应用私钥(PRIVATE_KEY)："
                            class="ivu-form-item-required"
                            prop="ali_private_key"
                        >
                            <Input type="textarea" v-model="model.ali_private_key"></Input>
                            <kdx-hint-text>一行且不能有空格</kdx-hint-text>
                        </FormItem>
                        <FormItem
                            label="商户证书："
                            class="ivu-form-item-required"
                            prop="app_cert_public_key"
                        >
                            <upload-file
                                desc="下载证书中的 appCertPublicKey.crt文件"
                                accept=".crt"
                                @change="aliCertUpload"
                                :status="!!model.app_cert_public_key"
                            >
                                <template #example>
                                    <kdx-hint-tooltip
                                        width="474px"
                                        :maxWidth="500"
                                        type="image"
                                        :image="require('@/assets/image/example/alipay_certificate.png')"
                                    ></kdx-hint-tooltip>
                                </template>
                            </upload-file>
                            <div class="upload-tip">登录支付宝账号 然后在“接口加密方式”中的“应用公钥证书”位置，点击“下载证书”。</div>
                        </FormItem>
                        <FormItem
                            label="支付宝公钥证书："
                            class="ivu-form-item-required"
                            prop="alipay_cert_public_key_rsa2"
                        >
                            <upload-file
                                accept=".crt"
                                desc="下载证书中的 alipayCertPublicKey_RSA2.crt文件"
                                @change="aliKeyUpload"
                                :status="!!model.alipay_cert_public_key_rsa2"
                            ></upload-file>
                        </FormItem>
                        <FormItem
                            label="支付宝根证书："
                            class="ivu-form-item-required"
                            prop="alipay_root_cert"
                        >
                            <upload-file
                                action
                                accept=".crt"
                                desc="下载证书中的 alipayRootCert.crt文件"
                                @change="aliRootUpload"
                                :status="!!model.alipay_root_cert"
                            ></upload-file>
                        </FormItem>
                    </div>
                </Form>
            </div>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave" style="margin-right: 10px">提交</Button>
            <Button @click="backList">返回列表</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
import { uploadFile } from '@/api/config/fileRequest'
import UploadFile from './components/UploadFile'

export default {
    name: 'addMould',
    components: {
        UploadFile
    },
    data() {
        const isRequired = ({ message }, val, callback) => {
            if (!this.isSubmit) callback()

            if (val) callback()

            callback(message)
        }

        return {
            model: {
                title: '',
                type: 1,
                pay_type: '',
                wechat_cert: '',
                wechat_key: '',
                sub_appid: '',
                sub_mch_id: '',
                api_key: '',
                wechat_root_cert: '',
                appid: '',
                mch_id: '',
                sub_appsecret: '',
                sign_type: 1,
                is_raw: '',
                app_cert_public_key: '',
                alipay_cert_public_key_rsa2: '',
                alipay_root_cert: '',
                merchant_name: ''
            },
            wePayTypes: [
                { value: '10', label: '微信支付' },
                { value: '11', label: '微信支付子商户' }
            ],
            aliPayTypes: [{ value: '20', label: '支付宝' }],
            rules: {
                title: [{ validator: isRequired, message: '请填写支付名称' }],
                pay_type: [
                    { validator: isRequired, message: '请选择支付类型' }
                ],
                merchant_name: [{validator: isRequired, message: '请填写商户名称'}],
                sub_appid: [{ validator: isRequired, message: '请填写公众号' }],
                sub_mch_id: [
                    { validator: isRequired, message: '请填写支付商户号' }
                ],
                mch_id: [
                    { validator: isRequired, message: '请填写服务商支付商户号' }
                ],
                api_key: [{ validator: isRequired, message: '请填写支付密钥' }],
                appid: [
                    {
                        validator: isRequired,
                        message: () => {
                            return this.model.type == 1
                                ? '请填写公众号（AppId）'
                                : '请填写appid'
                        }
                    }
                ],
                wechat_cert: [
                    {
                        validator: isRequired,
                        message: '请上传CERT文件证书'
                    }
                ],
                wechat_key: [
                    {
                        validator: isRequired,
                        message: '请上传KEY密钥文件'
                    }
                ],
                sign_type: [
                    { validator: isRequired, message: '请填写验签方式' }
                ],
                ali_private_key: [
                    { validator: isRequired, message: '请填写应用私钥' }
                ],
                app_cert_public_key: [
                    {
                        validator: isRequired,
                        message: '请上传支付宝商户证书'
                    }
                ],
                alipay_cert_public_key_rsa2: [
                    {
                        validator: isRequired,
                        message: '请上传支付宝公钥证书 '
                    }
                ],
                alipay_root_cert: [
                    {
                        validator: isRequired,
                        message: '请上传支付宝根证书 '
                    }
                ]
            },
            id: '',
            isSubmit: false
        }
    },
    computed: {
        getPayTypes() {
            return this.model.type === 1 ? this.wePayTypes : this.aliPayTypes
        }
    },
    mounted() {
        let { id, type } = this.$route.query
        // 默认选择支付方式
        if (type) {
            this.model.type = parseFloat(type)
        }
        if (id) {
            this.id = id
            this.getInfo()
        }
    },
    methods: {
        // 获取模板信息
        getInfo() {
            this.$api.settingApi
                .getPayMouldDetail({ id: this.id })
                .then(res => {
                    if (res) {
                        this.model = { ...this.model, ...res.data }
                    }
                })
        },
        // 保存判断是新增还是修改
        handleSave() {
            this.isSubmit = true

            this.$refs.form.validate(valid => {
                this.isSubmit = false
                if (valid) {
                    !this.id && this.addTemplate()
                    this.id && this.editTemplate()
                }
            })
        },
        // 添加模板
        addTemplate() {
            let data = this.formatData(this.model)
            uploadFile('manage/sysset/pay-template-set/add', data).then(
                res => {
                    if (res.error === 0) {
                        this.$Message.success('保存成功')
                        this.$router.back()
                    }
                }
            )
        },
        // 修改模板
        editTemplate() {
            let data = this.formatData(
                this.filterFileData({ ...this.model, id: this.id })
            )

            uploadFile('manage/sysset/pay-template-set/update', data).then(
                res => {
                    if (res.error === 0) {
                        this.$Message.success('保存成功')
                        this.$router.back()
                    }
                }
            )
        },
        filterFileData(data) {
            let keys = [
                'wechat_cert',
                'wechat_key',
                'wechat_root_cert',
                'app_cert_public_key',
                'alipay_cert_public_key_rsa2',
                'alipay_root_cert'
            ]
            keys.forEach(key => {
                Object.prototype.toString.call(data[key]) !== '[object File]' &&
                    delete data[key]
            })

            return data
        },
        // 参数formData
        formatData(data) {
            let formData = new FormData()
            Object.entries(data).forEach(v => {
                formData.append(v[0], v[1])
            })
            return formData
        },
        // 微信cert文件证书上传
        certUpload(file) {
            if (this.checkType(file)) {
                this.model.wechat_cert = file
            }
            return false
        },
        // 微信key密钥文件上传
        keyUpload(file) {
            if (this.checkType(file)) {
                this.model.wechat_key = file
            }
            return false
        },
        // 微信root文件上传
        rootUpload(file) {
            if (this.checkType(file)) {
                this.model.wechat_root_cert = file
            }
            return false
        },
        // 支付宝商户证书上传
        aliCertUpload(file) {
            if (this.checkAliType(file)) {
                this.model.app_cert_public_key = file
            }
            return false
        },
        // 支付宝公钥证书上传
        aliKeyUpload(file) {
            console.log('file', file)
            if (this.checkAliType(file)) {
                this.model.alipay_cert_public_key_rsa2 = file
                console.log('file1', this.model.alipay_cert_public_key_rsa2)
            }
            return false
        },
        // 支付宝根证书上传
        aliRootUpload(file) {
            if (this.checkAliType(file)) {
                this.model.alipay_root_cert = file
            }
            return false
        },
        // 检测上传文件类型
        checkType(file) {
            if (file.name.indexOf('.pem') > -1) {
                return true
            } else {
                this.$Message.error('请上传正确格式的pem文件')
                return false
            }
        },
        checkAliType(file) {
            if (file.name.indexOf('.crt') > -1) {
                return true
            } else {
                this.$Message.error('请上传正确格式的pem文件')
                return false
            }
        },
        backList() {
            this.$router.push({
                path: '/setting/paymentSettings/mould/list'
            })
        }
    }
}
</script>

<style scoped lang="scss">
.add-module {
    margin-top: 20px;
    background: #fff;
    min-height: 100%;
    .content {
        padding: 40px;

        .ivu-input-wrapper,
        .ivu-select {
            width: 420px;
        }
    }

    .upload-tip {
        @include font-12-16;
        margin-top: 10px;
        color: #939799;
    }
}
</style>
