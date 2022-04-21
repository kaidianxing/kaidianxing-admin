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
        <div class="content">
            <Tabs v-model="tabPoint" :animated="false">
                <TabPane label="微信公众号 " name="tab1">
                    <wechat-pay
                        v-if="loaded"
                        :setting="wechat"
                        :wechatTemp="wechatTemp"
                        :alipayTemp="alipayTemp"
                        :white_host="white_host"
                        ref="tab1"
                        @submit="weChatSub"
                        @on-refresh="handleRefresh"
                        name="wechat"
                    ></wechat-pay>
                </TabPane>
                <TabPane label="微信小程序 " name="tab2">
                    <wechat-pay
                        v-if="loaded"
                        :setting="wxapp"
                        :wechatTemp="wechatTemp"
                        :alipayTemp="alipayTemp"
                        ref="tab2"
                        @submit="wxappSub"
                        @on-refresh="handleRefresh"
                        name="wxapp"
                    ></wechat-pay>
                </TabPane>
                <TabPane label="浏览器H5 支付 " name="tab3">
                    <wechat-pay
                        v-if="loaded"
                        :setting="h5"
                        :wechatTemp="wechatTemp"
                        :alipayTemp="alipayTemp"
                        ref="tab3"
                        @submit="webSub"
                        @on-refresh="handleRefresh"
                        name="H5"
                    ></wechat-pay>
                </TabPane>
                <TabPane  label="头条/抖音小程序" name="tab4">
                    <wechat-pay
                        v-if="loaded"
                        name="byte_dance"
                        ref="tab4"
                        :setting="byte_dance"
                        :wechatTemp="wechatTemp"
                        :alipayTemp="alipayTemp"
                        @submit="ttappSub"
                        @on-refresh="handleRefresh"
                    />
                </TabPane>
            </Tabs>
        </div>
        <template #btn>
            <Button class="primary-long" :disabled="noManagePerm" @click="submitData">
                提交
            </Button>
        </template>
    </kdx-content-bar>
</template>

<script>
import WechatPay from './components/WechatPay'
export default {
    name: 'index',
    components: {
        WechatPay,
    },
    data() {
        return {
            tabPoint: 'tab1',
            h5: {},
            wxapp: {},
            wechat: {},
            byte_dance: {},
            wechatTemp: [],
            alipayTemp: [],
            white_host: '', // 支付白名单域名
            loaded: false
        }
    },
    mounted() {
        this.getSetting()
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap('sysset.pay-type_set.manage')
        },
    },
    methods: {
        getSetting() {
            this.$api.settingApi.getPaymengtSetting().then((res) => {
                if (res.error === 0) {
                    let keys = ['wechat', 'wxapp', 'h5', 'byte_dance']
                    keys.forEach((key) => {
                        this[key] = res[key]
                    })
                    this.wechatTemp = res.wechat_template
                    this.alipayTemp = res.alipay_template
                    // 支付白名单域名
                    this.white_host = res.white_host
                    this.loaded = true
                }
            })
        },
        weChatSub(info) {
            let data = {
                wechat: info,
                wxapp: this.wxapp,
                h5: this.h5,
                byte_dance: this.byte_dance,
            }
            this.postData(data)
        },
        wxappSub(info) {
            info.alipay && delete info.alipay
            let data = {
                wechat: this.wechat,
                wxapp: info,
                h5: this.h5,
                byte_dance: this.byte_dance,
            }
            this.postData(data)
        },
        webSub(info) {
            let data = {
                wechat: this.wechat,
                wxapp: this.wxapp,
                h5: info,
                byte_dance: this.byte_dance,
            }
            this.postData(data)
        },
        ttappSub(info) {
            let data = {
                wechat: this.wechat,
                wxapp: this.wxapp,
                h5: this.h5,
                byte_dance: info,
            }
            this.postData(data)
        },
        postData(data) {
            // 兼容之前数据错误的问题
           Object.values(data).forEach(item=> {
               Object.keys(item).forEach(key=> {
                   if(key == 'wechat' || key == 'alipay') {
                       if(item[key].id == 'null' || item[key].id =='' ||item[key].enable =='0') {
                           delete item[key].id
                           item[key].enable = '0'
                       }
                   }
               })
           })
            
            this.$api.settingApi.editPaymentSetting(data).then((res) => {
                if (res.error === 0) {
                    this.$Message.success('操作成功')
                    this.getSetting()
                }
            })
        },
        submitData() {
            this.$refs[this.tabPoint].validate()
        },
        // 刷新模板列表
        handleRefresh(type) {
            this.$api.settingApi.getPaymengtSetting().then((res) => {
                if (res.error === 0) {
                    if (type === 'wechat_template') {
                        this.wechatTemp = res.wechat_template
                    } else if (type === 'alipay_template') {
                        this.alipayTemp = res.alipay_template
                    }
                    this.$Message.success('获取模板列表成功')
                }
            })
        },
    },
}
</script>

<style scoped lang="scss">
.content {
    margin: 20px auto 0;
    background: #fff;
    /deep/ .ivu-tabs-bar {
        padding: 0 34px;
        margin-bottom: 0;
        .ivu-tabs-tab {
            padding: 12px 30px;
        }
        .ivu-tabs-nav {
            height: 50px;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
            display: flex;
            align-items: center;
            text-align: center;
        }
    }
    /deep/ .ivu-tabs-content {
        padding: 40px;
    }
}
</style>
