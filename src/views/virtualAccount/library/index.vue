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
        <div class="content">
            <!-- 基础信息 -->
            <base-info ref="baseInfo" :baseInfo.sync="baseInfo" :disabled="disabled" :mailer_status="mailer_status" @getMailer="getMailer"></base-info>
            <!-- 数据结构 -->
            <base-data ref="baseData" :baseData.sync="baseData" :disabled="disabled"></base-data>
        </div>
        <template #btn>
            <Button class="primary-long" :loading="submitLoading" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
    import BaseInfo from './components/BaseInfo'
    import BaseData from "./components/BaseData";
    export default {
        name: "index",
        components: {
            BaseInfo,
            BaseData
        },
        props: {},
        data() {
            return {
                loading: false,
                id: '',
                mailer_status: false, // 邮箱是否开启
                baseInfo: { // 基础信息
                    name: '',
                    use_description: 0,
                    use_description_title: '使用说明',
                    use_description_remark: '',
                    use_address: 0,
                    use_address_title: '默认地址',
                    use_address_address: '',
                    sequence: 0,
                    mailer: 0,
                },
                baseData: { // 数据结构
                    repeat: 1,
                    config: [
                        {
                            key: '',
                            type: 0,
                        }
                    ],
                },
                disabled: false,
                submitLoading: false
            }
        },
        computed: {},
        created() {
            this.loading = true;
            if (this.$route.query?.id) {
                this.id = this.$route.query?.id;
                this.disabled = true;
                this.getData()
            }
            this.getMailer()
        },
        mounted() {
        },
        methods: {
            getMailer() {
                // 获取邮箱设置
                this.$api.noticeApi.getMailer({}).then(res => {
                    this.loading = false;
                    if (res.error === 0) {
                        let { status } = res;
                        this.mailer_status = +status === 0
                    }
                })
            },
            getData() {
                this.$api.virtualAccountApi.getVirtualAccount({id:this.id}).then((res) => {
                    if (res.error === 0) {
                        this.baseInfo = {
                            ...res.data
                        };
                        this.baseData = {
                            repeat: res.data.repeat,
                            config: res.data.config
                        }
                    }
                })
            },
            async handleSave() {
                // 检验表单
                // 弹窗提示是否继续创建卡密库
                this.submitLoading = true;
                try {
                    await this.$refs.baseInfo.validateForm();
                    await this.$refs.baseData.validateForm();
                    this.formatParams();
                } catch (e) {
                    this.submitLoading = false;
                }
            },
            formatParams() {
                let params = {
                    ...this.$refs.baseInfo.getParams(),
                    ...this.$refs.baseData.getParams(),
                };
                if (this.id) {params.id = this.id}
                // 处理参数
                this.submit(params)
            },
            submit(params) {
                this.$api.virtualAccountApi[this.id?'virtualAccountEdit':'virtualAccountAdd'](params).then((res) => {
                    this.submitLoading = false;
                    if (res.error === 0) {
                        if (this.id) {
                            this.$Message.success('保存成功');
                            this.$router.replace({
                                path: '/virtualAccount/library/list'
                            })
                        } else {
                            this.addModel(res.id)
                        }
                    }
                })
            },
            addModel(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '卡密库创建成功，是否为卡密库添加数据',
                    cancelText: '暂不添加',
                    okText: '立即添加',
                    onCancel: () => {
                        this.$router.replace({
                            path: '/virtualAccount/library/list'
                        })
                    },
                    onOk: () => {
                        // 跳转添加数据页面
                        this.$router.replace({
                            path: '/virtualAccount/library/data/index',
                            query: { id }
                        })
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .content {
        background-color: #fff;
        padding: 40px;
        min-height: 100%;
        margin: 0 auto;
        border-radius: 2px;
    }
</style>