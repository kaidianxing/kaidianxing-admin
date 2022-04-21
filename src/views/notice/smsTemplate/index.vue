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
        <div class="sms-template-index">
            <kdx-form-title>{{type}}</kdx-form-title>
            <Form ref="form" :label-width="120" :model="temData" :rules="rules">
                <FormItem label="模板ID：" prop="sms_tpl_id">
                    <Input class="width-340" v-model="temData.sms_tpl_id" placeholder="请输入模板ID"></Input>
                    <kdx-hint-text>在阿里云短信平台申请且审核通过的短信模板ID（模版CODE）</kdx-hint-text>
                </FormItem>
                <FormItem label="模板名称：" prop="name">
                    <Input class="width-340" v-model="temData.name" placeholder="请输入模板名称" maxlength="30"
                           show-word-limit></Input>
                    <kdx-hint-text>自定义填写，便于后台搜索查询选择。</kdx-hint-text>
                </FormItem>
                <FormItem label="发送条件" prop="scene_code">
                    <Select class="width-340" v-model="temData.scene_code">
                        <Option v-for="item in sceneList" :value="item.scene_code" :key="item.scene_code">{{item.title}}
                        </Option>
                    </Select>
                    <kdx-hint-text>选择模板发送的业务场景</kdx-hint-text>
                </FormItem>
                <FormItem label="模板内容：" prop="content">
                    <Input class="width-340" v-model="temData.content" type="textarea"
                           placeholder="变量格式：${code}；示例：您的验证码${code}，该验证码5分钟内有效，请勿泄漏于他人！"
                           @on-change="getVars"></Input>
                    <kdx-hint-text>
                        <p>验证码模板只支持验证码作为变量；变量替换值&lt;=6位数字或字母</p>
                        <p>不能发送营销/贷款/借款/中奖/抽奖类短信,不支持金融理财&房产通知类短信(验证码除外)</p>
                    </kdx-hint-text>
                </FormItem>
                <FormItem label="数据值：">
                    <span>{{errors}}</span>
                    <div v-for="(item,index) in tableData" :key="index" class="flex var-box">
                        <Input class="width-300" v-model="item.data_temp" :readonly="true">
                            <span slot="prepend">短信模板变量</span>
                        </Input>
                        <div class="shop-var">商城变量</div>
                        <Cascader :data="codeList" v-model="item.data_shop" :render-format="format"></Cascader>
                    </div>
                    <kdx-hint-text>阿里短信数据只是用${号，如${code}。需在数据值中填写商城的变量</kdx-hint-text>
                </FormItem>
                <FormItem label="短信签名：" prop="sms_sign">
                    <Input class="width-340" v-model="temData.sms_sign" placeholder="请输入签名" maxlength="12"
                           show-word-limit></Input>
                    <kdx-hint-text>在阿里云短息平台申请且审核通过的短信签名</kdx-hint-text>
                </FormItem>
                <FormItem label="状态：" prop="state" class="r-form-item-checkbox">
                    <RadioGroup v-model="temData.state">
                        <Radio :label="1">
                            <span>启用</span>
                        </Radio>
                        <Radio :label="0">
                            <span>禁用</span>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text>关闭后将不能调用</kdx-hint-text>
                </FormItem>
            </Form>
            <sms-test ref="testSms" :tableData="tableData" @send="send"></sms-test>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
import codeList from "../components/codeJS";
import smsTest from "../components/SmsTest";

export default {
    name: "index",
    components: {
        smsTest
    },
    props: {},
    data() {
        return {
            type: '添加短信模板',
            id: '',
            loading: false,
            temData: {
                type: 'aliyun',
                sms_tpl_id: '',
                name: '',
                scene_code: '',
                content: '',
                sms_sign: '',
                state: 1
            },
            tableData: [],
            codeList: codeList,
            sceneList: [], // 场景值列表
            errors: '未找到任何变量',
            rules: {
                sms_tpl_id: [
                    {required: true, message: '请填写模板ID'}
                ],
                name: [
                    {required: true, message: '请填写模板名称'},
                ],
                scene_code: [
                    {required: true, message: '请填写模板名称'},
                ],
                content: [
                    {required: true, message: '请填写模板内容'},
                ],
                sms_sign: [
                    {required: true, message: '请填写短信签名'},
                ],
                state: [
                    {required: true, message: '请选择状态'},
                ],
            }
        }
    },
    computed: {},
    created() {
    },
    mounted() {
        if (this.$route.params.type == 'edit') {
            this.type = '编辑短信模板';
            this.id = this.$route.query.id;
            this.getDetail()
        }
        this.getList()
    },
    methods: {
        getDetail() {
            this.$api.noticeApi.getSmsTemDetail({id: this.id}).then(res => {
                if (res.error == 0) {
                    this.temData = res;
                    for (let key in res.data.temp_code) {
                        this.tableData.push({
                            data_temp: key,
                            data_shop: res.data.temp_code[key]
                        });
                    }
                    if (this.tableData.length == 0) {
                        this.errors = '未找到任何变量';
                    } else {
                        this.errors = '';
                    }
                }
            })
        },
        getList() {
            this.$api.noticeApi.getSmsScene().then(res => {
                if (res.error == 0) {
                    this.sceneList = res.list
                }
            })
        },
        format(labels, selectedData) {
            const index = selectedData.length -1;
            const data = selectedData[index] || false;
            if (data && data.value) {
                return data.value;
            }
        },
        getVars() {
            let is_true = true;
            let smsType = this.temData.type;
            if (smsType == '') {
                return;
            }
            let value = this.temData.content;
            if (!this.temData.content) {
                return;
            }
            this.tableData = [];
            this.errors = '';
            //判断特殊字符
            if (smsType == 'juhe' || smsType == 'aliyun') {
                if (value.indexOf('【') != -1 || value.indexOf('】') != -1) {
                    this.errors = '模板内容不能包含【 或 】字符!';
                    return;
                }
            }
            if (smsType == 'ihuyi' && value.substr(0, 4) == '【变量】') {
                this.errors = '模板内容不以【变量】开头!';
                return;
            }
            if (smsType == 'ihuyi' || smsType == 'dxton') {
                let regx = /【变量】/ig;
                let length = 0;
                while (is_true) {
                    let lastIndex = regx.test(value);
                    if (lastIndex > 0) {
                        length++;
                        continue
                    }
                    break
                }
                if (length <= 0) {
                    this.tableData = [];
                    return
                }
                for (let i = 1; i <= length; i++) {
                    this.tableData.push({
                        data_temp: '',
                        data_shop: []
                    });
                }
            } else if (smsType == 'juhe' || smsType == 'aliyun' || smsType == 'smscn' || smsType == 'submail') {
                let regx = /\\#(\w+)\\#/ig;
                if (smsType == 'aliyun') {
                    regx = /\$\{(\w+)\}/ig
                } else if (smsType == 'smscn') {
                    regx = /\{\$(\w+)\}/ig
                } else if (smsType == 'submail') {
                    regx = /@var\((\w+)\)/ig;
                }
                while (is_true) {
                    let exec = regx.exec(value);
                    if (exec == null) {
                        break
                    }
                    if (smsType == 'aliyun') {
                        if (exec[1] == 'id' || exec[1] == 'site' || exec[1] == 'email' || exec[1] == 'mobile' || exec[1] == 'nick') {
                            this.errors = '模板内容不能使用${email},${mobile},${id},${nick},${site} 变量!'
                            var nvalue = value.replace(/\$\{id\}/ig, '');
                            nvalue = nvalue.replace(/\$\{site\}/ig, '');
                            nvalue = nvalue.replace(/\$\{nick\}/ig, '');
                            nvalue = nvalue.replace(/\$\{email\}/ig, '');
                            nvalue = nvalue.replace(/\$\{mobile\}/ig, '');
                            console.log(nvalue, 'nvaluenvaluenvalue');
                            // this.settings[type].template = nvalue;//判断找不到
                            return;
                        }
                    }
                    this.tableData.push({
                        data_temp: exec[1],
                        data_shop: []
                    });
                }
            }
            if (this.tableData.length == 0) {
                this.errors = '未找到任何变量';
            }
        },
        async handleSave() {
            try {
                this.loading = true;
                await this.validateForm();
                this.submit();
            } catch (e) {
                this.loading = false;
            }
        },
        // 表单验证
        validateForm() {
            return new Promise((resolve, reject) => {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        resolve(valid);
                    } else {
                        reject();
                    }
                });
            });
        },
        submit() {
            let obj = {
                ...this.temData,
                data: {
                    data: {},
                    temp_code: {}
                }
            };
            if (this.id) {
                obj.id = this.id
            }
            for (let i = 0; i < this.tableData.length; i++) {
                console.log(i, this.tableData[i]);
                obj.data.data[this.tableData[i].data_temp] = this.tableData[i].data_shop[this.tableData[i].data_shop.length - 1]
                obj.data.temp_code[this.tableData[i].data_temp] = this.tableData[i].data_shop
            }
            console.log(obj);
            this.$api.noticeApi[obj.id?'editSms':'addSms'](obj).then(res => {
                if (res.error == 0) {
                    this.$Message.success('提交成功');
                    this.$router.push({
                        path: '/notice/smsTemplate/list'
                    })
                }
                this.loading = false;
            })
        },
        async send() {
            await this.validateForm();
            await this.$refs.testSms.validateTestForm().then(res => {
                let obj = {
                    mobile: res.mobile,
                    data: res.data,
                    sms_sign: this.temData.sms_sign,
                    sms_tpl_id: this.temData.sms_tpl_id,
                    type: this.temData.type
                };
                if (this.id) {
                    obj.id = this.id
                }
                var arr = Object.keys(obj.data);
                if(arr.length ===0 ){//不能传空{}
                    obj.data = ''
                }
                this.$api.noticeApi.sendData(obj).then(res => {
                    if (res.error == 0) {
                        this.$Message.success('操作成功')
                    }
                })
            });
        }
    },
}
</script>

<style lang="scss">
.sms-template-index {
    margin-top: 20px;
    background: #FFFFFF;
    padding:30px 40px 40px;

    .tip {
        margin-bottom: 30px;
    }

    .var-box {
        margin-bottom: 10px;
    }

    .shop-var {
        border-top: 1px solid $border-color;
        padding: 0 10px;
        background: $border-color;
        border-bottom: 1px solid $border-color;
        height: 32px;
        margin-top: 1px;
    }
}
</style>