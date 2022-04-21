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
        <div class="channel-base">
            <div class="top-image flex" :style="info[type].style">
                <div class="channel-img">
                    <img :src="info[type].image" alt="" />
                </div>
                <div class="channel-desc">
                    <div class="title">{{ info[type].title }}</div>
                    <div class="desc">{{ info[type].describe }}</div>
                </div>
            </div>
            <div class="channel-line"></div>
            <div class="form-base">
                <form-base
                    ref="formBase"
                    :module="module"
                    :type="type"
                    :setting="setting"
                    @on-save="fnSave"
                />
            </div>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
import FormBase from './components/FormBase'
export default {
    components: { FormBase },
    data() {
        return {
            loading: false,
            info: {
                wx: {
                    image: require('@/assets/image/channel/wxapp.png'),
                    title: '微信小程序',
                    describe:
                        '绑定微信公众号，集沉淀、运营、唤醒粉丝功能于一体，提高转化率',
                    style: {
                        color: '#677DE0',
                        backgroundColor: '#FAFAFF',
                        backgroundImage: `url(${require('@/assets/image/channel/bg-wxapp.png')})`,
                    },
                },
                tt: {
                    image: require('@/assets/image/channel/toutiao.png'),
                    title: '头条/抖音小程序',
                    describe:
                        '于字节跳动全产品矩阵，天然搭配图文、视频等场景，极速带货转化',
                    style: {
                        color: '#239BFF',
                        backgroundColor: '#FAFDFF',
                        backgroundImage: `url(${require('@/assets/image/channel/bg-toutiao.png')})`,
                    },
                },
            },
            module: '', // channel/merchant
            type: '', // 小程序类型 wx/tt
            setting: {
                appid: '',
                app_secret: '',
                // pay_merchant_id: '',
                // pay_appid: '',
                // pay_app_secret: '',
                navigate_appid_list: [],
                maintain: '',
                maintain_explain: '',
            },
        }
    },
    created() {
        const { module = 'home', type = 'wx' } = this.$route.params
        this.module = module
        this.type = type === 'douyin' ? 'tt' : type
        this.getSetting()
    },
    methods: {
        // 获取设置
        getSetting() {
            if (this.module === 'home') {
                // 渠道
                switch (this.type) {
                    case 'wx':
                        this.getWxAppBase()
                        break
                    case 'tt':
                        this.getTtAppSetting()
                        break
                }
            } else if (this.module === 'merchant') {
                // 商户
                this.getWxappSettings()
            }
        },
        // 获取微信小程序配置（渠道）
        getWxAppBase() {
            this.loading = true
            this.$api.homeApi.getWxAppBase().then((res) => {
                this.loading = false
                if (res.error === 0) {
                    this.setting = {
                        ...this.setting,
                        ...res.data,
                        maintain: res.data.maintain || '0', // 初始化，防止为 ''
                        navigate_appid_list: res.data.navigate_appid_list || [],
                    }
                }
            })
        },
        // 获取字节跳动小程序配置（渠道）
        getTtAppSetting() {
            this.loading = true
            this.$api.homeApi.getTtAppSetting().then((res) => {
                this.loading = false
                if (res.error === 0) {
                    this.setting = {
                        ...this.setting,
                        ...res.data,
                        maintain: res.data.maintain || '0', // 初始化，防止为 ''
                    }
                }
            })
        },
        // 获取微信小程序配置（商户）
        getWxappSettings() {
            this.loading = true
            this.$api.merchantApi.getWxappSettings().then((res) => {
                this.loading = false
                if (res.error === 0) {
                    this.setting = {
                        ...this.setting,
                        ...res.settings,
                        appid: res.settings.app_id,
                        maintain: res.settings.enable === 0 ? '1' : '0',
                        maintain_explain: res.settings.close_reason,
                    }
                }
            })
        },
        handleSave() {
            // 校验表单
            this.$refs['formBase'].validate()
        },
        // 保存
        fnSave(model) {
            const {
                appid,
                app_secret,
                pay_merchant_id,
                pay_appid,
                pay_app_secret,
                maintain,
                maintain_explain,
                navigate_appid_list,
            } = model
            let params = { app_secret }
            if (this.module === 'home') {
                params['appid'] = appid
                params['maintain'] = maintain
                params['maintain_explain'] = maintain_explain
                switch (this.type) {
                    case 'wx':
                        if (navigate_appid_list.length) {
                            params.navigate_appid_list = navigate_appid_list // 微信添加小程序名单
                        }
                        this.setWxAppBase(params)
                        break
                    case 'tt':
                        params = {
                            ...params,
                            pay_merchant_id,
                            pay_appid,
                            pay_app_secret,
                        }
                        this.setTtAppSetting(params)
                        break
                }
            } else if (this.module === 'merchant') {
                // 商户参数和渠道不一致，需要处理一下
                params['app_id'] = appid
                params['enable'] = maintain === '0' ? 1 : 0
                params['close_reason'] = maintain_explain
                // 关闭维护小程序，清除原因
                if (params.enable === 1) {
                    params['close_reason'] = ''
                }
                this.setWxappSettings(params)
            }
        },
        // wx（渠道）
        setWxAppBase(params) {
            this.$api.homeApi.setWxAppBase(params).then((res) => {
                this.$refs['formBase'].loading = false
                if (res.error === 0) {
                    this.$Message.success('小程序基本信息保存成功')
                    this.getSetting()
                }
            })
        },
        // tt（渠道）
        setTtAppSetting(params) {
            this.$api.homeApi.setTtAppSetting(params).then((res) => {
                this.$refs['formBase'].loading = false
                if (res.error === 0) {
                    this.$Message.success('小程序基本信息保存成功')
                    this.getSetting()
                }
            })
        },
        // 保存设置接口（商户）
        setWxappSettings(params) {
            this.$api.merchantApi.setWxappSettings(params).then((res) => {
                // 关闭loading
                this.$refs['formBase'].loading = false
                if (res.error === 0) {
                    this.$Message.success('小程序基本信息保存成功')
                    this.getSetting()
                }
            })
        },
    },
}
</script>

<style scoped lang="scss">
.channel-base {
    margin-top: 20px;
    min-height: 100%;
    background-color: #ffffff;
    .top-image {
        align-items: center;
        width: 100%;
        height: 120px;
        overflow: hidden;
        border: 1px solid $border-color;
        box-sizing: border-box;
        border-radius: 4px;
        background-size: cover;
        .channel-img {
            display: flex;
            align-items: flex-end;
            height: 100%;
            padding-left: 70px;
        }
        .channel-desc {
            margin-left: 50px;
            .title {
                font-weight: bold;
                font-size: 24px;
                line-height: 34px;
                /*color: #677DE0;*/
            }
            .desc {
                margin-top: 10px;
                line-height: 22px;
                /*color: #677DE0;*/
                font-size: 16px;
                opacity: 0.8;
            }
        }
    }
    .channel-line {
        height: 10px;
        width: 100%;
        background-color: $background-color;
    }
    .form-base {
        background-color: #ffffff;
        padding: 40px 40px 0 40px;
    }
}
</style>
