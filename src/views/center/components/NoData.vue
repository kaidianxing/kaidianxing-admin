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
    <div class="comp">
        <div class="icon">
            <span class="iconfont icon-fenxiao-leijiyongjin-"></span>
        </div>
        <div class="tips">暂无数据，请重新搜索或 <span @click="handleReset">查看全部</span></div>
    </div>
</template>

<script>
export default {
    props: [],
    data() {
        return {}
    },
    methods: {
        // 重置
        handleReset() {
            this.$emit('handleReset')
        },
    },
}
</script>

<style lang="scss" scoped>
.comp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 120px;
    .icon {
        display: flex;
        .iconfont {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 80px;
            color: #b8b9bd;
        }
    }
    .tips {
        font-size: 14px;
        line-height: 20px;
        color: #636669;
        margin-top: 20px;
        span {
            cursor: pointer;
            color: $brand-color;
        }
    }
}
</style>
