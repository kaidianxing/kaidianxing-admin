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
    <div class="order-detail">
        <!--订单状态---步骤-->
        <Card shadow :bordered="false">
            <Steps :current="current" :status="step.status">
                <Step v-for="(item, index) in stepList" :key="index" :title="item.title" :content="item.content"></Step>
            </Steps>
        </Card>
        <div class="order-detail-content">
            <order-status :data="data" @on-refresh="getData"></order-status>
        </div>
        <div class="order-detail-con">
            <ul class="detail_tab">
                <li class="tab" @click="clickTab(0)" :class="{active: 0 == clickIndex}">商品信息</li>
                <li class="tab" @click="clickTab(1)" :class="{active: 1 == clickIndex}" v-if="commission_info">分销商信息</li>
                <li class="tab" @click="clickTab(2)" :class="{active: 2 == clickIndex}" v-if="form.content">表单信息</li>

            </ul>
            <!--表单信息 isShow 控制表头显示-->
            <form-info v-if="form.content && clickIndex == 2" :data="form.content" :isShow="false"></form-info>
            <!--分销商(没有分销则不显示)-->
            <distributor-information
                    :info="commission_info"
                    v-if="commission_info && clickIndex == 1"
                    @edit="editCommision"
            ></distributor-information>
            <order-detail-list :data="data" @on-refresh="getData"  v-if="clickIndex==0"></order-detail-list>
        </div>
        <commission-edit
                :orderId="id"
                :orderNo="orderNo"
                :memberId="member_id"
                :visible.sync="visible"
                @on-success="getData"
        ></commission-edit>
        <slot></slot>
    </div>
</template>

<script>
    import OrderStatus from './components/OrderStatus'
    import DistributorInformation from '@/views/order/components/DistributorInformation'
    import OrderDetailList from '@/views/order/components/OrderDetailList'
    import CommissionEdit from '../components/CommissionEdit'
    import FormInfo from '@/components/form/FormInfo';
    export default {
        // 订单状态
        name: 'index',
        components: {
            OrderStatus,
            OrderDetailList,
            DistributorInformation,
            CommissionEdit,
            FormInfo,
        },
        data() {
            return {
                current: 0,
                step: {
                    lastTitle: '订单完成',
                    lastIcon: '',
                    status: 'finish'
                },
                data: {},
                form: {},
                id: '',
                visible: false,
                stepList: [],
                orderNo: '',
                member_id: '',
                commission_info: {
                    '1': {
                        commission: '0',
                        level: '1',
                        nickname: ""
                    },
                    '2': {
                        commission: '0',
                        level: '2',
                        nickname: ""
                    }
                },
                clickIndex: 0, //tab选中
            }
        },
        methods: {
            initStep() {
                let stepList = [
                    {
                        title: '买家下单',
                        content: this.getTime(this.data.created_at),
                        show: true
                    },
                    {
                        title: '商家发货',
                        content: this.getTime(this.data.send_time),
                        show: true
                    },
                    {
                        title: '订单完成',
                        content: this.getTime(this.data.finish_time),
                        show: this.data?.status != -1

                    },
                    {
                        title: '订单关闭',
                        content: this.getTime(this.data.finish_time),
                        show: this.data?.status == -1
                    },
                ];
                this.stepList = stepList.filter(item => item.show);
                this.getCurrent()
            },
            getCurrent() {
                // 订单状态 0代付款 10待发货 11部分发货 20待收货 30已完成 -1订单关闭
                switch (this.data?.status) {
                    case '0':
                        break
                    case '10':
                    case '11':
                    case '20':
                        this.current = 2
                        break
                    case '30':
                        this.current = 3
                        break
                    case '-1':
                        this.step.status = 'error'
                        this.current = 3
                }
            },
            getData() {
                this.$api.orderApi.getOrderDetail({order_id: this.id}).then(res => {
                    if (res.error === 0) {
                        this.data = res
                        this.orderNo = res.order_no

                        if (res.commission_info) {
                            this.commission_info = {...this.commission_info, ...res.commission_info}
                        } else {
                            this.commission_info = null
                        }
                        this.member_id = res.member_id
                        this.form = {
                            id: res.form?.id,
                            content: res?.form?.content ? JSON.parse(res.form.content) : ''
                        };
                        this.initStep();
                        this.openDetailPage(res.status)
                    }
                })
            },
            getTime(date, type) {
                if (type === 'error') {
                    date = this.data.cancel_time
                }
                if (date && new Date(date).getTime()) {
                    return date
                } else {
                    return ''
                }
            },
            // 根据状态打开不同的状态路由
            openDetailPage(status) {
                let path = ''
                if (status == '10' || status == '11') {
                    path = '/order/detail/send'
                } else if (status == '0') {
                    path = '/order/detail/payment'
                } else if (status == '20') {
                    path = '/order/detail/receive'
                } else if (status == '30') {
                    path = '/order/detail/achieve'
                } else if (status == '-1') {
                    path = '/order/detail/close'
                }
                if (this.$route.path !== path) {
                    this.$router.replace({
                        path,
                        query: {
                            id: this.id
                        }
                    })
                }
            },
            editCommision() {
                this.visible = true
            },
            changeGoodsInfo(orderGoods) {
                this.data.orderGoods = [...orderGoods];
            },
            // 切换tab
            clickTab(i) {
                this.clickIndex = i
            }
        },
        watch: {
            '$route.path': {
                handler() {
                    this.id = this.$route.query.id
                    this.getData()
                },
                immediate: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .order-detail {
        background-color: $background-color;
        margin: 20px auto;

        .ivu-card {
            box-shadow: none;
        }

        .order-detail-con {
            background-color: #ffffff;
            margin-top: 10px;
            .detail_tab {
                display: flex;
                flex-direction: row;
                height: 49px;
                line-height: 50px;
                border-bottom: 1px solid #E9EDEF;
                .tab {
                    font-size: 18px;
                    color: #262b30;
                    font-weight: 600;
                    margin-left: 60px;
                    position: relative;
                cursor: pointer;
                    &:first-child {
                        margin-left: 38px;
                    }
                    &.active {
                        color: #2d8cf0;
                        &:after {
                            content: '';
                            position: absolute;
                            left: 0;
                            bottom: 0;
                            width: 100%;
                            height: 3px;
                            background-color: #2d8cf0;
                        }
                    }
                }
            }
        }

        .order-detail-content {
            background-color: #ffffff;
            margin-top: 10px;
            padding: 30px 40px;
        }

        /deep/ .ivu-card-body {
            padding: 30px;

            .ivu-steps {
                padding: 0 130px;
            }
        }
    }
</style>
