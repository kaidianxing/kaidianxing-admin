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
    <kdx-modal-frame v-model="value" :title="id ? '修改标签名称' : '创建标签名称'" :width="500" :loading="loading"
                 @on-cancel="setValue" @on-ok="handleOk">
        <div class="label-modal">
            <Form ref="form" :model="model" :rules="rules" :label-width="120" @submit.native.prevent>
                <FormItem label="标签名称：" prop="name">
                    <Input type="text" v-model="model.name" placeholder="请输入标签名称" @on-enter="handleOk"
                           class="width-250"></Input>
                    <kdx-hint-text>不得超过6个汉字或12个字符</kdx-hint-text>
                </FormItem>
            </Form>
        </div>
    </kdx-modal-frame>
</template>

<script>
import {validCharLen} from "@/assets/helpers/rules";

export default {
    name: "LabelModal",
    props: {
        id: {
            type: [Number, String]
        },
        name: {
            type: [String]
        }
    },
    data() {
        return {
            value: false,
            model: {
                name: ''
            },
            rules: {
                name: [
                    {required: true, message: '标签名称必填'},
                    {
                        validator: (rule, value, callback) => {
                            if (validCharLen(value, 12)) {
                                callback(new Error('不得超过6个汉字或12个字符'))
                            } else {
                                callback();
                            }
                        }
                    }
                ]
            },
            loading: false
        };
    },
    methods: {
        setValue() {
            this.value = !this.value;
            if (this.value) {
                this.$refs['form'].resetFields();
                this.model.name = this.id ? this.name || '' : '';
            }
        },
        handleOk() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    console.log('valid', valid)
                    let params = {
                        name: this.model.name
                    };
                    if (this.id) {
                        params.wechat_tag_id = this.id;
                        this.saveLabel(params);
                    } else {
                        this.saveLabel(params);
                    }
                }
            });
        },
        saveLabel(params) {
            this.loading = true;
            this.$api.homeApi.createWechatFansLabel(params).then(res => {
                if (res.error === 0) {
                    if (this.id) {
                        this.$Message.success('标签编辑成功');
                    } else {
                        this.$Message.success('标签添加成功');
                    }
                    this.setValue();
                    this.$emit('on-refresh');
                }
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style scoped lang="scss">
.label-modal {
    padding: 30px 20px 0 20px;
}
</style>
