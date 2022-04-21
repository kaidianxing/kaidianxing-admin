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
    <div class="home-content">
        <div class="header">
            <home-header />
        </div>
        <div class="condition">
            <operating-conditions />
        </div>
        <div class="center" v-if="commissionSetting.commission_level != 0">
            <home-center />
        </div>
        <div class="leaderboard">
            <leader-board />
        </div>
        <slot></slot>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    props: {
        containerScrollTop:{
            type:Function,
            default: () =>{}
        }
    },
    components: {
        HomeHeader:()=>import('./components/HomeHeader'),
        OperatingConditions:()=>import('./components/OperatingConditions'),
        HomeCenter:()=>import('./components/HomeCenter'),
        LeaderBoard:()=>import('./components/LeaderBoard'),
    },
    computed: {
        ...mapState('config',{
            commissionSetting: state => state.commission.setting,
            shop_expire_day: state => state.shop_expire_day,
            is_trial:state=>  state.is_trial
        }),
    },
}
</script>

<style scoped lang="scss">
.home-content {
    background-color: $background-color;
    min-height: 100%;
    margin: 20px auto;
    .header {
        margin-bottom: 10px;
        min-height: 64px;
    }
    .condition {
        margin-bottom: 10px;
        min-height: 661px;
    }
    .center {
        margin-bottom: 10px;
        min-height: 111px;
    }
}
</style>
