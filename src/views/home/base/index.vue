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
                <!--<img
                    src="@/assets/image/home/top_img.png"
                    alt=""
                    v-if="type === 'wx'"
                />
                <img
                    src="@/assets/image/home/top_img_tt.png"
                    alt=""
                    v-if="type === 'tt'"
                />
                <img
                    src="@/assets/image/home/top_img_tt.png"
                    alt=""
                    v-if="type === 'wechat'"
                />-->
                <div class="channel-img">
                    <img :src="info[type].image" alt="">
                </div>
                <div class="channel-desc">
                    <div class="title">{{info[type].title}}</div>
                    <div class="desc">{{info[type].describe}}</div>
                </div>
            </div>
            <div class="channel-line"></div>
            <div class="form-base">
                <form-base ref="formBase" :type="type" :setting="setting" :p_notice="p_notice" @save="save"/>
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
            type: '', // 小程序类型 wx/tt
            setting: {},
            p_notice: {},
            info: {
                wx: {
                    image: require('@/assets/image/home/wxapp.png'),
                    title: '微信小程序',
                    describe: '绑定微信公众号，集沉淀、运营、唤醒粉丝功能于一体，提高转化率',
                    style: {
                        color: '#677DE0',
                        backgroundColor: '#FAFAFF',
                        backgroundImage:'url(' + require('@/assets/image/home/bg-wxapp.png') + ')',
                    }
                },
                // wechat: {
                //     image: require('@/assets/image/home/wechat.png'),
                //     title: '微信公众号',
                //     describe: '以微信公众号为流量载体，打造引流到变现再到精细化运营的闭环',
                //     style: {
                //         color: '#1BB723',
                //         backgroundColor: '#FAFFFC'
                //     }
                // },
                tt: {
                    image: require('@/assets/image/home/toutiao.png'),
                    title: '头条/抖音小程序',
                    describe: '于字节跳动全产品矩阵，天然搭配图文、视频等场景，极速带货转化',
                    style: {
                        color: '#239BFF',
                        backgroundColor: '#FAFDFF',
                        backgroundImage:'url(' + require('@/assets/image/home/bg-toutiao.png') + ')',
                    }
                }
            }
        }
    },
    created() {
        const { type = 'wx' } = this.$route.params
        this.type =  type === 'douyin' ? 'tt' : type
        this.getSetting()
    },
    methods: {
        // 获取设置
        getSetting() {
            switch (this.type) {
                case 'wx':
                    this.getWxAppBase()
                    break
                case 'tt':
                    this.getTtAppSetting()
                    break
                // case 'wechat':
                //     this.getWechatAppSetting()
                //     break
            }
        },
        // 获取微信小程序配置
        getWxAppBase() {
            this.loading = true
            this.$api.homeApi.getWxAppBase().then((res) => {
                this.loading = false
                if (res.error === 0) {
                    this.setting = {
                        ...res.data,
                        maintain: res.data.maintain || '0', // 初始化，防止为 ''
                        show_commission: res.data.show_commission || '1', // 初始化，防止为 ''
                        navigate_appid_list: res.data.navigate_appid_list || []
                    }
                    this.p_notice = {
                        order_buyer_pay:
                            res?.notice?.order_buyer_pay?.status || '0',
                        order_seller_send:
                            res?.notice?.order_seller_send?.status || '0',
                        order_auto_send:
                            res?.notice?.order_auto_send?.status || '0',
                        order_buyer_receive:
                            res?.notice?.order_buyer_receive?.status || '0',
                    }
                }
            })
        },
        // 获取字节跳动小程序配置
        getTtAppSetting() {
            this.loading = true
            this.$api.homeApi.getTtAppSetting().then((res) => {
                this.loading = false
                if (res.error === 0) {
                    this.setting = {
                        ...res.data,
                        maintain: res.data.maintain || '0', // 初始化，防止为 ''
                        show_commission: res.data.show_commission || '1', // 初始化，防止为 ''
                    }
                }
            })
        },
        // 获取公众号配置
        // getWechatAppSetting() {
        //     this.loading = true;
        //     this.$api.homeApi.getWechatAppSetting().then((res) => {
        //         this.loading = false;
        //         if (res.error === 0) {
        //             this.setting = {
        //                 ...res.setting,
        //                 // maintain: res.data.maintain || '0', // 初始化，防止为 ''
        //                 // show_commission: res.data.show_commission || '1', // 初始化，防止为 ''
        //             }
        //         }
        //     })
        // },
        handleSave() {
            // 校验表单
            this.$refs['formBase'].validate()
        },
        // 保存
        save(model) {
            const {
                appid,
                app_secret,
                pay_merchant_id,
                pay_appid,
                pay_app_secret,
                maintain,
                maintain_explain,
                show_commission,
                navigate_appid_list
            } = model
            let params = {
                appid,
                app_secret,
                maintain,
                maintain_explain,
                show_commission,
            }
            switch (this.type) {
                case 'wx':
                    if(navigate_appid_list.length){
                        params.navigate_appid_list = navigate_appid_list; // 微信添加小程序名单
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
                // case 'wechat':
                //     params = {
                //         appid,
                //         app_secret
                //     };
                //     this.setWechatAppSetting(params)
                //     break
            }
        },
        // wx
        setWxAppBase(params) {
            this.$api.homeApi.setWxAppBase(params).then((res) => {
                this.$refs['formBase'].loading = false
                if (res.error === 0) {
                    this.$Message.success('小程序基本信息保存成功')
                    this.getSetting()
                }
            })
        },
        // tt
        setTtAppSetting(params) {
            this.$api.homeApi.setTtAppSetting(params).then((res) => {
                this.$refs['formBase'].loading = false
                if (res.error === 0) {
                    this.$Message.success('小程序基本信息保存成功')
                    this.getSetting()
                }
            })
        },
        // 微信公众号
        // setWechatAppSetting(params) {
        //     this.$api.homeApi.setWechatAppSetting(params).then((res) => {
        //         this.$refs['formBase'].loading = false;
        //         if (res.error === 0) {
        //             this.$Message.success('公众号基本信息保存成功')
        //             this.getSetting()
        //         }
        //     })
        // },
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
