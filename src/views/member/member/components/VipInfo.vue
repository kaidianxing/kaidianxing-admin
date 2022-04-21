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
    <div class="data-vip-info-header">
        <header-title title="会员累计数据" :text="updateTimeText" :max-width="340">
            <template #tooltip>
                <Form :label-width="90">
                    <FormItem label="累计会员数/人：">
                        注册会员总数
                    </FormItem>
                    <FormItem label="访问会员数/人：">
                        访问商城登录会员数
                    </FormItem>
                    <FormItem label="付款会员/人：">
                        累计所有成功付款的会员数，一人多次付款记为一人。货到付款在发货后，计入付款订单（包含退款订单）
                    </FormItem>
                    <FormItem label="流失率：">
                        (30天内未访问商城的会员数/累计会员）*100%
                    </FormItem>
                </Form>
            </template>
        </header-title>
        <Row>
            <Col span="6">
                <card-panel type="success" icon="icon-shuju-huiyuanshu" title="累计会员数">
                    {{data.member_count || '0'}}
                </card-panel>
            </Col>
            <Col span="6">
                <card-panel type="success" icon="icon-shuju-liulanliang" title="访问会员数">
                    {{data.member_pv_count || '0'}}
                </card-panel>
            </Col>
            <Col span="6">
                <card-panel type="success" icon="icon-shuju-fufeihuiyuan" title="付费会员数">
                    {{data.order_pay_member_count || '0'}}
                </card-panel>
            </Col>
            <Col span="6">
                <card-panel type="success" icon="icon-shuju-liushishuai" title="流失率">
                    {{parseFloat(data.un_view_scale) || '0'}}%
                </card-panel>
            </Col>
        </Row>
    </div>
</template>

<script>
    import HeaderTitle from "../../compnents/HeaderTitle";
    import CardPanel from "../../compnents/CardPanel";

    export default {
        name: "SearchHeader",
        components: {HeaderTitle, CardPanel},
        props: {
            data: {
                type: Object,
                default: () => {
                }
            }
        },
        computed: {
            updateTimeText() {
                return this.$store.state.config?.data?.updateTimeText;
            }
        },
    };
</script>

<style scoped lang="scss">
    .data-vip-info-header {
        background-color: #ffffff;
        padding: 30px 40px;

        .data-header-title {
            padding-bottom: 30px;
        }

        .ivu-row {
            margin-left: -10px;
            margin-right: -10px;

            .data-card-panel {
                padding: 0 10px;
            }
        }
    }
</style>
