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
    <kdx-modal-frame
        v-model="value"
        title="选择页面类型"
        :width="1000"
        class-name="select-page-type-modal"
        @on-cancel="handleCancel"
        @on-ok="handleOk"
        ok-text="确认选择"
    >
        <div class="select-page-type">
            <div class="type-content">
                <div
                    class="type-item"
                    v-for="(code,index) in codeList"
                    :key="index"
                    :class="{'item-checked': type === code}"
                    @click="selectPage(code)"
                >
                    <i class="iconfont icon-yes1 check-icon" v-if="type === code"></i>
                    <div class="type-container">
                        <div class="type-mask"></div>
                        <div class="image">
                            <img :src="getPageSet(code).src" alt />
                        </div>
                        <div
                            class="radio"
                            :class="{
                                checked: type === code
                            }"
                        >
                            <i class="iconfont page-icon" :class="getPageSet(code).icon"></i>
                            <span class="name">{{getPageSet(code).text}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: 'SelectPageType',
    props: {
        codeList: {
            type: Array,
            default: () => {
                return ['10', '11', '12']
            }
        }
    },
    data() {
        return {
            type: '10',
            value: false
        }
    },
    watch: {
        codeList: {
            handler() {
                this.type = this.codeList[0]
            },
            immediate: true
        }
    },
    methods: {
        setValue() {
            this.value = !this.value
        },
        handleOk() {
            this.$emit('on-change', this.type)
            this.setValue()
        },
        handleCancel() {
            this.setValue()
        },
        selectPage(name) {
            this.type = name
        },
        getPageSet(code) {
            let codeSet = {
                '10': {
                    src: require('@/assets/image/shop/module-index.png'),
                    text: '商城首页',
                    icon: 'icon-zuocedaohang-dianpu'
                },
                '11': {
                    src: require('@/assets/image/shop/module-detail.png'),
                    text: '商品详情',
                    icon: 'icon-yemianleixing-xiangqing'
                },
                '12': {
                    src: require('@/assets/image/shop/module-vip.png'),
                    text: '会员中心',
                    icon: 'icon-zuocedaohang-huiyuan'
                },
                '20': {
                    src: require('@/assets/image/shop/module-index.png'),
                    text: '分销中心'
                }
            }
            return codeSet[code]
        }
    }
}
</script>

<style scoped lang="scss">
.select-page-type {
    padding: 60px 0;
    background-color: #fff;
    .type-content {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        .type-item {
            position: relative;
            margin-right: 30px;
            padding: 9px;
            width: 201px;
            height: 398px;
            border-radius: 2px;
            background-color: #ffffff;
            cursor: pointer;
            overflow: hidden;
            box-sizing: border-box;
            border: 1px solid #e9edef;

            &.item-checked {
                border: 1px solid $brand-color;
            }
            &:hover {
                border: 1px solid $brand-color;
            }
            &:last-child {
                margin-right: 0;
            }

            .check-icon {
                position: absolute;
                bottom: -10px;
                right: -2px;
                z-index: 101;
                font-size: 36px;
                color: $brand-color;
            }

            .type-container {
                overflow: hidden;
                height: 378px;
                position: relative;

                .type-mask {
                    position: absolute;
                    background: linear-gradient(
                        180deg,
                        rgba(255, 255, 255, 0) 52.65%,
                        #ffffff 83.57%
                    );
                    height: 100%;
                    width: 100%;
                    z-index: 99;
                }
            }
            .image {
                img {
                    width: 180px;
                    border-radius: 2px 2px 0 0;
                }
            }
            .radio {
                position: absolute;
                bottom: 12px;
                z-index: 100;
                background-color: #ffffff;
                display: flex;
                flex-direction: column;
                width: 100%;
                text-align: center;
                color: #262b30;

                .page-icon {
                    margin-bottom: 10px;
                    font-size: 24px;
                    line-height: 1;
                    color: #262b30;
                }
                .name {
                    @include font-16-22-bold;
                }
            }
            .checked {
                color: $brand-color;
                .page-icon,
                .name {
                    color: $brand-color;
                }
            }
        }
    }
}
.select-page-type-modal {
    /deep/
        .modal-frame-box
        .ivu-modal
        .ivu-modal-content
        .ivu-modal-body
        > .content {
        max-height: calc(100vh - 110px - 80px);
    }
}
</style>
