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
        <div class="market-send-coupons-activity">
            <Tabs v-model="value" :animated="false" @on-click="tabClick">
                <TabPane label="新人券" name="new">
                    <new-user v-if="value === 'new'"></new-user>
                </TabPane>
                <TabPane label="满额送券" name="full">
                    <full-send v-if="value === 'full'"></full-send>
                </TabPane>
                <TabPane label="购物送券" name="shop">
                    <shopping-send v-if="value === 'shop'"></shopping-send>
                </TabPane>
            </Tabs>
        </div>
    </kdx-content-bar>
</template>

<script>
    import NewUser from './newUser/index.vue';
    import FullSend from './fullSend/index';
    import ShoppingSend from './shoppingSend/index';
    export default {
        name: "add",
        components: {
            NewUser,
            FullSend,
            ShoppingSend
        },
        watch: {
            '$route.path': {
                handler() {
                    this.value = this.$route.params.id;
                },
                immediate: true
            }
        },
        data() {
            return {
                value: 'new'
            };
        },
        methods: {
            tabClick(name) {
                this.$router.push({
                    path: `/market/coupons/send/${name}`
                });
            }
        }
    };
</script>

<style lang="scss">
    .market-send-coupons-activity {
        background-color: #ffffff;
        min-height: 100%;
        margin:20px auto 0;
        .ivu-tabs-bar {
            margin-bottom: 20px;
            padding: 0 30px;
            .ivu-tabs-tab {
                padding: 12px 30px;
                @include font-18-25-bold;
            }
        }
        .ivu-tabs .ivu-tabs-tabpane {
            /*height: inherit;*/
        }
    }
</style>
