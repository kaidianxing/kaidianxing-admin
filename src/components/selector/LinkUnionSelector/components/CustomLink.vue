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
    <div class="custom-link">
        <Form
            :label-width="120"
            @submit.native.prevent
        >
            <RadioGroup
                v-model="custom_type"
                vertical
            >
                <Radio label="link">
                    <FormItem
                        label="链接地址："
                        class="custom-form-item"
                    >
                        <Input
                            v-model="link"
                            enter-button="提取链接"
                            search
                            @on-change="handleChange"
                            @on-search="handleSave"
                            placeholder="请输入"
                        />
                    </FormItem>
                </Radio>

                <Radio label="tel">
                    <FormItem
                        label="拨打电话："
                        class="custom-form-item"
                    >
                        <kdx-rr-input
                            type="text"
                            number
                            v-model="tel"
                            @on-change="handleChange"
                            placeholder="请输入电话"
                        />
                    </FormItem>
                </Radio>
                <Radio label="wappLink" style="height: 75px">
                    <FormItem
                        label="小程序跳转链接："
                        class="custom-form-item wappLink"
                    >
                        <kdx-rr-input
                            type="text"
                            v-model="wappLink"
                            @on-change="handleChange"
                            placeholder="请输入"
                        />
                        <kdx-hint-text>小程序可以跳转公众号文章，或者已经配置的可跳转业务域名的链接，<br />跳转公众号文章时，小程序需要先关联公众号，请在小程序微信后台-设置-关联设置，关联公众号</kdx-hint-text>
                    </FormItem>
                </Radio>
            </RadioGroup>

        </Form>
    </div>
</template>

<script>
export default {
    name: "CustomLink",
    props: {
        current: {
            type: [Object, String],
            required: true
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            name: 'shop',
            search: {
                content: ''
            },
            data: [],
            list: [],
            // 选中项
            selectRow: null,
            loading: false,
            link: '',
            tel: '',
            wappLink: '',
            keyword: ['shop', 'goods', 'member'],
            custom_type: 'link'
        };
    },
    methods: {
        handleChange() {
            if (this.custom_type == 'link') {
                this.$emit('on-change', { url: this.link, name: this.link });
            } else if (this.custom_type == 'tel'){
                this.$emit('on-change',{
                    url: 'tel:'+ this.tel,
                    name: 'tel:'+ this.tel
                })
            } else {
                this.$emit('on-change', { url: this.wappLink, name: this.wappLink });
            }
        },
        handleSave() {
            this.$emit('on-save', { url: this.link, name: this.link });
        }
    },
    watch: {
        value: {
            handler(val) {
                if (val) {
                    this.link = '';
                }
            },
            immediate: true
        }
    }
};
</script>

<style scoped lang="scss">
.custom-link {
    /*padding: 80px 85px 0 85px;*/
    display: flex;
    justify-content: center;
    /deep/ .ivu-form {
        margin-top: 80px;
        .ivu-input {
            width: 550px;
        }

        .ivu-radio-wrapper {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            &:nth-child(1),
            &:nth-child(2) {
                position: relative;
                margin-left: 20px;
                >span {
                    position: absolute;
                    left: 20px;
                }
            }
            &:nth-child(3) {
                >span{
                    margin-top: -45px;
                }
            }
        }

        .ivu-form-item {
            margin-bottom: 0 !important;
        }

        .ivu-form-item-content {
            margin-left: 0 !important;
        }
    }

    .custom-form-item {
        display: flex;
        align-items: center;
        justify-content: center;
        &.wappLink {

            /deep/ .ivu-form-item-label {
                margin-top: -45px;
            }
        }
    }
}
</style>
