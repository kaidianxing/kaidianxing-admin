/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <kdx-modal-frame :value="value" title="全部团成员" :width="1000" footerHide @on-cancel="setValue">
        <div class="group-user">
            <ul>
                <li v-for="(item, index) in data" :key="index">
                    <div class="user-avatar">
                        <img :src="$media(item.avatar)" alt="" @error="replaceImage($event, 'avatar')">
                    </div>
                    <div class="user-name">
                        {{ item.order_no ? item.nickname : '虚拟' }}
                    </div>
                </li>
            </ul>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: "GroupUser",
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            value: false,
        };
    },
    methods: {
        setValue() {
            this.value = !this.value;
        },
    }
};
</script>

<style lang="scss" scoped>
.group-user {
    padding: 40px;
    ul {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-right: -20px;
        margin-bottom: -10px;
        li {
            width: 68px;
            flex-shrink: 0;
            margin-right: 10px;
            margin-bottom: 10px;
            .user-avatar {
                width: 48px;
                height: 48px;
                border-radius: 100%;
                margin: 0 auto;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 100%;
                }
            }
            .user-name {
                width: 68px;
                text-align: center;
                @include font-multiple-omit(2);
            }
        }
    }
}
</style>
