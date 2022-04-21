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
    <div class="multi-select">
        <!--单选-->
        <RadioGroup v-model="type" :disabled="isDisabled('0')" @input="handleInput">
            <Radio label="0" border >
                <div class="tit">实体商品</div>
                <div class="desc">物流发货</div>
                <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
            </Radio>
            <Radio label="1" border  :disabled="isDisabled('1')">
                <div class="tit">虚拟商品</div>
                <div class="desc">无需物流</div>
                <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
            </Radio>
            <Radio label="2" border  :disabled="isDisabled('2')">
                <div class="tit">虚拟卡密</div>
                <div class="desc">自动发卡 无需物流</div>
                <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
            </Radio>
        </RadioGroup>
        <kdx-hint-text v-if="!$route.query.id">商品类型在商品保存后无法修改，请谨慎选择。</kdx-hint-text>
    </div>
</template>

<script>
export default {
    name: 'MultiSelect',
    props: {
        value: {
            type: [Number, String],
            required: true,
        },
    },
    data() {
        return {
            type: '',
        }
    },
    computed: {
    },
    watch: {
        value: {
            handler(value) {
                this.type = value
            },
            immediate: true,
            virtualAccount_flag: '0',
        },
    },
    mounted() {
    },
    methods: {
        isDisabled(type) {
            switch (type) {
                case '0':
                case '1':
                    return !!this.$route.query.id;
                case '2':
                    return !!this.$route.query.id || this.virtualAccount_flag === '2' || this.virtualAccount_flag === '3'
            }
        },
        handleInput(val) {
          this.$emit('input', val)
        },
        goMoney() {
          this.$router.push({
              path: '/plugins/center/index'
          })
        }
    },
}
</script>

<style scoped lang="scss">
.multi-select {
    /deep/ .ivu-radio {
        display: none;
    }
    /deep/ .ivu-radio-group {
        display: flex;
        align-items: center;
    }
    .ivu-radio-group-item {
        position: relative;
        box-sizing: border-box;
        padding-left: 0;
        padding-right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 60px;
        font-size: 14px;
        line-height: 20px;
        border-radius: 2px;
        margin-right: 10px;
        &:last-child {
            margin-right: 0;
        }
        .tit {
            font-size: 14px;
            line-height: 20px;
            font-weight: bold;
            color: #262b30;
        }
        .desc {
            font-size: 12px;
            line-height: 16px;
            color: #636669;
            margin-top: 2px;
        }
        .icon {
            position: absolute;
            font-size: 24px;
            bottom: -2px;
            right: 0;
            color: $brand-color;
            display: none;
        }
    }
    .ivu-radio-wrapper-disabled {
        background-color: $background-color;
    }
    .ivu-radio-wrapper-checked {
        background-color: #fff;
        border-width: 2px;
        border-color: $brand-color;
        .tit {
            color: $brand-color;
        }
        .icon {
            display: inline-block;
        }
    }
    .permModel {
        display: none;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 20px;
        background: #F4F6F8;
        cursor: pointer;
        &.is_perModel {
            display: flex;
        }
        p {
            font-size: 12px;
            color: #939799;
            line-height: 20px;
            text-align: center;
            display: flex;
            justify-content: center;
            .iconfont {
                font-size: 12px;
                color: #939799;
                line-height: 20px;
            }
            &:hover {
                color: #2D8CF0;
                .iconfont:hover{
                    color: #2D8CF0;
                }
            }
        }
    }
}
</style>
