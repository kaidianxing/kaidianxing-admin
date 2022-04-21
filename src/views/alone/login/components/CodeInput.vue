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
            maxlength="4"
            placeholder="请输入验证码"
            @input="handleInput"
        />
        <div v-if="!wait" class="code-btn" @click="getCode">获取验证码</div>
        <div v-else class="code-btn disabled">{{ count }}s</div>
    </div>
</template>
<script>
let timer = null
export default {
    props: {
        type: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        before: {
            type: Function,
        }
    },
    data() {
        return {
            count: 60,
            wait: false
        }
    },
    methods: {
        async getCode() {
            if (this.before && typeof this.before === 'function') {
                let flag = await this.before()
                if (flag === false) {
                    return 
                }
            }
            this.count = 60
            this.wait = true
            this.countTime()
        },
        countTime() {
            this.count--
            timer = setInterval(() => {
                this.count--
                if (this.count <= 0) {
                    this.wait = false
                    clearInterval(timer)
                }
            }, 1000);
        },
        handleInput(e) {
            this.$emit('input', e)
        }
    },
    beforeDestroy() {
        clearInterval(timer)
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
        border-radius: 4px;
        width: 100px;
        height: 48px;
        font-size: 14px;
        text-align: center;
        line-height: 48px;
        color: #fff;
        background: #1154FF;
        cursor: pointer;

        &.disabled {
            background: #749BFF;
        }
    }
}
</style>
