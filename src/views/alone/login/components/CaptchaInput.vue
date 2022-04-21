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
    <div class="code-input">
        <Input
            class="form-input"
            :value="value"
            :maxlength="maxlength"
            placeholder="请输入图形验证码"
            @input="handleInput"
        />
        <img :src="imgSrc" class="code-btn" @click="refresh" />
    </div>
</template>
<script>
import { getUrl } from '@/assets/helpers'
export default {
    props: {
        // 获取图形验证码
        config: {
            type: String,
            default: 'account/register/get-capture'
        },
        type: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        maxlength: {
            type: [String, Number],
            default: 4
        }
    },
    data() {
        return {
            imgSrc: '',
        }
    },
    computed: {
        sessionId() {
            return this.$store.state.account.sessionId;
        },
        parseUrl() {
            let src = `${getUrl(this.config)}?Session-Id=${this.sessionId}&Client-Type=50`
            return src
        }
    },
    created() {
        this.refresh()
    },
    methods: {
        refresh() {
            this.imgSrc = `${this.parseUrl}&v=${Date.now()}`
        },
        handleInput(e) {
            this.$emit('input', e)
        }
    }
}
</script>

<style lang="scss" scoped>
.code-input {
    display: flex;
    align-items: center;

    .form-input {
        flex: 1;
    }

    .code-btn {
        margin-left: 10px;
        border: 1px solid #e9edef;
        border-radius: 4px;
        width: 100px;
        height: 48px;
        font-size: 14px;
        text-align: center;
        line-height: 48px;
        background: #fff;
        cursor: pointer;
    }
}
</style>
