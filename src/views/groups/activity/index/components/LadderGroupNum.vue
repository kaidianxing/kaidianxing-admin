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
    <div class="ladder-group-num">
        <div class="header">
            <div class="name">
                阶梯
            </div>
            <div class="group-num">
                拼团人数
            </div>
            <div class="btn-del"></div>
        </div>
        <div class="content">
            <Form ref="form" :model="model" :rules="rules" @submit.native.prevent>
                <div class="content-item" v-for="(item, index) in model.list" :key="index">
                    <div class="name">
                        第 {{index+1}} 阶梯
                    </div>
                    <div class="group-num">
                        <FormItem :prop="`list.${index}.num`" :rules="rules.num">
                            <kdx-rr-input placeholder="请输入" class="width-160" :value="item.num" number
                                      :fixed="0" :min-value="1" :max-value="100" :disabled="isDisabled" @on-change="changeNum(index, $event)">
                                <span slot="append">人</span>
                            </kdx-rr-input>
                        </FormItem>
                    </div>
                    <div class="btn-del">
                        <Button type="text" @click="handleDelete" v-show="index !== 0 && model.list.length == index+1" :disabled="isDisabled">删除</Button>
                    </div>
                </div>
            </Form>
        </div>
        <div class="add" v-if="model.list.length < 3">
            <Button type="text" @click="handleAdd" :disabled="isDisabled">
                +添加拼团阶梯( {{model.list.length}} / 3)
            </Button>
        </div>
    </div>
</template>

<script>
export default {
    name: "LadderGroupNum",
    props: {
        isDisabled: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default: () => [
                {
                    num: 2
                }
            ]
        }
    },
    data() {
        return {
            model: {
                list: []
            },
            list: [],
            item: {},
            rules: {
                num: [
                    {
                        validator: (rule, value, callback) => {
                            let index = rule.field.split('.')[1];
                            if (!value) {
                                callback(new Error('拼团人数不能为空'));
                            } else {
                                value = parseInt(value);
                                if (index >0) {
                                    let prevNum = this.model.list[index-1].num,
                                    nextNum = this.model.list?.[index+1]?.num;
                                    if (prevNum && prevNum >= value) {
                                        callback('要大于上一阶梯人数');
                                    } else if (nextNum && nextNum <= value) {
                                        callback('要比下一阶梯的小')
                                    }
                                }
                                callback();
                            }
                        }
                    }
                ]
            }
        };
    },
    mounted() {
        this.model.list = this.data?.length ?  this.data : [{num: 2}];
    },
    watch: {
        // data: {
        //     handler(val) {
        //         this.list = val;
        //         this.$emit('update:data', val);
        //     },
        //     deep: true
        // }
    },
    methods: {
        handleAdd() {
            this.model.list.push({
                num: ''
            })
            this.updateData();
        },
        changeNum(index, e) {
            this.model.list[index].num = e.target.value;
            this.updateData();
        },
        handleDelete() {
            this.model.list.splice(this.model.list.length -1, 1);
           this.updateData();
        },
        updateData() {
            this.$emit('update:data', this.model.list);
        },
        validateForm() {
            return new Promise((resolve, reject) => {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        resolve();
                    } else {
                        reject();
                    }
                })
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.ladder-group-num {
    border: 1px solid $border-color;
    border-radius: 2px;
    width: 344px;
    .header {
        display: flex;
        align-items: center;
        background-color: $background-color;
        >div {
            @include font-14-20-bold;
            color: $text-first;
            padding-top: 10px;
            padding-bottom: 10px;
        }
    }
    .content {
        .content-item {
            display: flex;
            align-items: center;
            border-top: 1px solid $border-color;
            >div {
                padding-top: 10px;
                padding-bottom: 10px;
            }
            .name {
                line-height: 32px;
                @include font-14-20;
                color: $text-first;
            }
        }
    }
    .name {
        width: 32%;
        box-sizing: border-box;
        padding-left: 20px;
    }
    .group-num {
        width: 160px;
        flex-shrink: 0;
        .ivu-form-item {
            margin-bottom: 0;
        }
    }
    .btn-del {
        text-align: center;
        flex: 1;
    }
    .add {
        border-top: 1px solid $border-color;
        padding: 10px 20px;
        text-align: center;
    }
}
</style>
