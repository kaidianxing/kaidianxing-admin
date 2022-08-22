<template>
    <div class="remote-storage-ftp">
        <kdx-hint-alert :show-icon="false">
            <p>如果切换到FTP后，需要将原有设置的附件传输至相应的FTP中</p>
            <div class="old-url-box">
                <div class="label">
                    当前店铺的附件地址：
                </div>
                <div class="old-url" v-if="mode === 'shop' && oldStorageUrl.length">
                    <div class="old-url-item" v-for="(item, index) in oldStorageUrl" :key="index">
                        {{item}}；
                    </div>
                </div>
            </div>
        </kdx-hint-alert>
        <Form ref="form" :model="model" :rules="rules" :label-width="140">
            <FormItem label="服务器地址：" prop="host">
                <Input v-model="model.host" class="width-250"/>
            </FormItem>
            <FormItem label="端口：" prop="port">
                <Input v-model="model.port" class="width-250"/>
            </FormItem>
            <FormItem label="账号：" prop="username">
                <Input v-model="model.username" class="width-250"/>
            </FormItem>
            <FormItem label="密码：" prop="password">
                <Input v-model="model.password" class="width-250"/>
            </FormItem>
            <FormItem label="访问URL：" prop="url">
                <Input v-model="model.url" class="width-250">
                    <Select v-model="model.scheme" slot="prepend" style="width: 80px">
                        <Option value="http://">http://</Option>
                        <Option value="https://">https://</Option>
                    </Select>
                </Input>
                <kdx-hint-text>访问域名，请以http://或者https://开头</kdx-hint-text>
            </FormItem>
            <FormItem label="附件目录：" prop="path">
                <Input v-model="model.path" class="width-250"/>
                <kdx-hint-text>远程附件目录的绝对路径，默认为FTP主目录</kdx-hint-text>
            </FormItem>
            <FormItem label="超时时间：" prop="timeout">
                <Input v-model="model.timeout" class="width-250">
                    <span slot="append">秒</span>
                </Input>
                <kdx-hint-text>0为服务器默认</kdx-hint-text>
            </FormItem>
            <FormItem label="被动模式：" prop="passive_mode" class="r-form-item-checkbox">
                <RadioGroup v-model="model.passive_mode">
                    <Radio :label="1">是</Radio>
                    <Radio :label="0">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="SSL：" prop="ssl" class="r-form-item-checkbox">
                <RadioGroup v-model="model.ssl">
                    <Radio :label="1">是</Radio>
                    <Radio :label="0">否</Radio>
                </RadioGroup>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        name: "FTP",
        props: {
            oldStorageUrl: {
                type: Array,
                default: () => []
            },
            mode: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                model: {
                    host: '',
                    port: '',
                    username: '',
                    password: '',
                    url: '',
                    scheme: 'http://',
                    path: '',
                    timeout: '',
                    passive_mode: '1',
                    ssl: '1'
                },
                rules: {
                    host: [
                        {required: true, message: '服务器地址必填'}
                    ],
                    port: [
                        {required: true, message: '端口必填'}
                    ],
                    username: [
                        {required: true, message: '账号必填'}
                    ],
                    password: [
                        {required: true, message: '密码必填'}
                    ]
                }
            };
        },
        methods: {
            validate() {
                return new Promise(resolve => {
                    this.$refs['form'].validate().then(valid => resolve(valid));
                });
            },
            getModel() {
                return this.model;
            },
            resetModel(model) {
                this.model = Object.assign({
                    host: '',
                    port: '',
                    username: '',
                    password: '',
                    url: '',
                    scheme: 'http://',
                    path: '',
                    timeout: '',
                    passive_mode: '1',
                    ssl: '1'
                }, model);
            }
        }
    };
</script>

<style scoped lang="scss">
    .remote-storage-ftp {
        .hint-alert-component {
            margin: 30px 0;
        }
        .old-url-box {
            font-size: 12px;
            line-height: 20px;
            color: $text-second;
            display: flex;
            .old-label {
                flex-shrink: 0;
            }
            .old-url {
                flex: 1;
                display: flex;
            }
        }
    }
</style>
