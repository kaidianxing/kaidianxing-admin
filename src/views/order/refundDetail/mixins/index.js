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
export default {
    data() {
        return {
            status: 0,
            step: {
                status: 'process',
                lastTitle: '退款完成'
            },
            info: {},
            id: '',
            ids: '',
            member_id: '', // 会员id
            is_refund: '1',
            refund_info: {},
            modal: {
                refundModal: 0,
                id: ''
            },
            commission_info: {
                '1': {
                    commission: null,
                    level: '1',
                    nickname: ""
                },
                '2': {
                    commission: null,
                    level: '2',
                    nickname: ""
                },
                '3': {
                    commission: null,
                    level: '3',
                    nickname: ""
                }
            },
            visible: false,
            orderNo: '',
            form: {
                id: '',
                content: ''
            }
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            let data = {
                order_id: this.id,
                is_refund: this.is_refund
            }
            if (this.ids) {
                data.order_goods_id = this.ids
            }
            this.$api.orderApi.getOrderDetail(data).then(res => {
                let { error, ...info } = res
                if (error === 0) {
                    this.info = info
                    if(info.commission_info) {
                        this.commission_info = {...this.commission_info,...info.commission_info}
                    } else {
                        this.commission_info = null
                    }

                    this.status = info.refund_info.status
                    this.orderNo = info.order_no
                    if (info.refund_info.images) {
                        info.refund_info.images = JSON.parse(info.refund_info.images).map(v => {
                            return this.$media(v)
                        })
                    }
                    this.member_id = info.member_id
                    this.refund_info = info.refund_info
                    this.form = {
                        id: info?.form?.id,
                        content: info?.form?.content? JSON.parse(info.form.content) : ''
                    }
                }
            })
        },
        dealRefund() {
            this.modal.refundModal++
        },
        editCommision() {
            this.visible = true
        },
        changeGoodsInfo(orderGoods) {
            this.info.orderGoods = orderGoods;
        },
    },
    computed: {
        getStatus() {
            if (0 <= this.status && this.status <= 3) {
                return 'wait'
            } else if (this.status > 3) {
                return 'finish'
            } else {
                return 'error'
            }
        },
    },
    watch: {
        '$route.path': {
            handler() {
                let { id, is_refund, ids } = this.$route.query
                this.is_refund = is_refund
                this.id = id
                this.ids = ids
            },
            immediate: true
        },
    },
    filters: {
        getTime(time) {
            if (time === '0000-00-00 00:00:00') {
                return ' '
            } else {
                return time
            }
        }
    }
}
