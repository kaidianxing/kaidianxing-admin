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
    <div>

        <!--下单时间等等-->
        <div class="table-content-time">
            <div class="left">
                <!--微信图标  订单来源 10:wap-h5 20:公众号 21:微信小程序 30:字节跳动小程序 50:PC	-->
                <!--公众号-->
                <Tooltip content="公众号" placement="top">
                    <span v-if="item.create_from == '20'" class="iconfont icon-weixin icon"></span>
                </Tooltip>
                <!--微信小程序-->
                <Tooltip content="微信小程序" placement="top">
                    <span v-if="item.create_from == '21'" class="iconfont icon-weixinxiaochengxu icon"></span>
                </Tooltip>
                <!--头条小程序-->
                <Tooltip content="头条小程序" placement="top">
                    <kdx-svg-icon class="iconfont icon" type="icon-qudao-toutiao2"
                              v-if="item.create_from == '30'"></kdx-svg-icon>
                    <kdx-svg-icon class="iconfont icon" type="icon-qudao-toutiaojisuban"
                              v-if="item.create_from == '32'"></kdx-svg-icon>
                </Tooltip>
                <!--抖音小程序-->
                <Tooltip content="抖音小程序" placement="top">
                    <kdx-svg-icon class="iconfont icon" type="icon-douyin" v-if="item.create_from == '31'"></kdx-svg-icon>
                </Tooltip>
                <!--支付宝小程序-->
                <!--<span v-if="item.create_from == '3'" class="iconfont icon-zhifubaoxiaochengxu icon"></span>-->
                <!--百度小程序-->
                <!--<span v-if="item.create_from === '0'" class="iconfont icon-baiduxiaochengxu icon"></span>-->
                <!--h5-->
                <Tooltip content="手机浏览器H5" placement="top">
                    <span v-if="item.create_from == '10'" class="iconfont icon-H icon"></span>
                </Tooltip>
                <Tooltip content="PC" placement="top">
                    <span v-if="item.create_from == '70'" class="iconfont icon-PCduan "></span>
                </Tooltip>
                <!-- 活动订单标识 -->
                <!-- 秒杀 -->
                <div v-if="item.activity_type == 2" class="activity-icon">
                    <Tooltip content="秒杀订单" placement="top">
                        <span class="iconfont icon-dingdanliebiao-miaosha seckill"></span>
                    </Tooltip>
                </div>
                <!-- 拼团 -->
                <div v-if="item.activity_type == 3" class="activity-icon">
                    <Tooltip content="拼团订单" placement="top">
                        <span class="iconfont icon-yingyong-pintuan groups"></span>
                    </Tooltip>
                </div>
                <span class="text">下单时间：{{ item.created_at }}</span>
                <span class="text1">订单编号：{{ item.order_no }}</span>
                <kdx-copy-text :text="item.order_no">
                    <Button type="text" size="small">复制</Button>
                </kdx-copy-text>

            </div>
            <div class="right">

                <span @click="jumpEOrder(item.order_no)" v-if="hasOrderSheet(item) && !item.not_show_express">发货单</span>
                <span @click="jumpEOrder(item.order_no)"
                      v-if="hasOrderSheet(item) && !item.not_show_express && virtualGood(item)">电子面单</span>
                <!--订单详情-->
                <span  type="text" @click="handlePrinter(item.id)">打印小票</span>

                <span class="remaining-time"
                      v-if="item.status === '0' && item.auto_close_time * 1000 - Date.now() > 0 && countTime">
                {{ countTime }}
            </span>
                <!--订单详情-->
                <span  @click="checkDetail(item.id, item.status)">订单详情</span>
                <!-- 备注 -->
                <Button type="text" :class="{
                'remark-on': item.seller_remark,
            }"  @click="handlerRemark">备注
                </Button>
            </div>
            <kdx-modal-frame v-model="printerModal" title="请选择相关信息" :width="610" @on-cancel="printerCancel"
                         @on-ok="printerOk">
                <div class="printer-modal">
                    <Form ref="form" :label-width="120" :model="printerModelData" :rules="rules" @submit.native.prevent>
                        <FormItem label="打印机：" prop="printer_id">
                            <Select class="width-340" v-model="printerModelData.printer_id" placeholder="请选择打印机">
                                <Option v-for="item in printerList" :key="item.id" :value="item.id">{{ item.name }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="打印模板：" prop="template_id">
                            <Select class="width-340" v-model="printerModelData.template_id" placeholder="请选择打印模板">
                                <Option v-for="item in templateList" :key="item.id" :value="item.id">{{ item.name }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
            </kdx-modal-frame>

            <!-- 商家备注 -->
            <kdx-modal-frame v-model="remarkModal" title="商家备注" :width="520" @on-cancel="remarkModalClose"
                         @on-ok="remarkModalOk">
                <div class="remark-modal">
                    <Form>
                        <FormItem>
                            <Input type="textarea" placeholder="请输入" maxlength="200" :autosize="{minRows:4}"
                                   show-word-limit v-model="remarkText"/>
                        </FormItem>
                    </Form>
                </div>
            </kdx-modal-frame>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        countTime: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            printerList: [],
            templateList: [],
            printerModal: false,
            printerModelData: {
                printer_id: '',
                template_id: '',
                order_id: '',
            },
            rules: {
                printer_id: [
                    {required: true, message: '请输入打印机名称'}
                ],
                template_id: [
                    {required: true, message: '请选择打印模板'}
                ],
            },
            remarkText: '',
            remarkModal: false,

        }
    },
    methods: {
        // 跳转电子面单打印
        jumpEOrder(order_no) {
            let url = `/eOrder/orderPrint/index?order_no=${order_no}`
            this.$utils.openNewWindowPage(url)
        },
        // 查看详情
        checkDetail(id, status) {

            let path = "";
            if (status == "10" || status == "11") {
                path = "/order/detail/send";
            } else if (status == "0") {
                path = "/order/detail/payment";
            } else if (status == "20") {
                path = "/order/detail/receive";
            } else if (status == "30") {
                path = "/order/detail/achieve";
            } else if (status == "-1") {
                path = "/order/detail/close";
            }
            this.$router.push({
                path,
                query: {
                    id
                }
            });
        },
        // 打印小票
        handlePrinter(id) {
            this.$api.printerApi.printerList({only_list: 1, status: 1}).then(res => {
                if (res.error == 0) {
                    if (res.data.length <= 0) {
                        this.toPrinterList()
                    } else {
                        this.printerList = res.data;
                        this.checkPrinter(id)
                    }
                }
            })
        },
        toPrinterList() {
            this.$Modal.confirm({
                title: '提示',
                content: '您当前还未配置打印机，立即前往进行配置。',
                okText: '立即配置',
                cancelText: '暂不配置',
                onOk: () => {
                    this.$utils.openNewWindowPage('/printer/manage/list');
                },
                onCancel: () => {

                }
            });
        },
        getPrinterTemList() {
            this.$api.printerApi.getPrinterTemList({only_list: 1}).then(res => {
                if (res.error == 0) {
                    this.templateList = res.data;
                    this.printerModal = true;
                }
            })
        },
        checkPrinter(id) {
            this.$api.printerApi.executePrinter({order_id: id, is_check: 1}).then(res => {
                if (res.error == 0) {
                    this.printerModelData.order_id = id;
                    if (res?.message > 0) {
                        this.checkPrinterNum(res.message)
                    } else {
                        this.getPrinterTemList()
                    }
                }
            })
        },
        checkPrinterNum(num) {
            this.$Modal.confirm({
                title: '提示',
                content: `您已经打印${num}次，是否继续打印`,
                okText: '立即打印',
                cancelText: '暂不打印',
                onOk: () => {
                    this.getPrinterTemList()
                },
                onCancel: () => {

                }
            });
        },
        printerCancel() {
            this.printerModal = false;
        },
        printerOk() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.$api.printerApi.executePrinter(this.printerModelData).then(res => {
                        if (res.error == 0) {
                            this.$Message.success('打印成功');
                        }
                        this.printerModal = false;
                    })
                }
            });
        },
        // 备注操作
        handlerRemark() {
            this.remarkModal = true;
            this.remarkText = this.item.seller_remark
        },
        remarkModalClose() {
            this.remarkModal = false;
        },
        remarkModalOk() {
            this.$api.orderApi.setOrderRemark({order_id: this.item.id, seller_remark: this.remarkText}).then(res => {
                if (res.error == 0) {
                    this.$Message.success('保存成功')
                    this.remarkModal = false;
                    this.$emit('on-refresh')
                }
            })

        },
        // 判断显示发货单和电子面单
        hasOrderSheet(item) {
            return item.icon?.electronic_sheet === 1
        },
        // 判断商品类型
        virtualGood(item) {
            return !(item.order_goods[0]?.type == 1)
        },
    }
};
</script>

<style lang="scss" scoped>
// 下单时间
.table-content-time {
    &.control {
        background: #f00;
    }

    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding: 0 20px;
    align-items: center;
    @include font-14-20;
    background-color: $background-color;
    height: 50px;
    border-right: 1px solid $border-color;

    > .left {
        .icon {
            font-size: 24px;
            margin-right: 4px;
            vertical-align: middle;
        }

        .icon-PCduan{
            color:#12aa9c;font-size:20px;
            margin-right: 5px;
            position: relative;
            top: 3px;
        }
        .icon-weixin {
            color: $success-color;
        }

        .icon-weixinxiaochengxu {
            color: #677de0;
        }

        .icon-toutiaoxiaochengxu {
            color: #239bff;
        }

        .icon-zhifubaoxiaochengxu {
            color: #2094e7;
        }

        .icon-baiduxiaochengxu {
            color: #306cff;
        }

        .icon-H {
            color: #ff6004;
        }

        > .text {
            padding-right: 20px;
            color: $text-third;
        }

        > .text1 {
            padding-right: 10px;
            color: $text-third;
        }

        .activity-icon {
            display: inline-block;
            margin-right: 4px;
            width: 24px;
            height: 24px;
            padding: 2px;
            vertical-align: middle;

            .icon {
                display: inline-block;
                width: 20px;
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                color: #fff;
                text-align: center;
                border-radius: 50%;
            }


            .seckill, .credit, .groups {
                margin-right: 4px;
                font-size: 24px;
            }

            .seckill {
                color: #ff1f2c;
            }

            .credit {
                color: #6100FF;
            }
            .groups {
                color: #F66000;
            }
        }
    }

    > .right {
        display: flex;
        align-items: center;

        span {
            padding-left: 10px;
            padding-right: 10px;
            border-right: 1px solid #B8B9BD;
            color: $brand-color;
            cursor: pointer;
        }

        > .remaining-time {
            color: $danger-color;
            cursor: auto;
        }

        /deep/ .ivu-btn {
            margin-left: 10px;
        }

        .remark-on {
            /deep/ span {
                color: #FF1F2C;
            }
        }
    }
}

.printer-modal {
    padding: 30px 0;
}

.remark-modal {
    padding: 40px;
}

.tip-wp {
    padding-left: 22px;

    * {
        vertical-align: middle;
    }

    $rz: 20px;

    img {
        width: $rz;
        height: $rz;
        border-radius: 41px;
        margin-right: 6px;
    }

    .tith {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        display: inline-block;
        width: 70px;
        font-size: 14px;
        line-height: 20px;
        color: #939799;
    }
}
</style>
