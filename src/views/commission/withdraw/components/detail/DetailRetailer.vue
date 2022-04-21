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
        <p class="title">分销商信息</p>
        <div class="flex align-center user">
            <img :src="$media(info.avatar)" class="user-avatar" @error="replaceImg" />
            <span class="user-name" @click="jumpVip(applyInfo.member_id)">{{info.nickname}}</span>
        </div>
        <div class="flex align-center info-list">
            <div class="info-label">联系电话：</div>
            <i class="iconfont icon-dianhua tel-icon"></i>
            <div class="info-desc bold">{{info.mobile}}</div>
        </div>
        <div class="flex align-center info-list" v-for="list in infoList" :key="list.key">
            <div class="info-label">{{list.text}}</div>
            <div class="info-desc bold">￥{{info[list.key]||'0.00'}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        applyInfo: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            infoList: [
                { text: '累计佣金：', key: 'commission_total' },
                { text: '待打款佣金：', key: 'wait_remit_commission' },
                { text: '待入账佣金：', key: 'wait_settlement_commission' }
            ]
        }
    },
    methods: {
        replaceImg(e){
            e.target.src = this.$utils.staticImg('decorate/avatar.png')
        },
        // 跳转会员详情
        jumpVip(id) {
            this.$utils.openNewWindowPage('/member/detail', {id: id});
        },
    }
}
</script>

<style lang="scss" scoped>
.title {
    @include font-16-22-bold;
    color: $text-first;
    padding: 0 0 20px 20px;
}

.user {
    padding-left: 20px;
    margin-bottom: 17px;

    &-avatar {
        border-radius: 50%;
        margin-right: 10px;
        height: 30px;
        width: 30px;
    }
    &-name {
        @include font-12-16;
        color: $brand-color;
        cursor: pointer;
    }
}

.info-list {
    margin-bottom: 24px;
    @include font-12-16;

    .info-label {
        width: 100px;
        text-align: right;
        color: #262b30;
    }

    .tel-icon {
        font-size: 20px;
        color: #19be6b;
    }

    .info-value {
        color: #262b30;

        &.bold {
            font-weight: bold;
        }
    }
}
</style>
