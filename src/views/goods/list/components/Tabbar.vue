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
    <div class="tabBar">
        <div class="tab" :class="{active: tabCent.id==item.id}" v-for="item in tabList" :key="item.id" @click="tabClick(item)">{{item.tabTit}}</div>
    </div>
</template>

<script>
    export default {
        name: "Tabbar",
        props: {
            tabList: {
                type: Array,
                default: ()=> []
            }
        },
        data() {
            return {
                type: 0,
                tabCent: {
                    id: 'h5',
                    tabTit: 'h5',
                    tabLink: '商品链接',
                    isShow: false
                },
            }
        },
        methods: {
            tabClick(val) {
                this.tabCent.id = val.id
                this.$emit('tabContent',val)
            }
        }
    }
</script>

<style scoped lang="scss">
    .tabBar {
        background: #F4F6F8;
        border-radius: 2px 2px 0px 0px;
        height: 40px;
        width: 100%;
        line-height: 40px;
        display: flex;
        flex-direction: row;
        .tab {
            font-weight: 400;
            font-size: 14px;
            color: #262B30;
            flex: 1;
            text-align: center;
            cursor: pointer;
            position: relative;
            &.active {
                color: #2D8CF0;
                font-weight: 600;
                &:after {
                    content: '';
                    position: absolute;
                    bottom: 0px;
                    height: 2px;
                    width: 48px;
                    margin-left: -24px;
                    background: #2D8CF0;
                    left: 50%;
                    transition: all .5s
                }
            }

        }
    }
</style>