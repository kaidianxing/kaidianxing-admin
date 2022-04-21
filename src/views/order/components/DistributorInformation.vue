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
    <div class="order-detail-distributor-information">
        <ul>
            <li v-for="(item,index) of commisionInfo" :key="index">
                <p class="title">{{index|getLevel}}</p>
                <div class="content">
                    <div class="label">姓名：</div>
                    <div class="price" v-if="!item.nickname">-</div>
                    <div class="name" v-else @click="goMember(item.id)">{{item.nickname}}</div>
                </div>
                <div class="content">
                    <div class="label">预计佣金：</div>
                    <div class="price" v-if="item.commission">￥{{item.commission}}</div>
                    <div class="price" v-else>-</div>
                    <div>
                        <span class="iconfont icon-shangpinliebiao-bianji icon" style="font-size: 20px;line-height: 16px;" @click="editCommision"></span>
                    </div>
                    <div class="label" v-if="item.ladder_commission>0&&index==1">(含阶梯佣金：￥{{item.ladder_commission}})</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
// 分销商信息
export default {
    name: 'DistributorInformation',
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            commisionInfo: {}
        }
    },
    filters: {
        getLevel(level){
            let objText = { 
                '1':'一级分销商',
                '2':'二级分销商',
            }
            return objText[level]
        }
    },
    watch: {
        info: {
            handler(val) {
                this.commisionInfo = val
            },
            immediate: true
        }
    },
    methods: {
        goMember(id){
            this.$router.push({
                path:'/member/detail',
                query:{id}
            })
        },
        editCommision(){
            this.$emit('edit',this.commisionInfo)
        }
    }
}
</script>

<style scoped lang="scss">
.order-detail-distributor-information {
    padding: 40px 40px 0;
    > ul {
        padding-bottom: 50px;
        display: flex;
        flex-wrap: wrap;

        > li {
            padding-right: 200px;

            &:last-child {
                padding-right: 0;
            }

            > .title {
                width: 120px;
                text-align: center;
                @include font-14-20-bold;
                color: $text-first;
                padding-bottom: 20px;
            }

            > .content {
                display: flex;
                flex-wrap: nowrap;
                padding-bottom: 10px;

                > .label {
                    width: 120px;
                    padding-right: 10px;
                    text-align: right;
                    color: $text-third;
                    @include font-12-16;
                }

                > .name {
                    @include font-12-16;
                    color: $brand-color;
                    cursor: pointer;
                }

                > .price {
                    @include font-12-16;
                    color: $text-first;
                }
            }
        }
    }
}
</style>
