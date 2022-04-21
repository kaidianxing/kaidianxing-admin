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
    <kdx-content-bar v-loading="loading">
        <div class="printer-manage-index">
            <Form ref="form" :model="data" :rules="rules" :label-width="120">
                <kdx-form-title>{{id?'编辑打印机':'添加打印机'}}</kdx-form-title>
                <FormItem label="打印机品牌：">
                    <Select class="width-340" v-model="data.type" :disabled="disabled" placeholder="请选择打印机">
                        <Option v-for="item in printerType" :key="item.value" :value="item.value">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="打印机名称：" prop="name">
                    <Input class="width-340" type="text" v-model="data.name" maxlength="20" show-word-limit placeholder="请输入打印机名称"/>
                </FormItem>
               <!-- <FormItem label="终端号：" v-if="data.type != 2 && data.type != 5" prop="machine_code">
                    <Input class="width-340" type="text" v-model="data.machine_code" placeholder="请输入打印机终端号"/>
                </FormItem>
                <FormItem label="USER：" v-if="data.type == 5">
                    <Input class="width-340" type="text" v-model="data.name" placeholder="请输入飞鹅云后台注册用户名"/>
                </FormItem>
                <FormItem label="UKEY：" v-if="data.type == 5">
                    <Input class="width-340" type="text" v-model="data.name" placeholder="请输入飞鹅云后台登录生成的UKEY"/>
                </FormItem>
                <FormItem label="打印机编号：" v-if="data.type == 2 || data.type == 5">
                    <Input class="width-340" type="text" v-model="data.name" placeholder="请输入打印机编号"/>
                </FormItem>
                <FormItem label="打印机密钥：" v-if="data.type != 5" prop="msign">
                    <Input class="width-340" type="text" v-model="data.msign" placeholder="请输入打印机密钥"/>
                </FormItem>
                <FormItem label="用户ID：" v-if="data.type != 2 && data.type != 5" prop="client_id">
                    <Input class="width-340" type="text" v-model="data.client_id" placeholder="请输入用户ID(管理中心系统集成里获取)"/>
                </FormItem>
                <FormItem label="apiKey：" v-if="data.type == 3 || data.type == 4">
                    <Input class="width-340" type="text" v-model="data.name" placeholder="请输入apKey (管理中心系统集成里获取)"/>
                </FormItem>
                <FormItem label="应用秘钥：" v-if="data.type == 1" prop="client_secret">
                    <Input class="width-340" type="text" v-model="data.client_secret" placeholder="请输入应用秘钥"/>
                </FormItem>
                <FormItem label="URL：" v-if="data.type != 1 && data.type != 5">
                    <Input class="width-340" type="text" v-model="data.name" placeholder="请输入URL"/>
                </FormItem>-->

                <div v-if="data.type == 1">
                    <FormItem label="终端号：" prop="machine_code">
                        <Input class="width-340" type="text" :disabled="disabled" v-model="data.machine_code" placeholder="请输入打印机终端号"/>
                    </FormItem>
                    <FormItem label="打印机密钥：" prop="msign">
                        <Input class="width-340" type="text" :disabled="disabled" v-model="data.msign" placeholder="请输入打印机密钥"/>
                    </FormItem>
                    <FormItem label="应用ID：" prop="client_id">
                        <Input class="width-340" type="text" :disabled="disabled" v-model="data.client_id" placeholder="请输入应用ID(管理中心系统集成里获取)"/>
                    </FormItem>
                    <FormItem label="应用秘钥：" prop="client_secret">
                        <Input class="width-340" type="text" :disabled="disabled" v-model="data.client_secret" placeholder="请输入应用秘钥"/>
                    </FormItem>
                </div>
                <div v-if="data.type == 2">
                    <FormItem label="打印机编号：" prop="sn">
                        <Input class="width-340" type="text" :disabled="disabled" v-model="data.sn" placeholder="请输入打印机编号"/>
                        <span class="mL-20">设备号</span>
                        <kdx-hint-tooltip placement="right" max-width="395">
                            <img src="@/assets/image/printer/sn.png" alt="">
                        </kdx-hint-tooltip>
                    </FormItem>
                    <FormItem label="打印机密钥：" prop="key">
                        <Input class="width-340" type="text" :disabled="disabled" v-model="data.key" placeholder="请输入打印机密钥"/>
                    </FormItem>
                    <FormItem label="USER：" prop="user">
                        <Input class="width-340" type="text" :disabled="disabled" v-model="data.user" placeholder="请输入飞鹅云后台注册用户名"/>
                    </FormItem>
                    <FormItem label="UKEY：" prop="ukey">
                        <Input class="width-340" type="text" :disabled="disabled" v-model="data.ukey" placeholder="请输入飞鹅云后台登录生成的UKEY"/>
                    </FormItem>
                </div>
                <FormItem label="使用位置：">
                    <Input class="width-340" type="text" v-model="data.location" placeholder="请输入使用位置"/>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="default-primary" @click="handleSave('test')">测试打印</Button>
            <Button class="primary-long" @click="handleSave('submit')">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
    export default {
        name: "index",
        components: {},
        props: {},
        data() {
            return {
                id: '',
                loading: false,
                disabled: false,
                data: {
                    type: 1,
                    name: '',
                    machine_code: '', // 终端号（云）
                    msign: '', // 打印机密钥（云）
                    client_id: '', // 用户ID（云）
                    client_secret: '', // 应用秘钥（云）
                    sn: '', // 编码 飞蛾云参数
                    key: '', // 秘钥 飞蛾云参数
                    ukey: '', // 飞蛾云参数
                    user: '', // 飞蛾云参数
                    location: '', // 使用位置
                },
                printerType: [],
                rules: {
                    name: [
                        {required: true, message: '请输入打印机名称'}
                    ],
                    machine_code: [
                        {required: true, message: '请输入终端号'}
                    ],
                    msign: [
                        {required: true, message: '请输入打印机密钥'}
                    ],
                    client_id: [
                        {required: true, message: '请输入应用ID'}
                    ],
                    client_secret: [
                        {required: true, message: '请输入应用秘钥'}
                    ],
                    sn: [
                        {required: true, message: '请输入打印机编号'}
                    ],
                    key: [
                        {required: true, message: '请输入打印机密钥'}
                    ],
                    user: [
                        {required: true, message: '请输入飞鹅云后台注册用户名'}
                    ],
                    ukey: [
                        {required: true, message: '请输入飞鹅云后台登录生成的UKEY'}
                    ],
                }
            }
        },
        computed: {},
        created() {
        },
        mounted() {
            this.getPrinterType()
            if (this.$route?.query.id) {
                this.id = this.$route?.query.id || '';
                this.disabled = true;
                this.getData()
            }
        },
        methods: {
            getPrinterType() {
                this.loading = true;
                this.$api.printerApi.getPrinterType().then(res => {
                    if (res.error == 0) {
                        this.loading = false;
                        this.printerType = res.data
                    }
                })
            },
            getData() {
                this.$api.printerApi.editPrinter({id: this.id}).then(res => {
                    if (res.error == 0) {
                        this.data = {
                            ...res.data.config,
                            name: res.data.name,
                            type: res.data.type,
                            location: res.data.location
                        }
                    }
                })
            },
            handleSave(type) {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.handleParams(type)
                    }
                });
            },
            handleParams(type) {
                let obj = {};
                if (this.data.type == 1) {
                    obj = {
                        type: this.data.type,
                        name: this.data.name,
                        machine_code: this.data.machine_code,
                        msign: this.data.msign,
                        client_id: this.data.client_id,
                        client_secret: this.data.client_secret,
                        location: this.data.location,
                    }
                } else if(this.data.type == 2) {
                    obj = {
                        type: this.data.type,
                        name: this.data.name,
                        sn: this.data.sn,
                        key: this.data.key,
                        ukey: this.data.ukey,
                        user: this.data.user,
                        location: this.data.location,
                    }
                }
                if (this.id && type == 'submit') {
                    obj.id = this.id
                }
                if (type === 'test') {
                    this.handleTest(obj)
                } else {
                    this.submit(obj)
                }
            },
            handleTest(obj) {
                this.$api.printerApi.testPrinter(obj).then(res => {
                    if (res.error == 0) {
                        console.log(res);
                    }
                })
            },
            submit(obj) {
                this.$api.printerApi[this.id?'savePrinter':'addPrinter'](obj).then(res => {
                    if (res.error == 0) {
                        this.$Message.success('保存成功');
                        this.$router.replace({
                            path: '/printer/manage/list',
                        })
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .printer-manage-index {
        padding: 40px;
        /*margin-top: 20px;*/
        min-height: 100%;
        background-color: #fff;
    }
</style>
