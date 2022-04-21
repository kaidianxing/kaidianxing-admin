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
    <div class="data-card">
        <ul v-if="tmpList && tmpList.length">
            <li v-for="(item, index) in tmpList" :key="index">
                <div class="card-box" :class="{'hover': !type && item.key !='ladder_commission_count' && item.key != 'agent_ladder_count'}" @click="skipToOtherPage(item)">
                    <div class="image" v-if="item.image">
                        <img :src="item.image" alt="">
                    </div>
                    <div class="card-content">
                        <div class="title flex">
                            <div class="line-hide">
                                {{item.title}}
                            </div>
                            <kdx-hint-tooltip v-if="item.tooltip">
                                {{item.tooltip.content}}
                            </kdx-hint-tooltip>
                        </div>
                        <div class="number">
                            <div v-if="data[item.key]&&data[item.key].wait_send">
                                <span>{{ data[item.key].wait_send }}</span>
                                <span class="no-hover">/</span>
                                <span class="no-hover">{{ data[item.key].order_count }}</span>
                            </div>
                            <div v-else-if="item.key=='ladder_commission_count'">
                                <span>{{ data[item.key]}}</span>
                                <span class="no-hover">/</span>
                                <span class="no-hover">{{ data.ladder_remit_success_count }}</span>
                            </div>
                            <div v-else-if="item.key=='agent_ladder_count'">
                                <span>{{ data[item.key]}}</span>
                                <span class="no-hover">/</span>
                                <span class="no-hover">{{ data.agent_count }}</span>
                            </div>
                            <div v-else>
                                {{item.prefix || ''}}{{data[item.key] || '0'}}
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

/**
 * 用于数据的展示card
 */
export default {
    name: "DataCard",
    props: {
        tmpList: {
            type: Array,
            default: () => []
        },
        data: {
            type: Object,
            default: () => {}
        },
        type: {
            type: String,
            default: ''
        },
        // 需要带入的其他参数
        params: {
            type: Object,
            default: () => {}
        },
    },
    methods: {
        skipToOtherPage(e) {
            if (e.key === 'credit_wait_order') {
                this.$router.push({
                    path: '/order/list/send',
                    query: {activity_type: '5'}
                })
            }
        }
    }
};
</script>

<style scoped lang="scss">
.data-card {
    >ul {
        display: flex;
        margin: -10px;
        >li {
            padding: 10px;
            box-sizing: border-box;
            /*width: 25%;*/
            flex: 1;
        }
    }
    .card-box {
        border: 1px solid $border-color;
        border-radius: 2px;
        padding: 30px;
        display: flex;
        background: linear-gradient(180deg, #F7F8FF 0%, #fff 100%);
        &.hover:hover {
            border-color: #4A67FF;
            .number {
                color: #4A67FF;
            }
            .no-hover {
                color: #111
            }
        }
    }
    .image {
        width: 60px;
        height: 60px;
        flex-shrink: 0;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .card-content {
        color: $text-first;
        padding-left: 20px;
        .title {
            @include font-12-16;
        }
        .number {
            @include font-30-36-500;
            padding-top: 5px;
        }
    }
}
@media  screen and (max-width: 1500px) {
    .data-card {
        .card-box {
            padding: 20px;
        }
        .image {
            width: 48px;
            height: 48px;
        }
        .card-content {
            padding-left: 10px;
            .number {
                font-size: 26px;
            }
        }
    }
}
</style>
