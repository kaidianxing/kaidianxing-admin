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
        class="menu-temp"
        title="选择菜单类型"
        :width="910"
        @on-cancel="handleCancel"
        @on-ok="handleOk"
    >
        <div class="menu-content">
            <div class="menu-list"  v-for="item in types" :key="item.id" @click="chooseTemp(item.type)" :class="{
                'on': item.type === checkType
            }">
                <i class="iconfont icon-yes1 choose-icon" v-if="item.type === checkType"/>
                <div class="menu-info">
                    <i class="iconfont menu-icon" :class="item.icon"></i>
                    <span class="menu-type" :class="{
                        'bold': item.type != 0
                    }">{{item.text}}</span>
                </div>
                <img v-if="item.thumb" :src="$utils.media(item.thumb)" class="menu-img" />
            </div>
         </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    props:{
        types: {
            type: Array,
            default:()=>[]
        }
    },
    data() {
        return {
            value: false,
            checkType: null
        }
    },
    methods: {
        chooseTemp(type){
            this.checkType = type
        },
        handleCancel() {
            this.setValue()
        },
        handleOk() {
            if(this.checkType == null){
                return this.$Message.error('请选择菜单类型')
            }
            this.$emit('choose-type',this.checkType)
        },
        setValue() {
            this.value = !this.value
            if(this.value) {
                this.checkType = null
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.menu-temp {
    .menu-content {
        padding: 20px 20px 40px;
        display: flex;
        flex-wrap: wrap;

        .menu-list {
            display: flex;
            flex-direction: column;
            margin-right: 16px;
            margin-bottom: 20px;
            position: relative;
            border-radius: 2px;
            height: 120px;
            width: 277px;
            border: 1px solid #e9edef;
            cursor: pointer;

            &:nth-child(3n) {
                margin-right: 0;
            }

            .choose-icon {
                position: absolute;
                bottom: -6px;
                right: -1px;
                font-size: 24px;
                color: $brand-color;
            }

            &:hover {
                border: 1px solid $brand-color;
            }

            &.on {
                border: 1px solid $brand-color;

                .menu-info {
                   background-color: #FAFDFf;
                }
            }

            .menu-info {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;

                .menu-icon {
                    margin-right: 4px;
                    font-size: 20px;
                    line-height: 22px;

                    &.icon-tianjia {
                        margin-right: 0;
                        font-size: 32px;
                    }
                }

                .menu-type {
                    font-size: 16px;
                    line-height: 22px;

                    &.bold {
                        font-weight: bold;
                    }
                }
            }

            .menu-img {
                border-top: 1px solid #e9edef;
                width: 275px;
            }
        }
    }
}
</style>