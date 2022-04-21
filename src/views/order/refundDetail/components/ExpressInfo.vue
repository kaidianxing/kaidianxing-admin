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
    <div class="refund-status">
        <p class="title form-title">客户退货信息</p>

        <Form :label-width="100">
            <FormItem label="快递公司：">
                <span>{{info.member_express_name || '-'}}</span>
                <Button
                    v-if="info.member_express_sn"
                    type="text"
                    @click="lookExpress(info.member_express_sn,info.member_express_code)"
                >查看物流</Button>
            </FormItem>
            <FormItem label="快递单号：" class="refund-money-label">
                <span>{{info.member_express_sn || '-'}}</span>
                <kdx-copy-text
                    type="qrCode"
                    v-if="info.member_express_sn"
                    :text="info.member_express_sn"
                >
                    <Button type="text" size="small">复制</Button>
                </kdx-copy-text>
            </FormItem>
            <FormItem label="发货时间：">
                <span>{{info.member_express_time|getTime }}</span>
            </FormItem>
        </Form>
        <!--商家发货信息-->
        <template v-if="isExchange">
            <p class="title form-title">商家发货信息</p>
            <Form :label-width="100">
                <FormItem label="快递公司：">
                    <span>{{info.seller_express_name || '-'}}</span>
                    <Button
                        v-if="info.seller_express_name"
                        type="text"
                        @click="lookExpress(info.seller_express_sn,info.seller_express_code)"
                    >查看物流</Button>
                </FormItem>
                <FormItem label="快递单号：" class="refund-money-label">
                    <span>{{info.seller_express_sn || '-'}}</span>
                    <kdx-copy-text v-if="info.seller_express_sn " type="qrCode" :text="info.seller_express_sn">
                        <Button type="text" size="small">复制</Button>
                    </kdx-copy-text>
                </FormItem>
                <FormItem label="发货时间：">
                    <span>{{info.seller_express_time|getTime}}</span>
                </FormItem>
            </Form>
        </template>
        <!--查看物流-->
        <express-detail ref="express" :id="id" :sn="sn" :code="code"></express-detail>
    </div>
</template>

<script>
import ExpressDetail from './ExpressDetail'

export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        isExchange: {
            type: Boolean,
            default: false
        },
        dispatch_type: {
            type: [String, Number],
        },
    },
    components: {
        ExpressDetail
    },
    data() {
        return {
            id: '',
            sn: '',
            code: ''
        }
    },

    methods: {
        lookExpress(sn, code) {
            this.id = this.info.order_id
            this.sn = sn
            this.code = code
            this.$nextTick(() => {
                this.$refs.express.setValue()
            })
        }
    },
    filters: {
        getTime(time) {
            if (time === '0000-00-00 00:00:00') {
                return '-'
            } else {
                return time
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    @include font-16-22-bold;
    color: $text-first;
   padding-left: 20px;
    padding-bottom: 20px;
}

.form-title {
    /*width: 100px;*/
    /*text-align: right;*/
}
/deep/ .ivu-btn-text {
    margin-left: 10px;
}
</style>
