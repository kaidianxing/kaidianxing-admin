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
            <Payment
                ref="payment"
                :wechatTemp="wechatTemp"
                :alipayTemp="alipayTemp"
                :setting="setting"
            ></Payment>
        </div>
        <div slot="btn">
            <Button class="primary-long" :disabled='noManagePerm' @click="handleSave">提交</Button>
        </div>
    </kdx-content-bar>
</template>

<script>
import Payment from './components/Payment'
export default {
    name: 'index',
    components: {
        Payment
    },
    data() {
        return {
            setting: {},
            wechatTemp: [],
            alipayTemp: []
        }
    },
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('sysset.pay_set.manage')
        },
    },
    mounted() {
        this.getData()
    },
    methods: {
        handleSave() {
            this.$refs.payment.validate().then(data => {
                this.$api.settingApi.editPaySetting(data).then(res=>{
                    if(res.error === 0) {
                        this.$Message.success('操作成功')
                        this.getData()
                    }
                })
            })
        },
        getData() {
            this.$api.settingApi.getPaySetting().then(res => {
                if (res.error == 0) {
                    let {
                        alipay_template,
                        wechat_template,
                        pay_type_commission,
                        pay_type_withdraw,
                        pay_red_pack_money,
                        alipay,
                        wechat
                    } = res
                    this.setting = {
                        alipay,
                        wechat,
                        pay_type_commission,
                        pay_type_withdraw,
                        pay_red_pack_money
                    }

                    this.wechatTemp = wechat_template
                    this.alipayTemp = alipay_template
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.content {
    background-color: #ffffff;
    margin-top: 20px;
    padding: 40px;
    min-height: calc(100% - 20px);

    /deep/ .ivu-tabs-content {
        padding: 40px;
    }
}
</style>
