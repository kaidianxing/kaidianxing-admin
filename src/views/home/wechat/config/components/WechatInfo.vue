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
    <div class="wechat-info">
        <Form :label-width="120">
            <FormItem :label="`${item.name}：`" :class="{'r-form-item-text': item.type === 'text'}"
                      v-for="item in modelOption" :key="item.key">
                <div class="text" v-if="item.type === 'text'">
                    {{data[item.key]}}
                </div>
                <div class="image" v-else-if="item.type === 'image'">
                    <img :src="$utils.media(data[item.key])" alt="">
                </div>
            </FormItem>
        </Form>
        <div class="footer">
            <Button class="marginR-10" @click="handleClick('edit')">修改当前公众号</Button>
            <Button class="primary-long" @click="handleClick('renew')">绑定其他公众号</Button>
        </div>
    </div>
</template>

<script>
const modelOption = [
    {
        key: 'name',
        type: 'text',
        name: '公众号名称'
    },
    {
        key: 'type_name',
        type: 'text',
        name: '公众号类型'
    },
        {
        key: 'app_id',
        type: 'text',
        name: 'AppID'
    },
        {
        key: 'secret',
        type: 'text',
        name: 'AppSectet'
    },
        {
        key: 'logo',
        type: 'image',
        name: '头像'
    },
        {
        key: 'qr_code',
        type: 'image',
        name: '二维码'
    },
]
export default {
    name: "WechatInfo",
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            modelOption: modelOption,
        };
    },
    methods: {
        handleClick(type) {
            this.$router.push({
                path: '/home/wechat/config/settings',
                query: {
                    type
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
.image {
    width: 70px;
    height: 70px;
    border: 1px solid $border-color;
    border-radius: 2px;
    overflow: hidden;
    >img {
        width: 100%;
        height: 100%;
    }
}
</style>
