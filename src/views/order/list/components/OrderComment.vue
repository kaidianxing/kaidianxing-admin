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
    <div class="table-remark" v-if="list.buyer_remark || list.commission_info">
        <!--买家备注-->
        <div class="left" v-if="list.buyer_remark">
            <span class="remark" v-if="list.buyer_remark">
                    买家备注：{{ list.buyer_remark }}
                </span>
        </div>
        <div class="right" v-if="list.commission_info">
            <span class="text" v-for="(item, commisionIndex) of list.commission_info" :key="commisionIndex">
                {{ commisionIndex | getLevel }}
                <span class="price">
                    {{ item.commission }}元
                </span>
                <span v-if="item.ladder_commission>0" style="color: #939799">(含阶梯佣金{{item.ladder_commission}})</span>
            </span>
            <Button type="text"  @click="editCommision">
                修改佣金
            </Button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            list: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            editCommision() {
                this.$emit('click')
            },
        },
        filters: {
            getLevel(level) {
                let objText = {
                    "1": "一级预计佣金：",
                    "2": "二级预计佣金：",
                };
                return objText[level];
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
