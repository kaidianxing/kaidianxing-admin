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
    <div class="app-list">
        <ul>
            <template>
                <li class="wrap" v-for="(item, index) in list" :key="index" :class="{marginBto:item.list.length>0}">
                    <template v-if="item.list.length">
                        <div class="categoryTitle" v-if="item.category == '10'">
                            <h4 class="title">业务插件</h4>
                            <div class="en">高效管理商城业务运营</div>
                        </div>
                        <div class="categoryTitle" v-else-if="item.category == '11'">
                            <h4 class="title">分销管理</h4>
                            <div class="en">系统化多维度助力分销拓客</div>
                        </div>
                        <div class="categoryTitle" v-else-if="item.category == '12'">
                            <h4 class="title">商城配套</h4>
                            <div class="en">丰富配套满足商城基础运营</div>
                        </div>
                        <div class="categoryTitle" v-else-if="item.category == '20'">
                            <h4 class="title">营销插件</h4>
                            <div class="en">助力实现低成本营销转化</div>
                        </div>
                        <div class="categoryTitle" v-else-if="item.category == '30'">
                            <h4 class="title">辅助工具</h4>
                            <div class="en">深度提升商城运营效率</div>
                        </div>
                    </template>
                    <ul v-if="item.list.length">
                        <li
                            v-for="(subItem, subIndex) in item.list"
                            :key="subIndex"
                            @click="navTo(subItem)"
                            class="mantle"
                        >
                            <div class="box flex">
                                <div class="left">
                                    <div class="img img-custom" v-if="subItem.info_type == 1">
                                        <img :src="$media(subItem.shop_show_logo, 'manage')" @error="replaceImage"/>
                                    </div>
                                    <div class="img" v-else>
                                        <img :src="$media(subItem.logo, 'manage')" @error="replaceImage"/>
                                    </div>
                                </div>
                                <div class="right">
                                    <div class="tit">
                                        <div class="name line-hide" v-if="subItem.info_type == 1">
                                            {{ subItem.shop_show_name }}
                                        </div>
                                        <div class="name line-hide" v-else>{{ subItem.name }}</div>
                                    </div>
                                    <div class="desc line-hide" v-if="subItem.info_type == 1">
                                        {{ subItem.shop_show_description }}
                                    </div>
                                    <div class="desc line-hide" v-else>
                                        {{ subItem.description }}
                                    </div>
                                </div>
                            </div>

                        </li>
                    </ul>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
export default {
    name: "AppList",
    props: {
        list: {
            type: Array,
        },
    },
    methods: {
        navTo(item) {
            this.$emit('on-route', item);
        },
        navToMerchant(item) {
            const supportApp = ['virtualAccount', 'seckill']
            if (supportApp.includes(item.identity)) {
                this.$emit('on-route', item);
            } else {
                this.$Message.error('平台端不支持使用')
            }
        },
    }
};
</script>

<style scoped lang="scss">
.app-list {
    margin-top: 30px;
    flex: 1;

    .wrap {
        &.marginBto {
            margin-bottom: 30px;
        }

        img {
            -webkit-user-drag: none;
        }

        ul {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            li {
                background-color: #F4F6F8;
                /*height: 106px;*/
                box-sizing: border-box;
                padding: 20px 10px;
                position: relative;
                display: flex;
                align-items: center;
                margin-right: 10px;
                border-radius: 2px;
                overflow: hidden;
                margin-top: 15px;
                position: relative;
                // &:nth-child(4n) {
                //     margin-right: 0;
                // }
                .box {
                    position: relative;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    &.flex {
                        display: flex;
                    }

                    .right {
                        padding-left: 12px;
                        flex: 1;
                        width: 0;
                    }

                    .img {
                        width: 42px;
                        height: 42px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        //&.img-custom {自定义的图标变小不需要了不要打开注释2021/10/11
                        //    width: 50px;
                        //    height: 50px;
                        //    margin: 5px;
                        //}

                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .tit {
                        font-size: 16px;
                        font-weight: bold;
                        //@include font-18-25-bold;
                        color: $text-first;
                        /*margin-top: 2px;*/
                        margin-bottom: 4px;
                        display: flex;
                        line-height: 22px;

                        .name {
                            /*flex: 1;*/
                        }

                        .free,
                        .no-buy {
                            margin-left: 8px;
                            line-height: initial;
                            flex-shrink: 0;

                            > span {
                                padding: 2px 10px 2px 8px;
                                color: #ffffff;
                                @include font-12-16;
                                background: linear-gradient(89.27deg, #FF1F2C 28.12%, #FF701F 99.79%);
                                border-radius: 10px 10px 10px 0;
                            }
                        }

                        .free {
                            > span {
                                background: $success-color;
                            }
                        }
                    }

                    .desc {
                        line-height: 20px;
                        color: #939799;
                        font-size: 14px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }

                .tag {
                    position: absolute;
                    right: 0;
                    top: 4px;
                    width: 36px;
                    height: 19px;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                &.category {
                    padding: 20px 10px 20px 30px;

                    img.bg {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }

                    .box {
                        color: #ffffff;

                        .title {
                            font-weight: bold;
                            font-size: 20px;
                            line-height: 28px;
                        }

                        .en {
                            margin-top: 4px;
                            font-size: 12px;
                            line-height: 16px;
                        }

                        .line {
                            background-color: #fff;
                            width: 16px;
                            height: 2px;
                            margin-top: 14px;
                        }
                    }
                }

                &:not(.category) {
                    cursor: pointer;

                    &:hover {
                        box-shadow: 0px 1px 14px rgba(133, 148, 162, 0.2);
                        transition: box-shadow 0.2s ease-in-out,
                        transform 0.2s ease-in-out;
                        transform: translatey(-2px);

                        .box {
                            .tit {
                                color: $brand-color;
                            }
                        }
                    }
                }

            }
        }

        .categoryTitle {
            height: 22px;
            display: flex;
            align-items: flex-end;
            .title{
                color: #000000;
                font-size: 16px;
                margin-right: 10px;
            }
            .en{
                color: #939799;
                font-size: 12px;
            }
        }
    }
}

.tiths {

    background: #E8EEFF;
    border-radius: 2px;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    color: #5D60F6;
    font-size: 16px;
    margin: 20px 0 24px 0;

    &.ac {
        margin-top: 60px;
        background: #FFF9E6;
        color: #FF9900;
    }
}

.notfound {
    background: url("../../../assets/image/center/notresult.png") no-repeat 50% 0;
    background-size: 87px;
    padding-top: 54px !important;
    padding-top: 16px;
    text-align: center;
}
</style>
