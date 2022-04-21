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
    <div class="custom-template flex" v-show="!loading" v-loading="loading">
        <Form ref="customForm" :model="customData" :label-width="120">
            <FormItem label="选择模板：">
                <Select v-model="customData.template_id" class="width-430" @on-change="chooseTemplate">
                    <Option v-for="item in template_list" :key="item.template_id" :value="item.template_id">
                        {{item.title}}
                    </Option>
                </Select>
                <Button type="text" class="marginR-10 marginL-10" @click="getTemplateList">刷新</Button>
                <Button type="text" @click="routeWeixinTemplate">创建微信模板</Button>
            </FormItem>
            <FormItem label="默认内容：" v-if="customData.content.length > 0">
                <div class="default-content">
                    <FormItem class="default-content-item" :label="`${item.key}：`"
                              v-for="(item, index) in customData.content" :key="index">
                        <span>{{item.value}}</span>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem label="自定义内容：" v-if="customData.content.length > 0">
                <div class="default-content">
                    <FormItem class="default-content-item" :label="`${item.key}：`"
                              v-for="(item, index) in customData.content" :key="index"
                              :prop="'content.' + index + '.customValue'"
                              :rules="{required: true, message: '请填写模板'}">
                        <Input v-model="item.customValue" class="width-250" placeholder="请输入"
                               @on-focus="handleFocus(index)"/>
                    </FormItem>
                </div>
            </FormItem>
        </Form>
        <div class="right-code" v-if="show">
            <span class="arrow"></span>
            <selectTemplateCode @chooseCode="chooseCode"></selectTemplateCode>
        </div>
    </div>
</template>

<script>

    import selectTemplateCode from "../templateCode/selectTemplateCode";

    export default {
        name: "customTemplate",
        components: {
            selectTemplateCode
        },
        props: {
            value: {
                type: Object,
                default: () => {
                }
            }
        },
        data() {
            return {
                loading: false,
                customData: {
                    template_id: '',
                    content: [],
                },
                initContent: [],
                resultContent: [],
                show: false,
                index: '',
                template_list: [],
            }
        },
        watch: {
            value: {
                handler(newValue) {
                    if (newValue) {
                        this.getData(newValue);
                    }
                },
                immediate: true
            }
        },
        computed: {},
        created() {
            this.getTemplateList()
        },
        mounted() {
        },
        methods: {
            getData(data) {
                this.customData = data;
                this.chooseTemplate()
            },
            getTemplateList() {
                this.loading = true;
                this.$api.noticeApi.getWexinTemplate({}).then(res => {
                    if (res.error == 0) {
                        this.template_list = res.template_list;
                    }
                    this.loading = false;
                });
            },
            chooseTemplate() {
                this.$api.noticeApi.getWexinTemplateDetail({template_id: this.customData.template_id}).then(res => {
                    if (res.error == 0) {
                        let str = JSON.stringify(res.content).replace(/\\n/g, ',');
                        let arr = str.slice(1, -1).split(',');
                        arr = arr.filter(item => item);
                        arr[0] = '模板格式：' + arr[0];
                        arr[arr.length - 1] = '尾部描述：' + arr[arr.length - 1];
                        let resultArr = [];
                        for (let i = 0; i < arr.length; i++) {
                            resultArr.push({
                                key: arr[i].split('：')[0],
                                value: arr[i].split('：')[1],
                                customValue: this.customData?.content[i]?.customValue ?? ''
                            })
                        }
                        this.customData.content = resultArr
                    }
                })
            },
            chooseCode(data) {
                this.customData.content[this.index].customValue += data
            },
            handleFocus(index) {
                this.show = true;
                this.index = index
            },
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['customForm'].validate(async (valid) => {
                        if (valid) {
                            try {
                                await this.handleData();
                                resolve(
                                    {
                                        template_id: this.customData.template_id,
                                        content: this.resultContent
                                    }
                                )
                            } catch (e) {
                                reject('public')
                            }
                        } else {
                            reject('public')
                        }
                    })
                })
            },
            handleData() {
                this.resultContent = [];
                for (let i = 0; i < this.customData.content.length; i++) {
                    this.resultContent.push({
                        key: this.customData.content[i].value.slice(2, -7),
                        value: this.customData.content[i].customValue
                    })
                }
            },
            routeWeixinTemplate() {
                this.$utils.openNewWindowPage('/notice/wxappTemplate/list');
            }
        },
    }
</script>

<style lang="scss">
    .custom-template {
        align-items: flex-end;
        position: relative;
        padding: 30px 0 1px;
        margin-top: 10px;
        background-color: $background-color;
        .ivu-form {
            flex: 1;
        }
        .ivu-form {
            flex: 1;
        }

        .ivu-form {
            flex: 1;
        }

        .ivu-form {
            flex: 1;
        }

        .ivu-form {
            flex: 1;
        }

        .default-content {
            position: relative;
            padding: 30px 0 10px;
            width: 430px;
            min-height: 300px;
            margin-left: 120px;
            background-color: #fff;
            border-radius: 2px;

            .default-content-item {
                position: relative;
                margin-bottom: 20px;
            }

            .ivu-form-item-error-tip {
                left: 120px;
            }
        }
        .right-code {
            position: absolute;
            top: 12.5%;
            margin-left: 25px;
            width: auto;
            min-width: 360px;
            max-width: 570px;
            height: 630px;
            background-color: #fff;
            left: 550px;
        }

        .arrow {
            position: absolute;
            left: -10px;
            top: 50%;
            width: 20px;
            height: 20px;
            background-color: #fff;
            border-radius: 4px;
            transform: rotate(45deg);
        }
    }
</style>
